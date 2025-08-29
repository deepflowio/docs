---
title: Kafka Exporter
permalink: /integration/output/export/kafka-exporter
---

> This document was translated by ChatGPT

# Function

Through Kafka, DeepFlow can export generated metrics, flow logs, call logs, and IO events to external platforms.

# Introduction to Metrics

In DeepFlow, metrics can be divided into two types:

- Application performance metrics: [See details here](../../../features/universal-map/application-metrics/)  
  - Corresponds to the `flow_metrics.application*` tables in ClickHouse
- Network performance metrics: [See details here](../../../features/universal-map/network-metrics/)  
  - Corresponds to the `flow_metrics.network*` tables in ClickHouse

# Kafka Export

The protocol format uses JSON.

# DeepFlow Server Configuration Guide

Add the following configuration under the Server configuration to enable metrics export:

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
      export-empty-metrics-disabled: false
      enum-translate-to-name-disabled: false
      universal-tag-translate-to-name-disabled: false
      sasl:
        enabled: false
        security-protocol: SASL_SSL # currently only supports: SASL_SSL
        sasl-mechanism: PLAIN # currently only supports: PLAIN
        username: aaa
        password: bbb
      topic:
```

# Detailed Parameter Description

| Field         | Type    | Required | Description                                                                                   |
| ------------- | ------- | -------- | --------------------------------------------------------------------------------------------- |
| protocol      | string  | Yes      | Fixed value `kafka`                                                                           |
| data-sources  | strings | Yes      | Values from ClickHouse `flow_metrics.*/flow_log.*/event.perf_event` data, also used as Kafka topic names |
| endpoints     | strings | Yes      | Remote receiving addresses, Kafka broker addresses; randomly selects one that can send successfully |
| batch-size    | int     | No       | Batch size; when this value is reached, data is sent in batches. Default: 1024                |
| export-fields | strings | Yes      | Recommended configuration: [$tag, $metrics]                                                   |
| sasl          | struct  | No       | Kafka connection authentication method; currently only supports 'SASL_SSL' with 'PLAIN'      |
| topic         | string  | No       | Kafka topic name; if empty, defaults to `deepflow.$data-source`, e.g., `deepflow.flow_log.l7_flow_log` |

[See detailed configuration reference](./exporter-config/)