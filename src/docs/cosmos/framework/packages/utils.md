# XiHan.Framework.Utils

> 零依赖通用工具库：字符串处理、加密算法、异步编程、序列化、集合操作、反射、网络通信、文件 IO、数学计算、时间处理等。

- **NuGet**：`XiHan.Framework.Utils`
- **模块类**：—（无模块类，直接引用）
- **所在层**：公共层

## 这是什么

XiHan.Framework.Utils 是框架最底层的通用工具库，把日常开发中反复要写的杂活（加密、序列化、反射、集合处理、文件读写、时间换算等）封装成一组静态 Helper 与扩展方法。它几乎不依赖其它框架模块，几乎所有上层包都会间接用到它。

## 何时使用

- 需要现成的加密/哈希、JSON/XML/YAML 序列化、压缩、掩码脱敏等基础能力。
- 想用扩展方法简化字符串、集合、枚举、日期时间、类型反射的常见操作。
- 处理文件、目录、路径、流，或做 DNS/Ping/WebSocket/SSE 等网络辅助。
- 作为自己业务工具类的底座，避免重复造轮子。

## 安装

```bash
dotnet add package XiHan.Framework.Utils
```

## 启用

纯工具库，直接引用即可，无需 `[DependsOn]`。调用其中的静态 Helper 或扩展方法即可使用。

## 核心能力

- **安全与加密**（`Security`）：AES/DES/RSA/ECDSA/DSA/ECIES 加解密、Hash/HMAC、GUID、OTP、掩码脱敏、密码强度、随机编码。
- **序列化**（`Serialization`）：JSON、XML、YAML 的序列化与反序列化封装。
- **集合与 LINQ**（`Collections` / `Linq`）：List、Dictionary、Enumerable、Queue、Stack、Tree 等扩展。
- **反射**（`Reflections`）：类型、成员、方法、属性、字段的反射辅助。
- **文件与 IO**（`IO`）：文件、目录、路径、流、压缩处理。
- **网络**（`Net`）：DNS、Ping、IP 格式化，以及 Http / WebSocket / SSE 辅助。
- **时间与数学**（`Timing` / `Maths`）：日期时间区间、农历、计时，数字与金额格式化。
- **扩展方法**（`Extensions`）：字符串、日期时间、枚举、类型、编码、流等常用扩展。

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `ReflectionHelper` | 反射辅助，如读取入口程序集版本 |
| `HashHelper` / `AesHelper` / `RsaHelper` | 常用哈希与对称/非对称加解密 |
| `JsonHelper` | JSON 序列化/反序列化封装 |
| `FileHelper` / `DirectoryHelper` / `PathHelper` | 文件、目录、路径操作 |
| `MaskHelper` | 敏感信息掩码脱敏 |
| `StringExtensions` / `EnumExtensions` / `TypeExtensions` | 常用扩展方法集 |

## 快速示例

```csharp
// 读取入口程序集版本
var version = ReflectionHelper.GetEntryAssemblyVersion();
```

## 依赖模块

无框架内部业务依赖，仅在编译期引用 [XiHan.Framework.Analyzers](./analyzers) 做文件头规范检查，运行时等价于零依赖，直接构建在 BCL 之上。

## 相关模块

- [XiHan.Framework.Core](./core) — 核心库，构建在 Utils 之上。
- [XiHan.Framework.Metadata](./metadata) — 框架元数据，同为公共/元数据层基础包。
