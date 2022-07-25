---
title: 网络性能指标
permalink: /auto-metrics/network-metrics
---

# 服务

无需向应用中插入任何代码，DeepFlow 自动生成所有服务的网络性能指标：
- 数据库表名：`flow_metrics.vtap_flow_port`
- 自动注入的 Tag 列表：[IP、协议、端口、采集位置、云资源、K8s 资源](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port)、K8s 自定义 Label
- Metrics 列表：[吞吐、负载、时延、TCP异常、重传、零窗](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_flow_port)

基于上述数据可通过 Grafana 构建丰富的 Dashboard。我们在 Grafana 中预置了一个 `Network - K8s Pod` Dashboard，效果图如下：

![Network K8s Pod](./imgs/network-k8s-pod.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_K8s_Pod/network-k8s-pod?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) 查看效果。

# 路径和拓扑

无需向应用中插入任何代码，DeepFlow 自动生成所有服务访问路径的网络性能指标：
- 数据库表名：`flow_metrics.vtap_flow_edge_port`
- 自动注入的 Tag 列表：[IP、协议、端口、采集位置、云资源、K8s 资源](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_edge_port)、K8s 自定义 Label
- Metrics 列表：[吞吐、负载、时延、TCP异常、重传、零窗](https://github.com/deepflowys/deepflow/blob/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_flow_edge_port)

基于上述数据可通过 Grafana 构建丰富的 Dashboard。我们在 Grafana 中预置了一个 `Network - K8s Pod` Dashboard，效果图如下：

![Network K8s Pod Map](./imgs/network-k8s-pod-map.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_K8s_Pod_Map/network-k8s-pod-map?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) 查看效果。
