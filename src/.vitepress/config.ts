import { defineConfig } from "vitepress";
import type { DefaultTheme } from "vitepress/types";

const title: string = "曦寒官方文档";
const description: string = "开发框架和组件库";
const keywords: string = "曦寒,曦寒懿,开发框架,组件库,官方文档,开源,摘繁华";

const Nav: DefaultTheme.NavItem[] = [
  {
    text: "探索未知",
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
    text: "在线体验",
    items: [
      {
        text: "后端-开发框架",
        link: "https://framework.xihanfun.com",
      },
      {
        text: "前端-视图组件",
        link: "https://ui.xihanfun.com",
      },
      {
        text: "用例-管理系统",
        link: "https://admin.xihanfun.com",
      },
    ],
  },
  {
    text: "代码仓库",
    items: [
      {
        text: "Github(国际)",
        items: [
          {
            text: "组织",
            link: "https://github.com/XiHanFun",
          },
          {
            text: "文档",
            link: "https://github.com/XiHanFun/XiHan.Docs",
          },
          {
            text: "后端-开发框架",
            link: "https://github.com/XiHanFun/XiHan.Framework",
          },
          {
            text: "前端-视图组件",
            link: "https://github.com/XiHanFun/XiHan.UI",
          },
          {
            text: "用例-管理系统",
            link: "https://github.com/XiHanFun/XiHan.Admin",
          },
        ],
      },
      {
        text: "Gitee(国内)",
        items: [
          {
            text: "组织",
            link: "https://gitee.com/XiHanFun",
          },
          {
            text: "文档",
            link: "https://gitee.com/XiHanFun/XiHan.Docs",
          },
          {
            text: "后端-开发框架",
            link: "https://gitee.com/XiHanFun/XiHan.Framework",
          },
          {
            text: "前端-视图组件",
            link: "https://gitee.com/XiHanFun/XiHan.UI",
          },
          {
            text: "用例-管理系统",
            link: "https://gitee.com/XiHanFun/XiHan.Admin",
          },
        ],
      },
    ],
  },
];

export default defineConfig({
  srcDir: "docs",
  ignoreDeadLinks: true,
  lang: "zh-CN",
  title: title,
  description: description,
  head: [
    ["meta", { name: "author", content: "ZhaiFanhua" }],
    [
      "meta",
      {
        name: "keywords",
        content: keywords,
      },
    ],
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: "/images/logo.png",
    socialLinks: [{ icon: "github", link: "https://github.com/XiHanFun" }],
    search: {
      provider: "local",
    },
    nav: Nav,
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/XiHanFun/XiHan.Docs/tree/main/src/:path",
    },
    footer: {
      message:
        "Released under The <a href='https://opensource.org/license/MIT' target='_blank'>MIT</a> License.",
      copyright:
        "Copyright ©2021-2024 <a href='https://www.zhaifanhua.com' target='_blank'>ZhaiFanhua</a> All Rights Reserved.",
    },
  },
});
