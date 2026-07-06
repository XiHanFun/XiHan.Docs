# XiHan.Framework.Settings

> 设置管理：设置定义提供者模式、多来源取值链、按作用域（全局/租户/用户/会话）读写、加密与变更事件

- **NuGet**：`XiHan.Framework.Settings`
- **模块类**：`XiHanSettingsModule`
- **所在层**：应用层
- **关键依赖**：仅 .NET 原生 + 框架内部依赖（Core / Security；加密用 `Utils` 的 `AesHelper`）

## 概述

本包提供统一的**设置（Setting）管理**能力。设置项由代码集中「定义」（名称、默认值、分组、是否加密、校验器等），运行时按一条**值提供者链**从多个来源取值（默认值 → 配置文件 → 全局存储 → 用户存储；引入多租户后再插入租户存储），并支持按作用域读写、加密敏感值、监听变更事件。它与 appsettings 的区别是：设置可在运行时按用户/租户维度动态变化并写回持久化存储，而 appsettings 通常是只读的静态配置。

设计上分三层：**定义**（`ISettingDefinitionProvider` / `SettingDefinition`）声明有哪些设置项；**取值**（`ISettingValueProvider` 链）决定从哪取值、按什么优先级；**存储**（`ISettingStore`）承载实际持久化。本包只提供空存储 `NullSettingStore`，真正的数据库持久化由上层替换。

## 何时使用

- 你需要一批可在运行时修改的配置项，而非重启才生效的 appsettings
- 你需要同一设置项对不同用户/租户取不同值（分作用域）
- 你需要用「定义提供者」集中声明设置项元数据（默认值、分组、是否加密、校验）
- 你需要敏感设置加密存储，以及可插拔的取值来源与持久化

## 安装与启用

```bash
dotnet add package XiHan.Framework.Settings
```

```csharp
[DependsOn(typeof(XiHanSettingsModule))]
public class MyModule : XiHanModule { }
```

模块 `[DependsOn(typeof(XiHanSecurityModule))]`，并：

- 在 `PreConfigureServices` 里通过 `services.OnRegistered(...)` **自动发现**所有 `ISettingDefinitionProvider` 实现，登记进 `XiHanSettingOptions.DefinitionProviders`
- 在 `ConfigureServices` 里调用 `AddXiHanSettings(config)`，向 `XiHanSettingOptions.ValueProviders` 依次注册默认的四个值提供者，并绑定 `XiHanAesOptions`（配置节 `XiHan:Settings:Aes`）

默认注册的值提供者链（注册顺序即优先级）：

```text
DefaultValueSettingValueProvider (D)  → 取 SettingDefinition.DefaultValue
ConfigurationSettingValueProvider (C) → 取 IConfiguration["Settings:{name}"]
GlobalSettingValueProvider (G)        → 取 ISettingStore（全局，无 providerKey）
UserSettingValueProvider (U)          → 取 ISettingStore（当前用户 UserId 作 providerKey）
```

> 引入 [XiHan.Framework.MultiTenancy](./multitenancy) 后，`TenantSettingValueProvider`（`"T"`）会被插入到 `G` 之后，形成 `D → C → G → T → U`。

## 工作原理

### 定义提供者自动发现

模块启动时用 `OnRegistered` 回调扫描所有注册类型，凡实现 `ISettingDefinitionProvider` 的都收集起来放进 `XiHanSettingOptions.DefinitionProviders`。你只需写一个实现类（并被 DI 登记），无需手动注册。定义汇总到 `SettingDefinitionContext`（`ISettingDefinitionContext`，单例），`Add` 遇重名 `Name` 会抛 `XiHanException`。

### 取值链与作用域

`SettingManager.GetOrNullAsync(name, scope)` 的真实行为需注意：

1. 按 `name` 从内部定义表取 `SettingDefinition`，未定义抛 `XiHanException`
2. **遍历该定义自身的 `SettingDefinition.Providers` 列表**（不是遍历全局链），取到第一个非 `null` 值即停
3. 仍为空 → 回退到 `ISettingStore.GetOrNullAsync(name, "G", null)`，再回退到 `DefaultValue`
4. 若定义标记 `IsEncrypted` 且值非空 → 解密后返回

> ⚠️ 注意：`GetOrNullAsync` 的 `scope` 参数在当前实现里**读取时并未参与**取值路径——取值由 `definition.Providers` 与全局回退决定。作用域主要影响**写入**（见下）。要让某设置从多来源取值，需在其 `SettingDefinition` 上 `AddProvider(...)` 挂上对应提供者，或依赖全局存储回退。

`SetValueAsync(name, value, scope)` 按作用域解析出 `(providerName, providerKey)` 再写存储：

| `SettingScope` | ProviderName | ProviderKey | 说明 |
| --- | --- | --- | --- |
| `Application` | `G` | `null` | 全局，无键 |
| `Tenant` | `T` | `ICurrentUser.TenantId` | 无租户上下文则抛 `XiHanException` |
| `User` | `U` | `ICurrentUser.UserId` | 无用户则抛 `XiHanException` |
| `Session` | `U` | `ICurrentUser.UserId` | **与 `User` 同键**（会话级未单列独立存储键） |

写入前若挂了 `Validator` 且校验失败抛 `XiHanException`；`IsEncrypted` 会先加密；`value` 为空白则改为 `DeleteAsync`（视为清除）。写入后触发 `OnSettingChanged` 事件。

### 加密

`SettingManager` 的加解密走 `Utils` 的 `AesHelper`。⚠️ 当前实现中密钥是**硬编码常量**，`XiHanAesOptions`（`Key`/`Iv`，配置节 `XiHan:Settings:Aes`）虽被绑定，但 `SettingManager.EncryptValue/DecryptValue` 并未读取它。若要正式使用加密设置，需以此为准评估并接入 `XiHanAesOptions`。

## 核心能力

- **设置定义提供者模式**：实现 `ISettingDefinitionProvider.Define(...)` 声明设置项，模块启动时自动发现并汇总
- **多来源值提供者链**：`D → C → G → U`（+ 多租户 `T`），逐个取第一个非空值
- **作用域读写**：`SettingScope` 分 `Application`（`"G"`）/ `Tenant`（`"T"`）/ `User`（`"U"`）/ `Session`（同 `"U"`）；用户/租户键来自 `ICurrentUser`
- **加密与校验**：定义可标记 `IsEncrypted` 走 AES；可挂 `Validator` 校验写入值
- **变更事件**：`SettingManager.OnSettingChanged` 在写入后触发 `SettingChangedEventArgs`
- **可插拔存储**：`ISettingStore` 承载持久化，默认 `NullSettingStore`（`TryRegister`），上层替换为数据库实现

## 主要 API / 类型

### 管理与定义

| 类型 | 说明 |
| --- | --- |
| `ISettingManager` / `SettingManager` | 设置读写入口（`SettingManager` 为 `IScopedDependency`）：`void AddDefinition(SettingDefinition)`、`Task<string?> GetOrNullAsync(string name, SettingScope scope = Application)`、`Task SetValueAsync(string name, string? value, SettingScope scope = Application)`；额外公开 `event OnSettingChanged`、`GetGroupSettings(group)`、`GetAllValuesAsync(scope)` |
| `ISettingDefinitionProvider` | 设置定义提供者，实现 `void Define(ISettingDefinitionContext context)` |
| `ISettingDefinitionContext` / `SettingDefinitionContext` | 定义上下文（单例）：`void Add(SettingDefinition)`、`SettingDefinition? GetOrNull(string)`、`Dictionary<string, SettingDefinition> GetAll()` |
| `SettingDefinition` | 设置定义模型（见下） |
| `SettingValue` | 名值对（继承 `NameValue<string?>`），`Name` + `Value` |
| `SettingScope` | 作用域枚举：`Application` / `Tenant` / `User` / `Session` |

`SettingDefinition` 构造参数与属性：`Name`（唯一）、`DefaultValue`、`DisplayName`、`Description`、`Group`（默认 `"General"`）、`IsVisibleToClients`（默认 `false`）、`IsEncrypted`（默认 `false`）、`Validator`（`Func<string?, bool>?`）；实例方法 `AddProvider(ISettingValueProvider)` 追加该定义的取值提供者。

### 值提供者

| 类型 | ProviderName | 取值来源 |
| --- | --- | --- |
| `ISettingValueProvider` / `SettingValueProvider` | — | 契约与抽象基类（`Name` + `GetOrNullAsync` + `GetAllAsync`，`Transient`） |
| `DefaultValueSettingValueProvider` | `D` | `SettingDefinition.DefaultValue` |
| `ConfigurationSettingValueProvider` | `C` | `IConfiguration["Settings:{name}"]`（前缀 `Settings:`） |
| `GlobalSettingValueProvider` | `G` | `ISettingStore`（无 providerKey） |
| `UserSettingValueProvider` | `U` | `ISettingStore`（`ICurrentUser.UserId` 作 providerKey） |
| `SettingValueProviderContext` | — | 提供者上下文（`Setting` / `Scope` / `ServiceProvider`） |

### 存储

| 类型 | 说明 |
| --- | --- |
| `ISettingStore` | 存储契约：`GetOrNullAsync(name, providerName, providerKey)`、`GetAllAsync(names, providerName, providerKey)`、`SetAsync(name, value, providerName, providerKey)`、`DeleteAsync(name, providerName, providerKey)` |
| `NullSettingStore` | 空实现（`[Dependency(TryRegister = true)]`，单例），读返回 `null`、写/删空操作；上层替换持久化 |

## 配置

配置节 `XiHan:Settings`（`XiHanSettingOptions.SectionName`，代码组装为主，多数字段不从配置绑定）：

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `DefinitionProviders` | `ITypeList<ISettingDefinitionProvider>` | 空（自动发现填充） | 设置定义提供者集合 |
| `ValueProviders` | `ITypeList<ISettingValueProvider>` | 空（`AddXiHanSettings` 填充默认四项） | 值提供者链 |
| `DeletedSettings` | `HashSet<string>` | 空 | 标记删除的设置名 |
| `ReturnOriginalValueIfDecryptFailed` | `bool` | `true` | 解密失败时是否返回原始值 |

配置节 `XiHan:Settings:Aes`（`XiHanAesOptions.SectionName`）：

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `Key` | `string` | `""` | AES 密钥 |
| `Iv` | `string` | `""` | AES 初始化向量 |

> 该配置节会被绑定，但当前 `SettingManager` 的加解密使用硬编码密钥、未读取此选项，接入前请核对源码。

示例（通过 `Settings:` 前缀让 `ConfigurationSettingValueProvider` 取值）：

```json
{
  "Settings": {
    "App.PageSize": "20"
  },
  "XiHan": {
    "Settings": {
      "Aes": { "Key": "", "Iv": "" }
    }
  }
}
```

## 使用示例

### 定义设置项

```csharp
public class MySettingDefinitionProvider : ISettingDefinitionProvider
{
    public void Define(ISettingDefinitionContext context)
    {
        context.Add(new SettingDefinition(
            name: "App.PageSize",
            defaultValue: "20",
            group: "General"));

        context.Add(new SettingDefinition(
            name: "App.SmtpPassword",
            group: "Mail",
            isEncrypted: true,
            validator: v => !string.IsNullOrWhiteSpace(v)));
    }
}
```

### 读写设置

```csharp
public class MyService(ISettingManager settingManager)
{
    public async Task DemoAsync()
    {
        // 读：走该定义的 Providers 链 + 全局存储 + 默认值回退
        var pageSize = await settingManager.GetOrNullAsync("App.PageSize");

        // 写：作用域决定写到哪个 providerName/providerKey
        await settingManager.SetValueAsync("App.PageSize", "50", SettingScope.User);
        await settingManager.SetValueAsync("App.PageSize", "30", SettingScope.Application);
    }
}
```

### 让某设置支持多来源取值

```csharp
// 在定义时给该设置挂上取值提供者（否则读取仅靠全局存储 + 默认值回退）
var def = new SettingDefinition("App.PageSize", defaultValue: "20")
    .AddProvider(defaultValueProvider)
    .AddProvider(globalProvider)
    .AddProvider(userProvider);
```

## 扩展点 / 自定义

- **替换存储**：实现 `ISettingStore`（如查数据库）并注册；默认 `NullSettingStore` 用 `TryRegister`，你的实现会覆盖它。
- **自定义值提供者**：继承 `SettingValueProvider` 或实现 `ISettingValueProvider`，给出唯一 `Name`，通过 `Configure<XiHanSettingOptions>` 加入 `ValueProviders`，或在具体 `SettingDefinition` 上 `AddProvider`。
- **监听变更**：订阅 `SettingManager.OnSettingChanged`，在设置写回后做缓存失效/通知等。

## 注意事项与最佳实践

- **读取按定义的 Providers、不按 scope**：`GetOrNullAsync` 遍历的是 `SettingDefinition.Providers`，`scope` 参数不参与读取路径。若某设置需要多来源/分级取值，务必在定义上 `AddProvider`，或依赖全局存储回退。
- **`Session` 与 `User` 同键**：写入 `Session` 作用域实际用 `"U"` + `UserId`，与 `User` 无区分。
- **加密密钥硬编码**：`XiHanAesOptions` 目前未被 `SettingManager` 使用，加密走硬编码密钥；生产使用加密设置前需评估。
- **写空即删**：`SetValueAsync` 传入空白值等价于删除该设置的存储项。
- **定义重名会抛异常**：`SettingDefinitionContext.Add` 与 `SettingManager.AddDefinition` 均以 `Name` 去重，重复添加抛 `XiHanException`。

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Security](./security)（`ICurrentUser`，解析用户/租户级设置的 providerKey）

## 相关模块

- [XiHan.Framework.MultiTenancy](./multitenancy)（注入 `TenantSettingValueProvider` 实现租户级设置隔离、承载租户功能开关）
- [XiHan.Framework.Security](./security)
