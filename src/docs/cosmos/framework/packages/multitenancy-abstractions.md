# XiHan.Framework.MultiTenancy.Abstractions

> 多租户抽象：租户上下文接口、租户解析链契约

- **NuGet**：`XiHan.Framework.MultiTenancy.Abstractions`
- **模块类**：`XiHanMultiTenancyAbstractionsModule`
- **所在层**：应用层

## 这是什么

这个包是多租户能力的**抽象层**，只定义接口与基础模型，不含任何实现。它约定了"当前租户是谁""如何从请求中解析出租户""哪些实体归属租户"这些契约，让上层代码依赖接口而非具体实现。真正的实现由 [XiHan.Framework.MultiTenancy](./multitenancy) 提供，两者通过依赖倒置解耦。

## 何时使用

- 你的领域/应用代码想读取当前租户信息，但不想耦合具体实现
- 你要定义支持租户隔离的实体（实现 `IMultiTenant`）
- 你要编写自定义的租户解析逻辑（实现 `ITenantResolveContributor`）
- 你需要标记某段代码/实体忽略多租户过滤（`IgnoreMultiTenancyAttribute`）

## 安装

```bash
dotnet add package XiHan.Framework.MultiTenancy.Abstractions
```

## 启用

```csharp
[DependsOn(typeof(XiHanMultiTenancyAbstractionsModule))]
public class MyModule : XiHanModule { }
```

通常无需直接引用本包：引用实现包 [XiHan.Framework.MultiTenancy](./multitenancy) 时会自动带上这些抽象。

## 核心能力

- **当前租户契约**：`ICurrentTenant` 提供 `Id`（`long?`）、`Name`、`IsAvailable`，以及用 `using` 临时切换租户的 `Change(...)`
- **租户信息载体与访问器**：`BasicTenantInfo`、`ICurrentTenantAccessor` 承载与读写当前租户
- **多租户实体标记**：`IMultiTenant`（暴露 `long? TenantId`，`null` 表示宿主/公共数据）
- **租户解析链契约**：`ITenantResolveContributor` + `ITenantResolveContext`，用于把请求中的标识/名称解析成租户
- **忽略多租户**：`IgnoreMultiTenancyAttribute`
- **租户 URL 契约**：`IMultiTenantUrlProvider` 按租户生成/解析 URL

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ICurrentTenant` | 当前租户上下文，含 `Id`/`Name`/`IsAvailable` 与 `Change(long? id, string? name)` |
| `ICurrentTenantAccessor` | 当前租户信息的读写访问器，属性为 `BasicTenantInfo?` |
| `BasicTenantInfo` | 基础租户信息（`TenantId` + `Name`） |
| `IMultiTenant` | 多租户实体接口，暴露 `long? TenantId` |
| `ITenantResolveContributor` | 租户解析贡献者，实现 `ResolveAsync(ITenantResolveContext)` |
| `ITenantResolveContext` | 解析上下文，含 `TenantIdOrName`、`Handled` |
| `IMultiTenantUrlProvider` | 按租户生成 URL 的契约 |
| `IgnoreMultiTenancyAttribute` | 标记忽略多租户过滤 |

## 快速示例

在业务里读取当前租户，或临时切换租户上下文：

```csharp
public class ReportService
{
    private readonly ICurrentTenant _currentTenant;

    public ReportService(ICurrentTenant currentTenant)
    {
        _currentTenant = currentTenant;
    }

    public void Run(long tenantId)
    {
        // 临时切换到指定租户，using 结束后自动恢复
        using (_currentTenant.Change(tenantId, "Acme"))
        {
            var id = _currentTenant.Id; // 当前作用域内为 tenantId
        }
    }
}
```

## 依赖模块

- [XiHan.Framework.Core](./core)（模块化与 DI 抽象）
- 仅依赖 Core 与 BCL，不引入第三方依赖。

## 相关模块

- [XiHan.Framework.MultiTenancy](./multitenancy)（本抽象的实现包）
- [XiHan.Framework.Settings](./settings)（租户级设置来源）
