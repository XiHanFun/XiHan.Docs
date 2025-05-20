import { DefaultTheme, HeadConfig, defineConfig } from "vitepress";
import pkg from "../package.json";

const title: string = "曦寒官方文档";
const description: string = "开发框架和组件库";
const keywords: string = "曦寒,曦寒懿,开发框架,组件库,官方文档,开源,摘繁华";
const version: string = pkg.version;
const logo: string = "/images/logo.png";
const head: HeadConfig[] = [
  ["meta", { name: "author", content: "ZhaiFanhua" }],
  [
    "meta",
    {
      name: "keywords",
      content: keywords,
    },
  ],
  ["link", { rel: "icon", href: "/favicon.ico" }],
];
const frameworkNavConst: DefaultTheme.NavItemWithLink[] = [
  {
    text: "开发框架",
    link: "cosmos/framework",
  },
  {
    text: "框架概述",
    link: "cosmos/framework/overview",
  },
  {
    text: "快速入门",
    link: "cosmos/framework/quickstart",
  },
  {
    text: "核心模块",
    link: "cosmos/framework/core",
  },
  {
    text: "数据访问",
    link: "cosmos/framework/data-access",
  },
  {
    text: "Web API",
    link: "cosmos/framework/web-api",
  },
  {
    text: "身份认证",
    link: "cosmos/framework/identity",
  },
];

const uiNavConst: DefaultTheme.NavItemWithLink[] = [
  {
    text: "视图组件",
    link: "cosmos/ui",
  },
  {
    text: "组件概述",
    link: "cosmos/ui/overview",
  },
  {
    text: "安装指南",
    link: "cosmos/ui/installation",
  },
  {
    text: "依赖关系",
    link: "cosmos/ui/npm-package-dependency",
  },
];

const basicAppNavConst: DefaultTheme.NavItemWithLink[] = [
  {
    text: "基础应用",
    link: "cosmos/basic-app",
  },
  {
    text: "系统概述",
    link: "cosmos/basic-app/overview",
  },
  {
    text: "快速部署",
    link: "cosmos/basic-app/deployment",
  },
  {
    text: "基础功能",
    link: "cosmos/basic-app/features",
  },
];

const unknownNavConst: (
  | DefaultTheme.NavItemWithLink
  | DefaultTheme.NavItemChildren
)[] = [
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
];

const repositoryNavConst: (
  | DefaultTheme.NavItemWithLink
  | DefaultTheme.NavItemChildren
)[] = [
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
];

const versionNavConst: DefaultTheme.NavItemWithLink[] = [
  {
    text: "更新日志",
    link: "https://github.com/XiHanFun/XiHan.Docs/blob/main/CHANGELOG.md",
  },
];

const contributingNavConst: DefaultTheme.NavItemWithLink[] = [
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
];

const nav: DefaultTheme.NavItem[] = [
  {
    text: "🧩 开发框架",
    items: frameworkNavConst,
  },
  {
    text: "🎨 视图组件",
    items: uiNavConst,
  },
  {
    text: "🏠 基础应用",
    items: basicAppNavConst,
  },
  {
    text: "探索未知",
    items: unknownNavConst,
  },
  {
    text: "代码仓库",
    items: repositoryNavConst,
  },
  {
    text: "贡献代码",
    items: contributingNavConst,
  },
  {
    text: version,
    items: versionNavConst,
  },
];
const sidebar: DefaultTheme.Sidebar = Object.assign(
  {},
  {
    "/": [
      {
        text: "开发框架",
        items: frameworkNavConst,
      },
      {
        text: "视图组件",
        items: uiNavConst,
      },
      {
        text: "基础应用",
        items: basicAppNavConst,
      },
    ],
  }
);

export default defineConfig({
  srcDir: "docs",
  ignoreDeadLinks: true,
  lang: "zh-CN",
  title: title,
  description: description,
  head: head,
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
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    nav: nav,
    sidebar: sidebar,
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    outline: {
      label: "目录",
      level: "deep",
    },
    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
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
