# XiHan.Framework.Http

> HTTP 客户端：Polly 韧性策略（重试/熔断）、请求管道

- **NuGet**：`XiHan.Framework.Http`
- **模块类**：`XiHanHttpModule`
- **所在层**：基础设施层

## 这是什么

这个包在 `IHttpClientFactory` 之上做了一层封装，替你把 `HttpClient` 的注册、超时、日志、以及基于 **Polly** 的重试与熔断策略都配好。你既能注入一个高级 HTTP 服务 `IAdvancedHttpService` 直接发各类请求（GET/POST/PUT/PATCH/DELETE、上传/下载、批量），也能用字符串链式扩展 `"url".AsHttp()...` 快速发请求。此外还内置了可选的代理池管理与健康检查。

## 何时使用

- 需要调用外部 API，又不想手写 `HttpClient` 注册、超时、重试、熔断这些样板
- 需要开箱即用的韧性：瞬时错误自动重试、失败过多自动熔断，且能按请求粒度临时关闭
- 需要统一的请求/响应日志、文件上传下载、批量并发请求
- 需要通过代理池发请求，并对代理做可用性校验与健康检查

## 安装

```bash
dotnet add package XiHan.Framework.Http
```

## 启用

```csharp
[DependsOn(typeof(XiHanHttpModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里调用 `AddXiHanHttpModule(config)` 注册服务并配置各命名客户端；在应用初始化阶段调用 `StringHttpExtensions.Initialize(...)`，让字符串链式扩展（`AsHttp()`）可用。

## 核心能力

- **高级 HTTP 服务** `IAdvancedHttpService`：GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS，JSON/表单/字节/流，文件上传下载（带进度）、批量并发请求，统一返回 `HttpResult<T>`
- **Polly 韧性策略**：内置重试（`WaitAndRetryAsync`，间隔来自 `RetryDelaySeconds`）、超时（`Policy.TimeoutAsync`）、熔断（`CircuitBreakerAsync`）；可在单次请求上下文中关闭重试或熔断
- **命名客户端分组** `HttpGroupEnum`：`Remote`（远程）、`Local`（本地）及配置里声明的自定义客户端，各自独立超时/请求头/策略
- **字符串链式扩展**：`"https://api...".AsHttp().SetHeader(...)...`，无需注入即可发请求（`HttpRequestBuilder` 流式构建）
- **请求日志中间件** `HttpLoggingMiddleware`：统一记录请求/响应（可控内容长度与敏感数据）
- **代理池**：`IProxyPoolManager` / `IProxyValidator` + `ProxyPoolHealthCheckService` 后台健康检查（按配置开关）

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IAdvancedHttpService` | 高级 HTTP 服务接口（推荐注入使用） |
| `HttpResult` / `HttpResult<T>` | 统一响应结果封装 |
| `HttpRequestBuilder` | 流式请求构建器（由 `AsHttp()` 创建） |
| `XiHanHttpClientOptions` | HTTP 客户端配置（配置节 `XiHan:Http`）：超时、重试、熔断、日志、客户端集合等 |
| `XiHanProxyPoolOptions` | 代理池配置 |
| `HttpGroupEnum` | 客户端分组枚举（Remote / Local） |
| `IProxyPoolManager` / `IProxyValidator` | 代理池管理与校验 |

## 快速示例

注入 `IAdvancedHttpService` 发 GET 请求：

```csharp
public class WeatherClient
{
    private readonly IAdvancedHttpService _http;

    public WeatherClient(IAdvancedHttpService http)
    {
        _http = http;
    }

    public async Task<HttpResult<WeatherDto>> GetAsync(string city)
    {
        return await _http.GetAsync<WeatherDto>($"https://api.example.com/weather/{city}");
    }
}
```

字符串链式扩展（应用初始化后可用）：

```csharp
var result = await "https://api.example.com/data"
    .SetHeader("Authorization", "Bearer xxx")
    .AsHttp()
    .GetAsync<MyDto>();
```

配置节示例（`XiHan:Http`）：

```json
{
  "XiHan": {
    "Http": {
      "DefaultTimeoutSeconds": 60,
      "RetryDelaySeconds": [1, 5, 10],
      "CircuitBreakerFailureThreshold": 5,
      "IgnoreSslErrors": false
    }
  }
}
```

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Serialization](./serialization)（请求/响应序列化）
- 第三方核心：**Polly**（`Microsoft.Extensions.Http.Polly`，提供重试/超时/熔断策略）

## 相关模块

- [XiHan.Framework.Serialization](./serialization)
- [XiHan.Framework.Core](./core)
