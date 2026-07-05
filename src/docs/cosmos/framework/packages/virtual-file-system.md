# XiHan.Framework.VirtualFileSystem

> 虚拟文件系统：把物理磁盘目录、程序集嵌入资源统一挂载到一套虚拟路径下访问，支持优先级覆盖、变更监控与内存版本快照。

- **NuGet**：`XiHan.Framework.VirtualFileSystem`
- **模块类**：`XiHanVirtualFileSystemModule`
- **所在层**：基础设施层

## 这是什么

XiHan.Framework.VirtualFileSystem 在 `Microsoft.Extensions.FileProviders` 之上做了一层统一封装。它让你不用关心一个文件到底来自本地磁盘目录还是打包进程序集的嵌入资源，都用同一套虚拟路径去读取、枚举、判断存在与监控变化。多个来源可以按优先级叠加挂载，高优先级的同名文件会覆盖低优先级的，从而实现"默认资源 + 外部覆盖"的组织方式。

## 何时使用

- 需要把配置、模板、静态资源等以统一入口访问，无论它们来自磁盘还是嵌入资源。
- 希望用"外部物理目录覆盖内置嵌入资源"的方式做资源定制，而不改动内置文件。
- 需要监控某类文件（如 `**/*.json`）变化并触发热更新。
- 需要在写入前对文件做内存快照，出错时回滚到上一个版本。

## 安装

```bash
dotnet add package XiHan.Framework.VirtualFileSystem
```

## 启用

```csharp
[DependsOn(typeof(XiHanVirtualFileSystemModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 中调用 `AddXiHanVirtualFileSystem`，注册 `IVirtualFileSystem` 与 `IFileVersioningService`（均为 Singleton），并绑定配置节 `XiHan:VirtualFileSystem`。

## 核心能力

- **统一虚拟访问**：`IVirtualFileSystem` 提供 `GetFile` / `GetDirectoryContents` / `FileExists` / `DirectoryExists` / `EnumerateFiles`，文件/目录不存在时返回 `NotFoundFileInfo` / `NotFoundDirectoryContents`。
- **多来源挂载**：内置物理目录、嵌入资源两类提供程序，可通过 `Mount` / `Unmount` 动态挂载卸载，支持自定义 `IFileProvider`。
- **优先级覆盖**：每个提供程序带优先级（数值越大越优先），高优先级同名文件覆盖低优先级，由 Composite 提供程序聚合。
- **变更监控**：`Watch(filter)` 返回 `IChangeToken`，配合 `OnFileChanged` 事件感知文件变化，支持防抖（`ChangeDebounceMilliseconds`）与开关（`EnableChangeTracking`）。
- **内存版本快照**：`IFileVersioningService` 对物理文件做内存快照并可回滚指定步数（仅内存栈保存，不落盘持久化）。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IVirtualFileSystem` / `VirtualFileSystem` | 统一虚拟文件系统入口，挂载、访问、枚举、监控 |
| `VirtualFileSystemOptions` | 配置项：提供程序集合、变更追踪、自动挂载当前/基目录、附加物理路径 |
| `VirtualPhysicalFileProvider` | 带优先级的物理磁盘文件提供程序 |
| `VirtualEmbeddedFileProvider` | 带优先级的程序集嵌入资源文件提供程序 |
| `VirtualCompositeFileProvider` | 按优先级聚合多个提供程序的复合提供程序 |
| `PrioritizedFileProvider` | 提供程序 + 优先级的封装 |
| `IFileVersioningService` / `FileVersioningService` | 文件内存快照（`Snapshot`）与回滚（`Rollback`） |
| `FileVersion` | 版本信息：内容字节、内容哈希、大小、时间戳 |
| `FileChangedEventArgs` / `FileChangeType` | 文件变更事件参数与变更类型 |

## 快速示例

```csharp
// 通过 Options 配置：附加一个物理目录（优先级 100，覆盖嵌入资源）
services.Configure<VirtualFileSystemOptions>(options =>
{
    options.AddPhysical("./resources", priority: 100);
    options.AddEmbedded<MyModule>(priority: 50);
});

// 使用：按统一虚拟路径读取文件
var file = virtualFileSystem.GetFile("~/config/app.json");
if (file.Exists)
{
    using var stream = file.CreateReadStream();
}
```

## 依赖模块

- 框架内部仅依赖 [XiHan.Framework.Core](./core)（模块化生命周期与依赖注入扩展）。
- 第三方核心依赖为 `Microsoft.Extensions.FileProviders` 系列（Composite / Physical / Embedded），虚拟文件能力构建其上。

## 相关模块

- [XiHan.Framework.ObjectStorage](./object-storage) — 面向对象存储/云存储的文件读写，与本包侧重"虚拟路径统一访问"不同。
- [XiHan.Framework.Templating](./templating) — 模板渲染常从虚拟文件系统读取模板资源。
- [XiHan.Framework.Core](./core) — 提供模块与依赖注入基础。
