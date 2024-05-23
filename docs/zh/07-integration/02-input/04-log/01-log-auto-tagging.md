---
title: AutoTagging
permalink: /integration/input/log/log-auto-tagging
---

DeepFlow Agent 需要为数据注入 IP 标签，使得 DeepFlow Server 可基于此扩展出所有其他的标签。对于使用了 Vector 的 [Kubernetes_Log](https://vector.dev/docs/reference/configuration/sources/kubernetes_logs/) 模块的日志数据而言，它自动发现并在日志流中附加上采集日志源的 PodName ，使得 DeepFlow 能自动地匹配上数据源。

基于 DeepFlow 的 AutoTagging 能力，我们自动化地实现了追踪数据与其他观测数据的关联，无需开发者插入任何代码。
