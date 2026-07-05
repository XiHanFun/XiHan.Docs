# XiHan.Framework.Threading

> 并发控制：取消令牌统一管理与跨异步边界的环境作用域（Ambient Scope）传递。

- **NuGet**：`XiHan.Framework.Threading`
- **模块类**：`XiHanThreadingModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Threading 为框架提供异步执行时的上下文管理基础设施。它统一了 `CancellationToken` 的获取与临时覆盖，并基于 `AsyncLocal` 实现"环境数据上下文"与"环境作用域"，让一些隐式状态可以安全地跨 `await` 边界传递、支持嵌套与自动还原。它是缓存、本地化等模块协同工作的底层支撑。

## 何时使用

- 需要在调用链深处统一取到"当前"的 `CancellationToken`，而不层层传参。
- 需要临时覆盖当前执行上下文的取消令牌，退出作用域后自动还原。
- 需要基于 `AsyncLocal` 存放跨异步边界的隐式状态，并支持嵌套作用域。

## 安装

```bash
dotnet add package XiHan.Framework.Threading
```

## 启用

```csharp
[DependsOn(typeof(XiHanThreadingModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanThreading()`，注册 `ICancellationTokenProvider`（默认 `NullCancellationTokenProvider`）与开放泛型 `IAmbientScopeProvider<>`。

## 核心能力

- **取消令牌提供者**：`ICancellationTokenProvider` 统一提供当前 `CancellationToken`，避免层层传参。
- **令牌临时覆盖**：`CancellationTokenOverride` + 提供者的 `Use()` 方法，在作用域内临时替换令牌，退出后还原。
- **环境数据上下文**：`AsyncLocalAmbientDataContext` 基于 `AsyncLocal` 提供线程安全的异步本地存储。
- **环境作用域**：`IAmbientScopeProvider<T>` 支持嵌套作用域与值覆盖，用栈式管理隐式状态。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ICancellationTokenProvider` | 取消令牌提供者接口，含 `Token` 属性与 `Use()` 覆盖方法 |
| `CancellationTokenProviderBase` | 提供者基类，实现令牌覆盖机制的骨架 |
| `NullCancellationTokenProvider` | 空实现，返回 `CancellationToken.None` 或覆盖值 |
| `CancellationTokenOverride` | 令牌覆盖值容器，用于临时替换 |
| `IAmbientDataContext` / `AsyncLocalAmbientDataContext` | 环境数据上下文接口与 `AsyncLocal` 实现 |
| `IAmbientScopeProvider<T>` | 环境作用域提供者，`GetValue()` / `BeginScope()` |
| `AmbientDataContextAmbientScopeProvider<T>` | 基于环境数据上下文的作用域提供者实现 |

## 依赖模块

- 内部依赖：仅 [XiHan.Framework.Core](./core)，无第三方 NuGet 依赖。

## 相关模块

- [XiHan.Framework.Caching](./caching) — 与本包的上下文/取消令牌机制协同。
- [XiHan.Framework.Localization](./localization) — 依赖本包做线程/作用域协调。
