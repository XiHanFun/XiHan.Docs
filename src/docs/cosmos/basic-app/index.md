# XiHan.BasicApp 基础应用

**企业级中后台内核。** 后端基于 .NET 10 与 [XiHan.Framework](../framework/)，前端基于 Vue 3，开箱即带多租户、RBAC + ABAC 权限、代码生成与实时通信等能力。它既是一套可直接投产的中后台起点，也是学习 .NET + Vue 全栈实践、以及 XiHan.Framework 用法的最佳参考。

## 它是什么

XiHan.BasicApp 采用**前后端分离**架构：

- **后端** 遵循 DDD 分层与 CQRS，应用服务经**动态 API** 直接暴露为 REST 接口，无需写 Controller
- **前端** 使用 Vue 3 + TypeScript + Naive UI，Schema 驱动的列表页、权限/租户/偏好三重感知

系统内置完整的身份、权限、租户与审计能力。你可以拿它当项目脚手架直接改，也可以只读它的代码学习框架怎么用。

## 从这里开始

<div class="tip custom-block" style="padding-top: 8px">

1. [**快速开始**](./getting-started) —— 在本地把前后端跑起来（约 10 分钟）
2. [**系统架构**](./architecture) —— 看懂后端模块划分与前后端协作
3. [**权限模型**](./permissions) —— 理解 RBAC + ABAC、数据范围、多租户隔离

</div>

## 文档地图

**开始**

- [系统概述](./overview) —— 定位、技术栈、能力全景
- [快速开始](./getting-started) —— 环境要求、后端 / 前端 / 数据库启动、默认账号

**架构与二次开发**

- [系统架构](./architecture) —— 分层、模块（Saas / CodeGeneration / AI）、动态 API、菜单单一事实源、缓存
- [前端指南](./frontend) —— Schema 驱动列表页、三级权限、国际化 / 时区、实时通信
- [二次开发](./development) —— 加功能纵切片 / 加独立模块 / 加前端页

**核心能力**

- [身份与认证](./identity) —— 用户 / 角色 / 部门 / 菜单、多种登录、JWT 双令牌、2FA
- [权限模型](./permissions) —— RBAC + ABAC、权限码、数据范围、字段脱敏、版本门控
- [多租户与版本](./multi-tenancy) —— 字段级隔离、租户切换、版本（Edition）门控
- [消息中心](./messaging) —— 五类消息、模板、四渠道扇出、SignalR 通知与聊天
- [审计日志](./audit-log) —— 六类日志、自动脱敏、实体变更留痕
- [代码生成](./code-generation) —— 单表 / 树形 / 主从、全栈一键生成
- [AI 能力](./ai) —— Provider 库化管理、RAG 知识库、Agent / MCP

**参考**

- [功能清单](./features) —— 完整能力清单
- [部署](./deployment) —— Linux systemd / Windows 部署
- [更新日志](./changelog) —— 各版本变更记录

## 技术栈速览

| 端 | 关键技术 |
| --- | --- |
| 后端 | .NET 10 · XiHan.Framework 2.5.x · SqlSugar（PostgreSQL/MySQL/MariaDB）· Redis · SignalR · Serilog · Scalar |
| 前端 | Vue 3.5+ · TypeScript 5.9+ · Vite 6 · Naive UI · Pinia · Tailwind CSS 4 · Tiptap · vue-i18n |

## 在线体验

- **在线用例**：<https://basicapp.xihanfun.com>
- **源码**：[GitHub](https://github.com/XiHanFun/XiHan.BasicApp) · [Gitee](https://gitee.com/XiHanFun/XiHan.BasicApp)

## 与 XiHan.Framework 的关系

XiHan.BasicApp 构建在 [XiHan.Framework](../framework/) 之上——框架提供认证、授权、数据、缓存、事件总线、多租户、动态 API 等底层能力，BasicApp 在其上实现具体的中后台业务。想先理解底层机制，建议先读[框架快速上手](../framework/quickstart)。
