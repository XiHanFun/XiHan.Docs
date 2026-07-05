# 系统架构

XiHan.BasicApp 采用前后端分离。后端按**框架层 → 模块层 → 主应用层**组织，每个业务模块内部遵循 DDD 分层（Domain / Application / Infrastructure）。

## 后端分层

```text
┌─────────────────────────────────────────────────────────────┐
│                   XiHan.BasicApp.WebHost                      │
│                   (启动入口与模块聚合)                          │
├──────────────────────────────┬──────────────────────────────┤
│  XiHan.BasicApp.Saas         │  XiHan.BasicApp.CodeGeneration│
│  (RBAC / 多租户 / 审计)       │  (代码生成与模板管理)           │
├──────────────────────────────┴──────────────────────────────┤
│                   XiHan.BasicApp.Web.Core                     │
│              (Web 核心能力 / 动态 API / 网关 / 灰度)            │
├─────────────────────────────────────────────────────────────┤
│                     XiHan.BasicApp.Core                       │
│               (基础应用能力 / DDD / CQRS / 模块化)             │
├─────────────────────────────────────────────────────────────┤
│                      XiHan.Framework.*                        │
│      底层框架(认证 / 授权 / 数据 / 缓存 / 事件总线 / 多租户)     │
└─────────────────────────────────────────────────────────────┘
```

| 项目 | 说明 |
| --- | --- |
| `XiHan.BasicApp.Core` | 基础应用能力，集成 DDD / CQRS / 事件总线 / 认证 / 授权 / 缓存 / 多租户 |
| `XiHan.BasicApp.Web.Core` | Web 核心能力，动态 API / Scalar / SignalR / 网关 / 灰度路由 |
| `XiHan.BasicApp.Saas` | 核心业务模块：用户 / 角色 / 权限 / 菜单 / 部门 / 租户 / 配置 / 字典 / 文件 / 通知 / 日志 / 任务 |
| `XiHan.BasicApp.CodeGeneration` | 代码生成：数据源管理 / 表结构导入 / 模板配置 / 全栈生成 |
| `XiHan.BasicApp.WebHost` | 启动入口，聚合所有模块 |

`Saas` 与 `CodeGeneration` 都是**一等业务模块**，各自独立成项目、经 `[DependsOn]` 挂载到 `WebHost`。这也是你新增一个大功能域时的推荐范式：新建独立模块项目，而非往 `Saas` 里塞切片。

## 目录结构

```text
XiHan.BasicApp/
├── backend/                 # 后端（.NET 10）
│   ├── src/
│   │   ├── framework/       #   Core / Web.Core 基础能力
│   │   ├── modules/         #   Saas、CodeGeneration 模块
│   │   └── main/            #   WebHost 启动入口
│   ├── props/               #   共享 MSBuild 属性
│   ├── scripts/             #   部署与运维脚本
│   └── test/                #   测试项目
├── frontend/                # 前端（Vue 3 + Naive UI）
│   ├── src/                 #   应用源码
│   └── packages/            #   内部包
└── assets/                  # README 资源
```

## 后端如何暴露接口

BasicApp 用 [XiHan.Framework 的动态 API](../framework/concepts/dynamic-api)：**应用服务经 `[DynamicApi]` 直接暴露为 REST 接口，没有 Controller 样板**，Scalar 文档自动生成。

请求进来后会经过框架 [Web.Api 的中间件管道](../framework/concepts/lifecycle#真实示例-web-api-的中间件管道)：TraceId → 请求文化 → 认证 → **租户解析** → 授权 → 端点，因此每个请求天然带上租户上下文与权限判定。

菜单也是后端驱动的：后端 `PageRegistry` 作为**单一事实源**，统一注册菜单、路由、组件路径、权限码与国际化键，前端据此渲染。

## 前端结构

前端是 Vue 3 + TypeScript + Naive UI 的中后台应用，几个关键设计：

- **Schema 驱动列表页**：搜索 / 表格 / 导出由一份 Schema 配置生成，内置列设置、密度切换、高级搜索、个人视图保存、树形模式、列宽拖拽
- **三级权限过滤**：页面、字段、操作三级按权限码过滤，字段级脱敏；列设置与搜索偏好同步到后端，多端一致
- **状态管理**：Pinia；国际化：vue-i18n；样式：Tailwind CSS 4 + Naive UI

## 前后端协作数据流

```text
Vue 页面 (Schema 配置)
   │  发起请求（POST 分页约定，带 X-Language / X-Timezone 头）
   ▼
动态 API（应用服务方法）
   │  经中间件管道：认证 → 租户解析 → 授权 → 字段级脱敏
   ▼
应用服务 (CQRS) → 仓储 (SqlSugar) → PostgreSQL
   │
   └─ 写路径精准失效分布式缓存（授权快照 / 菜单 / 配置 / 字典）
```

## 下一步

- [权限模型](./permissions)：RBAC + ABAC 的落地细节
- [功能清单](./features)：各模块具体能力
- [框架核心概念](../framework/concepts/modularity)：理解底层模块化机制
