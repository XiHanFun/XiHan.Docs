# XiHan.Framework.Logging

> 结构化日志：Serilog 集成、控制台/文件输出、异步写入、结构化与性能日志。

- **NuGet**：`XiHan.Framework.Logging`
- **模块类**：`XiHanLoggingModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Logging 在 Serilog 之上封装了一套开箱即用的日志基础设施。启用后自动配置控制台与文件双路输出，文件路借助 `Serilog.Sinks.Async` 异步写入、按天与按大小滚动。除通用日志外，它还提供结构化日志、性能监控日志与多租户日志上下文等专用接口。

## 何时使用

- 想一行 `[DependsOn]` 就获得控制台 + 文件的完整日志配置，无需手写 Serilog 引导代码。
- 需要日志文件异步写入、按天滚动、限制文件大小与保留数量。
- 需要记录结构化数据、业务事件，或对 API/数据库调用做性能计时。
- 需要在日志中自动携带 UserId、TenantId、TraceId 等上下文。

## 安装

```bash
dotnet add package XiHan.Framework.Logging
```

## 启用

```csharp
[DependsOn(typeof(XiHanLoggingModule))]
public class MyModule : XiHanModule { }
```

模块在 `PreConfigureServices` 设置 `XiHanLoggingOptions` 默认值（启用、最小级别 Information），在 `ConfigureServices` 中调用 `AddXiHanLogging(config)`，从配置节 `XiHan:Logging` 绑定选项并配置 Serilog。

## 核心能力

- **Serilog 集成**：通过构建器统一配置最小级别、上下文增强与属性丰富化，接入 ASP.NET Core。
- **异步文件输出**：借助 `Serilog.Sinks.Async` 异步写入，按天滚动 + 按大小滚动，限制保留文件数与单文件大小。
- **控制台输出**：按日志级别使用不同输出模板。
- **结构化日志**：`IStructuredLogger` 支持键值对、事件、业务动作的结构化记录。
- **性能监控**：`IPerformanceLogger` 记录 API 调用、数据库查询、内存/CPU；`IPerformanceTimer` 支持 `using` 自动计时。
- **多租户上下文**：`ILogContext`（Scoped）携带 UserId、TenantId、RequestId、TraceId 等，支持作用域隔离与还原。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IXiHanLogger` / `IXiHanLogger<T>` | 通用日志接口与泛型版本 |
| `IStructuredLogger` | 结构化日志接口（事件、业务动作） |
| `IPerformanceLogger` / `IPerformanceTimer` | 性能日志接口与计时器 |
| `ILogContext` | 日志上下文（UserId/TenantId/TraceId 等，支持 Scope） |
| `IXiHanLoggerFactory` | 日志器工厂 |
| `XiHanLoggerConfigurationBuilder` | Serilog `LoggerConfiguration` 的 Fluent 构建器 |
| `XiHanFileLoggerProvider` / `XiHanConsoleLoggerProvider` | 文件 / 控制台日志提供器 |
| `XiHanLoggingOptions` | 主日志配置（配置节 `XiHan:Logging`） |

## 依赖模块

- 内部依赖：仅 [XiHan.Framework.Core](./core)。
- 第三方核心：`Serilog.AspNetCore`（含 Serilog 核心与 Console/File sink 传递依赖）、`Serilog.Sinks.Async`（异步写入）。

## 相关模块

- [XiHan.Framework.Observability](./observability) — 可观测性（追踪/指标）与日志互补。
