# 系统架构

XiHan.BasicApp 是一套基于 [XiHan.Framework](../framework/index) 构建的多租户中后台应用，采用前后端分离。后端按**框架层 → BasicApp 基座层 → 业务模块层 → 主机层**自底向上组织；每个业务模块内部遵循 DDD 分层（Domain / Application / Infrastructure）。所有能力以**模块（`XiHanModule` + `[DependsOn]`）**为装配单元，由框架的模块化引擎按依赖图拓扑排序、逐阶段初始化。

## 分层总览

```text
┌─────────────────────────────────────────────────────────────────────┐
│                      XiHan.BasicApp.WebHost                          │
│      启动入口 Program.cs + 聚合模块 XiHanBasicAppWebHostModule        │
│   [DependsOn] Saas / CodeGeneration / AI / Observability(可观测性)     │
│   健康检查 / MCP Server / Telegram Webhook / 健康端点                  │
├──────────────────┬──────────────────────┬───────────────────────────┤
│  BasicApp.Saas   │ BasicApp.CodeGeneration│      BasicApp.AI          │
│  身份/权限/租户/  │  数据源/表结构/模板/    │  Provider 库化管理 /       │
│  消息/文件/日志…  │  全栈代码生成           │  知识库 RAG / 提示词库     │
├──────────────────┴──────────────────────┴───────────────────────────┤
│                      XiHan.BasicApp.Web.Core                         │
│   Web 接线：动态 API / Scalar 文档 / SignalR / 网关灰度 / 演示环境中间件  │
├─────────────────────────────────────────────────────────────────────┤
│                       XiHan.BasicApp.Core                           │
│   基座抽象：实体/DTO 基类（多租户审计）、查询服务标记接口、聚合框架能力模块  │
├─────────────────────────────────────────────────────────────────────┤
│                          XiHan.Framework.*                          │
│  认证 / 授权 / 数据(SqlSugar) / 缓存 / 事件总线 / 多租户 / AI / Bot / …  │
└─────────────────────────────────────────────────────────────────────┘
```

| 项目 | 层 | 职责 |
| --- | --- | --- |
| `XiHan.BasicApp.Core` | 基座 | 聚合全部框架能力模块（`[DependsOn]` 36 个 `XiHan*Module`）；提供 BasicApp 实体/DTO 基类与查询服务标记接口 |
| `XiHan.BasicApp.Web.Core` | Web 基座 | 聚合框架 Web 能力（`WebApi`/`WebDocs`/`WebRealTime`/`WebGateway`）；注册演示环境中间件与选项 |
| `XiHan.BasicApp.Saas` | 业务模块 | 核心业务：身份/角色/权限/菜单/部门/岗位/租户/版本/配置/字典/文件/消息/日志/任务/审批/OAuth/聊天 |
| `XiHan.BasicApp.CodeGeneration` | 业务模块 | 代码生成：数据源管理 / 表结构导入 / 模板配置 / 全栈生成 / 动态运行时 |
| `XiHan.BasicApp.AI` | 业务模块 | AI Provider 库化管理（`SysAiProvider`）/ 知识库 RAG（Qdrant 向量库）/ 提示词库（`SysAiPrompt`）/ AI 技能 |
| `XiHan.BasicApp.WebHost` | 主机 | 启动入口，聚合三个业务模块 + 可观测性模块；健康检查、MCP Server、Telegram Webhook、`/health` 端点、OpenTelemetry 装配（默认关） |

`Saas`、`CodeGeneration`、`AI` 都是**一等业务模块**，各自独立成项目、经 `[DependsOn]` 挂到 `WebHost`。这也是新增一个大功能域时的推荐范式：**新建独立模块项目，而非往 `Saas` 里塞切片**。CodeGeneration 与 AI 都 `[DependsOn(typeof(XiHanBasicAppSaasModule))]`，从而复用 Saas 的 RBAC 表、`SaasRepository`、Data Protection 密文前缀等基础设施。

> 三个业务模块彼此不直接依赖，均以 Saas 为共享基座。AI 模块是继 Saas / CodeGeneration 之后新增的第三个一等模块（Provider 库化管理 + 知识库 RAG）。

## 目录结构

```text
XiHan.BasicApp/
├── backend/                 # 后端（.NET）
│   ├── src/
│   │   ├── framework/       #   Core / Web.Core 基座
│   │   ├── modules/         #   Saas、CodeGeneration、AI 三个业务模块
│   │   └── main/            #   WebHost 启动入口
│   ├── props/               #   共享 MSBuild 属性（含 online.props 线上 NuGet 版本）
│   ├── scripts/             #   部署与运维脚本
│   └── test/                #   测试项目
├── frontend/                # 前端（Vue 3 + Naive UI）
│   ├── src/                 #   应用源码（api / app / router / styles / types / views）
│   └── packages/            #   内部包（含 locales 语言包）
└── assets/                  # README 资源
```

## 启动与模块聚合

启动逻辑集中在 `main/XiHan.BasicApp.WebHost`：

- **`Program.cs`**：`WebApplication.CreateBuilder(args)` → 读 `Hosting:Urls` 配置监听地址 → `builder.AddApplicationAsync<XiHanBasicAppWebHostModule>()`（框架据模块依赖图完成服务注册）→ `app.InitializeApplicationAsync()`（按阶段执行各模块初始化）→ `app.RunAsync()`。全程 `try/catch/finally` 包裹并接 Serilog 日志。
- **`XiHanBasicAppWebHostModule`**：依赖图的根模块。`[DependsOn]` 列三个业务模块 + `XiHanObservabilityModule`（可观测性）——三个业务模块之外的框架能力经 `Saas → Web.Core → Core → XiHan.Framework.*` 一路传递，无需在此重复声明。它额外负责：
  - **健康检查**：`AddHealthChecks().AddCheck<DatabaseHealthCheck>("database").AddCheck<RedisHealthCheck>("redis")`；`/health` 端点匿名暴露，只回总状态 + 各检查项名（不外泄连接串/异常）。
  - **MCP Server**（可选）：读 `XiHanMcpOptions`，启用且配了密钥时把 AI 技能暴露为 MCP tools，端点由 `McpApiKeyEndpointFilter` 按应用管理 key 守门（fail-closed）。
  - **Telegram Webhook**：在 `OnPreApplicationInitialization` 注册 `UseTelegramBotWebhook()`，位于鉴权中间件**之前**，自带 `secret_token` 强校验。
  - **可观测性**（`XiHanObservabilityModule`）：由 `XiHan:Observability` 配置节门控，`Enabled` 默认 `false`（装配即孤儿、零运行时开销）；开启后经 `AddOpenTelemetry` 装配链路追踪（W3C Activity，`XiHanTraceIdMiddleware`/`HttpTraceIdProvider` 优先取其 32-hex TraceId，与日志/审计/事件总线统一同源）、可选指标与日志导出，支持 `OtlpEndpoint`（如 Jaeger/Tempo）与控制台导出器、`SamplingRatio` 采样率。

框架的模块生命周期提供多个钩子，BasicApp 各模块按需重写：`PreConfigureServices` / `ConfigureServices`（服务注册）、`OnPreApplicationInitialization`（管道前段，如中间件）、`OnApplicationInitialization`（端点映射）、`OnPostApplicationInitialization`（全部就绪后，如任务同步）。

**依赖聚合链**（读源码得）：

- `XiHanBasicAppCoreModule` → `[DependsOn]` 36 个框架模块：`XiHanAuthenticationModule`、`XiHanAuthorizationModule`、`XiHanDataModule`、`XiHanCachingModule`、`XiHanEventBusModule`、`XiHanMultiTenancyModule`、`XiHanUowModule`、`XiHanAIModule`、`XiHanBotModule`（+ Email/Sms/Telegram/DingTalk/Lark/WeCom 六子包）、`XiHanTasksModule`、`XiHanObjectStorageModule`、`XiHanLocalizationModule`、`XiHanMessagingModule`…（详见 [框架模块清单](../framework/packages/index)）。
- `XiHanBasicAppWebCoreModule` → `[DependsOn]` `XiHanBasicAppCoreModule`、`XiHanWebCoreModule`、`XiHanWebApiModule`、`XiHanWebDocsModule`、`XiHanWebRealTimeModule`、`XiHanWebGatewayModule`。

## 业务模块内部 DDD 分层

三个业务模块内部统一分为 **Domain / Application / Infrastructure** 三层，职责一致：

| 层 | 目录（以 Saas 为例） | 职责 |
| --- | --- | --- |
| **Domain** | `Domain/Entities`、`Domain/DomainServices`、`Domain/Enums`、`Domain/Events`、`Domain/Permissions`、`Domain/Repositories`、`Domain/Specifications`、`Domain/ValueObjects` | 实体与聚合根、领域服务（业务规则）、领域事件、权限码定义、仓储接口 |
| **Application** | `Application/AppServices`、`Application/QueryServices`、`Application/Dtos`、`Application/Mappers`、`Application/Caching`、`Application/EventHandlers`、`Application/Pages`、`Application/Exporting` | 应用服务（写侧命令，经 `[DynamicApi]` 暴露）、查询服务（读侧）、DTO 与映射器、分布式缓存与失效器、事件处理器、菜单单一事实源 `PageRegistry` |
| **Infrastructure** | `Infrastructure/Repositories`、`Infrastructure/Seeders`、`Infrastructure/Auth`、`Infrastructure/Messaging`、`Infrastructure/Logging`、`Infrastructure/Security`、`Infrastructure/MultiTenancy`、`Infrastructure/Tasks`、`Infrastructure/OAuth` | 仓储实现、种子数据、密钥保护器、存储/消息/日志适配、任务调度存储 |

**CQRS 落地**：写侧走 `*AppService`（`[DynamicApi]` + `[UnitOfWork]` + `[PermissionAuthorize]`）调用领域服务改状态；读侧走 `*QueryService`（实现基座层 `IQueryService` 标记接口）直接投影，多数带分布式缓存。例如 Saas 的 `IAuthorizationSnapshotQueryService`、`IMenuRouteQueryService`、`ISaasConfigValueQueryService`。

**各模块的接线**集中在自己的 `Extensions/ServiceCollectionExtensions.cs`，在 `Module.ConfigureServices` 里被调用。以 Saas 为例：`AddSaasDataSeeders`（系统基线种子）、`AddSaasDemoDataSeeders`（演示种子）、`AddSaasDomainServices`、`AddSaasApplicationServices`、`AddSaasEventHandlers`、`AddSaasLogWriters`、`AddSaasAuthStores`、`AddSaasMessageSenders`、`AddSaasJobInfrastructure`、`AddSaasExportInfrastructure`。

> **DI 约定要点**（写扩展时务必遵守，见源码注释）：
> - 领域服务接口**未携带 DI 标记接口**（`IScopedDependency`/`IDomainService`），框架不自动注册，必须在 `AddXxxDomainServices` 里**显式登记**；仓储（`SaasRepository → IScopedDependency`）与应用/查询服务（`IApplicationService` → 瞬时）由框架约定自动注册。
> - 覆盖框架默认实现（如 `IPermissionChecker`、`IUserStore`、`IJobStore`、`IAiProviderConfigStore`、各 Bot `*ConfigStore`）必须用 **`services.Replace(...)`**：框架模块用 `TryAdd` 先注册，`TryAdd` 会被静默忽略、导致 DB 实现永不生效。
> - 本地事件处理器须**显式加入** `XiHanLocalEventBusOptions.Handlers`（`AddSaasLocalEventHandler<T>` 封装），裸 `AddTransient` 具体类不会被订阅。

### 三个模块的差异

- **Saas**（最重）：额外重写 `OnPostApplicationInitialization`，扫描声明式任务并把数据库中活跃的 `SysTask` 同步到调度器（含崩溃残留 Running 状态复位）；`OnApplicationInitialization` 里映射两个 SignalR Hub（`BasicAppNotificationHub`/`BasicAppChatHub`）与 OAuth 端点（`/api/OAuth/*` 第三方登录 + `/connect/*` 授权服务端）。
- **CodeGeneration**：注册代码生成引擎（`ITemplateRenderer` = Scriban、类型映射、DbFirst 元数据扫描 `IDatabaseSchemaImporter`、生成编排 `ICodeGenerationEngine`、打包 `ZipArtifactPackager`）。
- **AI**：坐落在框架薄层 `XiHan.Framework.AI` 之上。Provider 段给库化管理（`SysAiProvider` 实体 + 加密 `ApiKey` + CRUD + `Replace` 覆盖框架默认配置源 `IAiProviderConfigStore`）；RAG 段给知识库（`AddXiHanRAG` 默认切片/摄取/检索 + `AddQdrantVectorStore` 向量库连接器，连接参数取 `XiHan:AI:Rag` 节）；提示词段给提示词库（`SysAiPrompt` 实体 + CRUD + `Replace` 覆盖框架默认 `IAiPromptStore`）；技能段把 `KnowledgeRetrieveSkill` 注册为 `IAiSkill`，被框架技能注册表收纳，进而暴露为对话工具 / MCP tools。写侧改动后调用 `IAiChatClientResolver.Invalidate()` / `IAiEmbeddingGeneratorResolver.Invalidate()` 实现配置热切换。

## 动态 API 与全局约定

BasicApp 用 [XiHan.Framework 的动态 API](../framework/concepts/dynamic-api)：**应用服务经 `[DynamicApi]` 直接暴露为 REST 接口，没有 Controller 样板**，Scalar 文档自动生成。约定如下（均以源码为准）：

- **暴露方式**：应用服务基类打类级 `[Authorize]` + `[DynamicApi(Group=..., GroupName=..., Tag=...)]`，如 AI 的 `AiApplicationService`（分组 `BasicApp.AI`）、Saas 的服务（分组 `BasicApp.Saas`）。具体服务继承基类即自动成为 HTTP API。
- **路由剥离动词**：默认从方法名剥离动词前缀生成路由（`GetXxx`/`CreateXxx`/`UpdateXxx`/`DeleteXxx` → 资源路由 + 对应 HTTP 谓词）。
- **分页统一走 POST**：每个分页方法显式标 `[HttpPost]`，前端把整个查询对象作 body（`conditions` / `filters` / `sorts`）。新增分页方法须手动补 `[HttpPost]`。
- **响应封装**：统一 `` `ApiResponse` `` / `` `ApiResponse<T>` ``；国际化时响应过滤器会覆盖 `Data`（前端优先读 `Data`）。演示环境中间件在拦截写请求时也返回 `ApiResponse.Forbidden()`。
- **工作单元与鉴权**：写方法标 `[UnitOfWork(true)]`（提交后触发缓存失效、发件箱入队等 UoW-完成后动作）与 `[PermissionAuthorize(权限码)]`（细粒度门控）。
- **国际化 / 时区头**：前端发 `X-Language`（文化）与 `X-Timezone`（时区）头；后端按头本地化，并把 UTC 按该时区换算输出（存储仍 UTC）。详见 [后端国际化](./features) 与时区约定。

## 请求生命周期

请求进来后经过框架 [Web.Api 的中间件管道](../framework/concepts/lifecycle)：

```text
请求 → TraceId → 请求文化(X-Language) → 认证 → 租户解析 → 授权 → 端点(动态 API 方法)
```

因此每个请求天然带上**租户上下文**与**权限判定**。BasicApp 在此管道上补了两处应用级钩子：

- **演示环境中间件**（`DemoEnvironmentMiddleware`，`Web.Core`）：`XiHan:Demo:Enabled=true` 时拦截 `POST/PUT/PATCH/DELETE`（白名单 `AllowedPaths` 除外），返回 403 + `ApiResponse.Forbidden()`。
- **Telegram Webhook 中间件**（`WebHost`）：位于鉴权**之前**，只匹配 Webhook 路径并强校验 `secret_token`，其余请求原样放行。

**鉴权用授权快照**：Saas 用 `services.Replace(IPermissionChecker → SaasPermissionChecker)` 把请求期鉴权改读**授权快照**（`SaasAuthorizationSnapshotCacheItem`），使授权变更无需重新登录即生效。

## 菜单单一事实源

菜单是后端驱动的。`modules/XiHan.BasicApp.Saas/Application/Pages/PageRegistry.cs` 是**单一事实源**，用 `PageDescriptor`（页面/目录）与 `ButtonDescriptor`（页面内操作按钮）两个 record 集中登记：**页面码 / 标题 / i18n 键 / 菜单类型 / 路由路径 / 路由名 / 前端组件路径 / 父页面码 / 权限码 / 图标 / 排序 / 重定向 / 外链**等全部字段。

关键约定（写在 `PageRegistry` 注释里）：

- `Component` 通常 = `Path` 去前导斜杠后追加 `/index`（前端 `src/views` 与路由一一对应）；`_core` 页面例外（如个人中心 `_core/profile/index`），由前端 `dynamic.ts` 的 `coreComponentMap` 解析，无需落盘 `src/views`。
- `I18nKey` 命名为 `menu.{Code 中 . 与 - 替换为 _}`，双语文案在前端 `packages/locales/langs/{lang}/menu.ts` 维护。
- 纯静态公共页（`/about` 等）由前端 `router/routes.ts` 持有，不登记本表。
- **权限种子前移**：目录/菜单/按钮的 `PermissionCode` 直接引用 `SaasPermissionCodes.*`（权限码单一事实源），建菜单即绑权限。

`Infrastructure/Seeders/System/SaasMenuSeeder.cs`（`Order=25`）从 `PageRegistry.All + Buttons` 映射出菜单种子定义，在平台租户（`TenantId=0`）下：先按权限码查 `SysPermission`（缺失则跳过并告警，fail-closed），再按父子顺序解析 `ParentId` 逐条 upsert 到 `SysMenu`。新增/改菜单**只改 `PageRegistry`**，种子随之生效。

其他两个模块也各自登记菜单：CodeGeneration 的 `SysMenuSeeder`（Order 103）与 AI 的 `SysMenuSeeder`/`KnowledgeMenuSeeder`/`PromptMenuSeeder`（Order 203/207/211，分别对应 Provider/知识库/提示词库三段），链内均遵循「操作 → 资源 → 权限 → 菜单 → 角色授权」的顺序，建即绑权限码。

## 全链路分布式缓存与精准失效

热点读路径全部走 Redis 分布式缓存，写路径**精准失效**。Saas 的缓存条目集中在 `Application/Caching`，键名常量在 `SaasCacheNames`（如 `basicapp:saas:auth:snapshot`、`basicapp:saas:navigation:routes`、`basicapp:saas:config:value`、`basicapp:saas:configuration:dict-tree`、`basicapp:saas:tenancy:edition-gate` 等）。

缓存条目（部分）：

| 缓存 | 用途 |
| --- | --- |
| `SaasAuthorizationSnapshotCacheItem` | 用户授权快照（请求期鉴权热路径，替代内存版 checker） |
| `SaasMenuRoutesCacheItem` | 菜单路由（前端动态路由渲染） |
| `SaasConfigValueCacheItem` | 系统配置值 |
| `SaasDictItemTreeCacheItem` | 字典项树（下拉/选项高频读） |
| `SaasEditionGateCacheItem` | 租户版本权限白名单（鉴权快照） |
| `SaasMessageTemplateCacheItem` | 消息模板（发送链路高频读） |
| `SaasDepartmentTreeCacheItem` / `SaasUserSettingCacheItem` / `Saas*SelectCacheItem` | 部门树 / 用户偏好 / 各类下拉选择项 |

**失效器** `ISaasCacheInvalidator` / `SaasCacheInvalidator` 提供精准的按域失效方法（`InvalidateConfigurationAsync` / `InvalidateAuthorizationAsync` / `InvalidateNavigationAsync` / `InvalidateDictionaryAsync` / `InvalidateEditionGateAsync` …），底层用 `RemoveByPatternAsync(..., considerUow: true)`——**在工作单元提交后**才真正清缓存，避免读到未提交脏数据。写侧 `*AppService` 在改完数据后调用对应失效方法，如 `ConfigAppService` 在增删改后调 `InvalidateConfigurationAsync`。

## 网关与灰度发布

Web 网关能力来自框架 `XiHanWebGatewayModule`（经 `Web.Core` 挂载），配置在 `appsettings` 的 `Gateway` / `GrayRouting` 节：

- `Gateway`：`EnableGrayRouting`、`EnableRequestTracing`、`EnableRateLimiting`、`EnableCircuitBreaker`、`RequestTimeoutSeconds`、`AllowedOrigins`、`GlobalHeaders` 等开关。
- `GrayRouting.Rules`：灰度规则列表（按百分比/条件把流量导向 `TargetVersion`，带 `Priority`/`IsEnabled`）。

灰度是框架层通用能力，BasicApp 只在配置里启用/编排，不写业务代码。

## 种子数据：系统基线 vs 演示

种子分两类，各模块用互不交叠的 `Order` 段（Saas 10–37、CodeGeneration 100–105、AI 200–212，其中 200–204 为 Provider、205–208 为知识库 RAG、209–212 为提示词库）：

- **系统基线**（`AddSaasDataSeeders` 等）：**始终播种**。含身份、权限、租户版本、配置、字典、菜单、消息模板、OAuth 应用、通知、存储配置、任务等。是应用可运行的最小骨架。
- **演示数据**（`AddSaasDemoDataSeeders`）：由配置开关 `Saas:Seed:EnableDemoData` 控制（缺省/`true` 播种，显式 `false` 整体跳过）。含示例组织、演示账号、演示业务租户。

> **部署即重建库**：不做向后兼容/迁移旧数据的兜底代码，部署时重建数据库、前向单一格式，遇异常态 fail-closed。RAG 上线还需前置部署 Qdrant 向量库。

## 前后端协作数据流

```text
Vue 页面 (Schema 驱动列表页)
   │  发起请求（分页走 POST，body 带 conditions/filters/sorts；附 X-Language / X-Timezone 头）
   ▼
动态 API（*AppService 方法，[DynamicApi] 暴露，无 Controller）
   │  框架中间件管道：TraceId → 请求文化 → 认证 → 租户解析 → 授权(授权快照)
   ▼
应用服务(写侧命令 [UnitOfWork]) / 查询服务(读侧投影)
   │  → 领域服务(业务规则) → 仓储(SqlSugar) → PostgreSQL
   │  读侧命中分布式缓存（授权快照 / 菜单 / 配置 / 字典 / 版本门控…）
   ▼
UoW 提交后：精准失效对应缓存 + 后台异步（发件箱/导出经 IRedisDelayQueue 拉取消费）
   ▲
   └─ 响应统一 ApiResponse；本地化时响应过滤器覆盖 Data（前端优先读 Data）；时间按 X-Timezone 换算输出
```

前端是 Vue 3 + TypeScript + Naive UI 的中后台应用，几个关键设计：**Schema 驱动列表页**（搜索/表格/导出由一份 Schema 生成，内置列设置、高级搜索、个人视图、树形模式）；**三级权限过滤**（页面/字段/操作按权限码过滤，字段级脱敏 FLS）；状态管理 Pinia、国际化 vue-i18n、样式 Tailwind CSS 4。详见 [前端结构](./frontend)。

## 下一步

- [权限模型](./permissions)：RBAC + ABAC + 数据范围 + 字段级脱敏的落地细节
- [多租户](./multi-tenancy)：字段级隔离、平台租户 `TenantId=0`、租户库隔离与版本门控
- [功能清单](./features)：各模块具体能力
- [AI 模块](./ai)：Provider 库化管理与知识库 RAG
- [代码生成](./code-generation)：数据源/表结构/模板/全栈生成
- [框架核心概念](../framework/concepts/modularity)：理解底层模块化机制
