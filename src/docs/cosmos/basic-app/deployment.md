# 部署

本篇介绍如何把 XiHan.BasicApp 发布到服务器。开发环境的本地启动见 [快速开始](./getting-started)。

## 环境要求

| 依赖 | 版本 |
| --- | --- |
| .NET SDK / Runtime | 10.0+ |
| PostgreSQL | 14+（或 MySQL / MariaDB） |
| Redis | 6.0+ |
| Node.js（构建前端） | 20.0+ |
| pnpm（构建前端） | 9.0+ |

::: tip 部署前置
- 准备好可连接的 **PostgreSQL** 与 **Redis**。
- BasicApp 采用**重建数据库**策略：不做旧数据向后兼容，部署新版本时以**前向单一格式**建库。首次启动会自动建表并执行数据种子。
- 若用到 AI / 知识库能力，还需准备对应的向量库（如 Qdrant）与嵌入模型配置。
:::

## 后端：发布

```bash
dotnet publish backend/src/main/XiHan.BasicApp.WebHost -c Release -o /opt/xihan-basicapp
```

发布前在目标环境的 `appsettings.Production.json`（或环境变量）中配置好数据库连接串、Redis、以及初始超管密码等敏感项。

生产端口默认 **`9709`**。

## 后端：Linux（systemd）

```bash
# 发布
dotnet publish backend/src/main/XiHan.BasicApp.WebHost -c Release -o /opt/xihan-basicapp

# 安装并启动服务
sudo cp backend/scripts/service/XiHan.BasicApp.service /etc/systemd/system/
sudo systemctl enable XiHan.BasicApp
sudo systemctl start XiHan.BasicApp
```

查看运行状态与日志：

```bash
sudo systemctl status XiHan.BasicApp
journalctl -u XiHan.BasicApp -f
```

## 后端：Windows

使用仓库内的批处理脚本启动：

```text
backend/scripts/service/XiHan.BasicApp.bat
```

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
