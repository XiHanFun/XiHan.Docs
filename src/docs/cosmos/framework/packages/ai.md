# XiHan.Framework.AI

> AI 集成：Semantic Kernel、智能代理、MCP 协议支持

- **NuGet**：`XiHan.Framework.AI`
- **模块类**：`XiHanAIModule`
- **所在层**：基础设施层

## 这是什么

这个包是 AI 抽象（`XiHan.Framework.AI.Abstractions`）的默认实现，基于 `Microsoft.Extensions.AI` 与 Microsoft Agent Framework 提供开箱即用的会话、Agent、嵌入与 RAG 能力。它统一了「多 provider 选择」与「配置热切换」，并能把应用注册的技能通过 MCP（Model Context Protocol）暴露给外部 AI 客户端（如 Claude Code / Cursor）。多数 provider（OpenAI / DeepSeek / Ollama / vLLM 等）走 OpenAI 兼容协议，一个适配器即可覆盖。

## 何时使用

- 需要以统一门面调用大模型（一次对话 / 流式对话），并按 provider 名切换厂商
- 需要基于 provider 的嵌入生成 + RAG 检索增强（切片 / 摄取 / 检索 / 提示增强）
- 想构建带工具调用与多轮记忆的智能代理（Agent）
- 想把应用侧「技能」暴露为 MCP tools，供外部 AI 客户端调用

## 安装

```bash
dotnet add package XiHan.Framework.AI
```

## 启用

```csharp
[DependsOn(typeof(XiHanAIModule))]
public class MyModule : XiHanModule { }
```

模块在 `ConfigureServices` 里调用 `AddXiHanAI` 与 `AddXiHanRAG`，注册 provider 配置源、解析器、会话门面、技能注册表、Agent 工厂与 RAG 默认实现。所有服务均以 `TryAdd*` 注册，应用层可覆盖任一默认项（如换成读数据库的 provider 配置源）。

## 核心能力

- **会话门面实现**：`XiHanAiService` 实现 `IXiHanAiService`，薄封装 M.E.AI 的 `IChatClient`——选 provider 后透传，工具调用 / 结构化输出 / 遥测缓存中间件走原生
- **多 provider 解析 + 热切换**：`AiChatClientResolver` / `AiEmbeddingGeneratorResolver` 按 provider 名构建并缓存客户端，`Invalidate` 使缓存失效以实现配置热切换
- **OpenAI 兼容适配**：`OpenAiCompatibleChatClientFactory` / `OpenAiEmbeddingGeneratorFactory` 用一套 OpenAI 兼容工厂覆盖 OpenAI / DeepSeek / Ollama / vLLM 等端点
- **可插拔配置源**：默认 `OptionsAiProviderConfigStore` 读 `XiHan:AI` 配置节兜底；应用层可换 DB store 实现 store 化配置
- **智能代理**：`XiHanAgentFactory` 基于 Microsoft Agent Framework 从 provider 解析器构建 `AIAgent`，支持工具与多轮会话
- **RAG 默认实现**：`FixedWindowChunkingStrategy`（固定窗口切片）、`DefaultKnowledgeIngestor`（摄取）、`DefaultKnowledgeRetriever`（检索）、`DefaultRagPromptAugmenter`（提示增强）
- **MCP 工具桥接**：`AddXiHanMcpServerTools` 把技能注册表投影为 MCP server tools，配合官方 `AddMcpServer()` 使用

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `XiHanAiService` | `IXiHanAiService` 默认实现（选 provider → 透传 M.E.AI） |
| `AiChatClientResolver` / `AiEmbeddingGeneratorResolver` | 多 provider 解析器（含缓存与 `Invalidate` 热切换） |
| `OpenAiCompatibleChatClientFactory` | OpenAI 兼容会话客户端工厂 |
| `OpenAiEmbeddingGeneratorFactory` | OpenAI 兼容嵌入生成器工厂 |
| `OptionsAiProviderConfigStore` | 默认 provider 配置源（读 `XiHan:AI` 配置节） |
| `XiHanAgentFactory` | Microsoft Agent Framework 的 `AIAgent` 工厂 |
| `DefaultAiSkillRegistry` | 技能注册表默认实现 |
| `SkillMcpToolsConfigurator` | 把技能投影为 MCP server tools |
| `FixedWindowChunkingStrategy` / `DefaultKnowledgeIngestor` / `DefaultKnowledgeRetriever` / `DefaultRagPromptAugmenter` | RAG 切片 / 摄取 / 检索 / 提示增强默认实现 |

## 依赖模块

- [XiHan.Framework.AI.Abstractions](./ai-abstractions)（接口与契约）
- [XiHan.Framework.Core](./core)
- [XiHan.Framework.Http](./http)（`XiHanAIModule` 依赖 `XiHanHttpModule`）
- 第三方核心：**Microsoft.Extensions.AI** / **Microsoft.Extensions.AI.OpenAI**（会话与嵌入）、**Microsoft.Agents.AI**（Agent）、**ModelContextProtocol**（MCP）、**Microsoft.Extensions.VectorData.Abstractions**（向量数据）

::: tip 部署提示
本包不注册具体 `VectorStore`——向量连接器（如 Qdrant）与嵌入模型选择属部署事项，由应用层登记（如 `AddQdrantVectorStore`）。
:::

## 相关模块

- [XiHan.Framework.AI.Abstractions](./ai-abstractions)
- [XiHan.Framework.Http](./http)
