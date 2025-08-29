---
title: PromQL API
permalink: /integration/output/query/promql
---

> This document was translated by ChatGPT

# Introduction

DeepFlow has supported PromQL since v6.2.1. The following Prometheus APIs are currently implemented. For direct HTTP calls, please refer to the [Prometheus API definition](https://prometheus.io/docs/prometheus/latest/querying/api/#expression-queries):

| Http Method | Path                                 | Prometheus API                    | Description                              |
| ----------- | ------------------------------------ | ---------------------------------- | ---------------------------------------- |
| GET/POST    | /prom/api/v1/query                   | /api/v1/query                      | Query data at a single point in time     |
| GET/POST    | /prom/api/v1/query_range             | /api/v1/query_range                | Query data over a time range             |
| GET         | /prom/api/v1/label/:labelName/values | /api/v1/label/<label_name>/values  | Get all label values for a metric        |
| GET/POST    | /prom/api/v1/series                  | /api/v1/series                     | Get all time series                      |

## How to Call

In DeepFlow, you can call the API as follows:

Get the server endpoint port number:

```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)
```

Example API calls:

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

## DeepFlow Metric Definition

When DeepFlow exposes metrics for PromQL queries, the metric name follows the format `${database}__${table}__${metric}__${data_precision}`. You can refer to the [AutoMetrics metric types](../../../features/universal-map/auto-metrics/#%E6%8C%87%E6%A0%87%E7%B1%BB%E5%9E%8B) definition to find the target data source you want to query. The specific rules are as follows:

| db                                                    | metrics                                     |
| ----------------------------------------------------- | ------------------------------------------- |
| `flow_log`                                            | `{db}__{table}__{metric}`                   |
| `flow_metrics` (data_precision values: `1m`/`1s`)     | `{db}__{table}__{metric}__{data_precision}` |
| `prometheus` (data written via Prometheus RemoteWrite)| `prometheus__samples__{metric}`             |

For example:

- `flow_metrics__application__request__1m`: queries the number of application-layer requests aggregated per minute  
- `flow_metrics__network__tcp_timeout__1s`: queries the number of TCP timeouts at the network layer aggregated per second  
- `flow_log__l7_flow_log__error`: queries the number of application-layer errors  

## Known Limitations

In Grafana panel operations, the currently known limitations are:

- Cannot directly query labels; you must select metrics first before selecting labels  
- When reselecting metrics, you must remove all labels first  
- Queries will fail if the metric name contains characters like `.-` that are not supported by Prometheus  

When directly querying via PromQL or writing alert rules, the currently known limitations are:

- Cannot use `~/!~` regex to search metric names  
- For metrics provided by DeepFlow, you must first determine the aggregation evaluation method using an [aggregation operator](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators) before performing the specific metric query. The functions `stdvar`, `topk`, `bottomk`, and `quantile` are not yet supported and will be added in future iterations.  

# Querying DeepFlow Metrics with PromQL

Based on the above definitions, we can query DeepFlow metrics using PromQL. Note: `determine the aggregation evaluation method first`, for example:

- Query the time series trend of all requests with HTTP `500` response codes:

```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(request_resource, response_code)
```

- If we want to see the time series trend for each specific service, add service grouping:

```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(auto_service_1, request_resource, response_code)
```

- With a 10s evaluation interval, query the TCP connection latency trend over the past 5 minutes grouped by service:

```
rate(sum(flow_metrics__network_map__rtt__1s)by(auto_service_1)[5m:10s])
```

- With a 1m evaluation interval, query the average application latency trend over the past 10 minutes grouped by service:

```
avg_over_time(avg(flow_metrics__application__rrt__1m)by(auto_service)[10m:1m])
```

# Implementing Prometheus Alerts Based on DeepFlow Metrics

With the above examples, after configuring [Prometheus RemoteRead](../../input/metrics/prometheus/#%E9%85%8D%E7%BD%AE-remote-read), you can build alert rules in Prometheus based on these metrics, for example:

- Alert for requests with latency > 1s lasting more than 1 minute:

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

We will also support directly configuring alert rules in future DeepFlow iterations, so stay tuned.