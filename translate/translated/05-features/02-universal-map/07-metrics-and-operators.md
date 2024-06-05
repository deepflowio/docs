---
title: Metrics and Operators Calculation Logic
permalink: /features/universal-map/metrics-and-operators
---

> This document was translated by ChatGPT

This article will introduce different types of metrics and the calculation logic of various operators.

# Metrics

Metrics are divided into two main categories: `Application Performance Metrics` and `Network Performance Metrics`.

## Application Performance Metrics

Application metrics are used to measure the performance of services during actual operation, focusing mainly on service throughput, response delay, and anomalies. By collecting these metrics, operations personnel and developers can better understand the performance of applications in real-world usage, identify potential performance issues, and take appropriate measures for optimization and improvement.

The metrics described below will record a metric value in each statistical cycle. The statistical cycle can be customized by the user, with the system currently supporting 1m (one minute) and 1s (one second) by default (these data are collectively referred to as raw data sources by the DeepFlow platform). If multiple metric values are calculated within a statistical cycle, they will be aggregated into a single metric value. The aggregation logic is described in the subsequent `Types` section.

### Throughput

[csv-吞吐量](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.en?Category=Throughput)

### Delay

[csv-时延](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.en?Category=Delay)

### Error

[csv-异常](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.en?Category=Error)

## Network Performance Metrics

Network metrics are quantitative indicators used to evaluate network performance, covering the network layer, transport layer, and application layer. These metrics include throughput, delay, performance, and anomaly types.

### L3 Throughput

[csv-网络层吞吐](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=L3 Throughput)

### L4 Throughput

[csv-传输层吞吐量](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=L4 Throughput)

Active connection calculation logic:

- The collector counts the raw active connections based on the quadruple (client IP, server IP, protocol, server port) and then calculates the active connections corresponding to resources and paths.
- If traffic is collected within the time interval corresponding to the data source, active connections are counted, but there are some special cases:
  - 1s data source: Describes the active connections counted per second.
    - The first second of each minute: Includes connections that have no traffic within that second but have not ended, generally used to evaluate concurrent connections (multiple non-overlapping connections with a duration of less than one second may introduce some errors).
    - The last 59 seconds of each minute: If multiple flows with the same quadruple have no traffic within that second, the connection count corresponding to that quadruple is ignored for that second, generally used to evaluate the lower bound of concurrent connections.
  - 1m data source: Describes the active connections counted per minute.
    - Includes connections that have no traffic but have not ended, generally used to evaluate the upper bound of concurrent connections.
  - Custom data source: Calculated based on 1s/1m data sources using Avg/Max/Min, with the same meaning as using 1s/1m data sources directly and selecting Avg/Max/Min operators.

### TCP Performance (TCP Slow)

[csv-传输层 TCP 性能](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=TCP Slow)

### TCP Error

[csv-传输层 TCP 异常](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=TCP Error)

#### TCP Connection Error

![TCP 建连异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240411661782557f7bc.png)

#### TCP Transmission Error

![TCP 传输异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202404116617825667233.png)

### Transport Layer Delay

[csv-传输层时延](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=Delay)

![TCP 网络时延解剖](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023030364019bdd98b78.jpg)

- Delay generated during connection establishment:
  - [1] The complete `connection establishment delay` includes the entire time from the client sending the SYN packet to receiving the SYN+ACK packet from the server and then replying with an ACK packet. The connection establishment delay can be further divided into `client connection establishment delay` and `server connection establishment delay`.
  - [2] `Client connection establishment delay` is the time taken by the client to reply with an ACK packet after receiving the SYN+ACK packet.
  - [3] `Server connection establishment delay` is the time taken by the server to reply with a SYN+ACK packet after receiving the SYN packet.
- Delay generated during data communication can be divided into `client waiting delay` + `data transmission delay`:
  - [4] `Client waiting delay` is the time taken by the client to send the first request after the connection is successfully established; it is also the time taken by the client to send a data packet after receiving a data packet from the server.
  - [5] `Data transmission delay` is the time taken by the client to send a data packet and receive a reply data packet from the server.
  - [6] During data transmission delay, there is also a delay caused by the system protocol stack processing, called `system delay`, which is the time taken to receive the ACK packet for the data packet.

### Application Layer Metrics

[csv-应用层指标](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=Application)

### Cardinality

During the statistical cycle, the number of unique tags collected is counted. For example, querying the `client IP address (ip_0)` metric for all accesses to pod_1 means counting the number of unique client IP addresses in all traffic accessing pod_1.

[csv-基数统计](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=Cardinality)

# Operators

Operators calculate data from raw data sources based on the selected time range and interval. For example, using a line chart to view 1s raw data sources for the last 5 minutes with a 20s interval, a point on the line chart (14:43:00) reads all data within the time range of 14:42:40 - 14:43:00 and calculates the average value.

Operators support nested stacking, with `aggregation operators` not supporting stacking. For example, PerSecond(Avg(byte)) means first calculating Avg(byte) and then performing a second calculation based on PerSecond.

## Aggregation Operators

| Operator        | English Name                  | Applicable Metric Types | Description                                                                                                        |
| --------------- | ----------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Avg             | Average                       | All types               | Average value (does not ignore zero values for Counter/Gauge metrics)                                              |
| AAvg            | Arithmetic Average            | All types               | Arithmetic average (first calculates the average for each time point, then calculates the average of the averages) |
| Sum             | Sum                           | Counter type            | Sum value                                                                                                          |
| Max             | Maximum                       | All types               | Maximum value                                                                                                      |
| Min             | Minimum                       | All types               | Minimum value                                                                                                      |
| Percentile      | Estimated Percentile          | All types               | Estimated percentile                                                                                               |
| PercentileExact | Exact Percentile              | All types               | Exact percentile                                                                                                   |
| Spread          | Spread                        | All types               | Absolute spread, Max minus Min within the statistical cycle                                                        |
| Rspread         | Relative Spread               | All types               | Relative spread, Max divided by Min within the statistical cycle                                                   |
| Stddev          | Standard Deviation            | All types               | Standard deviation                                                                                                 |
| Apdex           | Application Performance Index | Delay type              | Delay satisfaction                                                                                                 |
| Last            | Last                          | All types               | Latest value                                                                                                       |
| Uniq            | Estimated Uniq                | Cardinality type        | Estimated cardinality                                                                                              |
| UniqExact       | Exact Uniq                    | Cardinality type        | Exact cardinality                                                                                                  |

## Secondary Operators

| Operator   | Description                                                                        |
| ---------- | ---------------------------------------------------------------------------------- |
| PerSecond  | Calculates the rate by dividing the metric value by the time interval (in seconds) |
| Math       | Arithmetic operations, supports +, -, \*, /                                        |
| Percentage | Unit conversion to %                                                               |

# Calculation Logic of Different Metrics' Operators

## Counter/Gauge Metrics

- flow_metrics data table
  - `Sum` operator
    - Calculates the `Sum` of all data within the query time range
  - `Avg` operator
    - Calculates the `Sum` of all data within the query time range and divides it by `interval/data_precision`
  - Other operators
    - First aggregates using `Sum` based on `data_precision`
    - Then calls the `ClickHouse` function for the selected specific operator
  - When forced to use two layers of `SQL` calculations (due to the needs of other metrics in the same statement)
    - `Sum/Avg` operator
      - First aggregates using `Sum` based on `data_precision`
      - Then calls the `ClickHouse` function for the selected specific operator
- flow_log data table
  - Calls the `ClickHouse` function for the selected specific operator
- prometheus/ext_metrics/deepflow_system data table
  - Same as flow_metrics data table
- Additional notes
  - The `Min` operator fills 0 for time points with no data or data as `null`

## Quotient/Percentage Metrics

- flow_metric data table
  - `Avg` operator
    - Calculates `Sum(x)/Sum(y)` for all data within the query time range
  - Other operators
    - First aggregates using `Sum(x)/Sum(y)` based on `data_precision`
    - Then calls the `ClickHouse` function for the selected specific operator
  - When forced to use two layers of `SQL` calculations (due to the needs of other metrics in the same statement)
    - `Avg` operator
      - First aggregates using `Sum(x)/Sum(y)` based on `data_precision`
      - Then calls the `ClickHouse` function for the selected specific operator
- flow_log data table
  - Calls the `ClickHouse` function `func(x/y)` for the selected specific operator
- Additional notes
  - The `Min` operator for `Percentage` metrics fills 0 for time points with no data
  - When calculating `Sum(x)/Sum(y)`, points with a denominator of `0/null` or a numerator of `null` are ignored

## Delay/BoundedGauge Metrics

- flow_metric data table
  - Calls the `ClickHouse` function for the selected specific operator
  - When forced to use two layers of `SQL` calculations (due to the needs of other metrics in the same statement)
    - `Avg/Min/Max` operator
      - Both layers call the `ClickHouse` function for the selected specific operator
    - `Spread/Rspread` operator
      - First aggregates using `Max` and `Min` based on `data_precision`
      - Then calls the `ClickHouse` function for the selected specific operator
    - Other operators
      - First aggregates using `groupArray`
      - Then calls the `ClickHouse` function for the selected specific operator
- flow_log data table
  - Calls the `ClickHouse` function for the selected specific operator
- Additional notes
  - The `Min` operator for `BoundedGauge` metrics fills 0 for time points with no data or data as `null`
  - `Delay` metrics ignore points with a value of 0, considering 0 as a meaningless delay value

## Data Precision of Different Databases/Tables

| Database        | data_precision | Notes                                                                                 |
| --------------- | -------------- | ------------------------------------------------------------------------------------- |
| flow_metrics    | 1s/1m          | Supports 1s and 1m by default, can be aggregated to 1h and 1d                         |
| flow_log        | 1s             | No actual concept of `data_precision`, the value is for convenience in calculation    |
| prometheus      | 10s            | Can be modified through the `data_source_prometheus_interval` field in `server.yaml`  |
| ext_metrics     | 10s            | Can be modified through the `data_source_ext_metrics_interval` field in `server.yaml` |
| deepflow_system | 10s            |                                                                                       |
