# XiHan.Framework.SearchEngines

> 搜索引擎接入（规划中）：预留围绕 Elasticsearch 的索引构建与全文检索能力。**当前为占位/骨架模块。**

- **NuGet**：`XiHan.Framework.SearchEngines`
- **模块类**：`XiHanSearchEnginesModule`
- **所在层**：基础设施层
- **关键依赖**：`Elastic.Clients.Elasticsearch`（v9，Elasticsearch 官方 .NET 客户端，仅作依赖预埋）；框架内部依赖 `XiHan.Framework.Core`

## 概述

XiHan.Framework.SearchEngines 规划为框架统一接入搜索引擎（Elasticsearch）的基础设施包，用于承载索引构建与全文检索能力。

需要提前说明：**当前该包只是占位/骨架**。除模块类 `XiHanSearchEnginesModule` 外没有任何公开 API，其 `ConfigureServices` 仅取了一下 `Services` 与 `Configuration`、**未注册任何服务**，也还没有索引构建、检索或客户端封装相关的具体类型。csproj 已引入 Elasticsearch 官方客户端 `Elastic.Clients.Elasticsearch`（版本 `9.4.2`），但包内并未对其做任何封装，仅作为后续开发的依赖预埋。

## 何时使用

- 关注框架的搜索引擎接入方向，了解后续会围绕 Elasticsearch 展开。
- 需要在自己的模块里预留对该模块的 `DependsOn`，等待其能力补齐。

当前阶段本包**尚不提供可直接调用的检索能力**。若现在就需要全文检索，请直接使用 `Elastic.Clients.Elasticsearch` 客户端自行实现。

## 安装与启用

```bash
dotnet add package XiHan.Framework.SearchEngines
```

```csharp
[DependsOn(typeof(XiHanSearchEnginesModule))]
public class MyModule : XiHanModule { }
```

> 注意：`XiHanSearchEnginesModule.ConfigureServices` 当前为空实现，`[DependsOn]` 之后不会向容器注入任何搜索相关服务。

## 主要 API / 类型

| 类型 | 说明 |
| --- | --- |
| `XiHanSearchEnginesModule` | 模块入口，参与模块化生命周期；当前为空骨架，`ConfigureServices` 无注册 |

## 依赖模块

- [XiHan.Framework.Core](./core) — 模块化与依赖注入基础，唯一的框架内部依赖。
- 第三方：`Elastic.Clients.Elasticsearch`（v9），已在 csproj 中引用，作为后续检索能力的依赖预埋。

## 相关模块

- [XiHan.Framework.Data](./data) — 数据访问基础设施，与搜索/索引通常配合使用。
- [XiHan.Framework.Caching](./caching) — 同为基础设施层的数据侧能力。
