# XiHan.Framework.Domain

> DDD 领域层：聚合根、实体基类、领域服务、领域事件、规约、仓储抽象与业务规则

- **NuGet**：`XiHan.Framework.Domain`
- **模块类**：`XiHanDomainModule`
- **所在层**：领域与应用层

## 这是什么

这个包提供领域驱动设计（DDD）的一整套战术构件：实体、聚合根、值对象、领域服务、领域事件、规约和仓储接口。它只定义**抽象与基类**，不涉及具体数据库实现——仓储的落地由基础设施层（如 Data 包）完成。你在建模业务领域时继承这里的基类，就能获得主键、审计、多租户、并发版本、领域事件等通用能力。

## 何时使用

- 用 DDD 方式建模业务：需要聚合根、实体、值对象的标准基类
- 需要面向持久化无关的仓储抽象接口（`IRepositoryBase<TEntity, TKey>`）来解耦业务与数据库
- 想把复杂查询/业务约束封装为规约（Specification）或业务规则（BusinessRule）
- 需要在聚合内收集并发布领域事件

## 安装

```bash
dotnet add package XiHan.Framework.Domain
```

## 启用

```csharp
[DependsOn(typeof(XiHanDomainModule))]
public class MyModule : XiHanModule { }
```

## 核心能力

- 实体基类体系：`EntityBase` / `EntityBase<TKey>`（含并发版本 `RowVersion`、临时实体判断、基于主键的相等性），并派生出创建、修改、删除、全审计及其多租户变体
- 聚合根：`IAggregateRoot` / `AggregateRootBase` / `MultiTenantAggregateRootBase`，聚合了全审计与领域事件管理能力
- 仓储抽象：`IReadOnlyRepositoryBase` 提供查询，`IRepositoryBase` 增补增删改，另有 `ISoftDeleteRepositoryBase`、`IAuditedRepository`、`IAggregateRootRepository`
- 领域服务：`DomainService` 基类，内置业务规则检查、日志与性能监控辅助方法
- 领域事件：`IDomainEvent` / `DomainEventBase` 与 `IDomainEventsManager`，在聚合内收集待发布事件
- 规约模式：`ISpecification<T>` / `Specification<T>` / `AsyncSpecification<T>`，支持 `And` / `Or` / `Not` 组合并转换为表达式
- 业务规则：`IBusinessRule` 与 `BusinessRuleValidationException`，把业务约束显式化
- 值对象：`ValueObject`（按属性值判等）与 `SingleValueObject`
- 领域异常：`DomainException` / `BusinessRuleValidationException`

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `EntityBase<TKey>` | 泛型主键实体基类，含 `BasicId`、`RowVersion`、相等性与临时实体判断 |
| `AggregateRootBase<TKey>` | 聚合根基类，聚合全审计与领域事件管理 |
| `IRepositoryBase<TEntity, TKey>` | 读写仓储抽象（在只读仓储基础上增补增删改） |
| `IReadOnlyRepositoryBase<TEntity, TKey>` | 只读仓储抽象（按主键/条件查询、分页） |
| `DomainService` | 领域服务基类，提供业务规则检查与性能监控 |
| `IDomainEvent` / `DomainEventBase` | 领域事件契约与基类 |
| `ISpecification<T>` / `Specification<T>` | 规约模式，封装查询条件并可组合 |
| `IBusinessRule` | 业务规则接口，`IsBroken()` + `Message` |
| `ValueObject` | 值对象基类，按 `GetEqualityComponents()` 判等 |

## 依赖模块

仅依赖 [XiHan.Framework.Domain.Shared](./domain-shared)（复用其分页查询契约，如 `PageRequestDtoBase`），保持领域层与具体基础设施解耦。

## 相关模块

- [XiHan.Framework.Domain.Shared](./domain-shared) — 领域共享的分页/查询模型
- [XiHan.Framework.Application](./application) — 应用层，编排领域对象并暴露为 API
- [XiHan.Framework.Data](./data) — 基础设施层，提供仓储抽象的具体实现
