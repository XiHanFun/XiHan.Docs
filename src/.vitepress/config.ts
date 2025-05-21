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
    link: "/cosmos/framework",
    activeMatch: "/cosmos/framework/",
  },
  {
    text: "框架概述",
    link: "/cosmos/framework/overview",
    activeMatch: "/cosmos/framework/overview/",
  },
  {
    text: "快速入门",
    link: "/cosmos/framework/quickstart",
    activeMatch: "/cosmos/framework/quickstart/",
  },
  {
    text: "核心模块",
    link: "/cosmos/framework/core",
    activeMatch: "/cosmos/framework/core/",
  },
  {
    text: "数据访问",
    link: "/cosmos/framework/data-access",
    activeMatch: "/cosmos/framework/data-access/",
  },
  {
    text: "Web API",
    link: "/cosmos/framework/web-api",
    activeMatch: "/cosmos/framework/web-api/",
  },
  {
    text: "身份认证",
    link: "/cosmos/framework/identity",
    activeMatch: "/cosmos/framework/identity/",
  },
];
const uiNavConst: DefaultTheme.NavItemWithLink[] = [
  {
    text: "视图组件",
    link: "/cosmos/ui",
    activeMatch: "/cosmos/ui/",
  },
  {
    text: "组件概述",
    link: "/cosmos/ui/overview",
    activeMatch: "/cosmos/ui/overview/",
  },
  {
    text: "安装指南",
    link: "/cosmos/ui/installation",
    activeMatch: "/cosmos/ui/installation/",
  },
  {
    text: "依赖关系",
    link: "/cosmos/ui/npm-package-dependency",
    activeMatch: "/cosmos/ui/npm-package-dependency/",
  },
];
const basicAppNavConst: DefaultTheme.NavItemWithLink[] = [
  {
    text: "基础应用",
    link: "/cosmos/basic-app",
    activeMatch: "/cosmos/basic-app/",
  },
  {
    text: "系统概述",
    link: "/cosmos/basic-app/overview",
    activeMatch: "/cosmos/basic-app/overview/",
  },
  {
    text: "快速部署",
    link: "/cosmos/basic-app/deployment",
    activeMatch: "/cosmos/basic-app/deployment/",
  },
  {
    text: "基础功能",
    link: "/cosmos/basic-app/features",
    activeMatch: "/cosmos/basic-app/features/",
  },
];

const nav: DefaultTheme.NavItem[] = [
  {
    text: "🧩 开发框架",
    link: "/cosmos/framework",
    activeMatch: "/cosmos/framework/",
  },
  {
    text: "🎨 视图组件",
    link: "/cosmos/ui",
    activeMatch: "/cosmos/ui/",
  },
  {
    text: "🏠 基础应用",
    link: "/cosmos/basic-app",
    activeMatch: "/cosmos/basic-app/",
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
const sidebar: DefaultTheme.Sidebar = {
  "/cosmos/framework/": [
    {
      text: "开发框架",
      collapsed: false,
      items: frameworkNavConst,
    },
  ],
  "/cosmos/ui/": [
    {
      text: "视图组件",
      collapsed: false,
      items: uiNavConst,
    },
  ],
  "/cosmos/basic-app/": [
    {
      text: "基础应用",
      collapsed: false,
      items: basicAppNavConst,
    },
  ],
};

function searchOptions(): Partial<DefaultTheme.AlgoliaSearchOptions> {
  return {
    placeholder: "搜索文档",
    translations: {
      button: {
        buttonText: "搜索文档",
        buttonAriaLabel: "搜索文档",
      },
      modal: {
        searchBox: {
          resetButtonTitle: "清除查询条件",
          resetButtonAriaLabel: "清除查询条件",
          cancelButtonText: "取消",
          cancelButtonAriaLabel: "取消",
        },
        startScreen: {
          recentSearchesTitle: "搜索历史",
          noRecentSearchesText: "没有搜索历史",
          saveRecentSearchButtonTitle: "保存至搜索历史",
          removeRecentSearchButtonTitle: "从搜索历史中移除",
          favoriteSearchesTitle: "收藏",
          removeFavoriteSearchButtonTitle: "从收藏中移除",
        },
        errorScreen: {
          titleText: "无法获取结果",
          helpText: "你可能需要检查你的网络连接",
        },
        footer: {
          selectText: "选择",
          navigateText: "切换",
          closeText: "关闭",
          searchByText: "搜索提供者",
        },
        noResultsScreen: {
          noResultsText: "无法找到相关结果",
          suggestedQueryText: "你可以尝试查询",
          reportMissingResultsText: "你认为该查询应该有结果？",
          reportMissingResultsLinkText: "点击反馈",
        },
      },
    },
  };
}

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
      options: searchOptions(),
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
    skipToContentLabel: "跳转到内容",
    notFound: {
      title: "页面未找到",
      quote:
        "但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。",
      linkLabel: "前往首页",
      linkText: "带我回首页",
    },
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern: "https://github.com/XiHanFun/XiHan.Docs/tree/main/src/:path",
    },
    lastUpdated: {
      text: "最后更新于",
    },
    footer: {
      message:
        "Released under The <a href='https://opensource.org/license/MIT' target='_blank'>MIT</a> License.",
      copyright:
        "Copyright ©2021-Present <a href='https://www.xihanfun.com' target='_blank'>XiHanFun</a> All Rights Reserved.",
    },
  },
});
