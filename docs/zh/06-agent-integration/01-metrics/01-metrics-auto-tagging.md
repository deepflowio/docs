---
title: AutoTagging
permalink: /agent-integration/metrics/metrics-auto-tagging
---

DeepFlow 通过指标数据中已有的 `pod_name`（Telegraf）、`pod`（Prometheus）、`instance`（Prometheus） 等标签，自动计算与之相关的所有[云资源、K8s 资源、K8s 自定义 Label](../../auto-tagging/elimilate-data-silos/) 标签，从而将集成的指标数据与其他观测数据打通，并提升集成数据的钻取能力。

有了 AutoTagging 能力之后，应用开发者不再需要苦恼于向指标数据中插入一大堆标签，所有的标签注入都会随着业务开通、上线、注册流程自动完成。除此之外 DeepFlow 的 [SmartEncoding](../../auto-tagging/smart-encoding/) 机制使得自动插入的 Tag 仅占用极低的资源开销。最后，对于 Prometheus 和 Telegraf 中已经注入的大量标签，得益于 ClickHouse 的稀疏索引机制，开发者不再需要担心存在高基数问题。
