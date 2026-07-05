# XiHan.Framework.Bot.DingTalk

> 钉钉机器人：群自定义机器人 Webhook

- **NuGet**：`XiHan.Framework.Bot.DingTalk`
- **模块类**：`XiHanBotDingTalkModule`
- **所在层**：基础设施层

## 这是什么

这个包为 `XiHan.Framework.Bot` 提供钉钉通道，通过钉钉群「自定义机器人」的 Webhook 发送消息（`https://oapi.dingtalk.com/robot/send`）。它把钉钉封装成标准的 `IBotProvider`，接入统一 Bot 调度——你仍通过 `IBotClient` 发消息，本包负责投递到钉钉群。无第三方 SDK，直接走 HTTP。

## 何时使用

- 需要向钉钉群推送通知（文本 / Markdown / 卡片 / 链接等）
- 想让钉钉与其它 IM、邮件、短信通道走同一套发送策略与管道

## 安装

```bash
dotnet add package XiHan.Framework.Bot.DingTalk
```

## 启用

```csharp
[DependsOn(typeof(XiHanBotDingTalkModule))]
public class MyModule : XiHanModule { }
```

模块依赖 `XiHanBotModule`。在 `BotBuilder` 上调用 `UseDingTalk(configure)` 注册钉钉提供者，并绑定 `DingTalkOptions`（Webhook 地址、访问令牌 `AccessToken`、加签密钥 `Secret`、安全关键字 `KeyWord`）。连接配置也可由 `IDingTalkConfigStore` 提供，默认 `DefaultDingTalkConfigStore`，应用层可覆盖为数据库来源。

## 核心能力

- **群机器人发送**：`DingTalkBotProvider` 实现 `IBotProvider`，经 `DingTalkBot` 调用钉钉 Webhook 发送
- **安全校验支持**：`DingTalkOptions` 支持加签密钥与安全关键字（钉钉自定义机器人的三种安全设置）
- **可插拔配置**：`IDingTalkConfigStore` 抽象配置来源，默认 `DefaultDingTalkConfigStore`，应用层可换 store 化实现

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `DingTalkBotProvider` | 钉钉通道提供者（`IBotProvider` 实现） |
| `DingTalkBot` | 钉钉 Webhook 发送封装 |
| `IDingTalkConfigStore` / `DefaultDingTalkConfigStore` | 钉钉配置来源抽象与默认实现 |
| `DingTalkOptions` | 钉钉提供者配置（Webhook / AccessToken / Secret / KeyWord） |

## 依赖模块

- [XiHan.Framework.Bot](./bot)（核心抽象与调度）
- 无第三方 SDK，直接走 HTTP 调用钉钉开放接口

## 相关模块

- [XiHan.Framework.Bot](./bot)
- [XiHan.Framework.Bot.Lark](./bot-lark) · [XiHan.Framework.Bot.WeCom](./bot-wecom)
