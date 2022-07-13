---
title: AutoTagging
---

MetaFlow Agent 需要为数据注入 VPC 和 IP 标签，使得 MetaFlow Server 可基于此扩展出所有其他的标签。对于追踪数据而言，我们希望 OpenTelemetry Agent 能为 MetaFlow Agent 标注 IP 标签，幸运的是 [k8sattributesprocessor](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/k8sattributesprocessor#section-readme) 插件正好能自动注入 Span 发送侧的 IP 地址，而 `attribute.net.peer.ip` 能由大部分 OpenTelemetry Instrumentation 自动注入。
