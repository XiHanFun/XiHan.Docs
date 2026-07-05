# XiHan.Framework.Localization

> 国际化：JSON 资源文件加载、动态文化切换、枚举本地化的具体实现。

- **NuGet**：`XiHan.Framework.Localization`
- **模块类**：`XiHanLocalizationModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Localization 是国际化抽象层的具体实现。它以 JSON 资源文件为主、ResourceManager（.resx）为回退，加载多语言文本；通过请求中间件按请求头动态切换当前文化；并提供枚举字段级的本地化服务。资源经由虚拟文件系统加载，支持物理路径与嵌入式资源。

## 何时使用

- 应用需要多语言支持，用 JSON 文件维护各语言文案。
- 需要按请求头（默认 `X-Language`）或 `Accept-Language` 动态切换语言，并支持父文化/默认文化回退。
- 需要把枚举值本地化为带标签、描述等元数据的展示项。

## 安装

```bash
dotnet add package XiHan.Framework.Localization
```

## 启用

```csharp
[DependsOn(typeof(XiHanLocalizationModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanLocalization(config)`，从配置节 `XiHan:Localization` 绑定 `XiHanLocalizationOptions`，并注册 JSON 优先的 `IStringLocalizerFactory` 与枚举本地化服务。文化切换由请求中间件在运行时完成。

## 核心能力

- **JSON 资源加载**：基于虚拟文件系统动态加载 JSON 资源，从路径或元数据解析资源名与文化码，支持磁盘与嵌入式资源。
- **JSON 优先、ResourceManager 回退**：`XiHanStringLocalizerFactory` 优先查 JSON，miss 时回退 .resx；无 backing 程序集时用 `NullStringLocalizer` 兜底避免崩溃。
- **动态文化切换**：`XiHanRequestCultureMiddleware` 按请求头 → `Accept-Language` → 默认文化解析并设置当前文化，支持父文化与默认文化回退。
- **枚举本地化**：`EnumLocalizationService` 按类型查询枚举，返回含 Label、Description 等元数据的 `LocalizedEnumDefinition`。
- **动态资源重载**：监听虚拟文件系统变化自动重载资源，可通过 `EnableDynamicJsonReload` 开关。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanLocalizationModule` | 模块入口类 |
| `XiHanStringLocalizerFactory` | `IStringLocalizerFactory` 实现（JSON 优先） |
| `XiHanJsonStringLocalizer` | `IStringLocalizer` 实现（JSON + 回退） |
| `JsonLocalizationResourceStore` | JSON 资源存储与加载器 |
| `EnumLocalizationService` | `IEnumLocalizationService` 实现 |
| `XiHanRequestCultureMiddleware` | 请求文化解析中间件 |
| `XiHanLocalizationOptions` | 本地化配置选项（配置节 `XiHan:Localization`） |

## 快速示例

```csharp
// 通过依赖注入使用标准本地化接口
public class MyService(IStringLocalizer<MyService> localizer)
{
    public string Hello() => localizer["HelloWorld"];
}
```

## 依赖模块

- 内部依赖：[XiHan.Framework.Localization.Abstractions](./localization-abstractions)（抽象契约）、[XiHan.Framework.VirtualFileSystem](./virtual-file-system)（资源加载）、[XiHan.Framework.Threading](./threading)、[XiHan.Framework.Settings](./settings)、[XiHan.Framework.Utils](./utils)。
- 第三方核心：`Microsoft.Extensions.Localization`（复用标准本地化基础设施）。

## 相关模块

- [XiHan.Framework.Localization.Abstractions](./localization-abstractions) — 本包实现的接口契约层。
- [XiHan.Framework.VirtualFileSystem](./virtual-file-system) — 提供资源文件的统一加载。
