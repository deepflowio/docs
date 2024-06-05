---
title: Network Flow Log
permalink: /features/universal-map/flow-log
---

> This document was translated by ChatGPT

Without needing to place any code into an application,
DeepFlow automatically generates network flow logs for all services.

Database table name: `flow_log.l4_flow_log`.

# Tags

Here is the list of automatically injected Tags: IP, protocol, port, network packet header fields, data collection location, cloud resources, K8s resources, K8s custom Labels. The detailed descriptions of these fields are as follows.

[csv-IP, protocol, port, network packet header fields, data collection location, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l4_flow_log.en)

# Metrics

Metrics list: throughput, load, latency, TCP exceptions, retransmissions, zero window. The detailed descriptions of these fields are as follows.

[csv-throughput, load, latency, TCP exceptions, retransmissions, zero window](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l4_flow_log.en)

# Grafana Dashboard

Based on the mentioned data, a rich Dashboard can be built via Grafana. We have predefined a `Network - Flow Log` Dashboard in Grafana. The result is as follows:

![Network Flow Log](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20220823630441427cfa5.png)
