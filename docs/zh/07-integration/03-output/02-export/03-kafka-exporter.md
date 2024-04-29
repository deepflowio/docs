---
title: Kafka Exporter
permalink: /integration/output/export/kafka-exporter
---

# 功能

通过 Kafka 的方式，可以将 DeepFlow 的生成的指标，流日志，调用日志，IO事件导出到外部的平台。

# Metrics 简介

在 DeepFlow 内，关于 Metric 可以分为两种

- 应用性能指标：[具体可参考](../../../features/universal-map/application-metrics/)
  - 对应到 clickhouse 里是 `flow_metrics.application*` 表数据
- 网络性能指标：[具体可参考](../../../features/universal-map/network-metrics/)
  - 对应到 clickhouse 里是 `flow_metrics.network*` 表数据

# Kafke Export

协议格式使用 JSON

# DeepFlow Server 配置指引

在 Server 的配置下，增加如下配置，即可开启指标导出

```yaml
ingester:
  exporters:
  - protocol: kafka
    enabled: true
    endpoints: [broker1.example.com:9092, broker2.example.com:9092]
    data-sources:
    - flow_log.l7_flow_log
    # - flow_log.l4_flow_log
    # - flow_metrics.application_map.1s
    # - flow_metrics.application_map.1m
    # - flow_metrics.application.1s
    # - flow_metrics.application.1m
    # - flow_metrics.network_map.1s
    # - flow_metrics.network_map.1m
    # - flow_metrics.network.1s
    # - flow_metrics.network.1m
    # - event.perf_event
    queue-count: 4
    queue-size: 100000
    batch-size: 1024
    flush-timeout: 10
    tag-filters:
    export-fields:
    - $tag
    - $metrics
    export-empty-tag: false
    export-empty-metrics_disabled: false
    enum-translate-to-name-disabled: false
    universal-tag-translate-to-name-disabled: false
    sasl:
      enabled: false
      security-protocol: SASL_SSL  # currently only supports: SASL_SSL
      sasl-mechanism: PLAIN # currently only supports: PLAIN
      username: aaa
      password: bbb
    topic:
```

# 详细参数说明

|     字段   |    类型    |   必选   |  描述  |
|-----------|------------|--------|--------|
| protocol  | string     | 是 | 固定值 `kafka` |
| data-sources| strings     | 是 | 取值clickhouse `flow_metrics.*/flow_log.*/event.perf_event` 数据, 也用于 Kafka 主题名 |
| endpoints     | strings | 是 | 远端接收地址，kafka broker接收地址, 随机选择一个可发送成功的 |
| batch-size    | int  | 否 | 批次大小，当达到这个数值，成批的发送。默认值： 1024 |
| export-fields | strings | 是 | 建议配置: [$tag, $metrics] |
| sasl          | struct | 否  | 连接 Kafka 认证方式, 目前仅支持 'SASL_SSL' 的 'PLAIN' 方式 |
| topic         | string | 否  | Kafka 主题名, 若为空, 则取默认值为 `deepflow.$data-source`, 如 `deepflow.flow_log.l7_flow_log` |

[详细配置参考](./exporter-config/)
