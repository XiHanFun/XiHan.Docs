![LOGO](./assets/LOGO.png)

[![GitHub Star](https://img.shields.io/github/stars/XiHanFun/XiHan.Docs?style=flat&logo=github)](https://github.com/XiHanFun/XiHan.Docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[曦寒懿官方交流群](https://qm.qq.com/q/qYp1Urv3z2) 462371834 | [在线访问](https://docs.xihanfun.com)

# XiHan.Docs

快速、轻量、高效、用心的框架和组件库，基于 DotNet 和 Vue 构建。

## 简介

XiHan.Docs 是曦寒（XiHanFun）官方文档站的源码仓库，基于 [VitePress](https://vitepress.dev/) 构建，统一收录三大产品的文档：

- **🧩 开发框架** —— [XiHan.Framework](https://github.com/XiHanFun/XiHan.Framework)：.NET 模块化开发框架
- **🎨 视图组件** —— [XiHan.UI](https://github.com/XiHanFun/XiHan.UI)：基于 Vue 3 的组件库
- **🏠 基础应用** —— [XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp)：企业级中后台内核

站点部署在 <https://docs.xihanfun.com>，构建产物通过 GitHub Actions 自动发布到 GitHub Pages。

## 技术栈

| 类别     | 技术                        | 版本           |
| -------- | --------------------------- | -------------- |
| 站点框架 | VitePress                   | ^1.6.4         |
| 视图库   | Vue                         | ^3.5.39        |
| 包管理   | pnpm（workspace）           | 建议 11+       |
| 运行时   | Node.js                     | 建议 24+（CI 使用 24） |

版本以 [`src/package.json`](./src/package.json) 与 CI 工作流 [`deploy-docs.yml`](./.github/workflows/deploy-docs.yml) 为准。

## 目录结构

```text
XiHan.Docs/
├── src/                        # VitePress 站点源码（package.json 所在目录，即站点根目录）
│   ├── .vitepress/
│   │   ├── config.ts             # 站点配置：nav 导航、sidebar 侧栏、本地搜索、社交链接、editLink 等
│   │   ├── versions.ts           # 三大板块「导航徽章」版本号与发布阶段的单一事实源
│   │   ├── theme/                 # 自定义主题：index.ts + overrides.css / rainbow.css / vars.css
│   │   └── dist/                   # 构建产物目录（pnpm run build 生成，不提交）
│   ├── docs/                     # 实际内容目录（config.ts 中 srcDir: "docs"）
│   │   ├── index.md               # 首页（Hero + Features + 在线预览卡片）
│   │   ├── public/                 # 静态资源：favicon.ico、images/、robots.txt
│   │   └── cosmos/                  # 全部正文页面
│   │       ├── framework/            # 开发框架板块：index/overview/quickstart/changelog
│   │       │   ├── concepts/           # 核心概念：模块化、生命周期、依赖注入、动态 API
│   │       │   └── packages/            # 模块总览 + 每个框架包一页
│   │       ├── ui/                    # 视图组件板块：overview/installation/npm-package-dependency 等
│   │       ├── basic-app/              # 基础应用板块：身份/权限/多租户/消息/审计/代码生成/AI/部署 等
│   │       ├── guide.md / getstart.md    # cosmos 根下独立页：项目简介 / 快速上手
│   │       └── code-of-conduct.md / contributing.md / contributors.md / sponsor.md  # 参与贡献
│   ├── package.json                # xihan-docs：依赖与构建脚本
│   ├── pnpm-workspace.yaml         # pnpm workspace 声明（当前统一构建审批 allowBuilds: esbuild）
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

进入 `src` 目录（VitePress 的工作目录）执行以下命令：

```bash
cd src

# 安装依赖（等价于 pnpm run bootstrap）
pnpm install

# 启动本地开发服务器（热更新）
pnpm run dev

# 构建静态站点，产物输出到 src/.vitepress/dist
pnpm run build

# 本地预览已构建的产物（serve 与 preview 等价，均为 vitepress 内置命令）
pnpm run preview
```

其余脚本（定义于 [`src/package.json`](./src/package.json)）：

| 脚本                 | 说明                                  |
| -------------------- | ------------------------------------- |
| `pnpm run clean`     | 删除 `dist` 构建产物                  |
| `pnpm run clean:modules` | 删除 `node_modules`               |
| `pnpm run reinstall` | 清空 `node_modules` 后重新安装依赖    |
| `pnpm run rebuild`   | 先 `clean` 再 `build`                 |
| `pnpm run upgrade`   | `pnpm upgrade` 升级依赖               |

## 如何新增 / 维护一页

1. **新建内容页**：在 `src/docs/cosmos/{framework,ui,basic-app}/` 对应目录下新增 `.md` 文件；框架的逐包文档放在 `src/docs/cosmos/framework/packages/` 下，文件名与包短名对应（如 `core.md`、`data.md`）。
2. **登记导航/侧栏**：在 `src/.vitepress/config.ts` 中对应板块的侧栏数组（`frameworkSidebar` / `uiNavConst` / `basicAppSidebar`，或 cosmos 根下独立页所用的 `startSidebar` / `contributeSidebar`）里补充一条 `{ text, link }`；框架逐包文档可直接用文件顶部的 `pkg(text, name)` 辅助函数生成条目。`sidebar` 对象按路径前缀映射到对应侧栏数组，新增路径前缀时需一并登记。
3. **静态资源**：图片放到 `src/docs/public/images/`，页面中以站点根相对路径 `/images/xxx.png` 引用。
4. **版本徽章**：三大板块导航标题右上角的版本徽章由 `src/.vitepress/versions.ts` 的 `releases` 常量统一推导，真源分别是 `XiHan.Framework/framework/props/version.props`、`XiHan.UI/ui/packages/xihan-ui/package.json`、`XiHan.BasicApp/backend/props/version.props`，发版后需手动同步这三个值，不要复用文档站自身 `package.json` 的版本号。
5. **本地校验**：新增/修改页面后执行 `pnpm run dev` 预览，或 `pnpm run build`（`ignoreDeadLinks: true`，死链不会中断构建，但仍建议自查）确认无渲染异常。
6. **在线编辑入口**：`config.ts` 中 `themeConfig.editLink` 已配置「在 GitHub 上编辑此页」，指向 `https://github.com/XiHanFun/XiHan.Docs/tree/main/src/:path`，页面内容路径需落在 `src/` 下才能生成正确的编辑链接。

## 部署

- **自定义域名**：仓库根目录 [`CNAME`](./CNAME) 配置为 `docs.xihanfun.com`，用于 GitHub Pages 绑定自定义域名。
- **CI/CD**：[`.github/workflows/deploy-docs.yml`](./.github/workflows/deploy-docs.yml) 在 `push` / `pull_request` 到 `main` 分支时触发，流程为：
  1. 拉取代码（`actions/checkout@v5`，`fetch-depth: 0`）
  2. 安装 Node.js 24（`actions/setup-node@v5`）与 `pnpm@11`
  3. 在 `src/` 目录下执行 `pnpm install` 与 `pnpm run build`
  4. 通过 `JamesIves/github-pages-deploy-action@v4` 将 `src/.vitepress/dist` 发布到 `gh-pages` 分支
- GitHub Pages 从 `gh-pages` 分支提供站点内容，结合 `CNAME` 对外暴露为 `https://docs.xihanfun.com`。

## 相关项目

- [XiHan.Framework](https://github.com/XiHanFun/XiHan.Framework) - .NET 模块化开发框架
- [XiHan.UI](https://github.com/XiHanFun/XiHan.UI) - 基于 Vue 3 的组件库
- [XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp) - 基于 XiHan.Framework 构建的企业级中后台内核

## 贡献

欢迎提交 Issue 和 Pull Request，详见 [参与贡献指南](./src/docs/cosmos/contributing.md)。

## 支持&赞助

如果此项目对你的开发有助益，也欢迎请作者一杯咖啡。

官方赞助页 https://docs.xihanfun.com/cosmos/sponsor

## 版权&授权

Copyright (c) 2021-Present XiHanFun and ZhaiFanhua

本项目采用 MIT 授权，详见 [License](./LICENSE)

XiHan.Docs Logo、XiHan.Docs 名称归作者所有，第三方依赖和第三方服务分别遵循其各自授权与服务条款。

项目仅供学习参考，作者不承担任何软件的使用风险。
