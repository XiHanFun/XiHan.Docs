---
title: Web API
index: false
next:
  text: "身份认证"
  link: "./identity"
---

# XiHan.Framework Web API

XiHan.Framework.WebApi 模块提供了构建 RESTful API 的全套功能，包括路由、控制器、过滤器、中间件等组件，帮助开发者快速构建高性能、易维护的 Web API 应用。

## 基本概念

### 控制器

控制器是处理 HTTP 请求并生成 HTTP 响应的核心组件。XiHan.Framework 扩展了.NET 的控制器功能：

```csharp
// 基础API控制器
[ApiController]
[Route("api/[controller]")]
public class XiHanControllerBase : ControllerBase
{
    // 基础服务和辅助方法
}

// 自定义控制器示例
[ApiController]
[Route("api/products")]
public class ProductsController : XiHanControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<Result<List<ProductDto>>>> GetProducts()
    {
        var products = await _productService.GetProductsAsync();
        return Success(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Result<ProductDto>>> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound("产品不存在");
        }

        return Success(product);
    }

    [HttpPost]
    public async Task<ActionResult<Result<ProductDto>>> CreateProduct(CreateProductDto dto)
    {
        var product = await _productService.CreateProductAsync(dto);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, Success(product));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Result>> UpdateProduct(int id, UpdateProductDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest("ID不匹配");
        }

        await _productService.UpdateProductAsync(dto);
        return Success();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Result>> DeleteProduct(int id)
    {
        await _productService.DeleteProductAsync(id);
        return Success();
    }
}
```

### 结果包装

XiHan.Framework 提供统一的 API 响应格式：

```csharp
// API响应格式
public class Result
{
    public bool Succeeded { get; set; }
    public string Message { get; set; }
    public string ErrorCode { get; set; }
}

public class Result<T> : Result
{
    public T Data { get; set; }
}

// 在控制器中使用
public ActionResult<Result<T>> Success(T data)
{
    return new Result<T>
    {
        Succeeded = true,
        Data = data
    };
}

public ActionResult<Result> Success(string message = null)
{
    return new Result
    {
        Succeeded = true,
        Message = message
    };
}

public ActionResult<Result> Error(string message, string errorCode = null)
{
    return new Result
    {
        Succeeded = false,
        Message = message,
        ErrorCode = errorCode
    };
}
```

## 安装和配置

### 安装

通过 NuGet 包管理器安装：

```bash
dotnet add package XiHan.Framework.WebApi
```

### 基本配置

在`Program.cs`中配置 Web API:

```csharp
// 添加Web API服务
builder.Services.AddXiHanWebApi(options =>
{
    // 配置API版本
    options.UseApiVersioning = true;

    // 配置Swagger
    options.UseSwagger = true;

    // 配置跨域
    options.UseCors = true;

    // 配置API前缀
    options.ApiPrefix = "api";
});

// 配置跨域策略
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// 使用XiHan Web API中间件
app.UseXiHanWebApi();

// 使用跨域
app.UseCors("AllowAllOrigins");
```

## API 版本控制

XiHan.Framework 支持 API 版本控制：

```csharp
// 配置API版本
builder.Services.AddXiHanApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

// 在控制器中使用版本
[ApiVersion("1.0")]
[ApiController]
[Route("api/v{version:apiVersion}/products")]
public class ProductsV1Controller : XiHanControllerBase
{
    // V1版本接口实现
}

[ApiVersion("2.0")]
[ApiController]
[Route("api/v{version:apiVersion}/products")]
public class ProductsV2Controller : XiHanControllerBase
{
    // V2版本接口实现
}
```

## 过滤器

XiHan.Framework 提供多种过滤器定制 API 行为：

### 1. 异常过滤器

自动处理并格式化 API 异常：

```csharp
// 注册全局异常过滤器
builder.Services.AddControllers(options =>
{
    options.Filters.Add<XiHanExceptionFilter>();
});

// 异常过滤器实现
public class XiHanExceptionFilter : IExceptionFilter
{
    private readonly ILogger<XiHanExceptionFilter> _logger;
    private readonly IWebHostEnvironment _env;

    public XiHanExceptionFilter(
        ILogger<XiHanExceptionFilter> logger,
        IWebHostEnvironment env)
    {
        _logger = logger;
        _env = env;
    }

    public void OnException(ExceptionContext context)
    {
        _logger.LogError(context.Exception, context.Exception.Message);

        // 创建标准错误响应
        var result = new Result
        {
            Succeeded = false,
            Message = _env.IsDevelopment()
                ? context.Exception.Message
                : "发生了内部服务器错误",
            ErrorCode = "ERR-500"
        };

        // 设置响应
        context.Result = new ObjectResult(result)
        {
            StatusCode = 500
        };

        context.ExceptionHandled = true;
    }
}
```

### 2. 模型验证过滤器

自动处理模型验证错误：

```csharp
// 注册模型验证过滤器
builder.Services.AddControllers(options =>
{
    options.Filters.Add<XiHanValidationFilter>();
});

// 模型验证过滤器实现
public class XiHanValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            var errors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            var result = new Result
            {
                Succeeded = false,
                Message = "验证失败",
                ErrorCode = "ERR-400",
                // 附加验证错误详情
                Errors = errors
            };

            context.Result = new BadRequestObjectResult(result);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }
}
```

### 3. 性能过滤器

监控 API 性能：

```csharp
// 注册性能过滤器
builder.Services.AddControllers(options =>
{
    options.Filters.Add<XiHanPerformanceFilter>();
});

// 性能过滤器实现
public class XiHanPerformanceFilter : IActionFilter
{
    private readonly ILogger<XiHanPerformanceFilter> _logger;
    private Stopwatch _timer;

    public XiHanPerformanceFilter(ILogger<XiHanPerformanceFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        _timer = Stopwatch.StartNew();
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        _timer.Stop();
        var elapsed = _timer.ElapsedMilliseconds;

        if (elapsed > 500) // 设置性能阈值
        {
            var controllerName = context.RouteData.Values["controller"];
            var actionName = context.RouteData.Values["action"];

            _logger.LogWarning($"性能警告: {controllerName}.{actionName} 耗时 {elapsed}ms");
        }
    }
}
```

## API 文档

XiHan.Framework 集成 Swagger 自动生成 API 文档：

```csharp
// 配置Swagger
builder.Services.AddXiHanSwagger(options =>
{
    options.Title = "XiHan API";
    options.Description = "XiHan API Documentation";
    options.Version = "v1";
    options.ContactName = "XiHan Team";
    options.ContactEmail = "support@xihanfun.com";
    options.EnableAnnotations = true;
    options.EnableXmlComments = true;
    options.EnableAuthorizationUi = true;
});

// 使用Swagger
app.UseXiHanSwagger();
```

### 自定义 Swagger 文档

```csharp
// 使用特性添加API信息
[ApiController]
[Route("api/products")]
[SwaggerTag("产品管理")]
public class ProductsController : XiHanControllerBase
{
    /// <summary>
    /// 获取所有产品
    /// </summary>
    /// <remarks>
    /// 此API返回系统中的所有产品列表。
    /// </remarks>
    /// <returns>产品列表</returns>
    /// <response code="200">成功返回产品列表</response>
    /// <response code="401">未授权访问</response>
    [HttpGet]
    [ProducesResponseType(typeof(Result<List<ProductDto>>), 200)]
    [ProducesResponseType(401)]
    public async Task<ActionResult<Result<List<ProductDto>>>> GetProducts()
    {
        // 实现...
    }
}
```

## 中间件

XiHan.Framework 提供多种中间件优化 API 性能和安全性：

### 1. 请求响应日志中间件

记录所有 API 请求和响应：

```csharp
// 配置请求响应日志中间件
builder.Services.AddXiHanMiddleware(options =>
{
    options.UseRequestResponseLogging = true;
    options.RequestResponseLoggingOptions = new RequestResponseLoggingOptions
    {
        LogRequestHeaders = true,
        LogResponseHeaders = true,
        LogRequestBody = true,
        LogResponseBody = true,
        ExcludePaths = new[] { "/api/health", "/api/metrics" }
    };
});
```

### 2. API 限流中间件

防止 API 滥用：

```csharp
// 配置API限流中间件
builder.Services.AddXiHanMiddleware(options =>
{
    options.UseRateLimiting = true;
    options.RateLimitingOptions = new RateLimitingOptions
    {
        GlobalLimit = 1000, // 每分钟最多请求数
        IpLimit = 100, // 每个IP每分钟最多请求数
        IpWhitelist = new[] { "127.0.0.1", "::1" }
    };
});
```

### 3. API 压缩中间件

压缩 API 响应提高性能：

```csharp
// 配置API响应压缩
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
    options.Providers.Add<BrotliCompressionProvider>();
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] { "application/json" });
});

// 使用响应压缩
app.UseResponseCompression();
```

## 健康检查

监控 API 服务健康状态：

```csharp
// 配置健康检查
builder.Services.AddXiHanHealthChecks(options =>
{
    // 添加数据库健康检查
    options.AddDbContextCheck<ApplicationDbContext>();

    // 添加Redis健康检查
    options.AddRedisCheck(builder.Configuration.GetConnectionString("Redis"));

    // 添加自定义健康检查
    options.AddCheck("Custom", () => HealthCheckResult.Healthy());
});

// 使用健康检查
app.UseXiHanHealthChecks("/health");
```

## 最佳实践

### 1. 控制器组织

按领域或功能模块组织控制器：

```
XiHan.BasicApp.Api/
  ├── Controllers/
  │   ├── AccountController.cs    # 帐户相关API
  │   ├── ProductsController.cs   # 产品相关API
  │   ├── OrdersController.cs     # 订单相关API
  │   └── ReportsController.cs    # 报表相关API
```

### 2. 分层架构

遵循清晰的 API 分层架构：

```
Controller层：处理HTTP请求和响应，不包含业务逻辑
↓
Application层：实现业务逻辑和用例
↓
Domain层：核心业务实体和业务规则
↓
Infrastructure层：数据访问和外部服务集成
```

示例：

```csharp
// 控制器层 - 处理HTTP请求
public class ProductsController : XiHanControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Result<ProductDto>>> GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound("产品不存在");
        }

        return Success(product);
    }
}

// 应用层 - 实现业务逻辑
public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository productRepository, IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return _mapper.Map<ProductDto>(product);
    }
}
```

### 3. API 安全实践

实施 API 安全最佳实践：

- 使用 HTTPS 加密传输
- 实施身份验证和授权
- 使用 CSRF 令牌防止跨站请求伪造
- 实施 API 输入验证
- 限制敏感数据暴露
- 实施 API 限流防止滥用

```csharp
// 配置API安全
builder.Services.AddXiHanSecurity(options =>
{
    options.UseHttps = true;
    options.UseCors = true;
    options.UseAuthentication = true;
    options.UseAuthorization = true;
    options.UseRateLimiting = true;
    options.UseContentSecurityPolicy = true;
});
```

## 下一步

- 了解 [身份认证](./identity) 模块的安全特性
- 学习 [缓存](./cache) 模块的性能优化技术
- 探索 [消息队列](./messaging) 模块的异步通信功能
