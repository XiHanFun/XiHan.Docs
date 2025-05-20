---
title: 身份认证
index: false
next:
  text: "缓存"
  link: "./cache"
---

# XiHan.Framework 身份认证

XiHan.Framework.Identity 模块提供了完善的身份认证与授权功能，支持多种认证方式和灵活的权限控制，确保应用的安全性和可控性。

## 基本概念

### 认证与授权

在 XiHan.Framework 中，认证和授权是两个关键且不同的概念：

- **认证 (Authentication)**：验证用户身份的过程，解决"你是谁"的问题。
- **授权 (Authorization)**：验证用户是否有权限执行特定操作，解决"你能做什么"的问题。

### 身份标识

身份标识是用户在系统中的表示：

```csharp
// 用户身份标识接口
public interface IUser
{
    string Id { get; }
    string UserName { get; }
    string Email { get; }
    bool IsAuthenticated { get; }
    // 其他属性...
}

// 当前用户上下文
public interface ICurrentUser : IUser
{
    IEnumerable<string> Roles { get; }
    IEnumerable<Claim> Claims { get; }
    bool IsInRole(string role);
    bool HasPermission(string permission);
}
```

## 安装和配置

### 安装

通过 NuGet 包管理器安装：

```bash
dotnet add package XiHan.Framework.Identity
```

### 基本配置

在 `Program.cs` 中配置身份认证：

```csharp
// 添加 XiHan 身份认证
builder.Services.AddXiHanIdentity(options =>
{
    // 配置认证选项
    options.ConfigureAuthentication = authOptions =>
    {
        authOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        // 其他认证配置...
    };

    // 配置授权选项
    options.ConfigureAuthorization = authOptions =>
    {
        // 添加策略
        authOptions.AddPolicy("AdminPolicy", policy =>
            policy.RequireRole("Admin"));
        // 其他授权配置...
    };

    // JWT 配置
    options.ConfigureJwt = jwtOptions =>
    {
        jwtOptions.SecretKey = builder.Configuration["Jwt:SecretKey"];
        jwtOptions.Issuer = builder.Configuration["Jwt:Issuer"];
        jwtOptions.Audience = builder.Configuration["Jwt:Audience"];
        jwtOptions.ExpiresInMinutes = 60;
        jwtOptions.RefreshTokenExpiresInDays = 7;
    };

    // 密码策略
    options.ConfigurePassword = pwdOptions =>
    {
        pwdOptions.RequireDigit = true;
        pwdOptions.RequireLowercase = true;
        pwdOptions.RequireUppercase = true;
        pwdOptions.RequireNonAlphanumeric = true;
        pwdOptions.RequiredLength = 8;
    };
});

// 配置当前用户访问器
builder.Services.AddXiHanCurrentUser();

// 配置用户存储
builder.Services.AddXiHanUserStore<ApplicationUser, ApplicationRole, ApplicationDbContext>();

var app = builder.Build();

// 使用身份认证
app.UseAuthentication();
app.UseAuthorization();
```

## 用户管理

### 用户存储

XiHan.Framework 提供了抽象的用户存储接口，支持多种存储实现：

```csharp
// 用户存储接口
public interface IUserStore<TUser> where TUser : class
{
    Task<TUser> FindByIdAsync(string userId);
    Task<TUser> FindByNameAsync(string normalizedUserName);
    Task<TUser> FindByEmailAsync(string normalizedEmail);
    Task<IdentityResult> CreateAsync(TUser user, string password);
    Task<IdentityResult> UpdateAsync(TUser user);
    Task<IdentityResult> DeleteAsync(TUser user);
    Task<bool> CheckPasswordAsync(TUser user, string password);
    Task<IdentityResult> ChangePasswordAsync(TUser user, string currentPassword, string newPassword);
    // 其他方法...
}
```

### 用户服务

框架提供了高级用户服务，简化用户管理操作：

```csharp
// 用户服务接口
public interface IUserService
{
    Task<UserDto> GetUserAsync(string userId);
    Task<UserDto> GetUserByNameAsync(string userName);
    Task<UserDto> GetUserByEmailAsync(string email);
    Task<IdentityResult> CreateUserAsync(CreateUserDto createUserDto);
    Task<IdentityResult> UpdateUserAsync(UpdateUserDto updateUserDto);
    Task<IdentityResult> DeleteUserAsync(string userId);
    Task<IdentityResult> ChangePasswordAsync(ChangePasswordDto changePasswordDto);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<IdentityResult> AddToRoleAsync(string userId, string role);
    Task<IdentityResult> RemoveFromRoleAsync(string userId, string role);
    // 其他方法...
}

// 在服务中注册
builder.Services.AddTransient<IUserService, UserService>();
```

### 用法示例

```csharp
[ApiController]
[Route("api/users")]
public class UsersController : XiHanControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Result<UserDto>>> GetUser(string id)
    {
        var user = await _userService.GetUserAsync(id);
        if (user == null)
        {
            return NotFound("用户不存在");
        }

        return Success(user);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Result<UserDto>>> CreateUser(CreateUserDto dto)
    {
        var result = await _userService.CreateUserAsync(dto);
        if (!result.Succeeded)
        {
            return Error(result.Errors.First().Description);
        }

        var user = await _userService.GetUserByNameAsync(dto.UserName);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, Success(user));
    }

    // 其他操作...
}
```

## 认证

### JWT 认证

XiHan.Framework 默认使用 JWT (JSON Web Token) 进行身份认证：

```csharp
// 认证服务接口
public interface IAuthService
{
    Task<TokenResult> LoginAsync(LoginDto loginDto);
    Task<TokenResult> RefreshTokenAsync(RefreshTokenDto refreshTokenDto);
    Task<bool> LogoutAsync(string userId);
    Task<bool> ValidateTokenAsync(string token);
}

// 认证控制器
[ApiController]
[Route("api/auth")]
public class AuthController : XiHanControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<TokenResult>>> Login(LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto);
        if (result == null)
        {
            return Error("用户名或密码错误");
        }

        return Success(result);
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<ActionResult<Result<TokenResult>>> RefreshToken(RefreshTokenDto refreshTokenDto)
    {
        var result = await _authService.RefreshTokenAsync(refreshTokenDto);
        if (result == null)
        {
            return Error("无效的刷新令牌");
        }

        return Success(result);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<Result>> Logout()
    {
        var userId = CurrentUser.Id;
        await _authService.LogoutAsync(userId);
        return Success();
    }
}
```

### 社交媒体登录

XiHan.Framework 支持多种社交媒体登录：

```csharp
// 添加社交媒体登录
builder.Services.AddXiHanExternalLogin(options =>
{
    // Microsoft 登录
    options.UseMicrosoftAccount(microsoftOptions =>
    {
        microsoftOptions.ClientId = builder.Configuration["Authentication:Microsoft:ClientId"];
        microsoftOptions.ClientSecret = builder.Configuration["Authentication:Microsoft:ClientSecret"];
    });

    // Google 登录
    options.UseGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    });

    // 微信登录
    options.UseWeChat(wechatOptions =>
    {
        wechatOptions.AppId = builder.Configuration["Authentication:WeChat:AppId"];
        wechatOptions.AppSecret = builder.Configuration["Authentication:WeChat:AppSecret"];
    });

    // 支持自定义处理外部登录信息
    options.OnExternalLoginSucceeded = async (externalLoginInfo, userManager) =>
    {
        // 可以基于外部登录信息创建或关联用户
        // 返回处理结果...
    };
});
```

### 双因素认证

增强安全性的双因素认证：

```csharp
// 启用双因素认证
builder.Services.AddXiHanTwoFactorAuth(options =>
{
    options.UseSms = true; // 使用短信验证
    options.UseEmail = true; // 使用邮件验证
    options.UseAuthenticator = true; // 使用认证器应用
});

// 双因素认证服务
public interface ITwoFactorAuthService
{
    Task<bool> EnableTwoFactorAsync(string userId);
    Task<bool> DisableTwoFactorAsync(string userId);
    Task<string> GenerateTwoFactorTokenAsync(string userId, string provider);
    Task<bool> VerifyTwoFactorTokenAsync(string userId, string provider, string token);
    Task<string> GenerateQrCodeUriAsync(string userId);
    // 其他方法...
}
```

## 授权

### 基于角色的授权

基于用户角色控制访问权限：

```csharp
// 基于角色授权
[Authorize(Roles = "Admin,Manager")]
public class AdminController : XiHanControllerBase
{
    // 仅管理员和经理可访问...
}

// 或在方法级别授权
[HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<Result>> DeleteUser(string id)
{
    // 仅管理员可执行删除操作...
}
```

### 基于策略的授权

更灵活的访问控制策略：

```csharp
// 配置授权策略
builder.Services.AddXiHanAuthorization(options =>
{
    // 年龄验证策略
    options.AddPolicy("MinimumAge", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));

    // 高级用户策略
    options.AddPolicy("PremiumUser", policy =>
        policy.RequireClaim("Subscription", "Premium"));

    // 组合策略
    options.AddPolicy("SeniorEditor", policy =>
        policy.RequireRole("Editor")
              .RequireClaim("Experience", "Senior")
              .RequireAssertion(context =>
                  context.User.HasClaim(c => c.Type == "Department" && c.Value == "Content")));
});

// 使用自定义策略授权
[HttpPost]
[Authorize(Policy = "PremiumUser")]
public async Task<ActionResult<Result>> CreateProject(CreateProjectDto dto)
{
    // 仅高级用户可创建项目...
}
```

### 自定义授权处理器

实现复杂授权逻辑：

```csharp
// 自定义授权要求
public class OwnershipRequirement : IAuthorizationRequirement
{
    public string ResourceType { get; }

    public OwnershipRequirement(string resourceType)
    {
        ResourceType = resourceType;
    }
}

// 自定义授权处理器
public class OwnershipAuthorizationHandler : AuthorizationHandler<OwnershipRequirement, IResource>
{
    private readonly ICurrentUser _currentUser;

    public OwnershipAuthorizationHandler(ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OwnershipRequirement requirement,
        IResource resource)
    {
        if (_currentUser.Id == resource.OwnerId || _currentUser.IsInRole("Admin"))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

// 注册授权处理器
builder.Services.AddTransient<IAuthorizationHandler, OwnershipAuthorizationHandler>();

// 在控制器中使用
[HttpPut("{id}")]
public async Task<ActionResult<Result>> UpdateProject(int id, UpdateProjectDto dto)
{
    var project = await _projectService.GetByIdAsync(id);
    if (project == null)
    {
        return NotFound();
    }

    // 检查是否有权限修改
    var authResult = await _authorizationService.AuthorizeAsync(
        User, project, new OwnershipRequirement("Project"));

    if (!authResult.Succeeded)
    {
        return Forbid();
    }

    // 执行更新操作...
}
```

## 高级功能

### 权限管理

XiHan.Framework 提供了灵活的权限管理功能：

```csharp
// 权限定义
public class Permission
{
    public string Name { get; set; }
    public string DisplayName { get; set; }
    public string Module { get; set; }
    public string Description { get; set; }
}

// 权限管理服务
public interface IPermissionManager
{
    Task<IEnumerable<Permission>> GetPermissionsAsync();
    Task<IEnumerable<Permission>> GetUserPermissionsAsync(string userId);
    Task<IEnumerable<Permission>> GetRolePermissionsAsync(string roleId);
    Task<bool> GrantPermissionsToRoleAsync(string roleId, IEnumerable<string> permissions);
    Task<bool> RevokePermissionsFromRoleAsync(string roleId, IEnumerable<string> permissions);
    // 其他方法...
}

// 在控制器中使用
[HttpGet("my-permissions")]
[Authorize]
public async Task<ActionResult<Result<IEnumerable<Permission>>>> GetMyPermissions()
{
    var permissions = await _permissionManager.GetUserPermissionsAsync(CurrentUser.Id);
    return Success(permissions);
}
```

### 密码策略

自定义密码强度和有效期策略：

```csharp
// 配置密码策略
builder.Services.AddXiHanPasswordPolicy(options =>
{
    // 基本密码要求
    options.RequireDigit = true;
    options.RequireLowercase = true;
    options.RequireUppercase = true;
    options.RequireNonAlphanumeric = true;
    options.RequiredLength = 8;

    // 高级密码策略
    options.RequiredUniqueChars = 4;
    options.MaxFailedAttempts = 5;
    options.LockoutDuration = TimeSpan.FromMinutes(30);
    options.PasswordExpiresInDays = 90;
    options.PreventPasswordReuse = 5; // 禁止重复使用最近5个密码
});
```

### 会话管理

监控和管理用户会话：

```csharp
// 配置会话管理
builder.Services.AddXiHanSessionManagement(options =>
{
    options.MaxConcurrentSessions = 3; // 每个用户最多同时3个活跃会话
    options.TrackUserActivity = true; // 跟踪用户活动
    options.SessionTimeout = TimeSpan.FromMinutes(30); // 会话超时时间
});

// 会话管理服务
public interface ISessionManager
{
    Task<IEnumerable<UserSession>> GetActiveSessionsAsync(string userId);
    Task<bool> TerminateSessionAsync(string sessionId);
    Task<bool> TerminateAllSessionsExceptCurrentAsync(string userId);
}

// 在控制器中使用
[HttpGet("my-sessions")]
[Authorize]
public async Task<ActionResult<Result<IEnumerable<UserSession>>>> GetMySessions()
{
    var sessions = await _sessionManager.GetActiveSessionsAsync(CurrentUser.Id);
    return Success(sessions);
}

[HttpPost("terminate-all-sessions")]
[Authorize]
public async Task<ActionResult<Result>> TerminateAllSessions()
{
    await _sessionManager.TerminateAllSessionsExceptCurrentAsync(CurrentUser.Id);
    return Success("所有其他设备已退出登录");
}
```

## 安全最佳实践

### 1. HTTPS 配置

确保所有通信使用 HTTPS：

```csharp
// 配置 HTTPS
builder.Services.AddXiHanSecurity(options =>
{
    options.UseHttps = true;
    options.HttpsRedirection = true;
    options.HstsOptions = new HstsOptions
    {
        MaxAge = TimeSpan.FromDays(365),
        IncludeSubDomains = true,
        Preload = true
    };
});

// 使用 HTTPS 重定向和 HSTS
app.UseHttpsRedirection();
app.UseHsts();
```

### 2. 防止跨站请求伪造 (CSRF)

保护应用免受 CSRF 攻击：

```csharp
// 配置 CSRF 保护
builder.Services.AddXiHanAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN";
    options.CookieName = "XSRF-TOKEN";
    options.SuppressXFrameOptionsHeader = false;
});

// 使用防伪
app.UseXiHanAntiforgery();
```

### 3. 安全标头

设置关键的安全 HTTP 标头：

```csharp
// 配置安全标头
builder.Services.AddXiHanSecurityHeaders(options =>
{
    options.AddContentSecurityPolicy();
    options.AddXContentTypeOptions();
    options.AddXXssProtection();
    options.AddReferrerPolicy();
    options.AddFrameOptions();
});

// 使用安全标头中间件
app.UseXiHanSecurityHeaders();
```

## 下一步

- 了解 [缓存](./cache) 模块的性能优化技术
- 学习 [消息队列](./messaging) 模块的异步通信功能
- 探索 [日志记录](./logging) 和监控系统的实现方式
