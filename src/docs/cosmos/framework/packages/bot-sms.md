# XiHan.Framework.Bot.Sms

> 短信通道：阿里云 / 腾讯云短信

- **NuGet**：`XiHan.Framework.Bot.Sms`
- **模块类**：`XiHanBotSmsModule`
- **所在层**：基础设施层

## 这是什么

这个包为 `XiHan.Framework.Bot` 提供短信发送通道，内置 **阿里云** 与 **腾讯云** 两家云短信网关。它把短信封装成一个标准的 `IBotProvider`，接入统一的 Bot 调度体系；短信按云厂商模板发送，本包负责把内部模板码映射为服务商模板码并投递。

## 何时使用

- 需要通过阿里云 / 腾讯云发送模板短信（验证码、通知等）
- 想让短信与邮件、IM 等其它通道走同一套发送策略与管道

## 安装

```bash
dotnet add package XiHan.Framework.Bot.Sms
```

## 启用

```csharp
[DependsOn(typeof(XiHanBotSmsModule))]
public class MyModule : XiHanModule { }
```

模块依赖 `XiHanBotModule`。在 `BotBuilder` 上调用 `UseSms()` 注册短信提供者与网关解析器。短信凭证不走配置文件绑定——`ISmsConfigStore` 提供渠道配置，默认为空实现，应用层须注册数据库实现覆盖它才能真正发信。

## 核心能力

- **多云网关**：`SmsProviderType` 覆盖阿里云 / 腾讯云；`AliyunSmsGatewayClient` / `TencentCloudSmsGatewayClient` 分别对接对应 SDK
- **网关解析与缓存**：`ISmsGatewayResolver` / `SmsGatewayResolver` 按配置指纹构建并缓存 `ISmsGatewayClient`
- **模板码映射**：发送请求携带内部模板码，客户端按配置的模板映射转换为服务商模板码
- **可插拔配置**：`ISmsConfigStore` 抽象短信渠道配置来源（默认空实现，应用层须提供 DB 实现）

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `SmsBotProvider` | 短信通道提供者（`IBotProvider` 实现） |
| `ISmsGatewayClient` | 短信网关客户端抽象（绑定一条渠道配置） |
| `AliyunSmsGatewayClient` / `TencentCloudSmsGatewayClient` | 阿里云 / 腾讯云网关实现 |
| `ISmsGatewayResolver` / `SmsGatewayResolver` | 按配置指纹解析并缓存网关客户端 |
| `ISmsConfigStore` / `DefaultSmsConfigStore` | 短信渠道配置来源抽象与默认（空）实现 |
| `SmsProviderType` | 服务商类型枚举（Aliyun / TencentCloud） |
| `SmsChannelConfig` | 短信渠道配置 |

## 依赖模块

- [XiHan.Framework.Bot](./bot)（核心抽象与调度）
- 第三方核心：**AlibabaCloud.SDK.Dysmsapi20170525**（阿里云短信）+ **TencentCloudSDK.Sms**（腾讯云短信）

## 相关模块

- [XiHan.Framework.Bot](./bot)
- [XiHan.Framework.Bot.Email](./bot-email) · [XiHan.Framework.Bot.Telegram](./bot-telegram)
