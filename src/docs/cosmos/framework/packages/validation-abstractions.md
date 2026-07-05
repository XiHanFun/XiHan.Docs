# XiHan.Framework.Validation.Abstractions

> 校验抽象：验证错误契约与统一的验证异常类型

- **NuGet**：`XiHan.Framework.Validation.Abstractions`
- **模块类**：`XiHanValidationAbstractionsModule`
- **所在层**：应用层

## 这是什么

这个包是数据校验能力的**抽象层**，体量很薄。它只定义"如何表达验证错误"和"验证失败时抛什么异常"两件事：一个携带 `ValidationResult` 列表的接口，以及一个可自记日志、带日志级别的验证异常类型。上层与实现包 [XiHan.Framework.Validation](./validation) 依赖这些契约做倒置，从而在框架各处以统一方式表示"数据校验失败"。

## 何时使用

- 你想以框架统一的方式抛出"数据校验失败"异常（`XiHanValidationException`）
- 你想让某个类型对外暴露一组验证错误（实现 `IHasValidationErrors`）
- 你在做全局异常处理，需要识别验证类异常并读取其错误明细

## 安装

```bash
dotnet add package XiHan.Framework.Validation.Abstractions
```

## 启用

```csharp
[DependsOn(typeof(XiHanValidationAbstractionsModule))]
public class MyModule : XiHanModule { }
```

模块类目前不注册额外服务；通常无需直接引用本包，引用实现包 [XiHan.Framework.Validation](./validation) 时会自动带上。

## 核心能力

- **验证错误契约**：`IHasValidationErrors` 暴露 `IList<ValidationResult> ValidationErrors`，基于 BCL 的 `System.ComponentModel.DataAnnotations`
- **统一验证异常**：`XiHanValidationException` 继承框架 `XiHanException`，实现 `IHasValidationErrors`、`IHasLogLevel`（默认 `Warning`）与 `IExceptionWithSelfLogging`，可用一组 `ValidationResult` 构造并自行把错误明细写入日志

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IHasValidationErrors` | 暴露验证错误列表 `IList<ValidationResult>` 的契约 |
| `XiHanValidationException` | 统一的验证失败异常，携带错误明细、带日志级别、可自记日志 |

## 快速示例

在校验失败时抛出统一异常：

```csharp
var errors = new List<ValidationResult>
{
    new("名称不能为空", new[] { nameof(Product.Name) })
};

throw new XiHanValidationException("数据校验失败", errors);
```

## 依赖模块

- [XiHan.Framework.Core](./core)（`XiHanException` 基类、日志与异常抽象）
- 仅依赖 Core 与 BCL，不引入第三方依赖。

## 相关模块

- [XiHan.Framework.Validation](./validation)（本抽象的实现包）
