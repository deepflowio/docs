---
title: PromQL API
permalink: /integration/output/query/promql
---

# 简介

DeepFlow 从 v6.2.1 开始支持 PromQL，目前实现了如下 Prometheus API，通过 HTTP 直接调用可参考 [Prometheus 接口定义](https://prometheus.io/docs/prometheus/latest/querying/api/#expression-queries)：

 Http Method | Path                                 | Prometheus API                    | Description
-------------|--------------------------------------|-----------------------------------|----------------------
 GET/POST    | /prom/api/v1/query                   | /api/v1/query                     | 查询一个时间点的数据
 GET/POST    | /prom/api/v1/query_range             | /api/v1/query_range               | 查询一个时间范围的数据
 GET         | /prom/api/v1/label/:labelName/values | /api/v1/label/<label_name>/values | 获取一个指标的所有标签
 GET/POST    | /prom/api/v1/series                  | /api/v1/series                    | 获取所有时序

## DeepFlow 指标定义

DeepFlow 的指标对外提供 PromQL 查询时，指标名称遵循 `${database}__${table}__${metric}__${data_precision}` 的方式构造，可以通过 [AutoMetrics 指标类型](../../../features/universal-map/auto-metrics/#%E6%8C%87%E6%A0%87%E7%B1%BB%E5%9E%8B) 的定义中，获取需要查询的目标数据源，具体规则如下：

 db                                                   | metrics
------------------------------------------------------|----------------------------------------------
 `flow_log`                                           | `{db}__{table}__{metric}`
 `flow_metrics` (data_precision 取值为`1m`/`1s`)       | `{db}__{table}__{metric}__{data_precision}`
 `ext_metrics` (通过 Prometheus RemoteWrite 写入的数据) | `ext_metrics__metrics__prometheus_{metric}`

比如：
- `flow_metrics__application__request__1m`：表示查询按每分钟粒度聚合的应用层请求数
- `flow_metrics__network__tcp_timeout__1s`：表示查询按每秒粒度聚合的网络层 Tcp 超时数
- `flow_log__l7_flow_log__error`：表示查询应用层的异常数

## 已知限制

在 Grafana 的面板操作里，目前已知的限制如下：
- 无法直接查询 labels，需要先选择 metrics 后才能选择 label
- 重新选择 metrics 时需要先将 labels 全都去掉
- metrics name 中携带`.-`等 Prometheus 不支持的字符时查询会报错

基于 PromQL 直接查询或编写告警规则时，目前已知的限制如下：
- 无法通过`~/!~`正则搜索 metrics 名称
- 对 DeepFlow 提供的指标，必须先通过 [appregation operator](https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators) 确定聚合求值方式，再进行具体的指标查询。其中，`stdvar`、`topk`、`bottomk`、`quantile` 这几个函数尚未支持，将会在后续的迭代中继续支持。

# 基于 PromQL 查询 DeepFlow 指标

基于以上的定义，我们可以基于 PromQL 查询 DeepFlow 指标量，注意`先确定聚合求值方式`，比如：

- 查询所有请求的 http `500` 响应码的时序趋势：
```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(request_resource, response_code)
```
- 如果我们想查看具体每个服务的时序趋势，加上服务分组：
```
sum(flow_log__l7_flow_log__server_error{response_code="500"}) by(auto_service_1, request_resource, response_code)
```
- 基于 10s 的评估间隔，按服务分组查询过去5分钟内的 TCP 建连时延变化趋势：
```
rate(sum(flow_metrics__network_map__rtt__1s)by(auto_service_1)[5m:10s])
```
- 基于 1m 的评估间隔，按服务分组查询过去10分钟内平均应用时延趋势：
```
avg_over_time(avg(flow_metrics__application__rrt__1m)by(auto_service)[10m:1m])
```

# 基于 DeepFlow 指标实现 Prometheus 告警

有了以上的例子，在配置了 [Prometheus RemoteRead](../../input/metrics/prometheus/#%E9%85%8D%E7%BD%AE-remote-read) 之后，就可以基于这些指标在 Prometheus 上构建告警规则，如：
- 对时延 > 1s 且持续超过 1m 的请求告警：
```yaml
groups:
- name: requestMonitoring
  rules:
  - alert: requestDelayAlert
    expr: avg(flow_metrics__application__rrt__1m)by(l7_protocol, auto_service, auto_instance) / 10^6 > 1
    for: 1m
    annotations:
      summary: "High Request Latenry"
      description: "{{ $labels.auto_instance }} request to {{ $labels.auto_service }} has a high request latency above 1s (current value: {{ $value }}s)"
```

我们也会在 DeepFlow 的后续迭代中支持直接配置告警规则，欢迎持续关注。
