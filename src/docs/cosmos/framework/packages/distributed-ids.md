# XiHan.Framework.DistributedIds

> 分布式 ID：Snowflake / NanoId / SequentialGuid / Sqids 多算法，统一接口、零第三方依赖自研实现。

- **NuGet**：`XiHan.Framework.DistributedIds`
- **模块类**：`XiHanDistributedIdsModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.DistributedIds 用于生成分布式环境下的唯一标识。它自研实现了 Snowflake（雪花，`long`）、NanoId（短字符串）、SequentialGuid（时间有序 `Guid`）三种 ID 生成器，以及 Sqids 短码编码方案，统一在 `IDistributedIdGenerator<TKey>` 接口下。所有算法均为框架自研，不引入任何第三方库。

## 何时使用

- 需要跨库、跨服务、无中心协调地生成不重复主键或业务编号。
- 高并发下想要有序、可从中提取时间戳/机器信息的 `long` 型 ID（Snowflake）。
- 想要 URL 安全、短小的字符串 ID（NanoId）。
- 需要数据库索引友好的时间有序 `Guid`（SequentialGuid）。
- 需要把整数编码成不可预测的短码对外展示（Sqids）。

## 安装

```bash
dotnet add package XiHan.Framework.DistributedIds
```

## 启用

```csharp
[DependsOn(typeof(XiHanDistributedIdsModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanDistributedIds(config)`，绑定各算法的 Options（配置节前缀 `XiHan:DistributedIds:*`），并注册默认生成器：`IDistributedIdGenerator<Guid>` → `SequentialGuidGenerator`，`IDistributedIdGenerator<long>` → `SnowflakeIdGenerator`。

## 核心能力

- **多算法**：Snowflake（`long`）、NanoId（字符串）、SequentialGuid（`Guid`），统一 `IDistributedIdGenerator<TKey>` 接口；另有 Sqids 短码编码。
- **零第三方依赖**：全部算法自研，便于版本控制与定制。
- **信息可提取**：Snowflake ID 可提取时间戳、工作机器 ID、序列号等元数据。
- **工厂预置场景**：`IdGeneratorFactory` 提供低/中/高并发、短 ID、前缀等多种预置构造方法。
- **同步/异步与批量**：接口提供 `NextId()` / `NextIdAsync()` 及批量生成方法。
- **数据库友好**：`SequentialGuidGenerator` 支持多种排序模式以优化索引。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IDistributedIdGenerator<TKey>` | 统一生成器接口，`TKey` 为 `long` 或 `Guid` |
| `IdGeneratorFactory` | 静态工厂，提供多种预置构造方法 |
| `SnowflakeIdGenerator` / `SnowflakeIdOptions` | 雪花生成器（`long`）及配置（机器 ID、数据中心、位长、纪元等） |
| `NanoIdGenerator` / `NanoIdOptions` | NanoId 生成器（字符串）及配置（字符集、长度等） |
| `SequentialGuidGenerator` / `SequentialGuidOptions` | 时间有序 `Guid` 生成器及配置（排序模式） |
| `SequentialGuidType` | GUID 排序模式枚举 |
| `SqidsEncoder<T>` / `SqidsExtensions` / `SqidsOptions` | Sqids 短码编码器、扩展方法与配置（编码方案，非 `IDistributedIdGenerator` 实现） |

## 快速示例

```csharp
// 依赖注入方式：注入默认注册的生成器
public class OrderService(
    IDistributedIdGenerator<long> longGenerator,
    IDistributedIdGenerator<Guid> guidGenerator)
{
    public long NewOrderNo() => longGenerator.NextId();   // Snowflake
    public Guid NewRowId() => guidGenerator.NextId();     // SequentialGuid
}
```

```csharp
// 工厂方式：按场景构造
var sf = IdGeneratorFactory.CreateSnowflakeIdGenerator_HighWorkload(workerId: 1);
long id = sf.NextId();
```

> 提示：Sqids 是编码方案而非 ID 生成器，通过 `SqidsEncoder<T>` / 扩展方法把整数编解码为短码，不实现 `IDistributedIdGenerator<TKey>`。

## 依赖模块

- 内部依赖：仅 [XiHan.Framework.Core](./core)，无第三方 NuGet 依赖（算法全部自研）。

## 相关模块

- [XiHan.Framework.Domain](./domain) — 实体主键常用分布式 ID 生成。
- [XiHan.Framework.Data](./data) — 数据层可结合有序 `Guid` / Snowflake 优化主键。
