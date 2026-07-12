import { DefaultTheme, HeadConfig, defineConfig } from "vitepress";
import { releases, withNavBadge } from "./versions";

const title: string = "曦寒官方文档";
const description: string = "开发框架和组件库";
const keywords: string = "曦寒,曦寒懿,开发框架,组件库,官方文档,开源,摘繁华";
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

// 生成单个模块包文档条目
function pkg(text: string, name: string): DefaultTheme.SidebarItem {
  return { text, link: `/cosmos/framework/packages/${name}` };
}

const frameworkSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "开始",
    collapsed: false,
    items: [
      { text: "框架简介", link: "/cosmos/framework/" },
      { text: "框架概述", link: "/cosmos/framework/overview" },
      { text: "快速上手", link: "/cosmos/framework/quickstart" },
    ],
  },
  {
    text: "核心概念",
    collapsed: false,
    items: [
      { text: "模块系统", link: "/cosmos/framework/concepts/modularity" },
      { text: "模块生命周期", link: "/cosmos/framework/concepts/lifecycle" },
      {
        text: "依赖注入",
        link: "/cosmos/framework/concepts/dependency-injection",
      },
      { text: "动态 API", link: "/cosmos/framework/concepts/dynamic-api" },
    ],
  },
  {
    text: "模块总览",
    link: "/cosmos/framework/packages/",
    collapsed: false,
    items: [
      {
        text: "公共与核心",
        collapsed: true,
        items: [
          pkg("Utils 通用工具", "utils"),
          pkg("Metadata 元数据", "metadata"),
          pkg("Core 模块化核心", "core"),
          pkg("Analyzers 分析器", "analyzers"),
        ],
      },
      {
        text: "领域与应用",
        collapsed: true,
        items: [
          pkg("Domain.Shared", "domain-shared"),
          pkg("Domain 领域层", "domain"),
          pkg("Application.Contracts", "application-contracts"),
          pkg("Application 应用层", "application"),
        ],
      },
      {
        text: "数据与持久化",
        collapsed: true,
        items: [
          pkg("Data 数据访问", "data"),
          pkg("Uow 工作单元", "uow"),
          pkg("Caching 缓存", "caching"),
        ],
      },
      {
        text: "安全 · 认证 · 授权",
        collapsed: true,
        items: [
          pkg("Security 安全加密", "security"),
          pkg("Authentication 认证", "authentication"),
          pkg("Authorization 授权", "authorization"),
        ],
      },
      {
        text: "多租户 · 配置 · 校验",
        collapsed: true,
        items: [
          pkg("MultiTenancy.Abstractions", "multitenancy-abstractions"),
          pkg("MultiTenancy 多租户", "multitenancy"),
          pkg("Settings 设置", "settings"),
          pkg("Validation.Abstractions", "validation-abstractions"),
          pkg("Validation 校验", "validation"),
        ],
      },
      {
        text: "事件 · 消息 · 通信",
        collapsed: true,
        items: [
          pkg("EventBus.Abstractions", "eventbus-abstractions"),
          pkg("EventBus 事件总线", "eventbus"),
          pkg("EventBus.RabbitMQ", "eventbus-rabbitmq"),
          pkg("EventBus.Kafka", "eventbus-kafka"),
          pkg("EventBus.Redis", "eventbus-redis"),
          pkg("Messaging 消息", "messaging"),
          pkg("Http 客户端", "http"),
        ],
      },
      {
        text: "通用基础设施",
        collapsed: true,
        items: [
          pkg("Serialization 序列化", "serialization"),
          pkg("ObjectMapping 对象映射", "objectmapping"),
          pkg("Localization.Abstractions", "localization-abstractions"),
          pkg("Localization 国际化", "localization"),
          pkg("Logging 日志", "logging"),
          pkg("Auditing 审计日志", "auditing"),
          pkg("Castle AOP", "castle"),
          pkg("Threading 并发", "threading"),
          pkg("Timing 时间", "timing"),
          pkg("DistributedIds 分布式 ID", "distributed-ids"),
        ],
      },
      {
        text: "存储 · 模板 · 任务 · 治理",
        collapsed: true,
        items: [
          pkg("ObjectStorage 对象存储", "object-storage"),
          pkg("VirtualFileSystem 虚拟文件", "virtual-file-system"),
          pkg("Templating 模板", "templating"),
          pkg("Tasks 定时任务", "tasks"),
          pkg("Traffic 流量治理", "traffic"),
          pkg("Upgrade 升级引擎", "upgrade"),
          pkg("Script 脚本引擎", "script"),
          pkg("SearchEngines 搜索", "search-engines"),
          pkg("Observability 可观测性", "observability"),
          pkg("DevTools 开发工具", "devtools"),
        ],
      },
      {
        text: "AI 与机器人",
        collapsed: true,
        items: [
          pkg("AI.Abstractions", "ai-abstractions"),
          pkg("AI 集成", "ai"),
          pkg("Bot 机器人核心", "bot"),
          pkg("Bot.Email 邮件", "bot-email"),
          pkg("Bot.Sms 短信", "bot-sms"),
          pkg("Bot.Telegram", "bot-telegram"),
          pkg("Bot.DingTalk 钉钉", "bot-dingtalk"),
          pkg("Bot.Lark 飞书", "bot-lark"),
          pkg("Bot.WeCom 企业微信", "bot-wecom"),
        ],
      },
      {
        text: "Web 层",
        collapsed: true,
        items: [
          pkg("Web.Core Web 核心", "web-core"),
          pkg("Web.Api 动态 API", "web-api"),
          pkg("Web.Docs API 文档", "web-docs"),
          pkg("Web.Gateway 网关", "web-gateway"),
          pkg("Web.Grpc gRPC", "web-grpc"),
          pkg("Web.RealTime 实时通信", "web-realtime"),
        ],
      },
    ],
  },
  { text: "更新日志", link: "/cosmos/framework/changelog" },
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
const basicAppSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "开始",
    collapsed: false,
    items: [
      { text: "应用简介", link: "/cosmos/basic-app/" },
      { text: "系统概述", link: "/cosmos/basic-app/overview" },
      { text: "开发环境", link: "/cosmos/basic-app/dev-environment" },
      { text: "快速开始", link: "/cosmos/basic-app/getting-started" },
    ],
  },
  {
    text: "架构",
    collapsed: false,
    items: [{ text: "系统架构", link: "/cosmos/basic-app/architecture" }],
  },
  {
    text: "核心能力",
    collapsed: false,
    items: [
      { text: "身份与认证", link: "/cosmos/basic-app/identity" },
      { text: "权限模型", link: "/cosmos/basic-app/permissions" },
      { text: "多租户与版本", link: "/cosmos/basic-app/multi-tenancy" },
      { text: "消息中心", link: "/cosmos/basic-app/messaging" },
      { text: "审计日志", link: "/cosmos/basic-app/audit-log" },
      { text: "代码生成", link: "/cosmos/basic-app/code-generation" },
      { text: "AI 能力", link: "/cosmos/basic-app/ai" },
    ],
  },
  {
    text: "前端与二次开发",
    collapsed: false,
    items: [
      { text: "前端指南", link: "/cosmos/basic-app/frontend" },
      { text: "二次开发", link: "/cosmos/basic-app/development" },
    ],
  },
  {
    text: "参考",
    collapsed: false,
    items: [
      { text: "功能清单", link: "/cosmos/basic-app/features" },
      { text: "部署", link: "/cosmos/basic-app/deployment" },
      { text: "更新日志", link: "/cosmos/basic-app/changelog" },
    ],
  },
];

// cosmos 根下的独立页原本没有配 sidebar，会落到默认主题的窄列布局
const startSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "开始",
    collapsed: false,
    items: [
      { text: "项目简介", link: "/cosmos/guide" },
      { text: "快速上手", link: "/cosmos/getstart" },
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
    link: "/cosmos/framework",
    activeMatch: "/cosmos/framework/",
  },
  {
    text: withNavBadge("🎨 视图组件", releases.ui),
    link: "/cosmos/ui",
    activeMatch: "/cosmos/ui/",
  },
  {
    text: withNavBadge("🏠 基础应用", releases.basicApp),
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
        text: "Atomgit同步备库(国内)",
        items: [
          {
            text: "后端 | 开发框架",
            link: "https://atomgit.com/XiHanFun/XiHan.Framework",
          },
          {
            text: "前端 | 视图组件",
            link: "https://atomgit.com/XiHanFun/XiHan.UI",
          },
          {
            text: "用例 | 基础应用",
            link: "https://atomgit.com/XiHanFun/XiHan.BasicApp",
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
        link: "/cosmos/framework/changelog",
      },
      {
        text: "基础应用更新日志",
        link: "/cosmos/basic-app/changelog",
      },
    ],
  },
];
const sidebar: DefaultTheme.Sidebar = {
  "/cosmos/framework/": frameworkSidebar,
  "/cosmos/ui/": [
    {
      text: "视图组件",
      collapsed: false,
      items: uiNavConst,
    },
  ],
  "/cosmos/basic-app/": basicAppSidebar,

  // cosmos 根下的独立页：按前缀逐页登记（VitePress 取路径段最多的键，不会与上面三个目录键相冲）
  "/cosmos/guide": startSidebar,
  "/cosmos/getstart": startSidebar,
  "/cosmos/code-of-conduct": contributeSidebar,
  "/cosmos/contributing": contributeSidebar,
  "/cosmos/contributors": contributeSidebar,
  "/cosmos/sponsor": contributeSidebar,
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
      { icon: "git", link: "https://atomgit.com/XiHanFun" },
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
        "Released under The <a href='https://opensource.org/license/MIT' target='_blank'>MIT</a> License",
      copyright:
        "Copyright ©2021-Present <a href='https://www.xihanfun.com' target='_blank'>XiHanFun</a> and <a href='https://www.zhaifanhua.com' target='_blank'>ZhaiFanhua</a>",
    },
  },
});
