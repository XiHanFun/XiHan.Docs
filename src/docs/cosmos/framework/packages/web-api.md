# XiHan.Framework.Web.Api

> 动态 API：把应用服务自动暴露为 REST 接口，并装配一整条 Web 中间件管道（转发头、追踪、文化、异常/请求/API 日志、限流、熔断、CORS、鉴权、租户解析、OpenAPI 安全）。

- **NuGet**：`XiHan.Framework.Web.Api`
- **模块类**：`XiHanWebApiModule`
- **所在层**：Web 层

## 这是什么

XiHan.Framework.Web.Api 是构建 HTTP 后端的主力包。两件核心事：一是**动态 API**——你只写继承 `IApplicationService` 且标注 `[DynamicApi]` 的应用服务，框架在启动时自动为它们生成控制器与路由，你无需手写 Controller；二是**中间件管道**——模块在 `OnApplicationInitialization` 里按固定顺序装配好一整套 Web 中间件，开箱即用地处理转发头、追踪 ID、请求文化、日志、限流、熔断、CORS、认证、多租户解析、授权与端点映射。

新手可以把它理解为：引用它 + 写应用服务 = 一个带日志、鉴权、多租户、统一响应的 REST API。

## 何时使用

- 想把应用服务（`AppService`）直接变成 REST 接口，不想手写控制器与路由。
- 需要一套现成的 Web 管道：统一异常/请求/API 访问日志、TraceId、请求文化、CORS、JWT 认证、授权、多租户解析。
- 需要入站保护：可按配置开启限流（RateLimiter）与熔断（CircuitBreaking）。
- 需要反向代理（nginx/网关）后还原真实 scheme/host/客户端 IP（`UseForwardedHeaders`）。

## 安装

```bash
dotnet add package XiHan.Framework.Web.Api
```

## 启用

```csharp
[DependsOn(typeof(XiHanWebApiModule))]
public class MyModule : XiHanModule { }
```

## 核心能力

- **动态 API 发现与注册**：扫描已加载程序集，找出实现 `IApplicationService` 的类型，为标注 `[DynamicApi]`（定义在 [Application](./application) 包）的服务生成动态控制器。默认约定「剥离动词」路由（如 `CreateXxxAsync` → `POST /Xxx`）、Pascal 命名、`api` 前缀。
- **完整中间件管道**：在应用初始化时一次性装配（见下）。
- **统一响应与模型校验**：`XiHanApiResponseResultFilter` 统一包装响应；模型校验失败返回 400 并把错误放入 `Data`。
- **JWT 认证 + 授权**：按 `XiHan:Authentication:Jwt` 配置装配 JWT Bearer；支持从 query string 的 `access_token` 提取（SignalR 场景）；可要求全局登录（`RequireAuthenticatedUser`）。
- **CORS**：`XiHan:Web:Api:Cors` 配置来源/方法/头/凭据/预检缓存。
- **多租户解析**：`XiHanTenantResolveMiddleware` + Header/QueryString 两个租户贡献者。
- **OpenAPI 安全**：`XiHanOpenApiSecurityMiddleware` 对开放接口做签名、内容签名、加密与防重放校验。
- **异步日志**：访问/操作/异常/API/登录五类日志经内存队列 + 后台 Worker 异步落库（默认 Null 写入器，由上层应用覆盖）。

## 中间件管道顺序（`OnApplicationInitialization`）

框架按下列固定顺序装配（部分按配置开关）：

1. `UseForwardedHeaders`（反代转发头还原，必须最前）
2. `XiHanTraceIdMiddleware`（TraceId）
3. `UseXiHanRequestCulture`（请求文化）
4. `XiHanRequestContextMiddleware`（请求上下文）
5. `XiHanExceptionLoggingMiddleware`（异常日志）
6. `XiHanRequestLoggingMiddleware`（请求日志）
7. `UseRouting`
8. `UseRateLimiter`（当 `XiHan:Web:RateLimiting:IsEnabled=true`）
9. `XiHanCircuitBreakingMiddleware`（当 `XiHan:Web:CircuitBreaking:IsEnabled=true`）
10. `UseCors`
11. 本地对象存储静态文件（`XiHan:ObjectStorage:Local`，匿名直链）
12. `XiHanApiLoggingMiddleware`（API 访问日志）
13. `XiHanOpenApiSecurityMiddleware`（OpenAPI 安全）
14. `UseAuthentication`
15. `XiHanTenantResolveMiddleware`（租户解析）
16. `UseAuthorization`
17. `UseEndpoints`：`MapControllers()` + `MapOpenApi().AllowAnonymous()`

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanWebApiModule` | 模块类，装配服务与整条中间件管道 |
| `[DynamicApi]`（Application 包） | 标注应用服务/方法以生成动态 API |
| `DynamicApiControllerFeatureProvider` / `DefaultDynamicApiConvention` | 动态控制器发现与路由约定 |
| `DynamicApiOptions` | 动态 API 开关、路由前缀、命名与批量选项 |
| `XiHanCorsOptions` / `XiHanWebAuthOptions` | CORS 与认证/授权配置 |
| `XiHanRateLimitingOptions` / `XiHanCircuitBreakingOptions` | 限流与熔断配置（`XiHan:Web:RateLimiting`、`XiHan:Web:CircuitBreaking`） |
| `XiHanOpenApiSecurityOptions` | OpenAPI 签名/加密/防重放安全配置 |
| `XiHanController` | 控制器基类 |

## 依赖模块

- 内部依赖：[XiHan.Framework.Web.Core](./web-core)、[XiHan.Framework.Application](./application)、[XiHan.Framework.MultiTenancy](./multitenancy)、[XiHan.Framework.Serialization](./serialization)、[XiHan.Framework.Localization](./localization)、[XiHan.Framework.Logging](./logging)。
- 第三方核心：`Microsoft.AspNetCore.OpenApi`（OpenAPI 文档生成）。

## 相关模块

- [XiHan.Framework.Web.Docs](./web-docs) — 在动态 API 之上提供 Scalar/Swagger UI 文档界面。
- [动态 API](../concepts/dynamic-api) — 动态 API 的设计与约定说明。
- [模块生命周期](../concepts/lifecycle) — `ConfigureServices`/`OnApplicationInitialization` 等生命周期钩子。
