---
title: 快速部署
index: false
next:
  text: "基础功能"
  link: "./features"
---

# XiHan.BasicApp 快速部署

本文档将指导您如何部署和运行 XiHan.BasicApp 应用系统，包括环境准备、系统安装、配置以及启动过程。

## 系统要求

在部署 XiHan.BasicApp 前，请确保您的环境满足以下要求：

### 服务器要求

- **操作系统**：

  - Windows Server 2019+
  - Ubuntu 20.04+
  - Debian 11+

- **硬件配置**：
  - CPU: 2 核心或以上
  - 内存: 4GB 或以上
  - 硬盘: 50GB 或以上（取决于数据规模）
  - 网络: 5Mbps 或以上带宽

### 软件环境

- **运行时**：

  - .NET 9.0 运行时
  - Node.js 18.0+ (用于前端部署)

- **数据库**：

  - SQL Server
  - MySQL
  - PostgreSQL

- **Web 服务器**：

  - IIS 10+ (Windows)
  - Nginx 1.18+ (推荐用于 Linux)
  - Apache 2.4+

- **缓存**：
  - Redis 6.0+ (可选，用于提升性能)

## 部署方式

XiHan.BasicApp 支持多种部署方式，您可以根据实际需求选择合适的部署方案。

### 1. Docker 容器部署（推荐）

使用 Docker 是最简便的部署方式，可以快速启动应用。

#### 前提条件

- 安装 Docker 和 Docker Compose
- 确保 Docker 服务正常运行

#### 步骤

1. 克隆代码仓库

```bash
git clone https://github.com/XiHanFun/XiHan.BasicApp.git
cd XiHan.BasicApp
```

2. 使用 Docker Compose 启动应用

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps
```

3. 访问应用

应用启动后，可以通过以下地址访问：

- 前端界面: http://localhost:8080
- API 服务: http://localhost:5000
- Swagger API 文档: http://localhost:5000/swagger

### 2. 传统部署方式

如果您不使用 Docker，也可以采用传统方式部署应用。

#### 后端部署

1. 克隆代码仓库

```bash
git clone https://github.com/XiHanFun/XiHan.BasicApp.git
cd XiHan.BasicApp/backend
```

2. 配置数据库连接

编辑 `appsettings.json` 文件，修改数据库连接字符串：

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your_server;Database=XiHanBasicApp;User Id=your_user;Password=your_password;"
  }
}
```

3. 构建并发布应用

```bash
# 还原依赖包
dotnet restore

# 编译发布项目
dotnet publish -c Release -o ./publish
```

4. 运行应用

```bash
# 直接运行
cd ./publish
dotnet XiHan.BasicApp.Api.dll

# 或使用系统服务管理（如 systemd）
# 创建服务配置文件
```

#### 前端部署

1. 进入前端目录

```bash
cd XiHan.BasicApp/frontend
```

2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm（推荐）
pnpm install
```

3. 修改 API 地址

编辑 `.env.production` 文件，设置正确的 API 地址：

```
VITE_API_URL=http://your-api-server:5000
```

4. 构建前端资源

```bash
# 构建生产环境代码
pnpm build
```

5. 部署到 Web 服务器

将 `dist` 目录下的文件部署到 Web 服务器（如 Nginx、Apache 等）

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 使用托管服务部署

XiHan.BasicApp 也可以部署到各种云托管服务上。

#### Azure App Service

1. 在 Azure 门户创建 App Service
2. 配置持续部署或使用 Visual Studio 发布
3. 设置环境变量和连接字符串

#### AWS Elastic Beanstalk

1. 创建 Elastic Beanstalk 环境
2. 上传应用程序包或配置 GitHub 集成
3. 配置环境变量和数据库连接

## 数据库配置

### 初始化数据库

首次部署应用时，需要初始化数据库结构和基本数据。

#### 使用 EF Core 迁移

```bash
cd XiHan.BasicApp/backend
dotnet ef database update
```

#### 使用 SQL 脚本

在 `XiHan.BasicApp/backend/scripts` 目录下提供了初始化数据库的 SQL 脚本：

- `schema.sql`: 创建表结构
- `init-data.sql`: 初始化基础数据

可以使用以下命令执行脚本：

```bash
# SQL Server
sqlcmd -S your_server -d XiHanBasicApp -U your_user -P your_password -i schema.sql
sqlcmd -S your_server -d XiHanBasicApp -U your_user -P your_password -i init-data.sql

# MySQL
mysql -h your_server -u your_user -p XiHanBasicApp < schema.sql
mysql -h your_server -u your_user -p XiHanBasicApp < init-data.sql
```

### 数据备份与恢复

建议定期备份数据库，以防数据丢失：

```bash
# SQL Server 备份
sqlcmd -S your_server -U your_user -P your_password -Q "BACKUP DATABASE XiHanBasicApp TO DISK='backup.bak'"

# MySQL 备份
mysqldump -h your_server -u your_user -p XiHanBasicApp > backup.sql
```

## 系统配置

### 应用配置

XiHan.BasicApp 的主要配置存放在 `appsettings.json` 文件中，包括：

```json
{
  "AppSettings": {
    "AppName": "XiHan.BasicApp",
    "Version": "1.0.0",
    "AdminEmail": "admin@example.com"
  },
  "Authentication": {
    "JwtSecret": "your-secret-key-should-be-very-long-and-secure",
    "JwtExpiryInDays": 7,
    "RefreshTokenExpiryInDays": 30
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

### 生产环境配置最佳实践

在生产环境中，建议：

1. 不要在源代码中存储敏感信息，使用环境变量或密钥管理服务
2. 为不同环境（开发、测试、生产）创建不同的配置文件
3. 使用 HTTPS 确保传输安全
4. 配置适当的日志级别，避免记录过多信息
5. 定期更新密钥和证书

## 系统维护

### 日志管理

XiHan.BasicApp 使用 Serilog 记录日志，默认保存在：

- Windows: `C:\Logs\XiHanBasicApp\`
- Linux: `/var/log/xihan-basicapp/`

可以通过配置文件修改日志位置和级别。

### 性能优化

为获得最佳性能，请考虑：

1. 使用 Redis 缓存提高响应速度
2. 优化数据库查询和索引
3. 使用 CDN 分发静态资源
4. 配置适当的应用程序池/进程管理

### 版本升级

升级 XiHan.BasicApp 到新版本：

1. 备份当前应用和数据库
2. 下载或拉取新版本代码
3. 运行数据库迁移脚本
4. 重新构建和部署应用

## 常见问题

### 数据库连接失败

检查：

- 连接字符串是否正确
- 数据库服务是否运行
- 防火墙设置是否允许连接
- 数据库用户是否有足够权限

### API 访问错误

检查：

- 后端服务是否正常运行
- CORS 配置是否正确
- 防火墙或网络设置是否阻止请求

### 前端资源加载失败

检查：

- Web 服务器配置是否正确
- 静态资源路径是否正确
- API 地址配置是否匹配

### 认证授权问题

检查：

- JWT 密钥配置是否正确
- 令牌过期时间设置
- 用户权限设置

## 下一步

- 了解系统的 [基础功能](./features)
- 学习如何进行 [权限管理](./permissions)
- 探索系统的 [API 接口](./api)

# 部署指南

## 系统要求

- **.NET 环境**: .NET 9.0 运行时
- **操作系统**:
  - Windows Server 2019+
  - Ubuntu 20.04+
  - Debian 11+
- **数据库**:
  - SQL Server
  - MySQL
  - PostgreSQL

## Windows 部署

### 使用 IIS

1. 发布应用

```bash
cd XiHan.BasicApp/backend
dotnet publish -c Release -o ./publish
```

2. 在 IIS 中配置:
   - 创建新网站
   - 设置应用程序池为 .NET CLR 版本 "无托管代码"
   - 指向发布目录

### 使用 Windows 服务

使用项目提供的服务安装脚本:

```bash
cd XiHan.BasicApp/backend/scripts/service
.\XiHan.BasicApp.bat
```

## Linux 部署

### 使用 Systemd

1. 发布应用

```bash
cd XiHan.BasicApp/backend
dotnet publish -c Release -o ./publish
```

2. 创建服务

```bash
sudo cp ./scripts/service/XiHan.BasicApp.service /etc/systemd/system/
sudo systemctl enable XiHan.BasicApp
sudo systemctl start XiHan.BasicApp
```

## 配置

编辑 `appsettings.json` 配置连接字符串和系统参数:

```json
{
  "ConnectionStrings": {
    "Default": "Server=...;Database=...;User=...;Password=...;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  }
}
```

## 版本升级步骤

1. 备份现有配置和数据
2. 停止服务
3. 替换应用程序文件
4. 应用数据库迁移
5. 启动服务
