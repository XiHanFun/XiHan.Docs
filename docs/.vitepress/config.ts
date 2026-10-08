import type { DefaultTheme } from "vitepress";
import { defineXiHanConfig } from "@xihanfun/vitepress-theme/config";
import { releases, withNavBadge } from "./versions.ts";

const title: string = "曦寒懿文档";
const description: string = "拥有底座、组件、应用完整生态";
const keywords: string = "曦寒,曦寒懿,开发框架,组件库,官方文档,开源,XiHanFun";

// 三大板块的文档站：正文由各自仓库维护，本站只做导览
const docSites = {
  framework: "https://framework.docs.xihanfun.com",
  ui: "https://ui.docs.xihanfun.com",
  basicApp: "https://basicapp.docs.xihanfun.com",
};

const startSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "开始",
    collapsed: false,
    items: [
      { text: "项目简介", link: "/cosmos/guide" },
      { text: "快速上手", link: "/cosmos/getstart" },
      { text: "生态总览", link: "/cosmos/ecosystem" },
    ],
  },
  {
    text: "三大板块文档",
    collapsed: false,
    items: [
      { text: "🧩 开发框架", link: docSites.framework },
      { text: "🎨 视图组件", link: docSites.ui },
      { text: "🏠 基础应用", link: docSites.basicApp },
    ],
  },
];

const contributeSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "参与贡献",
    collapsed: false,
    items: [
      { text: "公约", link: "/cosmos/code-of-conduct" },
      { text: "指南", link: "/cosmos/contributing" },
      { text: "贡献者", link: "/cosmos/contributors" },
      { text: "支持&赞助", link: "/cosmos/sponsor" },
    ],
  },
];

const nav: DefaultTheme.NavItem[] = [
  {
    text: withNavBadge("🧩 开发框架", releases.framework),
    link: docSites.framework,
  },
  {
    text: withNavBadge("🎨 视图组件", releases.ui),
    link: docSites.ui,
  },
  {
    text: withNavBadge("🏠 基础应用", releases.basicApp),
    link: docSites.basicApp,
  },
  {
    text: "探索未知",
    items: [
      {
        text: "关于我们",
        items: [
          {
            text: "官方网站",
            link: "https://www.xihanfun.com",
          },
        ],
      },
    ],
  },
  {
    text: "参与贡献",
    items: [
      {
        text: "公约",
        link: "cosmos/code-of-conduct",
      },
      {
        text: "指南",
        link: "cosmos/contributing",
      },
      {
        text: "贡献者",
        link: "cosmos/contributors",
      },
      {
        text: "支持&赞助",
        link: "cosmos/sponsor",
      },
    ],
  },
];

// cosmos 根下的独立页原本没有配 sidebar，会落到默认主题的窄列布局
const sidebar: DefaultTheme.Sidebar = {
  "/cosmos/guide": startSidebar,
  "/cosmos/getstart": startSidebar,
  "/cosmos/ecosystem": startSidebar,
  "/cosmos/code-of-conduct": contributeSidebar,
  "/cosmos/contributing": contributeSidebar,
  "/cosmos/contributors": contributeSidebar,
  "/cosmos/sponsor": contributeSidebar,
};

export default defineXiHanConfig({
  title,
  description,
  keywords,
  repo: "XiHan.Docs",
  banner: {
    id: "2026-10-docs-theme",
    text: "曦寒懿文档全新改版上线：开发框架、视图组件与基础应用文档统一升级",
    link: "https://docs.xihanfun.com/cosmos/ecosystem",
    linkText: "查看生态总览",
  },
  llms: {
    title: "曦寒懿",
    summary: "曦寒懿（XiHanFun）开源生态：XiHan.Framework 是后端基座，XiHan.UI 是前端基座，XiHan.BasicApp 是基础应用。本站承载项目简介、跨仓快速上手、生态总览与参与贡献约定，三个产品的正文在各自的文档站。",
    sections: [
      { dir: ".", label: "首页" },
      { dir: "cosmos", label: "生态" },
    ],
  },
  themeConfig: {
    // 门户是组织站，社交链接指向组织主页
    socialLinks: [
      { icon: "github", link: "https://github.com/XiHanFun" },
      { icon: "gitee", link: "https://gitee.com/XiHanFun" },
      { icon: "gitcode", link: "https://gitcode.com/XiHanFun" },
    ],
    nav,
    sidebar,
  },
});
