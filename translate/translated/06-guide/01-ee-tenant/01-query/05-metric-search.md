---
title: Metric Search Box
permalink: /guide/ee-tenant/query/metric-search/
---

> This document was translated by ChatGPT

# Metric Search Box

Currently, both the `Metrics Page` and `Chart-Edit-Search Conditions` use the `Metric Search Box`.

![Metric Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f741fb51.png)

- **① Database**: The database where the metric is located, such as Application, Network, Event, or Prometheus.
- **② Data Table**: The data table where the metric is located, such as the `Metrics (Minute Level)` or `Metrics (Second Level)` data table under the `Application` database.
- **③-⑦**: Please refer to the chapters [Service Search Box](./service-search/), [Path Search Box](./path-search/), and [Log Search Box](./log-search/).
- **⑧ Switch to PromQL Input Box**: Click the button to switch between `Simplified Search` and `PromQL Search` modes.
- **⑨ Metric Dropdown**: Select the metric you want to view. Note: You must select a metric.
- **⑩ Operator Dropdown**: Select the aggregation operator. For detailed explanations of operators, please refer to the document [Calculation Logic of Metric Operators](../../../features/universal-map/metrics-and-operators/#%E8%81%9A%E5%90%88%E7%AE%97%E5%AD%90).
- **⑪ Secondary Operator**: Select the secondary operator.
- **⑫ Disable/Enable**: Disable the metric to stop querying; enable the metric to initiate a query.
- **⑬ Add Metric**: Supports adding multiple metrics, each corresponding to a line chart.
- **⑭ Add Query**: Supports adding multiple query conditions.