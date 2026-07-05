# XiHan.Framework.Data

> SqlSugar 数据访问：仓储模式、工作单元集成、多租户数据隔离、启动自动建表

- **NuGet**：`XiHan.Framework.Data`
- **模块类**：`XiHanDataModule`
- **所在层**：基础设施层

## 这是什么

这个包是框架的数据访问基础设施，基于 SqlSugar ORM 实现。它统一注册 SqlSugar 客户端、提供开箱即用的仓储实现，并自动处理主键、审计字段与多租户数据隔离。你在业务里只需注入仓储接口读写实体，连接管理、租户过滤、软删除过滤、事务接入都由它在幕后完成。

## 何时使用

- 需要用仓储模式访问数据库，而不想手写 SqlSugar 客户端注册与连接管理
- 需要多租户数据隔离：按当前租户自动过滤、跨库/跨连接路由
- 需要软删除、审计字段（创建/修改时间、租户 Id）自动注入
- 需要应用启动时自动建库、建表或写入种子数据

## 安装

```bash
dotnet add package XiHan.Framework.Data
```

## 启用

```csharp
[DependsOn(typeof(XiHanDataModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里注册 SqlSugar 服务，并在应用初始化阶段执行 `IDbInitializer.InitializeAsync()` 完成数据库初始化。

## 核心能力

- **SqlSugar 客户端统一注册**：按当前租户解析连接、在事务型工作单元中自动接入事务（`ISqlSugarClientResolver`）
- **多套仓储实现**：只读、读写、软删除、审计、聚合根，均为开放泛型注册
- **多租户数据隔离**：全局 `QueryFilter` 自动过滤租户数据（支持 `TenantId=0` 全局模板），连接可按租户路由
- **审计与差异日志**：通过 SqlSugar `DataExecuting` AOP 自动注入主键/租户/审计字段；可选启用实体差异日志
- **数据库初始化**：可选启用建库、建表结构初始化与种子数据（`IDataSeeder`）
- **雪花 ID**：接入 `XiHan.Framework.DistributedIds` 作为 SqlSugar 全局主键生成器

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IRepositoryBase<TEntity,TKey>` | 读写仓储接口（契约在 Domain 层定义），本包提供 `SqlSugarRepositoryBase<,>` 实现 |
| `IReadOnlyRepositoryBase<TEntity,TKey>` | 只读仓储接口，实现为 `SqlSugarReadOnlyRepository<,>` |
| `ISoftDeleteRepositoryBase<TEntity,TKey>` | 软删除仓储 |
| `IAggregateRootRepository<TEntity,TKey>` | 聚合根仓储 |
| `IDbInitializer` | 数据库初始化器（建库/建表/种子） |
| `IDataSeeder` | 种子数据提供者，可用 `AddDataSeeder<T>()` 注册 |
| `XiHanSqlSugarCoreOptions` | 核心配置选项（配置节 `XiHan:Data:SqlSugarCore`） |

## 快速示例

仓储接口在 `XiHan.Framework.Domain.Repositories` 中定义，由本包提供 SqlSugar 实现，直接注入即可：

```csharp
public class ProductService
{
    private readonly IRepositoryBase<Product, long> _repository;

    public ProductService(IRepositoryBase<Product, long> repository)
    {
        _repository = repository;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        // 主键、租户、审计字段由 AOP 自动注入
        return await _repository.AddAsync(product);
    }

    public async Task<Product?> GetAsync(long id)
    {
        // 自动附加当前租户过滤与软删除过滤
        return await _repository.GetByIdAsync(id);
    }
}
```

配置节示例（`XiHan:Data:SqlSugarCore:ConnectionConfigs`），`DbType` 取 SqlSugar 枚举值（PostgreSQL / MySql / MariaDB 等）：

```json
{
  "XiHan": {
    "Data": {
      "SqlSugarCore": {
        "ConnectionConfigs": [
          {
            "ConfigId": "Default",
            "ConnectionString": "Host=...;Database=...;Username=...;Password=...",
            "DbType": "PostgreSQL"
          }
        ]
      }
    }
  }
}
```

## 依赖模块

- [XiHan.Framework.Domain](./domain)（仓储接口/实体抽象来源）
- [XiHan.Framework.Uow](./uow)（事务边界接管）
- [XiHan.Framework.MultiTenancy](./multitenancy)（租户上下文）
- [XiHan.Framework.Security](./security)
- [XiHan.Framework.DistributedIds](./distributed-ids)（雪花 ID）
- 第三方核心：**SqlSugarCore**（ORM，直接对接数据库）

## 相关模块

- [XiHan.Framework.Uow](./uow)
- [XiHan.Framework.Caching](./caching)
- [XiHan.Framework.Domain](./domain)
