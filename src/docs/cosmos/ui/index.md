---
title: 前端-视图组件
index: false
next:
  text: "npm 包依赖关系"
  link: "./npm-package-dependency"
---

# XiHan UI 视图组件

XiHan UI 是一个基于 Vue 3 构建的高效、轻量级组件库，采用 monorepo 结构组织，提供丰富、美观的 UI 组件，帮助开发者快速构建现代化的用户界面。

## 主要特性

- **高效**: 基于 Vue 3 的 Composition API，提供更高的性能和更好的开发体验
- **模块化**: 采用 monorepo 结构，提供多个专业化的子包，可按需引入
- **类型安全**: 完全使用 TypeScript 开发，提供完善的类型定义
- **主题定制**: 灵活的主题系统，支持深浅色模式切换
- **国际化**: 内置多语言支持，轻松实现全球化应用

## 包结构

XiHan UI 包含以下主要子包：

- **xihan-ui**: 主包，整合所有子包
- **@xihan-ui/components**: UI 组件核心
- **@xihan-ui/utils**: 工具函数
- **@xihan-ui/hooks**: Vue 组合式函数
- **@xihan-ui/themes**: 主题系统
- **@xihan-ui/icons**: 图标组件
- **@xihan-ui/directives**: Vue 自定义指令
- **@xihan-ui/locales**: 国际化资源
- **@xihan-ui/constants**: 常量和类型定义
- **@xihan-ui/plugins**: Vue 插件

## 快速开始

### 安装

```bash
# 使用npm
npm install xihan-ui

# 使用yarn
yarn add xihan-ui

# 使用pnpm (推荐)
pnpm add xihan-ui
```

### 完整引入

```js
import { createApp } from "vue";
import App from "./App.vue";
import XiHanUI from "xihan-ui";
import "xihan-ui/dist/style.css";

const app = createApp(App);
app.use(XiHanUI);
app.mount("#app");
```

### 按需引入

```vue
<template>
  <xh-button type="primary">XiHan Button</xh-button>
</template>

<script setup>
import { XhButton } from "@xihan-ui/components";
import "@xihan-ui/components/dist/button/style.css";
</script>
```

## 技术栈

- **Vue 3**: 采用最新的 Vue 3 Composition API
- **TypeScript**: 全面使用 TypeScript 提供类型安全
- **TurboRepo**: 高效的 monorepo 管理工具
- **Unbuild**: 现代化的构建工具，生成 ESM 和 CommonJS 格式
- **Vite**: 用于本地开发和测试的构建工具

## 组件文档

- [组件概述](./overview)
- [安装指南](./installation)
- [基础组件](./basic)
- [表单组件](./form)
- [数据展示](./data-display)
- [导航组件](./navigation)
- [反馈组件](./feedback)
- [主题定制](./theming)
- [包依赖关系](./npm-package-dependency)
