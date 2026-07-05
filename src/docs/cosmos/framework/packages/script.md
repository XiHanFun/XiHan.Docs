# XiHan.Framework.Script

> 脚本引擎：基于 Roslyn 动态编译并执行 C# 脚本，支持超时控制、编译缓存与安全校验。

- **NuGet**：`XiHan.Framework.Script`
- **模块类**：`XiHanScriptModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Script 让你在运行时把一段 C# 源码字符串直接编译成程序集并执行，得到强类型结果。底层用 Roslyn（`Microsoft.CodeAnalysis.CSharp`）在内存中编译，支持表达式求值、语句块、方法、类以及完整程序等多种脚本形态。它还内置了编译缓存、执行超时、安全校验与性能监控，适合做规则计算、动态公式、可配置逻辑这类"代码即配置"的场景。

> 说明：本包只支持 C#（Roslyn）。源码与依赖中没有 JavaScript / Python 引擎，请勿据此声称支持其它语言。

## 何时使用

- 需要在运行期执行用户或配置中提供的 C# 表达式/脚本（如动态规则、计算公式）。
- 想把可变的业务逻辑外置为脚本，改逻辑无需重新发布。
- 需要对脚本执行做超时、命名空间/类型黑名单等安全约束。
- 需要缓存已编译脚本、复用编译结果以提升重复执行性能。

## 安装

```bash
dotnet add package XiHan.Framework.Script
```

## 启用

```csharp
[DependsOn(typeof(XiHanScriptModule))]
public class MyModule : XiHanModule { }
```

也可不走模块，直接用静态入口 `XiHanScript` 或工厂 `ScriptEngineFactory` 使用（模块类当前不注册额外服务）。

## 核心能力

- **动态执行**：`ExecuteAsync` / `EvaluateAsync` 执行脚本或求值表达式，`ExecuteFileAsync` 执行脚本文件，支持强类型返回 `ScriptResult<T>`。
- **多种脚本形态**：`ScriptType` 支持 Expression / Statement / Method / Class / Program，引擎自动包装为可编译代码。
- **编译缓存**：按脚本内容与选项生成缓存键，命中则复用已编译程序集，附带命中率等统计。
- **超时控制**：`TimeoutMs` 通过 `CancellationTokenSource` 限制执行时长，超时抛 `ScriptTimeoutException`。
- **安全校验**：编译后对程序集做反射检查，拦截禁止的命名空间/类型、危险关键字与不安全代码；`SecurityOptions` 提供 `Strict` / `Permissive` / `Disabled` 预设。
- **构建与监控**：`ScriptEngineBuilder` 流式配置引用/导入/全局变量/超时；`ScriptMonitor`、`ScriptTemplateManager` 支持执行监控与脚本模板。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IScriptEngine` / `ScriptEngine` | 脚本引擎接口与基于 Roslyn 的实现 |
| `XiHanScript` | 静态门面，`RunAsync` / `EvalAsync` / `RunFileAsync` 快速执行 |
| `ScriptEngineFactory` | 引擎工厂，创建默认/命名引擎并管理生命周期与统计 |
| `ScriptEngineBuilder` | 流式构建器，配置引用、导入、全局变量、超时等 |
| `ScriptOptions` / `CompilerOptions` / `SecurityOptions` | 执行、编译与安全选项 |
| `ScriptResult` / `ScriptResult<T>` / `CompilationResult` | 执行结果与编译结果 |
| `ScriptMonitor` / `ScriptTemplateManager` | 执行监控与脚本模板管理 |

## 快速示例

```csharp
// 求值表达式
var sum = await XiHanScript.EvalAsync<int>("1 + 2 * 3"); // 7

// 执行语句块，返回强类型结果
var result = await XiHanScript.RunAsync<int>("result = 10 * 20;");
if (result.IsSuccess)
{
    Console.WriteLine(result.Value); // 200
}

// 用构建器定制引擎
var engine = XiHanScript.CreateBuilder()
    .AddImport("System.Math")
    .WithTimeout(5000)
    .Build();
```

## 依赖模块

- [XiHan.Framework.Core](./core) — 唯一的框架内部依赖，提供模块化与依赖注入基座。
- 第三方核心依赖：`Microsoft.CodeAnalysis.CSharp`（Roslyn），是动态编译能力的引擎所在。

## 相关模块

- [XiHan.Framework.Templating](./templating) — 模板渲染，与脚本模板可配合做动态内容生成。
- [XiHan.Framework.Tasks](./tasks) — 任务调度，常见于承载动态脚本化的后台逻辑。
