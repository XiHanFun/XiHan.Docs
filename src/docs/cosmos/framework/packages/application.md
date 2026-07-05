# XiHan.Framework.Application

> 应用层实现：应用服务基类、CRUD 基类、DTO 映射与动态 API 特性

- **NuGet**：`XiHan.Framework.Application`
- **模块类**：`XiHanApplicationModule`
- **所在层**：领域与应用层

## 这是什么

这个包是应用层的**实现落点**，也是框架「动态 API」的关键一环。你写一个继承 `ApplicationServiceBase` 的应用服务，框架就能自动把它的公共方法暴露成 REST 接口，无需手写 Controller。它还提供了开箱即用的 CRUD 基类，把「实体 ↔ DTO」的映射、分页查询、软删除识别都封装好了。

## 何时使用

- 编写应用服务并希望它自动变成 REST API（配合 `[DynamicApi]`）
- 快速实现一个标准 CRUD 服务，只关心业务、不想重复写增删改查样板
- 需要实体与 DTO 之间的自动映射（基于 Mapster）
- 需要按 DataAnnotations 校验入参、以及基于软删除接口自动走软删除路径

## 安装

```bash
dotnet add package XiHan.Framework.Application
```

## 启用

```csharp
[DependsOn(typeof(XiHanApplicationModule))]
public class MyModule : XiHanModule { }
```

## 核心能力

- 应用服务基类：`ApplicationServiceBase`（实现 `IApplicationService, ITransientDependency`），注入 `ICachedServiceProvider` 与懒加载 `Logger`
- CRUD 基类：`CrudApplicationServiceBase<TEntity, TEntityDto, TKey, TCreateDto, TUpdateDto, TPageRequestDto>` 内置 `GetByIdAsync` / `PageAsync` / `CreateAsync` / `UpdateAsync` / `DeleteAsync`
- DTO 映射：基于 Mapster（`Adapt`）在实体与 DTO 间转换，映射方法均为 `virtual`，子类可重写定制
- 软删除感知：删除时若实体实现 `ISoftDelete` 且注册了软删除仓储，自动走软删除路径
- 额外过滤扩展点：`BuildAdditionalFilterPredicate` 供子类叠加权限/租户等业务过滤
- 输入校验：`ValidateInputObject` 用 DataAnnotations 校验创建/更新/分页入参
- 动态 API 特性：`[DynamicApi]` 精细控制路由、名称、版本、分组、路由谓词与大小写等（类级/方法级/全局按优先级合并）
- 批量 CRUD：`BatchCrudApplicationServiceBase<...>` 提供批量操作实现

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ApplicationServiceBase` | 应用服务基类，实现 `IApplicationService, ITransientDependency` |
| `CrudApplicationServiceBase<...>` | 通用 CRUD 应用服务基类，封装映射与分页 |
| `BatchCrudApplicationServiceBase<...>` | 批量 CRUD 应用服务基类 |
| `DynamicApiAttribute`（`[DynamicApi]`） | 动态 API 配置特性，控制路由/名称/版本/分组等 |

## 快速示例

继承 `ApplicationServiceBase` 并标注 `[DynamicApi]`，公共方法即自动暴露为 REST API：

```csharp
using XiHan.Framework.Application.Attributes;
using XiHan.Framework.Application.Services;

[DynamicApi]
public class WeatherAppService : ApplicationServiceBase
{
    public Task<string> GetForecastAsync(string city)
        => Task.FromResult($"{city}: 晴");
}
```

标准 CRUD 服务则继承 `CrudApplicationServiceBase<...>`，注入仓储即可获得全套增删改查：

```csharp
[DynamicApi]
public class ProductAppService
    : CrudApplicationServiceBase<Product, ProductDto, long, ProductCreateDto, ProductUpdateDto, ProductPageRequestDto>
{
    public ProductAppService(IRepositoryBase<Product, long> repository) : base(repository) { }
}
```

> 动态 API 的工作原理与更多配置见 [动态 API](../concepts/dynamic-api)。

## 依赖模块

- [XiHan.Framework.Application.Contracts](./application-contracts) — 应用契约（接口与 DTO 基类）
- [XiHan.Framework.Domain](./domain) — 领域层（实体、仓储抽象）
- [XiHan.Framework.DistributedIds](./distributed-ids) — 分布式 ID 生成
- [XiHan.Framework.Logging](./logging) — 日志
- [XiHan.Framework.ObjectMapping](./objectmapping) — 对象映射（Mapster）

## 相关模块

- [XiHan.Framework.Application.Contracts](./application-contracts) — 本包实现的契约层
- [XiHan.Framework.Domain](./domain) — 被编排的领域对象
- [动态 API](../concepts/dynamic-api) — 应用服务如何自动变成 REST 接口
