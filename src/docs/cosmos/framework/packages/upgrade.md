# XiHan.Framework.Upgrade

> 升级引擎：版本存储、迁移执行、分布式锁、启动自动检查。

- **NuGet**：`XiHan.Framework.Upgrade`
- **模块类**：`XiHanUpgradeModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Upgrade 是分布式安全升级的底层引擎与流程编排。它把「检测版本 → 抢分布式锁 → 进维护模式 → 按序执行迁移脚本 → 回写版本 → （可选）替换文件/滚动重启」这一整套升级流程抽象成统一编排，并对每个环节留下可插拔扩展点。它只提供基础能力与抽象，具体的数据库存储、锁实现、迁移执行由业务侧模块提供实现。

## 何时使用

- 应用启动或运维时，需要判断当前应用/数据库版本是否落后并自动升级。
- 多节点部署下，需要用分布式锁保证同一时刻只有一个节点执行升级。
- 按语义化版本发现、排序并幂等执行 SQL 迁移脚本，避免重复执行。
- 升级期间需要维护模式、程序文件替换、滚动重启等运维动作的统一编排。

## 安装

```bash
dotnet add package XiHan.Framework.Upgrade
```

## 启用

```csharp
[DependsOn(typeof(XiHanUpgradeModule))]
public class MyModule : XiHanModule { }
```

模块会读取配置节 `XiHan:Upgrade`，并为各扩展点注册默认实现（`TryAdd`，可被业务侧替换）。默认实现中版本存储与锁均为内存版（`InMemoryUpgradeVersionStore` / `InMemoryUpgradeLockProvider`），生产环境通常需要业务侧替换为持久化 / 分布式实现。

## 核心能力

- **版本存储与状态管理**：`IUpgradeVersionStore` 负责建表、获取或创建版本记录、写升级中/完成/失败状态、追加并去重迁移历史。
- **迁移执行**：`UpgradeEngine` 按语义化版本分组排序脚本，逐条幂等执行（已有历史则跳过），通过 `IUpgradeMigrationExecutor` 执行 SQL 并保证事务。
- **分布式锁**：`IUpgradeLockProvider` 抢占带过期时间的资源锁，`IUpgradeLockToken`（`IAsyncDisposable`）负责释放，确保集群内单节点升级。
- **启动自动检查**：`XiHanUpgradeModule` 在 `OnPostApplicationInitializationAsync` 中，当 `EnableAutoCheckOnStartup=true` 时调用 `IUpgradeStatusService.EnsureInitializedAsync` 初始化。
- **语义化版本比较**：`SemanticVersion` 提供 major/minor/patch 解析与比较，用于强制升级判定与脚本排序。
- **主节点 / 多租户编排**：可配置仅主节点执行升级，并支持多租户隔离逐租户升级。
- **运维扩展**：维护模式、程序文件替换、滚动重启均为可插拔扩展点（默认提供空实现）。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanUpgradeModule` | 升级模块，注册服务并在启动后触发自动检查 |
| `IUpgradeEngine` / `UpgradeEngine` | 升级引擎，编排检测、锁、迁移、回写全流程 |
| `IUpgradeCoordinator` | 升级协调器，后台启动升级 |
| `IUpgradeStatusService` | 升级状态服务，初始化与查询版本快照/状态 |
| `IUpgradeVersionStore` | 版本与升级状态存储、迁移历史 |
| `IUpgradeMigrationExecutor` | 迁移脚本执行器（内部保证事务） |
| `IUpgradeLockProvider` / `IUpgradeLockToken` | 分布式锁提供者与锁令牌 |
| `IUpgradeScriptProvider` | 迁移脚本发现来源（默认 `FileSystemUpgradeScriptProvider`） |
| `SemanticVersion` | 语义化版本解析与比较 |
| `XiHanUpgradeOptions` | 升级选项（配置节 `XiHan:Upgrade`） |
| `UpgradeStatus` | 升级状态枚举（Normal/Upgrading/Completed/Failed） |

## 依赖模块

- [XiHan.Framework.Core](./core) — 模块化生命周期与依赖注入基础。
- [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions) — 多租户抽象，支撑逐租户隔离升级。

## 相关模块

- [XiHan.Framework.Data](./data) — 数据访问层，业务侧通常在此实现版本存储与迁移执行。
- [XiHan.Framework.Timing](./timing) — 时间处理，升级历史与状态记录常用。
