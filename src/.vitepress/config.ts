import { DefaultTheme, defineConfig } from "vitepress";
import pkg from "../package.json";

const title: string = "曦寒官方文档";
const description: string = "开发框架和组件库";
const keywords: string = "曦寒,曦寒懿,开发框架,组件库,官方文档,开源,摘繁华";
const version: string = pkg.version;
const logo: string = "/images/logo.png";
const nav: DefaultTheme.NavItem[] = [
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
    text: "引用下载",
    items: [
      {
        text: "后端 | nuget",
        link: "https://www.nuget.org/packages?q=XiHan",
      },
      {
        text: "前端 | npm",
        link: "https://www.npmjs.com/search?q=xihan",
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
  {
    text: "代码仓库",
    items: [
      {
        text: "Github(国际)",
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
        text: "Gitee(国内)",
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
    ],
  },
  {
    text: version,
    items: [
      {
        text: "更新日志",
        link: "https://github.com/XiHanFun/XiHan.Docs/blob/main/CHANGELOG.md",
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
    logo: logo,
    socialLinks: [
      { icon: "github", link: "https://github.com/XiHanFun" },
      { icon: "gitee", link: "https://gitee.com/XiHanFun" },
    ],
    search: {
      provider: "local",
    },
    nav: nav,
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/XiHanFun/XiHan.Docs/tree/main/src/:path",
    },
    footer: {
      message:
        "Released under The <a href='https://opensource.org/license/MIT' target='_blank'>MIT</a> License.",
      copyright:
        "Copyright ©2021-Present <a href='https://www.xihanfun.com' target='_blank'>XiHanFun</a> All Rights Reserved.",
    },
  },
});
