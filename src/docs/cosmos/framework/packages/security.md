# XiHan.Framework.Security

> 安全与加密：当前用户/主体上下文、密码哈希与策略、BouncyCastle 加密

- **NuGet**：`XiHan.Framework.Security`
- **模块类**：`XiHanSecurityModule`
- **所在层**：基础设施层

## 这是什么

这个包是框架的安全基座，提供三类能力：**当前用户/主体上下文**（在任意服务里安全地读取"当前是谁"）、**密码安全**（PBKDF2 哈希、强度策略、历史校验）、以及**加密算法**（基于 BouncyCastle 的对称/国密加密）。认证（Authentication）与授权（Authorization）都建立在它之上。

## 何时使用

- 需要在服务里读取当前登录用户的身份、声明、租户（`ICurrentUser`）
- 需要对密码做安全哈希与校验、执行密码强度/历史策略
- 需要对称加密（Blowfish）或国密 SM2 签名/加密
- 构建自定义认证/授权逻辑时，复用统一的主体访问与声明类型

## 安装

```bash
dotnet add package XiHan.Framework.Security
```

## 启用

```csharp
[DependsOn(typeof(XiHanSecurityModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里注册密码策略服务与密码历史存储；`ICurrentUser` / `ICurrentClient` / 主体访问器通过标记接口自动注册。

## 核心能力

- **当前用户/主体上下文**：`ICurrentUser`（`UserId`/`UserName`/`TenantId`/`Roles`/声明查询）、`ICurrentClient`、`ICurrentPrincipalAccessor`（基于 `AsyncLocal` 可临时切换主体）
- **统一声明类型**：`XiHanClaimTypes` 预定义 20+ 声明常量（用户、角色、权限、租户、模拟登录、会话、设备指纹等）
- **密码哈希**：`IPasswordHasher` / `PasswordHasher`，PBKDF2-SHA256，可配置迭代次数（默认 60 万）、盐长、哈希长；哈希格式自带版本与参数便于平滑升级
- **密码策略**：`PasswordPolicyOptions`（长度、字符类型、过期天数、历史次数、失败锁定）+ `IPasswordPolicyService` 校验强度、弱密码黑名单、连续/重复字符检测，并给 0–100 评分
- **加密算法**：`BlowfishHelper`（Blowfish 对称加密，CBC + PKCS 填充）、`Sm2Helper`（国密 SM2 椭圆曲线密钥生成/签名/验签，SM3 哈希）

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ICurrentUser` / `CurrentUser` | 当前登录用户上下文（属性 + 声明查询） |
| `ICurrentClient` / `CurrentClient` | 当前客户端上下文 |
| `ICurrentPrincipalAccessor` | 访问/临时切换当前 `ClaimsPrincipal` |
| `XiHanClaimTypes` | 框架统一声明类型常量 |
| `IPasswordHasher` / `PasswordHasher` | 密码哈希与校验（PBKDF2-SHA256） |
| `PasswordHasherOptions` / `PasswordPolicyOptions` | 哈希参数 / 密码策略选项 |
| `IPasswordPolicyService` | 密码强度与历史策略校验 |
| `IPasswordHistoryStore` | 历史密码存储（默认内存，生产建议替换为数据库实现） |
| `BlowfishHelper` / `Sm2Helper` | Blowfish 对称加密 / 国密 SM2 |

## 快速示例

在任意服务里读取当前用户：

```csharp
public class OrderService
{
    private readonly ICurrentUser _currentUser;

    public OrderService(ICurrentUser currentUser) => _currentUser = currentUser;

    public void PlaceOrder()
    {
        if (!_currentUser.IsAuthenticated) throw new InvalidOperationException("未登录");
        var userId = _currentUser.UserId;
        var tenantId = _currentUser.TenantId;
        // ...
    }
}
```

## 依赖模块

- [XiHan.Framework.Core](./core)
- 第三方核心：**BouncyCastle.Cryptography**（Blowfish / SM2 等密码学算法）

## 相关模块

- [XiHan.Framework.Authentication](./authentication)（在此之上实现 JWT / OAuth2 / MFA）
- [XiHan.Framework.Authorization](./authorization)（RBAC / ABAC 授权）
