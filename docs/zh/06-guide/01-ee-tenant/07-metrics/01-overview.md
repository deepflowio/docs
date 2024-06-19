---
title: 概述
permalink: /guide/ee-tenant/metrics/overview/
---

# 概述

DeepFlow 通过对接 Prometheus 数据，以列表的形式展示基础设施状态、CPU、内存等指标。目前支持展示`主机`及`容器`的数据。同时，支持搜索查看指标数据信息，以及对指定数据表添加指标模版。

* [主机](./host/)
* [容器](./container/)
* [指标查看](./metrics-viewing/)
* [指标摘要](./metrics-summary/) 
* [指标模板](./metrics-template/)

注：使用`主机`或`容器`时，需将 Prometheus node_exporter 数据推送给 DeepFlow，推送方式参考[集成 Prometheus 数据](../../integration/input/metrics/prometheus/)