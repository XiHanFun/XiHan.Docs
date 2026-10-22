# 如何为项目贡献代码

本指南是曦寒懿组织下各仓库共用的默认贡献约定。各仓库的构建、测试命令与目录结构写在它自己的 README 里，两者不一致时以仓库内的说明为准。

代码在 [GitHub](https://github.com/XiHanFun)（主库）、[Gitee](https://gitee.com/XiHanFun) 与 [GitCode](https://gitcode.com/XiHanFun)（同步备库）三处托管，Issue 与 Pull Request 在哪一处提都收得到。

## 一、准备工作

- 安装 Git，安装时勾选将 Git 所在目录添加到系统环境变量；
- .NET 项目：安装仓库要求的 .NET SDK，Visual Studio、Rider、VS Code 等编辑器均可；
- 前端项目：安装 Node.js 与 pnpm，版本要求见仓库 README；
- 按仓库自带的格式化配置（如 EditorConfig、ESLint）整理代码，不另外引入个人格式化规则。

新增源码文件请添加如下文件头：

```csharp
// Copyright (c) 2021-Present XiHanFun and contributors.
// Licensed under the MIT License. See LICENSE in the project root for license information.
```

```ts
/*
 * Copyright (c) 2021-Present XiHanFun and contributors.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */
```

## 二、贡献代码

### 1. 新建自己的分支（Fork）

将本项目仓库 fork 到自己的 git 仓库中。

### 2. 克隆（Clone）

将已经 fork 的仓库 clone 到自己的本地 PC。

### 3. 创建本地分支

开发在 dev 分支上进行。请从 dev 分支切出自己的分支，在上面完成修改。

### 4. 开发

1. 发现了一个小 Bug 并进行修改。
2. 在打开的 Issues 中选择功能并进行开发。

提交前在本地跑通该仓库的构建与测试，命令见仓库 README 或 `.github/workflows/` 里的 CI 工作流。

### 5. 提交（Commit）

向本地仓库提交代码。

这里是 Git 提交信息前缀规则：

| 前缀     | 描述                                       | 示例                              |
| -------- | ------------------------------------------ | --------------------------------- |
| feat     | 新功能                                     | `feat: 新增用户登录页`            |
| fix      | 修复 Bug                                   | `fix: 修正用户认证失败时的提示`   |
| refactor | 代码重构（既不是新增功能，也不是修复 Bug） | `refactor: 简化用户校验逻辑`      |
| perf     | 性能优化                                   | `perf: 减少列表渲染时的重复计算`  |
| docs     | 文档 / 注释                                | `docs: 补充安装说明`              |
| style    | 不影响运行结果的代码格式调整               | `style: 按 EditorConfig 统一缩进` |
| test     | 测试相关                                   | `test: 补充登录流程的单元测试`    |
| build    | 构建系统或外部依赖的更改                   | `build: 升级依赖包`               |
| ci       | 持续集成配置与脚本的更改                   | `ci: 调整 GitHub Actions 工作流`  |
| chore    | 其他不改源码与测试的杂项                   | `chore: 更新 .gitignore`          |
| revert   | 撤销之前的提交                             | `revert: 撤销 12345abc`           |

这种方式便于清晰区分每种提交的目的和用途。

### 6. 保持本地仓库最新

在准备发起 Pull Request 之前，需要同步原仓库 dev 分支最新的代码。

### 7. 推送到远程仓库（Push）

push 到开发者自己的远程仓库中。

### 8. 发起并完成合并请求（Pull Request）

在 git 仓库中选择自己修改了的分支，向原仓库的 dev 分支发起 Pull Request，写清改了什么、为什么改；仓库带有 PR 模板时按模板填写。

## 三、提交代码的一些约定

发起请求成功后，本项目维护人就可以看到你提交的代码。Pull Request 如果被同意，你的代码就会被合并到仓库中。这样一次 Pull Request 就成功了。

参与过程中请遵守[贡献者公约](./code-of-conduct)。感谢你的贡献！
