---
title: 网络流日志
---

数据存储信息：
- 表名：`flow_log.l4_flow_log`
- 自动注入的 Tag 列表：[IP、协议、端口、网络包头字段、采集位置、云资源、K8s 资源](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l4_flow_log)、K8s 自定义 Label
- Metrics 列表：[吞吐、负载、时延、TCP异常、重传、零窗](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l4_flow_log)

TODO
