# XiHan.Framework.AI

> AI 抽象包的默认实现：基于 Microsoft.Extensions.AI + Microsoft Agent Framework 的多 provider 会话、嵌入、智能体、RAG 与 MCP 工具桥接。

- **NuGet**：`XiHan.Framework.AI`
- **模块类**：`XiHanAIModule`（`[DependsOn(typeof(XiHanHttpModule))]`）
- **所在层**：基础设施层
- **关键依赖**：**Microsoft.Extensions.AI** / **Microsoft.Extensions.AI.OpenAI**（会话与嵌入，10.7.0）、**Microsoft.Agents.AI**（Agent，1.13.0）、**ModelContextProtocol**（MCP，1.4.0）、**Microsoft.Extensions.VectorData.Abstractions**（向量数据契约，10.7.0）；框架内部依赖 AI.Abstractions / Core / Http

## 概述

这个包是 AI 抽象（`XiHan.Framework.AI.Abstractions`）的默认实现，基于 `Microsoft.Extensions.AI` 与 Microsoft Agent Framework（MAF）提供开箱即用的会话、嵌入、智能体与 RAG 能力。核心设计有三点：

1. **一个 OpenAI 兼容适配器打天下**：多数 provider（OpenAI / DeepSeek / Azure / Ollama / vLLM / 自训模型）都走 OpenAI 兼容协议，设 `BaseUrl` 指向端点 + `Model` + `ApiKey` 即可，无须每家写一个适配器。
2. **多 provider 解析 + 配置热切换**：解析器按 provider 名构建并缓存 `IChatClient` / 嵌入生成器，配置源改动后调 `Invalidate` 使缓存失效即完成热切换。
3. **可插拔配置源**：默认读 `XiHan:AI` 配置节兜底，应用层可 `AddSingleton` 覆盖为 DB store（store 化 + 多租户 + 前端可维护），对上层透明。

此外，它能把应用侧注册的「技能」通过 MCP（Model Context Protocol）暴露给外部 AI 客户端（如 Claude Code / Cursor），并提供 RAG 的切片/摄取/检索/提示增强默认实现。

## 何时使用

- 需要以统一门面调用大模型（一次对话 / 流式对话），并按 provider 名切换厂商
- 需要基于 provider 的嵌入生成 + RAG 检索增强（切片 / 摄取 / 检索 / 提示增强）
- 想构建带工具调用与多轮记忆的智能代理（`AIAgent`）
- 想把应用侧「技能」暴露为 MCP tools，供外部 AI 客户端调用

## 安装与启用

```bash
dotnet add package XiHan.Framework.AI
```

```csharp
[DependsOn(typeof(XiHanAIModule))]
public class MyModule : XiHanModule { }
```

`XiHanAIModule.ConfigureServices` 里调用 `AddXiHanAI()` 与 `AddXiHanRAG()`，注册结果（全部 `TryAdd*`，应用层可覆盖任一默认项）：

- **`AddXiHanAI()`**：绑定 `XiHanAiOptions`（配置节 `XiHan:AI`）；`IAiProviderConfigStore → OptionsAiProviderConfigStore`；`OpenAiCompatibleChatClientFactory` + `IAiChatClientResolver → AiChatClientResolver`；`OpenAiEmbeddingGeneratorFactory` + `IAiEmbeddingGeneratorResolver → AiEmbeddingGeneratorResolver`；`IXiHanAiService → XiHanAiService`；`IAiSkillRegistry → DefaultAiSkillRegistry`；`IXiHanAgentFactory → XiHanAgentFactory`。
- **`AddXiHanRAG()`**：`IChunkingStrategy → FixedWindowChunkingStrategy`；`IKnowledgeIngestor → DefaultKnowledgeIngestor`；`IKnowledgeRetriever → DefaultKnowledgeRetriever`；`IRagPromptAugmenter → DefaultRagPromptAugmenter`。

MCP 工具桥接 `AddXiHanMcpServerTools()` 不在模块内自动调用，须由 WebHost 显式调用并配合官方 `AddMcpServer()`（见「MCP 工具桥接」）。

## 工作原理

**会话链路**：`XiHanAiService.ChatAsync` → `IAiChatClientResolver.Resolve(provider)` 取 `IChatClient` → 透传 `GetResponseAsync` / `GetStreamingResponseAsync`。门面只做「选 provider + 透传」，工具调用、结构化输出全走 M.E.AI 原生。

**解析与缓存**：`AiChatClientResolver` 用 `ConcurrentDictionary` 按 provider 名（缺省用内部默认槽键）缓存 `IChatClient`。首次解析时从 `IAiProviderConfigStore.GetAsync` 读配置（无匹配则抛 `InvalidOperationException`），交 `OpenAiCompatibleChatClientFactory` 构建。`OpenAiEmbeddingGeneratorFactory` / `AiEmbeddingGeneratorResolver` 与之同构（模型取 `EmbeddingModel`）。

**热切换**：`Invalidate(providerName)` 从缓存移除并释放对应客户端——空则清全部，否则清指定 provider 及默认槽（默认可能指向它）；下次 `Resolve` 按最新配置重建。这是应用层改了 DB 里 provider 的 key/baseUrl/model 后无重启生效的关键。

**工厂细节**：`OpenAiCompatibleChatClientFactory.Create` 用 `OpenAI.Chat.ChatClient`（`BaseUrl` 空则用官方端点，否则指向兼容端点），套 `.AsIChatClient().AsBuilder().UseFunctionInvocation().Build()`，因此工具调用会自动执行。`ApiKey` 为空时用占位符 `"no-key"`（本地/兼容端点常不校验 key）。

**RAG 链路**：摄取 = 切片 → 批量 embedding → upsert 向量库；检索 = query embedding → 向量检索 → 映射片段。二者都依赖 `Microsoft.Extensions.VectorData` 的 `VectorStore`，**该 `VectorStore` 由应用层注册**（框架不注册）。

## 核心能力

- **会话门面实现**：`XiHanAiService` 实现 `IXiHanAiService`，选 provider 后透传 M.E.AI，工具/结构化输出/中间件走原生
- **多 provider 解析 + 热切换**：`AiChatClientResolver` / `AiEmbeddingGeneratorResolver` 按 provider 名构建并缓存，`Invalidate` 失效重建
- **OpenAI 兼容适配**：`OpenAiCompatibleChatClientFactory` / `OpenAiEmbeddingGeneratorFactory` 一套工厂覆盖 OpenAI / DeepSeek / Azure / Ollama / vLLM 等端点
- **可插拔配置源**：默认 `OptionsAiProviderConfigStore` 读 `XiHan:AI` 兜底；应用层可换 DB store
- **智能体**：`XiHanAgentFactory` 从解析器取 `IChatClient`，经 `chatClient.AsAIAgent(...)` 产出 MAF 原生 `AIAgent`，支持工具与多轮会话
- **技能注册表**：`DefaultAiSkillRegistry` 构造时自动收纳 DI 里全部 `IAiSkill`，也支持运行时 `Register`
- **RAG 默认实现**：`FixedWindowChunkingStrategy`（固定窗口 + 重叠切片）、`DefaultKnowledgeIngestor`、`DefaultKnowledgeRetriever`、`DefaultRagPromptAugmenter`
- **MCP 工具桥接**：`AddXiHanMcpServerTools` 把技能注册表投影为 MCP server tools

## 主要 API / 类型

| 类型 | 说明 |
| --- | --- |
| `XiHanAiService` | `IXiHanAiService` 默认实现（选 provider → 透传 M.E.AI 的 `GetResponseAsync` / `GetStreamingResponseAsync`） |
| `AiChatClientResolver` | `IAiChatClientResolver` 实现。`ConcurrentDictionary` 缓存 `IChatClient`，`IDisposable` 释放；`Invalidate` 热切换 |
| `AiEmbeddingGeneratorResolver` | `IAiEmbeddingGeneratorResolver` 实现（与会话解析器同构，模型取 `EmbeddingModel`） |
| `OpenAiCompatibleChatClientFactory` | 由 `AiProviderOptions` 构建 `IChatClient`，套 `UseFunctionInvocation` 管道；`Model` 空则抛异常 |
| `OpenAiEmbeddingGeneratorFactory` | 由 `AiProviderOptions` 构建 `IEmbeddingGenerator<string, Embedding<float>>`；`EmbeddingModel` 空则抛异常 |
| `OptionsAiProviderConfigStore` | 默认 provider 配置源，读 `IOptionsMonitor<XiHanAiOptions>`（appsettings 兜底），键即 provider 名回填 |
| `XiHanAgentFactory` | `IXiHanAgentFactory` 实现（解析器 → `IChatClient.AsAIAgent`） |
| `DefaultAiSkillRegistry` | `IAiSkillRegistry` 实现，构造时收纳 DI 全部 `IAiSkill`，线程安全、同名覆盖 |
| `SkillMcpToolsConfigurator` | `IConfigureOptions<McpServerOptions>`，把技能 `AsFunction()` 经 `McpServerTool.Create` 并入 MCP 工具集 |
| `FixedWindowChunkingStrategy` | 固定窗口 + 重叠切片；`MaxChunkSize` / `Overlap`，换行归一后按步长切分 |
| `DefaultKnowledgeIngestor` | 切片 → 批量 embedding → upsert；`RemoveDocumentAsync` 按文档删向量。依赖注入的 `VectorStore` |
| `DefaultKnowledgeRetriever` | query embedding → `VectorStore` 检索 → 映射 `RetrievedChunk`；`RetrievalFilter` 转 pre-filter 表达式 |
| `DefaultRagPromptAugmenter` | 简单模板增强（约束 + 编号片段 + 问题）；不走 Scriban，直接插值 |
| `VectorStoreKnowledgeRecord` | 向量库记录模型（`Microsoft.Extensions.VectorData` 特性），见下文 |

### DI 入口扩展方法

| 扩展方法 | 作用 |
| --- | --- |
| `IServiceCollection.AddXiHanAI()` | 注册会话/嵌入/Agent/技能全套（模块自动调用） |
| `IServiceCollection.AddXiHanRAG()` | 注册 RAG 切片/摄取/检索/增强默认实现（模块自动调用） |
| `IServiceCollection.AddXiHanMcpServerTools()` | 把技能注册表投影为 MCP server tools（须 WebHost 显式调用 + 配合官方 `AddMcpServer()`） |

### VectorStoreKnowledgeRecord 约定

`DefaultKnowledgeIngestor` / `DefaultKnowledgeRetriever` 用固定的记录模型：

- 集合名常量 `CollectionName = "xihan_knowledge"`
- 主键 `Guid Id`，由 `MakeId(documentId, index)` 用 `MD5(documentId:index)` 确定性派生（同文档同序号恒等，重建即覆盖）。用 `Guid` 是因为 Qdrant 只支持 `Guid`/`ulong` 键，`Guid` 兼容各连接器
- 过滤字段 `DocumentId` / `TenantId` 标 `IsIndexed = true` 以支持 pre-filter
- 向量维度编译期常量 `EmbeddingDimensions = 1536`（对齐 `text-embedding-3-small`）；换维度的嵌入模型须改此常量并重建集合。距离函数 `CosineSimilarity`，索引 `Hnsw`

## 配置

配置节 `XiHan:AI`（`XiHanAiOptions.SectionName`）。字段：

| 字段 | 类型 | 默认 | 含义 |
| --- | --- | --- | --- |
| `DefaultProvider` | `string?` | null | 未显式指定 provider 时用的 provider 名 |
| `Providers` | `IDictionary<string, AiProviderOptions>` | 空（键大小写不敏感） | 各 provider 配置，键为 provider 名 |

单个 `AiProviderOptions`：

| 字段 | 类型 | 默认 | 含义 |
| --- | --- | --- | --- |
| `Provider` | `string` | 空 | provider 名（键未显式填时由配置源回填） |
| `ApiKey` | `string?` | null | API 密钥（空时工厂用占位符 `no-key`） |
| `BaseUrl` | `string?` | null | 端点基址（空用 OpenAI 官方端点，否则指向兼容端点） |
| `Model` | `string` | 空 | 会话模型名（空则会话工厂抛异常） |
| `EmbeddingModel` | `string?` | null | 嵌入模型名（RAG 用；空则该 provider 不支持嵌入） |
| `MaxOutputTokens` | `int?` | null | 最大输出 token |
| `Temperature` | `float?` | null | 采样温度 |
| `TimeoutSeconds` | `int?` | null | 请求超时秒 |
| `ExtraJson` | `string?` | null | 扩展参数 JSON（新 provider 专属参数） |

示例 appsettings.json：

```json
{
  "XiHan": {
    "AI": {
      "DefaultProvider": "DeepSeek",
      "Providers": {
        "DeepSeek": {
          "ApiKey": "sk-xxx",
          "BaseUrl": "https://api.deepseek.com",
          "Model": "deepseek-chat",
          "EmbeddingModel": "text-embedding-3-small"
        },
        "Ollama": {
          "BaseUrl": "http://localhost:11434/v1",
          "Model": "qwen2.5"
        }
      }
    }
  }
}
```

## 使用示例

**解析聊天客户端并发起对话（走门面）：**

```csharp
public sealed class ChatSample(IXiHanAiService ai)
{
    public async Task<string?> AskAsync(string question, CancellationToken ct)
    {
        var messages = new[]
        {
            new ChatMessage(ChatRole.System, "你是简洁的助理。"),
            new ChatMessage(ChatRole.User, question),
        };
        var options = new XiHanChatOptions { Provider = "DeepSeek" }; // null 用默认 provider
        var response = await ai.ChatAsync(messages, options, ct);
        return response.Text;
    }
}
```

**流式对话：**

```csharp
await foreach (var update in ai.ChatStreamAsync(messages, options, ct))
{
    Console.Write(update.Text);
}
```

**注册 / 切换 provider（应用层用 DB store 覆盖 + 热切换）：**

```csharp
// 1) 覆盖默认配置源（在 AddXiHanAI 之后，TryAdd 不会顶掉先注册的显式实现）
services.AddSingleton<IAiProviderConfigStore, DbAiProviderConfigStore>();

// 2) 运维改了某 provider 的 key/baseUrl/model 后，使缓存失效即热切换
public sealed class ProviderAdmin(
    IAiChatClientResolver chatResolver,
    IAiEmbeddingGeneratorResolver embedResolver)
{
    public void OnProviderUpdated(string providerName)
    {
        chatResolver.Invalidate(providerName);
        embedResolver.Invalidate(providerName);
    }
}
```

**构建智能体并运行（MAF `AIAgent`）：**

```csharp
public sealed class AgentSample(IXiHanAgentFactory factory, IAiSkillRegistry skills)
{
    public async Task<string> RunAsync(string task, CancellationToken ct)
    {
        var tools = skills.All.Select(s => (AITool)s.AsFunction()).ToList();
        var agent = factory.Create(
            instructions: "你是 XiHan 项目助理。",
            name: "xihan-agent",
            tools: tools,
            providerName: null);
        var result = await agent.RunAsync(task, cancellationToken: ct);
        return result.Text;
    }
}
```

## 扩展点 / 自定义

所有默认实现均以 `TryAdd*` 注册，`AddSingleton` 覆盖任一即可（在 `AddXiHanAI` 之后或让 DI 顺序保证显式实现先注册）：

- **provider 配置源**：`IAiProviderConfigStore` → DB store（把 provider 从 appsettings 迁到数据库 + 前端可维护 + 多租户）；应用层负责在写入后调解析器 `Invalidate`
- **切片策略**：`IChunkingStrategy` → 语义/句子切分等
- **摄取 / 检索**：`IKnowledgeIngestor` / `IKnowledgeRetriever` → 自定义向量库交互
- **提示增强**：`IRagPromptAugmenter` → 自定义模板
- **技能供给**：`AddSingleton<IAiSkill, XxxSkill>()`，注册表构造时自动收纳
- **MCP 工具**：WebHost 中 `AddMcpServer().WithHttpTransport()` 后调 `AddXiHanMcpServerTools()`，技能即成为 MCP tool（HTTP 传输与端点映射由 WebHost 负责）

## 注意事项与最佳实践

- **向量库（Qdrant）不由本框架包注册**：`DefaultKnowledgeIngestor` / `DefaultKnowledgeRetriever` 构造依赖 `Microsoft.Extensions.VectorData` 的 `VectorStore`，而 `AddXiHanRAG` **不注册**任何具体 `VectorStore`。向量连接器与嵌入模型选择属**应用层部署事项**——应用（如 BasicApp）负责 `AddQdrantVectorStore(...)` 等登记，本框架包本身不提供 Qdrant 能力，也不引用其连接器包。若未注册 `VectorStore` 而调用 RAG 摄取/检索，会在解析这两个服务时因缺依赖失败。
- **嵌入维度硬编码**：`VectorStoreKnowledgeRecord.EmbeddingDimensions = 1536`。换用不同维度的嵌入模型必须改此常量并重建向量集合，否则 upsert/检索维度不匹配。
- **确定性主键**：切片主键由 `MD5(documentId:index)` 派生，重复摄取同一文档会覆盖旧切片（幂等）；删除须传原 `chunkCount`（`RemoveDocumentAsync`）以枚举全部键。
- **解析器缓存与热切换**：改了配置源里的 provider 参数后，必须调 `Invalidate` 才生效——缓存不会自动感知外部 DB 变更。
- **工具自动执行**：`OpenAiCompatibleChatClientFactory` 套了 `UseFunctionInvocation`，MAF 的 `ChatClientAgent` 内部也套 `FunctionInvokingChatClient`——工具/技能会被自动调用、无人工批准。当前 v1 技能均只读（知识检索）安全；将来接入有副作用的技能须自行加批准/审计。
- **RAG 提示增强不走 Scriban**：`DefaultRagPromptAugmenter` 直接字符串插值（与框架 `ITemplateService` 的 string 引擎一致，不解析 Scriban）。

## 依赖模块

- [XiHan.Framework.AI.Abstractions](./ai-abstractions)（接口与契约）
- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Http](./http)（`XiHanAIModule` 依赖 `XiHanHttpModule`）
- 第三方核心：**Microsoft.Extensions.AI** / **Microsoft.Extensions.AI.OpenAI**（会话与嵌入）、**Microsoft.Agents.AI**（Agent）、**ModelContextProtocol**（MCP）、**Microsoft.Extensions.VectorData.Abstractions**（向量数据契约）

::: warning 部署边界
本包不注册具体 `VectorStore`。向量连接器（如 Qdrant）与嵌入模型选择属部署事项，由应用层登记（如 `AddQdrantVectorStore`）。框架 AI 包本身不是「Qdrant 能力」——它只依赖 `Microsoft.Extensions.VectorData` 的抽象 `VectorStore`。
:::

## 相关模块

- [XiHan.Framework.AI.Abstractions](./ai-abstractions)
- [XiHan.Framework.Http](./http)
