---
title: 生态总览
index: false
---

# 生态总览

曦寒不是一个仓库，而是三个可以独立使用、也可以叠起来用的开源项目。本页讲它们各自是什么、彼此什么关系、你的场景该从哪个进去。

三者各有独立的文档站，本站只负责生态层面的导览与共同的贡献约定。

## 三个仓库

| 定位 | 项目 | 技术栈 | 文档站 |
| --- | --- | --- | --- |
| 后端基座 | [XiHan.Framework](https://github.com/XiHanFun/XiHan.Framework) | .NET 10 | [framework.docs.xihanfun.com](https://framework.docs.xihanfun.com/) |
| 组件层 | [XiHan.UI](https://github.com/XiHanFun/XiHan.UI) | TypeScript · Vue 3 · Web Components | [ui.docs.xihanfun.com](https://ui.docs.xihanfun.com/) |
| 基础应用 | [XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp) | .NET 10 + Vue 3 | [basicapp.docs.xihanfun.com](https://basicapp.docs.xihanfun.com/) |

### XiHan.Framework · 后端基座

快速、轻量、高效、用心的 .NET 现代模块化开发框架。是面向企业级应用的模块化后端框架，框架优先使用 .NET 原生功能，减少第三方依赖，理念现代、开箱即用、模块清晰、依赖可控、扩展可维护。属于曦寒懿（XiHanFun）开源生态的后端基座，拥有底座、组件、应用的完整生态。

按需引用的 NuGet 包，模块之间用 `[DependsOn]` 声明依赖，启动时自动拓扑排序装配。

### XiHan.UI · 组件层

快速、轻量、高效、用心的框架无关跨端组件库。是面向企业级前端的设计系统运行时，无头内核，Vue 3 与 Web Components 适配器。提供基础组件与 AI 组件，覆盖从中后台到 AI 对话的界面构建场景。属于曦寒懿（XiHanFun）开源生态的组件层，拥有底座、组件、应用的完整生态。

### XiHan.BasicApp · 基础应用

基于 .Net + Vue 的超高颜值通用中后台内核。开箱即用，提供 RBAC + ABAC 混合权限管理、多租户隔离、代码生成、实时通信、灰度发布、AI 等核心能力，满足新型企业级中后台管理场景。属于曦寒懿（XiHanFun）开源生态的基础应用，拥有底座、组件、应用的完整生态。

## 彼此什么关系

```
      ┌───────────────────────────────┐
      │        XiHan.BasicApp         │  企业级中后台，可直接投产
      │  后端 modules/  ·  前端 src/  │
      └───────┬───────────────┬───────┘
              │ 引用 NuGet    │ 引用 npm 包
      ┌───────▼───────┐  ┌────▼─────────────┐
      │ XiHan.Framework│  │   XiHan.UI      │
      │  .NET 模块包   │  │  设计系统运行时  │
      └───────────────┘  └─────────────────┘
```

两条依赖关系值得先说清楚：

- **BasicApp 的后端确实建立在 Framework 之上**：它引用框架的 NuGet 包，认证、授权、数据访问、多租户、动态 API 等底层能力都来自框架，BasicApp 只写业务。想看框架能力在真实业务里怎么落地，读 BasicApp 的源码是最快的路径。
- **BasicApp 的前端同样建立在 UI 之上**：自 BasicApp v4.0.0 起，前端整体用 XiHan.UI 重建，naive-ui 全量下线。想看组件库在真实业务里怎么用，读 BasicApp 前端的源码是最快的路径。

Framework 与 UI 之间没有依赖关系，一个是 .NET 后端包，一个是前端库，各自可以单独使用。

## 我该从哪个进去

| 你的场景 | 从这里开始 |
| --- | --- |
| 要在自己的 .NET 项目里用模块化框架、只取其中几个能力 | [开发框架 · 快速上手](https://framework.docs.xihanfun.com/quickstart) |
| 要一套现成的中后台系统，改改就能上线 | [基础应用 · 快速开始](https://basicapp.docs.xihanfun.com/getting-started) |
| 要在自己的前端项目里用组件库，或做跨框架的设计系统 | [视图组件 · 架构总览](https://ui.docs.xihanfun.com/overview) |
| 还在选型，想先看清楚适合不适合 | [为什么选择曦寒框架](https://framework.docs.xihanfun.com/why) · [为什么选择曦寒基础应用](https://basicapp.docs.xihanfun.com/why) |
| 想先跑起来看看长什么样 | [在线预览](https://basicapp.xihanfun.com) |

## 版本与发布

三个仓库**独立发版**，版本号互不对齐：

- Framework 发布到 [NuGet](https://www.nuget.org/profiles/XiHanFun)，版本真源是 `framework/props/version.props`
- BasicApp 随仓库发布，版本真源是 `backend/props/version.props`
- UI 发布到 [npm](https://www.npmjs.com/org/xihan-ui)，18 个公开包始终同一个版本号，版本真源是 `ui/packages/*/*/package.json`

各站导航栏右上角的徽章显示的就是该项目当前的版本与发布阶段。

## 参与进来

三个仓库在 GitHub（主库）、Gitee 与 GitCode（同步备库）上都可访问，Issue 与 PR 三个平台都收。共同的约定见[参与贡献指南](./contributing)与[行为公约](./code-of-conduct)。
