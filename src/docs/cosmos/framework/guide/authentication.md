# 11. 认证与授权

框架把「你是谁」（认证）与「你能做什么」（授权）拆成两个包，在中间件管道里也是两段。本章讲两者怎么配、扩展点在哪。

完整 API 见 [Authentication](../packages/authentication) 与 [Authorization](../packages/authorization)。

## 在管道里的位置

```text
… → UseAuthentication → 租户解析 → 会话闸门 → UseAuthorization → 端点
      ↑ 你是谁              ↑ 哪个租户   ↑ 会话有效吗  ↑ 你能做什么
```

顺序不是随意的：租户解析要读令牌里的租户 claim，所以在认证之后；授权判定要在租户上下文里进行，所以在租户解析之后。

## 认证

### JWT

配置节 `XiHan:Authentication:Jwt`：

| 键 | 默认 | 说明 |
| --- | --- | --- |
| `SecretKey` | — | **生产务必改为高强度随机值并保密**（走环境变量/密钥库） |
| `Issuer` / `Audience` | — | 签发者 / 受众 |
| `AccessTokenExpirationMinutes` | `60` | 访问令牌有效期 |
| `RefreshTokenExpirationDays` | `7` | 刷新令牌有效期 |
| `ClockSkewMinutes` | `5` | 时钟偏差容忍，多节点部署需要 |

签发用 `IJwtTokenService`，返回 Access Token（JWT）+ Refresh Token（不透明随机串）。

::: tip 别把权限码冻结进令牌
把权限清单写进 JWT 会带来两个问题：授予/回收后要等令牌过期才生效；权限清单随令牌泄露。

推荐做法是**只放身份信息**（用户、会话、租户、角色），权限由服务端**实时判定**（可以走缓存快照）。
:::

### 密码哈希

配置节 `XiHan:Authentication:PasswordHasher`，算法是 **PBKDF2**：

| 键 | 默认 |
| --- | --- |
| `Iterations` | `600000`（OWASP 对 PBKDF2-SHA256 的推荐量级） |
| `SaltSize` / `HashSize` | `32` / `32` 字节 |
| `HashAlgorithm` | `SHA256` |
| `Version` | `1`，用于将来平滑升级算法（老密码按旧版本校验） |

存储格式是自描述串 `version:iterations:algorithm:base64(salt):base64(hash)`，校验用定长比较（抗时序攻击），参数变更时 `NeedsRehash` 支持透明升级。

### 第三方 OAuth 登录

配置节 `XiHan:Authentication:OAuth`，内建 GitHub / Gitee / Google / QQ，可扩展。

### TOTP

遵循 RFC 6238：HMAC-SHA1、Base32 密钥、6 位、30 秒步长、±1 窗口容差。provisioning URI 形如 `otpauth://totp/{issuer}:{account}?secret=...&period=30&digits=6`。

## 授权

### 权限码

推荐格式 `module:resource:action`（如 `saas:user:read`）。超级管理员用**字面通配 `*`** 作快路径。

```csharp
[PermissionAuthorize("billing:invoice:create")]
public async Task<InvoiceDto> CreateAsync(InvoiceCreateDto input) { … }
```

::: tip 权限码要有单一事实源
把权限码定义成常量集中在一个类里，代码里一律引用常量。内联字符串会导致改名时漏改，而且拼错不会编译报错——只会在运行时静默鉴权失败。
:::

### `IPermissionChecker`：最重要的扩展点

框架用 `TryAdd` 注册了一个默认实现，业务侧几乎总要替换它：

```csharp
services.Replace(ServiceDescriptor.Scoped<IPermissionChecker, DbPermissionChecker>());
```

::: danger 必须用 `Replace`
框架先注册了默认实现，你再 `TryAdd` 会被**静默忽略**——鉴权仍走默认实现，且没有任何报错。
:::

典型的业务实现会读 Redis 里的**授权快照**：预先算好「这个用户有哪些权限码」并缓存，请求期只做一次集合查找。这样授权变更只需失效快照，**用户无需重新登录**。

### 会话闸门

`XiHanSessionStateMiddleware` 位于认证之后、授权之前，判定逻辑委托给 `ISessionStateGate`（框架默认实现一律放行）。业务侧 `Replace` 后可以产出两种结果：

| 结果 | 语义 | 客户端该怎么做 |
| --- | --- | --- |
| `401` | 会话已失效（登出/被踢/撤销/过期） | 尝试刷新令牌，失败则跳登录页 |
| **`423`** | **会话被锁定，身份仍有效** | **引导解锁，不是跳登录页** |

框架不假设锁定的原因——锁屏、风控挂起、强制改密、二次验证未完成都可能，由应用侧定义。

## 常见问题

| 现象 | 原因 |
| --- | --- |
| `IPermissionChecker` 换了没生效 | 用了 `TryAdd`，要用 `Replace` |
| 授权改了要重新登录才生效 | 权限码被冻结进了令牌；改成服务端实时判定 |
| 收到 423 却跳了登录页 | 客户端把 423 当成 401 处理了 |
| 多节点部署偶发令牌校验失败 | 时钟偏差；调大 `ClockSkewMinutes` 或校时 |
| 匿名端点里拿不到用户 | 匿名端点不经过认证中间件，`ICurrentUser` 是空的 |

## 下一步

- [6. Web 应用开发](./web)：管道全貌
- [10. 多租户](./multi-tenancy)：租户解析
- [Authentication 包](../packages/authentication) / [Authorization 包](../packages/authorization)：完整 API
- [Security 包](../packages/security)：加解密、哈希、签名
