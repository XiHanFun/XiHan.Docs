# XiHan.Framework.Bot.Email

> 邮件通道：MailKit 集成

- **NuGet**：`XiHan.Framework.Bot.Email`
- **模块类**：`XiHanBotEmailModule`
- **所在层**：基础设施层

## 这是什么

这个包为 `XiHan.Framework.Bot` 提供邮件发送通道，基于 **MailKit** 实现 SMTP 发信。它把邮件封装成一个标准的 `IBotProvider`，接入统一的 Bot 调度体系——你依旧通过 `IBotClient` 发消息，本包负责把消息投递为邮件。

## 何时使用

- 需要通过 SMTP 发送通知邮件（支持 HTML 正文、抄送 / 密送）
- 想让邮件与短信、IM 等其它通道走同一套发送策略与管道

## 安装

```bash
dotnet add package XiHan.Framework.Bot.Email
```

## 启用

```csharp
[DependsOn(typeof(XiHanBotEmailModule))]
public class MyModule : XiHanModule { }
```

模块依赖 `XiHanBotModule`。在 `BotBuilder` 上调用 `UseEmail(configure)` 注册邮件提供者，并绑定 `EmailOptions`（发件人、默认收件人 / 抄送 / 密送、是否 HTML 正文）。SMTP 连接配置由 `IEmailConfigStore` 提供，默认实现为 `DefaultEmailConfigStore`，应用层可覆盖为数据库来源。

## 核心能力

- **SMTP 发信**：`EmailBotProvider` 实现 `IBotProvider`，经 `EmailBot` 用 MailKit 发送邮件
- **可插拔连接配置**：`IEmailConfigStore` 抽象 SMTP 连接来源，默认 `DefaultEmailConfigStore`，应用层可换 store 化实现
- **发信选项**：`EmailOptions` 支持发件人、默认收件人 / 抄送 / 密送、HTML 正文开关

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `EmailBotProvider` | 邮件通道提供者（`IBotProvider` 实现） |
| `EmailBot` | 基于 MailKit 的 SMTP 发信封装 |
| `IEmailConfigStore` / `DefaultEmailConfigStore` | 邮件连接配置来源抽象与默认实现 |
| `EmailOptions` | 邮件提供者配置（发件人 / 收件人 / 正文格式） |

## 依赖模块

- [XiHan.Framework.Bot](./bot)（核心抽象与调度）
- 第三方核心：**MailKit**（SMTP 发信）

## 相关模块

- [XiHan.Framework.Bot](./bot)
- [XiHan.Framework.Bot.Sms](./bot-sms) · [XiHan.Framework.Bot.Telegram](./bot-telegram)
