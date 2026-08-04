# 主题、样式与国际化

外观（Tailwind v4 + 动态取色）与文案（vue-i18n + 后端枚举元数据 + 时区）这两块的约定与陷阱。

## 样式：Tailwind CSS 4（CSS-first）

用 `@tailwindcss/vite` + **CSS-first `@theme`**（入口 `src/styles/index.css`），**没有 JS config 文件**。

三条关键约定：

| 约定 | 说明 |
| --- | --- |
| **只引入 theme + utilities，不引入 preflight** | 基础重置由 Naive UI 与 `design/global.css` 的最小重置负责，避免与 Naive UI 打架 |
| 颜色令牌用运行时 HSL CSS 变量 | `--color-primary: hsl(var(--primary))` 等，保证明暗与主题色能动态切换 |
| 暗色走 class 策略 | `@custom-variant dark (&:where(.dark, .dark *))` |

::: danger 嵌套 `.dark` 下 `bg-*` / `text-*` 不变暗
`@theme` 里声明的 `--color-*` **只在 `:root` 解析**。深色侧栏、深色子栏、深色顶栏这类**嵌套 `.dark`** 的容器里，Tailwind 的颜色工具类拿不到暗色值，表现是「局部深色区域里的元素还是亮色」。

修法：在 `variables.css` 的 **`:root, .dark`** 块里**重新声明全部 `--color-*`**，让嵌套作用域也能解析到。
:::

## 主题

`useTheme()`（`~/hooks/useTheme.ts`）管理外观：亮/暗/跟随系统、主题色、圆角、字号、紧凑度。

两个特点：

- **Material You 动态取色**：从单个品牌色派生整套和谐色阶（辅色、容器色、前景色、聚焦环、带品牌色相的中性色），明暗自适应，以内联 CSS 变量写到根元素。所以换主题色不需要改任何 CSS。
- **切换动画**：`startViewTransition` 从点击处圆形扩散。

主色、明暗、圆角、字号变化都会重算并同步到 CSS 变量，非 Naive 的自定义元素也能直接用。

偏好云端同步：UI 偏好走 `UserSettingAppService` 按场景 + key 存取，保存后经 SignalR 广播实现**多端同步**（服务端不解释 value，只作跨端状态载体）。

## 国际化

### 语言包组织

vue-i18n（`legacy: false`），中英双包在 `packages/locales/langs/{zh-CN,en-US}/`，按模块拆文件（`identity.ts` / `log.ts` / `message.ts` / `common.ts` / `component.ts` / `menu.ts` 等）。

键名约定 **`模块.实体.字段或动作`**，如 `identity.user.col_status`。

切换语言：`useLocale().setLocale(lang)`。

### Naive UI 内置文案

日期选择器、分页「X / 页」这类 Naive 内置文案随应用 locale 切换——`App.vue` 里 `useNaiveLocale()` 注入 `NConfigProvider` 的 `locale` / `date-locale`。加新语言时别忘了这一处。

### 裸 `@` 会白屏

::: danger
语言包文案里出现**裸 `@`**（如 `联系 @admin`）会触发 vue-i18n 的 linked message 语法，抛 `Invalid linked format` 导致**整页白屏**。

必须转义成 <code v-pre>{'@'}</code>：

```ts
// ❌ 白屏
contact: '联系 @admin'
// ✅
contact: "联系 {'@'}admin"
```

邮箱、社交账号、装饰性符号都是高发区。新增文案前扫一遍。
:::

## 枚举标签：后端单一事实源

枚举标签的**事实源是后端枚举元数据**（`Enums.{culture}.json` 全量），按请求头 `X-Language` 返回当前语言的标签。前端有三条取值路径：

| 场景 | 用法 |
| --- | --- |
| **SchemaPage 字段** | 字段声明 `dictionaryCode`（枚举名或字典码），`useSchemaDictionaries` 批量拉取注入 `field.options`；单元格按值映射 label，搜索区自动渲染下拉 |
| **非 Schema 的下拉/标签** | `useEnumOptions(enumName, fallback)`（`~/hooks`），返回随语言/数据响应式更新的 `computed` |
| **静态兜底** | 元数据为空（未加载/未部署）时回退传入的 `fallback` 静态选项，**保证绝不出现空下拉** |

### 切语言要响应式

拉取由全局 `useEnumService` **并发去重**，切 locale 时整库重取一次。`useSchemaDictionaries` / `useEnumOptions` 只读响应式状态——**免刷新即随语言更新**，且各下拉不各自监听 locale，避免重复请求。

`business.ts` 里的 `*_OPTIONS` 常量是写死中文的，**仅作兜底**，不要当成事实源使用。

::: tip 值要用成员名，不是数字
后端实例数据经 `JsonStringEnumConverter` 序列化为**成员名字符串**（如 `"Enabled"`）。所以选项的 `value` 必须用成员名才能与表格行数据匹配；整数值放在 `valueText` 备用。
:::

## 时区

- 前端在请求拦截器里发 **`X-Timezone`** 头（用户已选时区优先，否则跟随浏览器 `Intl`）。
- 后端**存储恒 UTC**，输出时按该头换算。
- 用户可在偏好里选时区。

所以「时间显示差几小时」的排查顺序是：请求有没有带这个头 → 用户选的时区对不对 → 后端存的是不是 UTC。

## 图标：Iconify 离线模式

图标走 Iconify **离线模式**（`~/iconify/offline.ts`），用法 `<Icon icon="lucide:eye" />`。

::: danger 只有预加载的图标集能直接用
运行期直接渲染只保证 **`lucide` / `tabler` / `mdi` / `simple-icons`** 这四个已预加载集。未预加载的集（carbon / ep / heroicons 等）在页面里直接用会**渲染为空**——离线 `Icon` 对已挂载组件不会因后加载而重渲染。

品牌图标优先用 `simple-icons:*` 或 `tabler:brand-*`（如 Gitee 用 `simple-icons:gitee`）。以仓库的 `PRELOAD_ICON_PACKAGES` 配置为准。
:::

`IconPicker` 组件可以按需懒加载 carbon / ep / heroicons 供用户选择——那是选择器场景，与「页面里直接渲染」不同。

## 相关页面

- [前端架构](../architecture/frontend)：分层与启动引导
- [Schema 驱动页面](./schema-page)：`dictionaryCode` 的用法
- [接口对接指南](../api-guide#json-序列化约定)：枚举与时间的序列化规则
- [常见问题](../faq#页面整片白屏-控制台报-invalid-linked-format)：白屏与图标空白的处置
