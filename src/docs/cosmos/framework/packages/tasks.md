# XiHan.Framework.Tasks

> 任务库：自研调度引擎（Cron/Interval/Delay）+ 后台常驻服务基类，执行期自动切换租户上下文。

- **NuGet**：`XiHan.Framework.Tasks`
- **模块类**：`XiHanTasksModule`
- **所在层**：基础设施层
- **关键依赖**：仅 .NET 原生 + 框架内部依赖（Caching / MultiTenancy / Timing）。**Cron 解析、重试策略、下次触发时间计算全部自研，未引入 Quartz / Cronos / Hangfire 等第三方调度库。**

## 概述

XiHan.Framework.Tasks 提供两条相互独立的能力线：

1. **定时任务调度（ScheduledJobs）**：以 `CompositeJobScheduler` 为核心的自研调度引擎，支持 Cron 表达式、固定间隔（Interval）、一次性延迟（Delay）三种自动触发方式，外加手动触发（Manual）。任务经过一条可插拔的中间件管道（日志 → 超时 → 锁 → 重试 → 指标）执行，并在正确的租户上下文中运行。
2. **后台常驻服务（BackgroundServices）**：`XiHanBackgroundServiceBase<T>` 抽象基类，封装「循环拉取 → 并发处理 → 异常重试 → 优雅停机 → 运行统计」的通用骨架，子类只需实现「取任务」和「处理任务」两个方法即可拥有一个生产级后台 worker。

两者都在模块启用后自动接入 .NET 托管服务生命周期（`IHostedService` / `BackgroundService`）。

## 何时使用

- 需要按 Cron 表达式、固定时间间隔或一次性延迟运行的定时作业（如每日报表、定时清理、延迟提醒）。
- 需要一个常驻后台服务，持续从 Redis / 数据库 / 消息队列拉取并**并发**处理任务（如发件箱、导出任务消费）。
- 希望任务执行自带日志、超时、分布式锁、重试、指标等横切能力，而不必自己拼装。
- 多租户应用中，希望定时任务在正确的租户上下文里执行（自动 `ICurrentTenant.Change`）。

选型提示：**「周期性/定时触发」用 ScheduledJobs；「持续拉队列消费」用 `XiHanBackgroundServiceBase<T>`。** 两者可在同一应用中并存。

## 安装与启用

```bash
dotnet add package XiHan.Framework.Tasks
```

```csharp
[DependsOn(typeof(XiHanTasksModule))]
public class MyModule : XiHanModule { }
```

`XiHanTasksModule.ConfigureServices` 调用 `AddXiHanTasks(config)`，从配置节 `XiHan:Tasks:ScheduledJobs`（`XiHanJobOptions.SectionName`）绑定选项，并注册（`TryAdd` 语义，均可被业务侧替换）：

- `IJobStore` → `InMemoryJobStore`（任务实例 / 历史的内存存储）
- `IJobLockProvider` → `CachingJobLockProvider`（复用 Caching 的统一分布式锁）
- `IJobScheduler` → `CompositeJobScheduler`（复合调度器）
- `IJobExecutor` → `JobExecutor`（执行器）
- `JobMetricsProvider`、`IJobEventPublisher` → `DefaultJobEventPublisher`

同时按固定顺序注册五个中间件 `IJobMiddleware`：`LoggingMiddleware` → `TimeoutMiddleware` → `LockMiddleware` → `RetryMiddleware` → `MetricsMiddleware`，并注册托管服务 `JobHostedService`（应用启动时自动 `StartAsync` 调度器）。

> 说明：`XiHanBackgroundServiceBase<T>` 及其依赖的 `XiHanBackgroundServiceOptions`、`IDynamicServiceConfig` 属于 BackgroundServices 命名空间，**不由 `AddXiHanTasks` 自动注册**——你的具体后台服务需自行 `services.AddHostedService<T>()` 并按需 `Configure<XiHanBackgroundServiceOptions>(...)`。

## 工作原理

### 调度引擎（CompositeJobScheduler）

- 调度器内部持有 `JobRegistry`（任务登记表）与 `JobTriggerManager`（触发状态：下次触发时间、触发次数、暂停标记、上次触发时间）。
- `StartAsync` 启动后，一个 `Timer` **每 1 秒**回调一次 `CheckAndFireJobs`：遍历所有启用且未暂停的任务，`ShouldFire` 判定是否到点（含截止时间 `EndTime`、重复次数上限 `RepeatCount` 门控），到点则以 `Task.Run` 异步执行。
- 每次触发后 `UpdateNextFireTime` 重算下次时间：
  - `Cron` → `CronScheduler.GetNextFireTime(expr)`（自研 `CronHelper` 解析）
  - `Interval` → `IntervalScheduler.GetNextFireTime(interval)`
  - `Delay` → **仅在从未触发过时排期一次**（触发后不再续排，避免按 Delay 周期无限重复）
  - Cron/Interval 若算不出下次时间（表达式无解、超过截止时间等），会**显式打 Warning 日志**而非静默吞掉（任务「注册了但永不执行」时有迹可循）。

### 执行与租户切换（JobExecutor）

- `JobExecutor.ExecuteAsync` 为每次执行创建一个 DI 作用域，用 `ActivatorUtilities.CreateInstance` 构造 `IJobWorker` 实例，再套上中间件管道执行。
- **多租户感知**：`CompositeJobScheduler.ResolveTenantId` 按优先级解析租户——① 参数里的 `tenantId` → ② `JobInfo.TenantId` → ③ 当前异步上下文租户（`AsyncLocalCurrentTenantAccessor`）；执行时若解析到租户，`JobExecutor` 用 `ICurrentTenant.Change(tenantId, ...)` 切到该租户上下文再跑任务。`TenantId` 为空视为 Host（宿主）任务。
- 执行结果与异常均落 `JobInstance` 状态并写 `JobHistory`（即便状态回写失败也保证历史留痕，便于排障）。

### 后台服务（XiHanBackgroundServiceBase）

- 主循环：`IsTaskProcessingEnabled` 门控 → 当前运行数 < `MaxConcurrentTasks` 时调 `FetchWorkItemsAsync` 批量取任务 → 每个任务包进带重试/超时的 `Task.Run` 并发执行；无任务或已满并发时按 `IdleDelayMilliseconds` 空转等待。
- 单任务处理包装器统一记录统计（开始/完成/重试次数/耗时），失败走 `OnTaskFailed`（可重写）。
- 停机时等待在跑任务收尾，带 `ShutdownTimeoutMilliseconds` 超时上限。
- 支持 `IDynamicServiceConfig` 运行时热调并发数 / 空闲延迟 / 启停开关（`ConfigChanged` 事件）。

## 核心能力

- **多触发方式调度**：Cron / Interval / Delay / Manual 四类触发；调度器每秒巡检。
- **执行管道 + 中间件**：横切逻辑（日志、超时、锁、重试、指标）以 `IJobMiddleware` 串联，可 `XiHanJobBuilder.AddMiddleware<T>()` 追加自定义。
- **声明式任务定义**：`[JobName]`、`[JobSchedule]`、`[JobRetry]`、`[JobTimeout]`、`[JobConcurrent]`、`[JobPriority]`、`[JobDescription]` 特性 + `RegisterJobsFromAssembly` 反射自动注册。
- **任务锁**：`CachingJobLockProvider` 复用 Caching 统一分布式锁（有 Redis 则跨实例、否则进程内回退），配合 `AllowConcurrent=false` 防止同名任务并发重入。
- **多租户感知**：调度解析 + 执行期租户上下文切换，天然适配多租户定时作业。
- **后台常驻服务基类**：并发控制、批量拉取、重试（指数退避）、优雅停机、运行统计、动态配置一站封装。

## 主要 API / 类型

### 定时任务（ScheduledJobs）

| 类型 | 说明 |
| --- | --- |
| `IJobScheduler` / `CompositeJobScheduler` | 调度器契约与复合实现。核心方法：`void RegisterJob(JobInfo)`、`void UnregisterJob(string)`、`void PauseJob(string)`、`void ResumeJob(string)`、`Task<string> TriggerJobAsync(string, IDictionary<string, object?>?)`、`DateTimeOffset? GetNextFireTime(string)`、`IReadOnlyList<JobInfo> GetAllJobs()`、`Task StartAsync(...)`、`Task StopAsync(...)` |
| `IJobWorker` | 任务业务实现契约：`Task<JobResult> ExecuteAsync(IJobContext, CancellationToken)` |
| `IJobContext` | 执行上下文：`JobInstance`、`long? TenantId`、`Parameters`、`ServiceProvider`、`TraceId`、`StartedAt`、`AttemptCount`、`CancellationToken` |
| `IJobExecutor` / `JobExecutor` | 执行器，在租户上下文中跑任务实例、写历史 |
| `IJobMiddleware` | 执行管道中间件抽象（Logging/Timeout/Lock/Retry/Metrics 内置） |
| `IJobStore` / `InMemoryJobStore` | 任务实例与历史存储（默认内存实现） |
| `IJobLockProvider` / `CachingJobLockProvider` | 任务锁抽象与基于 Caching 分布式锁的实现 |
| `IJobEventPublisher` / `JobMetricsProvider` | 任务事件发布与指标采集 |
| `XiHanJobBuilder` | 链式配置：`UseStore<T>()`、`UseLockProvider<T>()`、`AddMiddleware<T>()`、`AddJob<T>()`、`Configure(...)` |
| `XiHanJobOptions` | 调度选项（见下表） |

### 任务模型与枚举

| 类型 | 说明 |
| --- | --- |
| `JobInfo` | 任务静态定义：`JobName`、`JobType`、`TriggerType`、`CronExpression`、`Interval`、`Delay`、`EndTime`、`RepeatCount`、`Priority`、`AllowConcurrent`、`TimeoutMilliseconds`、`RetryPolicy`、`IsEnabled`、`TenantId`、`DefaultParameters` |
| `JobResult` | 执行结果，工厂 `Success(...)` / `Failure(...)` / `Canceled(...)` |
| `JobRetryPolicy` | 重试策略：`MaxRetryCount`、`RetryIntervalMilliseconds`、`UseExponentialBackoff`、`BackoffMultiplier`、`MaxRetryIntervalMilliseconds`；`CalculateDelay(attempt)` |
| `JobTriggerType` | `Cron` / `Interval` / `Delay` / `Manual` |
| `JobStatus` | `Pending` / `Running` / `Succeeded` / `Failed` / `Canceled` / `Paused` |
| `JobPriority` | `Low` / `Normal` / `High` / `Critical` |

### 声明式特性（Attributes）

| 特性 | 说明 |
| --- | --- |
| `[JobName(name)]` | 任务唯一名称（自动注册的**必需**特性，缺失则跳过该类型） |
| `[JobSchedule(cron)]` / `[JobSchedule(intervalSeconds)]` / `[JobSchedule()]` | 触发方式：Cron / Interval / Manual；另有 `DelaySeconds` 属性 |
| `[JobRetry]` | `MaxRetryCount`、`RetryIntervalMilliseconds`、`UseExponentialBackoff` |
| `[JobTimeout(ms)]` | 超时毫秒 |
| `[JobConcurrent(bool)]` | 是否允许并发 |
| `[JobPriority(JobPriority)]` | 优先级 |
| `[JobDescription(text)]` | 任务描述 |

### 后台服务（BackgroundServices）

| 类型 | 说明 |
| --- | --- |
| `XiHanBackgroundServiceBase<T>` | 后台常驻服务抽象基类。抽象方法：`Task<IEnumerable<IBackgroundTaskItem>> FetchWorkItemsAsync(int, CancellationToken)`、`Task ProcessItemAsync(IBackgroundTaskItem, CancellationToken)`；可重写 `OnTaskFailed(...)`、`CreateDefaultRetryPolicy()`、`OnConfigChanged(...)` |
| `IBackgroundTaskItem` | 后台任务项：`TaskId`、`Data`、`CreatedAt`、`RetryCount` |
| `IDynamicServiceConfig` / `DynamicServiceConfig` | 运行时动态配置：`UpdateMaxConcurrentTasks(int)`、`UpdateIdleDelay(int)`、`SetTaskProcessingEnabled(bool)` + `ConfigChanged` 事件 |
| `XiHanBackgroundServiceOptions` | 后台服务选项（见下表） |
| `BackgroundServiceStatistics` / `StatisticsSummary` | 运行统计 |

### DI 扩展方法

| 方法 | 说明 |
| --- | --- |
| `IServiceCollection.AddXiHanTasks(IConfiguration)` | 从配置绑定并注册全套调度服务，返回 `XiHanJobBuilder` |
| `IServiceCollection.AddXiHanTasks(Action<XiHanJobOptions>?)` | 代码方式配置 + 注册 |
| `XiHanJobBuilder.UseInMemoryStore()` / `UseInMemoryLock()` / `UseDistributedLock()` | 内置存储 / 锁快捷方法（锁后端由 Caching 按 Redis 配置自动选择） |
| `IJobScheduler.RegisterJobsFromAssembly(Assembly)` | 反射扫描程序集内带 `[JobName]` 的 `IJobWorker` 自动注册 |
| `IJobScheduler.RegisterCronJob<T>(name, cron, ...)` / `RegisterIntervalJob<T>(name, interval, ...)` | 代码方式注册单个任务 |

## 配置

配置节：`XiHan:Tasks:ScheduledJobs`（`XiHanJobOptions.SectionName`）。

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `Enabled` | `bool` | `true` | 是否启用任务调度 |
| `AutoDiscoverJobs` | `bool` | `true` | 是否自动发现并注册任务 |
| `JobAssemblyPatterns` | `string[]` | `["*.Jobs", "*.Tasks"]` | 扫描的程序集名称模式 |
| `DefaultTimeoutMilliseconds` | `int` | `300000` | 默认任务超时（5 分钟） |
| `HistoryRetentionDays` | `int` | `30` | 历史记录保留天数 |
| `EnableMetrics` | `bool` | `true` | 是否启用性能监控 |
| `NodeName` | `string?` | `null` | 任务执行节点名称 |

`XiHanBackgroundServiceOptions`（后台服务，需自行绑定，无固定配置节名）：

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `MaxConcurrentTasks` | `int` | `5` | 最大并发任务数 |
| `IdleDelayMilliseconds` | `int` | `1000` | 队列为空时的等待时间 |
| `EnableRetry` | `bool` | `true` | 是否启用重试 |
| `EnableTaskTimeout` | `bool` | `false` | 是否启用任务超时控制 |
| `MaxRetryCount` | `int` | `3` | 失败重试次数 |
| `RetryDelayMilliseconds` | `int` | `5000` | 重试延迟 |
| `TaskTimeoutMilliseconds` | `int` | `0` | 单任务超时（0=不超时） |
| `ShutdownTimeoutMilliseconds` | `int` | `30000` | 停机等待任务收尾超时 |

示例 `appsettings.json`：

```json
{
  "XiHan": {
    "Tasks": {
      "ScheduledJobs": {
        "Enabled": true,
        "AutoDiscoverJobs": true,
        "JobAssemblyPatterns": ["*.Jobs", "*.Tasks"],
        "DefaultTimeoutMilliseconds": 300000,
        "HistoryRetentionDays": 30,
        "EnableMetrics": true
      }
    }
  }
}
```

## 使用示例

### 示例 1：定义一个每日凌晨执行的 Cron 任务

```csharp
using XiHan.Framework.Tasks.ScheduledJobs.Abstractions;
using XiHan.Framework.Tasks.ScheduledJobs.Attributes;
using XiHan.Framework.Tasks.ScheduledJobs.Models;

[JobName("DailyReport")]
[JobDescription("每日报表生成")]
[JobSchedule("0 0 * * *")]        // Cron：每天 00:00（支持 5 位/6 位与 @daily 等预定义）
[JobRetry(MaxRetryCount = 2)]
[JobConcurrent(false)]             // 不允许并发重入
public class DailyReportJob : IJobWorker
{
    private readonly IReportService _reports;

    public DailyReportJob(IReportService reports) => _reports = reports;

    public async Task<JobResult> ExecuteAsync(IJobContext context, CancellationToken cancellationToken = default)
    {
        // context.TenantId 已由调度器解析；执行时已切到对应租户上下文
        await _reports.GenerateDailyAsync(cancellationToken);
        return JobResult.Success();
    }
}
```

注册（反射扫描或显式）：

```csharp
// 方式一：程序集扫描（类型需带 [JobName]）
scheduler.RegisterJobsFromAssembly(typeof(DailyReportJob).Assembly);

// 方式二：代码显式注册
scheduler.RegisterCronJob<DailyReportJob>("DailyReport", "0 0 * * *", "每日报表");
scheduler.RegisterIntervalJob<HeartbeatJob>("Heartbeat", TimeSpan.FromMinutes(1));

// 手动触发一次（返回任务实例 Id）
string instanceId = await scheduler.TriggerJobAsync("DailyReport",
    new Dictionary<string, object?> { ["tenantId"] = 1001 });
```

### 示例 2：后台常驻服务持续消费队列

```csharp
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using XiHan.Framework.Tasks.BackgroundServices;

public class OutboxConsumer : XiHanBackgroundServiceBase<OutboxConsumer>
{
    private readonly IOutboxQueue _queue;

    public OutboxConsumer(
        ILogger<OutboxConsumer> logger,
        IOptions<XiHanBackgroundServiceOptions> options,
        IOutboxQueue queue)
        : base(logger, options)
    {
        _queue = queue;
    }

    // 从队列批量取任务；返回空集合表示当前无任务（基类会空转等待）
    protected override async Task<IEnumerable<IBackgroundTaskItem>> FetchWorkItemsAsync(
        int maxCount, CancellationToken cancellationToken)
        => await _queue.DequeueAsync(maxCount, cancellationToken);

    // 处理单个任务
    protected override async Task ProcessItemAsync(
        IBackgroundTaskItem item, CancellationToken cancellationToken)
        => await _queue.HandleAsync(item, cancellationToken);
}
```

```csharp
// 注册（后台服务不由 AddXiHanTasks 自动接管，需自行注册）
services.Configure<XiHanBackgroundServiceOptions>(o => o.MaxConcurrentTasks = 8);
services.AddHostedService<OutboxConsumer>();
```

## 扩展点 / 自定义

- **替换任务存储 / 锁**：`services.AddSingleton<IJobStore, MyStore>()`（覆盖默认 `TryAddSingleton`），或 `builder.UseStore<MyStore>()` / `builder.UseLockProvider<MyLock>()`。
- **追加中间件**：实现 `IJobMiddleware`，`builder.AddMiddleware<MyMiddleware>()`；注册顺序即执行顺序。
- **自定义后台服务**：继承 `XiHanBackgroundServiceBase<T>`，实现 `FetchWorkItemsAsync` / `ProcessItemAsync`，可重写 `OnTaskFailed` / `CreateDefaultRetryPolicy`。
- **运行时热调**：通过 `IDynamicServiceConfig` 动态改并发数、空闲延迟、启停，无需重启。

## 注意事项与最佳实践

- 调度器**每秒巡检一次**，触发精度为秒级；`Delay` 是「一次性」延迟，触发后不再续排。
- Cron/Interval 任务若下次触发时间算不出（表达式无解 / 已过截止时间），任务会「注册但永不执行」——留意日志中的 Warning。
- `AllowConcurrent=false` 依赖 `IJobStore.GetRunningInstancesAsync` + 任务锁，跨实例防并发需 Redis 分布式锁（Caching 启用 Redis）。
- 多租户任务：优先用参数 `tenantId` 或 `JobInfo.TenantId` 指定租户；未指定时回退到当前异步上下文租户。宿主级任务令 `TenantId` 为空。
- 后台服务的 `XiHanBackgroundServiceOptions` **默认不启用单任务超时**（`EnableTaskTimeout=false`、`TaskTimeoutMilliseconds=0`），如需超时须显式打开。
- 默认 `InMemoryJobStore` 是进程内内存存储，进程重启丢失历史；需持久化请自行实现 `IJobStore`。

## 依赖模块

- [XiHan.Framework.Caching](./caching) — 任务锁复用其统一的分布式锁（Redis 跨实例 / 进程内回退自动选择）。
- [XiHan.Framework.MultiTenancy](./multitenancy) 与 [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions) — 任务的租户解析与执行期 `ICurrentTenant.Change` 上下文切换。
- [XiHan.Framework.Timing](./timing) — 时间基础设施。

（Cron 解析、重试与调度均为框架自研，未引入第三方调度库。）

## 相关模块

- [XiHan.Framework.Caching](./caching) — 分布式锁与缓存底座。
- [XiHan.Framework.MultiTenancy](./multitenancy) — 多租户上下文来源。
- [XiHan.Framework.Observability](./observability) — 可观测性，配合任务指标与追踪。
