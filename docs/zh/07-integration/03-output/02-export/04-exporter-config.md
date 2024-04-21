---
title: Exporter Config
permalink: /integration/output/export/exporter-config
---

# Exporter 配置指引

## 配置示例

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
    export-empty-metrics_disabled: false
    enum-translate-to-name-disabled: false
    universal-tag-translate-to-name-disabled: false
    sasl:
      enabled: false
      security-protocol: SASL_SSL  # currently only supports: SASL_SSL
      sasl-mechanism: PLAIN # currently only supports: PLAIN
      username: aaa
      password: bbb
```

# 详细参数说明

|     字段   |    类型    |   必选   |  描述  |
|-----------|------------|--------|--------|
| protocol  | string     | 是 | 支持`opentelemetry`, `prometheus`, `kafka` |
| enabled   | bool       | 是 | 是否启用该 exporter |
| data-sources| strings     | 是 | 不同协议支持的数据源取值范围不同. 取值clickhouse `flow_metrics.*/flow_log.*/event.perf_event` 数据, 也用于 Kafka 主题名|
| endpoints      | strings | 是 | 远端接收地址，不同协议地址格式不同, 随机选择一个可发送成功的 |
| extra-headers  | map  | 否 | 远端 HTTP 请求的头部字段，比如有效验需求的，可以在这里补充 token 等信息 |
| batch-size    | int  | 否 | 批次大小，当达到这个数值，成批的发送。默认值： 1024 (protocol 为 opentelemetry 时, 默认值: 32) |
| flush-timeout | int  | 否 | 刷新间隔，当达到这个时间，则直接发送。单位: 秒，默认值： 10 |
| queue-count   | int  | 否 | 并发发送数，默认值： 4|
| tag-filters   | structs | 否 | 过滤不符合条件的数据, 只发送符合条件的数据。默认值: 空, 表示不过滤. 详细配置见下文 |
| export-fields | strings | 是 | 过滤需要发送的字段或类别，只发送符合条件的字段，例如: $tag, $metrics , 表示所有 `$tag` 和 `$metrics` 类别的字段都发送. 详细配置见下文 |
| export-empty-tag | bool   | 否 | 对于tag值为空的字段是否发送。默认值: false, 表示不发送 |
| export-empty-metrics-disabled | bool   | 否 | 对于metrics值为0的字段是否发送。默认值: false, 表示发送 |
| enum-translate-to-name-disabled | bool | 否 | 对于枚举类型的ID值是否翻译为字符串发送。 默认值: false，表示翻译 |
| universal-tag-translate-to-name-disabled | bool | 否 | 对于universal-tag类型的资源ID值是否翻译为资源名称发送。 默认值: false，表示翻译 |
| sasl          | struct | 否  | Kafka 协议使用. 连接 Kafka 认证方式, 目前仅支持 'SASL_SSL' 的 'PLAIN' 方式 |

- tag-filters（作用相当于 SQL 语句中的 WHERE，所有的 protocol 都支持，样例见下面的 yaml）
  - `field-name` 仅支持 ClickHouse 中的原始 Tag 字段名
  - `field-values` 不支持填写 Resource 类型 Tag 的字符串值
  - `operator` 包括
     - 数值相等/不相等、字符串相等/不相等：`=`、`!=`
     - 数值属于/不属于某个集合、字符串属于/不属于某个集合：`IN` 、`NOT IN`
     - 字符串相等/不相等，支持*通配符：`:`、`!:`
     - 字符串相等/不相等，支持正则：`~`、`!~`
  - 所有的 tag-filter 之间是 AND 的逻辑

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

- export-fields（作用相当于 SQL 语句中的 SELECT field-names，仅支持使用 ClickHouse 中的原始字段名，样例见下面的 yaml）
  - <field-name>：Tag 名称、Metric 名称, 如 ip4_0, ip4_1, region_id_0, region_id_1
  - <category>：字段 Category 名称，包括 `$tag`, `$k8s.label` 和 `$metrics`
    - `$tag`：所有 Tag 字段
    - `$tag.<sub-category>`：某一类 Tag 字段, <sub-category> 如下
      - `flow_info`
        - _id, time(s), start_time(us), end_time(us), close_type, flow_id, is_new_flow, status
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
    - `$metrics`：所有 Metrics 字段
    - `$metrics.<sub-category>`：某一类 Metrics 字段, <sub-category> 如下
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
        - rtt_sum, rtt_client_sum, rtt_server_sum, srt_sum, art_sum, rrt_sum, cit_sum
        - rtt_count, rtt_client_count, rtt_server_count, srt_count, art_count, rrt_count, cit_count
    - `$k8s.label`: 所有 k8s.label 字段
    - `~$k8s.label.<sub-field-name_regex>`： k8s.label 子字段名支持正则

```yaml
    export-fields:
    - $tag                # <category>
    - $tag.universal_tag  # <category>.<sub-category>
    - $tag.flow_info      # <category>.<sub-category>
    - ip4_0               # <field-name>
    - pod_id_0            # <field-name>
    - $k8s.label          # <category>
    - $k8s.label.k8s.annotation.app  # <category>.<sub-field-name>, sub-field-name: k8s.annotation.app
    - ~$k8s.label.env.(a.*|abc)  # <category>.<sub-field-name_regex>, regex: env.(a.*|abc)
    - $merics             # <category>
    - $metrics.delay      # <category>.<sub-category>
    - rtt                 # <field-name>
```
