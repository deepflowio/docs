> This document was translated by GPT-4

---

title: Metric Search Box
permalink: /guide/ee-tenant/query/metric-search/

---

# Metric Search Box

Currently, both the `Metric Page` and `Sub-view-Edit-Search Condition` utilize the `Metric Search Box`.

![Metric Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f741fb51.png)

- **① Database**：The database where the metric is located, such as application, network, event, or Prometheus
- **② Data Table**：The data table where the metric is located, such as `Metric (Minute Level)` or `Metric (Second Level)` data table under the `Application` database
- **③-⑦**：Please refer to the 【[Service Search Box](./service-search/)】, 【[Path Search Box](./path-search/)】, and 【[Log Search Box](./log-search/)】 sections
- **⑧ Switch to PromQL input box**：Click the button to switch between `simplified search` and `PromQL search` modes
- **⑨ Metric Dropdown Box**：Choose the metric to be viewed, note: one metric must be selected
- **⑩ Operator Dropdown Box**：Choose the aggregation operator, for a detailed explanation of the operator please refer to the 【[Metric Operator Calculation Logic](../../../features/universal-map/metrics-and-operators/#%E8%81%9A%E5%90%88%E7%AE%97%E5%AD%90)】 document
- **⑪ Secondary Operator**：Choose the secondary operator
- **⑫ Disable/Enable**：If a metric is disabled, it will not be queried; if a metric is enabled, a query will be initiated
- **⑬ Add Metric**：Supports adding multiple metrics, each metric corresponds to a line graph
- **⑭ Add Query**： Supports adding multiple query conditions
