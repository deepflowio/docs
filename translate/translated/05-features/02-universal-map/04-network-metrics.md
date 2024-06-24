---
title: Network Performance Metrics
permalink: /features/universal-map/network-metrics
---

> This document was translated by ChatGPT

# Service List

Without inserting any code into the application, DeepFlow automatically generates all network performance metrics for services.
Database table name: `flow_metrics.network`.

## Tags

List of automatically injected tags: IP, protocol, port, collection location, cloud resources, K8s resources, K8s custom labels. Detailed field descriptions are as follows.

[csv-IP, protocol, port, collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/network.en)

## Metrics

List of metrics: throughput, load, latency, TCP anomalies, retransmissions, zero window. Detailed field descriptions are as follows.

[csv-throughput, load, latency, TCP anomalies, retransmissions, zero window](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en)

## Grafana Dashboard

Based on the above data, you can build rich dashboards through Grafana. We have pre-configured a `Network - K8s Pod` dashboard in Grafana, as shown below:

![Network K8s Pod](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022082363044143504e0.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_K8s_Pod/network-k8s-pod?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.

# Universal Service Map

Without inserting any code into the application, DeepFlow automatically generates the full-stack access paths and network performance metrics for all services.
Database table name: `flow_metrics.network_map`.

## Tags

List of automatically injected tags: IP, protocol, port, collection location, cloud resources, K8s resources, K8s custom labels. Detailed field descriptions are as follows.

[csv-IP, protocol, port, collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/network_map.en)

## Metrics

List of metrics: throughput, load, latency, TCP anomalies, retransmissions, zero window. Detailed field descriptions are as follows.

[csv-throughput, load, latency, TCP anomalies, retransmissions, zero window](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network_map.en)

## Grafana Dashboard

Based on the above data, you can build rich dashboards through Grafana. We have pre-configured a `Network - K8s Pod Map` dashboard in Grafana, as shown below:

![Network K8s Pod Map](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022082363044143e589f.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_K8s_Pod_Map/network-k8s-pod-map?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.