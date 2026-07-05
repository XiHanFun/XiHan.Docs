# 核心概念 · 依赖注入

XiHan.Framework 直接使用 **.NET 内置的依赖注入容器**（`IServiceCollection` / `IServiceProvider`），没有另造一套。在此之上，它加了两样让日常开发更省心的东西：**约定式自动注册**和**选项模式封装**。

## 两种注册方式

### 方式一：约定式自动注册（推荐）

给你的服务实现一个**标记接口**，框架会自动扫描并按对应生命周期注册进容器——你**不用**写 `services.AddXxx`：

```csharp
using XiHan.Framework.Core.DependencyInjection.ServiceLifetimes;

// 瞬时：每次解析都新建
public class SmsSender : ISmsSender, ITransientDependency { }

// 作用域：每个请求一个实例
public class OrderService : IOrderService, IScopedDependency { }

// 单例：全应用一个实例
public class ConfigCache : IConfigCache, ISingletonDependency { }
```

| 标记接口 | 生命周期 | 等价于 |
| --- | --- | --- |
| `ITransientDependency` | Transient | `AddTransient` |
| `IScopedDependency` | Scoped | `AddScoped` |
| `ISingletonDependency` | Singleton | `AddSingleton` |

框架会自动把实现类注册为它实现的接口。**应用服务基类 `ApplicationServiceBase` 已经实现了 `ITransientDependency`**，所以你写的应用服务天然会被注册（见 [动态 API](./dynamic-api)）。

### 方式二：手动注册

需要更精细的控制时，在模块的 `ConfigureServices` 里照常手写：

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddSingleton<IClock, SystemClock>();
    context.Services.AddHttpClient<IWeatherApi, WeatherApi>();
}
```

`context.Services` 就是标准的 `IServiceCollection`，所有你熟悉的 .NET DI 扩展方法都能用。

> 有些领域服务（尤其是需要特定构造参数或工厂的）**必须手写注册**——约定式注册只覆盖能无参解析接口的常规场景。

## 注入依赖

和标准 .NET 一样，构造函数注入：

```csharp
public class OrderService : IOrderService, IScopedDependency
{
    private readonly IRepositoryBase<Order, long> _orders;
    private readonly ISmsSender _sms;

    public OrderService(IRepositoryBase<Order, long> orders, ISmsSender sms)
    {
        _orders = orders;
        _sms = sms;
    }
}
```

## 选项模式

框架在 `XiHanModule` 上封装了 `Configure<T>` / `PreConfigure<T>` / `PostConfigure<T>`，简化配置对象的绑定：

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    // 直接配置
    Configure<MyOptions>(o => o.Retries = 3);

    // 从配置节绑定
    Configure<MyOptions>(context.Services
        .GetConfiguration()
        .GetSection("XiHan:MyModule"));
}
```

消费时注入 `IOptions<MyOptions>` / `IOptionsMonitor<MyOptions>`：

```csharp
public class MyService(IOptions<MyOptions> options) : ITransientDependency
{
    private readonly MyOptions _options = options.Value;
}
```

- `PreConfigure<T>` —— 在正式配置**之前**预设值，供后续模块读取
- `PostConfigure<T>` —— 在所有模块配置**之后**做最终覆盖

它们对应生命周期里的 `PreConfigureServices` / `PostConfigureServices`（见 [生命周期](./lifecycle)）。

## 小结

- 优先用**标记接口**自动注册，减少样板
- 需要精细控制时在 `ConfigureServices` 里手写
- 用 `Configure<T>` 绑定选项，用 `IOptions<T>` 消费
- 一切都建立在标准 .NET DI 之上，没有魔法黑箱

## 下一步

- [动态 API](./dynamic-api)：应用服务如何自动变成接口
- [模块系统](./modularity)：模块如何被装配
