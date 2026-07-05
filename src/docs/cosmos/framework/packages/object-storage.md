# XiHan.Framework.ObjectStorage

> 对象存储：本地磁盘与阿里云 OSS / MinIO / 腾讯云 COS 的统一适配抽象，支持多提供程序路由。

- **NuGet**：`XiHan.Framework.ObjectStorage`
- **模块类**：`XiHanObjectStorageModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.ObjectStorage 把「文件存到哪里」这件事抽象成一个统一接口 `IFileStorageProvider`：不管底层是本地磁盘、阿里云 OSS、MinIO 还是腾讯云 COS，业务代码都用同一套上传、下载、删除、生成预签名 URL 的方法。你可以同时启用多个提供程序，并按业务路由键把不同类型的文件（如头像、附件）分发到不同的存储后端。

## 何时使用

- 需要文件上传/下载能力，但不想把代码绑死在某一家云厂商上。
- 想在本地开发用磁盘存储、上线切换到 OSS/COS/MinIO，只改配置不改代码。
- 需要分片上传、断点续传、预签名临时访问 URL、文件复制/移动等常见对象存储操作。
- 需要按业务把不同文件路由到不同存储桶或不同提供程序。

## 安装

```bash
dotnet add package XiHan.Framework.ObjectStorage
```

## 启用

```csharp
[DependsOn(typeof(XiHanObjectStorageModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `services.AddXiHanObjectStorage(config)`，从配置读取要启用哪些提供程序及默认提供程序。

## 核心能力

- **统一存储抽象**：`IFileStorageProvider` 定义上传、下载、删除、存在性检查、获取元数据、复制、移动、列举目录等操作，四种后端实现同一接口。
- **多提供程序管理**：`IFileStorageProviderManager` 按名称取出对应提供程序，可查询已注册的提供程序名。
- **业务路由**：`IFileStorageRouter` 按业务路由键（如 `avatar`、`attachment`）解析并选择目标提供程序，支持严格匹配开关。
- **分片与断点续传**：`IFileStorageProvider` 暴露初始化/上传分片/完成/取消分片上传方法，提供程序通过 `SupportChunkedUpload` / `SupportResumableUpload` 声明能力。
- **预签名 URL**：`GeneratePresignedUrlAsync` 生成带过期时间的临时访问链接。
- **本地存储直链**：本地提供程序默认落在 `wwwroot/uploads` 下，配合 Web 静态文件服务可直接通过 URL 前缀访问。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IFileStorageProvider` / `FileStorageProviderBase` | 存储提供程序接口与基类 |
| `LocalFileStorageProvider` | 本地磁盘存储（`ProviderName = "Local"`） |
| `AliyunOssStorageProvider` | 阿里云 OSS（`"AliyunOSS"`） |
| `MinioFileStorageProvider` | MinIO（`"MinIO"`） |
| `TencentCosStorageProvider` | 腾讯云 COS（`"TencentCOS"`） |
| `IFileStorageProviderManager` / `DefaultFileStorageProviderManager` | 按名称获取提供程序 |
| `IFileStorageRouter` / `DefaultFileStorageRouter` | 按业务路由键选择提供程序 |

## 配置

| 配置节 | 说明 |
| --- | --- |
| `XiHan:ObjectStorage` | 全局：`DefaultProvider`、`EnabledProviders`、`RouteProviderMappings`、`StrictRouteMatch` |
| `XiHan:ObjectStorage:Local` | 本地：`RootPath`（默认 `wwwroot/uploads`）、`UrlPrefix`（默认 `/uploads`） |
| `XiHan:ObjectStorage:AliyunOss` / `:Minio` / `:TencentCos` | 对应云存储的接入参数 |

> 本地存储配置节 `XiHan:ObjectStorage:Local`（`RootPath` / `UrlPrefix`）也被 Web.Api 用于挂载静态文件服务，实现上传文件的直链访问。

## 依赖模块

- [XiHan.Framework.Core](./core) — 唯一的框架内部依赖，提供模块化与依赖注入基础。

第三方存储 SDK 为该包核心依赖：`Aliyun.OSS.SDK.NetCore`（阿里云 OSS）、`Minio`（MinIO）、`Tencent.QCloud.Cos.Sdk`（腾讯云 COS）。

## 相关模块

- [XiHan.Framework.VirtualFileSystem](./virtual-file-system) — 虚拟文件系统，偏向本地物理目录与嵌入资源的统一挂载。
