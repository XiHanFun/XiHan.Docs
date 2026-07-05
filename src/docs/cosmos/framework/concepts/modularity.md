# 核心概念 · 模块系统

模块系统是 XiHan.Framework 的地基。理解了它，你就理解了整个框架的组织方式。

## 什么是"模块"

一个**模块**就是一个继承 `XiHanModule` 的类。它代表一块**可独立安装、可独立启用**的能力（一个 NuGet 包通常对应一个模块类）。模块自己负责三件事：

1. **注册服务** —— 把自己需要的服务加进 DI 容器
2. **声明依赖** —— 用 `[DependsOn]` 说明"我要用哪些别的模块"
3. **接入生命周期** —— 在合适的时机接入中间件、后台任务等

```csharp
using XiHan.Framework.Core.Modularity;

public class MyModule : XiHanModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // 注册服务：context.Services 就是标准的 IServiceCollection
        context.Services.AddSingleton<IMyService, MyService>();
    }
}
```

## `[DependsOn]`：声明依赖

模块之间**不是靠你在 `Program.cs` 里手动排顺序**，而是靠 `[DependsOn]` 声明依赖关系：

```csharp
using XiHan.Framework.Core.Modularity;
using XiHan.Framework.Web.Api;
using XiHan.Framework.Data;

[DependsOn(
    typeof(XiHanWebApiModule),
    typeof(XiHanDataModule)
)]
public class MyAppModule : XiHanModule
{
}
```

这行声明的含义是：**加载 `MyAppModule` 之前，必须先加载 `XiHanWebApiModule` 和 `XiHanDataModule`**。而这两个模块又各自 `[DependsOn]` 更底层的模块……于是整棵依赖树被完整地表达出来。

## 自动拓扑排序加载

启动时你只需要指定**一个根模块**：

```csharp
await builder.AddApplicationAsync<MyAppModule>();
```

框架会：

1. 从根模块出发，沿着 `[DependsOn]` **递归收集**所有直接和间接依赖的模块
2. 对它们做**拓扑排序**（被依赖的排在前面）
3. 按这个顺序依次调用每个模块的生命周期钩子

```text
你只写这一行：
   AddApplicationAsync<MyAppModule>()

框架自动展开成有序加载：
   Utils → Metadata → Core → Domain.Shared → Domain
        → Data → Application → Web.Core → Web.Api → MyAppModule
```

**好处**：

- 加/减一块能力 = 加/减一行 `[DependsOn]`，不用管注册顺序
- 依赖图无环、可裁剪，编译期就能发现缺失的模块
- 每个模块可以独立测试、独立发布

## 自动服务注册

除了模块级别的装配，框架还提供**约定式的服务注册**：实现了标记接口的类会被自动扫描并注册进 DI，无需逐个 `services.AddXxx`。

```csharp
using XiHan.Framework.Core.DependencyInjection.ServiceLifetimes;

// 实现 ITransientDependency，自动以 Transient 生命周期注册
public class OrderService : IOrderService, ITransientDependency
{
}
```

细节见 [依赖注入](./dependency-injection)。

## 无模块类的包

少数包是**纯工具库或分析器**，没有模块类，也不参与 `[DependsOn]`：

- `XiHan.Framework.Utils` —— 零依赖工具库，直接引用、直接调用静态方法
- `XiHan.Framework.Metadata` —— 框架元数据常量
- `XiHan.Framework.Analyzers` —— Roslyn 分析器，作为 `Analyzer` 引用，编译期生效

这些包 `dotnet add package` 之后即可使用，不需要写 `[DependsOn]`。

## 小结

| 概念 | 作用 |
| --- | --- |
| `XiHanModule` | 模块的基类，一块能力的载体 |
| `[DependsOn]` | 声明模块依赖，驱动自动装配 |
| `AddApplicationAsync<T>` | 指定根模块，收集 + 拓扑排序 + 加载整棵依赖树 |
| 标记接口 | `ITransientDependency` 等，驱动约定式服务注册 |

## 下一步

- [生命周期](./lifecycle)：模块被加载时，具体会调用哪些钩子
- [依赖注入](./dependency-injection)：约定式注册与选项模式
- [动态 API](./dynamic-api)：应用服务如何变成 REST 接口
