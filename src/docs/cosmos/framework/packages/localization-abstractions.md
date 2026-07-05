# XiHan.Framework.Localization.Abstractions

> 国际化抽象：可本地化字符串与枚举本地化的接口契约层。

- **NuGet**：`XiHan.Framework.Localization.Abstractions`
- **模块类**：`XiHanLocalizationAbstractionsModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Localization.Abstractions 是国际化能力的抽象层。它只定义接口和数据模型（如"可本地化字符串""枚举本地化服务"），不含具体的资源加载与文化解析逻辑。真正的实现由 [XiHan.Framework.Localization](./localization) 提供。上层模块（如对象映射）依赖这个薄抽象包即可，无需牵连完整实现。

## 何时使用

- 你的模块只需要引用本地化的接口契约，而不想直接依赖具体实现。
- 需要以"可本地化字符串"（`ILocalizableString`）形式表达一个可能带多语言的文本。
- 需要枚举字段级本地化的查询契约（`IEnumLocalizationService`）。

## 安装

```bash
dotnet add package XiHan.Framework.Localization.Abstractions
```

## 启用

```csharp
[DependsOn(typeof(XiHanLocalizationAbstractionsModule))]
public class MyModule : XiHanModule { }
```

模块类为纯抽象声明入口，不注册具体服务。实际使用时需引入实现包 [XiHan.Framework.Localization](./localization)。

## 核心能力

- **可本地化字符串抽象**：`ILocalizableString` 定义多语言字符串化契约。
- **两种本地化字符串实现**：`ResourceLocalizableString`（按资源解析）与 `FixedLocalizableString`（固定文本，直接返回原值）。
- **名称与显示名分离**：`IHasNameWithLocalizableDisplayName` 约定标识名与可本地化显示名分离。
- **枚举本地化服务契约**：`IEnumLocalizationService` 定义枚举字段级本地化查询（支持单次、批量、容错）。
- **回退扩展**：`LocalizableStringExtensions` 提供缺失资源时的降级取值。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ILocalizableString` | 可本地化字符串契约 |
| `ResourceLocalizableString` | 按资源类型/名称解析的本地化字符串实现 |
| `FixedLocalizableString` | 固定文本实现，直接返回原值 |
| `IHasNameWithLocalizableDisplayName` | 标识名与可本地化显示名分离的契约 |
| `LocalizableStringExtensions` | 本地化取值/回退扩展方法 |
| `IEnumLocalizationService` | 枚举本地化服务契约 |
| `EnumLocalizationQuery` | 枚举本地化查询参数 |
| `LocalizedEnumItem` / `LocalizedEnumDefinition` | 枚举项 / 枚举整体的本地化描述 |

## 依赖模块

- 内部依赖：仅 [XiHan.Framework.Core](./core)。
- 第三方核心：`Microsoft.Extensions.Localization.Abstractions`（复用其 `IStringLocalizerFactory`、`LocalizedString` 等标准抽象）。

## 相关模块

- [XiHan.Framework.Localization](./localization) — 本抽象层的具体实现包（资源加载、文化切换、枚举本地化服务）。
