---
title: 数据访问
index: false
next:
  text: "Web API"
  link: "./web-api"
---

# XiHan.Framework 数据访问

XiHan.Framework.Data 是框架的数据访问模块，提供了统一、灵活且高效的数据操作接口。本模块基于 Entity Framework Core，并进行了扩展和优化，简化数据库操作并提高开发效率。

## 基本概念

### 领域实体

在 XiHan.Framework 中，领域实体是业务模型的核心，通常包含以下特征：

```csharp
// 基础实体接口
public interface IEntity
{
    // 实体标识
}

// 基础实体基类
public abstract class Entity : IEntity
{
    // 实体属性和行为
}

// 具有 ID 的实体基类
public abstract class Entity<TKey> : Entity, IEntity<TKey>
{
    public virtual TKey Id { get; set; }
}
```

### 仓储模式

XiHan.Framework 采用仓储模式进行数据访问，隔离数据访问逻辑与业务逻辑：

```csharp
// 仓储接口
public interface IRepository<TEntity> where TEntity : class, IEntity
{
    // 查询方法
    IQueryable<TEntity> GetAll();
    Task<TEntity> GetByIdAsync(object id);

    // 添加方法
    Task<TEntity> AddAsync(TEntity entity);
    Task AddRangeAsync(IEnumerable<TEntity> entities);

    // 更新方法
    Task<TEntity> UpdateAsync(TEntity entity);

    // 删除方法
    Task DeleteAsync(TEntity entity);
    Task DeleteByIdAsync(object id);

    // 统计方法
    Task<int> CountAsync();
    Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate);
}
```

## 安装和配置

### 安装

通过 NuGet 包管理器安装：

```bash
dotnet add package XiHan.Framework.Data
```

### 基本配置

在 `Program.cs` 中配置数据库上下文：

```csharp
// 注册上下文
builder.Services.AddXiHanDbContext<ApplicationDbContext>(options =>
{
    // 使用 SQL Server
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));

    // 或使用 MySQL
    // options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    //    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")));

    // 或使用 PostgreSQL
    // options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));

    // 或使用 SQLite
    // options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 注册仓储
builder.Services.AddXiHanRepositories();
```

### 高级配置

可以通过选项配置更多高级功能：

```csharp
builder.Services.AddXiHanDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));

    // 启用敏感数据记录（仅开发环境）
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
    }

    // 配置命令超时时间
    options.CommandTimeout(30); // 30 秒

    // 启用详细错误消息
    options.EnableDetailedErrors();

    // 自动创建或迁移数据库
    options.EnableAutoMigration();

    // 配置查询跟踪行为
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});
```

## 数据库上下文

### 创建上下文

继承 `XiHanDbContext` 创建自定义上下文：

```csharp
public class ApplicationDbContext : XiHanDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // 实体集
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    // 自定义模型配置
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 应用实体配置
        modelBuilder.ApplyConfiguration(new ProductConfiguration());
        modelBuilder.ApplyConfiguration(new CategoryConfiguration());

        // 或自动应用所有实体配置
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
```

### 实体配置

使用 `IEntityTypeConfiguration<T>` 配置实体：

```csharp
public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Price)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(p => p.Description)
            .HasMaxLength(500);

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId);
    }
}
```

### 多租户支持

XiHan.Framework 内置多租户支持：

```csharp
// 实现多租户实体接口
public class Product : Entity<int>, IMultiTenant
{
    public string TenantId { get; set; }

    // 其他属性...
}

// 在上下文中配置多租户过滤器
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // 配置多租户过滤器
    this.ConfigureMultiTenant(modelBuilder);
}
```

## 仓储使用

### 基本用法

```csharp
// 使用仓储接口
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
        return await _productRepository.GetAll().ToListAsync();
    }

    // 获取指定产品
    public async Task<Product> GetProductByIdAsync(int id)
    {
        return await _productRepository.GetByIdAsync(id);
    }

    // 添加产品
    public async Task<Product> AddProductAsync(Product product)
    {
        return await _productRepository.AddAsync(product);
    }

    // 更新产品
    public async Task<Product> UpdateProductAsync(Product product)
    {
        return await _productRepository.UpdateAsync(product);
    }

    // 删除产品
    public async Task DeleteProductAsync(int id)
    {
        await _productRepository.DeleteByIdAsync(id);
    }
}
```

### 扩展仓储

可以扩展基础仓储，添加自定义功能：

```csharp
// 自定义仓储接口
public interface IProductRepository : IRepository<Product>
{
    Task<List<Product>> GetProductsByCategoryAsync(int categoryId);
    Task<List<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice);
}

// 实现自定义仓储
public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context)
        : base(context)
    {
    }

    public async Task<List<Product>> GetProductsByCategoryAsync(int categoryId)
    {
        return await GetAll()
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
    }

    public async Task<List<Product>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await GetAll()
            .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
            .ToListAsync();
    }
}

// 注册自定义仓储
builder.Services.AddTransient<IProductRepository, ProductRepository>();
```

## 工作单元模式

XiHan.Framework 提供工作单元模式，管理事务和并发：

```csharp
// 工作单元接口
public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<bool> SaveChangesAndHandleConcurrencyAsync(CancellationToken cancellationToken = default);
    IDbContextTransaction BeginTransaction();
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}

// 使用工作单元
public class OrderService
{
    private readonly IRepository<Order> _orderRepository;
    private readonly IRepository<OrderItem> _orderItemRepository;
    private readonly IUnitOfWork _unitOfWork;

    public OrderService(
        IRepository<Order> orderRepository,
        IRepository<OrderItem> orderItemRepository,
        IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Order> CreateOrderAsync(Order order, List<OrderItem> items)
    {
        using var transaction = await _unitOfWork.BeginTransactionAsync();

        try
        {
            // 添加订单
            var addedOrder = await _orderRepository.AddAsync(order);

            // 添加订单项
            foreach (var item in items)
            {
                item.OrderId = addedOrder.Id;
                await _orderItemRepository.AddAsync(item);
            }

            // 保存所有更改
            await _unitOfWork.SaveChangesAsync();

            // 提交事务
            await transaction.CommitAsync();

            return addedOrder;
        }
        catch
        {
            // 回滚事务
            await transaction.RollbackAsync();
            throw;
        }
    }
}
```

## 查询与筛选

### LINQ 查询

XiHan.Framework 支持 LINQ 查询：

```csharp
// 基本查询
var products = await _productRepository.GetAll()
    .Where(p => p.Price > 100)
    .OrderBy(p => p.Name)
    .Take(10)
    .ToListAsync();

// 包含关联数据
var productsWithCategory = await _productRepository.GetAll()
    .Include(p => p.Category)
    .ToListAsync();

// 投影查询
var productDtos = await _productRepository.GetAll()
    .Select(p => new ProductDto
    {
        Id = p.Id,
        Name = p.Name,
        Price = p.Price,
        CategoryName = p.Category.Name
    })
    .ToListAsync();
```

### 规约模式

XiHan.Framework 提供规约模式，封装复杂查询条件：

```csharp
// 规约接口
public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
    List<Expression<Func<T, object>>> Includes { get; }
    List<string> IncludeStrings { get; }
    Expression<Func<T, object>> OrderBy { get; }
    Expression<Func<T, object>> OrderByDescending { get; }
    Expression<Func<T, object>> GroupBy { get; }
    int Take { get; }
    int Skip { get; }
    bool IsPagingEnabled { get; }
}

// 规约实现
public class ProductsByPriceRangeSpecification : Specification<Product>
{
    public ProductsByPriceRangeSpecification(decimal minPrice, decimal maxPrice)
    {
        Criteria = p => p.Price >= minPrice && p.Price <= maxPrice;
        AddInclude(p => p.Category);
        AddOrderBy(p => p.Name);
    }
}

// 使用规约
var specification = new ProductsByPriceRangeSpecification(100, 200);
var products = await _productRepository.GetAsync(specification);
```

## 分页查询

XiHan.Framework 支持分页查询：

```csharp
// 分页参数
public class PaginationParams
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; }
    public bool SortDesc { get; set; }
}

// 分页结果
public class PagedResult<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}

// 分页查询
public async Task<PagedResult<Product>> GetPagedProductsAsync(PaginationParams paginationParams)
{
    var query = _productRepository.GetAll();

    // 应用排序
    if (!string.IsNullOrEmpty(paginationParams.SortBy))
    {
        query = paginationParams.SortDesc
            ? query.OrderByDescending(p => EF.Property<object>(p, paginationParams.SortBy))
            : query.OrderBy(p => EF.Property<object>(p, paginationParams.SortBy));
    }
    else
    {
        query = query.OrderBy(p => p.Id);
    }

    // 获取总数
    var totalCount = await query.CountAsync();

    // 应用分页
    var items = await query
        .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
        .Take(paginationParams.PageSize)
        .ToListAsync();

    // 返回分页结果
    return new PagedResult<Product>
    {
        Items = items,
        TotalCount = totalCount,
        PageNumber = paginationParams.PageNumber,
        PageSize = paginationParams.PageSize
    };
}
```

## 高级功能

### 软删除

XiHan.Framework 支持软删除：

```csharp
// 软删除实体接口
public interface ISoftDelete
{
    bool IsDeleted { get; set; }
    DateTime? DeletedTime { get; set; }
}

// 软删除实体基类
public abstract class SoftDeleteEntity<TKey> : Entity<TKey>, ISoftDelete
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedTime { get; set; }
}

// 应用软删除实体
public class Customer : SoftDeleteEntity<int>
{
    public string Name { get; set; }
    public string Email { get; set; }
}

// 在查询中自动过滤软删除实体
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // 配置软删除过滤器
    this.ConfigureSoftDelete(modelBuilder);
}
```

### 审计日志

自动记录实体的创建和修改信息：

```csharp
// 审计实体接口
public interface IAuditable
{
    string CreatedBy { get; set; }
    DateTime CreatedTime { get; set; }
    string LastModifiedBy { get; set; }
    DateTime? LastModifiedTime { get; set; }
}

// 审计实体基类
public abstract class AuditableEntity<TKey> : Entity<TKey>, IAuditable
{
    public string CreatedBy { get; set; }
    public DateTime CreatedTime { get; set; }
    public string LastModifiedBy { get; set; }
    public DateTime? LastModifiedTime { get; set; }
}

// 应用审计实体
public class Order : AuditableEntity<int>
{
    public string OrderNumber { get; set; }
    public decimal TotalAmount { get; set; }
}

// 配置自动审计
public class ApplicationDbContext : XiHanDbContext
{
    private readonly ICurrentUser _currentUser;

    public ApplicationDbContext(
        DbContextOptions options,
        ICurrentUser currentUser) : base(options)
    {
        _currentUser = currentUser;
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // 应用审计信息
        ApplyAuditInformation();

        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditInformation()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is IAuditable &&
                (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (IAuditable)entry.Entity;
            var now = DateTime.UtcNow;
            var userId = _currentUser.Id;

            if (entry.State == EntityState.Added)
            {
                entity.CreatedTime = now;
                entity.CreatedBy = userId;
            }

            entity.LastModifiedTime = now;
            entity.LastModifiedBy = userId;
        }
    }
}
```

### 并发控制

处理并发冲突：

```csharp
// 并发实体
public class Product : Entity<int>
{
    public string Name { get; set; }
    public decimal Price { get; set; }

    // 并发标记
    [ConcurrencyCheck]
    public byte[] RowVersion { get; set; }
}

// 配置并发检查
public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(p => p.RowVersion)
            .IsRowVersion();
    }
}

// 处理并发冲突
public async Task<bool> UpdateProductAsync(Product product)
{
    try
    {
        await _productRepository.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
    catch (DbUpdateConcurrencyException ex)
    {
        // 获取冲突实体信息
        var entry = ex.Entries.Single();
        var databaseValues = await entry.GetDatabaseValuesAsync();

        if (databaseValues == null)
        {
            // 实体已被删除
            return false;
        }

        // 处理冲突
        // 1. 放弃客户端更改，使用数据库值
        // entry.OriginalValues.SetValues(databaseValues);
        // entry.CurrentValues.SetValues(databaseValues);

        // 2. 保留客户端更改，强制更新
        // var databaseProduct = (Product)databaseValues.ToObject();
        // entry.OriginalValues.SetValues(databaseValues);

        // 3. 合并冲突变更
        // var databaseProduct = (Product)databaseValues.ToObject();
        // product.Price = databaseProduct.Price;
        // await _productRepository.UpdateAsync(product);
        // await _unitOfWork.SaveChangesAsync();

        return false;
    }
}
```

## 数据迁移

### 创建迁移

```bash
# 添加迁移
dotnet ef migrations add InitialCreate --project src/XiHan.BasicApp.Infrastructure --startup-project src/XiHan.BasicApp.Api

# 更新数据库
dotnet ef database update --project src/XiHan.BasicApp.Infrastructure --startup-project src/XiHan.BasicApp.Api

# 生成 SQL 脚本
dotnet ef migrations script --project src/XiHan.BasicApp.Infrastructure --startup-project src/XiHan.BasicApp.Api
```

### 代码中应用迁移

```csharp
// 在应用启动时应用迁移
public static async Task InitializeDatabaseAsync(IHost host)
{
    using var scope = host.Services.CreateScope();
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();

        // 初始化种子数据
        await SeedData.InitializeAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
        throw;
    }
}

// 在 Program.cs 中调用
var host = CreateHostBuilder(args).Build();
await InitializeDatabaseAsync(host);
await host.RunAsync();
```

## 性能优化

### 1. 异步操作

始终使用异步方法提高性能：

```csharp
// 使用异步方法
await _productRepository.GetByIdAsync(id);
await _unitOfWork.SaveChangesAsync();
```

### 2. 查询优化

优化查询以减少数据库负载：

```csharp
// 不跟踪查询（只读查询）
var products = await _productRepository.GetAll()
    .AsNoTracking()
    .ToListAsync();

// 选择性包含（避免过度包含）
var product = await _productRepository.GetAll()
    .Include(p => p.Category) // 只包含需要的关联
    .FirstOrDefaultAsync(p => p.Id == id);

// 投影查询（只选择需要的字段）
var productNames = await _productRepository.GetAll()
    .Where(p => p.CategoryId == categoryId)
    .Select(p => p.Name)
    .ToListAsync();
```

### 3. 批量操作

使用批量操作提高性能：

```csharp
// 批量插入
await _context.BulkInsertAsync(products);

// 批量更新
await _context.BulkUpdateAsync(products);

// 批量删除
await _context.BulkDeleteAsync(products);
```

## 最佳实践

### 1. 分层架构

推荐使用清晰的分层架构：

```
XiHan.BasicApp.Core               # 领域模型和接口
XiHan.BasicApp.Infrastructure     # 数据访问和基础设施
XiHan.BasicApp.Application        # 应用服务和业务逻辑
XiHan.BasicApp.Api                # Web API 和表示层
```

### 2. 领域驱动设计

在复杂业务场景中，采用领域驱动设计：

```csharp
// 领域实体
public class Order : AggregateRoot<int>
{
    private readonly List<OrderItem> _items = new List<OrderItem>();

    // 构造函数
    private Order() { } // 供 EF Core 使用

    public Order(int customerId, string shippingAddress)
    {
        CustomerId = customerId;
        ShippingAddress = shippingAddress;
        Status = OrderStatus.Pending;
        OrderDate = DateTime.UtcNow;
    }

    // 属性
    public int CustomerId { get; private set; }
    public string ShippingAddress { get; private set; }
    public OrderStatus Status { get; private set; }
    public DateTime OrderDate { get; private set; }
    public DateTime? CompletedDate { get; private set; }
    public decimal TotalAmount => _items.Sum(i => i.Quantity * i.UnitPrice);

    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();

    // 业务方法
    public void AddItem(int productId, string productName, decimal unitPrice, int quantity)
    {
        var existingItem = _items.FirstOrDefault(i => i.ProductId == productId);

        if (existingItem != null)
        {
            existingItem.UpdateQuantity(existingItem.Quantity + quantity);
        }
        else
        {
            var orderItem = new OrderItem(this.Id, productId, productName, unitPrice, quantity);
            _items.Add(orderItem);
        }
    }

    public void RemoveItem(int productId)
    {
        var item = _items.FirstOrDefault(i => i.ProductId == productId);

        if (item != null)
        {
            _items.Remove(item);
        }
    }

    public void Ship()
    {
        if (Status != OrderStatus.Pending)
        {
            throw new InvalidOperationException("Cannot ship an order that is not pending.");
        }

        Status = OrderStatus.Shipped;
        AddDomainEvent(new OrderShippedEvent(Id));
    }

    public void Complete()
    {
        if (Status != OrderStatus.Shipped)
        {
            throw new InvalidOperationException("Cannot complete an order that has not been shipped.");
        }

        Status = OrderStatus.Completed;
        CompletedDate = DateTime.UtcNow;
        AddDomainEvent(new OrderCompletedEvent(Id));
    }

    public void Cancel()
    {
        if (Status == OrderStatus.Shipped || Status == OrderStatus.Completed)
        {
            throw new InvalidOperationException("Cannot cancel an order that has been shipped or completed.");
        }

        Status = OrderStatus.Cancelled;
        AddDomainEvent(new OrderCancelledEvent(Id));
    }
}
```

### 3. CQRS 模式

对于复杂系统，考虑使用命令查询职责分离模式：

```csharp
// 查询
public interface IOrderQueries
{
    Task<OrderDto> GetOrderAsync(int id);
    Task<List<OrderSummaryDto>> GetCustomerOrdersAsync(int customerId);
    Task<PagedResult<OrderSummaryDto>> GetPagedOrdersAsync(PaginationParams paginationParams);
}

// 命令
public interface IOrderCommands
{
    Task<int> CreateOrderAsync(CreateOrderCommand command);
    Task AddOrderItemAsync(AddOrderItemCommand command);
    Task RemoveOrderItemAsync(RemoveOrderItemCommand command);
    Task ShipOrderAsync(ShipOrderCommand command);
    Task CompleteOrderAsync(CompleteOrderCommand command);
    Task CancelOrderAsync(CancelOrderCommand command);
}

// 命令处理器
public class OrderCommandHandler :
    ICommandHandler<CreateOrderCommand, int>,
    ICommandHandler<AddOrderItemCommand>,
    ICommandHandler<RemoveOrderItemCommand>,
    ICommandHandler<ShipOrderCommand>,
    ICommandHandler<CompleteOrderCommand>,
    ICommandHandler<CancelOrderCommand>
{
    private readonly IRepository<Order> _orderRepository;
    private readonly IRepository<Customer> _customerRepository;
    private readonly IUnitOfWork _unitOfWork;

    // 处理方法...
}
```

## 下一步

- 了解 [Web API](./web-api) 模块的功能和使用方法
- 学习 [身份认证](./identity) 模块的安全特性
- 探索 [缓存](./cache) 模块的性能优化技术
