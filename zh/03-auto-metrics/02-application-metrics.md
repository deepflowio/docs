---
title: 应用性能指标
---

# 服务

无需向应用中插入任何代码，DeepFlow 自动生成所有服务的应用性能指标：
- 数据库表名：`flow_metrics.vtap_app_port`
- 自动注入的 Tag 列表：[IP、协议、端口、采集位置、云资源、K8s 资源](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_app_port)、K8s 自定义 Label
  - 支持的应用协议列表：[L7 Protocol List](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)
- Metrics 列表：[吞吐、时延、异常](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_app_port)

基于上述数据可通过 Grafana 构建丰富的 Dashboard。我们在 Grafana 中预置了一个 `Application - K8s Pod` Dashboard，效果图如下：

![Application K8s Pod](./imgs/application-k8s-pod.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/n7vt1RR4k/application-k8s-pod?from=deepflow-doc) 查看效果。

# 路径和拓扑

无需向应用中插入任何代码，DeepFlow 自动生成所有服务访问路径的应用性能指标：
- 数据库表名：`flow_metrics.vtap_app_edge_port`
- 自动注入的 Tag 列表：[IP、协议、端口、采集位置、云资源、K8s 资源](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_app_edge_port)、K8s 自定义 Label
  - 支持的应用协议列表：[L7 Protocol List](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)
- Metrics 列表：[吞吐、时延、异常](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_app_edge_port)

基于上述数据可通过 Grafana 构建丰富的 Dashboard。我们在 Grafana 中预置了一个 `Application - K8s Pod` Dashboard，效果图如下：

![Application K8s Pod Map](./imgs/application-k8s-pod-map.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/RPBaBRg4z/application-k8s-pod-map?from=deepflow-doc) 查看效果。
