import type { DefaultTheme } from "vitepress";
import { defineXiHanConfig } from "@xihanfun/vitepress-theme/config";
import { releases, withNavBadge } from "./versions.ts";

const title: string = "曦寒懿官方文档";
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
          {
            text: "官方文档",
            link: "https://docs.xihanfun.com",
          },
        ],
      },
      {
        text: "引用下载",
        items: [
          {
            text: "后端 | nuget",
            link: "https://www.nuget.org/profiles/XiHanFun",
          },
          {
            text: "前端 | npm",
            link: "https://www.npmjs.com/org/xihan-ui",
          },
        ],
      },
      {
        text: "在线体验",
        items: [
          {
            text: "后端 | 开发框架",
            link: "https://framework.xihanfun.com",
          },
          {
            text: "前端 | 视图组件",
            link: "https://ui.xihanfun.com",
          },
          {
            text: "用例 | 基础应用",
            link: "https://basicapp.xihanfun.com",
          },
        ],
      },
    ],
  },
  {
    text: "代码仓库",
    items: [
      {
        text: "Github主库(国际)",
        items: [
          {
            text: "后端 | 开发框架",
            link: "https://github.com/XiHanFun/XiHan.Framework",
          },
          {
            text: "前端 | 视图组件",
            link: "https://github.com/XiHanFun/XiHan.UI",
          },
          {
            text: "用例 | 基础应用",
            link: "https://github.com/XiHanFun/XiHan.BasicApp",
          },
        ],
      },
      {
        text: "Gitee同步备库(国内)",
        items: [
          {
            text: "后端 | 开发框架",
            link: "https://gitee.com/XiHanFun/XiHan.Framework",
          },
          {
            text: "前端 | 视图组件",
            link: "https://gitee.com/XiHanFun/XiHan.UI",
          },
          {
            text: "用例 | 基础应用",
            link: "https://gitee.com/XiHanFun/XiHan.BasicApp",
          },
        ],
      },
      {
        text: "GitCode同步备库(国内)",
        items: [
          {
            text: "后端 | 开发框架",
            link: "https://gitcode.com/XiHanFun/XiHan.Framework",
          },
          {
            text: "前端 | 视图组件",
            link: "https://gitcode.com/XiHanFun/XiHan.UI",
          },
          {
            text: "用例 | 基础应用",
            link: "https://gitcode.com/XiHanFun/XiHan.BasicApp",
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
  {
    text: "版本日志",
    items: [
      {
        text: "开发框架更新日志",
        link: `${docSites.framework}/changelog`,
      },
      {
        text: "视图组件更新日志",
        link: `${docSites.ui}/changelog`,
      },
      {
        text: "基础应用更新日志",
        link: `${docSites.basicApp}/changelog`,
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
