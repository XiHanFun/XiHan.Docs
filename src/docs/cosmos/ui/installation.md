---
title: 安装指南
index: false
next:
  text: "基础组件"
  link: "./basic"
---

# XiHan UI 安装指南

本文将引导您如何在项目中安装和配置 XiHan UI 组件库。

## 环境要求

使用 XiHan UI 需要满足以下环境要求：

- **Node.js**: 版本 16.0.0 或更高
- **Vue**: 版本 3.3 或更高
- **包管理工具**: npm, yarn 或 pnpm (推荐使用 pnpm)

## 安装方式

XiHan UI 采用 monorepo 结构，提供了多个子包，您可以根据需要安装完整包或特定子包。

### 完整包安装

```bash
# 使用 npm
npm install xihan-ui

# 使用 yarn
yarn add xihan-ui

# 使用 pnpm (推荐)
pnpm add xihan-ui
```

### 按需安装子包

如果您只需要使用特定功能，可以仅安装所需的子包：

```bash
# 仅安装组件库核心
pnpm add @xihan-ui/components

# 仅安装工具函数
pnpm add @xihan-ui/utils

# 仅安装主题系统
pnpm add @xihan-ui/themes

# 仅安装图标库
pnpm add @xihan-ui/icons
```

## 完整引入

在 Vue 项目的入口文件中 (通常是 main.js 或 main.ts)，添加以下代码：

```js
import { createApp } from "vue";
import App from "./App.vue";

// 引入 XiHan UI
import XiHanUI from "xihan-ui";
// 引入组件库样式
import "xihan-ui/dist/style.css";

const app = createApp(App);

// 全局注册 XiHan UI
app.use(XiHanUI);

app.mount("#app");
```

## 按需引入

### 方法一：手动引入

针对每个需要使用的组件，单独引入：

```vue
<template>
  <xh-button type="primary">按钮</xh-button>
  <xh-input v-model="inputValue" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from "vue";
import { XhButton, XhInput } from "@xihan-ui/components";
// 引入组件样式
import "@xihan-ui/components/dist/button/style.css";
import "@xihan-ui/components/dist/input/style.css";

const inputValue = ref("");
</script>
```

### 方法二：使用自动导入插件（推荐）

1. 安装自动导入插件

```bash
# 安装 unplugin-vue-components 和 unplugin-auto-import
pnpm add -D unplugin-vue-components unplugin-auto-import
```

2. 配置插件

如果使用的是 Vite，在 vite.config.js 中添加以下配置：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { XiHanUIResolver } from "xihan-ui/resolvers";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [XiHanUIResolver()],
    }),
    Components({
      resolvers: [XiHanUIResolver()],
    }),
  ],
});
```

如果使用的是 webpack，在 webpack.config.js 中添加以下配置：

```js
const { VueLoaderPlugin } = require("vue-loader");
const Components = require("unplugin-vue-components/webpack");
const AutoImport = require("unplugin-auto-import/webpack");
const { XiHanUIResolver } = require("xihan-ui/resolvers");

module.exports = {
  plugins: [
    new VueLoaderPlugin(),
    AutoImport({
      resolvers: [XiHanUIResolver()],
    }),
    Components({
      resolvers: [XiHanUIResolver()],
    }),
  ],
};
```

3. 在组件中直接使用 XiHan UI 组件

配置完插件后，可以在组件中直接使用 XiHan UI 的组件，无需 import 导入：

```vue
<template>
  <xh-button type="primary">按钮</xh-button>
  <xh-input v-model="inputValue" placeholder="请输入内容" />
</template>

<script setup>
const inputValue = ref("");
</script>
```

## CDN 引入

通过 CDN 可以快速在页面中引入 XiHan UI：

```html
<!-- 引入 Vue -->
<script src="https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.js"></script>
<!-- 引入 XiHan UI 组件库 -->
<script src="https://cdn.jsdelivr.net/npm/xihan-ui@1.0.0/dist/index.full.js"></script>
<!-- 引入 XiHan UI 样式 -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/xihan-ui@1.0.0/dist/style.css"
/>

<script>
  // 全局注册
  const app = Vue.createApp(...)
  app.use(XiHanUI)
</script>
```

## 配置主题

XiHan UI 提供了强大的主题系统，支持通过 CSS 变量自定义主题：

```css
/* 创建自定义主题文件 theme.css */
:root {
  --xihan-primary-color: #1890ff;
  --xihan-success-color: #52c41a;
  --xihan-warning-color: #faad14;
  --xihan-error-color: #f5222d;
  --xihan-font-size-base: 14px;
  --xihan-radius-base: 4px;
  /* 更多自定义变量... */
}
```

然后在入口文件中引入该样式文件：

```js
import "xihan-ui/dist/style.css";
import "./theme.css"; // 确保在组件库样式之后引入
```

更多关于主题定制的详细信息，请参阅 [主题定制](./theming) 章节。

## 使用 TypeScript

XiHan UI 完全基于 TypeScript 开发，提供了完整的类型定义文件，可以与 TypeScript 项目无缝协作。

在 tsconfig.json 中，确保包含了 TypeScript 类型定义：

```json
{
  "compilerOptions": {
    "types": ["xihan-ui/types"]
  }
}
```

## 使用图标

XiHan UI 提供了专门的图标系统，可以单独使用：

```vue
<template>
  <xh-icon name="home" />
  <xh-icon name="user" />
</template>

<script setup>
import { XhIcon } from "@xihan-ui/icons";
</script>
```

## 使用钩子函数

XiHan UI 提供了多个实用的 Vue 组合式函数：

```js
import { useTheme } from "@xihan-ui/hooks";

const { isDark, toggleTheme } = useTheme();
```

## 常见问题

### 样式加载问题

如果组件显示不正常，请确保正确引入了样式文件：

```js
import "xihan-ui/dist/style.css";
```

### 组件未注册问题

如果使用自动导入方式，请确保配置了正确的解析器：

```js
// vite.config.js
import { XiHanUIResolver } from "xihan-ui/resolvers";

// 在 Components 和 AutoImport 插件中使用此解析器
```

### 版本兼容问题

确保您的 Vue 版本与 XiHan UI 兼容：

```bash
# 查看 Vue 版本
npm list vue
```

如果 Vue 版本低于 3.3.0，建议升级：

```bash
npm update vue
```

## 下一步

- 探索 [基础组件](./basic) 的用法
- 学习如何 [自定义主题](./theming)
- 查看完整的 [组件列表](./overview)
