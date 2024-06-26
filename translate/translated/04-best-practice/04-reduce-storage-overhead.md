---
title: Reducing Storage Overhead
permalink: /best-practice/reduce-storage-overhead/
---

> This document was translated by ChatGPT

This article introduces how to configure DeepFlow to reduce ClickHouse storage overhead.

# Overview of Configuration Items

Before diving into specific configuration items, let's first look at the main data types collected by DeepFlow Agent. From the perspective of databases and tables in ClickHouse, the data mainly includes the following categories:

- `flow_log.l4_flow_log`: Flow logs. TCP/UDP five-tuple flow logs calculated based on cBPF traffic data. Each flow log contains packet header five-tuple fields, label fields, and performance metrics, consuming about 150 bytes of storage space on average.
- `flow_log.l7_flow_log`: Call logs. Call logs of application protocols such as HTTP/gRPC/MySQL calculated based on cBPF traffic data and eBPF function call data. Each call log contains key request/response fields, label fields, and performance metrics, consuming about 70 bytes of storage space on average, mainly depending on the length of the header fields. For details on the header fields stored by various application protocols, see [documentation](../features/l7-protocols/overview/).
- `flow_metrics`: Metric data. Metric data aggregated from flow logs and call logs, with default aggregation generating metrics with 1m and 1s time precision. Since these metrics are aggregated, they are relatively small, generally consuming only about 1/10 of the storage space of flow logs or call logs.
- `event.perf_event`: Performance events. Currently mainly stores file read/write events of processes. Each event contains fields such as process name, file name, and read/write performance metrics, consuming about 80 bytes per event.
- `profile`: Continuous profiling. Stores function call stacks of processes with continuous profiling enabled. By default, only the deepflow-agent and deepflow-server processes enable eBPF On-CPU Profile.

DeepFlow offers a variety of configurations to reduce ClickHouse storage overhead, summarized in the diagram below.

![Configuration items to reduce data volume](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231227002415.png)

The configuration parameters in the diagram can be divided into four categories based on their purpose:

- Black: Used to set data retention duration. Different types of data usually require different retention durations.
- Green: Used to reduce data granularity. By modifying the configuration, you can adjust the granularity of various data types, directly reducing storage pressure.
- Blue: Used to disable unimportant data. By modifying the configuration, you can disable some features you don't care about or filter out some traffic you don't care about, thereby reducing storage pressure.
- Red: Used to set overload protection thresholds. To protect themselves from overload, the Agent and Server expose threshold configuration items for data collection and storage rates, preventing the collection and writing of excessive data.

# Estimating the Effect Before Making Changes

Before adjusting the configuration, you should confirm the storage consumption of the corresponding data in ClickHouse and pre-evaluate the benefits of the configuration adjustments. The following ClickHouse commands can help you evaluate the storage overhead of specific data tables.

View the number of rows and space consumption of all data tables to identify which tables occupy the most storage space:

```sql
WITH sum(bytes_on_disk) AS size SELECT database, table, formatReadableSize(sum(data_uncompressed_bytes)) AS "Uncompressed Total Size", formatReadableSize(sum(bytes_on_disk)) AS "Compressed Total Size", sum(rows) AS "Total Rows", sum(data_uncompressed_bytes)/sum(rows) AS "Average Row Length (Uncompressed)", sum(bytes_on_disk)/sum(rows) AS "Average Row Length (Compressed)" FROM system.parts GROUP BY database, table ORDER BY size DESC;

WITH sum(bytes_on_disk) AS size
SELECT
    database,
    table,
    formatReadableSize(sum(data_uncompressed_bytes)) AS `Uncompressed Total Size`,
    formatReadableSize(sum(bytes_on_disk)) AS `Compressed Total Size`,
    sum(rows) AS `Total Rows`,
    sum(data_uncompressed_bytes) / sum(rows) AS `Average Row Length (Uncompressed)`,
    sum(bytes_on_disk) / sum(rows) AS `Average Row Length (Compressed)`
FROM system.parts
GROUP BY
    database, table
ORDER BY size DESC

┌─database────────┬─table────────────────────────────────────┬─Uncompressed Total Size─┬─Compressed Total Size─┬────Total Rows─┬─Average Row Length (Uncompressed)─┬──Average Row Length (Compressed)─┐
│ flow_log        │ l7_flow_log_local                        │ 16.58 GiB               │ 3.15 GiB              │  47231817     │ 377.02479955408023                │   71.69953315579623              │
│ flow_log        │ l4_flow_log_local                        │ 4.84 GiB                │ 1.51 GiB              │  10487780     │ 495.46614078479905                │  154.46138525026268              │
│ profile         │ in_process_local                         │ 2.24 GiB                │ 349.19 MiB            │  10325238     │  233.1437255974148                │   35.46215912892274              │
│ flow_metrics    │ network_map.1s_local                     │ 1.95 GiB                │ 261.58 MiB            │   5267001     │ 398.20784256543715                │   52.07621016210174              │
│ flow_metrics    │ network.1s_local                         │ 1.01 GiB                │ 159.70 MiB            │   3027870     │ 357.85661273436443                │   55.30619544432225              │
│ flow_metrics    │ application.1s_local                     │ 932.36 MiB              │ 129.11 MiB            │   8225431     │ 118.85691983799998                │  16.459093876053426              │
│ deepflow_system │ deepflow_system_local                    │ 1.55 GiB                │ 117.64 MiB            │  18478240     │  89.79716217561845                │   6.675736920832287              │
│ flow_metrics    │ application_map.1s_local                 │ 691.41 MiB              │ 65.07 MiB             │   4128212     │  175.6193790435181                │   16.52821560520632              │
│ flow_metrics    │ network_map.1m_local                     │ 331.22 MiB              │ 57.66 MiB             │    818085     │  424.5371263377277                │   73.90728347298875              │
│ flow_metrics    │ application_map.1m_local                 │ 228.35 MiB              │ 28.72 MiB             │   1435956     │ 166.75001462440352                │  20.973729000052927              │
│ flow_metrics    │ network.1m_local                         │ 121.96 MiB              │ 27.08 MiB             │    328060     │  389.8104432116076                │   86.55356946899957              │
│ flow_metrics    │ application.1m_local                     │ 97.90 MiB               │ 16.84 MiB             │    870320     │ 117.95215897600882                │  20.283444020590128              │
│ event           │ perf_event_local                         │ 2.84 MiB                │ 1.24 MiB              │     16543     │  180.1239194825606                │   78.70126337423683              │
└─────────────────┴──────────────────────────────────────────┴─────────────────────────┴───────────────────────┴───────────────┴───────────────────────────────────┴──────────────────────────────────┘
```

Query the daily space consumption of a specific data table, such as the daily space consumption of `l7_flow_log`, to evaluate how to set the retention duration for that type of data:

```sql
WITH sum(bytes_on_disk) AS size SELECT SUBSTRING(partition, 1, 10) AS date, formatReadableSize(sum(data_uncompressed_bytes)) AS "Uncompressed Total Size", formatReadableSize(sum(bytes_on_disk)) AS "Compressed Total Size", sum(rows) AS "Total Rows", sum(data_uncompressed_bytes)/sum(rows) AS "Average Row Length (Uncompressed)", sum(bytes_on_disk)/sum(rows) AS "Average Row Length (Compressed)" FROM system.parts WHERE `table` = 'l7_flow_log_local' GROUP BY date ORDER BY date DESC;

WITH sum(bytes_on_disk) AS size
SELECT
    substring(partition, 1, 10) AS date,
    formatReadableSize(sum(data_uncompressed_bytes)) AS `Uncompressed Total Size`,
    formatReadableSize(sum(bytes_on_disk)) AS `Compressed Total Size`,
    sum(rows) AS `Total Rows`,
    sum(data_uncompressed_bytes) / sum(rows) AS `Average Row Length (Uncompressed)`,
    sum(bytes_on_disk) / sum(rows) AS `Average Row Length (Compressed)`
FROM system.parts
WHERE table = 'l7_flow_log_local'
GROUP BY date
ORDER BY date DESC

┌─date───────┬─Uncompressed Total Size─┬─Compressed Total Size─┬───Total Rows─┬─Average Row Length (Uncompressed)─┬─Average Row Length (Compressed)─┐
│ 2023-12-27 │ 3.50 GiB                │ 681.83 MiB            │ 10049374     │  374.3181802169966                │  71.14405494312382              │
│ 2023-12-26 │ 5.13 GiB                │ 1012.92 MiB           │ 14397814     │ 382.63502848418517                │  73.76948966002756              │
│ 2023-12-25 │ 5.73 GiB                │ 1.07 GiB              │ 16340447     │  376.4205308459432                │  70.36901530294735              │
│ 2023-12-24 │ 2.22 GiB                │ 436.62 MiB            │  6432796     │ 370.22603095139345                │  71.17070586413746              │
└────────────┴─────────────────────────┴───────────────────────┴──────────────┴───────────────────────────────────┴──────────────────────────────────┘
```

Distinguish space consumption based on the value of a specific field. For example, view the number of rows for different application protocols (`l7_protocol`) in the `l7_flow_log` table and the average length of the `request_resource` field to evaluate whether to disable parsing for a certain application protocol:

```sql
SELECT dictGet(flow_tag.int_enum_map, 'name', ('l7_protocol', toUInt64(l7_protocol))) AS "Application Protocol", count(0) AS "Number of Rows", sum(length(request_resource))/count(l7_protocol) AS "Average request_resource Length", sum(length(request_resource))/sum(if(request_resource !='', 1, 0)) AS "Average Non-empty request_resource Length" FROM flow_log.l7_flow_log WHERE time>now()-86400 GROUP BY l7_protocol ORDER BY "Number of Rows" DESC;

SELECT
    dictGet(flow_tag.int_enum_map, 'name', ('l7_protocol', toUInt64(l7_protocol))) AS `Application Protocol`,
    count(0) AS `Number of Rows`,
    sum(length(request_resource)) / count(l7_protocol) AS `Average request_resource Length`,
    sum(length(request_resource)) / sum(if(request_resource != '', 1, 0)) AS `Average Non-empty request_resource Length`
FROM flow_log.l7_flow_log
WHERE time > (now() - 86400)
GROUP BY l7_protocol
ORDER BY `Number of Rows` DESC

┌─Application Protocol─┬─────Number of Rows─┬─Average request_resource Length─┬─Average Non-empty request_resource Length─┐
│ HTTP                 │ 15307526           │          50.94938901296003      │              51.16722749422727            │
│ MySQL                │ 12762197           │          67.32974729977919      │             103.38747090527679            │
│ DNS                  │  9271394           │           41.6790123470106      │               41.6790123470106            │
│ HTTP2                │  4561075           │         0.9742264707333249      │             1.0020964209295697            │
│ TLS                  │  3422769           │         14.613528403465148      │             23.354457466682167            │
│ Redis                │  2140668           │          89.61926931219601      │              92.19873624192489            │
│ gRPC                 │   957471           │         13.709391720480307      │             23.696586596959204            │
│ N/A                  │    79113           │                          0      │                            nan            │
│ Custom               │     4802           │                          1      │                              1            │
│ PostgreSQL           │     1125           │                     81.112      │                         81.112            │
│ MongoDB              │      108           │         1.3703703703703705      │                         2.3125            │
└──────────────────────┴────────────────────┴─────────────────────────────────┴───────────────────────────────────────────┘
```

View the number of rows for different observation points (`observation_point`) in the `l7_flow_log` table to evaluate whether to disable call logs collected at certain observation points:

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

┌─observation_point─┬─Observation Point─┬─────Number of Rows─┐
│ c                 │ Client NIC        │ 15034372           │
│ s                 │ Server NIC        │  9343403           │
│ c-p               │ Client Process    │  9179406           │
│ s-p               │ Server Process    │  5723075           │
│ rest              │ Other NIC         │  3170534           │
│ s-nd              │ Server Node       │  2796958           │
│ c-nd              │ Client Node       │  2334083           │
│ local             │ Local NIC         │  1365403           │
│ s-app             │ Server App        │    89280           │
│ app               │ App               │    80079           │
│ s-gw              │ Gateway to Server │       11           │
└───────────────────┴───────────────────┴────────────────────┘
```

Distinguish space consumption based on the value of a specific field. For example, view the number of rows for different durations in the `event.perf_event` table:

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

# Black: Setting Data Retention Duration

Deepflow-server provides the ability to set retention durations for all data tables. You can search for `-ttl-hour` configuration items in server.yaml to set the retention duration for specific data tables as needed. Typically, you can set a longer retention duration for metric data (`flow_metrics`, `prometheus`, etc.) and a shorter retention duration for log data (`flow_log`, etc.). As you can see, the retention duration can be set with an accuracy of hours.

In the enterprise edition, you can directly set the data retention duration on the DeepFlow page. The community edition only supports setting the retention duration for tables that have not been created yet. Therefore, if you want to modify the retention duration of a table, you need to first delete the table in ClickHouse and then restart deepflow-server.

# Green: Reducing Data Granularity

Let's first focus on the green configuration items. Adjusting these settings can help us trade-off data granularity to reduce storage pressure.

For flow logs `flow_log.l4_flow_log`:

- Setting `l4_log_ignore_tap_sides` can discard flow logs collected at certain observation points (`observation_point`). As shown in the figure below, in a K8s container environment, DeepFlow by default collects flow logs on both virtual and physical NICs. When Pod1 accesses Pod3, we will collect four flow logs for the same traffic on four NICs along the way. For example, we can set this configuration item to c-nd and s-nd to discard flow logs collected on physical NICs. For a detailed description of observation points, refer to the [documentation](../features/universal-map/auto-metrics/#观测点说明).
- Setting `l4_log_tap_types` can discard flow logs collected at certain `network positions`. When we let the Agent handle the mirrored traffic of physical switches (enterprise version feature), this configuration item can be set to control the dropping of flow logs from specified mirror locations. Specifically, setting this configuration item to `[-1]` will completely disable flow log data.

![Observation Points of Data](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231226212513.png)

For call logs `flow_log.l7_flow_log`:

- Setting `obfuscate-enabled-protocols` can desensitize the `request_resource` field in call logs by replacing variables with `?`. Currently, desensitization is supported for MySQL, PostgreSQL, and Redis protocols. Desensitized fields will have a significantly reduced length, thereby reducing storage costs. Note that desensitization will increase the CPU overhead of the deepflow-agent.
- Setting `l7_log_ignore_tap_sides` can discard call logs collected at certain observation points (`observation_point`). In a K8s container environment, DeepFlow by default collects call logs on application processes, virtual NICs, and physical NICs. As shown in the figure above, when Pod1 accesses Pod3, we will collect six call logs for the same traffic across two processes and four NICs along the way. For example, we can set this configuration item to c-nd and s-nd to discard call logs collected on physical NICs.
- Setting `l7_log_tap_types` can discard call logs collected at certain `network positions`. When we let the Agent handle the mirrored traffic of physical switches (enterprise version feature), this configuration item can be set to control the dropping of call logs from specified mirror locations. Specifically, setting this configuration item to `[-1]` will completely disable call log data, also disabling distributed tracing functionality.

Adjusting the above configurations for flow logs and call logs will not affect the accuracy of metrics data `flow_metrics`. Although metrics data does not consume much storage space, we also expose some configuration items:

- Setting `http-endpoint-extraction` can control how the endpoint field for the HTTP protocol is generated. For RPC (e.g., gRPC/Dubbo, etc.) protocols, the endpoint field is clear and can usually be obtained directly from the header. However, determining which part of the HTTP URI can be used as the endpoint is often challenging. By default, we extract the first two segments of all URIs as the endpoint. But `2` might be too short for some APIs and too long for others. Adjusting this configuration item can prevent generating exploding endpoint field values and also ensure the generated endpoints provide enough information.
- Setting `inactive_server_port_enabled` can store inactive TCP/UDP port numbers as `server_port = 0`. When there is port scanning traffic in the network, enabling this configuration can effectively reduce the cardinality of metric data. ClickHouse is insensitive to the cardinality of metrics, but reducing the number of metric data can make queries faster. This configuration item is enabled by default.
- Setting `inactive_ip_enabled` can store inactive IP addresses as `0.0.0.0`. When there is IP address scanning traffic in the network, enabling this configuration can effectively reduce the cardinality of metric data. This configuration item is enabled by default.
- Setting `vtap_flow_1s_enabled` can disable 1s granularity aggregate data. If high-precision metric data is not required, this configuration can be disabled. This configuration item is enabled by default.

For continuous profiling `profile`:

- Setting `on-cpu-profile.frequency` can adjust the sampling frequency of the function call stack. The default is 99, which means sampling 99 times per second, approximately collecting the function call stack every 10ms. Lowering this value can reduce the data volume of the function call stack.
- Setting `on-cpu-profile.cpu` can set whether to differentiate the function call stacks on different CPU cores. The default is 0, which means not differentiating CPU cores, resulting in low storage overhead. When set to 1, function call stacks on different CPU cores will not be aggregated.

# Blue: Disabling Uninterested Data

Next, let's look at the blue configuration items. Adjusting these settings can help us disable uninterested features or filter out uninterested traffic, thereby reducing storage costs.

For call logs `flow_log.l7_flow_log`:

- Setting `l7-protocol-enabled` can select the application protocols to be parsed. By default, all application protocols are enabled for parsing. If you are not interested in certain protocols like Kafka or Redis, you can remove them from the list.
- Setting `l7-protocol-ports` can set the list of ports to try parsing for specific application protocols. By default, DNS only parses traffic on ports 53 and 5353, TLS only parses traffic on port 443, and all other application protocols parse traffic on all ports 1-65535. This configuration item is very effective for protocols with indistinct characteristics. For example, if you know all the communication ports for the Redis protocol in your environment, setting this configuration item can avoid mis-parsing, thereby preventing the storage of dirty data generated by mis-parsing.

For metrics data `flow_metrics`:

- Setting `l4_performance_enabled` can disable the calculation and storage of advanced network performance metrics. Advanced network performance metrics include latency, performance, and exception metrics in the `network_*` tables (i.e., all metrics other than throughput). For a detailed list of metrics, see the [documentation](../features/universal-map/metrics-and-operators/#网络性能指标).
- Setting `l7_metrics_enabled` can disable the calculation and storage of application performance metrics. Application performance metrics correspond to the `application_*` tables.

For performance events `event.perf_event`:

- Setting `io-event-collect-mode` can adjust the range of collected file read/write events. Setting it to 0 completely disables collection, setting it to 1 collects only file read/write events occurring within the Request lifecycle, and setting it to 2 collects all file read/write events. The default value is 1, focusing on monitoring the impact of file read/write on Request performance.
- Setting `io-event-minimal-duration` can adjust the number of recorded file read/write events by setting a duration threshold. The default value is 1ms, recording only events with a read/write duration of 1ms or more. Increasing this value can reduce the number of events.

For continuous profiling `profile`:

- Setting `on-cpu-profile.disabled` can completely disable the continuous profiling feature.

Additionally, we can reduce the data volume from the source with some configuration items:

- Setting `tap_interface_regex` controls the list of NICs to collect traffic from. If we do not want to collect traffic from certain virtual or physical NICs, this configuration can be adjusted.
- Setting `capture_bpf` can use BPF expressions to filter collected traffic. For example, if we are sure that all traffic on port 9999 is monitoring data transmission, and we are not interested in it, we can set this item to `not port 9999` to filter out the collection of this traffic.
- Setting `kprobe_blacklist` can set a port number blacklist, allowing eBPF kprobe to use this port number list to filter (discard) Socket data, reducing the data volume of call logs.

# Red: Setting Overload Protection Thresholds

Finally, let's look at the red configuration items. We do not want the agent to output excessive flow logs and call logs in extreme situations, avoiding excessive bandwidth usage; nor do we want a single server's write volume to be too large, avoiding overloading ClickHouse. Therefore, we expose the following configuration items:

- `l4_log_collect_nps_threshold` controls the maximum rate at which the agent sends flow logs. When the actual flow logs to be sent exceed this rate, the agent will actively discard them. This discarding behavior can be monitored through the `drop-in-throttle` metric in `deepflow_system.deepflow_agent_flow_aggr`.
- `l7_log_collect_nps_threshold` controls the maximum rate at which the agent sends call logs. When the actual call logs to be sent exceed this rate, the agent will actively discard them. This discarding behavior can be monitored through the `throttle-drop` metric in `deepflow_system.deepflow_agent_l7_session_aggr`.
- `l4-throttle` controls the maximum rate at which a single server replica writes flow logs. When set to 0, the value of the `throttle` configuration item is used. When the actual flow logs to be written exceed this rate, the server will actively discard them. This discarding behavior can be monitored through the `drop_count` metric in `deepflow_system.deepflow_server_ingester_decoder` (filtered using `msg_type: l4_log`).
- `l7-throttle` controls the maximum rate at which a single server replica writes call logs. When set to 0, the value of the `throttle` configuration item is used. When the actual call logs to be written exceed this rate, the server will actively discard them. This discarding behavior can be monitored through the `drop_count` metric in `deepflow_system.deepflow_server_ingester_decoder` (filtered using `msg_type: l7_log`).
