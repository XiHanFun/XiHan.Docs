# 如何为项目贡献代码

## 一、准备工作

- 安装 Git；

- 安装 Sourcetree，这个工具是 git 的一种图形化界面；

- 注意安装 git 的时候记得勾选将 git 所在目录添加到系统环境变量；

<details>
<summary>1.DotNet项目</summary>

- 安装 Visual Studio 2022；

- 安装 Visual Studio 2022 的 CodeMaid 扩展插件，这个插件可以自动格式化代码；

- `若有新功能开发`，请添加文件头，这在后续修改代码文件或多人合作项目时有莫大的好处。如下为我的示例：

```csharp
#region <<版权版本注释>>

// ----------------------------------------------------------------
// Copyright ©2024 ZhaiFanhua All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
// FileName:ChatHub
// Guid:ee669dee-30c7-4d21-8eb4-f24d8dc0f44c
// Author:zhaifanhua
// Email:me@zhaifanhua.com
// CreatedTime:2024-04-16 上午 03:59:25
// ----------------------------------------------------------------

#endregion <<版权版本注释>>
```

下面就来说说怎么创建并修改默认模板。

#### 1.新建模板文件

> 注意：我所用环境为 Visual Studio 2022，以下模板适合 C#10 新语法，旧语法及旧版本以类似方法修改。

在空白目录创建以下三个文件：

Class.cs

```csharp
#region <<版权版本注释>>

// ----------------------------------------------------------------
// Copyright ©$year$ ZhaiFanhua All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
// FileName:$safeitemname$
// Guid:$guid1$
// Author:$username$
// Email:me@zhaifanhua.com
// CreateTime:$time$
// ----------------------------------------------------------------

#endregion <<版权版本注释>>

namespace $rootnamespace$;

/// <summary>
/// $safeitemrootname$
/// </summary>
public class $safeitemrootname$
{
}
```

Controller.cs `这里仅为ApiController`

```csharp
#region <<版权版本注释>>

// ----------------------------------------------------------------
// Copyright ©$year$ ZhaiFanhua All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
// FileName:$safeitemname$
// Guid:$guid1$
// Author:$username$
// Email:me@zhaifanhua.com
// CreateTime:$time$
// ----------------------------------------------------------------

#endregion <<版权版本注释>>

namespace $rootnamespace$;

/// <summary>
/// $safeitemrootname$
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class $safeitemname$ : ControllerBase
{
}
```

Interface.cs

```csharp
#region <<版权版本注释>>

// ----------------------------------------------------------------
// Copyright ©$year$ ZhaiFanhua All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.
// FileName:$safeitemname$
// Guid:$guid1$
// Author:$username$
// Email:me@zhaifanhua.com
// CreateTime:$time$
// ----------------------------------------------------------------

#endregion <<版权版本注释>>

namespace $rootnamespace$;

/// <summary>
/// $safeitemrootname$
/// </summary>
public interface $safeitemrootname$
{
}
```

#### 2.找到模板目录并复制

例如安装的 Visual Studio 2022 在 C 盘，则对应的模板目录在：

Class

> C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\ItemTemplates\CSharp\Code\2052\Class
> C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\ItemTemplates\AspNetCore\Code\1033\Class

Interface

> C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\ItemTemplates\CSharp\Code\2052\Interface
> C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\ItemTemplates\AspNetCore\Code\1033\Interface

Controller

> C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\ItemTemplates\AspNetCore\Web\ASP.NET\1033\WebApiEmptyController

</details>

<details>
<summary>2.Vue项目</summary>

- 安装 Visual Studio Code；

- 安装 Visual Studio Code 的 Prettier - Code formatter 扩展插件，这个插件可以自动格式化代码；

</details>

## 二、贡献代码

### 1. 新建自己的分支（Fork）

将本项目仓库 fork 到自己的 git 仓库中。

### 2. 克隆（Clone）

将已经 fork 的仓库 clone 到自己的本地 PC。

### 3. 创建本地分支

如果想要在本项目上做自己的开发，最好创建属于自己的项目分支，如果是直接贡献代码，那么可以直接在 dev 分支上进行操作。

### 4. 开发

1. 发现了一个小 Bug 并进行修改。
2. 在打开的 Issues 中选择功能并进行开发。

### 5. 提交（Commit）

向本地仓库提交 Bug。

这里是 Git 提交信息前缀规则：

| 前缀     | 描述                                                                            | 示例                                               |
| -------- | ------------------------------------------------------------------------------- | -------------------------------------------------- |
| feat     | 新功能增加（feature）                                                           | feat: add user login feature                       |
| fix      | 修复 BUG                                                                        | fix: correct user authentication                   |
| refactor | 代码重构（既不是新增功能，也不是修复 Bug）                                      | refactor: simplify user validation logic           |
| perf     | 性能优化                                                                        | perf(core): optimize virtual DOM diffing algorithm |
| docs     | 文档/注释                                                                       | docs: update API documentation                     |
| chore    | 依赖更新/脚手架配置修改等                                                       | chore: upgrade React to the latest version         |
| revert   | 代码撤销修改                                                                    | revert: revert commit 12345abc                     |
| style    | 代码风格相关无影响运行结果的                                                    | style: format code with prettier                   |
| test     | 测试相关                                                                        | test: add unit tests for login feature             |
| build    | 影响构建系统或外部依赖的更改（例如：gulp，broccoli，npm）                       | build: update webpack config                       |
| ci       | 持续集成的配置文件和脚本的变动（例如：Travis，Circle，BrowserStack，SauceLabs） | ci: update Travis configuration                    |

这种方式便于清晰区分每种提交的目的和用途。

### 6. 保持本地仓库最新

在准备发起 Pull Request 之前，需要同步原仓库最新的代码，记得检查目前的项目是否是最新的版本。

### 7. 推送到远程仓库（Push）

push 到开发者自己的远程仓库中。

### 8. 发起并完成合并请求（Pull Request）

在 git 仓库中选择自己修改了的分支，点击 create pull request 按钮发起 pull request。

## 三、提交代码的一些约定

发起请求成功后，本项目维护人就可以看到你提交的代码。pull request 如果被同意，你的代码就会被合并到仓库中。这样一次 pull request 就成功了。

至此，我们就完成了一次代码贡献的过程。
