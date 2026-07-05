# XiHan.Framework.Web.Core

> Web 基础设施：托管环境抽象、HttpContext 支持、客户端信息识别（IP 地理定位与 UA 解析）与当前主体访问。

- **NuGet**：`XiHan.Framework.Web.Core`
- **模块类**：`XiHanWebCoreModule`
- **所在层**：Web 层

## 这是什么

XiHan.Framework.Web.Core 是所有 Web 相关包的公共底座。它把「当前请求」这件事在框架里落地：注册 `IHttpContextAccessor`，把 ASP.NET Core 的托管环境接入框架的 `IXiHanHostEnvironment`，用 `HttpContext.User` 作为框架 `ICurrentUser`/`ICurrentPrincipalAccessor` 的数据源，并提供一个「客户端信息识别」服务——从请求里解析出真实 IP、地理位置、浏览器/操作系统/设备。

其它 Web 包（Web.Api、Web.Docs、Web.Grpc、Web.RealTime、Web.Gateway）都依赖它。你自己一般不直接引用，而是通过上层包间接获得它。

## 何时使用

- 需要在服务里拿到「当前登录用户」——本包让框架的 `ICurrentUser` 在 Web 请求中可用。
- 需要识别请求来源：真实客户端 IP（穿透 `X-Forwarded-For`/`X-Real-IP`）、归属地、浏览器与设备（登录日志、审计、风控常用）。
- 需要一个统一的 `IApplicationBuilder`/托管环境访问入口，供模块化生命周期使用。

## 安装

```bash
dotnet add package XiHan.Framework.Web.Core
```

## 启用

```csharp
[DependsOn(typeof(XiHanWebCoreModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanWebCore(config)`，注册 `IHttpContextAccessor`、客户端信息提供器与当前主体访问器。

## 核心能力

- **托管环境接入**：把 ASP.NET Core 的 `IWebHostEnvironment` 环境名同步到框架的 `IXiHanHostEnvironment`。
- **HttpContext 与当前主体**：注册 `IHttpContextAccessor`；用 `HttpContextCurrentPrincipalAccessor` 让框架 `ICurrentUser` 读取 `HttpContext.User`。
- **客户端信息识别**：`IClientInfoProvider` 从当前请求解析 `ClientInfo`（IP、地理位置、浏览器、操作系统、设备）。
- **真实 IP 解析**：优先取 `X-Forwarded-For` 第一跳，其次 `X-Real-IP`，回退连接远端地址；识别回环（本机）与内网（局域网）。
- **IP 地理定位**：基于 `ip2region`（`IP2Region.Net`）离线库解析归属地，仅公网 IP 触发；数据库文件按候选路径自动探测，缺库时静默跳过。
- **UA 解析**：基于 `UAParser` 解析 User-Agent，得到浏览器/系统/设备名。
- **Claims 转换**：可选的 `XiHanClaimsTransformation`（通过 `TransformXiHanClaims()` 注册），支持声明映射。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IClientInfoProvider` / `ClientInfo` | 客户端信息提供器接口与结果模型（IP/位置/浏览器/系统/设备） |
| `HttpContextClientInfoProvider` | 默认实现：真实 IP 解析 + ip2region 地理定位 + UAParser 解析 |
| `XiHanClientInfoOptions` | 客户端信息配置（是否启用 IP 归属地、ip2region 库路径等） |
| `HttpContextCurrentPrincipalAccessor` | 以 `HttpContext.User` 作为当前主体，桥接框架 `ICurrentUser` |
| `XiHanClaimsTransformation` / `XiHanClaimsMapOptions` | 身份声明转换与声明映射选项 |

## 依赖模块

- 内部依赖：[XiHan.Framework.Core](./core)、[XiHan.Framework.Authentication](./authentication)、[XiHan.Framework.Security](./security)。
- 第三方核心：`IP2Region.Net`（离线 IP 归属地）与 `UAParser`（User-Agent 解析）。
- 该包 SDK 为 `Microsoft.NET.Sdk.Web`，可直接使用 ASP.NET Core 类型。

## 相关模块

- [XiHan.Framework.Web.Api](./web-api) — 在其之上装配完整的 REST API 中间件管道。
- [XiHan.Framework.Web.RealTime](./web-realtime)、[XiHan.Framework.Web.Grpc](./web-grpc)、[XiHan.Framework.Web.Gateway](./web-gateway) — 其它 Web 层包，均以本包为底座。
