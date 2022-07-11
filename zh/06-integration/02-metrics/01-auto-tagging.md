---
title: AutoTagging
---

MetaFlow 通过指标数据中已有的 `pod\_name`（Telegraf）、`pod`（Prometheus）、`instance`（Prometheus） 等标签，自动计算与之相关的所有资源及 K8s 自定义 Label 标签，从而将集成的指标数据与其他观测数据打通，并提升集成数据的钻取能力。
