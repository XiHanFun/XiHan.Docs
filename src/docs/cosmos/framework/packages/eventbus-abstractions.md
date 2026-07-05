# XiHan.Framework.EventBus.Abstractions

> 事件总线抽象：发布/订阅接口、事件处理管道

- **NuGet**：`XiHan.Framework.EventBus.Abstractions`
- **模块类**：`XiHanEventBusAbstractionsModule`
- **所在层**：基础设施层

## 这是什么

这个包只定义事件总线的接口契约，不含具体实现。它规定了"事件怎么发布、处理器怎么订阅、处理器长什么样"，把本地事件（进程内）和分布式事件（跨进程/跨服务）的接口都摆出来。真正的实现由 [XiHan.Framework.EventBus](./eventbus) 提供。业务代码和实现层都面向这里的接口编程，从而做到解耦。

## 何时使用

- 你要在领域层/应用层声明事件与事件处理器，但不想耦合具体的事件总线实现
- 你要区分本地事件（同进程解耦）与分布式事件（跨服务通信）两种订阅契约
- 你要为分布式事件定义可靠投递的发件箱/收件箱（Outbox/Inbox）契约

## 安装

```bash
dotnet add package XiHan.Framework.EventBus.Abstractions
```

## 启用

```csharp
[DependsOn(typeof(XiHanEventBusAbstractionsModule))]
public class MyModule : XiHanModule { }
```

通常你不会单独引用抽象包，而是引用实现包 `XiHan.Framework.EventBus`，它已依赖本包。

## 核心能力

- **统一事件总线契约** `IEventBus`：定义 `PublishAsync`、`Subscribe`、`Unsubscribe`、`UnsubscribeAll` 等发布/订阅/注销方法
- **本地事件契约**：`ILocalEventBus`（进程内事件总线）+ `ILocalEventHandler<TEvent>`（本地事件处理器）
- **分布式事件契约**：`IDistributedEventBus`（发布支持 `onUnitOfWorkComplete` / `useOutbox` 参数）+ `IDistributedEventHandler<TEvent>`
- **处理器基础接口** `IEventHandler`：所有处理器的间接基接口，实际需实现 `ILocalEventHandler<>` 或 `IDistributedEventHandler<>`
- **可靠投递契约**：`IEventOutbox`（发件箱）、`IEventInbox`（收件箱），以及 `OutboxConfig` / `InboxConfig` 等配置模型
- **处理器工厂与调用**：`IEventHandlerFactory`、`IEventHandlerInvoker` 等抽象，供实现层构建处理管道

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IEventBus` | 事件总线根接口：发布、订阅、注销 |
| `ILocalEventBus` | 本地（进程内）事件总线接口 |
| `ILocalEventHandler<TEvent>` | 本地事件处理器：实现 `HandleEventAsync(TEvent)` |
| `IDistributedEventBus` | 分布式事件总线接口 |
| `IDistributedEventHandler<TEvent>` | 分布式事件处理器 |
| `IEventHandler` | 所有处理器的间接基接口（勿直接实现） |
| `IEventOutbox` / `IEventInbox` | 发件箱 / 收件箱可靠投递契约 |
| `LocalEventHandlerOrderAttribute` | 标注本地处理器执行顺序 |

## 快速示例

定义一个本地事件处理器（面向抽象编程，具体实现由 EventBus 包提供）：

```csharp
// 事件（普通引用类型即可）
public class OrderCreatedEvent
{
    public long OrderId { get; set; }
}

// 本地事件处理器
public class OrderCreatedHandler : ILocalEventHandler<OrderCreatedEvent>
{
    public Task HandleEventAsync(OrderCreatedEvent eventData)
    {
        // 处理逻辑
        return Task.CompletedTask;
    }
}
```

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.ObjectMapping](./objectmapping)（模块 `DependsOn` 依赖）
- [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions)（事件可携带租户上下文）
- [XiHan.Framework.Timing](./timing)

## 相关模块

- [XiHan.Framework.EventBus](./eventbus)（本抽象的实现）
- [XiHan.Framework.Messaging](./messaging)
