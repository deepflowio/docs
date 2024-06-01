---
title: 概览
permalink: /features/l7-protocols/overview
---

# 支持的应用协议

[csv-L7 Protocol List](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)

# 调用日志字段说明

调用日志（`flow_log.l7_flow_log`）数据表存储按分钟粒度聚合的各种协议的请求日志，由 Tag 和 Metrics 两大类字段组成。

## 标签

Tag 字段：字段主要用于分组，过滤，详细字段描述如下。

[csv-querier 组件的数据库字段描述](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.ch)

## 指标

Metrics 字段：字段主要用于计算，详细字段描述如下。

[csv-querier 组件的数据库字段描述](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.ch)
