# XiHan.Framework.AI.Abstractions

> AI 抽象：AI 服务接口与契约

- **NuGet**：`XiHan.Framework.AI.Abstractions`
- **模块类**：`—（无模块类，直接引用）`
- **所在层**：基础设施层

## 这是什么

这个包只放 AI 相关的接口与契约，不含任何具体实现。它把「会话、Agent、多 provider 选择、提示词库、RAG（检索增强生成）」抽成一组接口，让上层代码只依赖抽象；真正的实现由 `XiHan.Framework.AI` 提供，应用层（如把 provider 配置存进数据库）也能通过实现这些接口来替换默认行为。

## 何时使用

- 你的库/模块需要引用 AI 会话或 RAG 契约，但不想拉入具体实现与第三方 SDK
- 你要提供自定义的 provider 配置源、提示词库或向量检索实现，替换框架默认项
- 想以 provider 名解耦模型调用，而不把某个厂商写死在业务里

## 安装

```bash
dotnet add package XiHan.Framework.AI.Abstractions
```

## 启用

无模块类。直接引用即可，无需 `[DependsOn]`；具体实现与服务注册由 `XiHan.Framework.AI` 的 `XiHanAIModule` 负责。

## 核心能力

- **会话门面契约**：`IXiHanAiService` 定义一次对话 / 流式对话，薄封装 `Microsoft.Extensions.AI` 的 `IChatClient`，只加「多 provider 选择」这层语义
- **多 provider 解析**：`IAiChatClientResolver` / `IAiEmbeddingGeneratorResolver` 按 provider 名取已构建好的会话客户端 / 嵌入生成器，并支持 `Invalidate` 配置热切换
- **可插拔配置源**：`IAiProviderConfigStore` 抽象 provider 配置来源（默认读 Options，应用层可换 DB store），配置载体是 `AiProviderOptions`
- **Agent 与技能**：`IXiHanAgentFactory` 基于 Microsoft Agent Framework 构建 `AIAgent`；`IAiSkill` / `IAiSkillRegistry` 把应用注册的命名能力暴露为对话工具与 MCP tool
- **RAG 契约**：`IChunkingStrategy`（切片）、`IKnowledgeIngestor`（摄取）、`IKnowledgeRetriever`（检索）、`IRagPromptAugmenter`（提示增强）
- **提示词库**：`IAiPromptStore` / `AiPromptTemplate` 抽象可版本化的提示模板来源

## 主要类型

| 类型 | 说明 |
| --- | --- |
| `IXiHanAiService` | AI 会话服务门面（一次对话 / 流式对话） |
| `IAiChatClientResolver` | 按 provider 名解析 `IChatClient`，含 `Invalidate` 热切换 |
| `IAiEmbeddingGeneratorResolver` | 按 provider 名解析嵌入生成器（RAG 用） |
| `IAiProviderConfigStore` | provider 配置来源抽象（Options 兜底 / 应用层可换 DB） |
| `AiProviderOptions` | 单个 provider 配置：密钥 / 端点 / 会话模型 / 嵌入模型 / 采样 |
| `IXiHanAgentFactory` | 从 provider 解析器构建 Microsoft Agent Framework 的 `AIAgent` |
| `IAiSkill` / `IAiSkillRegistry` | 命名 AI 技能与注册表（暴露为对话工具 / MCP tool） |
| `IKnowledgeIngestor` / `IKnowledgeRetriever` | RAG 摄取与检索契约 |
| `IChunkingStrategy` / `IRagPromptAugmenter` | 文本切片策略 / 检索片段注入提示 |
| `IAiPromptStore` / `AiPromptTemplate` | 提示词库抽象与模板 |

## 依赖模块

- 无框架内部依赖（不引用任何 `XiHan.Framework.*`）
- 第三方核心：**Microsoft.Extensions.AI.Abstractions**（`IChatClient` / `IEmbeddingGenerator`）+ **Microsoft.Agents.AI.Abstractions**（Agent 抽象）

## 相关模块

- [XiHan.Framework.AI](./ai)（这些抽象的默认实现）
