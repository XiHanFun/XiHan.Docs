# XiHan.Framework.Core

> 模块化引擎核心：XiHanModule 基类、[DependsOn] 依赖声明、拓扑排序加载、生命周期钩子、DI 扩展、选项模式、异常处理链。

- **NuGet**：`XiHan.Framework.Core`
- **模块类**：—（它本身提供 `XiHanModule` 基类与模块系统，无独立模块类）
- **所在层**：核心层

## 这是什么

XiHan.Framework.Core 是整个框架的引擎。它定义了"模块"这一核心抽象：每个功能包都是一个继承 `XiHanModule` 的模块，用 `[DependsOn]` 声明依赖，框架据此做拓扑排序、按序加载，并在启动/初始化/关机各阶段回调各模块的生命周期钩子。它还提供了依赖注入扩展、选项模式支持与统一的异常体系。上层所有模块都直接或间接依赖它。

## 何时使用

- 编写自己的功能模块，需要继承 `XiHanModule` 并声明依赖。
- 需要在应用启动、初始化、关机的特定阶段挂载逻辑。
- 需要约定式服务注册、`IServiceCollection` 的 `AddApplication` 引导，或选项模式支持。
- 需要框架统一的业务异常 / 用户友好异常体系。

## 安装

```bash
dotnet add package XiHan.Framework.Core
```

## 启用

Core 提供 `XiHanModule` 基类本身。业务模块通过继承它并用 `[DependsOn]` 声明依赖来接入模块系统：

```csharp
[DependsOn(typeof(SomeOtherModule))]
public class MyModule : XiHanModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // 注册服务
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        // 应用初始化时执行
    }
}
```

## 核心能力

- **模块化系统**：`XiHanModule` 基类 + `[DependsOn]` 依赖声明，`ModuleLoader` / `ModuleManager` 负责发现、拓扑排序并按序加载模块。详见 [模块化](../concepts/modularity)。
- **生命周期钩子**：`ConfigureServices` / `PreConfigureServices` / `PostConfigureServices`（含 `*Async` 版本），以及 `OnPreApplicationInitialization` / `OnApplicationInitialization` / `OnPostApplicationInitialization` / `OnApplicationShutdown`。详见 [生命周期](../concepts/lifecycle)。
- **应用引导**：`IServiceCollection.AddApplication<TStartupModule>()` / `AddApplicationAsync<TStartupModule>()` 从启动模块引导整个应用。
- **依赖注入扩展**：约定式注册（`IConventionalRegistrar`）、`[ExposeServices]` / `[Dependency]` 特性、缓存式服务提供器、属性注入等。详见 [依赖注入](../concepts/dependency-injection)。
- **选项模式**：`XiHanDynamicOptionsManager`、`XiHanOptionsFactory`、`PreConfigure` 预配置支持。
- **异常体系**：`XiHanException`、`BusinessException`、`UserFriendlyException`、`InitializationException` / `ShutdownException` 及处理链。
- **插件源**：`FolderPlugInSource` / `FilePlugInSource` / `TypePlugInSource` 支持从目录、程序集或类型加载插件模块。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanModule` | 所有模块的抽象基类，暴露配置服务与生命周期钩子 |
| `DependsOnAttribute` | 声明模块依赖，驱动拓扑排序加载 |
| `ServiceConfigurationContext` | `ConfigureServices` 阶段的上下文（含 `IServiceCollection`） |
| `ApplicationInitializationContext` | 初始化阶段上下文 |
| `IModuleLoader` / `ModuleManager` | 模块加载与管理 |
| `XiHanException` / `BusinessException` / `UserFriendlyException` | 框架统一异常类型 |

## 依赖模块

- [XiHan.Framework.Metadata](./metadata) — 框架元数据。
- [XiHan.Framework.Utils](./utils) — 通用工具库。
- 第三方：`Microsoft.Extensions.Hosting`（主机集成）、`Microsoft.Extensions.Localization`。

## 相关模块

- [模块化概念](../concepts/modularity)
- [生命周期概念](../concepts/lifecycle)
- [依赖注入概念](../concepts/dependency-injection)
- [XiHan.Framework.Utils](./utils) · [XiHan.Framework.Metadata](./metadata)
