# XiHan.Framework.DevTools

> 开发工具：开发期辅助与调试能力。目前实际提供的是一套自包含的命令行（CommandLine）框架。

- **NuGet**：`XiHan.Framework.DevTools`
- **模块类**：`XiHanDevToolsModule`（当前为空骨架，见下文说明）
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.DevTools 定位为框架的开发工具库。就目前的源码而言，它落地的核心内容是 `CommandLine/` 目录下一套**从零实现、不依赖任何第三方 CLI 库**的命令行框架：把命令行参数解析、命令注册与分发、参数绑定、帮助生成和交互式模式封装成一组可直接使用的类型，方便你为工具程序、脚手架或调试小工具快速搭出一个规范的命令行入口。

> 说明：包内的 `XiHanDevToolsModule` 目前是一个空类（既未继承模块基类，也没有 `ConfigureServices`），属于占位骨架。因此本包当前更像一个直接引用即可的工具库，而非需要 `[DependsOn]` 挂载的功能模块。

## 何时使用

- 需要给一个控制台程序或工具快速加上命令、子命令、选项与参数解析，又不想引入外部 CLI 库。
- 想把命令行参数直接绑定到强类型对象（`Parse<T>`）上使用。
- 需要内置的 `--help` / `--version` 输出，或一个简单的交互式（REPL 式）命令行模式。

## 安装

```bash
dotnet add package XiHan.Framework.DevTools
```

## 启用

`XiHanDevToolsModule` 当前为空骨架，无需也无法通过它挂载功能。直接引用本包，使用 `CommandLine` 命名空间下的类型即可：

```csharp
using XiHan.Framework.DevTools.CommandLine;

var app = new CommandApp
{
    Description = "示例工具"
};
app.DiscoverCommands();          // 自动发现带 [Command] 特性的命令
return await app.RunAsync(args);
```

## 核心能力

- **命令应用宿主**（`CommandApp`）：注册命令（`AddCommand<T>()`）、按 `[Command]` 特性自动发现命令（`DiscoverCommands`）、`Run` / `RunAsync` 执行，内置 `--help` / `--version` 处理。
- **参数解析**（`CommandLineParser` / `CommandLineParserFactory`）：支持长选项（`--name`）、短选项（`-n`）、组合短选项（`-abc`，POSIX 风格）、键值对（`key=value` / `key:value`）与 `--` 停止解析标记。
- **强类型绑定**（`Parse<T>` / `CommandLineBinder`）：把解析结果绑定到属性/字段标注了选项特性的对象上，并提供 `TryParse` 容错版本。
- **命令定义**：通过 `ICommand` / `ISyncCommand` 接口实现命令逻辑，配合 `[Command]`、`[CommandOption]`、`[CommandArgument]`、`[SubCommand]` 等特性声明元数据，支持子命令。
- **参数校验**：内置 `[Range]`、`[FileExists]`、`[DirectoryExists]` 等校验特性及对应校验器。
- **帮助与交互**：`HelpGenerator` 自动生成帮助文本；`RunInteractiveAsync` 扩展方法提供交互式命令行模式。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `CommandApp` | 命令行应用宿主，负责注册、发现、解析与执行命令 |
| `CommandLineParser` / `CommandLineParserFactory` | 参数解析器（实例式 / 静态工厂式），产出 `ParsedArguments` 或强类型对象 |
| `CommandLineBinder` | 将解析结果绑定到强类型命令对象 |
| `ICommand` / `ISyncCommand` | 异步 / 同步命令接口，实现 `ExecuteAsync` / `Execute` |
| `CommandContext` / `CommandDescriptor` | 命令执行上下文与命令描述符 |
| `CommandAttribute` / `CommandOptionAttribute` / `CommandArgumentAttribute` / `SubCommandAttribute` | 声明命令、选项、位置参数与子命令的特性 |
| `ParseOptions` | 解析行为配置（大小写敏感、POSIX 风格、值分隔符、停止标记、帮助/版本选项等） |
| `HelpGenerator` / `InteractiveMode` | 帮助文本生成与交互式模式 |

## 快速示例

```csharp
using XiHan.Framework.DevTools.CommandLine;
using XiHan.Framework.DevTools.CommandLine.Attributes;
using XiHan.Framework.DevTools.CommandLine.Commands;

[Command("greet", Description = "打招呼命令")]
public class GreetCommand : ICommand
{
    [CommandOption("name", "n", Description = "名字")]
    public string Name { get; set; } = "World";

    public Task<int> ExecuteAsync(CommandContext context)
    {
        Console.WriteLine($"Hello, {Name}!");
        return Task.FromResult(0);
    }
}

// 入口
var app = new CommandApp();
app.AddCommand<GreetCommand>();
return await app.RunAsync(args);   // 例如: greet --name XiHan
```

## 依赖模块

- 仅依赖 [XiHan.Framework.Core](./core)（唯一的 `ProjectReference`），无任何第三方 `PackageReference`；命令行框架完全自研。
- 运行期还会用到 `XiHan.Framework.Utils` 的 `ConsoleTools`（着色输出），随 Core 依赖链间接引入。

## 相关模块

- [XiHan.Framework.Core](./core) — 核心库，本包的唯一直接依赖。
- [XiHan.Framework.Utils](./utils) — 通用工具库，其中 `ConsoleTools` 为本包提供控制台输出支持。
