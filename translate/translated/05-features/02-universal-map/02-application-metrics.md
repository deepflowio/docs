---
title: Application Performance Metrics
permalink: /features/universal-map/application-metrics
---

> This document was translated by ChatGPT

# Service List

Without inserting any code into the application, DeepFlow automatically generates application performance metrics for all services.
Database table name: `flow_metrics.application`.

## Tags

List of automatically injected tags: IP, protocol, port, collection location, cloud resources, K8s resources, K8s custom labels. Detailed field descriptions are as follows.

[csv-IP, protocol, port, collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/application.en)

## Metrics

Metrics list: throughput, latency, anomalies. Detailed field descriptions are as follows.

[csv-throughput, latency, anomalies](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.en)

## Grafana Dashboard

Based on the above data, you can build rich dashboards through Grafana. We have preset an `Application - K8s Pod` dashboard in Grafana, as shown below:

![Application K8s Pod](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208236304362eb5efd.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Application_K8s_Pod/application-k8s-pod?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.

# Universal Service Map

Without inserting any code into the application, DeepFlow automatically generates full-stack access paths and application performance metrics for all services.
Database table name: `flow_metrics.application_map`.

## Tags

List of automatically injected tags: IP, protocol, port, collection location, cloud resources, K8s resources, K8s custom labels. Detailed field descriptions are as follows.

[csv-IP, protocol, port, collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/application_map.en)

## Metrics

Metrics list: throughput, latency, anomalies. Detailed field descriptions are as follows.

[csv-throughput, latency, anomalies](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application_map.en)

## Grafana Dashboard

Based on the above data, you can build rich dashboards through Grafana. We have preset an `Application - K8s Pod Map` dashboard in Grafana, as shown below:

![Application K8s Pod Map](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208236304413c79b43.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Application_K8s_Pod_Map/application-k8s-pod-map?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.
