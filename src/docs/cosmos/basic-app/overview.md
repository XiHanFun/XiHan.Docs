# 系统概述

XiHan.BasicApp 是一个**企业级中后台内核**：后端基于 .NET 10 与 [XiHan.Framework](../framework/)，前端基于 Vue 3。它把中后台系统里"每个项目都要重做一遍"的部分——身份、权限、租户、审计、代码生成、实时通信——一次性做好，让你专注在真正的业务上。

## 定位

- **可直接投产的中后台起点**：完整的 RBAC + ABAC 权限、多租户、审计闭环，改改业务就能上线
- **全栈实践参考**：一套规范的 .NET + Vue 前后端分离工程，从契约到 UI 数据流都可借鉴
- **框架用法样板**：XiHan.Framework 各能力在真实业务里怎么用，这里有活的例子

## 架构风格

系统采用**前后端分离**：

- **后端**遵循 DDD 分层与 CQRS，应用服务经**动态 API** 直接暴露为 REST 接口——不写 Controller，接口即服务方法
- **前端**使用 Vue 3 + TypeScript + Naive UI，列表页由 **Schema 驱动**，搜索/表格/导出按配置生成，并对权限、租户、个人偏好三重感知

详见 [系统架构](./architecture)。

## 能力全景

| 领域 | 关键能力 |
| --- | --- |
| 身份与认证 | 用户/角色/部门/菜单；JWT 双令牌；账号密码、邮箱/短信验证码、OAuth2（GitHub/Google/QQ）、2FA |
| 权限 | RBAC + ABAC，权限码 `resource:action:scope`，数据范围，字段级脱敏，会话角色激活 |
| 多租户 | 字段级隔离，邮箱全局唯一登录，租户版本（Edition）权限白名单门控 |
| 审计日志 | 访问/API/操作/异常/登录/实体变更 六类日志，落库前自动脱敏 |
| 代码生成 | 单表/树形/主从三模式，实体→DTO→API→前端页一键生成，Scriban 模板 |
| 平台能力 | 动态 API、菜单单一事实源、分布式缓存、网关灰度、消息模板、SignalR 实时 |
| 前端体验 | Schema 驱动列表、命令面板、多标签、消息中心、偏好中心、富文本、时区切换 |

完整清单见 [功能清单](./features)。

## 技术栈

### 后端

| 技术 | 说明 |
| --- | --- |
| .NET 10 / C# | 运行时与语言 |
| XiHan.Framework 2.5.x | 自研模块化应用框架 |
| SqlSugar | ORM，支持 PostgreSQL / MySQL / MariaDB |
| Redis | 分布式缓存与分布式锁 |
| SignalR | 实时通信 |
| Serilog | 结构化日志 |
| Scalar | API 文档 |

### 前端

| 技术 | 说明 |
| --- | --- |
| Vue 3.5+ | UI 框架 |
| TypeScript 5.9+ | 类型系统 |
| Vite 6 | 构建工具 |
| Naive UI | 组件库 |
| Pinia | 状态管理 |
| Tailwind CSS 4 | 原子化 CSS |
| Tiptap | 富文本编辑器 |
| vue-i18n | 国际化 |

## 下一步

- [快速开始](./getting-started)：在本地把系统跑起来
- [系统架构](./architecture)：理解后端模块与前后端协作
- [权限模型](./permissions)：RBAC + ABAC 与多租户隔离
