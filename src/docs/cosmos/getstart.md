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

- [Node.js](https://nodejs.org/) (版本 18 或更高)
- [pnpm](https://pnpm.io/installation) (推荐的包管理工具)
- 推荐 IDE：Visual Studio Code 配合 Volar 插件

## 入门指南

### 使用 XiHan.Framework (后端框架)

1. 创建新项目或在现有项目中安装 NuGet 包：

```bash
dotnet add package XiHan.Framework.Core
```

2. 在 Program.cs 中引入和配置框架：

```csharp
using XiHan.Framework.Core;

var builder = WebApplication.CreateBuilder(args);

// 添加 XiHan 框架服务
builder.Services.AddXiHanFramework();

// 其他配置...

var app = builder.Build();

// 使用 XiHan 中间件
app.UseXiHanFramework();

app.Run();
```

### 使用 XiHan.UI (前端组件)

1. 安装组件库：

```bash
# 使用 npm
npm install @xihan-ui/core

# 使用 pnpm
pnpm add @xihan-ui/core
```

2. 在 Vue 项目中全局引入：

```js
// main.js
import { createApp } from "vue";
import XiHanUI from "@xihan-ui/core";
import "@xihan-ui/core/dist/style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(XiHanUI);
app.mount("#app");
```

3. 按需引入组件：

```vue
<template>
  <xh-button type="primary">XiHan Button</xh-button>
</template>

<script setup>
import { XhButton } from "@xihan-ui/core";
</script>
```

### 使用 XiHan.BasicApp (完整应用)

如果您想快速启动一个完整的应用，可以直接使用 XiHan.BasicApp：

```bash
# 克隆仓库
git clone https://github.com/XiHanFun/XiHan.BasicApp.git

# 进入目录
cd XiHan.BasicApp

# 安装前端依赖
cd frontend
pnpm install

# 启动前端开发服务器
pnpm dev

# 在另一个终端中启动后端服务
cd ../backend
dotnet restore
dotnet run
```

## 下一步

- 探索 [Framework 框架文档](./framework/index.md) 了解后端开发框架
- 探索 [UI 组件文档](./ui/index.md) 了解前端视图组件
- 探索 [BasicApp 应用文档](./basicapp/index.md) 了解完整应用案例
