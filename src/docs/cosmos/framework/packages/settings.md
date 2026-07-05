# XiHan.Framework.Settings

> 设置管理：设置定义提供者模式、多来源取值链、按作用域（全局/租户/用户）读写

- **NuGet**：`XiHan.Framework.Settings`
- **模块类**：`XiHanSettingsModule`
- **所在层**：应用层

## 这是什么

这个包提供统一的**设置（Setting）管理**能力。设置项由代码集中"定义"（名称、默认值、分组、是否加密等），运行时按一条有序的**值提供者链**从多个来源取值（默认值、配置文件、全局存储、用户/租户级存储），并支持按作用域读写。它和 appsettings 的区别是：设置可在运行时按租户/用户维度动态变化，而非只读的静态配置。

## 何时使用

- 你需要一批可在运行时修改的配置项，而不是重启才生效的 appsettings
- 你需要同一设置项对不同用户/租户取不同值（分作用域）
- 你需要用"定义提供者"集中声明设置项的元数据（默认值、分组、是否加密）
- 你需要敏感设置加密存储、以及自定义取值来源

## 安装

```bash
dotnet add package XiHan.Framework.Settings
```

## 启用

```csharp
[DependsOn(typeof(XiHanSettingsModule))]
public class MyModule : XiHanModule { }
```

模块在 `PreConfigureServices` 里自动收集所有 `ISettingDefinitionProvider` 实现，在 `ConfigureServices` 里调用 `AddXiHanSettings(config)` 注册默认的值提供者链并绑定 AES 加密选项（配置节 `XiHanAesOptions.SectionName`）。

## 核心能力

- **设置定义提供者模式**：实现 `ISettingDefinitionProvider.Define(...)` 声明设置项，模块启动时自动发现并汇总
- **多来源值提供者链**：内置 `DefaultValueSettingValueProvider` → `ConfigurationSettingValueProvider` → `GlobalSettingValueProvider` → `UserSettingValueProvider`，按顺序取到第一个非空值即返回
- **作用域读写**：`SettingScope` 分 `Application`（全局，提供者名 `"G"`）/ `Tenant`（`"T"`）/ `User` / `Session`（`"U"`）；写入时按作用域解析提供者键（用户/租户 Id 来自 `ICurrentUser`）
- **加密与校验**：设置定义可标记 `IsEncrypted` 走 AES 加解密；可挂 `Validator` 校验写入值
- **变更事件**：`SettingManager.OnSettingChanged` 在写入后触发 `SettingChangedEventArgs`
- **可插拔存储**：`ISettingStore` 承载实际持久化（默认 `NullSettingStore`，由上层替换为数据库实现）

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ISettingManager` / `SettingManager` | 设置读写入口：`AddDefinition`、`GetOrNullAsync`、`SetValueAsync` |
| `ISettingDefinitionProvider` | 设置定义提供者，实现 `Define(ISettingDefinitionContext)` |
| `ISettingDefinitionContext` | 定义上下文：`Add` / `GetOrNull` / `GetAll` |
| `SettingDefinition` | 设置定义模型（Name、DefaultValue、Group、IsEncrypted、Validator 等） |
| `SettingScope` | 作用域枚举：`Application` / `Tenant` / `User` / `Session` |
| `ISettingValueProvider` / `SettingValueProvider` | 值提供者契约与基类（`Name` + `GetOrNullAsync` + `GetAllAsync`） |
| `ISettingStore` / `NullSettingStore` | 设置存储契约与空实现（上层替换持久化） |

## 快速示例

声明设置项，然后按作用域读写：

```csharp
// 1. 定义设置项
public class MySettingDefinitionProvider : ISettingDefinitionProvider
{
    public void Define(ISettingDefinitionContext context)
    {
        context.Add(new SettingDefinition(
            name: "App.PageSize",
            defaultValue: "20",
            group: "General"));
    }
}

// 2. 读写设置
public class MyService
{
    private readonly ISettingManager _settingManager;

    public MyService(ISettingManager settingManager) => _settingManager = settingManager;

    public async Task DemoAsync()
    {
        var pageSize = await _settingManager.GetOrNullAsync("App.PageSize");
        await _settingManager.SetValueAsync("App.PageSize", "50", SettingScope.User);
    }
}
```

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Security](./security)（`ICurrentUser`，用于解析用户/租户级设置的提供者键）

## 相关模块

- [XiHan.Framework.MultiTenancy](./multitenancy)（注入 `TenantSettingValueProvider` 实现租户级设置隔离）
- [XiHan.Framework.Security](./security)
