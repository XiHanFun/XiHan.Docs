---
layout: home
title: 曦寒官方文档
titleTemplate: 快速 轻量 高效 用心的开发框架和组件库

hero:
  name: 曦寒
  text: 快速 轻量 高效 用心的开发框架和组件库
  tagline: 基于 DotNet 和 Vue 构建
  image:
    src: /images/logo.png
    alt: 曦寒
  actions:
    - theme: brand
      text: 快速上手
      link: cosmos/getstart

    - theme: alt
      text: 项目简介
      link: cosmos/guide

    - theme: brand
      text: 在线预览
      link: https://basicapp.xihanfun.com

    - theme: alt
      text: Github
      link: https://github.com/XiHanFun

    - theme: alt
      text: Gitee
      link: https://gitee.com/XiHanFun

    - theme: alt
      text: Atomgit
      link: https://atomgit.com/XiHanFun

features:
  - title: 开发框架
    icon: 🧩
    details: 采用灵活的模块化设计，让您可以按需引入所需功能，避免不必要的开销。每个模块均经过精心打磨，可独立使用也可无缝协作。
    link: cosmos/framework/index
    linkText: "浏览开发框架文档"

  - title: 视图组件
    icon: 🎨
    details: 提供大量开箱即用的组件，覆盖了从基础控件到复杂业务场景的各种需求，节省您的开发时间，让您专注于业务逻辑的实现。
    link: cosmos/ui/index
    linkText: "浏览视图组件文档"

  - title: 基础应用
    icon: 🏠
    details: 提供完整的企业级应用构建方案，包括权限管理、工作流、报表系统等常用功能，助力企业快速构建安全、稳定、高效的业务系统。
    link: cosmos/basic-app/index
    linkText: "浏览基础应用文档"

  - title: 高效快速跨平台
    icon: 🛠️
    details: 后端由 DotNet10 驱动，执行速度快于任何其他常用框架，可以在多个平台运行。精心设计之功能、不断研磨之算法，在程序的高性能、高可用和高扩展性上夯实基础。
    link: https://dotnet.microsoft.com/zh-cn/
    linkText: "了解 DotNet"

  - title: 性能出色灵活多变
    icon: 🚀
    details: 前端由 Vue3.5 驱动，经过编译器优化、完全响应式的渲染系统，几乎不需要手动优化。丰富的、可渐进式集成的生态系统，可以根据应用规模在库和框架间切换自如。
    link: https://cn.vuejs.org/
    linkText: "了解 Vue"

  - title: 拥抱开源
    icon: 🤩
    details: 所有代码均开源在 GitHub 和 Gitee 上且处于积极维护状态，在共享所得之时，也积极促进技术之进，社区之兴。
    link: https://github.com/XiHanFun
    linkText: "了解 XiHanFun"

footer:
  message: 基于 MIT 许可发布 | Copyright © 2021-至今 XiHanFun
  links:
    - text: 快速上手
      link: cosmos/getstart
    - text: Github
      link: https://github.com/XiHanFun
    - text: Gitee
      link: https://gitee.com/XiHanFun
---

<div class="bap-preview">
<span class="bap-eyebrow">在线演示</span>
<h2 class="bap-title">基础应用 · 在线预览</h2>
<p class="bap-desc">XiHan.BasicApp 是基于本框架构建的企业级中后台：多租户、RBAC + ABAC 权限、代码生成、实时通信开箱即用。<br />无需本地搭建，点击下方窗口直接在线体验。</p>
<div class="bap-window">
<div class="bap-bar"><span class="bap-dots"><span class="bap-dot bap-dot--r"></span><span class="bap-dot bap-dot--y"></span><span class="bap-dot bap-dot--g"></span></span><span class="bap-url">basicapp.xihanfun.com</span></div>
<a class="bap-screen" href="https://basicapp.xihanfun.com" target="_blank" rel="noreferrer">
<img class="bap-img bap-img--light" src="/images/basicapp-preview.png" alt="XiHan.BasicApp 在线预览" />
<img class="bap-img bap-img--dark" src="/images/basicapp-preview-dark.png" alt="XiHan.BasicApp 在线预览（暗色）" />
</a>
</div>
<div class="bap-actions">
<a class="bap-btn" href="https://basicapp.xihanfun.com" target="_blank" rel="noreferrer">立即在线体验 →</a>
<a class="bap-link" href="cosmos/basic-app/">了解基础应用</a>
</div>
<p class="bap-cred">演示账号 <code>superadmin</code> · 密码 <code>SuperAdmin@123</code> · 演示环境，请勿录入真实数据</p>
</div>

<style>
.bap-preview {
  max-width: 1080px;
  margin: 112px auto 0;
  padding: 0 24px;
  text-align: center;
}
/* 选择器均带 .bap-preview 前缀以覆盖 VitePress 默认的 .vp-doc h2 / a / p / img 样式 */
.bap-preview .bap-eyebrow {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
}
.bap-preview h2.bap-title {
  font-size: 32px;
  line-height: 1.2;
  font-weight: 800;
  border-top: none;
  margin: 18px 0 14px;
  padding-top: 0;
  letter-spacing: -0.02em;
}
.bap-preview p.bap-desc {
  max-width: 640px;
  margin: 0 auto 36px;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}
.bap-preview .bap-window {
  max-width: 1040px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 24px 60px -18px rgba(0, 0, 0, 0.3);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.bap-preview .bap-window:hover {
  transform: translateY(-6px);
  box-shadow: 0 36px 72px -18px rgba(0, 0, 0, 0.4);
}
.bap-preview .bap-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 16px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}
.bap-preview .bap-dots {
  position: absolute;
  left: 16px;
  display: flex;
  gap: 8px;
}
.bap-preview .bap-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.bap-preview .bap-dot--r { background: #ff5f57; }
.bap-preview .bap-dot--y { background: #febc2e; }
.bap-preview .bap-dot--g { background: #28c840; }
.bap-preview .bap-url {
  margin: 0 auto;
  padding: 4px 18px;
  min-width: 240px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  font-size: 13px;
}
.bap-preview .bap-screen {
  display: block;
}
.bap-preview .bap-img {
  display: block;
  width: 100%;
  height: auto;
}
.bap-preview .bap-img--dark {
  display: none;
}
.dark .bap-preview .bap-img--light {
  display: none;
}
.dark .bap-preview .bap-img--dark {
  display: block;
}
.bap-preview .bap-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 36px 0 14px;
}
.bap-preview a.bap-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 30px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 10px 22px -8px rgba(0, 0, 0, 0.24);
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.bap-preview a.bap-btn:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 14px 28px -8px rgba(0, 0, 0, 0.3);
}
.bap-preview a.bap-link {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.25s ease, color 0.25s ease;
}
.bap-preview a.bap-link:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.bap-preview p.bap-cred {
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-size: 13.5px;
}
@media (max-width: 640px) {
  .bap-preview { margin-top: 72px; }
  .bap-preview h2.bap-title { font-size: 26px; }
  .bap-preview .bap-url {
    min-width: 0;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
