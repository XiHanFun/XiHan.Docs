# XiHan.Framework.Observability

> 可观测性基础库：健康检查、指标采集、性能监控与运行时诊断，纯 .NET 原生实现，不引入外部可观测性栈。

- **NuGet**：`XiHan.Framework.Observability`
- **模块类**：`XiHanObservabilityModule`
- **所在层**：基础设施层
- **关键依赖**：`Microsoft.Extensions.Diagnostics.HealthChecks`、`System.Diagnostics.PerformanceCounter`；框架内部仅依赖 `XiHan.Framework.Core`

## 概述

XiHan.Framework.Observability 把「应用当前健康吗、跑得快不快、进程内部状态如何」这类运行时观察能力封装成一组可注入服务，覆盖四个方向：健康检查、指标采集、性能监控、运行时诊断。它不接入 OpenTelemetry / Prometheus 等外部栈，全部基于 BCL（`GC`、`Process`、`ThreadPool`、`Stopwatch` 等）与 `Microsoft.Extensions.Diagnostics.HealthChecks` 实现，采集结果保存在进程内内存中，供上层应用自行读取、展示或转发。

## 何时使用

- 想在代码里记录计数器、测量值（Gauge）、直方图，或对一段操作计时。
- 需要监控关键操作耗时、汇总 P50/P95/P99 统计、筛出慢操作。
- 想读取进程的系统、运行时、内存、线程等诊断信息，或按需触发 GC。
- 需要一个基于内存阈值的健康检查（`MemoryHealthCheck`）接入 ASP.NET Core 健康检查端点。
- 不适用：需要跨进程/分布式追踪、指标持久化或对接 Prometheus/Grafana 时，本包不提供，需要另行接入相应生态。

## 安装与启用

```bash
dotnet add package XiHan.Framework.Observability
```

```csharp
[DependsOn(typeof(XiHanObservabilityModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用扩展方法 `AddXiHanObservability(configuration)`，它做三件事：

1. 调用 `services.AddHealthChecks()` 注册健康检查基础设施（`HealthCheckService`）；
2. 以**单例**注册 `IMetricsCollector` → `MetricsCollector`；
3. 以**单例**注册 `IPerformanceMonitor` → `PerformanceMonitor` 与 `IDiagnosticsService` → `DiagnosticsService`。

> 注意：`AddXiHanObservability` **不会**注册任何具体的 `IHealthCheck`（包括 `MemoryHealthCheck`）。健康检查项需要你在应用侧显式 `AddCheck` 接入（见「使用示例」）。

## 核心能力

- **指标采集（`IMetricsCollector` / `MetricsCollector`）**：记录计数器、测量值、直方图，`BeginTimer` 返回可释放计时器（`Dispose` 时以 `{name}.duration` 记录耗时直方图），并可整体读取或清空。指标以 `ConcurrentBag<MetricData>` 存于内存。
- **性能监控（`IPerformanceMonitor` / `PerformanceMonitor`）**：`BeginOperation` 返回 `IPerformanceTracker`，支持打标签与记录检查点；汇总为 `PerformanceStatistics`（含成功/失败计数、平均/最小/最大耗时与 P50/P95/P99），并可按阈值筛出慢操作。
- **运行时诊断（`IDiagnosticsService` / `DiagnosticsService`）**：读取系统、运行时、内存、线程信息，强制触发 GC，或一次性生成 `DiagnosticsReport` 完整报告。
- **健康检查（`IHealthCheck` 实现）**：`MemoryHealthCheck` 为真实实现——按内存阈值判定 `Healthy`/`Degraded` 并附带 GC 明细。

## 主要 API / 类型

### 指标采集

| 类型 | 说明 |
| --- | --- |
| `IMetricsCollector` | `void RecordCounter(string name, long value = 1, Dictionary<string,string>? tags = null)`、`void RecordMeasurement(string, double, ...)`、`void RecordHistogram(string, double, ...)`、`IDisposable BeginTimer(string, ...)`、`IReadOnlyList<MetricData> GetMetrics()`、`void Clear()` |
| `MetricData` | 单条指标：`Name` / `Type`（`MetricType`）/ `Value` / `Tags` / `Timestamp` / `Unit` |
| `MetricType` | 枚举：`Counter`、`Gauge`、`Histogram`、`Summary` |

### 性能监控

| 类型 | 说明 |
| --- | --- |
| `IPerformanceMonitor` | `IPerformanceTracker BeginOperation(string operationName)`、`PerformanceStatistics GetStatistics()`、`IReadOnlyList<PerformanceRecord> GetSlowOperations(double thresholdMs = 1000)`、`void Clear()` |
| `IPerformanceTracker` | `IDisposable`；`string OperationName`、`void AddTag(string,string)`、`void Checkpoint(string)` |
| `PerformanceRecord` | 单次操作记录：起止时间、`DurationMs`、`Tags`、`Checkpoints`、`Success`、`Exception` |
| `PerformanceStatistics` | 汇总统计：总数/成功/失败、平均/最小/最大耗时、P50/P95/P99、按操作名分组的 `OperationStatistics` |

### 运行时诊断

| 类型 | 说明 |
| --- | --- |
| `IDiagnosticsService` | `SystemInfo GetSystemInfo()`、`RuntimeInfo GetRuntimeInfo()`、`MemoryInfo GetMemoryInfo()`、`ThreadInfo GetThreadInfo()`、`void ForceGarbageCollection()`、`DiagnosticsReport GetDiagnosticsReport()` |
| `DiagnosticsReport` | 汇总 `SystemInfo` / `RuntimeInfo` / `MemoryInfo`（含 `GCInfo`）/ `ThreadInfo` 与生成时间 |

### 健康检查

| 类型 | 说明 |
| --- | --- |
| `MemoryHealthCheck` | **真实实现**。构造参数 `thresholdMb`（默认 1024MB）；超阈值返回 `Degraded`，否则 `Healthy`，均附带 GC 明细数据 |
| `DatabaseHealthCheck` | **占位骨架**。构造接收连接串（内部脱敏密码），当前仅 `await Task.Delay` 后返回 `Healthy`，未接入真实数据库连接测试 |
| `RedisHealthCheck` | **占位骨架**。同上，当前未接入真实 Redis PING 测试 |

## 使用示例

指标与计时：

```csharp
// 计数与耗时直方图（BeginTimer 在 Dispose 时记录 {name}.duration）
metricsCollector.RecordCounter("orders.created");
using (metricsCollector.BeginTimer("order.handle"))
{
    // 业务处理
}
```

性能监控与慢操作：

```csharp
using (var tracker = performanceMonitor.BeginOperation("PlaceOrder"))
{
    tracker.AddTag("channel", "web");
    tracker.Checkpoint("validated");
    // ... 处理 ...
}

var stats = performanceMonitor.GetStatistics();        // P50/P95/P99 等
var slow = performanceMonitor.GetSlowOperations(500);  // 超过 500ms 的操作
```

接入健康检查端点（需在应用侧显式注册检查项）：

```csharp
// 模块 AddXiHanObservability 已调用 AddHealthChecks()，此处补充具体检查项
services.AddHealthChecks()
        .AddCheck("memory", new MemoryHealthCheck(thresholdMb: 512));

// Program.cs
app.MapHealthChecks("/health");
```

## 扩展点 / 自定义

- 三个核心服务均以 `AddSingleton`（非 `TryAdd`）注册；如需替换 `IMetricsCollector` / `IPerformanceMonitor` / `IDiagnosticsService` 实现，在本模块之后再次注册你的实现覆盖即可。
- 健康检查采用 `Microsoft.Extensions.Diagnostics.HealthChecks` 标准机制，可自定义 `IHealthCheck` 后通过 `AddCheck` / `AddCheck<T>` 接入；`DatabaseHealthCheck` / `RedisHealthCheck` 为占位骨架，接入真实连接测试前请勿直接依赖其结果。

## 注意事项与最佳实践

- **无配置节 / 无 Options**：本包没有配置类，`AddXiHanObservability` 虽接收 `IConfiguration` 但当前未从中读取任何键，appsettings.json 无需为其配置任何节。
- **内存存储、非持久**：指标与性能记录保存在进程内 `ConcurrentBag`，进程重启即丢失，且会持续累积，长时间运行需自行择机调用 `Clear()`。
- **DB/Redis 健康检查是骨架**：`DatabaseHealthCheck` / `RedisHealthCheck` 恒返回 `Healthy`，仅作占位；接入真实探测前不要用于生产判活。
- **健康检查需手动注册**：模块只注册了基础设施，不含任何检查项——不 `AddCheck` 则 `/health` 端点不会体现内存/依赖状态。

## 依赖模块

- [XiHan.Framework.Core](./core) — 唯一的框架内部 `ProjectReference`（模块化与 DI 基础）。
- 第三方：`Microsoft.Extensions.Diagnostics.HealthChecks`、`System.Diagnostics.PerformanceCounter`。**不引用** OpenTelemetry / Prometheus 等外部可观测性栈。

## 相关模块

- [XiHan.Framework.Logging](./logging) — 日志能力，与可观测性同属运行时观察范畴。
- [XiHan.Framework.Timing](./timing) — 时间与计时基础，可配合性能监控使用。
