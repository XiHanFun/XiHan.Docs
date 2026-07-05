# XiHan.Framework.Uow

> 工作单元：AOP 拦截器自动管理事务边界

- **NuGet**：`XiHan.Framework.Uow`
- **模块类**：`XiHanUowModule`
- **所在层**：基础设施层

## 这是什么

这个包实现工作单元（Unit of Work）模式，负责统一管理一次业务操作的事务边界与提交/回滚。它靠 AOP 拦截器工作：给方法或类打上 `[UnitOfWork]` 特性，进入方法时自动开启工作单元，正常返回时统一提交、抛异常时回滚，通常无需在业务代码里手动开启或提交事务。

## 何时使用

- 希望一个业务方法内的多次数据库写操作作为一个原子事务提交
- 不想在每个 Service 方法里手写 `BeginTransaction / Commit / Rollback`
- 需要嵌套工作单元：内层方法自动挂到外层已存在的工作单元上，避免嵌套事务

## 安装

```bash
dotnet add package XiHan.Framework.Uow
```

## 启用

```csharp
[DependsOn(typeof(XiHanUowModule))]
public class MyModule : XiHanModule { }
```

模块在 `PreConfigureServices` 阶段通过 `UnitOfWorkInterceptorRegistrar.RegisterIfNeeded` 为需要的服务注册工作单元拦截器。

## 核心能力

- **AOP 自动事务边界**：`UnitOfWorkInterceptor` 检测 `[UnitOfWork]` 方法，自动开启/提交/回滚
- **嵌套复用**：若调用前已存在工作单元，特性不再新开，直接复用当前工作单元
- **可控事务语义**：`[UnitOfWork]` 可配置 `IsTransactional` 与 `IsolationLevel`
- **工作单元管理器**：`IUnitOfWorkManager` 提供 `Current`、`Begin`、`Reserve` 等能力，支持预留式工作单元（配合中间件）
- **生命周期事件**：工作单元完成/失败事件（`Completed` / `Failed` / `Disposed`），并支持提交后事件发布
- **数据库/事务 API 容器抽象**：`IDatabaseApiContainer` / `ITransactionApiContainer`，由数据层（如 Data 包的 SqlSugar 实现）接入具体连接与事务

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IUnitOfWork` | 工作单元接口，聚合数据库 API 与事务 API 容器 |
| `IUnitOfWorkManager` | 工作单元管理器，暴露当前工作单元与开启/预留操作 |
| `UnitOfWorkAttribute` | `[UnitOfWork]` 特性，标记方法/类为一个原子工作单元 |
| `UnitOfWorkInterceptor` | AOP 拦截器，实现自动事务边界 |
| `XiHanUnitOfWorkOptions` | 工作单元选项（事务开关、隔离级别等） |
| `ITransactionApi` / `IDatabaseApi` | 事务与数据库 API 抽象，供数据层接入 |

## 快速示例

给方法打上特性，方法内的多次写操作即成为一个事务：

```csharp
public class OrderService
{
    private readonly IRepositoryBase<Order, long> _orderRepo;
    private readonly IRepositoryBase<OrderItem, long> _itemRepo;

    public OrderService(
        IRepositoryBase<Order, long> orderRepo,
        IRepositoryBase<OrderItem, long> itemRepo)
    {
        _orderRepo = orderRepo;
        _itemRepo = itemRepo;
    }

    // 整个方法作为一个事务：任一步失败则整体回滚
    [UnitOfWork(isTransactional: true)]
    public async Task PlaceOrderAsync(Order order, OrderItem item)
    {
        await _orderRepo.AddAsync(order);
        await _itemRepo.AddAsync(item);
        // 方法正常返回时统一提交，无需手动 Commit
    }
}
```

## 依赖模块

- 仅依赖 [XiHan.Framework.Core](./core)（模块化与动态代理基础设施），无第三方运行时依赖。

## 相关模块

- [XiHan.Framework.Data](./data)（提供 SqlSugar 事务 API 接入）
- [XiHan.Framework.Caching](./caching)（缓存感知工作单元）
- [XiHan.Framework.Core](./core)
