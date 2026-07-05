# XiHan.Framework.ObjectMapping

> 对象映射：Mapster 集成，附带对象扩展属性（动态属性）管理体系。

- **NuGet**：`XiHan.Framework.ObjectMapping`
- **模块类**：`XiHanObjectMappingModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.ObjectMapping 负责把一个对象的数据映射到另一个对象（如实体 ↔ DTO）。它集成了高性能映射库 Mapster，把 `IMapper` 注册进依赖注入容器供全框架使用。除映射外，它还内置了一套"对象扩展属性"机制，允许在不改动类定义的前提下，为对象动态挂上额外属性、验证器与访问策略。

## 何时使用

- 需要在实体、DTO、视图模型之间做批量属性映射，又不想手写赋值代码。
- 想为已有类型动态追加属性（`ExtraProperties`）并参与序列化。
- 需要给动态扩展属性配置验证规则、UI/查找配置或功能/权限访问策略。

## 安装

```bash
dotnet add package XiHan.Framework.ObjectMapping
```

## 启用

```csharp
[DependsOn(typeof(XiHanObjectMappingModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanMapster()`，将 `MapsterMapper.IMapper` 的实现 `Mapper` 注册为 Transient。启用后即可注入 `IMapper` 使用。

## 核心能力

- **Mapster 集成**：注册 Mapster 的 `IMapper`，提供高性能对象映射引擎。
- **对象扩展管理**：`ObjectExtensionManager` 单例集中管理各类型的动态扩展属性、配置与验证规则。
- **动态属性存储**：`IHasExtraProperties` + `ExtraPropertyDictionary` 为对象提供可序列化的键值对额外属性存储。
- **扩展属性验证**：通过验证上下文对对象级、属性级扩展属性执行验证并收集错误。
- **访问策略检查**：`ExtensionPropertyPolicyChecker` 按全局功能、功能开关、权限三层策略校验扩展属性的可访问性。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ObjectExtensionManager` | 对象扩展管理器单例，管理所有类型的扩展信息与全局配置 |
| `ObjectExtensionInfo` | 为特定类型管理扩展属性、配置字典与对象级验证器 |
| `ObjectExtensionPropertyInfo` | 扩展属性信息，含 UI 配置、查找配置、策略配置 |
| `IHasExtraProperties` | 定义 `ExtraProperties` 字典属性，用于动态属性存储 |
| `ExtraPropertyDictionary` | 额外属性字典，继承 `Dictionary<string, object?>` |
| `ExtensionPropertyPolicyChecker` | 按全局功能/功能开关/权限检查扩展属性访问控制 |
| `ObjectExtensionValidationContext` | 对象级扩展验证上下文，聚合扩展信息与错误集合 |
| `ObjectExtensionPropertyValidationContext` | 属性级扩展验证上下文，含属性值、错误集合与服务提供者 |

## 依赖模块

- 内部依赖：[XiHan.Framework.Core](./core)、[XiHan.Framework.Localization.Abstractions](./localization-abstractions)、[XiHan.Framework.Validation.Abstractions](./validation-abstractions)。
- 第三方核心：`Mapster`（对象映射引擎）。

## 相关模块

- [XiHan.Framework.Validation.Abstractions](./validation-abstractions) — 扩展属性验证依赖其验证抽象。
- [XiHan.Framework.Localization.Abstractions](./localization-abstractions) — 扩展属性显示名等可本地化能力的抽象来源。
