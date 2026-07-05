# XiHan.Framework.Authorization

> 授权：RBAC 角色权限、Policy 策略、ABAC 属性访问控制、ASP.NET Core 集成

- **NuGet**：`XiHan.Framework.Authorization`
- **模块类**：`XiHanAuthorizationModule`
- **所在层**：基础设施层

## 这是什么

这个包负责**授权**——判定"你能做什么"。它把三种主流授权模型整合到一起：**RBAC**（基于角色的权限）、**Policy**（策略）与 **ABAC**（基于属性的访问控制），并接入 ASP.NET Core 的授权管道，让你用 `[Authorize]` 就能触发权限 + 属性的混合判定。

> 认证（Authentication）= 你是谁；授权（Authorization）= 你能做什么。本包处理后者。

## 何时使用

- 需要基于角色/权限码的访问控制（RBAC）
- 需要在权限之上叠加属性约束（时间、IP、资源属性等 ABAC）
- 需要把权限判定接进 ASP.NET Core 的 `[Authorize(Policy = ...)]`
- 需要"实时"授权：权限授予/回收、用户禁用即时生效，而非等令牌过期

## 安装

```bash
dotnet add package XiHan.Framework.Authorization
```

## 启用

```csharp
[DependsOn(typeof(XiHanAuthorizationModule))]
public class MyModule : XiHanModule { }
```

模块依赖 [`XiHanAuthenticationModule`](./authentication)（并经其传递依赖 Security），在 `ConfigureServices` 里注册角色/权限/策略/ABAC 存储与评估器，以及 ASP.NET Core 授权策略提供者与处理器。

## 核心能力

- **RBAC**：`IRoleStore` + `RoleDefinition` 管理角色，`IAuthorizationService` 提供加入/移除角色、查询用户角色
- **权限检查**：`IPermissionChecker` 支持 `IsGrantedAsync`（单个）、`IsAnyGrantedAsync`（任一）、`IsAllGrantedAsync`（全部）、列出用户全部权限
- **Policy 策略**：`IPolicyEvaluator` + `PolicyDefinition`（可组合所需角色、权限、声明、自定义 `IAuthorizationRequirement`）
- **ABAC 属性控制**：`IAbacEvaluator` + `IAbacAttributeCollector`，评估上下文含主体、资源、环境三类属性（`AbacAttributeSet`）
- **ASP.NET Core 集成**：`HybridPermissionPolicyProvider` + `HybridPermissionAuthorizationHandler` 把权限与 ABAC 合并进标准授权管道；策略名格式 `xihan.hybrid:p={权限};a={ABAC策略}`
- **实时授权**：默认走 `IPermissionChecker` 实时校验（非信任 JWT 里的冻结声明），支持超级管理员通配权限

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IAuthorizationService` | 授权总入口（角色/权限/策略判定，返回 `AuthorizationResult`） |
| `IPermissionChecker` | 权限检查（单个/任一/全部） |
| `IPermissionStore` / `PermissionDefinition` | 权限存储与定义 |
| `IRoleStore` / `RoleDefinition` | 角色存储与定义 |
| `IPolicyEvaluator` / `PolicyDefinition` | 策略评估与定义 |
| `IAbacEvaluator` / `IAbacAttributeCollector` | ABAC 评估器 / 属性收集器 |
| `AbacAttributeSet` | 主体 / 资源 / 环境属性快照 |
| `HybridPermissionPolicyProvider` / `HybridPermissionAuthorizationHandler` | ASP.NET Core 混合授权集成 |

## 快速示例

在服务里检查权限：

```csharp
public class DocumentService
{
    private readonly IPermissionChecker _permissions;

    public DocumentService(IPermissionChecker permissions) => _permissions = permissions;

    public async Task DeleteAsync(long userId, long docId)
    {
        if (!await _permissions.IsGrantedAsync(userId.ToString(), "document:delete"))
            throw new UnauthorizedAccessException();
        // ...
    }
}
```

> `XiHan.BasicApp` 在此基础上落地了完整的权限码 `resource:action:scope`、数据范围与字段级脱敏，见 [BasicApp 权限模型](../../basic-app/permissions)。

## 依赖模块

- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Authentication](./authentication)（并传递依赖 [Security](./security)）
- 框架引用：**Microsoft.AspNetCore.App**（ASP.NET Core 授权管道）

## 相关模块

- [XiHan.Framework.Authentication](./authentication)
- [XiHan.Framework.Security](./security)
