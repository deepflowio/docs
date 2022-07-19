---
title: 网络流日志
---

无需向应用中插入任何代码，DeepFlow 自动生成所有服务的网络流日志：
- 数据库表名：`flow_log.l4_flow_log`
- 自动注入的 Tag 列表：[IP、协议、端口、网络包头字段、采集位置、云资源、K8s 资源](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l4_flow_log)、K8s 自定义 Label
- Metrics 列表：[吞吐、负载、时延、TCP异常、重传、零窗](https://github.com/metaflowys/metaflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l4_flow_log)

基于上述数据可通过 Grafana 构建丰富的 Dashboard。我们在 Grafana 中预置了一个 `Network - Flow Log` Dashboard，效果图如下：

![Network Flow Log](./imgs/network-flow-log.png)

你也可以访问 [DeepFlow Online Demo](https://demo.metaflow.yunshan.net/d/gkDAcU6nk/network-flow-log?from=metaflow-doc) 查看效果。
