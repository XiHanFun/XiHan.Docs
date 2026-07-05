# XiHan.Framework.Tasks

> 定时任务：调度引擎、后台服务、多租户感知。

- **NuGet**：`XiHan.Framework.Tasks`
- **模块类**：`XiHanTasksModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Tasks 是框架的任务库，提供两类能力：一是**定时任务调度**（按 Cron、固定间隔或延迟触发一段业务逻辑），二是**后台常驻服务基类**（不断从队列/消息源拉取任务并并发处理）。它内置了一套自研的调度引擎与执行管道，任务执行时会自动带上当前租户上下文，天然适配多租户场景。

## 何时使用

- 需要按 Cron 表达式、固定时间间隔或一次性延迟运行的定时作业。
- 需要一个常驻后台服务，持续从 Redis/数据库/消息队列拉取并发处理任务。
- 希望任务执行自带日志、超时、锁、重试、指标等横切能力，而不必自己拼装。
- 多租户应用中，希望定时任务在正确的租户上下文里执行。

## 安装

```bash
dotnet add package XiHan.Framework.Tasks
```

## 启用

```csharp
[DependsOn(typeof(XiHanTasksModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanTasks(config)`，从配置节 `XiHan:Tasks:ScheduledJobs`（`XiHanJobOptions.SectionName`）绑定选项，并注册调度器、执行器、中间件与托管服务。

## 核心能力

- **多触发方式调度**：`CompositeJobScheduler` 支持 Cron、Interval（固定间隔）、Delay（一次性延迟）三种触发类型，内部每秒检查一次待触发任务。
- **执行管道 + 中间件**：任务通过 `JobExecutionPipeline` 逐层经过 Logging、Timeout、Lock、Retry、Metrics 等中间件（`IJobMiddleware`），横切能力可插拔、可自定义。
- **后台服务基类**：`XiHanBackgroundServiceBase<T>` 封装并发控制、队列拉取、异常重试、优雅停机与运行统计，子类只需实现「取任务」和「处理任务」两个方法。
- **任务锁**：`CachingJobLockProvider` 复用 Caching 模块的分布式锁（有 Redis 时跨实例、否则进程内回退），防止同一任务并发重入。
- **多租户感知**：调度时解析任务所属租户（参数 / JobInfo / 当前租户），执行时用 `ICurrentTenant.Change(...)` 切换到对应租户上下文再运行。
- **声明式特性**：通过 `[JobSchedule]`、`[JobName]`、`[JobRetry]`、`[JobTimeout]`、`[JobConcurrent]` 等特性描述任务，配合自动发现注册。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IJobScheduler` / `CompositeJobScheduler` | 调度器接口与复合实现，负责注册、暂停/恢复、手动触发、计算下次执行时间 |
| `IJobExecutor` / `JobExecutor` | 任务执行器，负责在租户上下文中运行任务实例 |
| `JobExecutionPipeline` / `IJobMiddleware` | 执行管道与中间件抽象，串联横切逻辑 |
| `IJobWorker` / `IJobContext` | 具体任务的实现契约与执行上下文 |
| `IJobStore` / `InMemoryJobStore` | 任务实例存储抽象与内存实现 |
| `IJobLockProvider` / `CachingJobLockProvider` | 任务锁抽象与基于 Caching 的实现 |
| `XiHanBackgroundServiceBase<T>` | 后台常驻服务基类（并发拉取消费） |
| `XiHanJobBuilder` / `XiHanJobOptions` | 链式配置构建器与调度选项 |

## 依赖模块

- [XiHan.Framework.Caching](./caching) — 任务锁复用其统一的分布式锁（Redis / 进程内自动选择）。
- [XiHan.Framework.MultiTenancy](./multitenancy) 与 [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions) — 任务的租户解析与执行期租户上下文切换。
- [XiHan.Framework.Timing](./timing) — 时间基础设施。

（Cron 解析、重试策略等由框架自身实现，未引入 Quartz/Cronos 等第三方调度库。）

## 相关模块

- [XiHan.Framework.Caching](./caching) — 分布式锁与缓存底座。
- [XiHan.Framework.MultiTenancy](./multitenancy) — 多租户上下文来源。
