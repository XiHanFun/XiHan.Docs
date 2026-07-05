# XiHan.Framework.Metadata

> 框架元数据：名称、版本、作者、组织、支持平台等静态信息。

- **NuGet**：`XiHan.Framework.Metadata`
- **模块类**：—（无模块类，直接引用）
- **所在层**：元数据层

## 这是什么

XiHan.Framework.Metadata 集中维护整个框架的"身份信息"——名称、显示名、版本、作者、组织、仓库/文档地址、许可证、支持的 .NET 版本与平台等。所有这些都以静态成员形式暴露在一个 `XiHanMetadata` 静态类里，任何模块都能读取到统一的框架元信息。

## 何时使用

- 日志、诊断、启动横幅需要打印统一的框架名称与版本。
- 关于页/健康检查/API 元信息需要展示作者、组织、仓库地址等。
- 想在运行时读取入口程序集名称与版本。

## 安装

```bash
dotnet add package XiHan.Framework.Metadata
```

## 启用

纯常量/元数据库，直接引用即可，无需 `[DependsOn]`。读取 `XiHanMetadata` 上的静态成员即可。

## 核心能力

- 统一维护框架名称、显示名、版权、作者、组织、仓库/文档地址、许可证。
- 提供框架版本信息（`Version` / `FullVersion` / `MajorVersion` / `MinorVersion` / `PatchVersion`）。
- 暴露关键词、支持的 .NET 版本（`SupportedFrameworks`）与支持平台（`SupportedPlatforms`）。
- 读取运行时入口程序集名称与版本（`EntryAssemblyName` / `EntryAssemblyVersion`）。
- 内置 ASCII Logo，并可一键输出信息摘要（`GetSummary()`）与详细信息（`GetDetails()`）。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanMetadata` | 静态元数据类，集中所有框架身份信息与摘要方法 |

## 快速示例

```csharp
// 获取框架信息摘要（含名称、版本、入口程序集）
var summary = XiHanMetadata.GetSummary();
```

## 依赖模块

无框架内部依赖，仅依赖 BCL（通过 `System.Reflection` 读取程序集信息）。

## 相关模块

- [XiHan.Framework.Core](./core) — 核心库，依赖 Metadata 提供框架元信息。
- [XiHan.Framework.Utils](./utils) — 通用工具库，同为最底层基础包。
