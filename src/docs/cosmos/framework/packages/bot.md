# XiHan.Framework.Bot

> 机器人核心：多平台消息接入的统一抽象

- **NuGet**：`XiHan.Framework.Bot`
- **模块类**：`XiHanBotModule`
- **所在层**：基础设施层

## 这是什么

这个包是「机器人 / 消息通知」的核心抽象与调度内核。它定义了统一的消息模型、提供者（Provider）抽象、调度器、策略与管道，让你用一致的方式往多个渠道（邮件、短信、Telegram、钉钉、飞书、企业微信……）发消息。核心包本身不含任何具体通道——各通道由独立子包以 `UseXxx` 扩展方法接入，本包负责编排它们。

## 何时使用

- 需要向多个平台统一发送通知，且希望调用方只面对一个 `IBotClient`
- 需要广播 / 主备 / 优先级等发送策略，或重试、限流、环境过滤等横切能力
- 需要按模板渲染消息（`SendTemplateAsync`），或延迟 / 批量发送
- 想让「往哪些渠道发」与「用哪个厂商」解耦，通过渠道映射灵活配置

## 安装

```bash
dotnet add package XiHan.Framework.Bot
```

## 启用

```csharp
[DependsOn(typeof(XiHanBotModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里调用 `AddXiHanBot`，注册调度器、策略与管道。核心包只提供内核；具体通道通过 `BotBuilder` 的 `UseEmail` / `UseSms` / `UseTelegram` 等扩展方法（由各子包提供）接入。

## 核心能力

- **统一客户端入口**：`IBotClient` 提供发送 / 指定渠道发送 / 模板发送 / 批量发送 / 延迟发送，返回 `BotDispatchResult`（整体成败 + 各提供者明细）
- **提供者抽象**：`IBotProvider` 定义「一个通道怎么发一条消息」，各子包实现它并以 `TryAddEnumerable` 注册，可多提供者共存
- **调度器**：`BotDispatcher` 解析渠道 → 选提供者 → 应用管道 → 执行策略，统一聚合结果
- **发送策略**：`Broadcast`（广播全部）、`Failover`（主备，成功即止）、`Priority`（仅发第一个），由 `BotStrategyNames` 定义
- **横切管道**：重试（`RetryPipeline`）、限流（`RateLimitPipeline`）、环境过滤（`EnvironmentFilterPipeline`），经 `XiHanBotOptions` 开关配置
- **渠道映射**：`BotChannel` 把逻辑渠道名映射到一组提供者，`BotBuilder.AddChannel` 登记
- **消息模板**：`IBotTemplateEngine` + `BotTemplate` 支持按模板名渲染消息（`BotMessageType` 覆盖 Text / Markdown / Card / Image / File / Link）

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IBotClient` | 机器人客户端入口（发送 / 模板 / 批量 / 延迟） |
| `IBotProvider` | 通道提供者抽象（各子包实现） |
| `BotDispatcher` | 调度器（渠道解析 + 策略 + 管道编排） |
| `BotDispatchResult` / `BotResult` | 调度聚合结果 / 单提供者结果 |
| `BotMessage` / `BotMessageType` | 消息模型 / 消息类型枚举 |
| `IBotStrategy` / `BotStrategyNames` | 发送策略抽象与内置策略名（Broadcast/Failover/Priority） |
| `IBotPipeline` | 横切管道抽象（重试 / 限流 / 环境过滤） |
| `BotBuilder` | Bot 构建器（配置选项 / 渠道 / 模板；子包在其上加 `UseXxx`） |
| `XiHanBotOptions` | Bot 配置项（默认策略、重试、限流、环境过滤等） |
| `IBotTemplateEngine` / `BotTemplate` | 模板引擎抽象与模板 |

## 依赖模块

- [XiHan.Framework.Http](./http)（通道适配的 HTTP 调用基础）
- [XiHan.Framework.Templating](./templating)（消息模板渲染）
- 无第三方 SDK 依赖；具体平台 SDK 由各通道子包引入

## 相关模块

- [XiHan.Framework.Bot.Email](./bot-email)
- [XiHan.Framework.Bot.Sms](./bot-sms)
- [XiHan.Framework.Bot.Telegram](./bot-telegram)
- [XiHan.Framework.Bot.DingTalk](./bot-dingtalk) · [XiHan.Framework.Bot.Lark](./bot-lark) · [XiHan.Framework.Bot.WeCom](./bot-wecom)
