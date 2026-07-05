# XiHan.Framework.EventBus

> 事件总线：本地/分布式事件、Outbox 模式、事件存储

- **NuGet**：`XiHan.Framework.EventBus`
- **模块类**：`XiHanEventBusModule`
- **所在层**：基础设施层

## 这是什么

这个包是事件总线的具体实现，落地了 [XiHan.Framework.EventBus.Abstractions](./eventbus-abstractions) 里的接口。它提供进程内的本地事件总线 `LocalEventBus`，以及带可靠投递能力的分布式事件总线（发件箱 Outbox / 收件箱 Inbox 模式）。你用它把业务解耦成"发布事件 → 一个或多个处理器响应"，并可让事件跟随工作单元（UoW）提交后再真正发布。

## 何时使用

- 一处动作要触发多处副作用（如"下单成功"后同时发通知、扣库存、写日志），用事件解耦
- 希望事件在数据库事务/工作单元提交后再发布，避免"事务回滚了但事件已发出去"
- 需要分布式事件的可靠投递：先落发件箱、后台再异步发送，消费端用收件箱去重防重复处理

## 安装

```bash
dotnet add package XiHan.Framework.EventBus
```

## 启用

```csharp
[DependsOn(typeof(XiHanEventBusModule))]
public class MyModule : XiHanModule { }
```

模块在 `PreConfigureServices` 里调用 `AddXiHanEventBus(config)` 完成注册；发件箱/收件箱默认使用内存实现（`InMemoryEventOutbox` / `InMemoryEventInbox`），并注册后台托管服务处理发送与消费。

## 核心能力

- **本地事件总线** `LocalEventBus`（`ILocalEventBus`）：进程内发布/订阅，接入工作单元与当前租户上下文
- **分布式事件总线**：`DistributedEventBusBase` 及 `LocalDistributedEventBus` / `NullDistributedEventBus`，发布可选 `useOutbox` 与 `onUnitOfWorkComplete`
- **Outbox / Inbox 模式**：发件箱保证事件不丢、收件箱保证幂等去重，默认内存实现可被替换为持久化实现
- **后台托管服务**：`EventBoxOutboxSenderHostedService`（发送发件箱）、`EventBoxInboxProcessorHostedService`（处理收件箱）
- **处理器工厂体系**：`IocEventHandlerFactory`、`TransientEventHandlerFactory`、`SingleInstanceHandlerFactory`，配合 `EventHandlerInvoker` 执行处理器
- **工作单元集成** `UnitOfWorkEventPublisher`：让事件跟随 UoW 完成后发布
- **事件命名**：`EventNameAttribute` / `GenericEventNameAttribute` 为分布式事件指定名称

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `LocalEventBus` | 本地事件总线实现（单例，注入 `ILocalEventBus` 使用） |
| `XiHanLocalEventBusOptions` | 本地事件总线选项，持有 `Handlers` 处理器类型列表 |
| `XiHanDistributedEventBusOptions` | 分布式事件总线选项：`Handlers`、`Outboxes`、`Inboxes` |
| `EventBoxProcessingOptions` | 发件箱/收件箱后台处理选项（配置节由 `SectionName` 指定） |
| `EventNameAttribute` | 为分布式事件类型指定事件名 |
| `EventBusBase` | 事件总线基类，封装订阅/发布/调用管道 |

## 快速示例

发布事件（注入 `ILocalEventBus`）：

```csharp
public class OrderAppService
{
    private readonly ILocalEventBus _localEventBus;

    public OrderAppService(ILocalEventBus localEventBus)
    {
        _localEventBus = localEventBus;
    }

    public async Task CreateAsync()
    {
        // 默认 onUnitOfWorkComplete = true：在当前工作单元完成后再发布
        await _localEventBus.PublishAsync(new OrderCreatedEvent { OrderId = 1001 });
    }
}
```

## 注意 / 最佳实践

- **本地事件处理器需被登记进 `XiHanLocalEventBusOptions.Handlers` 才会被订阅**。`LocalEventBus` 构造时对 `Options.Handlers` 逐个 `SubscribeHandlers`；`AddXiHanEventBus` 通过 `services.OnRegistered(...)` 钩子在服务注册阶段自动识别实现了 `ILocalEventHandler<>` / `IDistributedEventHandler<>` 的类型并加入 `Handlers`。这意味着处理器要走框架的模块注册管线被登记；若绕过这条链路（例如只裸 `AddTransient` 具体处理器类型而未被 `OnRegistered` 捕获），它不会进入 `Handlers`，也就不会被订阅——事件会静默无人处理。

## 依赖模块

- [XiHan.Framework.EventBus.Abstractions](./eventbus-abstractions)（接口契约）
- [XiHan.Framework.Messaging](./messaging)
- [XiHan.Framework.Uow](./uow)（工作单元集成）
- [XiHan.Framework.DistributedIds](./distributed-ids)（事件 Id）
- [XiHan.Framework.Core](./core)

## 相关模块

- [XiHan.Framework.EventBus.Abstractions](./eventbus-abstractions)
- [XiHan.Framework.Messaging](./messaging)
- [XiHan.Framework.Uow](./uow)
