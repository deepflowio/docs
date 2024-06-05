---
title: Reduce Storage Overhead
permalink: /best-practice/reduce-storage-overhead/
---

> This document was translated by ChatGPT

This article introduces how to configure DeepFlow to reduce ClickHouse storage overhead.

# Overview of Configuration Items

Before introducing specific configuration items, let's first look at the main data types collected by DeepFlow Agent. From the perspective of databases and tables in ClickHouse, the data mainly includes the following categories:

- `flow_log.l4_flow_log`: Flow logs. TCP/UDP five-tuple flow logs calculated based on cBPF traffic data. Each flow log contains packet header five-tuple fields, tag fields, and performance metrics, with each log consuming approximately 150 bytes of storage space on average.
- `flow_log.l7_flow_log`: Call logs. Call logs of application protocols such as HTTP/gRPC/MySQL calculated based on cBPF traffic data and eBPF function call data. Each call log contains key request/response fields, tag fields, and performance metrics, with each log consuming approximately 70 bytes of storage space on average, mainly depending on the length of the header fields. For details on the header fields stored for various application protocols, see the [documentation](../features/l7-protocols/overview/).
- `flow_metrics`: Metric data. Metric data aggregated and calculated based on flow logs and call logs, with default aggregation generating metrics with 1m and 1s time precision. Since these metrics are aggregated, their volume is small, generally consuming only about 1/10 of the storage space of flow logs or call logs.
- `event.perf_event`: Performance events. Currently mainly stores file read/write events of processes, with each event containing fields such as process name, file name, and read/write performance metrics, consuming approximately 80 bytes per event.
- `profile`: Continuous profiling. Stores function call stacks of processes with continuous profiling enabled. By default, only the deepflow-agent and deepflow-server processes enable eBPF OnCPU Profile.

DeepFlow offers a wealth of configurations to reduce ClickHouse storage overhead, summarized in the diagram below.

![Configuration items to reduce data volume](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231227002415.png)

The configuration parameters in the diagram can be divided into four categories based on their purpose:

- Black: Used to set data retention duration. Different types of data usually require different retention durations.
- Green: Used to reduce data granularity. By modifying the configuration, you can adjust the granularity of various data types, directly reducing storage pressure.
- Blue: Used to disable unimportant data. By modifying the configuration, you can disable some features you don't care about or filter out some unimportant traffic, thereby reducing storage pressure.
- Red: Used to set overload protection thresholds. Agent and Server expose threshold configuration items for data collection and storage rates to protect themselves from overload, preventing the collection and writing of excessive data.

# Estimate the Effect Before Making Changes

Before adjusting the configuration, you should confirm the storage consumption of the corresponding data in ClickHouse and pre-evaluate the benefits of the configuration adjustments. The following ClickHouse commands can help you evaluate the storage overhead of specific data tables.

View the number of rows and space consumption of all data tables to identify which tables occupy the most storage space:

```sql
WITH sum(bytes_on_disk) AS size SELECT database, table, formatReadableSize(sum(data_uncompressed_bytes)) AS "Total Size Before Compression", formatReadableSize(sum(bytes_on_disk)) AS "Total Size After Compression", sum(rows) AS "Total Rows", sum(data_uncompressed_bytes)/sum(rows) AS "Average Row Length Before Compression", sum(bytes_on_disk)/sum(rows) AS "Average Row Length After Compression" FROM system.parts GROUP BY database, table ORDER BY size DESC;

WITH sum(bytes_on_disk) AS size
SELECT
    database,
    table,
    formatReadableSize(sum(data_uncompressed_bytes)) AS `Total Size Before Compression`,
    formatReadableSize(sum(bytes_on_disk)) AS `Total Size After Compression`,
    sum(rows) AS `Total Rows`,
    sum(data_uncompressed_bytes) / sum(rows) AS `Average Row Length Before Compression`,
    sum(bytes_on_disk) / sum(rows) AS `Average Row Length After Compression`
FROM system.parts
GROUP BY
    database,
    table
ORDER BY size DESC

┌─database────────┬─table────────────────────────────────────┬─Total Size Before Compression─┬─Total Size After Compression─┬────Total Rows─┬─Average Row Length Before Compression─┬──Average Row Length After Compression─┐
│ flow_log        │ l7_flow_log_local                        │ 16.58 GiB    │ 3.15 GiB     │  47231817 │ 377.02479955408023 │   71.69953315579623 │
│ flow_log        │ l4_flow_log_local                        │ 4.84 GiB     │ 1.51 GiB     │  10487780 │ 495.46614078479905 │  154.46138525026268 │
│ profile         │ in_process_local                         │ 2.24 GiB     │ 349.19 MiB   │  10325238 │  233.1437255974148 │   35.46215912892274 │
│ flow_metrics    │ network_map.1s_local             │ 1.95 GiB     │ 261.58 MiB   │   5267001 │ 398.20784256543715 │   52.07621016210174 │
│ flow_metrics    │ network.1s_local                  │ 1.01 GiB     │ 159.70 MiB   │   3027870 │ 357.85661273436443 │   55.30619544432225 │
│ flow_metrics    │ application.1s_local                   │ 932.36 MiB   │ 129.11 MiB   │   8225431 │ 118.85691983799998 │  16.459093876053426 │
│ deepflow_system │ deepflow_system_local                    │ 1.55 GiB     │ 117.64 MiB   │  18478240 │  89.79716217561845 │   6.675736920832287 │
│ flow_metrics    │ application_map.1s_local              │ 691.41 MiB   │ 65.07 MiB    │   4128212 │  175.6193790435181 │   16.52821560520632 │
│ flow_metrics    │ network_map.1m_local             │ 331.22 MiB   │ 57.66 MiB    │    818085 │  424.5371263377277 │   73.90728347298875 │
│ flow_metrics    │ application_map.1m_local              │ 228.35 MiB   │ 28.72 MiB    │   1435956 │ 166.75001462440352 │  20.973729000052927 │
│ flow_metrics    │ network.1m_local                  │ 121.96 MiB   │ 27.08 MiB    │    328060 │  389.8104432116076 │   86.55356946899957 │
│ flow_metrics    │ application.1m_local                   │ 97.90 MiB    │ 16.84 MiB    │    870320 │ 117.95215897600882 │  20.283444020590128 │
│ event           │ perf_event_local                         │ 2.84 MiB     │ 1.24 MiB     │     16543 │  180.1239194825606 │   78.70126337423683 │
└─────────────────┴──────────────────────────────────────────┴──────────────┴──────────────┴───────────┴────────────────────┴─────────────────────┘
```

Query the daily space consumption of a specific data table, for example, the daily space consumption of `l7_flow_log`, to evaluate how to set the retention duration for this type of data:

```sql
WITH sum(bytes_on_disk) AS size SELECT SUBSTRING(partition, 1, 10) AS date, formatReadableSize(sum(data_uncompressed_bytes)) AS "Total Size Before Compression", formatReadableSize(sum(bytes_on_disk)) AS "Total Size After Compression", sum(rows) AS "Total Rows", sum(data_uncompressed_bytes)/sum(rows) AS "Average Row Length Before Compression", sum(bytes_on_disk)/sum(rows) AS "Average Row Length After Compression" FROM system.parts WHERE `table` = 'l7_flow_log_local' GROUP BY date ORDER BY date DESC;

WITH sum(bytes_on_disk) AS size
SELECT
    substring(partition, 1, 10) AS date,
    formatReadableSize(sum(data_uncompressed_bytes)) AS `Total Size Before Compression`,
    formatReadableSize(sum(bytes_on_disk)) AS `Total Size After Compression`,
    sum(rows) AS `Total Rows`,
    sum(data_uncompressed_bytes) / sum(rows) AS `Average Row Length Before Compression`,
    sum(bytes_on_disk) / sum(rows) AS `Average Row Length After Compression`
FROM system.parts
WHERE table = 'l7_flow_log_local'
GROUP BY date
ORDER BY date DESC

┌─date───────┬─Total Size Before Compression─┬─Total Size After Compression─┬───Total Rows─┬─Average Row Length Before Compression─┬─Average Row Length After Compression─┐
│ 2023-12-27 │ 3.50 GiB     │ 681.83 MiB   │ 10049374 │  374.3181802169966 │  71.14405494312382 │
│ 2023-12-26 │ 5.13 GiB     │ 1012.92 MiB  │ 14397814 │ 382.63502848418517 │  73.76948966002756 │
│ 2023-12-25 │ 5.73 GiB     │ 1.07 GiB     │ 16340447 │  376.4205308459432 │  70.36901530294735 │
│ 2023-12-24 │ 2.22 GiB     │ 436.62 MiB   │  6432796 │ 370.22603095139345 │  71.17070586413746 │
└────────────┴──────────────┴──────────────┴──────────┴────────────────────┴────────────────────┘
```

Distinguish space consumption based on the value of a specific field. For example, view the number of rows for different application protocols (`l7_protocol`) in the `l7_flow_log` table and the average length of the `request_resource` field to evaluate whether to disable parsing for a certain application protocol:

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

┌─observation_point─┬─Observation Point─────────┬─────Number of Rows─┐
│ c                 │ Client NIC     │ 15034372 │
│ s                 │ Server NIC     │  9343403 │
│ c-p               │ Client Process     │  9179406 │
│ s-p               │ Server Process     │  5723075 │
│ rest              │ Other NIC       │  3170534 │
│ s-nd              │ Server Container Node │  2796958 │
│ c-nd              │ Client Container Node │  2334083 │
│ local             │ Local NIC       │  1365403 │
│ s-app             │ Server Application     │    89280 │
│ app               │ Application           │    80079 │
│ s-gw              │ Gateway to Server   │       11 │
└───────────────────┴────────────────┴──────────┘
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

# Black: Set Data Retention Duration

deepflow-server provides the ability to set retention durations for all data tables. You can search for `-ttl-hour` configuration items in server.yaml to set the retention duration for specific data tables as needed. Typically, you can set a longer retention duration for metric data (`flow_metrics`, `prometheus`, etc.) and a shorter retention duration for log data (`flow_log`, etc.). As you can see, the retention duration can be set with hourly precision.

In the enterprise edition, you can directly set the data retention duration on the DeepFlow page. The community edition only supports setting the retention duration for data tables that have not been created yet. Therefore, if you want to modify the retention duration of a specific table, you need to first delete the table in ClickHouse and then restart deepflow-server.

# Green: Reduce Data Granularity

Let's first focus on the green configuration items. Adjusting these configurations can help us make trade-offs in data granularity, thereby reducing storage pressure.

For flow logs `flow_log.l4_flow_log`:

- Set `l4_log_ignore_tap_sides` to discard flow logs collected at certain observation points (`observation_point`). As shown in the figure below, in a K8s container environment, DeepFlow by default collects flow logs on virtual NICs and physical NICs. When Pod1 accesses Pod3, we collect four flow logs of the same traffic on the four NICs along the way. For example, we can set this configuration item to c-nd and s-nd to discard flow logs collected on physical NICs. For a detailed description of observation points, refer to the [documentation](../features/universal-map/auto-metrics/#观测点说明).
- Set `l4_log_tap_types` to discard flow logs collected at certain `network locations`. When we let the Agent process mirrored traffic from physical switches (enterprise edition feature), we can control the discarding of flow logs from specified mirror locations by setting this configuration item. Specifically, setting this configuration item to `[-1]` will completely disable flow log data

![数据的观测点（observation_point）](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20231226212513.png)

对于调用日志 `flow_log.l7_flow_log`：

- 设置 `obfuscate-enabled-protocols`，可对调用日志的 `request_resource` 字段进行脱敏，将其中的变量替换为 `?`。目前支持对 MySQL、PostgreSQL、Redis 协议进行脱敏。由于脱敏后的字段长度会有明显的降低，因此也就能降低存储开销。注意脱敏会增加 deepflow-agent 的 CPU 开销。
- 设置 `l7_log_ignore_tap_sides`，可丢弃部分观测点（`observation_point`）处采集的调用日志。以 K8s 容器环境为例，DeepFlow 默认会采集应用进程、虚拟网卡和物理网卡上的调用日志。上图中当 Pod1 访问 Pod3 时，我们会在沿途的两个进程、四个网卡上采集到同一股流量的六条调用日志。例如我们可以设置此配置项为 c-nd 和 s-nd，来丢弃物理网卡上采集的调用日志。
- 设置 `l7_log_tap_types`，可丢弃部分`网络位置`处采集的调用日志。当我们让 Agent 处理物理交换机的镜像流量（企业版功能）时，可以通过设置此配置项来控制丢弃指定镜像位置的调用日志。特别地，将此配置项设置为 `[-1]` 时，将完全关闭调用日志数据，同时也关闭了分布式追踪功能。

调整流日志和调用日志的上述配置项，并不会影响指标数据 `flow_metrics` 的准确性。而对于指标数据，虽然消耗的存储空间并不大，但我们也暴露了一些配置项：

- 设置 `http-endpoint-extration`，可控制如何生成 HTTP 协议的 endpoint 字段。对于 RPC（例如 gRPC/Dubbo 等）协议，endpoint 字段是明确的，通常能从头部直接获取。但 HTTP URI 中究竟哪部分可作为 endpoint 通常是一个难题。默认情况下对于所有的 URI 我们提取前两段作为 endpoint。但 `2` 对于某些 API 可能过短，对另一些 API 又过长，此时可以调整此配置项，避免生成爆炸的 endpoint 字段值，也避免生成的 endpoint 无法提供足够的信息量。
- 设置 `inactive_server_port_enabled`，可将不活跃的 TCP/UDP 端口号存储为 `server_port = 0`，当网络中存在端口扫描流量时，开启此配置能有效降低指标数据的基数。ClickHouse 对指标基数是不敏感的，但降低指标数据的数量可以让查询更快。此配置项默认是开启的。
- 设置 `inactive_ip_enabled`，可将不活跃的 IP 地址存储为 `0.0.0.0`，当网络中存在 IP 地址扫描流量时，开启此配置能有效降低指标数据的基数。此配置项默认是开启的。
- 设置 `vtap_flow_1s_enabled`，可关闭 1s 粒度的聚合数据，当不需要高精度指标数据时可选择关闭此配置，此配置项默认是开启的。

对于持续剖析 `profile`：

- 设置 `on-cpu-profile.frequency`，可调整函数调用栈的采样频率，默认为 99，表示每秒采样 99 次，即大约每 10ms 采集一次函数调用栈。将此值调低可减少函数调用栈的数据量。
- 设置 `on-cpu-profile.cpu`，可设置是否区分不同 CPU 核心上的函数调用栈，默认为 0 表示不区分 CPU 核心，存储开销低。当设置为 1 时不同 CPU 核心上的函数调用栈不会聚合。

# 蓝色：关闭不关心的数据

接下来我们看看蓝色的配置项，调整这些配置能够帮助我们关闭不关心的功能，或者屏蔽不关心的流量，从而达到降低存储开销的目的。

对于调用日志 `flow_log.l7_flow_log`：

- 设置 `l7-protocol-enabled`，可选择开启解析的应用协议。默认情况下所有应用协议都是开启解析的，如果你对 Kafka、Redis 等某些协议不关心，可将其从列表中删除。
- 设置 `l7-protocol-ports`，可设置特定应用协议尝试解析的端口号列表。默认情况下 DNS 仅解析 53、5353 两个端口的流量，TLS 仅解析 443 端口的流量，其他所有应用协议解析 1-65535 全端口流量。这个配置项对特征不明显的协议非常有效，例如当你非常清楚环境中 Redis 协议的所有通信端口号时，设置该配置项能避免误解析，从而也就能避免存储由于误解析生成的脏数据。

对于指标数据 `flow_metrics`：

- 设置 `l4_performance_enabled`，可关闭对高级网络性能指标的计算和存储。高级网络性能指标包括 `network_*` 表中的时延、性能、异常指标（即吞吐类以外的所有指标），具体指标列表详见[文档](../features/universal-map/metrics-and-operators/#网络性能指标)。
- 设置 `l7_metrics_enabled`，可关闭对应用性能指标的计算和存储。应用性能指标对应 `application_*` 表。

对于性能事件 `event.perf_event`：

- 设置 `io-event-collect-mode`，可调整采集的文件读写事件范围。设置为 0 完全关闭采集，设置为 1 仅采集在 Request 生命周期内发生的文件读写，设置为 2 采集所有文件读写。默认值为 1，聚焦于监控文件读写对 Request 性能的影响。
- 设置 `io-event-minimal-duration`，可通过设置耗时阈值，来调整记录的文件读写事件的多少。默认此值为 1ms，仅记录读写耗时大于等于 1ms 的事件。调高此值能降低事件的数量。

对于持续剖析 `profile`：

- 设置 `on-cpu-profile.disabled`，可彻底关闭持续剖析功能。

此外，我们还能通过一些配置项从源头处减少数据量：

- 设置 `tap_interface_regex`，控制采集流量的网卡列表。当我们不希望采集某些虚拟网卡或物理网卡的流量时，可调整此配置。
- 设置 `dispatcher_bpf`，可使用 BPF 表达式过滤采集的流量。例如当我们确认所有 9999 端口的流量都是监控数据传输的流量，如果我们对此不关心，可配置此项为 `not port 9999` 来屏蔽对这些流量的采集
- 设置 `kprobe_blacklist`，可设置一个端口号黑名单，使得 eBPF kprobe 能利用这个端口号列表过滤（丢弃）Socket 数据，减少调用日志的数据量。

# 红色：设置过载保护阈值

最后我们来看看红色的配置项。我们不希望极端情况下 agent 输出过量的流日志和调用日志，避免导致占用过大的带宽；也不希望单个 server 的写入量过大，避免导致 ClickHouse 的过载。因此我们暴露了如下配置项：

- `l4_log_collect_nps_threshold`，用于控制 agent 发送流日志的最大速率。当实际待发送的流日志超过此速率时，agent 会进行主动的丢弃，此时通过监控 `deepflow_system.deepflow_agent_flow_aggr` 中的 `drop-in-throttle` 指标可监控此丢弃行为。
- `l7_log_collect_nps_threshold`，用于控制 agent 发送调用日志的最大速率。当实际待发送的调用日志超过此速率时，agent 会进行主动的丢弃，此时通过监控 `deepflow_system.deepflow_agent_l7_session_aggr` 中的 `throttle-drop` 指标可监控此丢弃行为。
- `l4-throttle`，用于控制单个 server 副本写入流日志的最大速率，当设置为 0 时使用 `throttle` 配置项的值。当实际待写入的流日志超过此速率时，server 会进行主动的丢弃，此时通过监控 `deepflow_system.deepflow_server_ingester_decoder` 中的 `drop_count` 指标（使用 `msg_type: l4_log` 过滤）可监控此丢弃行为。
- `l7-throttle`，用于控制单个 server 副本写入调用日志的最大速率，当设置为 0 时使用 `throttle` 配置项的值。当实际待写入的调用日志超过此速率时，server 会进行主动的丢弃，此时通过监控 `deepflow_system.deepflow_server_ingester_decoder` 中的 `drop_count` 指标（使用 `msg_type: l7_log` 过滤）可监控此丢弃行为。
