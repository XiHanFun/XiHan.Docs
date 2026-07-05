# XiHan.Framework.Authentication

> 认证：JWT 双令牌、OAuth2（GitHub/Google/QQ）、TOTP 两步验证、一次性验证码

- **NuGet**：`XiHan.Framework.Authentication`
- **模块类**：`XiHanAuthenticationModule`
- **所在层**：基础设施层

## 这是什么

这个包负责**认证**——确认"你是谁"。它提供 JWT 令牌的签发与校验、OAuth2 第三方登录、TOTP 两步验证（2FA），以及邮箱/短信一次性验证码。认证通过后颁发令牌，令牌里的身份声明再交给[授权模块](./authorization)判定"你能做什么"。

> 认证（Authentication）= 你是谁；授权（Authorization）= 你能做什么。两者分属不同的包。

## 何时使用

- 需要基于 JWT 的登录与令牌刷新（Access + Refresh 双令牌）
- 需要接入 GitHub / Google / QQ 第三方登录
- 需要两步验证（TOTP，兼容 Google Authenticator 等）
- 需要邮箱/短信一次性验证码（登录码、换绑验证等）

## 安装

```bash
dotnet add package XiHan.Framework.Authentication
```

## 启用

```csharp
[DependsOn(typeof(XiHanAuthenticationModule))]
public class MyModule : XiHanModule { }
```

模块依赖 [`XiHanSecurityModule`](./security)，在 `ConfigureServices` 里注册 JWT、OTP、一次性验证码、外部登录等服务。

## 核心能力

- **JWT 双令牌**：`IJwtTokenService` 生成/校验 Access Token、生成 Refresh Token、刷新令牌；HMAC-SHA256 签名；配置节 `XiHan:Authentication:Jwt`
- **OAuth2 第三方登录**：内置 Google / GitHub / QQ 提供者，`IExternalLoginStore` 映射外部身份，统一头像声明；配置节 `XiHan:Authentication:OAuth`
- **两步验证（MFA / TOTP）**：`IOtpService` 生成 TOTP 密钥与二维码 URI、校验动态码、生成恢复码
- **一次性验证码**：`IOneTimeCodeService` 签发/消费邮箱或短信验证码，基于 `IDistributedCache`（可用 Redis），**签发一次、消费即销毁**，防重放
- **密码认证编排**：`IAuthenticationService` 负责账号密码认证、修改/重置密码、失败锁定，复用 Security 的密码哈希与策略

::: warning 能力范围
本包实现的第三方登录是 **OAuth2 外部登录**，**不包含** OIDC 联合登录或 SSO 单点登录服务端。请勿据 README 旧描述假设存在 OIDC/SSO。
:::

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IJwtTokenService` / `JwtTokenService` | JWT 生成、校验、刷新 |
| `JwtOptions` | JWT 配置（`XiHan:Authentication:Jwt`） |
| `IRefreshTokenStore` | 刷新令牌存储（默认内存实现） |
| `IOtpService` / `OtpService` | TOTP/HOTP 两步验证 |
| `IOneTimeCodeService` | 邮箱/短信一次性验证码（消费即销毁） |
| `IAuthenticationService` | 账号密码认证、改密、锁定编排 |
| `IExternalLoginStore` | OAuth2 外部身份映射 |
| `IUserStore` | 用户数据访问抽象（默认实现需应用层替换） |

## 快速示例

签发访问令牌：

```csharp
public class LoginService
{
    private readonly IJwtTokenService _jwt;

    public LoginService(IJwtTokenService jwt) => _jwt = jwt;

    public string IssueToken(long userId, string userName)
    {
        var claims = new List<Claim>
        {
            new(XiHanClaimTypes.UserId, userId.ToString()),
            new(XiHanClaimTypes.UserName, userName),
        };
        var result = _jwt.GenerateAccessToken(claims);
        return result.AccessToken;
    }
}
```

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Security](./security)（密码哈希、当前用户、声明类型）
- 第三方核心：**Microsoft.AspNetCore.Authentication.JwtBearer** / **.Google**、**AspNet.Security.OAuth.GitHub** / **.QQ**

## 相关模块

- [XiHan.Framework.Authorization](./authorization)（消费令牌声明做授权）
- [XiHan.Framework.Security](./security)
