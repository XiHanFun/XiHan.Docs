# XiHan.Framework 核心模块

XiHan.Framework.Core 是框架的核心模块，提供了基础设施和基本功能，是其他所有模块的基础。本文将详细介绍核心模块的主要功能和使用方法。

## 核心功能

### 依赖注入

XiHan.Framework 基于 .NET 内置的依赖注入系统，提供了更简便的注册方式和扩展功能：

```csharp
// 在 Program.cs 中添加 XiHan 框架服务
builder.Services.AddXiHanFramework(options =>
{
    options.ApplicationName = "MyApplication";
    options.ConfigureServices = services =>
    {
        // 自定义服务配置
    };
});

// 自动注册所有服务
builder.Services.AddXiHanServices(options =>
{
    options.ScanAssemblies = new[] { typeof(Program).Assembly };
    options.AutoRegisterServices = true;
});
```

#### 服务生命周期

XiHan.Framework 支持以下几种服务生命周期，可以通过特性轻松标记：

- **Transient（瞬时）**: 每次请求都会创建新的实例
- **Scoped（作用域）**: 在同一个请求作用域内共享同一个实例
- **Singleton（单例）**: 整个应用程序只有一个实例

```csharp
// 使用特性标记服务生命周期
[TransientService]
public class MyTransientService : IMyService
{
    // 实现...
}

[ScopedService]
public class MyScopedService : IMyService
{
    // 实现...
}

[SingletonService]
public class MySingletonService : IMyService
{
    // 实现...
}

// 服务可以实现多个接口
[ScopedService(
    ServiceType = typeof(IMyService),
    AdditionalInterfaces = new[] { typeof(IMyExtraService) })]
public class MyComplexService : IMyService, IMyExtraService
{
    // 实现...
}

// 也可以通过优先级控制服务注册顺序
[ScopedService(ServiceLifetime.Scoped, Priority = 10)]
public class HighPriorityService : IMyService
{
    // 优先级高的实现...
}
```

#### 服务自动发现

XiHan.Framework 提供了服务自动发现功能，可以自动注册服务：

```csharp
// 在 Program.cs 中自动注册所有服务
builder.Services.AddXiHanServices(options =>
{
    // 配置要扫描的程序集
    options.ScanAssemblies = new[] {
        typeof(Program).Assembly,
        typeof(MyDomainLayer).Assembly,
        typeof(MyInfrastructureLayer).Assembly
    };

    // 启用自动注册
    options.AutoRegisterServices = true;

    // 自定义服务注册过滤器
    options.ServiceRegistrationFilter = type =>
        !type.Name.EndsWith("Legacy") &&
        !type.Namespace.Contains("Deprecated");
});
```

### 配置管理

XiHan.Framework 提供了强类型的配置管理功能，支持多种配置源：

```csharp
// 在 Program.cs 中注册配置
builder.Services.AddXiHanConfiguration();

// 绑定配置到强类型对象
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

// 注册配置为单例服务
builder.Services.ConfigureOptions<AppSettings>(builder.Configuration.GetSection("AppSettings"));

// 在服务中使用配置
public class MyService
{
    private readonly AppSettings _settings;

    public MyService(IOptions<AppSettings> options)
    {
        _settings = options.Value;
    }

    // 或通过 IOptionsSnapshot 获取动态更新的配置
    public MyService(IOptionsSnapshot<AppSettings> options)
    {
        _settings = options.Value;
    }
}
```

#### 配置加密

对于敏感配置，XiHan.Framework 提供了配置加密功能：

```csharp
// 使用加密配置
builder.Services.AddXiHanEncryptedConfiguration(options =>
{
    options.EncryptionKey = builder.Configuration["EncryptionKey"];
    options.EncryptionAlgorithm = EncryptionAlgorithm.AES;
    options.EncryptedSections = new[] { "ConnectionStrings", "Authentication" };
});

// 在 appsettings.json 中使用加密值
{
  "ConnectionStrings": {
    "DefaultConnection": "encrypted:A4B8C15D..."
  }
}
```

### 日志记录

XiHan.Framework 集成了 .NET 的日志系统，同时提供了更丰富的日志功能：

```csharp
// 在 Program.cs 中配置日志
builder.Services.AddXiHanLogging(options =>
{
    options.UseSerilog();
    options.MinimumLevel = LogLevel.Information;
    options.EnableEnrichers = true;
    options.AddContextEnricher = true;
    options.AddSourceContextEnricher = true;
});

// 配置 Serilog
builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/app.log", rollingInterval: RollingInterval.Day));

// 在服务中使用日志
public class MyService
{
    private readonly ILogger<MyService> _logger;

    public MyService(ILogger<MyService> logger)
    {
        _logger = logger;
    }

    public void DoSomething()
    {
        _logger.LogInformation("开始执行操作...");
        try
        {
            // 业务逻辑...
            _logger.LogInformation("操作已完成");
        }
        catch (Exception ex)
        {
            // 使用结构化日志记录异常
            _logger.LogError(ex, "执行操作时发生错误: {ErrorMessage}", ex.Message);
            throw;
        }
    }
}
```

#### 结构化日志

XiHan.Framework 支持结构化日志，便于日志分析和过滤：

```csharp
// 使用结构化参数记录日志
_logger.LogInformation("用户 {UserId} 于 {LoginTime} 登录，IP地址: {IpAddress}",
    userId, DateTime.Now, ipAddress);

// 使用日志作用域添加上下文信息
using (_logger.BeginScope(new Dictionary<string, object>
{
    ["RequestId"] = requestId,
    ["UserId"] = userId,
    ["CorrelationId"] = correlationId
}))
{
    _logger.LogInformation("处理请求...");
    // 请求处理逻辑...
    _logger.LogInformation("请求处理完成");
}
```

### 异常处理

XiHan.Framework 提供了统一的异常处理机制：

```csharp
// 在 Program.cs 中添加异常处理中间件
app.UseXiHanExceptionHandler(options =>
{
    options.ShowDetails = app.Environment.IsDevelopment();
    options.LogLevel = LogLevel.Error;
    options.ResponseStatusCode = 500;
});

// 定义业务异常基类
public abstract class BusinessException : XiHanException
{
    public BusinessException(string message, string errorCode = null)
        : base(message)
    {
        ErrorCode = errorCode;
    }

    public string ErrorCode { get; }
}

// 定义具体的业务异常
public class UserNotFoundException : BusinessException
{
    public UserNotFoundException(string userId)
        : base($"用户 {userId} 不存在", "USER-404")
    {
        UserId = userId;
    }

    public string UserId { get; }
}

// 抛出业务异常
public async Task<User> GetUserAsync(string userId)
{
    var user = await _userRepository.GetByIdAsync(userId);
    if (user == null)
    {
        throw new UserNotFoundException(userId);
    }
    return user;
}
```

#### 全局异常过滤器

对于 API 应用，可以使用全局异常过滤器：

```csharp
// 在 Program.cs 中添加全局异常过滤器
builder.Services.AddControllers(options =>
{
    options.Filters.Add<XiHanExceptionFilter>();
});

// 自定义异常过滤器
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
        _logger.LogError(context.Exception, "API请求处理过程中发生异常");

        var result = new Result
        {
            Succeeded = false,
            Message = context.Exception is BusinessException
                ? context.Exception.Message
                : "处理请求时发生错误",
            ErrorCode = context.Exception is BusinessException be
                ? be.ErrorCode
                : "SYSTEM-ERROR"
        };

        // 添加详细错误信息（仅在开发环境）
        if (_env.IsDevelopment() && !(context.Exception is BusinessException))
        {
            result.Errors = new Dictionary<string, string[]>
            {
                ["ExceptionDetails"] = new[]
                {
                    context.Exception.ToString()
                }
            };
        }

        context.Result = new ObjectResult(result)
        {
            StatusCode = context.Exception is BusinessException ? 400 : 500
        };

        context.ExceptionHandled = true;
    }
}
```

### 结果类型

XiHan.Framework 提供了统一的结果类型，用于表示操作结果：

```csharp
// 基础结果类型
public class Result
{
    public bool Succeeded { get; set; }
    public string Message { get; set; }
    public string ErrorCode { get; set; }
    public Dictionary<string, string[]> Errors { get; set; }

    // 创建成功结果
    public static Result Success(string message = null)
    {
        return new Result { Succeeded = true, Message = message };
    }

    // 创建失败结果
    public static Result Failure(string message, string errorCode = null)
    {
        return new Result
        {
            Succeeded = false,
            Message = message,
            ErrorCode = errorCode
        };
    }
}

// 泛型结果类型
public class Result<T> : Result
{
    public T Data { get; set; }

    // 创建带数据的成功结果
    public static Result<T> Success(T data, string message = null)
    {
        return new Result<T>
        {
            Succeeded = true,
            Message = message,
            Data = data
        };
    }

    // 创建带数据类型的失败结果
    public static Result<T> Failure(string message, string errorCode = null)
    {
        return new Result<T>
        {
            Succeeded = false,
            Message = message,
            ErrorCode = errorCode
        };
    }
}

// 在控制器中使用
[HttpGet("{id}")]
public async Task<ActionResult<Result<UserDto>>> GetUser(string id)
{
    try
    {
        var user = await _userService.GetUserAsync(id);
        return Result<UserDto>.Success(user);
    }
    catch (UserNotFoundException ex)
    {
        return Result<UserDto>.Failure(ex.Message, ex.ErrorCode);
    }
}

// 或使用XiHanControllerBase提供的便捷方法
[HttpGet("{id}")]
public async Task<ActionResult<Result<UserDto>>> GetUser(string id)
{
    try
    {
        var user = await _userService.GetUserAsync(id);
        if (user == null)
        {
            return NotFound("用户不存在", "USER-404");
        }
        return Success(user);
    }
    catch (Exception ex)
    {
        return Error(ex.Message);
    }
}
```

### 分页类型

XiHan.Framework 提供了统一的分页类型，用于表示分页数据：

```csharp
// 分页参数
public class PageParameters
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortField { get; set; }
    public SortOrder SortOrder { get; set; } = SortOrder.Ascending;
    public string SearchTerm { get; set; }
    public Dictionary<string, string> Filters { get; set; }
}

// 分页结果
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPrevious => PageNumber > 1;
    public bool HasNext => PageNumber < TotalPages;

    // 创建分页结果
    public static PagedResult<T> Create(
        List<T> items,
        int totalCount,
        int pageNumber,
        int pageSize)
    {
        return new PagedResult<T>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }
}

// 在服务中使用
public async Task<PagedResult<ProductDto>> GetPagedProductsAsync(PageParameters parameters)
{
    // 创建查询
    var query = _productRepository.GetAll();

    // 应用过滤
    if (!string.IsNullOrEmpty(parameters.SearchTerm))
    {
        query = query.Where(p => p.Name.Contains(parameters.SearchTerm) ||
                                p.Description.Contains(parameters.SearchTerm));
    }

    // 应用自定义过滤器
    if (parameters.Filters != null)
    {
        if (parameters.Filters.TryGetValue("category", out var category))
        {
            query = query.Where(p => p.Category.Name == category);
        }

        if (parameters.Filters.TryGetValue("minPrice", out var minPriceStr) &&
            decimal.TryParse(minPriceStr, out var minPrice))
        {
            query = query.Where(p => p.Price >= minPrice);
        }
    }

    // 获取总数
    var totalCount = await query.CountAsync();

    // 应用排序
    query = ApplySorting(query, parameters.SortField, parameters.SortOrder);

    // 应用分页
    var items = await query
        .Skip((parameters.PageNumber - 1) * parameters.PageSize)
        .Take(parameters.PageSize)
        .Select(p => _mapper.Map<ProductDto>(p))
        .ToListAsync();

    // 返回分页结果
    return PagedResult<ProductDto>.Create(
        items,
        totalCount,
        parameters.PageNumber,
        parameters.PageSize);
}

// 在API中使用
[HttpGet]
public async Task<ActionResult<Result<PagedResult<ProductDto>>>> GetProducts([FromQuery] PageParameters parameters)
{
    var result = await _productService.GetPagedProductsAsync(parameters);
    return Success(result);
}
```

## 高级功能

### 对象映射

XiHan.Framework 集成了 Mapster，提供了高性能的对象映射功能：

```csharp
// 在 Program.cs 中添加对象映射
builder.Services.AddXiHanObjectMapping(options =>
{
    options.UseMappingLibrary(MappingLibrary.Mapster);
    options.ScanAssemblies = new[] { typeof(Program).Assembly };
});

// 定义映射配置
public class MappingProfile : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<Product, ProductDto>()
            .Map(dest => dest.CategoryName, src => src.Category.Name)
            .Map(dest => dest.TotalSales, src => src.OrderItems.Sum(oi => oi.Quantity));

        config.NewConfig<CreateProductDto, Product>()
            .Map(dest => dest.CreatedDate, _ => DateTime.UtcNow)
            .Ignore(dest => dest.Id);
    }
}

// 在服务中使用对象映射
public class ProductService
{
    private readonly IObjectMapper _mapper;
    private readonly IRepository<Product> _productRepository;

    public ProductService(
        IObjectMapper mapper,
        IRepository<Product> productRepository)
    {
        _mapper = mapper;
        _productRepository = productRepository;
    }

    public async Task<ProductDto> GetProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<Product> CreateProductAsync(CreateProductDto dto)
    {
        var product = _mapper.Map<Product>(dto);
        return await _productRepository.InsertAsync(product);
    }
}
```

### 数据验证

XiHan.Framework 集成了 FluentValidation，提供了强大的数据验证功能：

```csharp
// 在 Program.cs 中添加验证
builder.Services.AddXiHanValidation(options =>
{
    options.ScanAssemblies = new[] { typeof(Program).Assembly };
    options.RegisterValidatorsAutomatically = true;
    options.ValidateOnBuild = true;
});

// 定义验证规则
public class CreateProductValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductValidator(ICategoryRepository categoryRepository)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("产品名称不能为空")
            .MaximumLength(100).WithMessage("产品名称最多100个字符");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("价格必须大于0");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("描述最多500个字符");

        RuleFor(x => x.CategoryId)
            .MustAsync(async (categoryId, cancellation) =>
            {
                var categoryExists = await categoryRepository.ExistsAsync(c => c.Id == categoryId);
                return categoryExists;
            }).WithMessage("所选类别不存在");
    }
}

// 在控制器中自动验证
[HttpPost]
public async Task<ActionResult<Result<ProductDto>>> CreateProduct(CreateProductDto dto)
{
    // 无需手动验证，框架会自动处理验证并返回适当的错误响应
    var product = await _productService.CreateProductAsync(dto);
    return Success(_mapper.Map<ProductDto>(product));
}
```

### 事件总线

XiHan.Framework 提供了事件总线功能，支持发布/订阅模式：

```csharp
// 在 Program.cs 中添加事件总线
builder.Services.AddXiHanEventBus(options =>
{
    options.ScanAssemblies = new[] { typeof(Program).Assembly };
    options.EnableRetry = true;
    options.MaxRetryAttempts = 3;
    options.RetryInterval = TimeSpan.FromSeconds(5);
});

// 定义事件
public class UserCreatedEvent : Event
{
    public string UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// 定义事件处理器
[EventHandler]
public class SendWelcomeEmailHandler : IEventHandler<UserCreatedEvent>
{
    private readonly IEmailService _emailService;
    private readonly ILogger<SendWelcomeEmailHandler> _logger;

    public SendWelcomeEmailHandler(
        IEmailService emailService,
        ILogger<SendWelcomeEmailHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task HandleAsync(UserCreatedEvent @event)
    {
        _logger.LogInformation("准备向用户 {@Username} 发送欢迎邮件", @event.Username);

        try
        {
            await _emailService.SendEmailAsync(
                to: @event.Email,
                subject: "欢迎加入我们的平台",
                body: $"你好 {@event.Username}，感谢您注册我们的服务！"
            );

            _logger.LogInformation("已成功发送欢迎邮件");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "发送欢迎邮件失败: {ErrorMessage}", ex.Message);
            throw; // 重新抛出异常以触发重试机制
        }
    }
}

// 发布事件
public class UserService
{
    private readonly IEventBus _eventBus;
    private readonly IUserRepository _userRepository;

    public UserService(
        IEventBus eventBus,
        IUserRepository userRepository)
    {
        _eventBus = eventBus;
        _userRepository = userRepository;
    }

    public async Task<User> CreateUserAsync(CreateUserDto dto)
    {
        // 创建用户
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            // 其他属性...
        };

        // 保存用户
        user = await _userRepository.InsertAsync(user);

        // 发布事件
        await _eventBus.PublishAsync(new UserCreatedEvent
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email
        });

        return user;
    }
}
```

## 最佳实践

### 项目结构

推荐的项目结构如下：

```
MyXiHanApp/
  ├── src/
  │   ├── MyXiHanApp.Domain/              # 领域模型、接口、服务
  │   │   ├── Aggregates/                 # 聚合根和领域实体
  │   │   ├── Repositories/               # 仓储接口
  │   │   ├── Services/                   # 领域服务
  │   │   └── Events/                     # 领域事件
  │   │
  │   ├── MyXiHanApp.Application/         # 应用服务和DTO
  │   │   ├── Services/                   # 应用服务实现
  │   │   ├── DTOs/                       # 数据传输对象
  │   │   ├── Mapping/                    # 对象映射配置
  │   │   └── Validators/                 # 验证器
  │   │
  │   ├── MyXiHanApp.Infrastructure/      # 基础设施实现
  │   │   ├── Data/                       # 数据访问实现
  │   │   │   ├── Context/                # 数据库上下文
  │   │   │   ├── Repositories/           # 仓储实现
  │   │   │   ├── Configurations/         # 实体配置
  │   │   │   └── Migrations/             # 数据库迁移
  │   │   │
  │   │   ├── Services/                   # 外部服务集成
  │   │   └── Logging/                    # 日志配置
  │   │
  │   └── MyXiHanApp.Web/                 # Web API 和表示层
  │       ├── Controllers/                # API控制器
  │       ├── Middleware/                 # 自定义中间件
  │       ├── Filters/                    # 过滤器
  │       └── Startup/                    # 启动配置
  │
  ├── tests/
  │   ├── MyXiHanApp.UnitTests/           # 单元测试
  │   ├── MyXiHanApp.IntegrationTests/    # 集成测试
  │   └── MyXiHanApp.FunctionalTests/     # 功能测试
  │
  └── tools/                              # 实用工具和脚本
```

### 依赖倒置原则

遵循依赖倒置原则，让高层模块不依赖于低层模块：

```csharp
// 定义接口在领域层
public interface IProductRepository
{
    Task<Product> GetByIdAsync(int id);
    Task<List<Product>> GetActiveProductsAsync();
    Task<Product> AddAsync(Product product);
    // 其他方法...
}

// 实现在基础设施层
public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Product> GetByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Product>> GetActiveProductsAsync()
    {
        return await _context.Products
            .Where(p => p.IsActive && !p.IsDeleted)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Product> AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
        return product;
    }

    // 其他方法实现...
}

// 在应用服务中使用仓储接口
public class ProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IObjectMapper _mapper;

    public ProductService(
        IProductRepository productRepository,
        IObjectMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<List<ProductDto>> GetActiveProductsAsync()
    {
        var products = await _productRepository.GetActiveProductsAsync();
        return _mapper.Map<List<ProductDto>>(products);
    }

    // 其他方法...
}
```

## 下一步

- 了解 [数据访问](./data-access) 模块的功能和使用方法
- 学习 [Web API](./web-api) 模块的开发和配置
- 探索 [身份认证](./identity) 模块的安全特性
