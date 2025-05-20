---
title: 快速入门
index: false
next:
  text: "核心模块"
  link: "./core"
---

# XiHan.Framework 快速入门

本文将引导您快速上手 XiHan.Framework，包括环境准备、安装配置、创建项目及基本功能的使用。

## 环境准备

使用 XiHan.Framework 需要以下环境：

- **.NET SDK 10** 或更高版本
- 推荐 IDE：
  - Visual Studio 2022 (17.10+)
  - JetBrains Rider 2024.1+
  - VS Code 配合 C# Dev Kit 插件
- 数据库（根据需要选择）：
  - SQL Server 2019+
  - MySQL 8.0+
  - PostgreSQL 15+
  - SQLite 3.35+

## 安装方式

### 通过 NuGet 包管理器安装

```bash
# 安装核心包
dotnet add package XiHan.Framework.Core

# 安装常用扩展包
dotnet add package XiHan.Framework.AspNetCore
dotnet add package XiHan.Framework.EntityFrameworkCore
# 或 SqlSugar 支持
dotnet add package XiHan.Framework.SqlSugarCore
```

### 通过项目模板安装

```bash
# 安装项目模板
dotnet new install XiHan.Templates

# 使用模板创建新项目
dotnet new xihanapp -n YourProjectName
```

## 创建新项目

### 方法一：使用项目模板（推荐）

1. 创建新项目

```bash
# 创建基础应用
dotnet new xihanapp -n MyXiHanApp

# 创建微服务应用
dotnet new xihanmicroservice -n MyXiHanService

# 创建模块化应用
dotnet new xihanmodular -n MyXiHanModular
```

2. 运行项目

```bash
cd MyXiHanApp
dotnet build
dotnet run
```

### 方法二：手动创建项目

1. 创建新的 ASP.NET Core Web API 项目

```bash
dotnet new webapi -n MyXiHanApp
cd MyXiHanApp
```

2. 添加 XiHan.Framework 包引用

```bash
dotnet add package XiHan.Framework.Core
dotnet add package XiHan.Framework.AspNetCore
dotnet add package XiHan.Framework.EntityFrameworkCore
dotnet add package XiHan.Framework.AspNetCore.Swagger
```

3. 修改 Program.cs 文件，引入和配置 XiHan.Framework

```csharp
using XiHan.Framework.Core;
using XiHan.Framework.AspNetCore;
using XiHan.Framework.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 添加 XiHan 框架基础服务
builder.Services.AddXiHanFramework(options =>
{
    options.ApplicationName = "MyXiHanApp";
});

// 添加 XiHan Web 服务
builder.Services.AddXiHanAspNetCore();

// 添加控制器
builder.Services.AddControllers()
    .AddXiHanMvcCore(); // 添加框架MVC扩展

// 添加 XiHan Swagger
builder.Services.AddXiHanSwagger();

// 添加数据库上下文
builder.Services.AddXiHanDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 添加框架仓储
builder.Services.AddXiHanRepositories();

// 自动注册服务
builder.Services.AddXiHanServices();

var app = builder.Build();

// 配置中间件管道
if (app.Environment.IsDevelopment())
{
    app.UseXiHanSwagger();
}

app.UseXiHanExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

4. 创建数据库上下文类

```csharp
using Microsoft.EntityFrameworkCore;
using XiHan.Framework.EntityFrameworkCore;
using XiHan.Framework.Core;

public class ApplicationDbContext : XiHanDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // 添加实体集
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 应用实体配置
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}

// 实体定义
public class Product : Entity<int>
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
}

public class Category : Entity<int>
{
    public string Name { get; set; }
    public List<Product> Products { get; set; }
}
```

5. 添加控制器

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using XiHan.Framework.AspNetCore;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : XiHanControllerBase
{
    private readonly IRepository<Product> _productRepository;

    public ProductsController(IRepository<Product> productRepository)
    {
        _productRepository = productRepository;
    }

    [HttpGet]
    public async Task<ActionResult<Result<List<Product>>>> GetProducts()
    {
        var products = await _productRepository.GetListAsync();
        return Success(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Result<Product>>> GetProduct(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound("产品不存在");
        }

        return Success(product);
    }

    [HttpPost]
    public async Task<ActionResult<Result<Product>>> CreateProduct(Product product)
    {
        var createdProduct = await _productRepository.InsertAsync(product);
        return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, Success(createdProduct));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Result>> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest("ID不匹配");
        }

        await _productRepository.UpdateAsync(product);
        return Success();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Result>> DeleteProduct(int id)
    {
        await _productRepository.DeleteAsync(id);
        return Success();
    }
}
```

6. 运行项目

```bash
dotnet run
```

## 基本功能演示

### 依赖注入

XiHan.Framework 使用 .NET 内置的依赖注入容器，并提供了更简便的服务注册方式：

```csharp
// 通过特性标记服务生命周期
[TransientService] // 瞬态服务
public class ProductService : IProductService
{
    // 实现...
}

[ScopedService] // 作用域服务
public class OrderService : IOrderService
{
    // 实现...
}

[SingletonService] // 单例服务
public class CacheService : ICacheService
{
    // 实现...
}

// 在 Program.cs 中自动注册所有服务
builder.Services.AddXiHanServices(options =>
{
    options.AutoRegisterServices = true;
    options.ScanAssemblies = new[] { typeof(Program).Assembly };
});
```

### 数据访问

使用 XiHan.Framework 的仓储模式进行数据访问：

```csharp
// 基本仓储用法
public class ProductService
{
    private readonly IRepository<Product> _productRepository;

    public ProductService(IRepository<Product> productRepository)
    {
        _productRepository = productRepository;
    }

    // 获取所有产品
    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _productRepository.GetListAsync();
    }

    // 获取分页产品
    public async Task<PagedResult<Product>> GetPagedProductsAsync(int pageNumber, int pageSize)
    {
        return await _productRepository.GetPagedListAsync(
            pageNumber: pageNumber,
            pageSize: pageSize,
            orderBy: q => q.OrderByDescending(p => p.Id)
        );
    }

    // 根据条件查询
    public async Task<List<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await _productRepository.GetListAsync(p => p.Price >= minPrice && p.Price <= maxPrice);
    }

    // 添加产品
    public async Task<Product> AddProductAsync(Product product)
    {
        return await _productRepository.InsertAsync(product);
    }
}

// 自定义仓储
public interface IProductRepository : IRepository<Product>
{
    Task<List<Product>> GetProductsWithCategoryAsync(int categoryId);
}

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<Product>> GetProductsWithCategoryAsync(int categoryId)
    {
        return await DbSet
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
    }
}
```

### 统一响应处理

使用 XiHan.Framework 的统一响应格式：

```csharp
// 在控制器中
[HttpGet]
public async Task<ActionResult<Result<List<ProductDto>>>> GetProducts()
{
    try
    {
        var products = await _productService.GetProductsAsync();
        return Success(products);
    }
    catch (Exception ex)
    {
        return Error("获取产品列表失败", "ERR-PRODUCT-001");
    }
}

[HttpGet("{id}")]
public async Task<ActionResult<Result<ProductDto>>> GetProduct(int id)
{
    var product = await _productService.GetProductByIdAsync(id);

    if (product == null)
    {
        return NotFound("产品不存在", "ERR-PRODUCT-404");
    }

    return Success(product);
}

// 响应结果示例 (成功)
{
    "succeeded": true,
    "data": {
        "id": 1,
        "name": "示例产品",
        "price": 199.99,
        "description": "这是一个示例产品"
    }
}

// 响应结果示例 (失败)
{
    "succeeded": false,
    "message": "产品不存在",
    "errorCode": "ERR-PRODUCT-404"
}
```

## 下一步

- 了解 [核心模块](./core) 的详细功能和使用方法
- 学习如何使用 XiHan.Framework 的 [数据访问](./data-access) 功能
- 探索 [Web API](./web-api) 开发和最佳实践
- 了解 [身份认证](./identity) 和授权功能
