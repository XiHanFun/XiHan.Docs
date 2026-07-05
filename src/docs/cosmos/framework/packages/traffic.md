# XiHan.Framework.Traffic

> 流量治理：灰度路由、限流、熔断。

- **NuGet**：`XiHan.Framework.Traffic`
- **模块类**：`XiHanTrafficModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Traffic 是框架的流量治理库，为灰度路由、限流、熔断三类场景提供统一的规则模型与抽象接口。它本身只定义"规则"和"决策"，不负责在网关或中间件里具体执行——把执行留给上层（如网关）接入，自己专注于把治理策略沉淀成可复用的抽象。当前灰度路由已内置完整实现，限流与熔断以策略接口形式提供扩展点。

## 何时使用

- 做灰度发布：按百分比、用户、租户或请求头把部分流量分流到新版本。
- 需要一套与业务解耦的限流/熔断策略抽象，便于在网关或服务层统一接入。
- 想把灰度规则的来源（内存、数据库）与匹配逻辑解耦，规则可动态替换。

## 安装

```bash
dotnet add package XiHan.Framework.Traffic
```

## 启用

```csharp
[DependsOn(typeof(XiHanTrafficModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中默认调用 `AddGrayRouting()`，注册灰度规则引擎、内存规则仓储与四个内置匹配器。

## 核心能力

- **灰度路由**：规则引擎按优先级匹配多种规则，输出灰度决策（是否命中、目标版本/服务、命中规则、原因）。
- **多维匹配器**：内置百分比、用户 ID、租户 ID、请求头四种匹配器，`GrayRuleType` 另预留 IpAddress、Custom 类型。
- **规则来源可插拔**：仓储接口只读取规则，默认内存实现可通过 `ReplaceGrayRuleRepository<T>()` 替换为数据库实现；自定义匹配器用 `AddGrayMatcher<T>()` 注册。
- **限流抽象**：`IRateLimitPolicy` 定义"是否允许请求通过"的异步判定契约。
- **熔断抽象**：`ICircuitBreakerPolicy` 定义熔断开合判断与成功/失败记录契约。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IGrayRuleEngine` / `DefaultGrayRuleEngine` | 灰度规则引擎，执行 `DecideAsync` 决策 |
| `IGrayMatcher` | 匹配器接口；内置 `PercentageGrayMatcher`、`UserIdGrayMatcher`、`TenantIdGrayMatcher`、`HeaderGrayMatcher` |
| `IGrayRuleRepository` / `InMemoryGrayRuleRepository` | 灰度规则仓储（只读），默认内存实现 |
| `IGrayRule` / `IGrayDecision` / `GrayContext` | 灰度规则、决策结果与上下文模型 |
| `GrayRuleType` | 灰度规则类型枚举（Percentage/UserId/TenantId/Header/IpAddress/Custom） |
| `IRateLimitPolicy` | 限流策略接口，`IsAllowedAsync` 判定是否放行 |
| `ICircuitBreakerPolicy` | 熔断策略接口，`IsOpen` / `RecordSuccess` / `RecordFailure` |
| `XiHanTrafficServiceCollectionExtensions` | `AddGrayRouting` / `AddGrayMatcher` / `ReplaceGrayRuleRepository` 扩展 |

## 快速示例

```csharp
// 执行一次灰度决策
var context = new GrayContext { UserId = 1001, RequestPath = "/api/orders" };
IGrayDecision decision = await grayRuleEngine.DecideAsync(context);
if (decision.IsGray)
{
    // 命中灰度，路由到 decision.TargetVersion 指向的新版本
}
```

## 依赖模块

- [XiHan.Framework.Core](./core) — 模块化与依赖注入基座。
- [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions) — 租户抽象，支撑按租户 ID 灰度。

## 相关模块

- [XiHan.Framework.Web.Gateway](./web-gateway) — 网关层，灰度决策的典型执行方。
- [XiHan.Framework.Observability](./observability) — 可观测性，配合流量治理做指标与追踪。
