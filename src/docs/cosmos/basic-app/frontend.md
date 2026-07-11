# 前端指南

XiHan.BasicApp 前端是一套 **Vue 3 + TypeScript + Naive UI** 的中后台应用，核心理念是**「Schema 驱动 + 后端单一事实源」**：列表页的搜索、表格、导出、导入由一份字段 Schema 生成；菜单、路由、权限码、枚举标签、字段脱敏规则全部来自后端。本页面向前端二次开发者，讲清「怎么写一个列表页、怎么接权限与脱敏、怎么接实时与国际化」。

## 技术栈

| 领域 | 选型 | 版本约束（以 `package.json` 为准） |
| --- | --- | --- |
| 框架 | Vue 3.5（`<script setup>` + `<template>`） | `^3.5` |
| 语言 | TypeScript | `^6` |
| 构建 | Vite | `^8` |
| UI 库 | Naive UI | `^2.44` |
| 状态 | Pinia（`pinia-plugin-persistedstate` 持久化） | `^3` |
| 样式 | Tailwind CSS 4（CSS-first `@theme`，**preflight 关闭**） | `^4.3` |
| 国际化 | vue-i18n（`legacy: false`） | `^11` |
| 路由 | vue-router | `^5` |
| 实时 | `@microsoft/signalr` | `^10` |
| 富文本 | Tiptap（`RichTextEditor.vue`）+ md-editor-v3（`MdEditor.vue`） | `^3.27` / `^6.5` |
| 图标 | Iconify（离线模式，见下） | — |
| 拖拽 | `@dnd-kit/vue`（列宽/看板拖拽；`@dnd-kit/geometry` 须保留为显式依赖） | `^0.5` |

> `package.json` 里的版本号可能随升级变动，具体以仓库为准。

## 源码组织：`src/` 薄 + `packages/` 厚

前端是单仓库多包结构，**应用装配的绝大部分逻辑在 `packages/` 里**，`src/` 只是很薄的入口和业务视图。两个路径别名贯穿全项目：

| 别名 | 指向 | 用途 |
| --- | --- | --- |
| `@` | `src/` | 业务视图（`views`）、api 层（`api`）、应用装配（`app`/`router`/`styles`） |
| `~` | `packages/` | 可复用内核：`components`（含 `schema`/`rbac`）、`composables`、`hooks`、`stores`、`layouts`、`router`、`request`、`locales`、`iconify`、`design`、`utils`、`constants`、`types` |

```text
src/
├── main.ts          # 应用引导：iconify 离线 → i18n → 请求绑定 → 路由守卫 → mount
├── App.vue          # NConfigProvider + 各 Provider + RouterView + 全局挂件
├── app/context.ts   # 注册应用上下文（视图 glob、api 实例、静态路由）
├── api/             # 请求封装（见「api 层」）
├── router/          # 路由入口（守卫、静态路由，主体在 ~/router）
├── styles/          # Tailwind CSS 入口 index.css
└── views/           # 业务视图（approval / develop / file / identity / log /
                     #            message / oauth / openapi / setting / tenant / workbench）
```

`main.ts` 的引导顺序值得一读——它决定了「图标、语言、请求头、登出钩子、路由守卫」在挂载前如何就位：

```ts
await setupIconifyOffline()          // 预加载离线图标集
invalidateCacheIfBuildTimeChanged() // 构建时间变则清本地缓存
// createApp → pinia → setupI18n
bindRouter(router)                   // 请求层拿到 router（401 跳登录用）
bindLogoutHook(() => { /* 重置 access / user store */ })
registerApplicationContext(router)   // 注册视图 glob、api、静态路由到 app-context
setupRouterGuard(router)             // 安装 beforeEach 权限/路由守卫
app.use(router).mount('#app')
```

## Schema 驱动列表页

一个列表页的**字段单一事实源**是 `ListFieldSchema[]`：一份字段声明同时派生出搜索表单、表格列、导出字段、导入模板、详情展示，**禁止重复定义**。整页的事实源是 `PageSchema`，交给 `SchemaPage` 组件渲染（源码 `~/components/schema/`）。

### 内置能力

`SchemaPage` 开箱即用地提供：

- **搜索**：常用搜索（`searchable`）+ 高级搜索浮层（`advancedSearch`）；时间区间（`searchRange` → Between）、枚举/标签多选（`searchMultiple` → In）
- **表格**：列设置（显隐/顺序/固定/列宽）、密度切换、斑马纹/边框风格、多选、序号列、行悬停速览（`SchemaRowPeek`）、树形模式
- **列宽拖拽**：拖表头右边框调宽，用 `@dnd-kit/vue`；拖拽值写入列设置并可保存
- **多字段排序**：点多个列头累加，数组顺序即优先级
- **导出**：本地 CSV，或（登记了后端 Provider 时）提交到导出中心异步导出
- **导入**：内置模板下载、CSV 解析、预校验、批量创建对话框（`SchemaImportDialog`）
- **批量操作**：批量删除、批量启停、页面自定义批量动作
- **个人视图/搜索方案**：保存当前筛选+排序为命名方案（`useViewManager`）
- **偏好云端同步**：列设置与搜索设置按 `pageCode` 同步后端，多端一致（见「偏好与设置同步」）

### 字段 Schema：`ListFieldSchema`

字段的关键属性（完整定义以 `~/components/schema/types.ts` 为准）：

| 属性 | 作用 |
| --- | --- |
| `key` / `title` / `dataType` | 字段键、列标题（建议 i18n key）、数据类型（`string`/`enum`/`datetime`/`money`/`tag`/`json`/`image` 等，决定默认渲染器与搜索控件） |
| `visible` | 是否作为表格列（`false` = 仅搜索用，不出现在表格） |
| `searchable` / `advancedSearch` | 进入常用搜索 / 高级搜索 |
| `searchRange` | 时间字段：渲染区间选择器 + 便捷预设，下发 `conditions.filters` 的 Between |
| `searchMultiple` | 枚举/标签字段：渲染多选下拉，下发 `conditions.filters` 的 In |
| `sortable` | 服务端排序（列头出现排序箭头） |
| `exportable` / `importable` / `editable` | 参与导出 / 导入模板 / 表单编辑 |
| `permission` | **字段级权限码**：当前用户无此权限时该列/该搜索项**整列不渲染** |
| `dictionaryCode` | 枚举名或字典码，运行时异步拉取选项注入 `options`（见「枚举标签」） |
| `options` | 即时静态选项（`dictionaryCode` 解析为空时兜底，绝不出现空下拉） |
| `render` | 自定义单元格渲染（最高优先级，返回 `VNodeChild`） |
| `treeColumn` | 树形模式下承载展开箭头的列（应有且仅有一个） |
| `order` / `width` / `minWidth` / `fixed` | 排序值（越小越靠前）、列宽、最小列宽、固定方向 |

### 页面 Schema：`PageSchema`

| 属性 | 作用 |
| --- | --- |
| `pageCode` | 页面唯一码，**偏好/视图按此维度存储**（如 `log.access`） |
| `pageName` | 页面名（i18n key） |
| `resourceCode` | 后端资源码，用于匹配字段脱敏（FLS）规则；缺省则不拉取脱敏规则 |
| `resource` | 数据资源适配器（`page` / `tree` / `remove` / `updateStatus` / `create` / `export`） |
| `fields` | 字段单一事实源 |
| `actions` | 操作集合（`page` 工具栏 / `row` 行菜单 / `batch` 批量浮条） |
| `rowKey` | 行主键，默认 `basicId` |
| `exportPermission` | 导出按钮权限码（**精准门控**：声明后仅有权用户可见；未声明则该页不显示导出） |
| `importPermission` / `removePermission` / `statusPermission` | 导入 / 批量删除 / 批量启停的权限码 |
| `batchRemovable` | 启用内置批量删除（依赖 `resource.remove`） |
| `tree` | 存在即启用树形模式（走 `resource.tree`、不分页、按 `childrenKey` 展开） |
| `scrollX` / `pageSize` | 表格横向滚动宽度 / 默认每页数量 |

### 写一个列表页：完整骨架

以「访问日志」页（`src/views/log/access/index.vue`）为规范范例。一个纯 Schema 页只需三段：**字段 → 查询构建 → 页面 Schema**，模板里只放一个 `<SchemaPage>`。

```vue
<script setup lang="ts">
import type { ListFieldSchema, PageSchema, SchemaActionPayload, SchemaQueryParams } from '~/components'
import { createPageRequest, logManagementApi, querySortsFromSchema } from '@/api'
import { SchemaPage } from '~/components'

const { t } = useI18n()

// 1) 字段单一事实源（列 + 常用搜索 + 高级搜索，全在这里声明一次）
const fields = computed<ListFieldSchema[]>(() => [
  // 仅搜索、不作为列
  { key: 'keyword', title: t('common.fields.keyword'), dataType: 'string', visible: false, searchable: true, order: 0 },
  // 枚举多选搜索 + 字典码 + 自定义标签渲染
  {
    key: 'accessResult', title: t('log.access.access_result'), dataType: 'enum',
    searchable: true, searchMultiple: true, sortable: true,
    options: accessResultOptions.value, order: 18,
    render: row => h(NTag, { type: accessResultType(row.accessResult) }, () => /* label */),
  },
  // 时间区间搜索
  { key: 'accessTime', title: t('log.access.access_time'), dataType: 'datetime', sortable: true, searchable: true, searchRange: true, advancedSearch: true, order: 26 },
])

// 2) 查询构建：把归一化 SchemaQueryParams 映射为后端分页 DTO（resource.page 与导出复用）
function buildAccessQuery(params: SchemaQueryParams) {
  return {
    ...createPageRequest({
      page: { pageIndex: params.page, pageSize: params.pageSize },
      // 多字段排序 → conditions.sorts；区间/多选 → conditions.filters（已由框架算好）
      conditions: { sorts: querySortsFromSchema(params.sorts), filters: params.conditionFilters ?? [] },
    }),
    keyword: (params.filters.keyword as string)?.trim() || undefined,
    // ...其余顶层查询字段
  }
}

// 3) 页面 Schema：pageCode / 权限码 / resource 适配 / 行操作
const schema = computed<PageSchema>(() => ({
  pageCode: 'log.access',
  exportPermission: 'saas:access-log:export', // 权限码以后端 SaasPermissionDefinitions 为准
  pageName: t('log.access.page_name'),
  rowKey: 'basicId',
  scrollX: 2200,
  fields: fields.value,
  resource: {
    page: params => logManagementApi.access.page(buildAccessQuery(params)),
    export: { businessType: 'log.access', buildQuery: buildAccessQuery },
  },
  actions: [
    { key: 'view', title: t('common.actions.view_detail'), scope: 'row', icon: 'lucide:eye' },
  ],
}))

// 行操作事件统一从 @action 上抛，页面自己处理业务（打开抽屉/弹窗等）
function onAction(payload: SchemaActionPayload) {
  if (payload.key === 'view' && payload.row) { /* 打开详情抽屉 */ }
}
</script>

<template>
  <SchemaPage :schema="schema" @action="onAction">
    <!-- 默认插槽：承载页面自有弹窗/抽屉；#toolbar 追加工具栏项；#expand 提供行展开 -->
    <LogDetailDrawer v-model:show="detailVisible" :record="detailData" />
  </SchemaPage>
</template>
```

要点：

- **操作不在 Schema 里实现逻辑**，只声明 `key`/`scope`/`icon`/`permission`；点击时经 `@action` 上抛 `{ key, scope, row?, rows? }`，由页面处理。
- `resource.page` 收到框架归一化的 `SchemaQueryParams`（`page` / `pageSize` / `sorts` / `filters` / `conditionFilters`），页面适配器负责映射为后端 DTO——这层适配是**页面自己写的**，框架只依赖归一化契约。
- 分页统一走 **POST**：`createPageRequest` 组装出 `behavior` / `conditions` / `page` 三段的 `PageRequest`，整个对象作为请求体发出（详见「api 层」）。

### 多字段排序

排序前端驱动、后端应用：

- 列头点击累加为 `sorts: SchemaSortRule[]`，**数组顺序即优先级**（下标 0 为主排序）。
- `querySortsFromSchema(params.sorts)`（`@/api`）把它转成后端 `conditions.sorts`，每条带 `priority = 下标`。
- 后端 `ApplySorts` 应用排序，并受 **FLS 门控**：只有「可读且未脱敏」的字段才允许作为排序键。
- 列设置里可为每列设默认排序（单图标循环 无→升→降），优先级按列顺序。树表/子表不参与。

### 搜索：区间与多选走统一过滤

`searchRange`/`searchMultiple` 字段的当前值由框架 `queryFiltersFromSchema` 派生为后端通用过滤 `conditions.filters`：

- **区间**（`searchRange`）→ `QueryOperator.Between`，值为 ISO 字符串；`date` 粒度末值补到当天 `23:59:59.999` 以含整日。
- **多选**（`searchMultiple`）→ `QueryOperator.In`。

这些统一放进 `params.conditionFilters`，页面适配器把它并入 `conditions.filters` 即可。其余普通搜索字段仍由页面 `buildXxxQuery` 映射为 DTO 顶层字段。相关封装组件：`SchemaSearchField` / `SchemaSearchDateRange` / `SchemaSearchMultiSelect`（`~/components/schema/`）。

## 权限、脱敏、租户三级过滤

前端在**页面 / 字段 / 操作**三级按权限码过滤，权限码格式 `module:resource:action`（如 `saas:user:read`），超管用字面通配 `*`（权限码真源在后端 `SaasPermissionDefinitions`）。

### 权限判定 hook

- `usePermission()`（`~/hooks/usePermission.ts`）：`hasPermission(code | code[])` / `hasRole(role | role[])` / `hasAnyPermission(codes[])`，命中用户角色/权限或访问码集合即通过。
- 没有独立的包裹式权限组件：页面按钮/区块级权限门控统一是「`usePermission()` 派生 computed 布尔值 + 模板 `v-if`」这一种写法，直接写在业务视图里。

```ts
const { hasPermission } = usePermission()
const canGrantPermission = computed(() => hasPermission('saas:tenant-edition-permission:grant'))
```

```vue
<NButton v-if="canGrantPermission">新建用户</NButton>
```

Schema 页内则**自动**按权限过滤：字段 `permission` 无权 → 该列/搜索项不渲染（`selectors.ts` 的 `isFieldPermitted`）；操作 `permission` 无权 → 按钮不出现；`exportPermission` 等在 `SchemaPage` 里精准门控按钮显隐。

### 字段级脱敏（FLS）

**脱敏在服务端落地**——后端已在响应里把敏感字段打码，**前端不再二次打码**。前端侧的 `useFieldSecurity(resourceCode)`（`~/components/schema/useFieldSecurity.ts`）按页面 `resourceCode` 拉取当前用户的有效字段规则（`getMine`），用途是：

- 表单按 `isEditable(fieldKey)` 置只读；
- 展示「不可见 / 已脱敏」标识。

规则形如 `{ fieldName, isReadable, isEditable, maskStrategy, maskPattern }`；端点未就绪或无规则时默认放行（`isReadable`/`isEditable` 缺省 `true`）。

### 多租户

数据按 `TenantId` 隔离，全局数据约定 `TenantId=0`；登录后按用户归属自动落点，可切换租户；租户版本（Edition）对应权限白名单运行时门控。前端不需要手动处理租户过滤——它由后端在请求管道里完成，前端只按拿到的权限码集合渲染。详见 [权限模型](./permissions) 与 [多租户](./multi-tenancy)。

## api 层

api 层（`src/api/`）在 `packages/request` 的 axios 封装之上，提供动态 API 客户端与资源工厂。

### 动态 API 客户端与资源工厂

- `createDynamicApiClient(controllerName)`（`src/api/base.ts`）：返回按控制器名的低层客户端，暴露 `get`/`post`/`put`/`delete`。
- `createReadApi` / `createCommandApi`：标准读/写封装。
- `defineResource<...>(...)`（`src/api/factory.ts`）：资源工厂，一次性生成 `page`/`detail`/`create`/`update`/`remove` 并保留 `query`/`command` 客户端以扩展自定义动作。

后端是[动态 API](../framework/concepts/dynamic-api)（应用服务经 `[DynamicApi]` 直接暴露、无 Controller），**路由默认剥离动词前缀**，剥离在后端 routing 层完成；前端调用时用的已是剥离后的 action 名。具体动词/前缀映射以仓库为准。

### 分页统一走 POST

分页方法一律 POST，**整个查询对象作为请求体**：

```ts
// 语义：POST /api/{Controller}Page，body = 完整 PageRequest（含 behavior/conditions/page）
messageQueryApi.post<PageResult<EmailListItemDto>>('EmailPage', emailPageQueryDto)
```

请求体三段结构（`src/api/helpers.ts` 的 `createPageRequest` 组装）：

- `behavior`：查询行为开关（软删除/租户/分页等）
- `conditions`：`keyword` / `filters`（`QueryFilter[]`，含 Between/In）/ `sorts`（`QuerySort[]`，带 `priority`）
- `page`：`{ pageIndex, pageSize }`

返回 `PageResult<TItem>`：`items` + `page`（`totalCount`/`totalPages`/`hasNext` 等）。辅助函数：`querySortsFromSchema`、`queryFilter`、`querySort`、`compactRecord`（去空字段）。

### 请求封装与响应解包

`packages/request/index.ts` 的 `RequestClient`（axios 封装）负责：

- **请求头注入**（请求拦截器）：`Authorization: Bearer <token>`、`X-Timezone`（用户已选时区，否则跟随浏览器 `Intl`）、`X-Language`（当前 locale）、`X-Request-Id`。
- **响应解包**：统一 `ApiResponse` 信封，成功时返回 `data` 字段（前端优先读 `Data`）；`data` 可能因后端 `WhenWritingNull` 优化被省略，此时按 `null` 返回。
- **401 处理**：尝试刷新令牌重试，失败则走登出（清 token、调 `bindLogoutHook` 回调重置 store、跳登录页）。`bindRouter` / `bindLogoutHook` 在 `main.ts` 绑定。
- **环境变量**：`VITE_API_BASE_URL`（协议+主机，开发态通常为空）、`VITE_API_PREFIX`（默认 `/api`）。

上述头/解包/401 的具体字段判定以仓库为准。

## 国际化与时区

- **语言**：vue-i18n（`legacy: false`），中英双包在 `packages/locales/langs/{zh-CN,en-US}/`，按模块拆文件（`identity.ts` / `log.ts` / `message.ts` / `common.ts` / `component.ts` 等），键名约定 `模块.实体.字段或动作`（如 `identity.user.col_status`）。切换语言经 `useLocale().setLocale(lang)`。
- **Naive UI 内置文案**（日期选择器、分页「X / 页」等）随应用 locale 切换：见 `App.vue` 里 `useNaiveLocale()` 注入 `NConfigProvider` 的 `locale`/`date-locale`。
- **时区**：前端发 `X-Timezone` 头，后端把 UTC 按该时区换算后输出（存储仍 UTC）。用户可在偏好里选时区，否则跟随浏览器。

::: warning vue-i18n 裸 `@` 崩溃
语言包文案里出现**裸 `@`**（如 `联系 @admin`）会触发 vue-i18n 的 linked message 语法，报 `Invalid linked format` 导致白屏。必须转义为 <code v-pre>{'@'}</code>（如 `联系 {'@'}admin`）。新增文案前建议扫描裸 `@`。
:::

## 枚举标签：后端单一事实源 + 响应式切语言

枚举标签的**单一事实源是后端枚举元数据**（`Enums.{culture}.json` 全量），按 `X-Language` 返回当前语言标签。前端有三条取值路径：

| 场景 | 用法 |
| --- | --- |
| **SchemaPage 字段** | 字段声明 `dictionaryCode`（枚举名/字典码），`useSchemaDictionaries` 批量拉取注入 `field.options`，单元格按值映射 label、搜索区自动渲染下拉 |
| **非 Schema 下拉/标签** | `useEnumOptions(enumName, fallback)`（`~/hooks`），返回随语言/数据响应式更新的 `computed` 选项 |
| **静态兜底** | 元数据为空（未加载/未部署）时回退传入的 `fallback` 静态选项，绝不出现空下拉 |

**响应式切语言**：拉取由全局 `useEnumService` 并发去重、切 locale 时整库重取一次；`useSchemaDictionaries`/`useEnumOptions` 只读响应式状态，**免刷新即随语言更新**（各下拉不各自监听 locale，避免重复请求）。`business.ts` 里的 `*_OPTIONS` 常量是写死中文，仅作兜底。

## 实时（SignalR）

`useSignalR(hubPath)`（`~/composables/useSignalR.ts`）按 `hubPath` 维护**全局单例连接**（通知 `/hubs/notification` 与聊天 `/hubs/chat` 各一条，互不干扰）：

- 认证自动携带 JWT（`accessTokenFactory`），无 token 不发起连接（避免 401）。
- 传输回退：WebSockets → SSE → LongPolling；渐进式自动重连（1s/2s/5s/10s/30s），token 清除即放弃重连。
- `on(method, handler)` / `off` / `invoke(method, ...args)` / `start` / `stop` / `destroy`；登出时 `destroyAllSignalRConnections()` 一把清。

::: tip SignalR 载荷约定
后端 Hub 无 `long → string` / 枚举自动转换，**载荷须应用侧手动投影**、Hub 参数用 `string` 接收；具体投影表以仓库为准。
:::

## 消息中心 UI

企业级消息中心的前端由三个层次组成：

- **顶部横幅**：`NotificationBanner.vue` + `use-banner-notices.ts`（`~/layouts/basic/`）。数据来自后端 banner 端点（服务端已按有效期、角色/部门定向过滤），按严重度+优先级取前 3 条轮播（5s，悬停暂停）；关闭记忆按公告 id 存 localStorage（30 天清理），后台重发即新 id 自然重现。
- **强制阅读 + 登录弹窗**：`NotificationGate.vue`。未读必读公告以遮罩拦截、逐条「我已阅读」（最高优先级）；清空后再逐条弹出普通登录后公告。
- **通知中心页**：`src/views/message/notification/`（发布/定向/统计等运营闭环）。

## 偏好与设置同步

### 偏好中心（主题）

`useTheme()`（`~/hooks/useTheme.ts`）管理外观：亮/暗/跟随系统、主题色、圆角、字号、紧凑度。特点：

- **Material You 动态取色**：从单个品牌色派生整套和谐色阶（辅色/容器/前景/聚焦环/带品牌色相的中性色），明暗自适应，通过内联 CSS 变量写到根元素。
- **主题切换动画**：`startViewTransition` 从点击处圆形扩散。
- 主色/明暗/圆角/字号变化都会重算并同步到 CSS 变量，供非 Naive 的自定义元素使用。

页面设置（列设置/搜索设置/视图/看板）**云端同步**：`useUserSettingSync(pageCode)`（`~/components/schema/useUserSettingSync.ts`）以 (用户 × 场景 × 设置键=pageCode) 存一条 JSON，按「分区」读写；**localStorage 仍是事实源**，后端加载成功则覆盖本地、保存失败静默忽略（尽力而为）。其它设备保存后经 SignalR `UserSettingChanged` 实时推送应用到已打开页面。全局用户偏好也复用 `PagePreference`（带 `pageCode` 同步后端）。

::: warning 嵌套深色令牌
`@theme` 的 `--color-*` 只在 `:root` 解析；嵌套 `.dark`（深色侧栏/子栏/顶栏）下 `bg-*`/`text-*` 不会变暗。修法是在 `variables.css` 的 `:root, .dark` 块里重声明全部 `--color-*`。以仓库为准。
:::

## 样式：Tailwind CSS 4（CSS-first）

Tailwind v4 用 `@tailwindcss/vite` + **CSS-first `@theme`**（入口 `src/styles/index.css`），**无 JS config**：

- **只引入 theme + utilities，不引入 preflight**——基础重置由 Naive UI 与 `design/global.css` 的最小重置负责（避免与 Naive UI 冲突）。
- 颜色令牌以运行时 HSL CSS 变量表达（`--color-primary: hsl(var(--primary))` 等），保持明暗动态切换。
- 暗色走 class 策略：`@custom-variant dark (&:where(.dark, .dark *))`。

## 其它常用能力

| 能力 | 组件 / 说明 |
| --- | --- |
| 富文本 | `RichTextEditor.vue`（Tiptap，含 Link/Image/Highlight/TextAlign/Underline 等扩展） |
| Markdown | `MdEditor.vue`（md-editor-v3） |
| JSON 编辑/查看 | `JsonEditor.vue`（vue3-ts-jsoneditor） |
| Cron 可视化 | `CronExpression.vue`（输入框 + 弹窗可视化，任务调度用） |
| 行展开 | `SchemaPage` 的 `#expand` 作用域插槽（如任务调度展开触发器信息） |
| 锁屏 / 水印 | `LockScreen.vue` / `AppWatermark.vue`（全局挂在 `App.vue`） |
| 导入导出中心 | 导入 `SchemaImportDialog`；导出中心页 `src/views/file/export-center/` |
| 头像/文件 URL | `useAvatarUrl` / `toAbsoluteFileUrl`：本地存储返回根相对路径 `/uploads/...`，**线上前后端跨源时须拼 `VITE_API_BASE_URL` origin** |

### 图标：Iconify 离线模式

图标走 Iconify **离线模式**（`~/iconify/offline.ts`），运行期**预加载 lucide / tabler / mdi / simple-icons**（`simple-icons` 用于第三方登录品牌 logo，如 Gitee 的 `simple-icons:gitee`）；`IconPicker` 可按需懒加载 carbon/ep/heroicons。用法 `<Icon icon="lucide:eye" />`。

::: warning 离线图标可用集
运行期直接渲染只保证 **lucide / tabler / mdi / simple-icons** 这四个已预加载集；未预加载的图标集（如 carbon/ep/heroicons）在页面里直接用会渲染为空（离线 `Icon` 对已挂载组件不会因后加载而重渲染）。品牌图标优先用 `simple-icons:*` 或 `tabler:brand-*`。以仓库预加载配置（`PRELOAD_ICON_PACKAGES`）为准。
:::

## 路由：后端菜单驱动

路由**默认由后端菜单驱动**（后端 `PageRegistry` 是菜单/路由/组件路径/权限码/i18n 键的单一事实源），也支持静态模式兜底：

- **动态模式**（默认）：登录后 `getPermissionsApi()` 返回 `menus`，`mapMenuToRoutes()`（`~/router/dynamic.ts`）把后端 `MenuRoute[]` 转成 `RouteRecordRaw[]` 并 `router.addRoute('RootLayout', ...)`。组件解析：后端 `Component` 路径（PascalCase）→ 前端文件路径（kebab-case），经 `src/views` 的 `import.meta.glob` 匹配；`_core` 页面走 `coreComponentMap`。
- **静态模式**：`VITE_AUTH_ROUTE_MODE === 'static'` 时启用，用前端静态路由 + `filterRoutesByPermission()` 按用户角色/权限过滤。

路由守卫 `setupRouterGuard(router)`（`~/router/guard.ts`）的 `beforeEach` 依次：无 token → 跳登录；用户上下文失效 → 重拉用户+权限；路由未加载 → 装载动态/静态路由 + 拉取偏好；`meta.roles`/`meta.permissions` 校验，无权 → 跳 403；维护标签栏。

新增页面的前端侧要点：**后端 PageRegistry 建菜单即绑权限**（真源在后端），前端只需提供**视图组件 + 页面 Schema + i18n 键**，组件按约定路径放在 `src/views/**` 即被 glob 命中。详见 [开发指南](./development)。

## 下一步

- [开发指南](./development)：新增功能/页面的端到端骨架（后端切片 + 前端页）
- [权限模型](./permissions)：RBAC + ABAC + 数据范围 + FLS
- [系统架构](./architecture)：前后端协作数据流
- [消息中心](./messaging)：消息分类/定向/强制阅读的后端设计
