---
title: 网络性能指标
---

# 服务

数据存储信息：
- 表名：`flow_metrics.vtap_flow_port`
- 自动注入的 Tag 列表：[IP、协议、端口、采集位置、云资源、K8s 资源](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port)、K8s 自定义 Label
- Metrics 列表：[吞吐、负载、时延、TCP异常、重传、零窗](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_flow_port)

TODO

# 路径和拓扑

数据存储信息：
- 表名：`flow_metrics.vtap_flow_edge_port`
- 自动注入的 Tag 列表：[IP、协议、端口、采集位置、云资源、K8s 资源](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_edge_port)、K8s 自定义 Label
- Metrics 列表：[吞吐、负载、时延、TCP异常、重传、零窗](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_flow_edge_port)

TODO
