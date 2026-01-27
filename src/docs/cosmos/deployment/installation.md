# 安装指南

本文档将指导您完成 XiHan 开发环境的安装和配置。

## 后端环境安装

### 安装 .NET 10 SDK

#### Windows 系统

1. 访问 [.NET 官网](https://dotnet.microsoft.com/download/dotnet/10.0)
2. 下载 .NET 10 SDK 安装程序
3. 运行安装程序并按照提示完成安装
4. 打开命令提示符，验证安装：

```bash
dotnet --version
```

#### macOS 系统

使用 Homebrew 安装：

```bash
brew install dotnet
```

或下载官方安装程序进行安装。

#### Linux 系统

**Ubuntu/Debian**：

```bash
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install -y dotnet-sdk-10.0
```

**CentOS/RHEL**：

```bash
sudo rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm
sudo yum install dotnet-sdk-10.0
```

### 安装 PostgreSQL

#### Windows 系统

1. 访问 [PostgreSQL 官网](https://www.postgresql.org/download/windows/)
2. 下载并运行安装程序
3. 按照向导完成安装，记住设置的密码
4. 默认端口：5432

#### macOS 系统

使用 Homebrew 安装：

```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux 系统

**Ubuntu/Debian**：

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**创建数据库**：

```bash
sudo -u postgres psql
CREATE DATABASE xihanbasicapp;
CREATE USER xihanuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE xihanbasicapp TO xihanuser;
\q
```

### 安装 Redis

#### Windows 系统

1. 下载 [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
2. 解压并运行 `redis-server.exe`
3. 或使用 WSL2 安装 Linux 版本

#### macOS 系统

```bash
brew install redis
brew services start redis
```

#### Linux 系统

**Ubuntu/Debian**：

```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

验证 Redis 安装：

```bash
redis-cli ping
# 应该返回 PONG
```

### 使用 Docker 安装数据库服务

如果您熟悉 Docker，推荐使用 Docker Compose 快速启动所需服务：

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: xihan-postgres
    environment:
      POSTGRES_DB: xihanbasicapp
      POSTGRES_USER: xihanuser
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: xihan-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

启动服务：

```bash
docker-compose up -d
```

## 前端环境安装

### 安装 Node.js

#### Windows/macOS

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本（推荐 24.x）
3. 运行安装程序

#### Linux 系统

使用 nvm 安装（推荐）：

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载配置
source ~/.bashrc

# 安装 Node.js
nvm install 24
nvm use 24
```

验证安装：

```bash
node --version
npm --version
```

### 安装 pnpm

全局安装 pnpm：

```bash
npm install -g pnpm
```

或使用 Corepack（Node.js 16.13+）：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

验证安装：

```bash
pnpm --version
```

## 开发工具安装

### Visual Studio 2022

**Windows 系统**：

1. 访问 [Visual Studio 官网](https://visualstudio.microsoft.com/)
2. 下载 Visual Studio 2022 Community（免费）
3. 安装时选择以下工作负载：
   - ASP.NET 和 Web 开发
   - .NET 桌面开发

### JetBrains Rider

跨平台 .NET IDE：

1. 访问 [JetBrains Rider 官网](https://www.jetbrains.com/rider/)
2. 下载并安装
3. 申请教育许可证或购买商业许可证

### Visual Studio Code

轻量级编辑器：

1. 访问 [VS Code 官网](https://code.visualstudio.com/)
2. 下载并安装

**推荐扩展**：
- C# Dev Kit
- Vue - Official
- ESLint
- Prettier
- GitLens
- Docker

### 数据库管理工具

**DataGrip**（推荐）：
- 跨平台
- 支持多种数据库
- 强大的查询功能

**Navicat**：
- 图形化界面
- 易于使用

**DBeaver**（免费）：
- 开源免费
- 支持多种数据库

### API 测试工具

**Postman**：
- 功能强大
- 团队协作

**Apifox**：
- 国产工具
- 集成 API 文档、Mock、测试

**Insomnia**：
- 简洁易用
- 开源免费

## 克隆项目

### 从 GitHub 克隆

```bash
# 克隆框架
git clone https://github.com/XiHanFun/XiHan.Framework.git

# 克隆 UI 组件库
git clone https://github.com/XiHanFun/XiHan.UI.git

# 克隆基础应用
git clone https://github.com/XiHanFun/XiHan.BasicApp.git
```

### 从 Gitee 克隆（国内用户推荐）

```bash
# 克隆框架
git clone https://gitee.com/XiHanFun/XiHan.Framework.git

# 克隆 UI 组件库
git clone https://gitee.com/XiHanFun/XiHan.UI.git

# 克隆基础应用
git clone https://gitee.com/XiHanFun/XiHan.BasicApp.git
```

## 后端项目配置

### 还原 NuGet 包

```bash
cd XiHan.BasicApp/backend
dotnet restore
```

### 配置数据库连接

编辑 `appsettings.Development.json`：

```json
{
  "ConnectionStrings": {
    "Default": "Server=127.0.0.1;Port=5432;Database=xihanbasicapp;User Id=xihanuser;Password=your_password;"
  }
}
```

### 配置 Redis

在 `appsettings.Development.json` 中配置：

```json
{
  "Redis": {
    "Configuration": "127.0.0.1:6379",
    "InstanceName": "XiHan:",
    "DefaultDatabase": 0
  }
}
```

### 初始化数据库

运行应用时会自动初始化数据库结构和种子数据。

或使用迁移命令：

```bash
cd src/main/XiHan.BasicApp.WebHost
dotnet ef database update
```

## 前端项目配置

### 安装依赖

```bash
cd XiHan.BasicApp/frontend
pnpm install
```

### 配置 API 地址

编辑 `.env.development`：

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## 启动项目

### 启动后端

```bash
cd backend/src/main/XiHan.BasicApp.WebHost
dotnet run
```

后端将在 `http://localhost:5000` 启动。

### 启动前端

```bash
cd frontend
pnpm dev
```

前端将在 `http://localhost:3000` 启动。

## 验证安装

### 检查后端

访问 Swagger 文档：
```
http://localhost:5000/swagger
```

或使用 Scalar 文档：
```
http://localhost:5000/scalar/v1
```

### 检查前端

在浏览器中访问：
```
http://localhost:3000
```

### 登录系统

使用默认管理员账户：
- 用户名：`admin`
- 密码：查看数据种子文件或控制台输出

## 常见问题

### .NET SDK 未找到

确保已将 .NET SDK 添加到系统 PATH 环境变量。

### PostgreSQL 连接失败

1. 检查 PostgreSQL 服务是否运行
2. 检查端口是否正确
3. 检查用户名和密码
4. 检查防火墙设置

### Redis 连接失败

1. 检查 Redis 服务是否运行
2. 检查端口是否正确
3. 检查 Redis 配置文件

### 前端依赖安装失败

如果使用 npm 安装失败，尝试：

1. 清除缓存：`npm cache clean --force`
2. 使用 pnpm：`pnpm install`
3. 使用国内镜像：`pnpm config set registry https://registry.npmmirror.com`

### 端口被占用

如果默认端口被占用，可以在配置文件中修改：

**后端端口**（`launchSettings.json`）：
```json
{
  "applicationUrl": "http://localhost:5001"
}
```

**前端端口**（`vite.config.ts`）：
```typescript
{
  server: {
    port: 3001
  }
}
```

## 下一步

- [配置说明](./configuration.md) - 了解详细的配置选项
- [部署指南](./deployment.md) - 学习如何部署到生产环境
- [开发指南](../framework/index.md) - 开始使用框架开发
