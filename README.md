![LOGO](./assets/LOGO.png)

[![GitHub Star](https://img.shields.io/github/stars/XiHanFun/XiHan.Docs?style=flat&logo=github)](https://github.com/XiHanFun/XiHan.Docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[曦寒懿官方交流群](https://qm.qq.com/q/qYp1Urv3z2) 462371834 | [在线访问](https://docs.xihanfun.com)

# XiHan.Docs

快速、轻量、高效、用心的框架和组件库，基于 DotNet 和 Vue 构建。

## 简介

XiHan.Docs 是曦寒（XiHanFun）组织级文档站的源码仓库，基于 [VitePress](https://vitepress.dev/) 构建。本站承载生态层面的内容——项目简介、跨仓快速上手、生态总览与参与贡献约定；三大产品的正文文档各自随代码放在对应仓库的 `docs/` 目录，并部署为独立站点：

| 板块 | 仓库 | 文档站 |
| --- | --- | --- |
| 🧩 开发框架 | [XiHan.Framework](https://github.com/XiHanFun/XiHan.Framework) | <https://framework.docs.xihanfun.com> |
| 🎨 视图组件 | [XiHan.UI](https://github.com/XiHanFun/XiHan.UI) | <https://ui.docs.xihanfun.com> |
| 🏠 基础应用 | [XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp) | <https://basicapp.docs.xihanfun.com> |

四个站点使用同一套 VitePress 基础设施（主题、版本徽章、本地搜索、部署工作流），各自独立构建与发布。

本站部署在 <https://docs.xihanfun.com>，构建产物通过 GitHub Actions 自动发布到 GitHub Pages。

## 技术栈

| 类别     | 技术                        | 版本           |
| -------- | --------------------------- | -------------- |
| 站点框架 | VitePress                   | ^1.6.4         |
| 视图库   | Vue                         | ^3.5.39        |
| 包管理   | pnpm（workspace）           | 建议 11+       |
| 运行时   | Node.js                     | 建议 24+（CI 使用 24） |

版本以 [`docs/package.json`](./docs/package.json) 与 CI 工作流 [`deploy-docs.yml`](./.github/workflows/deploy-docs.yml) 为准。

## 目录结构

```text
XiHan.Docs/
├── docs/                       # VitePress 站点：package.json 所在目录即站点根目录，正文页也直接放在这里
│   ├── .vitepress/
│   │   ├── config.ts             # 站点配置：nav 导航、sidebar 侧栏、本地搜索、社交链接、editLink 等
│   │   ├── versions.ts           # 三大板块「导航徽章」版本号与发布阶段（本站导航外链用）
│   │   ├── theme/                 # 自定义主题：index.ts + overrides.css / rainbow.css / vars.css
│   │   └── dist/                   # 构建产物目录（pnpm run build 生成，不提交）
│   ├── index.md                  # 首页（Hero + Features + 在线预览卡片）
│   ├── public/                   # 静态资源：favicon.ico、images/、robots.txt
│   ├── cosmos/                   # 全部正文页面
│   │   ├── guide.md               # 项目简介
│   │   ├── getstart.md             # 跨三仓快速上手
│   │   ├── ecosystem.md             # 生态总览：三仓关系与选型指引
│   │   └── code-of-conduct.md / contributing.md / contributors.md / sponsor.md  # 参与贡献
│   ├── package.json              # xihan-docs：依赖与构建脚本
│   ├── pnpm-workspace.yaml       # pnpm workspace 声明（当前统一构建审批 allowBuilds: esbuild）
│   └── pnpm-lock.yaml
├── assets/                     # README 用图（LOGO、favicon）
├── other/                      # 设计源文件（logo / favicon / ppt / adobe 工程文件）
├── .github/
│   ├── workflows/deploy-docs.yml # 构建 + 部署到 GitHub Pages 的工作流
│   ├── ISSUE_TEMPLATE/           # Issue 模板
│   └── FUNDING.yml
├── CNAME                        # GitHub Pages 自定义域名：docs.xihanfun.com
├── LICENSE
└── README.md
```

## 本地开发

进入 `docs` 目录（VitePress 的工作目录）执行以下命令：

```bash
cd docs

# 安装依赖（等价于 pnpm run bootstrap）
pnpm install

# 启动本地开发服务器（热更新）
pnpm run dev

# 构建静态站点，产物输出到 docs/.vitepress/dist
pnpm run build

# 本地预览已构建的产物（serve 与 preview 等价，均为 vitepress 内置命令）
pnpm run preview
```

其余脚本（定义于 [`docs/package.json`](./docs/package.json)）：

| 脚本                 | 说明                                  |
| -------------------- | ------------------------------------- |
| `pnpm run clean`     | 删除 `dist` 构建产物                  |
| `pnpm run clean:modules` | 删除 `node_modules`               |
| `pnpm run reinstall` | 清空 `node_modules` 后重新安装依赖    |
| `pnpm run rebuild`   | 先 `clean` 再 `build`                 |
| `pnpm run upgrade`   | `pnpm upgrade` 升级依赖               |

## 如何新增 / 维护一页

> 产品正文页不在本仓库。写开发框架 / 视图组件 / 基础应用的文档，去对应仓库的 `docs/` 目录改，那里各有一份同构的 VitePress 站点。

1. **新建内容页**：在 `docs/cosmos/` 下新增 `.md` 文件。本仓库只收生态层面的页面（导览、跨仓上手、贡献约定）。
2. **登记导航/侧栏**：在 `docs/.vitepress/config.ts` 的 `startSidebar` / `contributeSidebar` 里补充一条 `{ text, link }`；`sidebar` 对象按路径逐页登记，新增页面时需一并登记，否则该页会落到默认主题的窄列布局。
3. **静态资源**：图片放到 `docs/public/images/`，页面中以站点根相对路径 `/images/xxx.png` 引用。
4. **版本徽章**：导航里三大板块外链标题右上角的版本徽章由 `docs/.vitepress/versions.ts` 的 `releases` 常量统一推导，真源分别是 `XiHan.Framework/framework/props/version.props`、`XiHan.UI/ui/packages/` 下各库包的 `package.json`、`XiHan.BasicApp/backend/props/version.props`，发版后需手动同步这三个值。三个产品站不用这套机制：它们导航末项直接显示自己 `docs/package.json` 的 `version`，发版时只改那一处。
5. **跨站链接**：指向另外三个站的链接一律写完整地址（`https://framework.docs.xihanfun.com/...`），站内链接才用相对/根相对路径。
6. **本地校验**：新增/修改页面后执行 `pnpm run dev` 预览，或 `pnpm run build` 确认无渲染异常——未配置 `ignoreDeadLinks`，站内死链会直接让构建失败。
7. **在线编辑入口**：`config.ts` 中 `themeConfig.editLink` 已配置「在 GitHub 上编辑此页」，指向 `https://github.com/XiHanFun/XiHan.Docs/tree/main/docs/:path`。

## 部署

- **自定义域名**：仓库根目录 [`CNAME`](./CNAME) 配置为 `docs.xihanfun.com`，用于 GitHub Pages 绑定自定义域名。
- **CI/CD**：[`.github/workflows/deploy-docs.yml`](./.github/workflows/deploy-docs.yml) 在 `push` / `pull_request` 到 `main` 分支时触发，流程为：
  1. 拉取代码（`actions/checkout@v5`，`fetch-depth: 0`）
  2. 安装 Node.js 24（`actions/setup-node@v5`）与 `pnpm@11`
  3. 在 `docs/` 目录下执行 `pnpm install` 与 `pnpm run build`
  4. 通过 `JamesIves/github-pages-deploy-action@v4` 将 `docs/.vitepress/dist` 发布到 `gh-pages` 分支
- GitHub Pages 从 `gh-pages` 分支提供站点内容，结合 `CNAME` 对外暴露为 `https://docs.xihanfun.com`。

## 相关项目

- [XiHan.Framework](https://github.com/XiHanFun/XiHan.Framework) - .NET 模块化开发框架（文档：<https://framework.docs.xihanfun.com>）
- [XiHan.UI](https://github.com/XiHanFun/XiHan.UI) - 框架无关的设计系统运行时与组件库（文档：<https://ui.docs.xihanfun.com>）
- [XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp) - 基于 XiHan.Framework 构建的企业级中后台内核（文档：<https://basicapp.docs.xihanfun.com>）

## 贡献

欢迎提交 Issue 和 Pull Request，详见 [参与贡献指南](./docs/cosmos/contributing.md)。

## 支持&赞助

如果此项目对你的开发有助益，也欢迎请作者一杯咖啡。

官方赞助页 https://docs.xihanfun.com/cosmos/sponsor

## 版权&授权

Copyright (c) 2021-Present XiHanFun and contributors.

本项目采用 MIT 授权，详见 [License](./LICENSE)

XiHan.Docs Logo、XiHan.Docs 名称归作者所有，第三方依赖和第三方服务分别遵循其各自授权与服务条款。

项目仅供学习参考，作者不承担任何软件的使用风险。
