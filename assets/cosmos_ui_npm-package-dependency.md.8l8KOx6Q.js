import{_ as n,c as a,o as p,ag as e}from"./chunks/framework.Ds6Eueu6.js";const r=JSON.parse('{"title":"npm 包依赖关系","description":"","frontmatter":{"title":"npm 包依赖关系","index":false,"prev":{"text":"目录","link":"./index"},"next":{"text":"npm 关系","link":"./npm-package"}},"headers":[],"relativePath":"cosmos/ui/npm-package-dependency.md","filePath":"cosmos/ui/npm-package-dependency.md","lastUpdated":1743804674000}'),l={name:"cosmos/ui/npm-package-dependency.md"};function i(t,s,c,o,h,d){return p(),a("div",null,s[0]||(s[0]=[e(`<h1 id="依赖关系" tabindex="-1">依赖关系 <a class="header-anchor" href="#依赖关系" aria-label="Permalink to &quot;依赖关系&quot;">​</a></h1><h2 id="_1-utils-最底层-被所有模块依赖" tabindex="-1">1. utils/ (最底层，被所有模块依赖) <a class="header-anchor" href="#_1-utils-最底层-被所有模块依赖" aria-label="Permalink to &quot;1. utils/ (最底层，被所有模块依赖)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>utils/</span></span>
<span class="line"><span>├── types/      // TypeScript 类型定义</span></span>
<span class="line"><span>├── dom/        // DOM 操作工具</span></span>
<span class="line"><span>├── vue/        // Vue 相关工具</span></span>
<span class="line"><span>└── common/     // 通用工具函数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：无外部依赖</span></span>
<span class="line"><span>被依赖：被所有其他模块依赖</span></span></code></pre></div><h2 id="_2-constants-基础常量-几乎被所有模块依赖" tabindex="-1">2. constants/ (基础常量，几乎被所有模块依赖) <a class="header-anchor" href="#_2-constants-基础常量-几乎被所有模块依赖" aria-label="Permalink to &quot;2. constants/ (基础常量，几乎被所有模块依赖)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constants/</span></span>
<span class="line"><span>├── tokens.ts   // 注入令牌</span></span>
<span class="line"><span>├── events.ts   // 事件常量</span></span>
<span class="line"><span>└── props.ts    // 公共Props定义</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/types</span></span>
<span class="line"><span>被依赖：被大多数模块依赖</span></span></code></pre></div><h2 id="_3-themes-主题系统-依赖基础设施" tabindex="-1">3. themes/ (主题系统，依赖基础设施) <a class="header-anchor" href="#_3-themes-主题系统-依赖基础设施" aria-label="Permalink to &quot;3. themes/ (主题系统，依赖基础设施)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>themes/</span></span>
<span class="line"><span>├── default/    // 默认主题</span></span>
<span class="line"><span>├── tokens/     // 设计标记</span></span>
<span class="line"><span>└── dark/       // 暗黑主题</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/</span></span>
<span class="line"><span>- 依赖 constants/</span></span>
<span class="line"><span>被依赖：</span></span>
<span class="line"><span>- 被 components/ 依赖</span></span>
<span class="line"><span>- 被 plugins/theme 依赖</span></span></code></pre></div><h2 id="_4-hooks-组合式函数-依赖多个基础模块" tabindex="-1">4. hooks/ (组合式函数，依赖多个基础模块) <a class="header-anchor" href="#_4-hooks-组合式函数-依赖多个基础模块" aria-label="Permalink to &quot;4. hooks/ (组合式函数，依赖多个基础模块)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>hooks/</span></span>
<span class="line"><span>├── useNamespace/  // BEM命名空间</span></span>
<span class="line"><span>├── useConfig/     // 全局配置</span></span>
<span class="line"><span>├── useTheme/      // 主题钩子</span></span>
<span class="line"><span>└── useLocale/     // 国际化钩子</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/</span></span>
<span class="line"><span>- 依赖 constants/</span></span>
<span class="line"><span>- 依赖 themes/ (useTheme)</span></span>
<span class="line"><span>- 依赖 locales/ (useLocale)</span></span>
<span class="line"><span>被依赖：</span></span>
<span class="line"><span>- 被 components/ 依赖</span></span>
<span class="line"><span>- 被 plugins/ 依赖</span></span></code></pre></div><h2 id="_5-locales-国际化资源" tabindex="-1">5. locales/ (国际化资源) <a class="header-anchor" href="#_5-locales-国际化资源" aria-label="Permalink to &quot;5. locales/ (国际化资源)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>locales/</span></span>
<span class="line"><span>├── zh-CN/     // 中文语言包</span></span>
<span class="line"><span>└── en-US/     // 英文语言包</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/</span></span>
<span class="line"><span>- 依赖 constants/</span></span>
<span class="line"><span>被依赖：</span></span>
<span class="line"><span>- 被 hooks/useLocale 依赖</span></span>
<span class="line"><span>- 被 plugins/locale 依赖</span></span>
<span class="line"><span>- 被 components/ 依赖</span></span></code></pre></div><h2 id="_6-directives-vue-指令" tabindex="-1">6. directives/ (Vue 指令) <a class="header-anchor" href="#_6-directives-vue-指令" aria-label="Permalink to &quot;6. directives/ (Vue 指令)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>directives/</span></span>
<span class="line"><span>├── click-outside/</span></span>
<span class="line"><span>├── resize/</span></span>
<span class="line"><span>└── loading/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/</span></span>
<span class="line"><span>- 依赖 constants/</span></span>
<span class="line"><span>- 依赖 hooks/ (可选)</span></span>
<span class="line"><span>被依赖：</span></span>
<span class="line"><span>- 被 components/ 依赖</span></span></code></pre></div><h2 id="_7-icons-图标系统" tabindex="-1">7. icons/ (图标系统) <a class="header-anchor" href="#_7-icons-图标系统" aria-label="Permalink to &quot;7. icons/ (图标系统)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>icons/</span></span>
<span class="line"><span>├── components/  // 图标组件</span></span>
<span class="line"><span>└── svg/         // SVG资源</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/</span></span>
<span class="line"><span>- 依赖 constants/</span></span>
<span class="line"><span>- 依赖 hooks/useNamespace</span></span>
<span class="line"><span>被依赖：</span></span>
<span class="line"><span>- 被 components/ 依赖</span></span></code></pre></div><h2 id="_8-plugins-插件系统-整合各个模块" tabindex="-1">8. plugins/ (插件系统，整合各个模块) <a class="header-anchor" href="#_8-plugins-插件系统-整合各个模块" aria-label="Permalink to &quot;8. plugins/ (插件系统，整合各个模块)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>plugins/</span></span>
<span class="line"><span>├── theme/      // 主题插件</span></span>
<span class="line"><span>├── locale/     // 国际化插件</span></span>
<span class="line"><span>└── icons/      // 图标插件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/</span></span>
<span class="line"><span>- 依赖 constants/</span></span>
<span class="line"><span>- 依赖 hooks/</span></span>
<span class="line"><span>- 依赖 themes/</span></span>
<span class="line"><span>- 依赖 locales/</span></span>
<span class="line"><span>- 依赖 icons/</span></span>
<span class="line"><span>被依赖：</span></span>
<span class="line"><span>- 被 xihan-ui/ 依赖</span></span></code></pre></div><h2 id="_9-components-组件库核心" tabindex="-1">9. components/ (组件库核心) <a class="header-anchor" href="#_9-components-组件库核心" aria-label="Permalink to &quot;9. components/ (组件库核心)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>components/</span></span>
<span class="line"><span>├── button/</span></span>
<span class="line"><span>├── input/</span></span>
<span class="line"><span>└── form/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖 utils/</span></span>
<span class="line"><span>- 依赖 constants/</span></span>
<span class="line"><span>- 依赖 hooks/</span></span>
<span class="line"><span>- 依赖 themes/</span></span>
<span class="line"><span>- 依赖 locales/</span></span>
<span class="line"><span>- 依赖 directives/</span></span>
<span class="line"><span>- 依赖 icons/</span></span>
<span class="line"><span>被依赖：</span></span>
<span class="line"><span>- 被 xihan-ui/ 依赖</span></span></code></pre></div><h2 id="_10-xihan-ui-入口模块" tabindex="-1">10. xihan-ui/ (入口模块) <a class="header-anchor" href="#_10-xihan-ui-入口模块" aria-label="Permalink to &quot;10. xihan-ui/ (入口模块)&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xihan-ui/</span></span>
<span class="line"><span>├── index.ts    // 主入口</span></span>
<span class="line"><span>└── installer.ts // 安装器</span></span>
<span class="line"><span></span></span>
<span class="line"><span>依赖关系：</span></span>
<span class="line"><span>- 依赖所有其他模块</span></span>
<span class="line"><span>被依赖：无（最顶层模块）</span></span></code></pre></div><h1 id="依赖层级-从底到顶" tabindex="-1">依赖层级（从底到顶） <a class="header-anchor" href="#依赖层级-从底到顶" aria-label="Permalink to &quot;依赖层级（从底到顶）&quot;">​</a></h1><ol><li><p><strong>第一层（基础设施）</strong></p><ul><li>utils/</li><li>constants/</li></ul></li><li><p><strong>第二层（基础功能）</strong></p><ul><li>themes/</li><li>locales/</li><li>icons/</li></ul></li><li><p><strong>第三层（功能模块）</strong></p><ul><li>hooks/</li><li>directives/</li></ul></li><li><p><strong>第四层（核心实现）</strong></p><ul><li>components/</li><li>plugins/</li></ul></li><li><p><strong>第五层（入口模块）</strong></p><ul><li>xihan-ui/</li></ul></li></ol>`,23)]))}const g=n(l,[["render",i]]);export{r as __pageData,g as default};
