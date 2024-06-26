---
title: Network Flow Log
permalink: /features/universal-map/flow-log
---

> This document was translated by ChatGPT

Without inserting any code into the application, DeepFlow automatically generates network flow logs for all services.
Database table name: `flow_log.l4_flow_log`.

# Tags

List of automatically injected tags: IP, protocol, port, network header fields, collection location, cloud resources, K8s resources, K8s custom labels. Detailed field descriptions are as follows.

[csv-IP, protocol, port, network header fields, collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l4_flow_log.en)

# Metrics

List of metrics: throughput, load, latency, TCP anomalies, retransmissions, zero window. Detailed field descriptions are as follows.

[csv-throughput, load, latency, TCP anomalies, retransmissions, zero window](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l4_flow_log.en)

# Grafana Dashboard

Based on the above data, you can build rich dashboards using Grafana. We have pre-configured a `Network - Flow Log` dashboard in Grafana, as shown below:

![Network Flow Log](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20220823630441427cfa5.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Network_Flow_Log/network-flow-log?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.
