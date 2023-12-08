---
title: 概述
permalink: /guide/ee-tenant/infra/overview/
---

# 概述

DeepFlow 通过对接 Prometheus 数据，以列表的形式展示基础设施状态、CPU、内存等指标。目前支持展示`主机`及`容器`的数据。

* [主机](./host/)
* [容器](./container/)

注：使用此功能时，需将 Prometheus node_exporter 数据推送给 DeepFlow，推送方式参考[集成 Prometheus 数据](../../../integration/input/metrics/prometheus/)