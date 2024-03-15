---
title: AutoTagging
permalink: /integration/input/profile/profile-auto-tagging
---

DeepFlow Agent 需要为数据注入 IP 标签，使得 DeepFlow Server 可基于此扩展出所有其他的标签。对于持续剖析数据而言，数据通过 HTTP 协议发送到 DeepFlow Agent 时，会获取上游客户端 IP 并注入到数据中，减少数据的中转能提高匹配准确性，例如发送到 DeepFlow Agent 时不经过中间代理而是直接发送到服务。

基于 DeepFlow 的 AutoTagging 能力，我们自动化地实现了追踪数据与其他观测数据的关联，无需开发者插入任何代码。
