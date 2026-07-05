# XiHan.Framework.Serialization

> 序列化：System.Text.Json + Newtonsoft.Json 双引擎、动态 JSON 操作与序列化选项管理。

- **NuGet**：`XiHan.Framework.Serialization`
- **模块类**：`XiHanSerializationModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.Serialization 是框架的序列化辅助库。它在 .NET 内置的 System.Text.Json 之上，再引入 Newtonsoft.Json，提供一套"动态 JSON"操作类型（类似 Newtonsoft 的 JObject/JArray/JValue），让你可以在不定义强类型模型的情况下，直接解析、构建、查询、合并 JSON。

## 何时使用

- 需要处理结构不固定的 JSON（配置片段、第三方响应），不想为每种形状定义 DTO。
- 想用点分路径（如 `user.profile.name`）读写嵌套属性。
- 需要对两份 JSON 做深度合并、深度克隆或结构比较。
- 需要在运行时动态增删 `JsonConverter` 来组合 `JsonSerializerOptions`。

## 安装

```bash
dotnet add package XiHan.Framework.Serialization
```

## 启用

```csharp
[DependsOn(typeof(XiHanSerializationModule))]
public class MyModule : XiHanModule { }
```

模块类当前不注册额外服务，包内能力主要通过静态 Helper / Factory / 扩展方法直接调用。

## 核心能力

- **动态 JSON 类型**：`DynamicJsonObject` / `DynamicJsonArray` / `DynamicJsonValue` 对标 Newtonsoft 的 JObject/JArray/JValue，支持动态成员访问与索引。
- **解析与序列化**：字符串解析、对象转换、文件 I/O 与异步操作。
- **路径查询**：以点分路径读写（SelectToken/SetToken）嵌套属性。
- **结构化操作**：深度合并（DeepMerge）、深度克隆（DeepClone）、深度比较（DeepEquals）、扁平化。
- **构建器模式**：`DynamicJsonFactory` 提供 ObjectBuilder / ArrayBuilder 流式构建 JSON。
- **序列化选项管理**：`JsonSerializerOptionsHelper` 支持动态添加/移除 `JsonConverter` 组合 `JsonSerializerOptions`。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `DynamicJsonObject` | 动态 JSON 对象，类似 JObject，支持动态成员访问和索引 |
| `DynamicJsonArray` | 动态 JSON 数组，类似 JArray，实现 `IList<object?>` |
| `DynamicJsonValue` | 动态 JSON 值，类似 JValue，支持多种隐式/显式类型转换 |
| `DynamicJsonProperty` | 动态 JSON 属性（键值对），类似 JProperty |
| `DynamicJsonHelper` | 静态辅助：序列化、反序列化、路径查询、合并、扁平化 |
| `DynamicJsonFactory` | 静态工厂：多种创建方法与 ObjectBuilder / ArrayBuilder 构建器 |
| `DynamicJsonExtensions` | 为字符串、对象、`JsonNode`、集合等添加的快捷扩展方法 |
| `JsonSerializerOptionsHelper` | 灵活组合 `JsonSerializerOptions`（移除/添加 `JsonConverter`） |

## 依赖模块

- 内部依赖：仅 [XiHan.Framework.Core](./core)。
- 第三方核心：`Newtonsoft.Json`（NuGet 引用）与 .NET 内置的 `System.Text.Json`，二者共同构成本包的双引擎基础。

## 相关模块

- [XiHan.Framework.Utils](./utils) — 其 `Serialization` 目录提供 JSON/XML/YAML 的基础序列化封装。
