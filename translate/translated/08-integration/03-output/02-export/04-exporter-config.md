---
title: Exporter Config
permalink: /integration/output/export/exporter-config
---

> This document was translated by ChatGPT

# Exporter Configuration Guide

## Configuration Example

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
      extra-headers:
        key1: value1
        key2: value2
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
```

# Detailed Parameter Description

| Field                                    | Type    | Required | Description                                                                                                                                       |
| ---------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| protocol                                 | string  | Yes      | Supports `opentelemetry`, `prometheus`, `kafka`                                                                                                   |
| enabled                                  | bool    | Yes      | Whether to enable this exporter                                                                                                                   |
| data-sources                             | strings | Yes      | Supported data source ranges vary by protocol. For ClickHouse: `flow_metrics.*/flow_log.*/event.perf_event` data, also used as Kafka topic names  |
| endpoints                                | strings | Yes      | Remote receiving addresses, format varies by protocol, randomly selects one that can send successfully                                           |
| extra-headers                            | map     | No       | HTTP request headers for the remote endpoint, e.g., for authentication you can add tokens here                                                    |
| batch-size                               | int     | No       | Batch size; when this value is reached, data is sent in batches. Default: 1024 (for opentelemetry protocol, default: 32)                          |
| flush-timeout                            | int     | No       | Flush interval; when this time is reached, data is sent immediately. Unit: seconds, default: 10                                                  |
| queue-count                              | int     | No       | Number of concurrent sends, default: 4                                                                                                            |
| tag-filters                              | structs | No       | Filters out data that does not meet the conditions, only sends matching data. Default: empty, meaning no filtering. See detailed config below    |
| export-fields                            | strings | Yes      | Filters the fields or categories to send, only sends matching fields. For example: `$tag`, `$metrics` means all `$tag` and `$metrics` fields     |
| export-empty-tag                         | bool    | No       | Whether to send fields with empty tag values. Default: false, meaning do not send                                                                |
| export-empty-metrics-disabled            | bool    | No       | Whether to send fields with metrics value 0. Default: false, meaning send                                                                        |
| enum-translate-to-name-disabled          | bool    | No       | Whether to translate enum type ID values to strings before sending. Default: false, meaning translate                                            |
| universal-tag-translate-to-name-disabled | bool    | No       | Whether to translate universal-tag type resource ID values to resource names before sending. Default: false, meaning translate                   |
| sasl                                     | struct  | No       | For Kafka protocol. Kafka authentication method, currently only supports 'SASL_SSL' with 'PLAIN' mechanism                                       |
| topic                                    | string  | No       | For Kafka protocol. Topic name; if empty, defaults to `deepflow.$data-source`, e.g., `deepflow.flow_log.l7_flow_log`                              |

## tag-filters

Functions like the WHERE clause in SQL. Example YAML below:

- `field-name` only supports original Tag field names in ClickHouse
- `field-values` does not support filling in string values of Resource type Tags
- `operator` includes:
  - Numeric equal/not equal, string equal/not equal: `=`, `!=`
  - Numeric in/not in a set, string in/not in a set: `IN`, `NOT IN`
  - String equal/not equal with `*` wildcard: `:`, `!:`
  - String equal/not equal with regex: `~`, `!~`
- All tag-filters are combined with AND logic

```yaml
    tag-filters:
    - field-name: signal_source
      operator: =
      field-values: [3]
    - field-name: region_id_0
      operator: !=
      field-values: [0]
    - field-name: app_service
      operator: IN
      field-values: [deepflow_server, mysql]
    - field-name: request_resource
      operator: "NOT IN"
      field-values: [deepflow_agent, mysql]
    - field-name: request_domain
      operator: :
      field-values: [deepflow_*]
    - field-name: app_service
      operator: ~
      field-values: [deepflow_.*]
```

## export-fields

Functions like the SELECT field-names clause in SQL, only supports using original field names in ClickHouse. Example YAML below:

- `<field-name>`: Tag name or Metric name, e.g., ip4_0, ip4_1, region_id_0, region_id_1
- `<category>`: Field category name, including `$tag`, `$k8s.label`, and `$metrics`
  - `$tag`: All Tag fields
  - `$tag.<sub-category>`: A specific type of Tag fields, `<sub-category>` as follows
    - `flow_info`
      - \_id, time(s), start_time(us), end_time(us), close_type, flow_id, is_new_flow, status
    - `universal_tag`
      - region_id[_0/1], az_id[_0/1], host_id[_0/1], pod_node_id[_0/1], pod_ns_id[_0/1], pod_group_id[_0/1], pod_group_type[_0/1], pod_id[_0/1], pod_cluster_id[_0/1]
      - l3_device_type[_0/1], l3_device_id[_0/1], l3_epc_id[_0/1], epc_id[_0/1], subnet_id[_0/1], service_id[_0/1]
      - auto_instance_id[_0/1], auto_instance_type[_0/1], auto_service_id[_0/1], auto_service_type[_0/1], gprocess_id[_0/1]
    - `native_tag`
      - attribute_names, attritube_values
    - `network_layer`
      - ip4[_0/1], ip6[_0/1], is_ipv4, protocol, province[_0/1]
    - `tunnel_info`
      - tunnel_type, tunnel_tier, tunnel_tx_id, tunnel_rx_id, tunnel_tx_ip4[_0/1], tunnel_rx_ip4[_0/1]
      - tunnel_tx_ip6[_0/1], tunnel_rx_ip6[_0/1], tunnel_is_ipv4, tunnel_tx_mac[_0/1], tunnel_rx_mac[_0/1]
    - `transport_layer`
      - client_port, server_port, req_tcp_seq, resp_tcp_seq, tcp_flags_bit[_0/1], syn_seq, syn_ack_seq, last_keepalive_seq, last_keepalive_ack
    - `application_layer`
      - l7_protocol, request_domain, version, l7_protocol_str, type, is_tls
      - request_type, request_domain, request_resource, request_id, response_status, response_code, response_exception, response_result, events
    - `service_info`
      - process_id[_0/1], process_kname[_0/1], app_service, app_instance, endpoint
    - `tracing_info`
      - trace_id, span_id, parent_span_id, span_kind, x_request_id[_0/1], http_proxy_client
      - syscall_trace_id_request, syscall_trace_id_response, syscall_thread[_0/1], syscall_coroutine[_0/1], syscall_cap_seq[_0/1]
    - `capture_info`
      - signal_source, capture_network_type_id, nat_source, capture_nic_type, capture_nic, observation_point
      - l2_end[_0/1], l3_end[_0/1], nat_real_ip[_0/1], nat_real_port[_0/1], agent_id, biz_type, role
    - `event_info`
      - event_type
    - `data_link_layer`
      - mac[_0/1], eth_type, vlan
  - `$metrics`: All Metrics fields
  - `$metrics.<sub-category>`: A specific type of Metrics fields, `<sub-category>` as follows
    - `l3_throughput`
      - packet_tx, packet_rx, byte_tx, byte_rx, l3_byte_tx, l3_byte_rx, total_packet_tx, total_packet_rx, total_byte_tx, total_byte_rx
    - `l4_throughput`
      - direction_score, l4_byte_tx, l4_byte_rx, syn_count, synack_count, l4_byte_tx, l4_byte_rx, new_flow, closed_flow, flow_load
    - `tcp_slow`
      - retrans_tx, retrans_rx, zero_win_tx, zero_win_rx, retrans_syn, retrans_synack
    - `tcp_error`
      - client_rst_flow, server_rst_flow, server_syn_miss, client_ack_miss, client_half_close_flow, server_half_close_flow
      - client_source_port_reuse, client_establish_other_rst, server_reset, server_queue_lack, server_establish_other_rst, tcp_timeout
      - client_establish_fail, server_establish_fail, tcp_establish_fail, tcp_transfer_fail, tcp_rst_fail
    - `application`
      - l7_request, l7_response, l7_parse_failed, l7_client_error, l7_server_error, l7_timeout
    - `throughput`
      - request, response, request_length, response_length, sql_affected_rows
    - `error`
      - client_error, server_error, timeout
    - `delay`
      - response_duration, duration, rtt, rtt_client, rtt_server, tls_rtt
      - rtt_max, rtt_client_max, rtt_server_max, srt_max, art_max, rrt_max, cit_max
      - rtt_sum, rtt_client_sum, rtt_server_sum, srt_sum, art_sum, rtt_sum, cit_sum
      - rtt_count, rtt_client_count, rtt_server_count, srt_count, art_count, rtt_count, cit_count
  - `$k8s.label`: All k8s.label fields
  - `~$k8s.label.<sub-field-name_regex>`: k8s.label sub-field names support regex

```yaml
export-fields:
  - ip4_0 # <field-name>
  - pod_id_0 # <field-name>
  - $tag # <category>
  - $tag.universal_tag # <category>.<sub-category>
  - $tag.flow_info # <category>.<sub-category>
  - $k8s.label # <category>
  - $k8s.label.k8s.annotation.app # <category>.<sub-field-name>, sub-field-name: k8s.annotation.app
  - ~$k8s.label.env.(a.*|abc) # <category>.<sub-field-name_regex>, regex: env.(a.*|abc)
  - $merics # <category>
  - $metrics.delay # <category>.<sub-category>
  - rtt # <field-name>
```