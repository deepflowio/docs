> This document was translated by GPT-4

---

title: Application Request Log
permalink: /features/universal-map/request-log

---

Without the need to insert any code into the application, DeepFlow automatically generates request logs for all services.
Database table name: `flow_log.l7_flow_log`.

# Tags

List of automatically injected tags includes: IP, protocol, port, request/response fields, collection location, process information, cloud resources, K8s resources, and custom K8s labels. Detailed field descriptions are below.

[csv-IP, protocol, port, request/response fields, collection location, process information, cloud resources, K8s resources](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.ch)

# Metrics

Metrics list: throughput, latency, exceptions. Detailed field descriptions are as follows.

[csv-throughput, latency, exceptions](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.ch)

# Grafana Dashboard

Based on the aforementioned data, a comprehensive Dashboard can be constructed through Grafana. We have preset an 'Application - Request Log' Dashboard in Grafana, and the effect is as follows:

![Application Request Log](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202208236304413d69d7c.png)

You can also visit [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Application_Request_Log/application-request-log?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) to see the effect.
