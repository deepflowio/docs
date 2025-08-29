---
title: Calculation Logic for Metrics and Operators
permalink: /features/universal-map/metrics-and-operators
---

> This document was translated by ChatGPT

This document introduces the calculation logic for different types of metrics and operators.

# Metrics

Metrics are divided into two main categories: `application performance metrics` and `network performance metrics`.

## Application Performance Metrics

Application metrics are used to measure the performance of services during actual operation, focusing mainly on throughput, response latency, and exceptions. By collecting these metrics, operations and development teams can better understand how applications perform in real-world usage, identify potential performance issues, and take appropriate measures for optimization and improvement.

The metrics described below record one metric value for each statistical cycle. The statistical cycle can be customized by the user. The system currently supports 1m (one minute) and 1s (one second) by default (these data are collectively referred to as raw data sources in the DeepFlow platform). If multiple metric values are calculated within a single statistical cycle, they will be aggregated into one metric value. The aggregation logic is described later in the `Type` section.

### Throughput

[csv-Throughput](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.en?Category=Throughput)

### Delay

[csv-Delay](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.en?Category=Delay)

### Error

[csv-Error](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.en?Category=Error)

## Network Performance Metrics

Network metrics are quantitative indicators used to evaluate network performance, covering the network layer, transport layer, and application layer. These metrics include throughput, latency, performance, and exception types.

### L3 Throughput

[csv-L3 Throughput](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=L3 Throughput)

### L4 Throughput

[csv-L4 Throughput](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=L4 Throughput)

Active connection calculation logic:

- The collector counts the original number of active connections based on the quadruple (client IP, server IP, protocol, server port), and then calculates the active connections corresponding to resources and paths.
- If traffic is captured within the time interval of the data source, active connections are counted, but there are some special cases:
  - 1s data source: describes the number of active connections counted per second
    - First second of each minute: includes connections without traffic but not yet closed during that second, generally used to estimate concurrent connections (multiple non-overlapping connections lasting less than one second may cause some errors)
    - Remaining 59 seconds of each minute: if multiple flows with the same quadruple have no traffic in that second, the connection count for that quadruple is ignored for that second, generally used to estimate the lower bound of concurrent connections
  - 1m data source: describes the number of active connections counted per minute
    - Includes connections without traffic but not yet closed, generally used to estimate the upper bound of concurrent connections
  - Custom data source: calculated from 1s/1m data sources using Avg/Max/Min, with the same meaning as directly using the 1s/1m data source and selecting the Avg/Max/Min operator

### TCP Slow

[csv-TCP Slow](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=TCP Slow)

### TCP Error

[csv-TCP Error](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=TCP Error)

#### TCP Client Connection Exceptions

- Client port reuse
  - **Phenomenon**: The server receives SYN but does not reply with SYN-ACK, causing TCP connection failure
  - **Cause**: Client source port conflicts with an already established TCP connection
  - **Recommendation**:
    - Check client TCP connection timeout parameters
    - If there is a NAT device, check NAT rules
- Client ACK missing
  - **Phenomenon**: The server replies with SYN-ACK, but the client does not respond, causing TCP connection failure
  - **Cause**:
    - Client SYN Flood attack
    - Client port scanning
  - **Recommendation**: Confirm whether it is a security incident and block the abnormal client in time
- Other client resets
  - **Phenomenon**: The client sends SYN and then immediately sends RST, causing TCP connection failure
  - **Cause**:
    - Client application exception
    - Malicious client attack
  - **Recommendation**:
    - Check client application status
    - Check whether the client has general attack behavior

![TCP Client Connection Exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20241014670ce8c1ea0f9.png)

#### TCP Server Connection Exceptions

- Server direct reset
  - **Phenomenon**: The server receives SYN and replies with RST, rejecting TCP connection
  - **Cause**:
    - Server port not open or not listening
    - Server application not ready
    - Client port scanning
  - **Recommendation**:
    - Check server port connectivity
    - Check whether the client is performing port scanning
- Server SYN missing
  - **Phenomenon**: The client sends SYN multiple times, but the server does not respond
  - **Cause**:
    - Firewall not allowing the port
    - Route unreachable
  - **Recommendation**:
    - Check firewall policy
    - Check network connectivity
- Other server resets
  - **Phenomenon**: The server sends SYN-ACK and then immediately sends RST, causing TCP connection failure
  - **Cause**: Server operating system exception
  - **Recommendation**: Check server operating system logs

![TCP Server Connection Exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20241014670ce89f268c4.png)

#### TCP Transmission Exceptions

- Server queue overflow
  - **Phenomenon**: During TCP data transmission, the server sends SYN-ACK
  - **Cause**: Server Accept queue overflow
  - **Recommendation**:
    - Adjust kernel somaxconn parameter
    - Adjust kernel tcp_max_syn_backlog parameter
- Client reset
  - **Phenomenon**: During TCP data transmission, the client sends RST to close the TCP connection
  - **Cause**:
    - Client application exception
    - Client operating system exception
  - **Recommendation**:
    - Check client application status
    - Check client operating system logs
- Server reset
  - **Phenomenon**: During TCP data transmission, the server sends RST to close the TCP connection
  - **Cause**:
    - Server application exception
    - Server operating system exception
  - **Recommendation**:
    - Check server application status
    - Check server operating system logs
- TCP connection timeout
  - **Phenomenon**: No data for more than 300 seconds during transmission
  - **Cause**:
    - Client host offline
    - Client application exception
  - **Recommendation**:
    - Check client host status
    - Check client application status

![TCP Transmission Exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20241014670ce885cccd5.png)

#### TCP Disconnection Exceptions

- Server half-close
  - **Phenomenon**: The server receives FIN but does not reply with FIN-ACK, resulting in incomplete TCP four-way handshake
  - **Cause**: Server application exception
  - **Recommendation**: Check server application status
- Client half-close
  - **Phenomenon**: The client receives FIN but does not reply with FIN-ACK, resulting in incomplete TCP four-way handshake
  - **Cause**: Client application exception
  - **Recommendation**: Check client application status

![TCP Disconnection Exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20241014670ce893a1ed2.png)

### Transport Layer Delay

[csv-Transport Layer Delay](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=Delay)

![TCP Network Delay Analysis](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023030364019bdd98b78.jpg)

- Delay during connection establishment
  - [1] Complete `connection establishment delay` includes the entire time from when the client sends a SYN packet to receiving the server's SYN+ACK packet and replying with an ACK packet. This can be further divided into `client connection delay` and `server connection delay`
  - [2] `Client connection delay` is the time from when the client receives the SYN+ACK packet to when it replies with an ACK packet
  - [3] `Server connection delay` is the time from when the server receives the SYN packet to when it replies with a SYN+ACK packet
- Delay during data communication, which can be divided into `client wait delay` + `data transmission delay`
  - [4] `Client wait delay` is the time from successful connection establishment to when the client sends the first request; or the time from receiving a data packet from the server to when the client sends another data packet
  - [5] `Data transmission delay` is the time from when the client sends a data packet to when it receives the server's reply
  - [6] Within data transmission delay, there is also processing delay in the system protocol stack, called `system delay`, which is the time from receiving a data packet to receiving the ACK packet

### Application Layer Metrics

[csv-Application Layer Metrics](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=Application)

### Cardinality

Within the statistical cycle, count the number of unique tags in the collected data. For example, querying the metric `client IP address (ip_0)` for all clients accessing pod_1 means counting how many unique client IP addresses appear in all traffic accessing pod_1.

[csv-Cardinality](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.en?Category=Cardinality)

# Operators

Operators calculate data from raw data sources based on the selected time range and interval. For example, when using a line chart to view 1s raw data for the last 5 minutes with a 20s interval and Avg operator, a point at 14:43:00 reads all data from 14:42:40 to 14:43:00 in the raw data source and then calculates the average.

Operators support nested stacking, but `aggregation operators` do not support stacking. For example, PerSecond(Avg(byte)) means first calculating Avg(byte), then applying PerSecond to the result.

## Aggregation Operators

| Operator        | English Name                   | Applicable Metric Type | Description                                                                 |
| --------------- | ------------------------------ | ---------------------- | --------------------------------------------------------------------------- |
| Avg             | Average                        | All types              | Average value (does not ignore zero values for Counter/Gauge metrics)       |
| AAvg            | Arithmetic Average             | All types              | Arithmetic average (average of averages at each time point)                 |
| Sum             | Sum                            | Counter type           | Sum                                                                          |
| Max             | Maximum                        | All types              | Maximum value                                                                |
| Min             | Minimum                        | All types              | Minimum value                                                                |
| Percentile      | Estimated Percentile           | All types              | Estimated percentile                                                         |
| PercentileExact | Exact Percentile                | All types              | Exact percentile                                                             |
| Spread          | Spread                         | All types              | Absolute spread: Max minus Min within the statistical cycle                  |
| Rspread         | Relative Spread                 | All types              | Relative spread: Max divided by Min within the statistical cycle             |
| Stddev          | Standard Deviation             | All types              | Standard deviation                                                           |
| Apdex           | Application Performance Index  | Delay type             | Delay satisfaction index                                                     |
| Last            | Last                           | All types              | Latest value                                                                 |
| Uniq            | Estimated Uniq                 | Cardinality type       | Estimated cardinality                                                        |
| UniqExact       | Exact Uniq                     | Cardinality type       | Exact cardinality                                                            |

## Secondary Operators

| Operator   | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| PerSecond  | Calculates rate by dividing the inner operator result by the interval [1]|
| Math       | Arithmetic operations: supports +, -, \*, /                              |
| Percentage | Unit conversion to %                                                     |

- [1] For example: `PerSecond(Sum)` means summing first, then dividing by the API-provided interval `interval`; `PerSecond(Avg)` means averaging first, then dividing by the data source interval `data_precision`.

# Operator Calculation Logic for Different Metrics

## Counter/Gauge Metrics

- flow_metrics tables
  - `Sum` operator
    - Sum all data within the query time range
  - `Avg` operator
    - Sum all data within the query time range, then divide by `interval/data_precision`
  - Other operators
    - First aggregate using `Sum` based on `data_precision`
    - Then apply the selected operator using `ClickHouse` functions
  - When forced (due to other metrics in the same query) to use two-layer SQL calculation
    - `Sum/Avg` operator
      - First aggregate using `Sum` based on `data_precision`
      - Then apply the selected operator using `ClickHouse` functions
- flow_log tables
  - Apply the selected operator using `ClickHouse` functions
- prometheus/ext_metrics/deepflow_system tables
  - Same as flow_metrics tables
- Additional notes
  - `Min` operator fills 0 for time points with no data or null values

## Quotient/Percentage Metrics

- flow_metrics tables
  - `Avg` operator
    - Calculate `Sum(x)/Sum(y)` for all data within the query time range
  - Other operators
    - First aggregate `Sum(x)/Sum(y)` based on `data_precision`
    - Then apply the selected operator using `ClickHouse` functions
  - When forced to use two-layer SQL calculation
    - `Avg` operator
      - First aggregate `Sum(x)/Sum(y)` based on `data_precision`
      - Then apply the selected operator using `ClickHouse` functions
- flow_log tables
  - Apply the selected operator using `ClickHouse` function `func(x/y)`
- Additional notes
  - For `Percentage` metrics, the `Min` operator fills 0 for time points with no data
  - When calculating `Sum(x)/Sum(y)`, ignore points where the denominator is `0/null` or the numerator is `null`

## Delay/BoundedGauge Metrics

- flow_metrics tables
  - Apply the selected operator using `ClickHouse` functions
  - When forced to use two-layer SQL calculation
    - `Avg/Min/Max` operators
      - Both layers apply the selected operator using `ClickHouse` functions
    - `Spread/Rspread` operators
      - First aggregate using `Max` and `Min` based on `data_precision`
      - Then apply the selected operator using `ClickHouse` functions
    - Other operators
      - First aggregate using `groupArray`
      - Then apply the selected operator using `ClickHouse` functions
- flow_log tables
  - Apply the selected operator using `ClickHouse` functions
- Additional notes
  - For `BoundedGauge` metrics, the `Min` operator fills 0 for time points with no data or null values
  - For `Delay` metrics, ignore points with value 0, as 0 is considered a meaningless delay value

## data_precision for Different Databases/Tables

| Database        | data_precision | Notes                                                                 |
| --------------- | -------------- | --------------------------------------------------------------------- |
| flow_metrics    | 1s/1m          | Supports 1s and 1m by default, can be aggregated to 1h, 1d             |
| flow_log        | 1s             | No actual `data_precision` concept, value is for calculation purposes |
| application_log | 1s             | No actual `data_precision` concept, value is for calculation purposes |
| prometheus      | 10s            | Can be modified via `data_source_prometheus_interval` in `server.yaml`|
| ext_metrics     | 10s            | Can be modified via `data_source_ext_metrics_interval` in `server.yaml`|
| deepflow_admin  | 10s            |                                                                       |
| deepflow_tenant | 10s            |                                                                       |
| event           | 1s             | No actual `data_precision` concept, value is for calculation purposes |
| profile         | 1s             | No actual `data_precision` concept, value is for calculation purposes |