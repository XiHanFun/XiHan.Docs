# XiHan.Framework.Web.Gateway

> API 网关：作为流量入口做灰度路由决策、请求追踪与网关级异常处理；限流/熔断可按配置开关。

- **NuGet**：`XiHan.Framework.Web.Gateway`
- **模块类**：`XiHanWebGatewayModule`
- **所在层**：Web 层

## 这是什么

XiHan.Framework.Web.Gateway 是放在流量入口的一层薄治理组件。它的职责是「路由决策 + 策略执行」——为进入的请求构建灰度上下文、调用灰度规则引擎做决策，并把结果注入 `HttpContext`，供后续中间件按决策转发；同时提供网关级异常处理与请求追踪。真正的灰度规则引擎（`IGrayRuleEngine`）与负载均衡等能力沉淀在 [Traffic](./traffic) 模块，本包是它在 Web 管道中的接入层。

注意：本包本身不负责业务逻辑，也不管理规则本身，只在请求管道里执行决策。

## 何时使用

- 需要在入口做**灰度发布 / 灰度路由**：按租户、规则把请求分流到不同版本或分组。
- 需要网关级的统一异常响应与请求追踪。
- 需要在流量入口集中控制超时、CORS 来源、全局 Header 等入口策略。

## 安装

```bash
dotnet add package XiHan.Framework.Web.Gateway
```

## 启用

```csharp
[DependsOn(typeof(XiHanWebGatewayModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddGrayRouting()`（由 Traffic 模块提供）注册灰度路由服务；网关中间件通过 `UseGateway()` 挂入应用管道。

## 核心能力

- **灰度路由决策**：`GrayRoutingMiddleware` 构建灰度上下文、经 `IGrayRuleEngine` 决策，并把结果注入 `HttpContext`（不负责实际转发）。
- **请求追踪**：`RequestTracingMiddleware` 为网关请求打追踪信息。
- **网关异常处理**：`GatewayExceptionMiddleware` 置于最外层，统一网关级错误响应（`GatewayErrorResponse`）。
- **入口策略配置**：`XiHanGatewayOptions`（配置节 `XiHan:Web:Gateway`）开关灰度路由、请求追踪、限流、熔断，并配置请求超时、CORS 来源与全局 Header。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanWebGatewayModule` | 模块类，注册灰度路由服务 |
| `GrayRoutingMiddleware` | 灰度路由决策中间件 |
| `RequestTracingMiddleware` | 请求追踪中间件 |
| `GatewayExceptionMiddleware` | 网关级异常处理中间件 |
| `XiHanGatewayOptions` | 网关配置（灰度/追踪/限流/熔断/超时/CORS/全局 Header） |
| `UseGateway()` / `UseGrayRouting()` / `UseRequestTracing()` | 应用构建器扩展，挂载网关中间件 |

## 依赖模块

- 内部依赖：[XiHan.Framework.Web.Core](./web-core)、[XiHan.Framework.Traffic](./traffic)（灰度规则引擎的真源）、[XiHan.Framework.Authorization](./authorization)、[XiHan.Framework.MultiTenancy](./multitenancy)、[XiHan.Framework.Logging](./logging)、[XiHan.Framework.Serialization](./serialization)。

## 相关模块

- [XiHan.Framework.Traffic](./traffic) — 灰度路由规则引擎与流量治理能力的实现层。
- [XiHan.Framework.Web.Api](./web-api) — 应用侧的限流与熔断中间件（网关与业务服务可各自启用）。
