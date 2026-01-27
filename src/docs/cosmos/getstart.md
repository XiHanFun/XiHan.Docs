# 快速上手

::: tip 提示
本指南将帮助您快速了解并开始使用 XiHan 开发框架和组件库。
:::

## 项目概述

**XiHan** 是一个完整的企业级开发解决方案，包含三个核心部分：

- **XiHan.Framework** - 基于 .NET 10 的企业级后端开发框架
- **XiHan.UI** - 基于 Vue 3 的前端组件库
- **XiHan.BasicApp** - 完整的企业级应用示例

## 技术栈

### 后端技术栈

- **.NET 10** - 最新的 .NET 平台，支持 AOT 编译
- **ASP.NET Core** - 高性能的 Web 框架
- **SqlSugar** - 灵活的 ORM 框架
- **Entity Framework Core** - 微软官方 ORM（可选）
- **Redis** - 分布式缓存
- **PostgreSQL** - 推荐的关系型数据库

### 前端技术栈

- **Vue 3.5** - 渐进式 JavaScript 框架
- **TypeScript 5.8** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **pnpm** - 高效的包管理器

## 环境准备

### 后端环境

1. **安装 .NET 10 SDK**
   - 访问 [.NET 官网](https://dotnet.microsoft.com/download) 下载并安装
   - 验证安装：在命令行中运行 `dotnet --version`

2. **安装数据库**
   - PostgreSQL 14+ 或 MySQL 8.0+
   - 或使用 Docker 快速启动数据库

3. **安装 Redis**（可选，用于缓存）
   - 本地安装或使用 Docker

### 前端环境

1. **安装 Node.js**
   - Node.js 24.0.2 或更高版本
   - 推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本

2. **安装 pnpm**
   ```bash
   npm install -g pnpm
   ```

## 开发工具推荐

- **IDE**: Visual Studio 2022 / Rider / VS Code
- **数据库工具**: DataGrip / Navicat / DBeaver
- **API 测试**: Postman / Apifox
- **Git 客户端**: GitHub Desktop / SourceTree

## 下一步

- [项目简介](./guide.md) - 了解项目的设计理念和架构
- [开发框架](./framework/index.md) - 探索后端框架的强大功能
- [UI 组件库](./ui/index.md) - 发现丰富的前端组件
- [基础应用](./basic-app/index.md) - 学习如何构建完整应用

::: warning 注意
确保您的开发环境满足上述要求，以获得最佳的开发体验。
:::
