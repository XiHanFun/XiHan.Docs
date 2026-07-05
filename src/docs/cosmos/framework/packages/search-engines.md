# XiHan.Framework.SearchEngines

> 搜索引擎：Elasticsearch 集成抽象、索引构建、全文检索。

- **NuGet**：`XiHan.Framework.SearchEngines`
- **模块类**：`XiHanSearchEnginesModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.SearchEngines 规划为框架统一接入搜索引擎（Elasticsearch）的基础设施包，用于承载索引构建与全文检索能力。

需要提前说明：**当前该包只是占位/骨架模块**。除模块类 `XiHanSearchEnginesModule` 外没有任何公开 API，其 `ConfigureServices` 尚未注册任何服务，也还没有索引构建、检索或客户端封装相关的具体类型。csproj 已引入 Elasticsearch 官方客户端 `Elastic.Clients.Elasticsearch`，但目前包内并未对其做封装，仅作为后续开发的依赖预埋。

## 何时使用

- 关注框架的搜索引擎接入方向、了解后续会围绕 Elasticsearch 展开。
- 需要在自己的模块里预留对该模块的 `DependsOn`，等待其能力补齐。

（当前阶段该包尚不提供可直接调用的检索能力，实际全文检索请暂用 Elasticsearch 客户端直接实现。）

## 安装

```bash
dotnet add package XiHan.Framework.SearchEngines
```

## 启用

```csharp
[DependsOn(typeof(XiHanSearchEnginesModule))]
public class MyModule : XiHanModule { }
```

> 注意：目前 `XiHanSearchEnginesModule.ConfigureServices` 为空实现，`[DependsOn]` 之后暂不会向容器注入任何搜索相关服务。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanSearchEnginesModule` | 模块入口，参与模块化生命周期；当前为空骨架 |

## 依赖模块

- [XiHan.Framework.Core](./core) — 模块化与依赖注入基础，唯一的框架内部依赖。
- 第三方：`Elastic.Clients.Elasticsearch`（Elasticsearch 官方 .NET 客户端），已在 csproj 中引用，作为后续检索能力的依赖预埋。

## 相关模块

- [XiHan.Framework.Data](./data) — 数据访问基础设施，与搜索/索引通常配合使用。
- [XiHan.Framework.Caching](./caching) — 同为基础设施层的数据侧能力。
