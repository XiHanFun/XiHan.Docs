# XiHan.Framework.Web.Docs

> API 文档：在动态 API 之上提供 Scalar 与 Swagger UI 两套交互式文档界面，并按 `[DynamicApi]` 分组自动生成多份 OpenAPI 文档。

- **NuGet**：`XiHan.Framework.Web.Docs`
- **模块类**：`XiHanWebDocsModule`
- **所在层**：Web 层

## 这是什么

XiHan.Framework.Web.Docs 让你的 API 可视化、可试调。它基于 [Web.Api](./web-api) 生成的 OpenAPI 文档，接入两套 UI：现代化的 **Scalar** 与经典的 **Swagger UI**，并根据动态 API 上的 `[DynamicApi]` 分组信息，为不同分组注册独立的 OpenAPI 文档（例如把系统接口与业务接口分开展示）。引用它、加上 `[DependsOn]`，启动后浏览器即可打开文档页面。

## 何时使用

- 想要一个交互式 API 文档界面，直接在浏览器里查看接口、参数并发起试调。
- 项目按 `[DynamicApi]` 分了组，希望文档也按组切换展示。
- 需要在 OpenAPI 中带上 XML 注释（接口/参数说明）。

## 安装

```bash
dotnet add package XiHan.Framework.Web.Docs
```

## 启用

```csharp
[DependsOn(typeof(XiHanWebDocsModule))]
public class MyModule : XiHanModule { }
```

## 核心能力

- **Scalar 文档界面**：`OnApplicationInitialization` 中 `MapScalarApiReference(...)` 注册 Scalar，紫色主题、默认 C# `HttpClient` 示例，读取 `/openapi/{documentName}.json`，允许匿名访问。BasicApp 中访问路径为 `/scalar`。
- **Swagger UI 文档界面**：`OnPreApplicationInitialization` 中 `UseSwaggerUI(...)`（早于认证/授权中间件），逐个注册各分组的 SwaggerEndpoint。
- **动态 API 分组发现**：`DynamicApiSwaggerGroupHelper` 从 `[DynamicApi]` 特性收集分组定义，为默认文档与每个额外分组各注册一份 OpenAPI 文档。
- **XML 注释增强**：`AddOpenApi` 注册 `DynamicApiXmlCommentsOperationTransformer`，把 XML 文档注释注入 OpenAPI 操作。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanWebDocsModule` | 模块类，注册文档服务并挂载 Scalar / Swagger UI |
| `DynamicApiSwaggerGroupHelper` | 从 `[DynamicApi]` 特性发现分组、默认文档名/标题 |
| `DynamicApiXmlCommentsOperationTransformer` | 将 XML 注释注入 OpenAPI 操作的转换器 |

## 依赖模块

- 内部依赖：[XiHan.Framework.Web.Api](./web-api)（动态 API 与 OpenAPI 文档的来源）。
- 第三方核心：`Scalar.AspNetCore`（Scalar 文档界面）与 `Swashbuckle.AspNetCore`（Swagger UI）。

## 相关模块

- [XiHan.Framework.Web.Api](./web-api) — 生成本包所展示的 OpenAPI 文档与动态 API 分组。
- [动态 API](../concepts/dynamic-api) — 动态 API 与 `[DynamicApi]` 分组约定。
