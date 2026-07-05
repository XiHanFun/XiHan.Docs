# XiHan.Framework.Analyzers

> Roslyn 代码分析器：编译期规范检查。

- **NuGet**：`XiHan.Framework.Analyzers`
- **模块类**：—（作为 Analyzer 引用，编译期生效，无运行时模块类）
- **所在层**：工具/分析器

## 这是什么

XiHan.Framework.Analyzers 是一个基于 Roslyn 的代码分析器（`DiagnosticAnalyzer`），在**编译期**检查源码是否符合框架规范，并在 IDE 中提供 Code Fix 一键修复。它以 `netstandard2.0` 构建、作为 analyzer 打包（`analyzers/dotnet/cs`），是开发期依赖（`DevelopmentDependency`），不进入运行时。

## 何时使用

- 想在编译/编码阶段自动强制项目的代码规范，把问题拦在 CI 之前。
- 希望 IDE 直接给出诊断提示并提供自动修复。
- 统一团队协作下所有文件的规范一致性。

## 安装

```bash
dotnet add package XiHan.Framework.Analyzers
```

也可在开发期通过项目引用接入（`OutputItemType="Analyzer"`、`ReferenceOutputAssembly="false"`、`PrivateAssets="all"`）。

## 启用

分析器包，引用后在编译期自动生效，无需 `[DependsOn]` 或任何运行时接入。

## 核心能力

- 编译期扫描 C# 源码并产出诊断，IDE 中同步提示。
- 随附 `CodeFixProvider`，可一键自动修复不符合规范的文件。
- 诊断级别可在 `.editorconfig` 中按 `dotnet_diagnostic.<ID>.severity` 逐条调整（`warning` / `error` / `none`），支持按目录覆盖（如排除 `Migrations`）。

## 规则

| 规则 ID | 说明 |
| --- | --- |
| `XHFH001` | 文件缺少或未正确声明曦寒标准版权文件头 |

## 快速示例

在 `.editorconfig` 中控制诊断级别（改为 `error` 可让编译失败）：

```ini
[*.cs]
dotnet_diagnostic.XHFH001.severity = warning
```

## 依赖模块

无框架内部依赖。开发期依赖 `Microsoft.CodeAnalysis.Analyzers`、`Microsoft.CodeAnalysis.CSharp.Workspaces`、`System.Composition.AttributedModel`（均 `PrivateAssets="all"`，不外泄给消费方）。

## 相关模块

- [XiHan.Framework.Utils](./utils) — 在编译期引用本分析器做文件头规范检查。
- [XiHan.Framework.Core](./core) — 框架核心库。
