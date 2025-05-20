# XiHan.Framework 开发框架

XiHan.Framework 是一个快速、轻量、高效的后端开发框架，基于 .NET 构建。本框架旨在提供一套完整的解决方案，帮助开发者快速构建高性能、可扩展的应用程序。

## 主要特性

- **高性能**: 基于 .NET 优化的高性能架构，确保应用程序高效运行
- **模块化**: 采用模块化设计，各组件松耦合，便于扩展和维护
- **易用性**: 简洁的 API 设计和丰富的约定，降低学习成本
- **跨平台**: 支持 Windows、Linux、macOS 等多种操作系统平台
- **安全性**: 内置完善的身份认证与授权体系，保障应用安全
- **可扩展**: 灵活的插件体系，满足各种定制化需求
- **DDD 支持**: 原生支持领域驱动设计，便于构建复杂业务系统

## 快速开始

```csharp
// 在 Program.cs 中添加 XiHan 框架服务
builder.Services.AddXiHanFramework(options =>
{
    options.ApplicationName = "MyApplication";
    options.EnableSwagger = true;
});

// 自动注册所有服务
builder.Services.AddXiHanServices();

// 添加数据访问
builder.Services.AddXiHanDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
});

// 使用中间件
app.UseXiHanFramework();
```

## 框架文档

- [框架概述](./overview) - 了解框架设计理念和架构
- [快速入门](./quickstart) - 快速搭建一个基于 XiHan 的应用
- [核心模块](./core) - 框架的基础设施和常用功能
- [数据访问](./data-access) - 数据库访问和领域模型映射
- [Web API](./web-api) - Web API 开发和最佳实践
- [身份认证](./identity) - 用户认证授权和安全设计
- [缓存](./cache) - 缓存策略和实现方案

## 社区资源

- [GitHub 仓库](https://github.com/XiHanFun/XiHan.Framework)
- [示例项目](https://github.com/XiHanFun/XiHan.BasicApp)
- [问题反馈](https://github.com/XiHanFun/XiHan.Framework/issues)
