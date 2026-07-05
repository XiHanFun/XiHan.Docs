# XiHan.Framework.Bot.Telegram

> Telegram 机器人：单发通道 + 多机器人交互平台

- **NuGet**：`XiHan.Framework.Bot.Telegram`
- **模块类**：`XiHanBotTelegramModule`
- **所在层**：基础设施层

## 这是什么

这个包为 `XiHan.Framework.Bot` 提供 Telegram 通道，基于官方 **Telegram.Bot** SDK。它有两层能力：一是作为标准 `IBotProvider` 接入统一 Bot 调度（用于纯通知发送）；二是一套更完整的「多机器人交互平台」，支持 Webhook / 长轮询双模传输、命令 / 回调 / 消息路由、会话状态与出站审计，用于构建可交互的 Telegram 机器人。

## 何时使用

- 只想往 Telegram 发通知：通过统一 `IBotClient` 走 `TelegramBotProvider`
- 想构建可交互机器人：处理用户命令、内联按钮回调、多轮会话，可同时托管多个机器人实例
- 需要 Webhook 接收更新（ASP.NET Core 端点）或长轮询两种接入方式

## 安装

```bash
dotnet add package XiHan.Framework.Bot.Telegram
```

## 启用

```csharp
[DependsOn(typeof(XiHanBotTelegramModule))]
public class MyModule : XiHanModule { }
```

模块依赖 `XiHanBotModule`，在 `ConfigureServices` 里同时注册单发通道（`AddXiHanBotTelegram`）与多机器人平台（`AddXiHanBotTelegramPlatform`）。单发通道在 `BotBuilder` 上用 `UseTelegram(configure)` 启用；平台默认不启用，由配置节 `XiHan:Bot:Telegram:Platform` 或应用层 store 开启。本包依赖 `Microsoft.AspNetCore.App`（Webhook 端点需要）。

## 核心能力

- **单发通道**：`TelegramBotProvider` 实现 `IBotProvider`，接入统一 Bot 调度用于通知发送
- **主动发送门面**：`ITelegramNotifier` / `TelegramNotifier` 按机器人名发文本 / Markdown / 图片 / 文件，可编辑消息与内联键盘，内建 429/5xx/超时重试退避与出站审计
- **多机器人托管**：`TelegramBotManager` / `BotRegistry` / `TelegramBotHostedService` 托管多个机器人实例，支持双模传输
- **更新分发与路由**：`TelegramUpdateDispatcher` 配合命令 / 回调 / 消息 / 内联查询 / 回复各类路由器分发更新
- **处理器扩展点**：`IBotCommandHandler` / `IBotCallbackHandler` / `IBotMessageHandler` 等接口 + `[BotCommand]` / `[BotCallback]` 特性声明处理器
- **会话状态与去重**：`IConversationStateStore`（多轮会话状态）、`ITelegramUpdateDeduplicator`（更新去重）、`ITelegramMessageAuditStore`（消息审计），均有内存默认实现，应用层可换 store
- **Webhook 接入**：`TelegramBotWebhookMiddleware` + 应用构建器扩展映射 Webhook 端点
- **可插拔配置**：`ITelegramConfigStore` / `ITelegramBotConfigStore` / `ITelegramBotSettingsStore` 抽象配置来源，默认读选项，应用层可换 DB

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `TelegramBotProvider` | Telegram 单发通道提供者（`IBotProvider` 实现） |
| `ITelegramNotifier` / `TelegramNotifier` | 主动发送门面（文本 / Markdown / 图片 / 文件 / 编辑） |
| `TelegramBotManager` / `BotRegistry` | 多机器人托管与注册表 |
| `TelegramBotHostedService` | 后台托管服务（启动 / 停止机器人实例） |
| `TelegramUpdateDispatcher` | 更新分发（分派到各路由器） |
| `IBotCommandHandler` / `IBotCallbackHandler` / `IBotMessageHandler` | 命令 / 回调 / 消息处理器扩展点 |
| `IConversationStateStore` / `ITelegramUpdateDeduplicator` / `ITelegramMessageAuditStore` | 会话状态 / 更新去重 / 消息审计（均有默认实现） |
| `TelegramBotWebhookMiddleware` | Webhook 接收中间件 |
| `TelegramBotPlatformOptions` | 平台选项（配置节 `XiHan:Bot:Telegram:Platform`） |
| `TelegramOptions` / `ITelegramConfigStore` | 单发通道选项与配置来源 |

## 依赖模块

- [XiHan.Framework.Bot](./bot)（核心抽象与调度）
- 第三方核心：**Telegram.Bot**（官方 SDK）+ `Microsoft.AspNetCore.App`（Webhook 端点）

## 相关模块

- [XiHan.Framework.Bot](./bot)
- [XiHan.Framework.Bot.Email](./bot-email) · [XiHan.Framework.Bot.Sms](./bot-sms)
