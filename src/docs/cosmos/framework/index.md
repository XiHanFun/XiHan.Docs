# XiHan.Framework 开发框架 <Badge type="tip" text="v3.1.0" />

快速、轻量、高效、用心的 **.NET 10 模块化开发框架**。面向前后端分离的企业级 ASP.NET Core 应用，优先使用 .NET 原生能力、减少第三方依赖，强调模块清晰、依赖可控、扩展可维护。

## 一分钟了解它

XiHan.Framework 把一套后端能力拆成许多**可独立安装的小模块**（NuGet 包），你按需引用。模块之间用一个 `[DependsOn]` 特性声明依赖，框架启动时**自动拓扑排序、依次加载**，你不用手写一长串 `AddXxx`。

```csharp
// 一个"模块"就是一个类，声明它依赖哪些模块
[DependsOn(
    typeof(XiHanWebApiModule),   // 动态 API + 完整中间件管道
    typeof(XiHanDataModule)      // SqlSugar 数据访问
)]
public class MyAppModule : XiHanModule
{
    public override Task ConfigureServicesAsync(ServiceConfigurationContext context)
    {
        // 在这里注册你自己的服务
        return Task.CompletedTask;
    }
}
```

```csharp
// Program.cs —— 三行启动
var builder = WebApplication.CreateBuilder(args);
await builder.AddApplicationAsync<MyAppModule>();   // 加载模块树
var app = builder.Build();
await app.InitializeApplicationAsync();             // 触发初始化钩子
await app.RunAsync();
```

就这么多。你引用的每个模块都会把自己的服务、中间件、后台任务挂到正确的位置。

## 从这里开始

<div class="tip custom-block" style="padding-top: 8px">

第一次接触？按顺序读这三篇，20 分钟就能跑起一个接口：

1. [**快速上手**](./quickstart) —— 5 分钟建一个能返回数据的 Web API
2. [**核心概念**](./concepts/modularity) —— 搞懂"模块 / 生命周期 / DI / 动态 API"这四件事
3. [**模块总览**](./packages/) —— 按需查阅你要用的每个包

</div>

## 文档地图

| 板块 | 内容 |
| --- | --- |
| [框架概述](./overview) | 设计理念、分层架构、技术栈、版本与兼容性 |
| [快速上手](./quickstart) | 环境准备、安装、第一个 Web API、常见配置 |
| [核心概念](./concepts/modularity) | 模块系统、生命周期、依赖注入、动态 API |
| [模块总览](./packages/) | 全部 57 个包的分层索引，每个包一份文档 |
| [更新日志](./changelog) | 各版本变更记录（新增 / 修复 / 优化 / 调整 / 升级 / 移除） |

## 分层架构一览

框架按严格的分层组织，下层不依赖上层，全部依赖抽象接口：

```text
┌───────────────────────────────────────────────────────────┐
│  7. Web 层    Web.Api / Web.Docs / Web.Gateway / Web.Grpc  │
│               Web.RealTime / Web.Core                       │
├───────────────────────────────────────────────────────────┤
│  6. 基础设施  Data 认证 授权 缓存 事件总线 AI Bot 任务       │
│               日志 存储 搜索 脚本 可观测性 …                 │
├───────────────────────────────────────────────────────────┤
│  5. 应用层    Application → Application.Contracts            │
│               MultiTenancy / Validation / Settings          │
├───────────────────────────────────────────────────────────┤
│  4. 领域层    Domain → Domain.Shared                        │
├───────────────────────────────────────────────────────────┤
│  3. 核心层    Core（模块系统 / DI / 生命周期 / 异常处理）    │
├───────────────────────────────────────────────────────────┤
│  2. 元数据层  Metadata（框架信息 / 版本 / 平台）             │
├───────────────────────────────────────────────────────────┤
│  1. 公共层    Utils（零依赖通用工具库）                      │
└───────────────────────────────────────────────────────────┘
```

想看每一层里都有什么，去 [模块总览](./packages/)。

## 技术栈

| 类别 | 技术 | 版本 |
| --- | --- | --- |
| 运行时 | .NET | 10.0 |
| ORM | SqlSugar | 5.1.4 |
| 日志 | Serilog | 10.0.0 |
| 缓存 | HybridCache + StackExchange.Redis | 10.5.0 |
| AOP | Castle DynamicProxy | 5.2.1 |
| 加密 | BouncyCastle | 2.6.2 |
| 序列化 | System.Text.Json + Newtonsoft.Json | 13.0.4 |
| 模板引擎 | Scriban | 7.1.0 |
| AI | Semantic Kernel + MCP | 1.74.0 / 1.2.0 |
| HTTP 韧性 | Polly | 10.0.6 |
| gRPC | Grpc.AspNetCore | 2.76.0 |
| API 文档 | Scalar + Swashbuckle | 2.14.1 / 10.1.7 |

## 社区资源

- [GitHub 仓库](https://github.com/XiHanFun/XiHan.Framework) · [Gitee 镜像](https://gitee.com/XiHanFun/XiHan.Framework)
- [NuGet 包列表](https://www.nuget.org/packages?q=XiHan.Framework)
- [XiHan.BasicApp](https://github.com/XiHanFun/XiHan.BasicApp) —— 基于本框架构建的企业级中后台，最完整的实战参考
- [问题反馈](https://github.com/XiHanFun/XiHan.Framework/issues) · QQ 群 462371834
