import{_ as s,o as n,c as e,a3 as p}from"./chunks/framework.BveOjhN0.js";const u=JSON.parse('{"title":"系统架构","description":"","frontmatter":{},"headers":[],"relativePath":"cosmos/basic-app/architecture.md","filePath":"cosmos/basic-app/architecture.md","lastUpdated":1783216089000}'),t={name:"cosmos/basic-app/architecture.md"};function i(l,a,c,o,r,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="系统架构" tabindex="-1">系统架构 <a class="header-anchor" href="#系统架构" aria-label="Permalink to &quot;系统架构&quot;">​</a></h1><p>XiHan.BasicApp 采用前后端分离。后端按<strong>框架层 → 模块层 → 主应用层</strong>组织，每个业务模块内部遵循 DDD 分层（Domain / Application / Infrastructure）。</p><h2 id="后端分层" tabindex="-1">后端分层 <a class="header-anchor" href="#后端分层" aria-label="Permalink to &quot;后端分层&quot;">​</a></h2><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│                   XiHan.BasicApp.WebHost                      │</span></span>
<span class="line"><span>│                   (启动入口与模块聚合)                          │</span></span>
<span class="line"><span>├──────────────────────────────┬──────────────────────────────┤</span></span>
<span class="line"><span>│  XiHan.BasicApp.Saas         │  XiHan.BasicApp.CodeGeneration│</span></span>
<span class="line"><span>│  (RBAC / 多租户 / 审计)       │  (代码生成与模板管理)           │</span></span>
<span class="line"><span>├──────────────────────────────┴──────────────────────────────┤</span></span>
<span class="line"><span>│                   XiHan.BasicApp.Web.Core                     │</span></span>
<span class="line"><span>│              (Web 核心能力 / 动态 API / 网关 / 灰度)            │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                     XiHan.BasicApp.Core                       │</span></span>
<span class="line"><span>│               (基础应用能力 / DDD / CQRS / 模块化)             │</span></span>
<span class="line"><span>├─────────────────────────────────────────────────────────────┤</span></span>
<span class="line"><span>│                      XiHan.Framework.*                        │</span></span>
<span class="line"><span>│      底层框架(认证 / 授权 / 数据 / 缓存 / 事件总线 / 多租户)     │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────┘</span></span></code></pre></div><table tabindex="0"><thead><tr><th>项目</th><th>说明</th></tr></thead><tbody><tr><td><code>XiHan.BasicApp.Core</code></td><td>基础应用能力，集成 DDD / CQRS / 事件总线 / 认证 / 授权 / 缓存 / 多租户</td></tr><tr><td><code>XiHan.BasicApp.Web.Core</code></td><td>Web 核心能力，动态 API / Scalar / SignalR / 网关 / 灰度路由</td></tr><tr><td><code>XiHan.BasicApp.Saas</code></td><td>核心业务模块：用户 / 角色 / 权限 / 菜单 / 部门 / 租户 / 配置 / 字典 / 文件 / 通知 / 日志 / 任务</td></tr><tr><td><code>XiHan.BasicApp.CodeGeneration</code></td><td>代码生成：数据源管理 / 表结构导入 / 模板配置 / 全栈生成</td></tr><tr><td><code>XiHan.BasicApp.WebHost</code></td><td>启动入口，聚合所有模块</td></tr></tbody></table><p><code>Saas</code> 与 <code>CodeGeneration</code> 都是<strong>一等业务模块</strong>，各自独立成项目、经 <code>[DependsOn]</code> 挂载到 <code>WebHost</code>。这也是你新增一个大功能域时的推荐范式：新建独立模块项目，而非往 <code>Saas</code> 里塞切片。</p><h2 id="目录结构" tabindex="-1">目录结构 <a class="header-anchor" href="#目录结构" aria-label="Permalink to &quot;目录结构&quot;">​</a></h2><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>XiHan.BasicApp/</span></span>
<span class="line"><span>├── backend/                 # 后端（.NET 10）</span></span>
<span class="line"><span>│   ├── src/</span></span>
<span class="line"><span>│   │   ├── framework/       #   Core / Web.Core 基础能力</span></span>
<span class="line"><span>│   │   ├── modules/         #   Saas、CodeGeneration 模块</span></span>
<span class="line"><span>│   │   └── main/            #   WebHost 启动入口</span></span>
<span class="line"><span>│   ├── props/               #   共享 MSBuild 属性</span></span>
<span class="line"><span>│   ├── scripts/             #   部署与运维脚本</span></span>
<span class="line"><span>│   └── test/                #   测试项目</span></span>
<span class="line"><span>├── frontend/                # 前端（Vue 3 + Naive UI）</span></span>
<span class="line"><span>│   ├── src/                 #   应用源码</span></span>
<span class="line"><span>│   └── packages/            #   内部包</span></span>
<span class="line"><span>└── assets/                  # README 资源</span></span></code></pre></div><h2 id="后端如何暴露接口" tabindex="-1">后端如何暴露接口 <a class="header-anchor" href="#后端如何暴露接口" aria-label="Permalink to &quot;后端如何暴露接口&quot;">​</a></h2><p>BasicApp 用 <a href="./../framework/concepts/dynamic-api">XiHan.Framework 的动态 API</a>：<strong>应用服务经 <code>[DynamicApi]</code> 直接暴露为 REST 接口，没有 Controller 样板</strong>，Scalar 文档自动生成。</p><p>请求进来后会经过框架 <a href="./../framework/concepts/lifecycle#真实示例-web-api-的中间件管道">Web.Api 的中间件管道</a>：TraceId → 请求文化 → 认证 → <strong>租户解析</strong> → 授权 → 端点，因此每个请求天然带上租户上下文与权限判定。</p><p>菜单也是后端驱动的：后端 <code>PageRegistry</code> 作为<strong>单一事实源</strong>，统一注册菜单、路由、组件路径、权限码与国际化键，前端据此渲染。</p><h2 id="前端结构" tabindex="-1">前端结构 <a class="header-anchor" href="#前端结构" aria-label="Permalink to &quot;前端结构&quot;">​</a></h2><p>前端是 Vue 3 + TypeScript + Naive UI 的中后台应用，几个关键设计：</p><ul><li><strong>Schema 驱动列表页</strong>：搜索 / 表格 / 导出由一份 Schema 配置生成，内置列设置、密度切换、高级搜索、个人视图保存、树形模式、列宽拖拽</li><li><strong>三级权限过滤</strong>：页面、字段、操作三级按权限码过滤，字段级脱敏；列设置与搜索偏好同步到后端，多端一致</li><li><strong>状态管理</strong>：Pinia；国际化：vue-i18n；样式：Tailwind CSS 4 + Naive UI</li></ul><h2 id="前后端协作数据流" tabindex="-1">前后端协作数据流 <a class="header-anchor" href="#前后端协作数据流" aria-label="Permalink to &quot;前后端协作数据流&quot;">​</a></h2><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Vue 页面 (Schema 配置)</span></span>
<span class="line"><span>   │  发起请求（POST 分页约定，带 X-Language / X-Timezone 头）</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>动态 API（应用服务方法）</span></span>
<span class="line"><span>   │  经中间件管道：认证 → 租户解析 → 授权 → 字段级脱敏</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>应用服务 (CQRS) → 仓储 (SqlSugar) → PostgreSQL</span></span>
<span class="line"><span>   │</span></span>
<span class="line"><span>   └─ 写路径精准失效分布式缓存（授权快照 / 菜单 / 配置 / 字典）</span></span></code></pre></div><h2 id="下一步" tabindex="-1">下一步 <a class="header-anchor" href="#下一步" aria-label="Permalink to &quot;下一步&quot;">​</a></h2><ul><li><a href="./permissions">权限模型</a>：RBAC + ABAC 的落地细节</li><li><a href="./features">功能清单</a>：各模块具体能力</li><li><a href="./../framework/concepts/modularity">框架核心概念</a>：理解底层模块化机制</li></ul>`,19)])])}const b=s(t,[["render",i]]);export{u as __pageData,b as default};
