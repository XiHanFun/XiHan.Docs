import{_ as a,c as n,o as p,ag as i}from"./chunks/framework.C4nOkCZI.js";const r=JSON.parse('{"title":"XiHan UI 包依赖关系","description":"","frontmatter":{},"headers":[],"relativePath":"cosmos/ui/npm-package-dependency.md","filePath":"cosmos/ui/npm-package-dependency.md","lastUpdated":1747783171000}'),e={name:"cosmos/ui/npm-package-dependency.md"};function l(t,s,h,c,o,d){return p(),n("div",null,[...s[0]||(s[0]=[i(`<h1 id="xihan-ui-包依赖关系" tabindex="-1">XiHan UI 包依赖关系 <a class="header-anchor" href="#xihan-ui-包依赖关系" aria-label="Permalink to &quot;XiHan UI 包依赖关系&quot;">​</a></h1><p>XiHan UI 采用 monorepo 结构进行组织，包含多个子包，各子包之间有明确的依赖关系。下面详细说明各个包的功能和依赖关系。</p><h2 id="包概览" tabindex="-1">包概览 <a class="header-anchor" href="#包概览" aria-label="Permalink to &quot;包概览&quot;">​</a></h2><table tabindex="0"><thead><tr><th>包名</th><th>描述</th><th>依赖</th></tr></thead><tbody><tr><td>xihan-ui</td><td>主包，导出所有子包</td><td>所有子包</td></tr><tr><td>@xihan-ui/utils</td><td>工具函数</td><td>无外部依赖</td></tr><tr><td>@xihan-ui/constants</td><td>常量和类型定义</td><td>utils</td></tr><tr><td>@xihan-ui/themes</td><td>主题系统</td><td>utils, constants</td></tr><tr><td>@xihan-ui/hooks</td><td>Vue 组合式函数</td><td>utils, constants, themes</td></tr><tr><td>@xihan-ui/icons</td><td>图标组件</td><td>utils, constants</td></tr><tr><td>@xihan-ui/locales</td><td>国际化资源</td><td>utils, constants</td></tr><tr><td>@xihan-ui/directives</td><td>Vue 自定义指令</td><td>utils, constants</td></tr><tr><td>@xihan-ui/components</td><td>UI 组件</td><td>utils, constants, hooks, themes 等</td></tr><tr><td>@xihan-ui/plugins</td><td>Vue 插件</td><td>utils, constants, hooks, themes 等</td></tr></tbody></table><h2 id="详细依赖结构" tabindex="-1">详细依赖结构 <a class="header-anchor" href="#详细依赖结构" aria-label="Permalink to &quot;详细依赖结构&quot;">​</a></h2><h3 id="_1-xihan-ui-utils-基础工具" tabindex="-1">1. @xihan-ui/utils (基础工具) <a class="header-anchor" href="#_1-xihan-ui-utils-基础工具" aria-label="Permalink to &quot;1. @xihan-ui/utils (基础工具)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/utils/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── dom/        // DOM操作工具</span></span>
<span class="line"><span>│   ├── vue/        // Vue相关工具</span></span>
<span class="line"><span>│   ├── common/     // 通用工具函数</span></span>
<span class="line"><span>│   └── types/      // TypeScript类型定义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖: 无</span></span>
<span class="line"><span>被依赖: 所有其他包</span></span></code></pre></div><h3 id="_2-xihan-ui-constants-常量定义" tabindex="-1">2. @xihan-ui/constants (常量定义) <a class="header-anchor" href="#_2-xihan-ui-constants-常量定义" aria-label="Permalink to &quot;2. @xihan-ui/constants (常量定义)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/constants/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── tokens.ts   // 注入令牌</span></span>
<span class="line"><span>│   ├── events.ts   // 事件常量</span></span>
<span class="line"><span>│   └── props.ts    // 公共Props定义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖: @xihan-ui/utils</span></span>
<span class="line"><span>被依赖: 大部分其他包</span></span></code></pre></div><h3 id="_3-xihan-ui-themes-主题系统" tabindex="-1">3. @xihan-ui/themes (主题系统) <a class="header-anchor" href="#_3-xihan-ui-themes-主题系统" aria-label="Permalink to &quot;3. @xihan-ui/themes (主题系统)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/themes/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── default/    // 默认主题</span></span>
<span class="line"><span>│   ├── dark/       // 暗黑主题</span></span>
<span class="line"><span>│   └── tokens/     // 设计标记</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖:</span></span>
<span class="line"><span>- @xihan-ui/utils</span></span>
<span class="line"><span>- @xihan-ui/constants</span></span>
<span class="line"><span>被依赖:</span></span>
<span class="line"><span>- @xihan-ui/components</span></span>
<span class="line"><span>- @xihan-ui/hooks</span></span>
<span class="line"><span>- @xihan-ui/plugins</span></span></code></pre></div><h3 id="_4-xihan-ui-hooks-组合式函数" tabindex="-1">4. @xihan-ui/hooks (组合式函数) <a class="header-anchor" href="#_4-xihan-ui-hooks-组合式函数" aria-label="Permalink to &quot;4. @xihan-ui/hooks (组合式函数)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/hooks/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── useNamespace.ts  // BEM命名空间</span></span>
<span class="line"><span>│   ├── useConfig.ts     // 全局配置</span></span>
<span class="line"><span>│   ├── useTheme.ts      // 主题钩子</span></span>
<span class="line"><span>│   └── useLocale.ts     // 国际化钩子</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖:</span></span>
<span class="line"><span>- @xihan-ui/utils</span></span>
<span class="line"><span>- @xihan-ui/constants</span></span>
<span class="line"><span>- @xihan-ui/themes</span></span>
<span class="line"><span>- @xihan-ui/locales</span></span>
<span class="line"><span>被依赖:</span></span>
<span class="line"><span>- @xihan-ui/components</span></span>
<span class="line"><span>- @xihan-ui/plugins</span></span></code></pre></div><h3 id="_5-xihan-ui-icons-图标系统" tabindex="-1">5. @xihan-ui/icons (图标系统) <a class="header-anchor" href="#_5-xihan-ui-icons-图标系统" aria-label="Permalink to &quot;5. @xihan-ui/icons (图标系统)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/icons/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── components/  // 图标组件</span></span>
<span class="line"><span>│   ├── packs/       // 打包的图标集合</span></span>
<span class="line"><span>│   └── svg/         // SVG资源</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖:</span></span>
<span class="line"><span>- @xihan-ui/utils</span></span>
<span class="line"><span>- @xihan-ui/constants</span></span>
<span class="line"><span>被依赖:</span></span>
<span class="line"><span>- @xihan-ui/components</span></span></code></pre></div><h3 id="_6-xihan-ui-locales-国际化" tabindex="-1">6. @xihan-ui/locales (国际化) <a class="header-anchor" href="#_6-xihan-ui-locales-国际化" aria-label="Permalink to &quot;6. @xihan-ui/locales (国际化)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/locales/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── zh-CN/     // 中文语言包</span></span>
<span class="line"><span>│   └── en-US/     // 英文语言包</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖:</span></span>
<span class="line"><span>- @xihan-ui/utils</span></span>
<span class="line"><span>- @xihan-ui/constants</span></span>
<span class="line"><span>被依赖:</span></span>
<span class="line"><span>- @xihan-ui/hooks</span></span>
<span class="line"><span>- @xihan-ui/components</span></span>
<span class="line"><span>- @xihan-ui/plugins</span></span></code></pre></div><h3 id="_7-xihan-ui-directives-vue-指令" tabindex="-1">7. @xihan-ui/directives (Vue 指令) <a class="header-anchor" href="#_7-xihan-ui-directives-vue-指令" aria-label="Permalink to &quot;7. @xihan-ui/directives (Vue 指令)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/directives/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── clickOutside/  // 点击外部指令</span></span>
<span class="line"><span>│   ├── resize/        // 调整大小指令</span></span>
<span class="line"><span>│   └── loading/       // 加载指令</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖:</span></span>
<span class="line"><span>- @xihan-ui/utils</span></span>
<span class="line"><span>- @xihan-ui/constants</span></span>
<span class="line"><span>被依赖:</span></span>
<span class="line"><span>- @xihan-ui/components</span></span></code></pre></div><h3 id="_8-xihan-ui-components-ui-组件" tabindex="-1">8. @xihan-ui/components (UI 组件) <a class="header-anchor" href="#_8-xihan-ui-components-ui-组件" aria-label="Permalink to &quot;8. @xihan-ui/components (UI 组件)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/components/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── button/      // 按钮组件</span></span>
<span class="line"><span>│   ├── input/       // 输入框组件</span></span>
<span class="line"><span>│   ├── form/        // 表单组件</span></span>
<span class="line"><span>│   └── ...          // 其他组件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖:</span></span>
<span class="line"><span>- @xihan-ui/utils</span></span>
<span class="line"><span>- @xihan-ui/constants</span></span>
<span class="line"><span>- @xihan-ui/hooks</span></span>
<span class="line"><span>- @xihan-ui/themes</span></span>
<span class="line"><span>- @xihan-ui/icons</span></span>
<span class="line"><span>- @xihan-ui/locales</span></span>
<span class="line"><span>- @xihan-ui/directives</span></span>
<span class="line"><span>被依赖:</span></span>
<span class="line"><span>- xihan-ui (主包)</span></span></code></pre></div><h3 id="_9-xihan-ui-plugins-vue-插件" tabindex="-1">9. @xihan-ui/plugins (Vue 插件) <a class="header-anchor" href="#_9-xihan-ui-plugins-vue-插件" aria-label="Permalink to &quot;9. @xihan-ui/plugins (Vue 插件)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>@xihan-ui/plugins/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── theme/      // 主题插件</span></span>
<span class="line"><span>│   ├── locale/     // 国际化插件</span></span>
<span class="line"><span>│   └── icons/      // 图标插件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖:</span></span>
<span class="line"><span>- @xihan-ui/utils</span></span>
<span class="line"><span>- @xihan-ui/constants</span></span>
<span class="line"><span>- @xihan-ui/hooks</span></span>
<span class="line"><span>- @xihan-ui/themes</span></span>
<span class="line"><span>- @xihan-ui/locales</span></span>
<span class="line"><span>- @xihan-ui/icons</span></span>
<span class="line"><span>被依赖:</span></span>
<span class="line"><span>- xihan-ui (主包)</span></span></code></pre></div><h3 id="_10-xihan-ui-主包" tabindex="-1">10. xihan-ui (主包) <a class="header-anchor" href="#_10-xihan-ui-主包" aria-label="Permalink to &quot;10. xihan-ui (主包)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xihan-ui/</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── index.ts    // 主入口</span></span>
<span class="line"><span>│   ├── installer.ts // 安装器</span></span>
<span class="line"><span>│   └── resolvers/  // 自动导入解析器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖: 所有子包</span></span>
<span class="line"><span>被依赖: 无 (用户应用直接依赖)</span></span></code></pre></div><h2 id="依赖层级图" tabindex="-1">依赖层级图 <a class="header-anchor" href="#依赖层级图" aria-label="Permalink to &quot;依赖层级图&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>                      +---------------+</span></span>
<span class="line"><span>                      |   xihan-ui   |</span></span>
<span class="line"><span>                      +-------+-------+</span></span>
<span class="line"><span>                              |</span></span>
<span class="line"><span>          +------------------++-----------------+</span></span>
<span class="line"><span>          |                  |                  |</span></span>
<span class="line"><span>+---------v----------+ +-----v------+ +---------v--------+</span></span>
<span class="line"><span>| @xihan-ui/components| |@xihan-ui/plugins|  其他导出子包   |</span></span>
<span class="line"><span>+--------+------------+ +-----+------+ +-----------------+</span></span>
<span class="line"><span>         |                   |</span></span>
<span class="line"><span>         |                   |</span></span>
<span class="line"><span>+--------v---------+  +------v-----+  +--------+-------+</span></span>
<span class="line"><span>| @xihan-ui/hooks  |  |@xihan-ui/themes| |@xihan-ui/icons  |</span></span>
<span class="line"><span>+--------+---------+  +------+-----+  +--------+-------+</span></span>
<span class="line"><span>         |                   |                |</span></span>
<span class="line"><span>         |                   |                |</span></span>
<span class="line"><span>+--------v---------+  +------v-----+  +-------v-------+</span></span>
<span class="line"><span>|@xihan-ui/locales |  |@xihan-ui/directives|</span></span>
<span class="line"><span>+--------+---------+  +------+-----+</span></span>
<span class="line"><span>         |                   |</span></span>
<span class="line"><span>         |                   |</span></span>
<span class="line"><span>+--------v---------+  +------v-----+</span></span>
<span class="line"><span>|@xihan-ui/constants|  |             |</span></span>
<span class="line"><span>+--------+---------+  |             |</span></span>
<span class="line"><span>         |             |             |</span></span>
<span class="line"><span>         |             |             |</span></span>
<span class="line"><span>+--------v-------------v-------------v-----+</span></span>
<span class="line"><span>|           @xihan-ui/utils               |</span></span>
<span class="line"><span>+----------------------------------------+</span></span></code></pre></div><h2 id="构建流程" tabindex="-1">构建流程 <a class="header-anchor" href="#构建流程" aria-label="Permalink to &quot;构建流程&quot;">​</a></h2><p>XiHan UI 使用 TurboRepo 进行任务编排，确保各个包按正确的依赖顺序进行构建。使用 Unbuild 作为构建工具，生成 ESM 和 CommonJS 格式的产物，并提供完整的 TypeScript 类型定义。</p><h2 id="包导入路径" tabindex="-1">包导入路径 <a class="header-anchor" href="#包导入路径" aria-label="Permalink to &quot;包导入路径&quot;">​</a></h2><p>在应用中导入 XiHan UI 组件库时，可以使用以下路径：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 导入主包</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> XiHanUI </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;xihan-ui&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 导入特定组件</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { XhButton, XhInput } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@xihan-ui/components&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 导入工具函数</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { deepMerge } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@xihan-ui/utils&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 导入组合式函数</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { useTheme } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@xihan-ui/hooks&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 导入图标</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { XhIcon } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;@xihan-ui/icons&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div>`,32)])])}const k=a(e,[["render",l]]);export{r as __pageData,k as default};
