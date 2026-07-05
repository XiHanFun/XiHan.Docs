# XiHan.Framework.Bot.Lark

> 飞书机器人：群自定义机器人 Webhook

- **NuGet**：`XiHan.Framework.Bot.Lark`
- **模块类**：`XiHanBotLarkModule`
- **所在层**：基础设施层

## 这是什么

这个包为 `XiHan.Framework.Bot` 提供飞书（Lark）通道，通过飞书群「自定义机器人」的 Webhook 发送消息（`https://open.feishu.cn/open-apis/bot/v2/hook`），并支持图片上传接口。它把飞书封装成标准的 `IBotProvider`，接入统一 Bot 调度——你仍通过 `IBotClient` 发消息，本包负责投递到飞书群。无第三方 SDK，直接走 HTTP。

## 何时使用

- 需要向飞书群推送通知（文本 / 富文本 / 卡片 / 图片等）
- 想让飞书与其它 IM、邮件、短信通道走同一套发送策略与管道

## 安装

```bash
dotnet add package XiHan.Framework.Bot.Lark
```

## 启用

```csharp
[DependsOn(typeof(XiHanBotLarkModule))]
public class MyModule : XiHanModule { }
```

模块依赖 `XiHanBotModule`。在 `BotBuilder` 上调用 `UseLark(configure)` 注册飞书提供者，并绑定 `LarkOptions`（Webhook 地址、图片上传地址、访问令牌 `AccessToken`、加签密钥 `Secret`、安全关键字 `KeyWord`）。连接配置也可由 `ILarkConfigStore` 提供，默认 `DefaultLarkConfigStore`，应用层可覆盖为数据库来源。

## 核心能力

- **群机器人发送**：`LarkBotProvider` 实现 `IBotProvider`，经 `LarkBot` 调用飞书 Webhook 发送
- **图片上传**：`LarkOptions.UploadUrl` 指向飞书图片上传接口，支持图片类消息
- **安全校验支持**：`LarkOptions` 支持加签密钥与安全关键字
- **可插拔配置**：`ILarkConfigStore` 抽象配置来源，默认 `DefaultLarkConfigStore`，应用层可换 store 化实现

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `LarkBotProvider` | 飞书通道提供者（`IBotProvider` 实现） |
| `LarkBot` | 飞书 Webhook 发送封装 |
| `ILarkConfigStore` / `DefaultLarkConfigStore` | 飞书配置来源抽象与默认实现 |
| `LarkOptions` | 飞书提供者配置（Webhook / 上传地址 / AccessToken / Secret / KeyWord） |

## 依赖模块

- [XiHan.Framework.Bot](./bot)（核心抽象与调度）
- 无第三方 SDK，直接走 HTTP 调用飞书开放接口

## 相关模块

- [XiHan.Framework.Bot](./bot)
- [XiHan.Framework.Bot.DingTalk](./bot-dingtalk) · [XiHan.Framework.Bot.WeCom](./bot-wecom)
