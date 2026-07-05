# XiHan.Framework.Timing

> 时间策略：统一时钟抽象、时区管理与 UTC ↔ 用户时间转换。

- **NuGet**：`XiHan.Framework.Timing`
- **模块类**：`XiHanTimingModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Timing 为框架提供统一的"时间"抽象。它用 `IClock` 取代直接调用 `DateTime.Now`，可在 UTC 与本地两种模式间切换，并规范化不同 `DateTimeKind` 的时间值。配合时区提供器，它能在 UTC 与用户所在时区之间双向转换，并做 Windows/IANA 两大时区标准的互转。

## 何时使用

- 想让整个应用统一走一个时钟抽象，而非分散地调用 `DateTime.Now`。
- 后端存 UTC、按用户时区展示，需要 UTC ↔ 用户时间的双向转换。
- 需要在 Windows 时区 ID 与 IANA 时区名之间互转。
- 需要按请求隔离"当前时区"（请求级作用域）。

## 安装

```bash
dotnet add package XiHan.Framework.Timing
```

## 启用

```csharp
[DependsOn(typeof(XiHanTimingModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanTiming()`，注册 `XiHanClockOptions` 与时钟、时区相关服务。启用后即可注入 `IClock` 使用。

## 核心能力

- **统一时钟抽象**：`IClock` 提供当前时间，支持 UTC / Local 两种模式（由 `XiHanClockOptions.Kind` 控制）。
- **DateTime 规范化**：`Clock.Normalize()` 处理不同 `DateTimeKind` 之间的转换。
- **UTC ↔ 用户时间转换**：在 UTC 模式下支持 `ConvertToUserTime` / `ConvertToUtc` 双向转换与多时区。
- **时区标准互转**：`TZConvertTimezoneProvider` 基于 TimeZoneConverter 实现 Windows / IANA 时区互转与列表获取。
- **请求级当前时区**：`CurrentTimezoneProvider` 用 `AsyncLocal` 存储当前请求的时区，实现请求级隔离。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IClock` / `Clock` | 时钟接口与实现，支持 UTC/Local 模式、规范化与时间转换 |
| `ITimezoneProvider` / `TZConvertTimezoneProvider` | 时区提供器，基于 TimeZoneConverter 做 Windows/IANA 互转 |
| `ICurrentTimezoneProvider` / `CurrentTimezoneProvider` | 当前时区提供器，`AsyncLocal` 存储请求级时区 |
| `XiHanClockOptions` | 时钟配置（`Kind` 属性，默认 `Unspecified`） |

## 依赖模块

- 内部依赖：仅 [XiHan.Framework.Core](./core)。
- 第三方核心：`TimeZoneConverter`（Windows/IANA 时区互转）。

## 相关模块

- [XiHan.Framework.Utils](./utils) — 其 `Timing` 目录提供日期时间区间、农历、计时等基础时间工具。
