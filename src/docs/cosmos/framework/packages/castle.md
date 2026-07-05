# XiHan.Framework.Castle

> AOP 动态代理：Castle DynamicProxy 集成，把框架异步拦截器织入服务方法。

- **NuGet**：`XiHan.Framework.Castle`
- **模块类**：`XiHanCastleModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Castle 是框架的 AOP（面向切面）底座。它集成 Castle DynamicProxy，在服务注册完成后，自动为注册了拦截器的接口服务生成动态代理，并把框架自己的异步拦截器链（`IXiHanInterceptor`）适配到 Castle 的同步 `IInterceptor` 模型上。工作单元（Uow）、缓存（Caching）等模块的方法级切面能力正是建立在它之上。

## 何时使用

- 需要给服务方法透明地织入横切逻辑（事务、缓存、审计等），而不侵入业务代码。
- 你的模块要注册自定义拦截器，让被 `[DependsOn]` 的接口服务自动被代理。
- 依赖 Uow / Caching 等基于拦截器的能力时，需要引入这个 AOP 前置包。

## 安装

```bash
dotnet add package XiHan.Framework.Castle
```

## 启用

```csharp
[DependsOn(typeof(XiHanCastleModule))]
public class MyModule : XiHanModule { }
```

模块在 `PostConfigureServices` 阶段调用 `AddCastleDynamicProxy()`：遍历 DI 容器，为满足条件（接口 + 有实现类 + 未被忽略 + 至少注册了一个拦截器）的服务，用代理版本替换原注册。

## 核心能力

- **Castle DynamicProxy 集成**：基于 `Castle.Core` 生成接口代理。
- **异步拦截器链适配**：`CastleInterceptorAdapter` 把框架的 `IXiHanInterceptor[]` 链适配为 Castle 同步 `IInterceptor`，支持 `void` / `Task` / `Task<T>` 返回值。
- **方法调用上下文包装**：`CastleXiHanMethodInvocation` 把 Castle 的 `IInvocation` 适配为框架的 `IXiHanMethodInvocation`（参数、返回值、泛型参数、目标对象等）。
- **DI 自动代理化**：`AddCastleDynamicProxy()` 在注册阶段自动识别需代理的服务，无需手工逐个配置。
- **拦截器注册回调**：各模块通过 `OnRegistered` 回调把拦截器加入拦截链，按注册顺序执行。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanCastleModule` | 模块类，`PostConfigureServices` 阶段启动代理化 |
| `CastleInterceptorAdapter` | 实现 Castle `IInterceptor`，适配框架的 `IXiHanInterceptor[]` 链 |
| `CastleXiHanMethodInvocation` | 实现 `IXiHanMethodInvocation`，适配 Castle 的 `IInvocation` |
| `ServiceCollectionCastleExtensions` | DI 扩展，含 `AddCastleDynamicProxy()` |

> 拦截器抽象本身（`IXiHanInterceptor`、`IXiHanMethodInvocation`、`XiHanInterceptor`）定义在 [XiHan.Framework.Core](./core)，本包只提供 Castle 实现。

## 依赖模块

- 内部依赖：仅 [XiHan.Framework.Core](./core)（提供拦截器抽象与 `DynamicProxy` 契约）。
- 第三方核心：`Castle.Core`（Castle DynamicProxy）。

## 相关模块

- [XiHan.Framework.Uow](./uow) — `UnitOfWorkInterceptor` 依赖本包织入 `[UnitOfWork]` 事务切面。
- [XiHan.Framework.Caching](./caching) — `CacheInterceptor` 依赖本包实现 `[Cacheable]` / `[CacheEvict]` 方法级缓存。
