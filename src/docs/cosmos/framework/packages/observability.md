# XiHan.Framework.Observability

> 可观测性：健康检查、性能计数器、指标采集。

- **NuGet**：`XiHan.Framework.Observability`
- **模块类**：`XiHanObservabilityModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Observability 是框架的可观测性基础库，把"应用当前健康吗、跑得快不快、内部状态如何"这类运行时观察能力封装成一组可注入的服务。它内置健康检查、指标收集、性能监控与运行时诊断四类能力，供上层应用采集与展示自身的运行状况。

## 何时使用

- 需要暴露健康检查端点，判断应用/内存/依赖是否可用。
- 想在代码里记录计数器、直方图、耗时等自定义指标。
- 需要监控关键操作耗时、找出慢操作。
- 想读取进程的系统、运行时、内存、线程等诊断信息。

## 安装

```bash
dotnet add package XiHan.Framework.Observability
```

## 启用

```csharp
[DependsOn(typeof(XiHanObservabilityModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanObservability`，注册健康检查基础设施，并以单例注册 `IMetricsCollector`、`IPerformanceMonitor`、`IDiagnosticsService`。

## 核心能力

- **健康检查**：基于 `Microsoft.Extensions.Diagnostics.HealthChecks` 提供 `MemoryHealthCheck`（按阈值判断内存占用）等 `IHealthCheck` 实现。
- **指标采集**（`IMetricsCollector`）：记录计数器、测量值、直方图，`BeginTimer` 计时，并可读取/清空已采集指标。
- **性能监控**（`IPerformanceMonitor`）：以 `BeginOperation` 追踪操作耗时、记录检查点、汇总统计并筛出慢操作。
- **运行时诊断**（`IDiagnosticsService`）：读取系统、运行时、内存、线程信息，触发 GC，生成完整诊断报告。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanObservabilityModule` | 模块入口，注册可观测性各项服务 |
| `IMetricsCollector` / `MetricsCollector` | 指标收集器，含 `RecordCounter` / `RecordHistogram` / `BeginTimer` |
| `IPerformanceMonitor` / `PerformanceMonitor` | 性能监控，`BeginOperation` 返回 `IPerformanceTracker` |
| `IDiagnosticsService` / `DiagnosticsService` | 运行时诊断，输出 `DiagnosticsReport` |
| `MemoryHealthCheck` / `DatabaseHealthCheck` / `RedisHealthCheck` | `IHealthCheck` 实现（数据库/Redis 为占位骨架，需自行接入真实连接测试） |

## 快速示例

```csharp
// 记录一次计数，并对一段操作计时
metricsCollector.RecordCounter("orders.created");
using (metricsCollector.BeginTimer("order.handle"))
{
    // 业务处理
}

// 监控关键操作耗时
using var tracker = performanceMonitor.BeginOperation("PlaceOrder");
tracker.Checkpoint("validated");
```

## 依赖模块

框架内部仅依赖 [XiHan.Framework.Core](./core)。第三方核心依赖为 `Microsoft.Extensions.Diagnostics.HealthChecks` 与 `System.Diagnostics.PerformanceCounter`；不引用 OpenTelemetry / Prometheus 等外部可观测性栈。

## 相关模块

- [XiHan.Framework.Logging](./logging) — 日志能力，与可观测性同属运行时观察范畴。
- [XiHan.Framework.Timing](./timing) — 时间与计时基础，可配合性能监控使用。
