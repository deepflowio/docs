---
title: 网络流日志
permalink: /auto-metrics/flow-log
---

无需向应用中插入任何代码，DeepFlow 自动生成所有服务的网络流日志：
- 数据库表名：`flow_log.l4_flow_log`
- 自动注入的 Tag 列表：IP、协议、端口、网络包头字段、采集位置、云资源、K8s 资源、K8s 自定义 Label，详细字段描述如下。[csv-IP、协议、端口、网络包头字段、采集位置、云资源、K8s 资源](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l4_flow_log.ch)
- Metrics 列表：吞吐、负载、时延、TCP异常、重传、零窗，详细字段描述如下。[csv-吞吐、负载、时延、TCP异常、重传、零窗](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l4_flow_log.ch)

基于上述数据可通过 Grafana 构建丰富的 Dashboard。我们在 Grafana 中预置了一个 `Network - Flow Log` Dashboard，效果图如下：

![Network Flow Log](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20220823630441427cfa5.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_Flow_Log/network-flow-log?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) 查看效果。
