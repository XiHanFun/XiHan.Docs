# XiHan.Framework.Bot.WeCom

> 企业微信机器人：群机器人 Webhook

- **NuGet**：`XiHan.Framework.Bot.WeCom`
- **模块类**：`XiHanBotWeComModule`
- **所在层**：基础设施层

## 这是什么

这个包为 `XiHan.Framework.Bot` 提供企业微信（WeCom）通道，通过企业微信群机器人的 Webhook 发送消息（`https://qyapi.weixin.qq.com/cgi-bin/webhook/send`），并支持媒体上传接口。它把企业微信封装成标准的 `IBotProvider`，接入统一 Bot 调度——你仍通过 `IBotClient` 发消息，本包负责投递到企业微信群。无第三方 SDK，直接走 HTTP。

## 何时使用

- 需要向企业微信群推送通知（文本 / Markdown / 图片 / 文件等）
- 想让企业微信与其它 IM、邮件、短信通道走同一套发送策略与管道

## 安装

```bash
dotnet add package XiHan.Framework.Bot.WeCom
```

## 启用

```csharp
[DependsOn(typeof(XiHanBotWeComModule))]
public class MyModule : XiHanModule { }
```

模块依赖 `XiHanBotModule`。在 `BotBuilder` 上调用 `UseWeCom(configure)` 注册企业微信提供者，并绑定 `WeComOptions`（Webhook 地址、媒体上传地址、机器人 `Key`）。连接配置也可由 `IWeComConfigStore` 提供，默认 `DefaultWeComConfigStore`，应用层可覆盖为数据库来源。

## 核心能力

- **群机器人发送**：`WeComBotProvider` 实现 `IBotProvider`，经 `WeComBot` 调用企业微信 Webhook 发送
- **媒体上传**：`WeComOptions.UploadUrl` 指向企业微信媒体上传接口，支持图片 / 文件类消息
- **可插拔配置**：`IWeComConfigStore` 抽象配置来源，默认 `DefaultWeComConfigStore`，应用层可换 store 化实现

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `WeComBotProvider` | 企业微信通道提供者（`IBotProvider` 实现） |
| `WeComBot` | 企业微信 Webhook 发送封装 |
| `IWeComConfigStore` / `DefaultWeComConfigStore` | 企业微信配置来源抽象与默认实现 |
| `WeComOptions` | 企业微信提供者配置（Webhook / 上传地址 / Key） |

## 依赖模块

- [XiHan.Framework.Bot](./bot)（核心抽象与调度）
- 无第三方 SDK，直接走 HTTP 调用企业微信开放接口

## 相关模块

- [XiHan.Framework.Bot](./bot)
- [XiHan.Framework.Bot.DingTalk](./bot-dingtalk) · [XiHan.Framework.Bot.Lark](./bot-lark)
