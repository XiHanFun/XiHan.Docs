来源：https://docs.xihanfun.com/cosmos/getstart

# 快速上手

## 项目组成

本项目由 [XiHan.Framework](https://github.com/XiHanFun/XiHan.Framework)（开发框架）、[XiHan.UI](https://github.com/XiHanFun/XiHan.UI)（视图组件）、[XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp)（基础应用）组成。

- **开发框架子项目**：是后端开发框架，基于 .NET 构建，核心是微内核、能力图谱和管道执行。
- **视图组件子项目**：是框架无关的 Headless UI 组件库，提供 Vue、React 与 Web Components 适配器。
- **基础应用子项目**：为开发框架和视图组件的结合，为通用、全面的管理系统。

## 环境准备

在开始使用 XiHan 系列项目前，请确保您的开发环境已安装以下工具：

### 后端开发环境

- [.NET SDK](https://dotnet.microsoft.com/download) (版本 10 或更高)
- 推荐 IDE：Visual Studio 2026、JetBrains Rider 或 VS Code

### 前端开发环境

- [Node.js](https://nodejs.org/) (版本 24 或更高)
- [pnpm](https://pnpm.io/installation) (版本 10 或更高；XiHan.BasicApp 前端要求 11 或更高)
- 推荐 IDE：Visual Studio Code 配合 Vue - Official 插件

### 运行 XiHan.BasicApp 额外需要

- PostgreSQL 14+（或 MySQL / MariaDB）
- Redis 6.0+

## 入门指南

### 使用 XiHan.Framework (后端框架)

框架是**按能力装配**的，用什么装什么。业务写成**操作契约**，一份契约可以同时经 HTTP、gRPC、MCP 和命令行暴露。搭一个 Web API 最少需要下面三个包：

1. 创建新项目并安装 NuGet 包：

```bash
dotnet new web -n HelloXiHan
cd HelloXiHan

# 内核、ASP.NET Core 宿主与内存本地化
dotnet add package XiHan.Framework.Profiles.Minimal --prerelease

# HTTP 协议适配器
dotnet add package XiHan.Framework.Protocols.Http --prerelease

# 操作源生成器，只在编译时运行，不进入运行时依赖
dotnet add package XiHan.Framework.Kernel.Generators --prerelease
```

2. 写第一个操作。新建 `Greet.cs`，操作 ID `greetings.create` 的资源是 `greetings`、动词是 `create`，HTTP 适配器据此推导出 `POST /greetings`，**不需要写 Controller**：

```csharp
using XiHan.Framework.Kernel.Operations;
using XiHan.Framework.Primitives;

namespace HelloXiHan;

[Operation(Id, Stability = Stability.Experimental, Expose = Expose.Http)]
public sealed class Greet : IOperation<GreetRequest, GreetResponse>
{
    public const string Id = "greetings.create";

    public ValueTask<Result<GreetResponse>> HandleAsync(GreetRequest request, InvocationContext context)
        => ValueTask.FromResult(Result.Success(new GreetResponse($"Hello, {request.Name}!", context.TraceId)));
}

public sealed record GreetRequest(string Name);

public sealed record GreetResponse(string Message, string TraceId);
```

3. 登记序列化类型。内核不经反射序列化，新建 `AppJsonContext.cs`，把请求与响应类型登记到源生成的序列化上下文：

```csharp
using System.Text.Json.Serialization;

namespace HelloXiHan;

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase, PropertyNameCaseInsensitive = true)]
[JsonSerializable(typeof(GreetRequest))]
[JsonSerializable(typeof(GreetResponse))]
internal sealed partial class AppJsonContext : JsonSerializerContext;
```

4. 写特性。框架里**一个"特性"就是一个实现 `IFeature` 的类**，新建 `GreetingsFeature.cs`，清单声明它依赖哪些能力，`Configure` 调用源生成器产出的 `AddGeneratedOperations` 登记操作：

```csharp
using XiHan.Framework.Kernel;
using XiHan.Framework.Kernel.Hosting;
using XiHan.Framework.Primitives;
using XiHan.Framework.Primitives.Manifests;

namespace HelloXiHan;

public sealed class GreetingsFeature : IFeature
{
    public Manifest Manifest { get; } = new()
    {
        Id = "xihan.hello.greetings",
        Package = "HelloXiHan",
        Version = "1.0.0",
        Primitives = 1,
        Stability = Stability.Experimental,
        Kind = ManifestKind.Capability,
        Requires = [new CapabilityRequirement(KernelCapabilities.Hosting, KernelCapabilities.Version)],
        Entry = typeof(GreetingsFeature).FullName,
    };

    public void Configure(FeatureContext context) => context.AddGeneratedOperations();
}
```

5. 在 Program.cs 中把特性交给内核：

```csharp
using HelloXiHan;
using XiHan.Framework.Hosting.AspNetCore;
using XiHan.Framework.Profiles.Minimal;
using XiHan.Framework.Protocols.Http;
using XiHan.Framework.Protocols.Http.Routing;

var builder = WebApplication.CreateBuilder(args);

// 把特性交给内核：求解能力图谱，按拓扑顺序调用各特性的 Configure
builder.AddXiHan(xihan => xihan
    .UseMinimalProfile()
    .UseFeature<HttpProtocolFeature>()
    .UseFeature<GreetingsFeature>());

var app = builder.Build();

app.UseXiHan();            // HTTP 请求进入内核管道
app.MapXiHanHealth();      // /health/startup、/health/ready、/health/live
app.MapXiHanOperations();  // 按操作登记表映射路由

app.Run();
```

6. 运行：

```bash
dotnet run --urls http://localhost:5000
```

启动日志会先打印已解析的能力图谱，再打印管道顺序。另开一个终端调用操作，返回 `201 Created` 和 `{"message":"Hello, Ada!","traceId":"…"}`：

```bash
curl -i -X POST http://localhost:5000/greetings -H "Content-Type: application/json" -d '{"name":"Ada"}'
```

> 换成 Standard 组合、观察管道里多出的认证、租户、授权、幂等和事务，以及完整示例，见[框架快速上手](https://framework.docs.xihanfun.com/quickstart)。

### 使用 XiHan.UI (前端组件)

> npm 上的 `xihan-ui`（单包，最后一版 `0.9.8`）是重构前的旧实现，已全部标记弃用，与下面这套不是同一个东西。

1. 安装适配器与默认皮肤（包按 `@xihan-ui/*` 分发，装哪几个取决于用哪个适配器）：

```bash
# Vue 项目
pnpm add @xihan-ui/vue @xihan-ui/styles

# React 项目
pnpm add @xihan-ui/react @xihan-ui/styles

# 原生 / 其它框架：自定义元素
pnpm add @xihan-ui/web-components @xihan-ui/styles
```

2. 在入口引入皮肤，并初始化视觉环境：

```ts
// main.ts
import { createVisualEnvironmentController } from "@xihan-ui/tokens/runtime";
import { createApp } from "vue";
import App from "./App.vue";

// 皮肤入口自带层序声明与令牌，只引这一行；单独引 tokens.css 是只要令牌不要皮肤的路径
import "@xihan-ui/styles";

// 把七轴视觉环境写到 <html> 上，并显式处理持久化失败
createVisualEnvironmentController({
  root: document.documentElement,
  storageKey: "app-visual-environment",
  onStorageError: detail => console.error("视觉偏好持久化失败", detail),
  initial: { mode: "system", motion: "system", transparency: "system" },
});

createApp(App).mount("#app");
```

3. 组件从主入口按需取，不需要注册插件（包声明了 `sideEffects: false`，打包器会摇掉没用到的）：

```vue
<template>
  <XhButton variant="solid" tone="brand">曦寒按钮</XhButton>
</template>

<script setup lang="ts">
import { XhButton } from "@xihan-ui/vue";
</script>
```

> 完整的安装选项、样式的三种接法、服务端渲染注意事项，见[组件库安装与接入](https://ui.docs.xihanfun.com/installation)。

### 使用 XiHan.BasicApp (完整应用)

如果您想快速启动一个完整的应用，可以直接使用 XiHan.BasicApp：

```bash
# 克隆仓库
git clone https://github.com/XiHanFun/XiHan.BasicApp.git

# 启动后端
cd XiHan.BasicApp/backend
dotnet run --project src/main/XiHan.BasicApp.WebHost --launch-profile Development

# 在另一个终端中启动前端
cd XiHan.BasicApp/frontend
pnpm install
pnpm dev
```

后端启动后访问 `http://127.0.0.1:9708/scalar` 查看 API 文档，首次启动会自动建表并初始化种子数据。

数据库连接串在 `backend/src/main/XiHan.BasicApp.WebHost/appsettings.Development.json` 中配置。

## 下一步

三款主推产品各有独立文档站，从这里进去：

- 探索 [开发框架文档](https://framework.docs.xihanfun.com/) 了解后端开发框架
- 探索 [视图组件文档](https://ui.docs.xihanfun.com/) 了解前端视图组件
- 探索 [基础应用文档](https://basicapp.docs.xihanfun.com/) 了解完整应用案例

三者的关系与选型建议见[生态总览](./ecosystem)；用 Claude Code、Cursor 等 AI 编程工具开发时，先按[AI 辅助开发](./ecosystem#ai-辅助开发)接入框架与组件库的 MCP 服务端。
