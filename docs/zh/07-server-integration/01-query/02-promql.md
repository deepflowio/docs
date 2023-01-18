---
title: 通过 PromQL 查询
permalink: /server-integration/query/promql
---

v6.2.1 是第一个支持 PromQL 的版本（Alpha），文档正在更新中。

目前我们实现了如下 Prometheus API：
- GET /prom/api/v1/query
- GET /prom/api/v1/query_range
- POST /prom/api/v1/query
- POST /prom/api/v1/query_range
- GET /prom/api/v1/label/:labelName/values
- GET /prom/api/v1/series
- POST /prom/api/v1/series

目前已知的限制如下：
- 无法直接查询 labels，需要先选择 metrics 后才能选择 label
- 重新选择 metrics 时需要先将 labels 全都去掉
- metrics name 中携带`.-` 等 Prometheus 不支持的字符时查询会报错
