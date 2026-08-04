# 前端开发指南

XiHan.BasicApp 前端是一套 **Vue 3 + TypeScript + Naive UI** 的中后台应用，核心理念是**「Schema 驱动 + 后端单一事实源」**：列表页的搜索、表格、导出、导入由一份字段 Schema 生成；菜单、路由、权限码、枚举标签、字段脱敏规则全部来自后端。

本页是入口与日常速查，四个专题在分册里：

| 分册 | 内容 |
| --- | --- |
| [Schema 驱动页面](./frontend/schema-page) | 字段/页面 Schema、完整骨架、排序与搜索、导入导出、偏好与视图 |
| [路由与菜单](./frontend/routing) | 动态路由生成、组件解析、`coreComponentMap`、守卫、排查 |
| [权限与脱敏](./frontend/permission) | 三级过滤、`usePermission`、FLS、多租户 |
| [主题与国际化](./frontend/theming-i18n) | Tailwind v4、动态取色、i18n、枚举标签、时区、图标 |

分层结构、启动引导与请求链路时序见 [前端架构](./architecture/frontend)。

## 技术栈

| 领域 | 选型 |
| --- | --- |
| 框架 / 语言 / 构建 | Vue 3.5（`<script setup>`）· TypeScript · Vite |
| UI 库 | Naive UI |
| 状态 | Pinia（`pinia-plugin-persistedstate` 持久化） |
| 样式 | Tailwind CSS 4（CSS-first `@theme`，**preflight 关闭**） |
| 国际化 | vue-i18n（`legacy: false`） |
| 路由 | vue-router（默认 hash 模式） |
| 实时 | `@microsoft/signalr` |
| 富文本 | Tiptap（`RichTextEditor.vue`）+ md-editor-v3（`MdEditor.vue`） |
| 图标 | Iconify（**离线模式**） |
| 拖拽 | `@dnd-kit/vue`（**`@dnd-kit/geometry` 须保留为显式依赖**，类型解析需要） |

> 版本号以 `package.json` 为准。

## 源码组织

`src/` 薄、`packages/` 厚——应用装配的绝大部分逻辑在 `packages/` 里：

```text
src/                                # 别名 @
├── main.ts          # 引导：iconify 离线 → i18n → 请求绑定 → 路由守卫 → mount
├── App.vue          # NConfigProvider + 各 Provider + RouterView + 全局挂件
├── app/context.ts   # 注册应用上下文（视图 glob、api 实例、静态路由）
├── api/             # 请求封装与按域的 API 模块
├── router/          # 路由入口（守卫、静态路由，主体在 ~/router）
├── styles/index.css # Tailwind CSS 入口
└── views/           # 业务视图（approval / develop / file / identity / log /
                     #   message / oauth / openapi / setting / tenant / workbench / workflow）

packages/                           # 别名 ~
components(schema/rbac/chat) · composables · hooks · stores · layouts ·
router · request · locales · design · iconify · diagram · plugins ·
views · types · utils · constants
```

「我要改 X 去哪个文件」见 [代码地图](./project-structure#前端)。

## api 层

### 动态 API 客户端与资源工厂

| 工具 | 说明 |
| --- | --- |
| `createDynamicApiClient(controllerName)` | 按控制器名建低层客户端，暴露 `get`/`post`/`put`/`delete`；URL 拼成 `/{apiPrefix}/{控制器名}/{动作名}` |
| `createReadApi` / `createCommandApi` | 标准读 / 写封装 |
| `defineResource<...>({ query, command })` | **资源工厂**，一次生成 `page`/`detail`/`create`/`update`/`remove`，并保留 `query`/`command` 客户端以扩展自定义动作 |

标准 CRUD 直接用 `defineResource`，不要手拼：

```ts
export const userApi = defineResource<UserListItemDto, UserDetailDto, UserCreateDto, UserUpdateDto, UserPageRequest>({
  query: 'UserQuery',
  command: 'User',
})
```

### 动作名 = 后端方法名剥离动词前缀

后端是[动态 API](../framework/concepts/dynamic-api)，路由由方法名推导：`GetPositionPageAsync` → 动作名 `PositionPage`，`CreatePositionAsync` → `Position`。前端调用时用的**已经是剥离后的动作名**。

```ts
const positionQueryApi = createDynamicApiClient('PositionQuery')
const positionCommandApi = createDynamicApiClient('Position')

export const positionApi = {
  create: input => positionCommandApi.post('Position', input),
  update: input => positionCommandApi.put('Position', input),
  updateStatus: input => positionCommandApi.put('PositionStatus', input),
  delete: id => positionCommandApi.delete('Position', { id }),   // id 走查询串
  page: input => positionQueryApi.post('PositionPage', input),   // 分页 POST
}
```

::: danger id 不要拼成路径段
动态 API 的**路由段只由显式 `[FromRoute]` 参数产生**，普通参数一律落到查询串或请求体。写成 <code v-pre>delete(`Position/${id}`)</code> 会 404。
:::

### 分页统一走 POST

```ts
// POST /api/{Controller}/{Resource}Page，body = { conditions, page }
messageQueryApi.post<PageResult<EmailListItemDto>>('EmailPage', emailPageQueryDto)
```

请求体由 `createPageRequest` 组装：

- `conditions`：`keyword`（`{ value, fields[] }`）/ `filters`（`QueryFilter[]`，含 Between/In）/ `sorts`（`QuerySort[]`，带 `priority`）
- `page`：`{ pageIndex, pageSize }`（默认 `1` / `20`，`pageSize` 上限 `500`）

返回 `PageResult<TItem>`：`items` + `page`。辅助函数：`querySortsFromSchema`、`queryFilter`、`querySort`、`compactRecord`（去空字段）。

完整协议（`QueryOperator` / `SortDirection` 取值表）见 [接口对接指南](./api-guide#分页与查询协议)。

### 请求封装

`packages/request/index.ts` 的 `RequestClient` 负责请求头注入、响应解包、401 刷新重放、423 锁屏。完整时序见 [前端架构](./architecture/frontend#请求链路时序)。

业务代码拿到的是**已解包的强类型 `data`**，失败时 `catch` 到的 `error.message` 就是可直接展示的中文提示。

## 实时（SignalR）

`useSignalR(hubPath)`（`~/composables/useSignalR.ts`）按 `hubPath` 维护**全局单例连接**——通知 `/hubs/notification` 与聊天 `/hubs/chat` 各一条，互不干扰：

- 认证自动携带 JWT（`accessTokenFactory`），**无 token 不发起连接**（避免 401 风暴）。
- 传输回退 WebSockets → SSE → LongPolling；渐进式自动重连（1s/2s/5s/10s/30s），token 清除即放弃重连。
- API：`on(method, handler)` / `off` / `invoke(method, ...args)` / `start` / `stop` / `destroy`；登出时 `destroyAllSignalRConnections()` 一把清。

::: warning 载荷需应用侧手动投影
Hub 侧**没有** `long → string` 与枚举的自动转换器（那是 MVC JSON 管道的配置，不作用于 SignalR）。服务端推送前须手动投影，Hub 方法参数用 `string` 接收 ID。
:::

## 消息中心 UI

三个层次（`~/layouts/basic/` 与 `src/views/message/`）：

| 层 | 组件 | 行为 |
| --- | --- | --- |
| **顶部横幅** | `NotificationBanner.vue` + `use-banner-notices.ts` | 数据由服务端按有效期、角色/部门定向过滤后下发；按严重度+优先级取前 3 条轮播（5s，悬停暂停）。关闭记忆按公告 id 存 localStorage（30 天清理），后台重发即新 id、自然重现 |
| **强制阅读 + 登录弹窗** | `NotificationGate.vue` | 未读必读公告以遮罩拦截、逐条「我已阅读」（最高优先级）；清空后再逐条弹出普通登录后公告 |
| **通知中心页** | `src/views/message/notification/` | 发布、定向、统计等运营闭环 |

业务设计见 [消息中心](./messaging)。

## 其它常用能力

| 能力 | 组件 / 说明 |
| --- | --- |
| 富文本 | `RichTextEditor.vue`（Tiptap，含 Link/Image/Highlight/TextAlign/Underline 等扩展） |
| Markdown | `MdEditor.vue`（md-editor-v3） |
| JSON 编辑/查看 | `JsonEditor.vue`（vue3-ts-jsoneditor） |
| Cron 可视化 | `CronExpression.vue`（输入框 + 弹窗可视化，[任务调度](./scheduling)用） |
| 行展开 | `SchemaPage` 的 `#expand` 作用域插槽 |
| 锁屏 / 水印 | `LockScreen.vue` / `AppWatermark.vue`（全局挂在 `App.vue`） |
| 导入导出 | 导入 `SchemaImportDialog`；[导出中心](./file-storage#导出中心-file-export-center) |
| 头像/文件 URL | `useAvatarUrl` / `toAbsoluteFileUrl`——本地存储返回根相对路径 `/uploads/...`，**线上跨源须拼 `VITE_API_BASE_URL` origin** |
| 图表 | `packages/diagram` |

## 质量门禁

```bash
pnpm type-check          # vue-tsc --noEmit
npx eslint <改动文件> --fix
```

::: warning 别跑全仓 lint
`pnpm run lint:fix` 展开是 `oxlint --fix && eslint . --fix`，会扫全仓并改动与你无关的文件。**只对本次改动的文件跑**；误跑了用 `git checkout HEAD -- <非本次任务的文件>` 还原。
:::

## 下一步

- [Schema 驱动页面](./frontend/schema-page)：写列表页的完整手册
- [路由与菜单](./frontend/routing) · [权限与脱敏](./frontend/permission) · [主题与国际化](./frontend/theming-i18n)
- [前端架构](./architecture/frontend)：分层、引导与请求时序
- [接口对接指南](./api-guide)：响应信封与请求协议
- [常见问题](./faq)：白屏、图标空白、文件 404 等前端高频坑
