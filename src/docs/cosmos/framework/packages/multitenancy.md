# XiHan.Framework.MultiTenancy

> 多租户实现：当前租户上下文、租户解析链、租户存储与设置隔离

- **NuGet**：`XiHan.Framework.MultiTenancy`
- **模块类**：`XiHanMultiTenancyModule`
- **所在层**：应用层

## 这是什么

这个包是多租户能力的**实现层**，为 [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions) 定义的接口提供落地实现。它用 `AsyncLocal` 维护当前请求的租户上下文，提供可扩展的租户解析链（从当前登录用户、请求头、查询串等处解析租户），并把"租户级设置"接入设置体系。你只需引用它并在业务中注入 `ICurrentTenant`，租户上下文的存取与恢复都由它在幕后完成。

## 何时使用

- 你的系统需要区分多个租户，并按租户隔离数据与配置
- 你需要在请求管线里自动识别当前租户（登录用户、`X-Tenant-Id` 头、`tenantId` 查询串）
- 你需要租户级设置（同一设置项对不同租户取不同值）
- 你需要从存储中按 Id 或名称查询租户配置（连接串、是否激活等）

## 安装

```bash
dotnet add package XiHan.Framework.MultiTenancy
```

## 启用

```csharp
[DependsOn(typeof(XiHanMultiTenancyModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里调用 `AddXiHanMultiTenancy(config)`，注册当前租户访问器、默认租户存储、租户功能检查器，并把 `TenantSettingValueProvider` 插入设置值提供者链、把 `CurrentUserTenantResolveContributor` 插入租户解析链首位。

## 核心能力

- **当前租户上下文**：`CurrentTenant` 实现 `ICurrentTenant`；底层由 `AsyncLocalCurrentTenantAccessor` 用 `AsyncLocal` 跨异步流转维护，`Change(...)` 支持临时切换并在释放时恢复
- **租户解析链**：`ITenantResolveContributor` 组成有序链（`XiHanTenantResolveOptions.TenantResolvers`），内置 `CurrentUserTenantResolveContributor`（从登录用户的 `TenantId` 解析）；支持按 Header/QueryString 解析（可配置键名，见下）
- **租户存储**：`ITenantStore` 按 Id 或名称查询 `TenantConfiguration`（含连接串、`IsActive`、`EditionId`），默认实现 `DefaultTenantStore`
- **租户级设置隔离**：`TenantSettingValueProvider`（提供者名 `"T"`）从设置存储按当前租户键取值，被插入到全局提供者之后
- **租户功能检查**：`ITenantFeatureChecker` 判断某功能对当前租户是否启用

> 应用层约定：BasicApp 用 `TenantId = 0` 表示全局/宿主数据。这是**应用侧约定**，非框架强制——框架抽象中 `TenantId` 为 `long?`，`null` 表示宿主/公共数据。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `CurrentTenant` | `ICurrentTenant` 实现，注入即用 |
| `AsyncLocalCurrentTenantAccessor` | 基于 `AsyncLocal` 的当前租户访问器（单例 `Instance`） |
| `TenantResolveContributorBase` | 自定义租户解析贡献者的基类 |
| `CurrentUserTenantResolveContributor` | 从当前登录用户解析租户的内置贡献者 |
| `XiHanTenantResolveOptions` | 解析选项（配置节 `XiHan:MultiTenancy:Resolve`），含 `HeaderKeys`/`QueryStringKeys`/`FallbackTenant` 等 |
| `TenantConfiguration` | 租户配置模型（Id、Name、连接串、IsActive、EditionId） |
| `ITenantStore` / `DefaultTenantStore` | 租户存储契约与默认实现 |
| `TenantSettingValueProvider` | 租户级设置值提供者（名称 `"T"`） |
| `ITenantFeatureChecker` / `TenantFeatureChecker` | 租户功能开关检查 |

## 快速示例

编写自定义租户解析贡献者，并加入解析链：

```csharp
public class HeaderTenantResolveContributor : TenantResolveContributorBase
{
    public override string Name => "MyHeader";

    public override Task ResolveAsync(ITenantResolveContext context)
    {
        // 从上下文解析出租户标识或名称，写回并标记已处理
        context.TenantIdOrName = "...";
        context.Handled = true;
        return Task.CompletedTask;
    }
}

// 在模块配置里插入解析链
context.Services.Configure<XiHanTenantResolveOptions>(options =>
{
    options.TenantResolvers.Add(new HeaderTenantResolveContributor());
});
```

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions)（接口与模型来源）
- [XiHan.Framework.Settings](./settings)（把租户级设置提供者接入设置链）
- [XiHan.Framework.Security](./security)（当前用户，用于按用户解析租户）

## 相关模块

- [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions)
- [XiHan.Framework.Settings](./settings)
- [XiHan.Framework.Data](./data)（按租户过滤/路由数据）
