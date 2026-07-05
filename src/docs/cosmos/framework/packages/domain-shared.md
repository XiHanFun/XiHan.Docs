# XiHan.Framework.Domain.Shared

> 领域共享模型：跨领域层与应用层共用的分页查询契约、DTO 基类与查询枚举

- **NuGet**：`XiHan.Framework.Domain.Shared`
- **模块类**：`XiHanDomainSharedModule`
- **所在层**：领域与应用层

## 这是什么

这个包放的是「领域层」与「应用层」都要用到的共享定义，核心是一套**分页查询契约**：请求里怎么描述过滤、排序、关键字搜索，响应里怎么组织分页结果。因为它同时被 Domain、Application.Contracts、Application 引用，所以放在这个不依赖具体持久化的共享包里，避免各层重复定义、互相耦合。

## 何时使用

- 需要一个统一的分页请求/响应模型，前后端约定一致的查询协议
- 想用「条件 + 排序 + 关键字」这种声明式方式描述查询，而不是手写一堆参数
- 定义应用服务的分页接口时，需要 `PageRequestDtoBase` / `PageResultDtoBase` 作为基类

## 安装

```bash
dotnet add package XiHan.Framework.Domain.Shared
```

## 启用

```csharp
[DependsOn(typeof(XiHanDomainSharedModule))]
public class MyModule : XiHanModule { }
```

## 核心能力

- 声明式分页请求：`PageRequestDtoBase` 承载查询条件、查询行为与分页参数，并提供 `WithFilter` / `WithSort` / `WithKeyword` / `WithPage` 等链式方法
- 结构化查询条件：`QueryConditions` 聚合多字段过滤（`QueryFilter`）、多字段排序（`QuerySort`）与关键字搜索（`QueryKeyword`）
- 丰富的查询操作符：`QueryOperator` 覆盖等值/比较、`Contains`/`StartsWith`/`EndsWith`、`In`/`NotIn`、`Between`、`IsNull`/`IsNotNull`
- 分页结果封装：`PageResultDtoBase<T>` 组织数据项与分页元数据
- 基于特性的自动查询：`QueryFieldAttribute`、`KeywordSearchAttribute`、`QueryOperatorSupportAttribute` 配合 `AutoQueryBuilder`，从条件生成查询并做校验

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `PageRequestDtoBase` | 分页请求基类，含 `Conditions` / `Behavior` / `Page` 与链式辅助方法 |
| `PageResultDtoBase<T>` | 分页响应基类，含数据项与分页元数据 |
| `QueryConditions` | 查询条件容器：`Filters` / `Sorts` / `Keyword` |
| `QueryFilter` / `QuerySort` / `QueryKeyword` | 单条过滤 / 排序 / 关键字搜索定义 |
| `QueryOperator` | 查询操作符枚举（等值、比较、模糊、集合、区间、空值判断） |
| `SortDirection` / `KeywordMatchMode` | 排序方向 / 关键字匹配模式枚举 |

## 快速示例

```csharp
// 构造一个分页查询：按状态过滤 + 关键字搜索 + 排序 + 取第 1 页 10 条
var request = new PageRequestDtoBase()
    .WithFilter("Status", 1, QueryOperator.Equal)
    .WithKeyword("张三", "Name", "Remark")
    .WithSort("CreationTime", SortDirection.Descending)
    .WithPage(1, 10);
```

## 依赖模块

仅依赖 [XiHan.Framework.Core](./core) 与 [XiHan.Framework.Utils](./utils)，不引用任何持久化或 Web 相关包，保持共享层的轻量与稳定。

## 相关模块

- [XiHan.Framework.Domain](./domain) — 领域层，直接依赖本包
- [XiHan.Framework.Application.Contracts](./application-contracts) — 应用契约层，复用本包的分页 DTO
- [XiHan.Framework.Application](./application) — 应用层实现
