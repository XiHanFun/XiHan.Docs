# XiHan.Framework.Templating

> 模板渲染：内置 Scriban 引擎与轻量字符串替换引擎，通过引擎注册表按名称统一管理。

- **NuGet**：`XiHan.Framework.Templating`
- **模块类**：`XiHanTemplatingModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Templating 提供模板渲染能力，并把多种模板引擎统一到一个注册表 `ITemplateEngineRegistry` 下按名称管理。框架内置两种引擎：功能完整的 **Scriban** 引擎（注册名 `"Scriban"`）和一个轻量的**字符串替换**引擎（注册名 `"String"`）。适合代码生成、通知/邮件文案、报表等需要「模板 + 数据 = 文本」的场景。

## 何时使用

- 需要把数据填进模板生成文本（代码文件、邮件正文、通知内容等）。
- 需要在同一套 API 下切换/共存多种模板引擎。
- 需要模板缓存、语法校验、从文件渲染等配套能力。

## 安装

```bash
dotnet add package XiHan.Framework.Templating
```

## 启用

```csharp
[DependsOn(typeof(XiHanTemplatingModule))]
public class MyModule : XiHanModule { }
```

模块在 `OnApplicationInitialization` 时把 Scriban 引擎与 String 引擎注册进 `ITemplateEngineRegistry`，并分别设为对应模板类型的默认引擎。

## 核心能力

- **引擎注册表**：`ITemplateEngineRegistry` 按名称注册、获取引擎，并可设置某模板类型的默认引擎。
- **两种内置引擎**：Scriban 引擎（`ITemplateEngine<Template>`，注册名 `"Scriban"`）与字符串替换引擎（`ITemplateEngine<string>`，注册名 `"String"`）。
- **模板服务**：`ITemplateService` 提供 `RenderAsync` / `RenderFileAsync` / `ValidateTemplate` 等入口，屏蔽底层引擎细节。
- **配套能力**：模板缓存、语法校验（`TemplateValidationResult`）、从文件渲染、渲染结果落盘等。
- **可配置**：`TemplatingOptions` 支持默认引擎、缓存开关与过期、渲染超时、模板大小上限、模板/布局/片段目录等。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ITemplateEngineRegistry` / `TemplateEngineRegistry` | 模板引擎注册表 |
| `ITemplateEngine<T>` | 模板引擎接口（`Parse` / `Render` / `RenderAsync` / `Validate`） |
| `ScribanTemplateEngine` | 基于 Scriban 的引擎实现（`ITemplateEngine<Template>`） |
| `DefaultTemplateEngine` | 轻量字符串替换引擎（`ITemplateEngine<string>`） |
| `ITemplateService` / `TemplateService` | 面向业务的模板服务门面 |
| `TemplatingOptions` | 模板行为配置 |

## 重要澄清：ITemplateService 默认走的不是 Scriban

`ITemplateService.RenderAsync(templateSource, ...)` 内部取的是 **`string` 模板类型的默认引擎**，即注册名 `"String"` 的 `DefaultTemplateEngine`。它是一个**简单替换引擎**：只支持形如 <code v-pre>{{变量}}</code> 的占位替换，以及自定义的 <code v-pre>{{if ...}}...{{endif}}</code>、<code v-pre>{{for x in list}}...{{endfor}}</code> 语法，**并不解析 Scriban 语法**（Scriban 的过滤器、函数、复杂表达式等在这里无效）。

因此，如果你要用真正的 Scriban 模板（<code v-pre>{{ name | string.upcase }}</code> 之类），不要依赖 `ITemplateService` 的字符串重载，应改用 Scriban 引擎路径：

```csharp
// 真正跑 Scriban：用原生 Scriban API
var template = Scriban.Template.Parse("Hello {{ name | string.upcase }}!");
var result = template.Render(new { name = "xihan" });
```

也可从注册表按名取出 Scriban 引擎：`registry.GetEngine<Template>("Scriban")`。切勿误以为把 Scriban 语法丢给 `ITemplateService` 就会被 Scriban 解析。

## 依赖模块

- [XiHan.Framework.Core](./core) — 模块化与依赖注入基础。
- [XiHan.Framework.Serialization](./serialization) — 序列化支持（模块通过 `[DependsOn]` 依赖）。
- [XiHan.Framework.Utils](./utils) — 通用工具库。

第三方核心依赖：`Scriban`（模板引擎）。

## 相关模块

- [XiHan.Framework.VirtualFileSystem](./virtual-file-system) — 需要从虚拟路径加载模板资源时可配合使用。
