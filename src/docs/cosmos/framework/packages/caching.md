# XiHan.Framework.Caching

> 混合缓存：HybridCache（内存 + Redis）、缓存拦截器、租户感知

- **NuGet**：`XiHan.Framework.Caching`
- **模块类**：`XiHanCachingModule`
- **所在层**：基础设施层

## 这是什么

这个包提供框架统一的缓存能力，基于 .NET 的 `HybridCache` 把本地内存与分布式 Redis 组合成两级缓存：本地命中最快，未命中回落 Redis，二者一致失效。它还提供泛型缓存接口、AOP 缓存拦截器与租户感知的缓存键，让你用一致方式在多租户环境下安全缓存。

## 何时使用

- 需要"内存 + Redis"两级缓存，降低热点数据的 Redis 往返
- 想用特性（`[Cacheable]` / `[CacheEvict]`）声明式地缓存方法结果、失效缓存
- 多租户下需要缓存自动按租户隔离，避免跨租户串数据
- 需要 Redis 分布式锁、延迟队列或 Stream 消息队列等基于 Redis 的能力

## 安装

```bash
dotnet add package XiHan.Framework.Caching
```

## 启用

```csharp
[DependsOn(typeof(XiHanCachingModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里调用 `AddXiHanCaching`，注册内存缓存、`HybridCache`、分布式缓存与缓存拦截器；检测到 Redis 配置后自动切换为 Redis 实现。

## 核心能力

- **两级混合缓存**：注册 .NET `HybridCache`，封装为泛型 `IHybridCache<TCacheItem>` / `IHybridCache<TCacheItem,TCacheKey>`
- **分布式缓存抽象**：`IDistributedCache<TCacheItem>` 泛型封装，JSON 序列化，未配置 Redis 时回落内存分布式缓存
- **Redis 接入**：配置启用后替换为 `XiHanRedisCache`，并暴露 `IConnectionMultiplexer`、`IDistributedLock`、`IRedisDelayQueue<>`、`IRedisStreamQueue<>`
- **租户感知缓存键**：`DefaultDistributedCacheKeyNormalizer` 把当前 `TenantId` 作为键前缀（无租户时用 `0`），实现天然隔离
- **AOP 声明式缓存**：`[Cacheable]` 缓存方法结果、`[CacheEvict]` 执行后清除缓存，键模板支持 `{paramName}` 占位符
- **工作单元感知**：缓存操作可考虑当前工作单元（`considerUow`）

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IHybridCache<TCacheItem>` | 混合缓存（内存 + 分布式）泛型接口 |
| `IDistributedCache<TCacheItem>` | 分布式缓存泛型接口 |
| `IDistributedLock` | 分布式锁（默认进程内，Redis 启用后跨实例） |
| `IRedisDelayQueue<T>` / `IRedisStreamQueue<T>` | Redis 延迟队列 / Stream 消息队列 |
| `CacheableAttribute` / `CacheEvictAttribute` | AOP 缓存 / 失效特性 |
| `IDistributedCacheKeyNormalizer` | 缓存键规范化（租户感知） |
| `XiHanRedisCacheOptions` | Redis 配置选项（配置节 `XiHan:Caching:Redis`） |

## 快速示例

注入泛型混合缓存，获取或创建缓存项：

```csharp
public class ProfileService
{
    private readonly IHybridCache<UserProfile> _cache;

    public ProfileService(IHybridCache<UserProfile> cache)
    {
        _cache = cache;
    }

    public Task<UserProfile?> GetProfileAsync(string userId)
    {
        // 命中即返回；未命中执行工厂并写入两级缓存（键已按当前租户隔离）
        return _cache.GetOrCreateAsync(
            userId,
            async token => await LoadFromDbAsync(userId));
    }
}
```

启用 Redis（未配置时自动退回内存两级缓存）：

```json
{
  "XiHan": {
    "Caching": {
      "Redis": {
        "IsEnabled": true,
        "Configuration": "127.0.0.1:6379,defaultDatabase=0",
        "InstanceName": "xihan:"
      }
    }
  }
}
```

## 依赖模块

- [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions)（租户感知缓存键）
- [XiHan.Framework.Serialization](./serialization)
- [XiHan.Framework.Threading](./threading)
- [XiHan.Framework.Uow](./uow)（工作单元感知）
- 第三方核心：**Microsoft.Extensions.Caching.Hybrid**（两级缓存）+ **Microsoft.Extensions.Caching.StackExchangeRedis**（Redis）

## 相关模块

- [XiHan.Framework.Uow](./uow)
- [XiHan.Framework.Data](./data)
- [XiHan.Framework.MultiTenancy.Abstractions](./multitenancy-abstractions)
