# 数据模型与实体约定

本页讲清 BasicApp 的**数据层长什么样**：实体基类怎么选、主键与并发怎么定、审计与软删有哪些列、多租户列的语义、分表规则、索引与命名规范，以及全部数据表的清单。新增实体前先读这页，能省掉大部分返工。

> 数据访问的框架机制（仓储、工作单元、查询过滤器）见 [Data 包文档](../../framework/packages/data)；写路径的租户边界见 [多租户](../multi-tenancy)。

## 实体基类：先选对基类

所有 BasicApp 实体都继承 `XiHan.BasicApp.Core.Entities` 下的基类，它们又各自对应框架的 `SugarMultiTenant*` 系列——**都自带 `TenantId` 列**。

| 基类 | 主键 | 审计列 | 软删 | 用在哪 |
| --- | --- | --- | --- | --- |
| `BasicAppEntity` | 雪花 `long`（应用生成） | 无 | 否 | 极简实体、纯关联表 |
| `BasicAppEntityWithIdentity` | 数据库自增 `long` | 无 | 否 | 需要自增序号的场景 |
| `BasicAppCreationEntity` | 雪花 `long` | 创建三列 | 否 | **日志/流水**等只增不改的表 |
| `BasicAppModificationEntity` | 雪花 `long` | 创建 + 修改 | 否 | 会改但不删的配置类 |
| `BasicAppDeletionEntity` | 雪花 `long` | 创建 + 删除 | 是 | 少见 |
| **`BasicAppFullAuditedEntity`** | 雪花 `long` | 创建 + 修改 + 删除 | **是** | **绝大多数业务实体的默认选择** |
| `BasicAppAggregateRoot` | 雪花 `long` | 全套 | 是 | 聚合根（带领域事件能力） |

选择准则：

- **拿不准就用 `BasicAppFullAuditedEntity`**——业务表几乎都需要「谁建的、谁改的、软删可恢复」。
- **日志、流水、审计类用 `BasicAppCreationEntity`**：它们只增不改不删，带上修改/删除列纯属浪费，而且这类表通常还要**按月分表**。
- 纯多对多关联表（如 `SysUserRole`）通常也是创建型（硬删），见下文的软删约定。

## 列约定

### 主键与并发

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `Basic_Id` | `bigint` | **主键**。注意列名是 `Basic_Id` 而不是 `Id`——手写 SQL / 排查时别找错。默认**非自增**，由应用侧雪花算法生成 |
| `Row_Version` | `bigint` | 乐观并发标识，SqlSugar 的 `IsEnableUpdateVersionValidation` 生效 |

雪花 ID 的参数在配置节 `XiHan:DistributedIds:SnowflakeId`（`WorkerId` / `DataCenterId` / `BaseTime` / 位长）。**多节点部署必须逐节点改 `WorkerId`**，否则会生成重复 ID；`BaseTime` 与位长一经上线不可更改。

::: warning 主键在 API 里是字符串
`long` 经框架的 `LongJsonConverter` 统一序列化成 JSON **字符串**（避免 JavaScript Number 精度溢出）。前端契约里主键类型是 `string`，DTO 字段名是 `basicId`。见 [接口对接指南](../api-guide#json-序列化约定)。
:::

### 审计三件套

| 阶段 | 列 | 备注 |
| --- | --- | --- |
| 创建 | `Created_Time` / `Created_Id` / `Created_By` | `Created_Time` 非空；三列都是 `IsOnlyIgnoreUpdate`（更新时不覆盖） |
| 修改 | `Modified_Time` / `Modified_Id` / `Modified_By` | 可空 |
| 删除 | `Is_Deleted` / `Deleted_Time` / `Deleted_Id` / `Deleted_By` | `Is_Deleted` 非空、默认 `false` |

时间列都是 `DateTimeOffset`，**存储恒为 UTC**，输出时按请求头 `X-Timezone` 换算。这些列由 SqlSugar 的 `DataExecuting` AOP **自动注入**，业务代码不要手动赋值。

::: warning 别对时间列做单列标量投影
`DateTimeOffset` 列不要用 `Select(x => x.CreatedTime)` 这种单列标量投影——值类型的 `ChangeType` 路径会在 `DateTime` → DTO 转换时崩。要整行取实体、走属性绑定。
:::

### 多租户列

`Tenant_Id`（`bigint`，`IsOnlyIgnoreUpdate`）是每个实体都有的列，语义**不是可空的**：

- **平台级/全局记录统一 `TenantId = 0`**（「平台租户」占位），**不得使用 NULL**。
- 业务租户 Id 从 1 开始分配，0 号由平台保留。
- 判定全局记录一律用 `TenantId == 0`；需要 `IsGlobal` 语义时在实体 `Expand` 里做**派生只读属性** `IsGlobal => TenantId == 0`，**不落库**（避免与 `TenantId` 漂移）。
- 合并查询全局 + 私有：`WHERE TenantId IN (0, {currentTenantId})`。
- `TenantId` 由租户上下文自动注入，**禁止业务代码直接操纵**。

读写口径不对称，这点最容易踩：**读共享、写不共享**——全局过滤器放行 `TenantId=0` 的行让租户能读到平台数据，但租户上下文里**禁止改写/删除**非本租户行（含全局行）。维护全局数据的唯一合法入口是平台态（`ICurrentTenant.Change(null)`）。

### 软删与唯一索引

支持软删的实体（`FullAudited` / `AggregateRoot` 等），其**唯一索引（`UX_*`）末列统一附加 `IsDeleted`**，使唯一性只约束未删除行——软删后可以再建同编码记录。

代价要知道：**同一编码至多保留一条软删行**。要第二次软删同编码记录，服务层得先物理清理旧的软删行。

纯创建型（`Creation`）的关联表与日志表是**硬删**、无 `IsDeleted`，唯一索引保持原样。

## 命名与索引规范

| 对象 | 规范 | 示例 |
| --- | --- | --- |
| 表名 | `snake_case`，`Sys_{名}` | `Sys_User_Department` |
| 列名 | `snake_case` | `Created_Time`、`Tenant_Id` |
| `[SugarTable]` 命名参数 | **无空格** | `SugarTable(TableName = "...", TableDescription = "...")` |
| `[SugarColumn]` 命名参数 | **有空格** | `SugarColumn(ColumnName = "...", ColumnDescription = "...")` |
| 时间字段 | 一律 `XxxTime`；过期统一 `ExpirationTime` | `CreatedTime` / `ExpirationTime` |
| 排序字段 | `Sort` | — |
| 缩写 | `OAuth` / `CSharp` 等整体保留 | `SysOAuthApp` |

**审计三件套索引**（强制）：

- 所有具体实体：`IX_{table}_TeId_CrTi`、`IX_{table}_CrId`
- `FullAudited` / `AggregateRoot` 额外：`IX_{table}_TeId_IsDe`
- 日志类分表实体把 `{table}` 换成 `{split_table}`

## 按月分表

日志与流水类实体用 SqlSugar 的分表能力：

```csharp
[SugarTable(TableName = "Sys_Access_Log_{year}{month}{day}", TableDescription = "系统访问日志表"),
 SplitTable(SplitType.Month)]
```

物理表名形如 `Sys_Access_Log_20260801`。当前按月分表的表：

`Sys_Access_Log` · `Sys_OpenApi_Log` · `Sys_Operation_Log` · `Sys_Login_Log` · `Sys_Exception_Log` · `Sys_Diff_Log` · `Sys_Permission_Change_Log` · `Sys_Review_Log` · `Sys_Task_Log` · `Sys_Telegram_Message`

查询分表数据要走 SqlSugar 的分表 API（按时间范围定位物理表），不能当普通表直接查。

## 数据表清单

按域分组的全部业务表（不含日志分表的物理分片）。

### 身份与安全

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_User` | `SysUser` | 用户主体，`Email` 全平台唯一 |
| `Sys_User_Security` | `SysUserSecurity` | 一对一安全扩展：密码哈希、锁定、MFA、多端策略 |
| `Sys_User_Session` | `SysUserSession` | 会话中心（多端控制、撤销） |
| `Sys_User_Setting` | `SysUserSetting` | 用户 UI 偏好（按场景 + key 存 JSON） |
| `Sys_User_Statistics` | `SysUserStatistics` | 用户统计 |
| `Sys_User_Api_Credential` | `SysUserApiCredential` | 开放接口个人凭证（AppKey/AppSecret 哈希） |
| `Sys_External_Login` | `SysExternalLogin` | 第三方身份绑定 |
| `Sys_Password_History` | `SysPasswordHistory` | 历史密码（防重用） |

### 权限与授权

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_Role` / `Sys_Role_Hierarchy` | `SysRole` / `SysRoleHierarchy` | 角色与层级继承（闭包） |
| `Sys_Permission` | `SysPermission` | 权限点 |
| `Sys_Operation` / `Sys_Resource` | `SysOperation` / `SysResource` | 操作字典与资源，**权限由「资源 × 操作」派生** |
| `Sys_Role_Permission` / `Sys_User_Permission` | — | 角色授权 / 用户直授 |
| `Sys_Role_Data_Scope` / `Sys_User_Data_Scope` | — | 自定义数据范围 |
| `Sys_Permission_Condition` | `SysPermissionCondition` | ABAC 属性条件 |
| `Sys_Permission_Delegation` | `SysPermissionDelegation` | 权限委托 |
| `Sys_Permission_Request` | `SysPermissionRequest` | 权限申请 |
| `Sys_Field_Level_Security` | `SysFieldLevelSecurity` | 字段级安全（可读/可编辑/脱敏策略） |
| `Sys_Constraint_Rule` / `Sys_Constraint_Rule_Item` | — | 约束规则引擎（SSD/DSD/互斥/基数…） |
| `Sys_Session_Role` | `SysSessionRole` | 会话角色映射 |

### 组织与租户

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_Department` / `Sys_Department_Hierarchy` | — | 部门树与**闭包表** |
| `Sys_Position` | `SysPosition` | 岗位字典 |
| `Sys_User_Department` | `SysUserDepartment` | 用户多部门归属（主部门、岗位、工号） |
| `Sys_User_Role` | `SysUserRole` | 用户角色（支持生效期） |
| `Sys_Tenant` | `SysTenant` | 租户 |
| `Sys_Tenant_User` | `SysTenantUser` | 租户成员关系 |
| `Sys_Tenant_Edition` / `Sys_Tenant_Edition_Permission` | — | 版本套餐与可用权限白名单 |

### 系统设置

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_Menu` | `SysMenu` | 菜单（`PageRegistry` 的落库形态） |
| `Sys_Dict` / `Sys_Dict_Item` | — | 数据字典 |
| `Sys_Config` | `SysConfig` | 参数配置 |
| `Sys_Numbering_Rule` / `Sys_Numbering_Allocation` | — | 业务编号规则与分配记录 |
| `Sys_Version` | `SysVersion` | 版本管理 |
| `Sys_Migration_History` | `SysMigrationHistory` | 升级迁移历史 |

### 消息与通知

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_Notification` / `Sys_User_Notification` | — | 通知公告与逐用户接收状态 |
| `Sys_User_Notification_Preference` | — | 通知偏好（渠道 × 类型） |
| `Sys_Message_Template` | `SysMessageTemplate` | 消息模板（Scriban） |
| `Sys_Email` / `Sys_Email_Config` | — | 邮件记录与网关配置 |
| `Sys_Sms` / `Sys_Sms_Config` | — | 短信记录与网关配置 |
| `Sys_Bot_Config` | `SysBotConfig` | 钉钉/飞书/企业微信 Webhook 机器人 |
| `Sys_Telegram_Bot` | `SysTelegramBot` | 多实例 Telegram Bot |
| `Sys_Chat_Conversation` / `_Member` / `Sys_Chat_Message` / `_Reaction` | — | 在线聊天 |

### 文件与任务

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_File` / `Sys_File_Storage` | — | 文件与存储位置 |
| `Sys_Storage_Config` | `SysStorageConfig` | 存储后端配置（本地/S3/OSS/COS/MinIO） |
| `Sys_Export_Task` | `SysExportTask` | 异步导出任务 |
| `Sys_Import_History` | `SysImportHistory` | 导入历史 |
| `Sys_Task` | `SysTask` | 定时任务定义 |

### 开放能力与审批

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_OAuth_App` / `Sys_OAuth_Code` / `Sys_OAuth_Token` | — | 作为 OAuth2/OIDC **服务端**的应用、授权码与令牌 |
| `Sys_Review` | `SysReview` | 审批/审查单 |

### 工作流（`XiHan.BasicApp.Workflow` 模块）

| 表 | 实体 | 说明 |
| --- | --- | --- |
| `Sys_Workflow_Definition` | `SysWorkflowDefinition` | 流程定义 |
| `Sys_Workflow_Instance` | `SysWorkflowInstance` | 流程实例 |
| `Sys_Workflow_Node_Instance` | `SysWorkflowNodeInstance` | 节点实例 |
| `Sys_Workflow_Bookmark` | `SysWorkflowBookmark` | 书签（挂起点） |

### 日志（均按月分表）

`Sys_Access_Log`（访问）· `Sys_OpenApi_Log`（开放接口）· `Sys_Operation_Log`（操作）· `Sys_Login_Log`（登录）· `Sys_Exception_Log`（异常）· `Sys_Diff_Log`（数据变更）· `Sys_Permission_Change_Log`（权限变更）· `Sys_Review_Log`（审批）· `Sys_Task_Log`（任务）· `Sys_Telegram_Message`（Telegram 出站审计）

详见 [审计日志](../audit-log)。

## 建表与迁移

- 首次启动由 `DbInitializer` 自动建库、建表、播种（配置节 `XiHan:Data:SqlSugarCore` 的 `EnableDbInitialization` / `EnableTableInitialization` / `EnableDataSeeding`）。
- **`DbInitializer` 表存在就跳过，从不为已有表补列**。给既有实体加字段后部署必报「列不存在」。
- 本项目的策略是**部署即重建数据库、前向单一格式、不写向后兼容代码**。要保数据就自己 `ALTER TABLE`。

## 实体分文件约定

一个实体通常拆成三个文件（`partial`）：

| 文件 | 内容 |
| --- | --- |
| `Domain/Entities/SysXxx.cs` | 主体：`[SugarTable]` + `[SugarIndex]` + 落库字段 |
| `Domain/Entities/Expands/SysXxx.Expand.cs` | **不落库**的派生属性（`[SugarColumn(IsIgnore = true)]`），如 `IsGlobal`、显示名 |
| `Domain/Entities/Aggregates/SysXxx.Aggregate.cs` | 聚合行为（少数实体才有，如 `SysTenant` / `SysConstraintRule`） |

::: tip 生成的代码不焊外键
代码生成器不产出 `Navigate` / `LEFT JOIN` / 显示属性 / 物理外键，跨表关联一律由业务层手写。见 [代码生成](../code-generation)。
:::

## 相关页面

- [后端架构](./backend)：模块装配、DDD 分层、DI 约定
- [缓存与异步](./caching-async)：读路径缓存与写后失效
- [多租户与版本](../multi-tenancy)：隔离策略与写路径边界
- [审计日志](../audit-log)：七类日志与分表
- [Data 包文档](../../framework/packages/data)：仓储、查询过滤器、AOP 的框架实现
