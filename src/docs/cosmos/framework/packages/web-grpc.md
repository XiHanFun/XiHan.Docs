# XiHan.Framework.Web.Grpc

> gRPC 服务端集成：把 ASP.NET Core gRPC 接入框架的模块化生命周期。

- **NuGet**：`XiHan.Framework.Web.Grpc`
- **模块类**：`XiHanWebGrpcModule`
- **所在层**：Web 层

## 这是什么

XiHan.Framework.Web.Grpc 让框架应用具备 gRPC 服务端能力。模块在 `ConfigureServices` 中调用 `AddXiHanWebGrpc()`（内部即 `AddGrpc()`），把 gRPC 服务注册进 DI 容器。它是一层轻量接入：把标准 `Grpc.AspNetCore` 纳入框架的 `[DependsOn]` 模块体系，gRPC 服务实现与 `.proto` 契约由你的应用侧定义与映射。

## 何时使用

- 需要在框架应用中对外提供 gRPC 服务（服务间高性能 RPC 通信）。
- 希望 gRPC 的注册随框架模块化生命周期统一管理，而不是散落在启动代码里。

## 安装

```bash
dotnet add package XiHan.Framework.Web.Grpc
```

## 启用

```csharp
[DependsOn(typeof(XiHanWebGrpcModule))]
public class MyModule : XiHanModule { }
```

## 核心能力

- **gRPC 服务注册**：`AddXiHanWebGrpc()` 封装 `AddGrpc()`，将 gRPC 服务端能力接入框架 DI。
- **模块化接入**：以 `XiHanWebGrpcModule` 参与 `[DependsOn]` 组合，与其它 Web 模块共存于同一应用。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanWebGrpcModule` | 模块类，注册 gRPC 服务端 |
| `AddXiHanWebGrpc()` | 服务集合扩展，等价于框架内的 `AddGrpc()` 接入 |

## 依赖模块

- 内部依赖：[XiHan.Framework.Web.Core](./web-core)、[XiHan.Framework.Serialization](./serialization)。
- 第三方核心：`Grpc.AspNetCore`（gRPC 服务端运行时）。

## 相关模块

- [XiHan.Framework.Web.Api](./web-api) — 若同时对外提供 REST 与 gRPC，可与本包并存。
