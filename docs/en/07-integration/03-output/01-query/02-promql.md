> This document was translated by GPT-4

---

title: PromQL API
permalink: /integration/output/query/promql

---

# Introduction

Starting from v6.2.1, DeepFlow supports PromQL, and currently the following Prometheus APIs have been implemented, which can be directly invoked through HTTP. Please refer to [Prometheus interface definition](https://prometheus.io/docs/prometheus/latest/querying/api/#expression-queries) for details:

| Http Method | Path                                 | Prometheus API                    | Description                         |
| ----------- | ------------------------------------ | --------------------------------- | ----------------------------------- |
| GET/POST    | /prom/api/v1/query                   | /api/v1/query                     | Query data at a specific time point |
| GET/POST    | /prom/api/v1/query_range             | /api/v1/query_range               | Query data within a time range      |
| GET         | /prom/api/v1/label/:labelName/values | /api/v1/label/<label_name>/values | Get all tags of a metric            |
| GET/POST    | /prom/api/v1/series                  | /api/v1/series                    | Get all time series                 |

## DeepFlow Metric Definition

When DeepFlow's metrics are provided for PromQL queries, the metric name is constructed in the format of `${database}__${table}__${metric}__${data_precision}`. You can get the target data source for the query from the [AutoMetrics Metric Type](../../../features/universal-map/auto-metrics/#%E6%8C%87%E6%A0%87%E7%B1%BB%E5%9E%8B) definition. The specific rules are as follows:

| db                                                          | metrics                                     |
| ----------------------------------------------------------- | ------------------------------------------- |
| `flow_log`                                                  | `{db}__{table}__{metric}`                   |
| `flow_metrics` (value of data_precision is `1m`/`1s`)       | `{db}__{table}__{metric}__{data_precision}` |
| `ext_metrics` (Data written through Prometheus RemoteWrite) | `ext_metrics__metrics__prometheus_{metric}` |

For example:

- `flow_metrics__vtap_app_port__request__1m`: Represents the query of the application layer request count aggregated every minute.
- `flow_metrics__vtap_flow_port__tcp_timeout__1s`: Represents the query of the network layer Tcp timeout count aggregated every second.
- `flow_log__l7_flow_log__error`: Represents the query of the number of exceptions at the application layer.

## Known Limitations

In the Grafana panel operation, the currently known limitations are:

- Unable to directly query labels, you need to select metrics before you can select labels
- When re-selecting metrics, you need to remove all labels
- The query will throw an error when the metrics name carries characters such as `.-` that Prometheus does not support.

When directly querying or writing alarm rules based on PromQL, the currently known limitations are:

- Unable to use `~/!~` to search for metrics names through regular expressions
- For metrics provided by DeepFlow, you must first determine the aggregation calculation method through [appregation operator](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators), and then perform specific metric queries. Among them, the `stdvar`, `topk`, `bottomk`, `quantile` functions are not yet supported, and will continue to be supported in future iterations.

# Query DeepFlow Metrics Based on PromQL

Based on the above definition, we can query DeepFlow metrics based on PromQL, note to `determine the aggregation calculation method first`, such as:

- Query the time series trend of http `500` response code for all requests:

```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(request_resource, response_code)
```

- If we want to see the time series trend of each specific service, add service grouping:

```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(auto_service_1, request_resource, response_code)
```

- Use an evaluation interval of 10s to query the trend of TCP connection latency in the past 5 minutes by service grouping:

```
rate(sum(flow_metrics__vtap_flow_edge_port__rtt__1s)by(auto_service_1)[5m:10s])
```

- Based on a 1m evaluation interval, query the trend of average application latency over the past 10 minutes by service grouping:

```
avg_over_time(avg(flow_metrics__vtap_app_port__rrt__1m)by(auto_service)[10m:1m])
```

# Implement Prometheus Alerts Based on DeepFlow Metrics

With the above examples in mind, after [Prometheus RemoteRead](../../input/metrics/prometheus/#%E9%85%8D%E7%BD%AE-remote-read) is configured, you can build alert rules on Prometheus based on these metrics, such as:

- Alert for requests with latency > 1s and lasting for more than 1m:

```yaml
groups:
  - name: requestMonitoring
    rules:
      - alert: requestDelayAlert
        expr: avg(flow_metrics__vtap_app_port__rrt__1m)by(l7_protocol, auto_service, auto_instance) / 10^6 > 1
        for: 1m
        annotations:
          summary: 'High Request Latenry'
          description: '{{ $labels.auto_instance }} request to {{ $labels.auto_service }} has a high request latency above 1s (current value: {{ $value }}s)'
```

We will also support direct configuration of alert rules in subsequent iterations of DeepFlow. Stay tuned.
