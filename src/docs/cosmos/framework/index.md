---
title: 后端-开发框架
index: false
---

# XiHan.Framework 开发框架

曦寒开发框架是一个模块化的.NET 应用开发框架，提供了丰富的功能模块以简化企业级应用程序的开发。框架采用模块化设计，各个功能模块可以独立使用或组合使用，提供了高度的灵活性和可扩展性。

## 核心基础模块

| 模块名称                      | 主要功能                                                               |
| ----------------------------- | ---------------------------------------------------------------------- |
| **XiHan.Framework.Core**      | 框架核心模块，提供模块化基础设施、依赖注入、生命周期管理和基础服务接口 |
| **XiHan.Framework.Utils**     | 工具类库，提供各种常用工具方法和扩展功能                               |
| **XiHan.Framework.Threading** | 线程处理模块，提供异步操作、后台任务和线程同步等功能                   |

## 基础设施模块

| 模块名称                                       | 主要功能                                                     |
| ---------------------------------------------- | ------------------------------------------------------------ |
| **XiHan.Framework.VirtualFileSystem**          | 虚拟文件系统，提供统一的文件访问抽象，支持物理文件和嵌入资源 |
| **XiHan.Framework.Serialization**              | 序列化模块，提供对象序列化和反序列化功能                     |
| **XiHan.Framework.Settings**                   | 应用配置管理，提供统一的设置存储和获取机制                   |
| **XiHan.Framework.Localization**               | 本地化和国际化支持，提供多语言翻译和文化适配功能             |
| **XiHan.Framework.Caching**                    | 缓存抽象层，提供统一的缓存接口和内存缓存实现                 |
| **XiHan.Framework.Caching.StackExchangeRedis** | Redis 缓存实现，基于 StackExchange.Redis                     |
| **XiHan.Framework.BlobStoring**                | 二进制大对象存储，用于文件和大型数据的存储管理               |

## 领域驱动设计模块

| 模块名称                                      | 主要功能                                              |
| --------------------------------------------- | ----------------------------------------------------- |
| **XiHan.Framework.Ddd.Domain.Shared**         | 领域共享层，包含跨域对象和常量定义                    |
| **XiHan.Framework.Ddd.Domain**                | 领域层实现，提供实体、聚合根、领域服务等 DDD 概念支持 |
| **XiHan.Framework.Ddd.Application.Contracts** | 应用服务契约，定义 DTO 和服务接口                     |
| **XiHan.Framework.Ddd.Application**           | 应用服务实现，处理用户交互和业务流程编排              |
| **XiHan.Framework.EntityFrameworkCore**       | EntityFramework Core 集成，提供数据访问和 ORM 支持    |
| **XiHan.Framework.Uow**                       | 工作单元模式实现，管理事务和数据一致性                |

## Web 开发模块

| 模块名称                               | 主要功能                                             |
| -------------------------------------- | ---------------------------------------------------- |
| **XiHan.Framework.AspNetCore**         | ASP.NET Core 集成基础模块，提供 Web 应用开发基础设施 |
| **XiHan.Framework.AspNetCore.Mvc**     | MVC 框架集成，提供控制器、视图和模型绑定等功能       |
| **XiHan.Framework.AspNetCore.Swagger** | Swagger/OpenAPI 集成，提供 API 文档生成和测试        |
| **XiHan.Framework.AspNetCore.SignalR** | SignalR 集成，提供实时 Web 通信功能                  |
| **XiHan.Framework.AspNetCore.Serilog** | Serilog 日志集成，提供结构化日志记录                 |
| **XiHan.Framework.AspNetCore.Scalar**  | GraphQL 集成，支持 GraphQL API 开发                  |
| **XiHan.Framework.AspNetCore.Refit**   | Refit HTTP 客户端集成，简化 API 调用                 |

## 认证与安全模块

| 模块名称                                                    | 主要功能                                   |
| ----------------------------------------------------------- | ------------------------------------------ |
| **XiHan.Framework.Security**                                | 安全基础设施，提供权限管理和安全工具       |
| **XiHan.Framework.AspNetCore.Authentication.JwtBearer**     | JWT 认证实现，基于令牌的身份验证           |
| **XiHan.Framework.AspNetCore.Authentication.OAuth**         | OAuth 2.0 集成，支持第三方登录             |
| **XiHan.Framework.AspNetCore.Authentication.OpenIdConnect** | OpenID Connect 集成，提供单点登录支持      |
| **XiHan.Framework.MultiTenancy**                            | 多租户架构支持，提供 SaaS 应用开发基础设施 |

## 高级功能模块

| 模块名称                                  | 主要功能                                       |
| ----------------------------------------- | ---------------------------------------------- |
| **XiHan.Framework.EventBus**              | 事件总线，提供组件间松耦合的事件发布和订阅     |
| **XiHan.Framework.Gateway**               | API 网关，提供路由、负载均衡和 API 聚合功能    |
| **XiHan.Framework.TextTemplating**        | 文本模板引擎，用于动态生成文本内容如邮件和报告 |
| **XiHan.Framework.SearchEngines**         | 搜索引擎抽象，提供全文检索能力                 |
| **XiHan.Framework.Http**                  | HTTP 客户端抽象，简化 Web API 调用             |
| **XiHan.Framework.BackgroundWorkers**     | 后台工作者管理，用于执行周期性任务             |
| **XiHan.Framework.BackgroundJobs**        | 后台作业管理，用于执行异步长时间任务           |
| **XiHan.Framework.CodeGeneration**        | 代码生成工具，提高开发效率                     |
| **XiHan.Framework.ObjectMapping.Mapster** | 基于 Mapster 的对象映射实现                    |
| **XiHan.Framework.AI**                    | 人工智能集成，提供 AI 能力的访问接口           |
| **XiHan.Framework.Bot**                   | 聊天机器人功能，支持自动化对话交互             |

## 实时通信模块

| 模块名称                                        | 主要功能                                      |
| ----------------------------------------------- | --------------------------------------------- |
| **XiHan.Framework.AspNetCore.RealTime.SignalR** | 基于 SignalR 的实时通信实现，提供实时消息推送 |

## 日志模块

| 模块名称                                       | 主要功能                             |
| ---------------------------------------------- | ------------------------------------ |
| **XiHan.Framework.AspNetCore.Logging.Serilog** | Serilog 日志框架的 ASP.NET Core 集成 |

---

曦寒框架通过这些模块提供了全面的应用开发支持，从基础设施到领域驱动设计，从 Web 开发到高级功能，使开发人员能够快速构建企业级应用。各模块之间遵循依赖关系设计，可以根据实际需求选择性地使用。
