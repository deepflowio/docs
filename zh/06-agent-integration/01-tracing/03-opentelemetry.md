---
title: 集成 OpenTelemetry 数据
---

# 数据流

```mermaid
flowchart TD

subgraph K8s-Cluster
  subgraph AppPod
    OTelSDK1["otel-sdk / otel-javaagent"]
  end
  OTelAgent1["otel-collector (agent mode, daemonset)"]
  MetaFlowAgent1["metaflow-agent (daemonset)"]
  MetaFlowServer["metaflow-server (statefulset)"]

  OTelSDK1 -->|traces| OTelAgent1
  OTelAgent1 -->|traces| MetaFlowAgent1
  MetaFlowAgent1 -->|traces| MetaFlowServer
end

subgraph Host
  subgraph AppProcess
    OTelSDK2["otel-sdk / otel-javaagent"]
  end
  OTelAgent2["otel-collector (agent mode)"]
  MetaFlowAgent2[metaflow-agent]

  OTelSDK2 -->|traces| OTelAgent2
  OTelAgent2 -->|traces| MetaFlowAgent2
  MetaFlowAgent2 -->|traces| MetaFlowServer
end
```

# 配置 OpenTelemetry

TODO @嘉炜 @建昌

# 配置 MetaFlow

TODO @嘉炜

# 基于 OpenTelemetry WebStore Demo 体验

TODO @嘉炜 @建昌

https://github.com/open-telemetry/opentelemetry-demo-webstore

# 基于 Spring Boot Demo 体验

```bash
kubectl apply -f https://raw.githubusercontent.com/metaflowys/metaflow-demo/main/sb-jaeger-tracing-demo/sb-jaeger-tracing-otel-demo.yaml
```
