---
title: Reducing Storage Overhead
permalink: /best-practice/reduce-storage-overhead/
---

> This document was translated by ChatGPT

This article explains how to configure DeepFlow to reduce the storage overhead in ClickHouse.

# Overview of Configuration Options

Before delving into specific configuration options, let’s first look at the main data types collected by DeepFlow Agent. From the perspective of ClickHouse databases and tables, the data mainly includes the following categories:

- `flow_log.l4_flow_log`: Flow logs. TCP/UDP five-tuple flow logs calculated based on cBPF traffic data. Each flow log contains packet header five-tuple fields, label fields, and performance metrics, with each flow log averaging around 150 bytes of storage space.
- `flow_log.l7_flow_log`: Invocation logs. Invocation logs for application protocols such as HTTP/gRPC/MySQL, calculated based on cBPF traffic data and eBPF function call data. Each invocation log contains key request/response fields, label fields, and performance metrics, averaging around 70 bytes of storage space per log, mainly depending on the length of header fields. Details of header fields stored for various application protocols can be found in the [documentation](../features/l7-protocols/overview/).
- `flow_metrics`: Metrics data. Metrics data aggregated from flow logs and invocation logs, by default generating metrics with 1m and 1s time precision. Since these metrics are aggregated, their volume is relatively small, typically consuming only about 1/10 of the storage space of flow logs or invocation logs.
- `event.perf_event`: Performance events. Currently, it mainly stores file read/write events of processes, each event containing fields such as process name, file name, read/write performance metrics, etc., with each event occupying about 80 bytes.
- `profile`: Continuous profiling. Stores function call stacks of processes with continuous profiling enabled, by default only enabling eBPF OnCPU Profile for deepflow-agent and deepflow-server processes.

DeepFlow offers extensive configuration options to reduce storage overhead in ClickHouse, summarized in the diagram below.

![Configuration options to reduce data volume](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231227002415.png)

The configuration parameters in the above diagram can be categorized into four types based on their purpose:

- Black: Used to set data retention periods. Different types of data typically require different retention periods.
- Green: Used to reduce data granularity. By modifying configurations, the granularity of various data can be adjusted, directly achieving the goal of reducing storage pressure.
- Blue: Used to disable unimportant data. By modifying configurations, some unimportant functions can be disabled or some unimportant traffic can be filtered out, thereby reducing storage pressure.
- Red: Used to set overload protection thresholds. Agent and Server expose threshold configurations for data collection and storage rates to protect themselves from overload, avoiding excessive data collection and writing.

# Estimating the Effect Before Action

Before adjusting configurations, you should confirm the storage consumption of the corresponding data in ClickHouse to estimate the benefits of configuration adjustments. The following ClickHouse commands can help you evaluate the storage overhead of specific data tables.

To view the number of rows and space consumption of all data tables and identify which data tables occupy the most storage space:

```sql
WITH sum(bytes_on_disk) AS size SELECT database, table, formatReadableSize(sum(data_uncompressed_bytes)) AS "Total Size Before Compression", formatReadableSize(sum(bytes_on_disk)) AS "Total Size After Compression", sum(rows) AS "Total Rows", sum(data_uncompressed_bytes)/sum(rows) AS "Average Row Size Before Compression", sum(bytes_on_disk)/sum(rows) AS "Average Row Size After Compression" FROM system.parts GROUP BY database, table ORDER BY size DESC;

WITH sum(bytes_on_disk) AS size
SELECT
    database,
    table,
    formatReadableSize(sum(data_uncompressed_bytes)) AS `Total Size Before Compression`,
    formatReadableSize(sum(bytes_on_disk)) AS `Total Size After Compression`,
    sum(rows) AS `Total Rows`,
    sum(data_uncompressed_bytes) / sum(rows) AS `Average Row Size Before Compression`,
    sum(bytes_on_disk) / sum(rows) AS `Average Row Size After Compression`
FROM system.parts
GROUP BY
    database,
    table
ORDER BY size DESC

┌─database────────┬─table────────────────────────────────────┬─Total Size Before Compression─┬─Total Size After Compression─┬────Total Rows─┬─Average Row Size Before Compression─┬──Average Row Size After Compression─┐
│ flow_log        │ l7_flow_log_local                        │ 16.58 GiB    │ 3.15 GiB     │  47231817 │ 377.02479955408023 │   71.69953315579623 │
│ flow_log        │ l4_flow_log_local                        │ 4.84 GiB     │ 1.51 GiB     │  10487780 │ 495.46614078479905 │  154.46138525026268 │
│ profile         │ in_process_local                         │ 2.24 GiB     │ 349.19 MiB   │  10325238 │  233.1437255974148 │   35.46215912892274 │
│ flow_metrics    │ network_map.1s_local                     │ 1.95 GiB     │ 261.58 MiB   │   5267001 │ 398.20784256543715 │   52.07621016210174 │
│ flow_metrics    │ network.1s_local                         │ 1.01 GiB     │ 159.70 MiB   │   3027870 │ 357.85661273436443 │   55.30619544432225 │
│ flow_metrics    │ application.1s_local                     │ 932.36 MiB   │ 129.11 MiB   │   8225431 │ 118.85691983799998 │  16.459093876053426 │
│ deepflow_system │ deepflow_system_local                    │ 1.55 GiB     │ 117.64 MiB   │  18478240 │  89.79716217561845 │   6.675736920832287 │
│ flow_metrics    │ application_map.1s_local                 │ 691.41 MiB   │ 65.07 MiB    │   4128212 │  175.6193790435181 │   16.52821560520632 │
│ flow_metrics    │ network_map.1m_local                     │ 331.22 MiB   │ 57.66 MiB    │    818085 │  424.5371263377277 │   73.90728347298875 │
│ flow_metrics    │ application_map.1m_local                 │ 228.35 MiB   │ 28.72 MiB    │   1435956 │ 166.75001462440352 │  20.973729000052927 │
│ flow_metrics    │ network.1m_local                         │ 121.96 MiB   │ 27.08 MiB    │    328060 │  389.8104432116076 │   86.55356946899957 │
│ flow_metrics    │ application.1m_local                     │ 97.90 MiB    │ 16.84 MiB    │    870320 │ 117.95215897600882 │  20.283444020590128 │
│ event           │ perf_event_local                         │ 2.84 MiB     │ 1.24 MiB     │     16543 │  180.1239194825606 │   78.70126337423683 │
└─────────────────┴──────────────────────────────────────────┴──────────────┴──────────────┴───────────┴────────────────────┴─────────────────────┘
```

To check the daily space consumption of a data table, such as the daily space consumption of `l7_flow_log`, confirm the daily space consumption of a data table, and assess how to set the retention period for that type of data:

```sql
WITH sum(bytes_on_disk) AS size SELECT SUBSTRING(partition, 1, 10) AS date, formatReadableSize(sum(data_uncompressed_bytes)) AS "Total Size Before Compression", formatReadableSize(sum(bytes_on_disk)) AS "Total Size After Compression", sum(rows) AS "Total Rows", sum(data_uncompressed_bytes)/sum(rows) AS "Average Row Size Before Compression", sum(bytes_on_disk)/sum(rows) AS "Average Row Size After Compression" FROM system.parts WHERE `table` = 'l7_flow_log_local' GROUP BY date ORDER BY date DESC;

WITH sum(bytes_on_disk) AS size
SELECT
    substring(partition, 1, 10) AS date,
    formatReadableSize(sum(data_uncompressed_bytes)) AS `Total Size Before Compression`,
    formatReadableSize(sum(bytes_on_disk)) AS `Total Size After Compression`,
    sum(rows) AS `Total Rows`,
    sum(data_uncompressed_bytes) / sum(rows) AS `Average Row Size Before Compression`,
    sum(bytes_on_disk) / sum(rows) AS `Average Row Size After Compression`
FROM system.parts
WHERE table = 'l7_flow_log_local'
GROUP BY date
ORDER BY date DESC

┌─date───────┬─Total Size Before Compression─┬─Total Size After Compression─┬───Total Rows─┬─Average Row Size Before Compression─┬─Average Row Size After Compression─┐
│ 2023-12-27 │ 3.50 GiB     │ 681.83 MiB   │ 10049374 │  374.3181802169966 │  71.14405494312382 │
│ 2023-12-26 │ 5.13 GiB     │ 1012.92 MiB  │ 14397814 │ 382.63502848418517 │  73.76948966002756 │
│ 2023-12-25 │ 5.73 GiB     │ 1.07 GiB     │ 16340447 │  376.4205308459432 │  70.36901530294735 │
│ 2023-12-24 │ 2.22 GiB     │ 436.62 MiB   │  6432796 │ 370.22603095139345 │  71.17070586413746 │
└────────────┴──────────────┴──────────────┴──────────┴────────────────────┴────────────────────┘
```

To distinguish storage consumption based on the value of a certain field, for example, checking the number of rows of different application protocols (`l7_protocol`) in the `l7_flow_log` table, and the average length of the corresponding `request_resource` field, to assess whether to disable the parsing of a certain application protocol:

```sql
SELECT dictGet(flow_tag.int_enum_map, 'name', ('l7_protocol', toUInt64(l7_protocol))) AS "Application Protocol", count(0) AS "Number of Rows", sum(length(request_resource))/count(l7_protocol) AS "Average request_resource Length", sum(length(request_resource))/sum(if(request_resource !='', 1, 0)) AS "Average Non-Empty request_resource Length" FROM flow_log.l7_flow_log WHERE time>now()-86400 GROUP BY l7_protocol ORDER BY "Number of Rows" DESC;

SELECT
    dictGet(flow_tag.int_enum_map, 'name', ('l7_protocol', toUInt64(l7_protocol))) AS `Application Protocol`,
    count(0) AS `Number of Rows`,
    sum(length(request_resource)) / count(l7_protocol) AS `Average request_resource Length`,
    sum(length(request_resource)) / sum(if(request_resource != '', 1, 0)) AS `Average Non-Empty request_resource Length`
FROM flow_log.l7_flow_log
WHERE time > (now() - 86400)
GROUP BY l7_protocol
ORDER BY `Number of Rows` DESC

┌─Application Protocol───┬─────Number of Rows─┬─Average request_resource Length─┬─Average Non-Empty request_resource Length─┐
│ HTTP       │ 15307526 │          50.94938901296003 │              51.16722749422727 │
│ MySQL      │ 12762197 │          67.32974729977919 │             103.38747090527679 │
│ DNS        │  9271394 │           41.6790123470106 │               41.6790123470106 │
│ HTTP2      │  4561075 │         0.9742264707333249 │             1.0020964209295697 │
│ TLS        │  3422769 │         14.613528403465148 │             23.354457466682167 │
│ Redis      │  2140668 │          89.61926931219601 │              92.19873624192489 │
│ gRPC       │   957471 │         13.709391720480307 │             23.696586596959204 │
│ N/A        │    79113 │                          0 │                            nan │
│ Custom     │     4802 │                          1 │                              1 │
│ PostgreSQL │     1125 │                     81.112 │                         81.112 │
│ MongoDB    │      108 │         1.3703703703703705 │                         2.3125 │
└────────────┴──────────┴────────────────────────────┴────────────────────────────────┘
```

To check the number of rows of different observation points (`observation_point`) in the `l7_flow_log` table, to assess whether to disable the collection of invocation logs at certain observation points:

```sql
SELECT observation_point, dictGet(flow_tag.string_enum_map, 'name', ('observation_point', observation_point)) AS "Observation Point", count(0) AS "Number of Rows" FROM flow_log.l7_flow_log WHERE time>now()-86400 GROUP BY observation_point ORDER BY "Number of Rows" DESC;

SELECT
    observation_point,
    dictGet(flow_tag.string_enum_map, 'name', ('observation_point', observation_point)) AS `Observation Point`,
    count(0) AS `Number of Rows`
FROM flow_log.l7_flow_log
WHERE time > (now() - 86400)
GROUP BY observation_point
ORDER BY `Number of Rows` DESC

┌─observation_point─┬─Observation Point─────────┬─────Number of Rows─┐
│ c                 │ Client NIC                │ 15034372 │
│ s                 │ Server NIC                │  9343403 │
│ c-p               │ Client Process            │  9179406 │
│ s-p               │ Server Process            │  5723075 │
│ rest              │ Other NIC                 │  3170534 │
│ s-nd              │ Server Container Node     │  2796958 │
│ c-nd              │ Client Container Node     │  2334083 │
│ local             │ Local NIC                 │  1365403 │
│ s-app             │ Server Application        │    89280 │
│ app               │ Application               │    80079 │
│ s-gw              │ Gateway to Server         │       11 │
└───────────────────┴────────────────────────────┴──────────┘
```

To distinguish storage consumption based on the value of a certain field, for example, checking the number of rows of different durations in the `event.perf_event` table:

```sql
SELECT count(), min(duration) AS min_duration_us, max(duration) AS max_duration_us, toUInt64(duration/1000) AS ms FROM event.perf_event GROUP BY ms ORDER BY ms ASC

SELECT
    count(),
    min(duration) AS min_duration_us,
    max(duration) AS max_duration_us,
    toUInt64(duration / 1000) AS ms
FROM event.perf_event
GROUP BY ms
ORDER BY ms ASC

┌─count()─┬─min_duration_us─┬─max_duration_us─┬───ms─┐
│  233129 │            1000 │            1999 │    1 │
│    6912 │            2000 │            2999 │    2 │
│    1209 │            3000 │            3999 │    3 │
│     552 │            4000 │            4999 │    4 │
│     320 │            5002 │            5996 │    5 │
│     187 │            6000 │            6992 │    6 │
│     119 │            7030 │            7997 │    7 │
│     103 │            8003 │            8992 │    8 │
...
```

# Black: Setting Data Retention Periods

Deepflow-server provides the ability to set retention periods for all data tables. You can search for `-ttl-hour` configuration items in server.yaml to set the retention period for specific data tables as needed. Typically, you can set longer retention periods for metric data (`flow_metrics`, `prometheus`, etc.) and shorter retention periods for log data (`flow_log`, etc.). As you can see, the precision of the retention period can be set to hours.

In the Enterprise Edition, you can directly set data retention periods on the DeepFlow page. The Community Edition only supports setting retention periods for uncreated data tables, so if you want to modify the retention period of a table, you need to delete the table in ClickHouse and then restart deepflow-server.

# Green: Reducing Data Granularity

First, let’s focus on the green configuration items. Adjusting these configurations can help us make trade-offs in data granularity, thereby reducing storage pressure.

For flow logs `flow_log.l4_flow_log`:

- Set `l4_log_ignore_tap_sides` to discard flow logs collected at certain observation points (`observation_point`). In a K8s container environment, for example, DeepFlow by default collects flow logs on virtual NICs and physical NICs. When Pod1 accesses Pod3, we collect four flow logs for the same stream on the four NICs along the path. For instance, we can set this configuration item to `c-nd` and `s-nd` to discard flow logs collected on physical NICs. Detailed descriptions of observation points can be found in the [documentation](../features/universal-map/auto-metrics/#观测点说明).
- Set `l4_log_tap_types` to discard flow logs collected at certain `network locations`. When we let the Agent handle mirrored traffic from physical switches (Enterprise Edition feature), this configuration item can be set to control the discarding of flow logs at specified mirror locations. Specifically, setting this configuration item to `[-1]` will completely disable flow log data.

![Data observation points (observation_point)](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231226212513.png)

For invocation logs `flow_log.l7_flow_log`:

- Set `obfuscate-enabled-protocols` to obfuscate the `request_resource` field in invocation logs, replacing variables with `?`. Currently, obfuscation is supported for MySQL, PostgreSQL, and Redis protocols. Since the length of obfuscated fields will be significantly reduced, storage overhead will also be reduced. Note that obfuscation will increase the CPU overhead of deepflow-agent.
- Set `l7_log_ignore_tap_sides` to discard invocation logs collected at certain observation points (`observation_point`). In a K8s container environment, for example, DeepFlow by default collects invocation logs on application processes, virtual NICs, and physical NICs. When Pod1 accesses Pod3, we collect six invocation logs for the same stream on the two processes and four NICs along the path. For instance, we can set this configuration item to `c-nd` and `s-nd` to discard invocation logs collected on physical NICs.
- Set `l7_log_tap_types` to discard invocation logs collected at certain `network locations`. When we let the Agent handle mirrored traffic from physical switches (Enterprise Edition feature), this configuration item can be set to control the discarding of invocation logs at specified mirror locations. Specifically, setting this configuration item to `[-1]` will completely disable invocation log data and the distributed tracing feature.

Adjusting the above configuration items for flow logs and invocation logs will not affect the accuracy of metric data `flow_metrics`. Although the storage space consumed by metric data is not large, we also expose some configuration items:

- Set `http-endpoint-extraction` to control how the endpoint field of the HTTP protocol is generated. For RPC (e.g., gRPC/Dubbo, etc.) protocols, the endpoint field is clear and can usually be obtained directly from the header. However, it is often a challenge to determine which part of an HTTP URI can be used as an endpoint. By default, we extract the first two segments of all URIs as the endpoint. But `2` may be too short for some APIs and too long for others. This configuration item can be adjusted to avoid generating explosive endpoint field values and to avoid generating endpoints that do not provide enough information.
- Set `inactive_server_port_enabled` to store inactive TCP/UDP port numbers as `server_port = 0`. When there is port scanning traffic in the network, enabling this configuration can effectively reduce the cardinality of metric data. ClickHouse is insensitive to the cardinality of metrics, but reducing the number of metric data can make queries faster. This configuration item is enabled by default.
- Set `inactive_ip_enabled` to store inactive IP addresses as `0.0.0.0`. When there is IP address scanning traffic in the network, enabling this configuration can effectively reduce the cardinality of metric data. This configuration item is enabled by default.
- Set `vtap_flow_1s_enabled` to disable 1s granularity aggregation data. When high precision metric data is not needed, you can choose to disable this configuration. This configuration item is enabled by default.

For continuous profiling `profile`:

- Set `on-cpu-profile.frequency` to adjust the sampling frequency of function call stacks. The default is 99, indicating 99 samples per second, which is about one sample every 10ms. Lowering this value can reduce the amount of function call stack data.
- Set `on-cpu-profile.cpu` to specify whether to distinguish function call stacks on different CPU cores. The default is 0, indicating that CPU cores are not distinguished, resulting in lower storage overhead. When set to 1, function call stacks on different CPU cores will not be aggregated.

# Blue: Disabling Unimportant Data

Next, let’s look at the blue configuration items. Adjusting these configurations can help us disable unimportant functions or filter out unimportant traffic, thereby reducing storage overhead.

For invocation logs `flow_log.l7_flow_log`:

- Set `l7-protocol-enabled` to select the application protocols to be parsed. By default, all application protocols are enabled for parsing. If you are not interested in protocols like Kafka, Redis, etc., you can remove them from the list.
- Set `l7-protocol-ports` to specify the port list for trying to parse specific application protocols. By default, DNS only parses traffic on ports 53 and 5353, TLS only parses traffic on port 443, and all other application protocols parse traffic on ports 1-65535. This configuration item is very effective for protocols with unclear characteristics. For example, if you know all the communication ports of the Redis protocol in your environment, setting this configuration item can avoid false parsing and consequently avoid storing dirty data generated by false parsing.

For metric data `flow_metrics`:

- Set `l4_performance_enabled` to disable the calculation and storage of advanced network performance metrics. Advanced network performance metrics include delay, performance, and exception metrics in the `network_*` table (i.e., all non-throughput metrics). The specific list of metrics can be found in the [documentation](../features/universal-map/metrics-and-operators/#网络性能指标).
- Set `l7_metrics_enabled` to disable the calculation and storage of application performance metrics. Application performance metrics correspond to the `application_*` table.

For performance events `event.perf_event`:

- Set `io-event-collect-mode` to adjust the range of file read/write events collected. Setting it to 0 completely disables collection, setting it to 1 collects only file read/write events occurring within the Request lifecycle, and setting it to 2 collects all file read/write events. The default value is 1, focusing on monitoring the impact of file read/write on Request performance.
- Set `io-event-minimal-duration` to adjust the number of recorded file read/write events by setting a duration threshold. The default value is 1ms, recording only events with a read/write duration greater than or equal to 1ms. Increasing this value can reduce the number of events.

For continuous profiling `profile`:

- Set `on-cpu-profile.disabled` to completely disable the continuous profiling feature.

Additionally, we can reduce data volume from the source through some configuration items:

- Set `tap_interface_regex` to control the list of network cards for traffic collection. When we do not want to collect traffic from certain virtual NICs or physical NICs, we can adjust this configuration.
- Set `capture_bpf` to use BPF expressions to filter the collected traffic. For example, if we confirm that all traffic on port 9999 is monitoring data transmission and we are not interested in it, we can set this item to `not port 9999` to filter out the collection of this traffic.
- Set `kprobe_blacklist` to configure a blacklist of port numbers so that eBPF kprobe can utilize this list to filter (discard) Socket data, reducing the amount of invocation log data.

# Red: Setting Overload Protection Thresholds

Finally, let’s look at the red configuration items. We do not want the agent to output excessive flow logs and invocation logs in extreme cases, avoiding excessive bandwidth usage; nor do we want a single server to have an excessive write volume, avoiding ClickHouse overload. Therefore, we expose the following configuration items:

- `l4_log_collect_nps_threshold`, used to control the maximum rate at which the agent sends flow logs. When the actual flow logs to be sent exceed this rate, the agent will actively discard logs. This behavior can be monitored through the `drop-in-throttle` metric in `deepflow_system.deepflow_agent_flow_aggr`.
- `l7_log_collect_nps_threshold`, used to control the maximum rate at which the agent sends invocation logs. When the actual invocation logs to be sent exceed this rate, the agent will actively discard logs. This behavior can be monitored through the `throttle-drop` metric in `deepflow_system.deepflow_agent_l7_session_aggr`.
- `l4-throttle`, used to control the maximum rate at which a single server replica writes flow logs. When set to 0, it uses the value of the `throttle` configuration item. When the actual flow logs to be written exceed this rate, the server will actively discard logs. This behavior can be monitored through the `drop_count` metric (filtered by `msg_type: l4_log`) in `deepflow_system.deepflow_server_ingester_decoder`.
- `l7-throttle`, used to control the maximum rate at which a single server replica writes invocation logs. When set to 0, it uses the value of the `throttle` configuration item. When the actual invocation logs to be written exceed this rate, the server will actively discard logs. This behavior can be monitored through the `drop_count` metric (filtered by `msg_type: l7_log`) in `deepflow_system.deepflow_server_ingester_decoder`.
