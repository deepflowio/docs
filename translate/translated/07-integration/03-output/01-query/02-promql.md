---
title: PromQL API
permalink: /integration/output/query/promql
---

> This document was translated by ChatGPT

# Introduction

Starting from v6.2.1, DeepFlow supports PromQL. The following Prometheus APIs are currently implemented and can be called directly via HTTP as per the [Prometheus API definition](https://prometheus.io/docs/prometheus/latest/querying/api/#expression-queries):

Http Method | Path | Prometheus API | Description
-------------|--------------------------------------|-----------------------------------|----------------------
GET/POST | /prom/api/v1/query | /api/v1/query | Query data at a single point in time
GET/POST | /prom/api/v1/query_range | /api/v1/query_range | Query data over a range of time
GET | /prom/api/v1/label/:labelName/values | /api/v1/label/<label_name>/values | Get all label values for a metric
GET/POST | /prom/api/v1/series | /api/v1/series | Get all time series

## How to Call

You can call the API in DeepFlow as follows:

Get the server endpoint port number:

```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)
```

Example of API call:

Instant Query:

```bash
time=$((`date +%s`))

curl -XPOST "http://${deepflow_server_node_ip}:${port}/prom/api/v1/query" \
--data-urlencode "query=sum(flow_log__l7_flow_log__server_error) by(request_resource, response_code)" \
--data-urlencode "time=${time}"
```

Range Query:

```bash
end=$((`date +%s`))
start=$((end-600))

curl -XPOST "http://${deepflow_server_node_ip}:${port}/prom/api/v1/query_range" \
--data-urlencode "query=sum(flow_log__l7_flow_log__server_error) by(request_resource, response_code)" \
--data-urlencode "start=${start}" \
--data-urlencode "end=${end}" \
--data-urlencode "step=60s"
```

## DeepFlow Metric Definitions

When providing PromQL queries externally, DeepFlow constructs metric names following the format `${database}__${table}__${metric}__${data_precision}`. You can refer to the [AutoMetrics Metric Types](../../../features/universal-map/auto-metrics/#%E6%8C%87%E6%A0%87%E7%B1%BB%E5%9E%8B) definition to obtain the target data source for querying. The specific rules are as follows:

db | metrics
------------------------------------------------------|----------------------------------------------
`flow_log` | `{db}__{table}__{metric}`
`flow_metrics` (data_precision values are `1m`/`1s`) | `{db}__{table}__{metric}__{data_precision}`
`prometheus` (data written via Prometheus RemoteWrite) | `prometheus__samples__{metric}`

For example:

- `flow_metrics__application__request__1m`: Represents the number of application layer requests aggregated per minute
- `flow_metrics__network__tcp_timeout__1s`: Represents the number of network layer TCP timeouts aggregated per second
- `flow_log__l7_flow_log__error`: Represents the number of application layer errors

## Known Limitations

In Grafana's panel operations, the following limitations are currently known:

- Labels cannot be queried directly; you need to select metrics first before choosing labels
- When reselecting metrics, you need to remove all labels first
- Queries will fail if the metrics name contains characters like `.-` that are not supported by Prometheus

When querying directly based on PromQL or writing alert rules, the following limitations are currently known:

- Metrics names cannot be searched using `~/!~` regex
- For metrics provided by DeepFlow, you must first determine the aggregation evaluation method using an [aggregation operator](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators) before performing specific metric queries. The functions `stdvar`, `topk`, `bottomk`, and `quantile` are not yet supported and will be supported in future iterations.

# Querying DeepFlow Metrics Based on PromQL

Based on the above definitions, we can query DeepFlow metrics using PromQL. Note to `determine the aggregation evaluation method first`, for example:

- Query the time series trend of HTTP `500` response codes for all requests:

```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(request_resource, response_code)
```

- If we want to see the time series trend for each specific service, add service grouping:

```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(auto_service_1, request_resource, response_code)
```

- Query the trend of TCP connection delay changes over the past 5 minutes with a 10s evaluation interval, grouped by service:

```
rate(sum(flow_metrics__network_map__rtt__1s)by(auto_service_1)[5m:10s])
```

- Query the trend of average application delay over the past 10 minutes with a 1m evaluation interval, grouped by service:

```
avg_over_time(avg(flow_metrics__application__rrt__1m)by(auto_service)[10m:1m])
```

# Implementing Prometheus Alerts Based on DeepFlow Metrics

With the above examples, after configuring [Prometheus RemoteRead](../../input/metrics/prometheus/#%E9%85%8D%E7%BD%AE-remote-read), you can build alert rules on Prometheus based on these metrics, such as:

- Alert for requests with latency > 1s and lasting more than 1m:

```yaml
groups:
  - name: requestMonitoring
    rules:
      - alert: requestDelayAlert
        expr: avg(flow_metrics__application__rrt__1m)by(l7_protocol, auto_service, auto_instance) / 10^6 > 1
        for: 1m
        annotations:
          summary: 'High Request Latency'
          description: '{{ $labels.auto_instance }} request to {{ $labels.auto_service }} has a high request latency above 1s (current value: {{ $value }}s)'
```

We will also support direct configuration of alert rules in future iterations of DeepFlow. Stay tuned.
