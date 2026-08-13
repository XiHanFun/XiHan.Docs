---
title: 快速上手
index: false
---

# 快速上手

## 项目组成

本项目由 [XiHan.Framework](https://github.com/XiHanFun/XiHan.Framework)（开发框架）、[XiHan.UI](https://github.com/XiHanFun/XiHan.UI)（视图组件）、[XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp)（基础应用）组成。

- **开发框架子项目**：是后端模块化应用开发框架集成，基于 DotNet 构建。
- **视图组件子项目**：是前端组件库集成，基于 Vue 构建。
- **基础应用子项目**：为开发框架和视图组件的结合，为通用、全面的管理系统。

## 环境准备

在开始使用 XiHan 系列项目前，请确保您的开发环境已安装以下工具：

### 后端开发环境

- [.NET SDK](https://dotnet.microsoft.com/download) (版本 10 或更高)
- 推荐 IDE：Visual Studio 2022、JetBrains Rider 或 VS Code

### 前端开发环境

- [Node.js](https://nodejs.org/) (版本 24 或更高)
- [pnpm](https://pnpm.io/installation) (版本 10 或更高；XiHan.BasicApp 前端要求 11 或更高)
- 推荐 IDE：Visual Studio Code 配合 Vue - Official 插件

### 运行 XiHan.BasicApp 额外需要

- PostgreSQL 14+（或 MySQL / MariaDB）
- Redis 6.0+

## 入门指南

### 使用 XiHan.Framework (后端框架)

框架是**按模块安装**的，用什么装什么。搭一个 Web API 最少需要下面两个包：

1. 创建新项目并安装 NuGet 包：

```bash
dotnet new web -n MyApp
cd MyApp

# 动态 API + 中间件管道（依赖会自动带上 Core、Web.Core、Application 等）
dotnet add package XiHan.Framework.Web.Api

# API 文档（Scalar / Swagger UI），开发期推荐
dotnet add package XiHan.Framework.Web.Docs
```

2. 定义启动模块。框架里**一个"模块"就是一个继承 `XiHanModule` 的类**，用 `[DependsOn]` 声明它要用哪些能力：

```csharp
// MyAppModule.cs
using XiHan.Framework.Core.Modularity;
using XiHan.Framework.Web.Api;
using XiHan.Framework.Web.Docs;

namespace MyApp;

[DependsOn(
    typeof(XiHanWebApiModule),   // 动态 API + 中间件管道
    typeof(XiHanWebDocsModule)   // Scalar / Swagger 文档
)]
public class MyAppModule : XiHanModule
{
    // 可重写 ConfigureServices / OnApplicationInitialization 等生命周期钩子
}
```

3. 在 Program.cs 中加载模块树：

```csharp
using MyApp;
using XiHan.Framework.Web.Core.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 加载以 MyAppModule 为根的整棵模块依赖树（自动拓扑排序）
await builder.AddApplicationAsync<MyAppModule>();

var app = builder.Build();

// 触发所有模块的初始化钩子，装配中间件管道
await app.InitializeApplicationAsync();

await app.RunAsync();
```

4. 写第一个接口。框架用**动态 API** 暴露接口，只需写一个应用服务类，**不需要写 Controller**：

```csharp
// HelloAppService.cs
using XiHan.Framework.Application.Attributes;
using XiHan.Framework.Application.Services;

namespace MyApp;

[DynamicApi]
public class HelloAppService : ApplicationServiceBase
{
    public string GetGreeting(string name)
    {
        return $"你好，{name}！欢迎使用 XiHan.Framework。";
    }
}
```

`dotnet run` 后打开 `https://localhost:<端口>/scalar` 即可在线调用。

> 更详细的分步讲解、数据访问接入与可选模块清单，见[框架快速上手](https://framework.docs.xihanfun.com/quickstart)。

### 使用 XiHan.UI (前端组件)

> 当前是 `1.0.0-alpha.1` 预发布：不承诺语义化版本，接口仍会调整，请勿在生产环境依赖。
>
> npm 上的 `xihan-ui`（单包，最后一版 `0.9.8`）是重构前的旧实现，已全部标记弃用，与下面这套不是同一个东西。

1. 安装适配器与默认皮肤（包按 `@xihan-ui/*` 分发，装哪几个取决于用哪个适配器）：

```bash
# Vue 3 项目
pnpm add @xihan-ui/vue @xihan-ui/styles

# 原生 / 非 Vue 项目：自定义元素
pnpm add @xihan-ui/web-components @xihan-ui/styles
```

2. 在入口引入令牌与皮肤，并初始化主题：

```ts
// main.ts
import { createThemeController } from "@xihan-ui/tokens/runtime";
import { createApp } from "vue";
import App from "./App.vue";

// 令牌必须在皮肤之前：皮肤里不写兜底值
import "@xihan-ui/tokens/tokens.css";
import "@xihan-ui/styles";

createThemeController({ storageKey: "app-theme" });

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

后端启动后访问 `http://127.0.0.1:9708/scalar` 查看 API 文档。仓库当前 Development 与 Production 都监听 `9708`，部署时可通过 `Hosting:Urls` 或容器端口映射覆盖。

数据库连接串在 `backend/src/main/XiHan.BasicApp.WebHost/appsettings.Development.json` 中配置。

## 下一步

三个仓库各有独立文档站，从这里进去：

- 探索 [开发框架文档](https://framework.docs.xihanfun.com/) 了解后端开发框架
- 探索 [视图组件文档](https://ui.docs.xihanfun.com/) 了解前端视图组件
- 探索 [基础应用文档](https://basicapp.docs.xihanfun.com/) 了解完整应用案例

三者的关系与选型建议见[生态总览](./ecosystem)。
