---
title: MCP Server
permalink: /integration/output/query/mcp-server
---

# 首个 eBPF MCP Server 正式发布

DeepFlow 基于 eBPF 技术，为云原生应用提供零代码侵入的全栈可观测性数据，涵盖服务全景图、分布式链路追踪以及持续性能剖析等核心功能。随着 AI 智能体技术的快速发展和在开发者工作流中的深度应用，可观测性工具面临着与 AI 生态集成的挑战。我们正式对外发布 eBPF MCP Server (https://github.com/deepflowio/deepflow/tree/main/server/mcp)。当前版本重点提供持续性能剖析功能，可使各类 AI 智能体直接获取到函数级别的精细化性能分析结果。

> Model Context Protocol (MCP) 是 Anthropic 推出的开放协议，专门用于 AI 模型与外部工具的标准化交互。MCP 定义了统一的接口规范，具有显著的优势：标准化接口、生态互通性、天然的扩展性。

![eBPF MCP Server](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20250626114123.png)

# 实战演示 - AI Coding 中的性能分析体验

我们通过构建一个具有典型性能瓶颈的 Go 应用程序，演示 DeepFlow MCP Server 在 AI 增强开发环境中的实际应用效果。本演示场景模拟了生产环境中常见的性能退化问题，展示 Cursor 如何通过 MCP 协议直接调用 DeepFlow MCP Server 获取持续性能剖析分析结果。整个技术流程涵盖从性能异常检测、热点函数识别，到结合特定 commit 的代码变更进行根因分析，最终输出具有可操作性的代码级优化建议的完整分析链路。

[AI Coding 实战演示](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/mov/586ca897a5b80c0f443dde84a99f0c99_20250626164636.mov)

# 立即上手 - Cursor 完整接入教程

> 接入教程以 K8s 环境为例。

**Step 1 在应用运行环境中部署 DeepFlow**

DeepFlow 部署（参考官网[部署文档](https://deepflow.io/docs/zh/ce-install/overview/)），开启持续剖析功能（参考官网[配置方法文档](https://deepflow.io/docs/zh/features/continuous-profiling/configuration/)）

![DeepFlow 持续剖析](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20250626115101.png)

**Step 2 Pod 注入 git_commit_id label**

为了实现基于 git commit id 的性能数据查询，需要在应用 Pod 上注入 git_commit_id label。生产环境建议通过 CI/CD 流程自动注入，本教程以手动修改 YAML 为例：

```yaml
template:
  metadata:
    labels:
      git_commit_id: 7ea306a6dca26d54e65e350439cf8bd0d41c9482
```

**Step 3 Cursor 中配置 DeepFlow MCP Server**

在项目目录下的 .cursor 文件夹下，增加 mcp.json 文件，输入如下内容（其中 mcp server 端口默认为 20080）：

```json
{
  "mcpServers": {
    "DeepFlow_Git_Commit_Profile": {
      "url": "http://$deepflow_controller_ip:20080/mcp",
      "headers": {}
    }
  }
}
```

**Step 4 打开 Cursor 的 AI Chat**

在 Cursor AI Chat 中输入需要分析的 commit id，AI 将自动获取该版本的性能分析报告。注意：确保该 commit 对应的应用已部署到 DeepFlow 监控环境中，且已采集到性能剖析数据。

![Cursor AI Chat](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20250626115236.png)
