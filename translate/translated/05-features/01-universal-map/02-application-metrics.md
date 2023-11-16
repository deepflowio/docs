---
title: Application Performance Metrics
permalink: /features/universal-map/application-metrics
---

> This document was translated by GPT-4

# Service List

With no code insertion required in your application, DeepFlow generates application performance metrics for all services automatically. The table name in the database: `flow_metrics.vtap_app_port`.

## Tags

List of automatically injected tags: IP, protocol, port, collection location, cloud resources, K8s resources, K8s custom labels, with detailed field descriptions provided in the link below.

[csv-IP, protocol, port, collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_app_port.ch)

## Metrics

List of metrics: throughput, latency, anomalies, with detailed field descriptions provided below.

[csv-throughput, latency, anomalies](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_app_port.ch)

## Grafana Dashboard

Based on the above data, rich Dashboards can be constructed through Grafana. We have pre-set an `Application - K8s Pod` Dashboard in Grafana, the image of which is as follows:

![Application K8s Pod](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208236304362eb5efd.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Application_K8s_Pod/application-k8s-pod?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to check the effect.

# Universal Service Map

DeepFlow automatically generates the full-stack access path and application performance metrics for all services without requiring any code to be inserted into your application. The database table name: `flow_metrics.vtap_app_edge_port`.

## Tags

List of automatically injected tags: IP, protocol, port, collection location, cloud resources, K8s resources, K8s custom labels, with detailed field descriptions provided in the link below.

[csv-IP, protocol, port, collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_app_edge_port.ch)

## Metrics

List of metrics: throughput, latency, anomalies, with detailed field descriptions provided below.

[csv-throughput, latency, anomalies](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_app_edge_port.ch)

## Grafana Dashboard

Based on the above data, rich Dashboards can be constructed through Grafana. We have pre-set an `Application - K8s Pod Map` Dashboard in Grafana, the image of which is as follows:

![Application K8s Pod Map](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208236304413c79b43.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Application_K8s_Pod_Map/application-k8s-pod-map?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to check the effect.
