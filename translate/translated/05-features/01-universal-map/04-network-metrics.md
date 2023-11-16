---
title: Network Performance Metrics
permalink: /features/universal-map/network-metrics
---

> This document was translated by GPT-4

# Service List

Without any need for code insertion into applications, DeepFlow automatically generates network performance metrics for all services.
Database table name: `flow_metrics.vtap_flow_port`.

## Tags

A list of automatically injected tags: IP, protocol, port, sampling location, cloud resources, K8s resources, K8s custom labels, detailed field description as follows.

[csv-IP, protocol, port, sampling location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch)

## Metrics

Metrics list: throughput, load, delay, TCP abnormal, retransmission, zero window, detailed field description as follows.

[csv-throughput, load, delay, TCP abnormal, retransmission, zero window](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_flow_port.ch)

## Grafana Dashboard

Based on the above data, a rich Dashboard can be built through Grafana. We have pre-set a `Network - K8s Pod` Dashboard in Grafana, as shown below:

![Network K8s Pod](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022082363044143504e0.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_K8s_Pod/network-k8s-pod?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.

# Universal Service Map

Without any need for code insertion into applications, DeepFlow automatically generates all service stack access paths and network performance metrics.
Database table name: `flow_metrics.vtap_flow_edge_port`.

## Tags

A list of automatically injected tags: IP, protocol, port, sampling location, cloud resources, K8s resources, K8s custom labels, detailed field description as follows.

[csv-IP, protocol, port, sampling location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_edge_port.ch)

## Metrics

Metrics list: throughput, load, delay, TCP abnormal, retransmission, zero window, detailed field description as follows.

[csv-throughput, load, delay, TCP abnormal, retransmission, zero window](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_flow_edge_port.ch)

## Grafana Dashboard

Based on the above data, a rich Dashboard can be built through Grafana. We have pre-set a `Network - K8s Pod Map` Dashboard in Grafana, as shown below:

![Network K8s Pod Map](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022082363044143e589f.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_K8s_Pod_Map/network-k8s-pod-map?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.
