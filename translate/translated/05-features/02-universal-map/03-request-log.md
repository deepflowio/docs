---
title: Application Request Log
permalink: /features/universal-map/request-log
---

> This document was translated by ChatGPT

Without the need to insert any code into the application,
DeepFlow automatically generates request logs for all services.

Database table name: `flow_log.l7_flow_log`.

# Tags

List of automatically injected tags includes: IP, protocol, port, request/response fields, collection location, process information, cloud resources, K8s resources, and custom K8s labels. Detailed field descriptions are below.

[csv-IP, protocol, port, request/response fields, collection location, process information, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.en)

# Metrics

Metrics list: throughput, latency, exceptions. Detailed field descriptions are as follows.

[csv-throughput, latency, exceptions](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.en)

# Grafana Dashboard

Based on the aforementioned data, a comprehensive Dashboard can be constructed through Grafana. We have preset an 'Application - Request Log' Dashboard in Grafana, and the effect is as follows:

![Application Request Log](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208236304413d69d7c.png)
