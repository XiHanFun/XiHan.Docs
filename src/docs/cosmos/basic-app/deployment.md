# 部署

本篇介绍如何把 XiHan.BasicApp 发布到服务器。开发环境的本地启动见 [快速开始](./getting-started)。

## 环境要求

| 依赖 | 版本 |
| --- | --- |
| .NET SDK / Runtime | 10.0+ |
| PostgreSQL | 14+（或 MySQL / MariaDB） |
| Redis | 6.0+ |
| Node.js（构建前端） | 24.0+ |
| pnpm（构建前端） | 11.0+（`packageManager` 已锁定 `pnpm@11.7.0`） |

::: tip 部署前置
- 准备好可连接的 **PostgreSQL** 与 **Redis**。
- BasicApp 采用**重建数据库**策略：不做旧数据向后兼容，部署新版本时以**前向单一格式**建库。首次启动会自动建表并执行数据种子（对应 `EnableDbInitialization` / `EnableTableInitialization` / `EnableDataSeeding`，默认均为 `true`）。
- 系统基线种子始终执行；内置的演示数据（示例组织、演示账号等）由 `Saas:Seed:EnableDemoData` 控制，默认 `true`，生产环境如不需要可显式设为 `false` 跳过。
- 生产环境 CORS 仅放行配置中的域名（`XiHan:Web:Api:Cors:AllowedOrigins` 与网关 `XiHan:Web:Gateway:AllowedOrigins`），部署到自己的域名时务必同步修改，否则前端会被跨域拦截。
- 若用到 AI / 知识库能力，还需准备对应的向量库（如 Qdrant）与嵌入模型配置。
:::

## 后端：发布

```bash
dotnet publish backend/src/main/XiHan.BasicApp.WebHost -c Release -o /opt/xihan-basicapp
```

发布前在目标环境的 `appsettings.Production.json`（或环境变量）中配置好数据库连接串、Redis、JWT 签名密钥、以及初始超管密码等敏感项。

应用监听地址与端口由配置项 `Hosting:Urls` 决定（`Program.cs` 启动时读取该值并调用 `UseUrls`）；仓库自带的 `appsettings.Production.json` 默认配置为 `http://127.0.0.1:9708`，可按需调整。对外暴露时建议在前面加一层反向代理（Nginx / Caddy 等）做 TLS 终止与静态资源分流。

## 后端：Linux（Supervisor）

仓库自带的进程守护配置是 **Supervisor**（`backend/scripts/service/XiHan.BasicApp.ini`），并非 systemd unit：

```ini
[program:XiHanBasicApp]
command=/usr/bin/dotnet /home/basicappapi/XiHan.BasicApp.WebHost.dll
directory=/home/basicappapi
autorestart=true
startsecs=5
startretries=5
stdout_logfile=/home/basicappapi/logs/run.log
stderr_logfile=/home/basicappapi/logs/run.log
environment=ASPNETCORE_ENVIRONMENT=Production,DOTNET_CLI_HOME=/tmp
```

```bash
# 发布到 .ini 中约定的目录（换用其他路径需同步改 command / directory）
dotnet publish backend/src/main/XiHan.BasicApp.WebHost -c Release -o /home/basicappapi

# 安装 Supervisor 程序配置并启动（程序名取自 [program:XiHanBasicApp]）
sudo mkdir -p /home/basicappapi/logs
sudo cp backend/scripts/service/XiHan.BasicApp.ini /etc/supervisor/conf.d/XiHan.BasicApp.conf
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start XiHanBasicApp
```

查看运行状态与日志：

```bash
sudo supervisorctl status XiHanBasicApp
tail -f /home/basicappapi/logs/run.log
```

> 若偏好用 systemd 管理进程，可参照上面的发布命令自行编写 unit 文件；仓库当前未随附对应的 `.service` 文件。

## 后端：Windows

仓库内提供的是一个**注册 Windows 服务**的批处理脚本：

```text
backend/scripts/service/XiHan.BasicApp.bat
```

该脚本以管理员权限运行，内部调用 `sc create` 把可执行文件注册为自动启动的 Windows 服务（服务名 `XiHan.BasicApp`）并立即 `Net Start`。`binPath` 是按脚本自身所在目录拼接 `XiHan.BasicApp.exe` 得到的，因此需要把该 `.bat` 复制到发布产物目录下再执行；发布产物的程序集名实际是 `XiHan.BasicApp.WebHost`，如生成的可执行文件名与脚本不一致，需重命名或调整脚本后再运行。后续可用 `sc stop XiHan.BasicApp` / `sc delete XiHan.BasicApp` 或系统「服务」管理器管理该服务。

## 前端：构建与部署

```bash
cd frontend
pnpm install
pnpm build
```

构建产物为静态文件，部署到任意静态服务器（Nginx / IIS / 对象存储 + CDN 均可）。注意配置反向代理，将 API 请求转发到后端端口。

> 若前后端**不同源**部署，前端需正确设置 API 基址（`VITE_API_BASE_URL`），本地存储返回的 `/uploads` 根相对路径会据此拼成绝对 URL。

## 初始账号与安全

- 初始超级管理员：账号 `superadmin`，密码 `SuperAdmin@123`
- 通过 `Saas:Seed:SuperAdminPassword`（环境变量 `Saas__Seed__SuperAdminPassword`）覆盖初始密码

::: warning
生产环境务必覆盖初始密码，并在首次登录后立即修改。数据库、Redis 等连接凭据请通过环境变量或密钥管理注入，不要写死在提交的配置文件里。
:::

## 下一步

- [快速开始](./getting-started)：本地开发环境
- [系统架构](./architecture)：模块划分
- [功能清单](./features)：系统能力
