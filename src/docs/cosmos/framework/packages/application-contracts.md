# XiHan.Framework.Application.Contracts

> 应用服务契约：DTO 基类、应用服务接口与统一响应模型

- **NuGet**：`XiHan.Framework.Application.Contracts`
- **模块类**：`XiHanApplicationContractsModule`
- **所在层**：领域与应用层

## 这是什么

这个包定义应用层的**对外契约**：DTO 基类、应用服务接口和统一返回模型。它只声明「有什么」，不含具体实现——实现放在 Application 包。把契约单独抽出来，客户端或其它模块可以只引用这一层拿到接口与数据形状，而不必依赖服务的实现细节。

## 何时使用

- 定义应用服务接口与传输数据的 DTO，声明前后端约定
- 需要标准化的 CRUD 应用服务契约（`ICrudApplicationService`）
- 需要统一的 API 响应信封（`ApiResponse` / `ApiResponse<T>`）与业务码

## 安装

```bash
dotnet add package XiHan.Framework.Application.Contracts
```

## 启用

```csharp
[DependsOn(typeof(XiHanApplicationContractsModule))]
public class MyModule : XiHanModule { }
```

## 核心能力

- 应用服务标记接口：`IApplicationService`（继承 `IRemoteService`），实现它的服务会被暴露为 REST API
- CRUD 契约：`ICrudApplicationService<...>` 声明 `GetByIdAsync` / `PageAsync` / `CreateAsync` / `UpdateAsync` / `DeleteAsync`；`IBatchCrudApplicationService` 提供批量版本
- DTO 基类体系：`DtoBase` / `DtoBase<TKey>`、`CreationDtoBase<TKey>`、`UpdateDtoBase<TKey>`、`DeletionDtoBase`、`FullAuditedDtoBase`，区分读取/创建/更新等场景
- 统一响应：`ApiResponse` / `ApiResponse<T>` 封装 `Code` / `Message` / `Data` / `TraceId`，配合 `ApiResponseCodes` 业务码枚举
- 批量操作契约：`BatchOperationRequest` / `BatchOperationResponse`

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IApplicationService` | 应用服务标记接口，实现后自动暴露为 API |
| `ICrudApplicationService<TEntityDto, TKey, TCreateDto, TUpdateDto, TPageRequestDto>` | 标准 CRUD 应用服务契约 |
| `DtoBase` / `DtoBase<TKey>` | DTO 基类，泛型版含 `BasicId` |
| `CreationDtoBase<TKey>` | 创建 DTO 基类 |
| `UpdateDtoBase<TKey>` | 更新 DTO 基类，含 `BasicId` |
| `FullAuditedDtoBase` | 带完整审计字段的 DTO 基类 |
| `ApiResponse` / `ApiResponse<T>` | 统一响应信封 |
| `ApiResponseCodes` | 业务码枚举（序列化为 int） |

> 分页请求/响应基类（`PageRequestDtoBase` / `PageResultDtoBase<T>`）来自依赖包 [XiHan.Framework.Domain.Shared](./domain-shared)，CRUD 契约的分页参数即基于它们。

## 依赖模块

仅依赖 [XiHan.Framework.Domain.Shared](./domain-shared)，从中复用分页查询契约。不含任何实现代码，保持契约层纯净。

## 相关模块

- [XiHan.Framework.Application](./application) — 本契约的实现层（应用服务基类 + 动态 API）
- [XiHan.Framework.Domain.Shared](./domain-shared) — 提供分页查询 DTO
- [XiHan.Framework.Domain](./domain) — 领域层，DTO 通常由领域实体映射而来
