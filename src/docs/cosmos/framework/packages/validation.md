# XiHan.Framework.Validation

> 数据校验：校验能力的集成模块（当前为薄占位）

- **NuGet**：`XiHan.Framework.Validation`
- **模块类**：`XiHanValidationModule`
- **所在层**：应用层

## 这是什么

这个包是数据校验能力的**实现/集成入口**，通过 `XiHanValidationModule` 把校验体系接入框架的模块化生命周期。它依赖 [XiHan.Framework.Validation.Abstractions](./validation-abstractions) 提供的验证错误契约与统一验证异常。

> 现状说明：截至当前源码，本包仅含模块类 `XiHanValidationModule`，`ConfigureServices` 未注册额外服务，实质内容主要来自抽象包。校验的核心类型（`IHasValidationErrors`、`XiHanValidationException`）定义在 [Validation.Abstractions](./validation-abstractions)。若你只需要抛出/识别验证异常，直接使用抽象包即可。

## 何时使用

- 你希望以模块方式声明"启用校验能力"，通过 `[DependsOn(typeof(XiHanValidationModule))]` 一并引入抽象契约
- 你在为校验体系预留集成点（后续实现挂载于此模块）

## 安装

```bash
dotnet add package XiHan.Framework.Validation
```

## 启用

```csharp
[DependsOn(typeof(XiHanValidationModule))]
public class MyModule : XiHanModule { }
```

模块通过 `[DependsOn(typeof(XiHanValidationAbstractionsModule))]` 引入校验抽象。

## 核心能力

- **模块化集成入口**：`XiHanValidationModule` 将校验体系接入框架模块生命周期，并传递依赖 [Validation.Abstractions](./validation-abstractions)
- 校验的错误契约与统一异常类型由抽象包提供（见相关模块）

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Validation.Abstractions](./validation-abstractions)（验证错误契约与 `XiHanValidationException`）

## 相关模块

- [XiHan.Framework.Validation.Abstractions](./validation-abstractions)
