# XiHan.Framework.Messaging

> 消息处理：消息代理抽象（发布/消费/路由）

- **NuGet**：`XiHan.Framework.Messaging`
- **模块类**：`XiHanMessagingModule`
- **所在层**：基础设施层

## 这是什么

这个包是一层很薄的消息发送抽象。它定义"一条消息（信封）→ 路由到某个通道 → 交给对应发送器投递"的统一模型与接口，本身**只负责路由**，不含任何具体通道实现（邮件、短信等）。真正的发送器由业务层或专用包（如 Bot 系列）提供并注册进来；本包内置的只有一个"未配置兜底发送器"。

## 何时使用

- 你要一套统一的消息模型（信封、接收人、发送结果），把不同通道的差异藏在同一个接口后
- 你要按 `Channel` 把消息路由到不同的发送器（email / sms / site 等），而调用方无需感知具体实现
- 你在实现自定义消息通道，需要一个标准的 `IMessageSender` 契约去接入路由

## 安装

```bash
dotnet add package XiHan.Framework.Messaging
```

## 启用

```csharp
[DependsOn(typeof(XiHanMessagingModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里调用 `AddXiHanMessaging()`，注册消息调度器 `DefaultMessageDispatcher` 与未配置兜底发送器 `NotConfiguredMessageSender`。

## 核心能力

- **消息信封模型** `MessageEnvelope`：承载 `MessageId`、`Channel`、`Subject`、`Content`、模板编码/参数、接收人集合、计划/过期时间、关联追踪 Id 等
- **消息调度器** `IMessageDispatcher`：`DispatchAsync(envelope)` 把消息分发到匹配通道，返回每个接收人的发送结果集合
- **消息发送器契约** `IMessageSender`：`CanHandle(channel)` 声明支持的通道 + `SendAsync(envelope, recipient)` 投递单条消息
- **路由约定**：调度器按 `Channel` 选择能处理的发送器；未匹配到时走兜底发送器
- **可配置行为** `XiHanMessagingOptions`：`ContinueOnError`（单接收人失败是否继续）、`ThrowWhenNoSender`（无发送器时是否抛异常）

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IMessageDispatcher` | 消息调度器：分发消息到通道并汇总结果 |
| `IMessageSender` | 消息发送器契约：声明支持的通道并投递消息 |
| `MessageEnvelope` | 消息信封（消息主体与元数据） |
| `MessageRecipient` | 接收人模型 |
| `MessageSendResult` | 单次发送结果 |
| `XiHanMessagingOptions` | 消息模块行为配置 |
| `DefaultMessageDispatcher` | 默认调度器实现 |
| `NotConfiguredMessageSender` | 未配置通道时的兜底发送器 |

## 说明

本包只提供路由骨架：具体发送器（邮件、短信等）以及"后台异步发送（发件箱）"等能力由业务层或上层包实现并注册为 `IMessageSender`。要发某个通道的消息，先提供并注册对应发送器，再通过 `IMessageDispatcher.DispatchAsync` 分发即可。

## 依赖模块

- [XiHan.Framework.Core](./core)
- 仅依赖 Core 与 BCL，不引入任何第三方通道 SDK。

## 相关模块

- [XiHan.Framework.EventBus](./eventbus)（事件总线依赖本包）
- [XiHan.Framework.Bot](./bot)（消息通道实现方向）
