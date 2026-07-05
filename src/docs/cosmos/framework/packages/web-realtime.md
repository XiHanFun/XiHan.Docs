# XiHan.Framework.Web.RealTime

> 实时通信：基于 SignalR 的服务端集成，提供 Hub 基类、连接管理、按用户/组/全体的实时通知服务与统一 JSON 序列化。

- **NuGet**：`XiHan.Framework.Web.RealTime`
- **模块类**：`XiHanWebRealTimeModule`
- **所在层**：Web 层

## 这是什么

XiHan.Framework.Web.RealTime 把 ASP.NET Core SignalR 接入框架，用于服务器主动向客户端推送消息（通知、聊天、进度、在线状态等）。它提供一个 Hub 基类 `XiHanHub`（自动在连接/断开时维护用户与连接的映射）、一个连接管理器 `IConnectionManager`、一个泛型实时通知服务 `IRealtimeNotificationService<THub>`（支持发给单个用户、用户列表、指定组或全体），并统一配置 SignalR 的 JSON 协议与超时/保活等选项。

## 何时使用

- 需要服务端向前端**主动推送**：站内通知、消息中心、聊天、任务进度、实时状态。
- 需要按「用户 / 用户列表 / 组 / 全体」定向推送，并管理用户与连接的映射关系。
- 需要在 SignalR 场景下用 JWT 鉴权（token 经 query string 的 `access_token` 传入，由 Web.Api 侧支持）。

## 安装

```bash
dotnet add package XiHan.Framework.Web.RealTime
```

## 启用

```csharp
[DependsOn(typeof(XiHanWebRealTimeModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanSignalRWithJson(config)`，注册 SignalR、连接管理器、用户 ID 提供器与实时通知服务，并从 `XiHan:Web:RealTime:SignalR` 绑定选项。

## 核心能力

- **Hub 基类**：`XiHanHub` 在 `OnConnectedAsync`/`OnDisconnectedAsync` 自动登记/注销用户与连接，暴露 `ConnectionId`/`UserId`/`UserName`。
- **连接管理**：`IConnectionManager` 维护用户 ID 到连接 ID 的映射；`IXiHanUserIdProvider` 提供 SignalR 用户标识。
- **实时通知服务**：`IRealtimeNotificationService<THub>` 提供 `SendToUserAsync` / `SendToUsersAsync` / `SendToGroupAsync` / `SendToAllAsync` 及分组增删。
- **JSON 协议配置**：`AddJsonProtocol` 设定 `PayloadSerializerOptions` 为 CamelCase 命名、非缩进输出。
- **Hub 选项桥接**：把 `XiHanSignalROptions`（保活间隔、客户端超时、握手超时、最大消息大小、并发调用数等）映射到 SignalR `HubOptions`。
- **鉴权与异常过滤**：`AuthorizeHubAttribute` 与 `HubExceptionFilter` 支持 Hub 授权与异常处理。

## 序列化约定（重要）

SignalR 的 JSON 协议仅配置了 CamelCase 命名，**未注册** `long → string`、枚举等自动转换器。因此推送的载荷需在**应用侧手动投影**为客户端可安全消费的形状（例如把 `long` ID 显式转成 `string`），Hub 方法参数也应以 `string` 接收，避免 JS 端大整数精度丢失与枚举歧义。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanHub` / `IXiHanHub` | Hub 基类与接口，自动维护连接映射 |
| `IConnectionManager` / `ConnectionManager` | 用户与连接映射管理 |
| `IRealtimeNotificationService<THub>` | 泛型实时通知服务（用户/列表/组/全体推送） |
| `IXiHanUserIdProvider` / `XiHanUserIdProvider` | SignalR 用户标识提供器 |
| `XiHanSignalROptions` | SignalR 选项（`XiHan:Web:RealTime:SignalR`） |
| `AuthorizeHubAttribute` / `HubExceptionFilter` | Hub 授权特性与异常过滤器 |
| `NotificationHub` / `NotificationMessage` | 内置通知 Hub 与消息模型 |

## 依赖模块

- 内部依赖：[XiHan.Framework.Web.Core](./web-core)、[XiHan.Framework.Authentication](./authentication)。
- 第三方核心：ASP.NET Core 内置 SignalR（`Microsoft.AspNetCore.SignalR`）。

## 相关模块

- [XiHan.Framework.Web.Api](./web-api) — 提供 JWT 认证并支持从 query string 的 `access_token` 取 token（SignalR 场景）。
