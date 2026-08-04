# 架构总览

XiHan.BasicApp 是一套基于 [XiHan.Framework](../framework/index) 构建的多租户中后台应用，前后端分离。本页给全景与索引，**细节在四个分册里**：

| 分册 | 内容 |
| --- | --- |
| [后端架构](./architecture/backend) | 项目分层、模块装配、DDD 三层、DI 约定、菜单事实源、种子 `Order` 段、框架引用切换 |
| [前端架构](./architecture/frontend) | 五层结构、启动引导、请求链路时序、依赖归属、环境变量 |
| [请求生命周期](./architecture/request-lifecycle) | 中间件管道逐段说明、401/403/423 分水岭、UoW 收尾时序 |
| [数据模型](./architecture/data-model) | 实体基类、主键与审计列、多租户列语义、软删与索引规范、全部数据表清单 |
| [缓存与异步](./architecture/caching-async) | 缓存条目、精准失效、队列消费、崩溃恢复 |

## 全景

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                        XiHan.BasicApp.WebHost                             │
│        启动入口 Program.cs + 聚合模块 XiHanBasicAppWebHostModule           │
│  [DependsOn] Saas / CodeGeneration / AI / Workflow / Observability / Mcp  │
│        健康检查 / MCP Server / Telegram Webhook / /health 端点            │
├───────────────┬──────────────────┬───────────────┬───────────────────────┤
│ BasicApp.Saas │ BasicApp.        │ BasicApp.AI   │ BasicApp.Workflow     │
│ 身份/权限/租户 │  CodeGeneration  │ Provider 库化 │ 流程定义/实例/待办     │
│ 消息/文件/日志 │ 数据源/表结构/   │ 知识库 RAG /  │ SqlSugar 持久化存储    │
│ 任务/审批/聊天 │ 模板/全栈生成    │ 提示词库      │ 待办站内通知           │
├───────────────┴──────────────────┴───────────────┴───────────────────────┤
│                        XiHan.BasicApp.Web.Core                            │
│      Web 能力聚合：动态 API / Scalar 文档 / SignalR / 网关灰度             │
├──────────────────────────────────────────────────────────────────────────┤
│                          XiHan.BasicApp.Core                              │
│  基座抽象：实体/DTO 基类（多租户审计）、查询服务标记接口、聚合框架能力模块    │
├──────────────────────────────────────────────────────────────────────────┤
│                            XiHan.Framework.*                              │
│ 认证 / 授权 / 数据(SqlSugar) / 缓存 / 事件总线 / 多租户 / 工作流 / AI / Bot │
└──────────────────────────────────────────────────────────────────────────┘
```

四个业务模块都是**一等模块**，各自独立成项目、经 `[DependsOn]` 挂到 `WebHost`，彼此不直接依赖、均以 `Saas` 为共享基座。新增大功能域时的推荐范式也是**新建独立模块项目，而非往 `Saas` 里塞切片**。

## 目录结构

```text
XiHan.BasicApp/
├── backend/                 # 后端（.NET）
│   ├── src/
│   │   ├── framework/       #   Core / Web.Core 基座
│   │   ├── modules/         #   Saas、CodeGeneration、AI、Workflow 四个业务模块
│   │   └── main/            #   WebHost 启动入口
│   ├── props/               #   共享 MSBuild 属性（含 framework.props 源码/NuGet 切换）
│   ├── scripts/             #   部署与运维脚本
│   └── test/                #   测试项目
├── frontend/                # 前端（Vue 3 + Naive UI）
│   ├── src/                 #   应用装配与业务视图（api / app / router / styles / views）
│   └── packages/            #   可复用内核（components / request / router / stores / locales …）
└── assets/                  # README 资源
```

## 四条贯穿全局的设计

理解这四条，大部分「为什么这么写」的疑问就解开了。

### 一、一切皆模块

能力以 `XiHanModule` + `[DependsOn]` 为装配单元，框架按依赖图拓扑排序、逐阶段初始化。加一块能力就是加一行 `[DependsOn]`，减一块就是删一行。→ [后端架构](./architecture/backend#模块装配)

### 二、后端驱动前端

菜单、路由、组件路径、权限码、国际化键、枚举标签、字段脱敏规则，**事实源全部在后端**。前端只提供视图组件与文案。新增页面的主要工作因此落在后端 `PageRegistry` 与权限定义上。→ [后端架构 · 菜单](./architecture/backend#菜单-后端单一事实源)

### 三、没有 Controller

应用服务打 `[DynamicApi]` 即成 REST 接口，路由由方法名推导。这带来两个必须记住的约定：**分页方法要显式标 `[HttpPost]`**、**路由段只由显式 `[FromRoute]` 参数产生**。→ [接口对接指南](./api-guide#动态-api-路由推导规则)

### 四、读缓存、写失效、耗时异步

热点读走 Redis 分布式缓存，写路径精准失效（且必须排队到事务提交之后）；耗时动作入队由后台服务消费，数据库表是事实源、队列只承载待办工作。→ [缓存与异步](./architecture/caching-async)

## 前后端协作数据流

```text
Vue 页面（Schema 驱动列表页）
   │  分页走 POST，body = { conditions, page }；附 X-Language / X-Timezone 头
   ▼
动态 API（*AppService / *QueryService，[DynamicApi] 暴露，无 Controller）
   │  中间件管道：转发头 → TraceId → 请求文化 → 路由 → CORS → 认证
   │                → 租户解析 → 会话闸门(401/423) → 授权(授权快照)
   ▼
应用服务（写侧 [UnitOfWork]） / 查询服务（读侧投影 + 缓存 + FLS 门控）
   │  → 领域服务（业务规则） → 仓储（SqlSugar，自动挂租户/软删过滤） → 数据库
   ▼
UoW 收尾：本地事件(提交前) → 提交 → 分布式事件(提交后) → 精准失效缓存 → 队列入队
   ▲
   └─ 响应统一 ApiResponse 信封；本地化覆盖 Data；时间按 X-Timezone 换算
```

逐段解释见 [请求生命周期](./architecture/request-lifecycle)。

## 下一步

- [后端架构](./architecture/backend) → [请求生命周期](./architecture/request-lifecycle) → [数据模型](./architecture/data-model)：后端开发者的推荐顺序
- [前端架构](./architecture/frontend) → [前端开发指南](./frontend)：前端开发者的推荐顺序
- [二次开发](./development)：动手加功能的完整清单
- [权限模型](./permissions) / [多租户与版本](./multi-tenancy)：两个最容易误解的机制
