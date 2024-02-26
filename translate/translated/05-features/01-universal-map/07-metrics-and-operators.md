---
title: Calculation Logic of Metrics and Operators
permalink: /features/universal-map/metrics-and-operators
---

> This document was translated by GPT-4

This article will introduce different types of metrics and the calculation logic of different operators.

# Metrics

Metrics are divided into two main categories: `application performance metrics` and `network performance metrics`.

## Application Performance Metrics

Application metrics are used to measure the performance of services in actual operation, focusing mainly on service throughput, response latency, and exceptions. By quantifying these metrics, operations personnel and developers can better understand the performance of the application during actual use and identify potential performance issues, thereby taking appropriate measures for optimization and improvement.

The metrics described below will record a metric quantity in each statistical period. Users can customize the statistical period, and the system currently supports 1m (one minute) and 1s (one second) (these data are collectively referred to as the original data source by the DeepFlow platform). If multiple metric quantities are calculated in a statistical period, they will finally be aggregated and recorded as one metric quantity. The logic for aggregation is described in the subsequent description of the `type`.

### Throughput

[csv-Throughput](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.ch?Category=Throughput)

### Delay

[csv-Delay](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.ch?Category=Delay)

### Error

[csv-Error](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.ch?Category=Error)

## Network Performance Metrics

Network metrics are quantitative indicators used to assess network performance, covering the network layer, transport layer, and application layer. These metrics include throughput, latency, performance, and types of exceptions.

### L3 Throughput

[csv-L3 Throughput](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=L3 Throughput)

### L4 Throughput

[csv-L4 Throughput](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=L4 Throughput)

Active connection calculation logic:

- The collector counts the original active connections on the unit of four-tuples (client IP, server IP, protocol, server port), and then calculates the active connections corresponding to resources and paths.
- If traffic can be collected within the time interval corresponding to the data source, the active connections will be counted; however, there are some special situations:
  - 1s data source: describes the number of active connections counted per second.
    - Each minute, the first second: Includes connections that have no traffic but have not ended within this second. This is generally used to evaluate concurrent connections (many non-overlapping connections with a duration of less than a second can cause some errors).
    - Each minute, the last 59 seconds: If multiple flows with the same four-tuple have no traffic within this second, this second will ignore the number of connections corresponding to this four-tuple. This is generally used to evaluate the lower limit of concurrent connections.
  - 1m data source: describes the number of active connections counted per minute.
    - Includes connections that have no traffic but have not ended. This is generally used to evaluate the upper limit of concurrent connections.
  - Custom data sources: derived from 1s/1m data sources through Avg/Max/Min calculation. The meaning is the same as directly using the 1s/1m data source and choosing the Avg/Max/Min operator.

### TCP Performance (TCP Slow)

[csv-TCP Performance](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=TCP Slow)

### TCP Exceptions (TCP Error)

[csv-TCP Exceptions](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=TCP Error)

TCP client Connection exceptions

![TCP client Connection exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023102065322b5a0876b.png)

TCP server Connection exceptions

![TCP server Connection exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023102065322b597dff6.png)

TCP Transfer exceptions

![TCP Transfer exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023102065322b5796c4c.png)

TCP Disconnection exceptions

![TCP Disconnection exceptions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310206532388b33760.jpg)

TCP Connection timeouts

![TCP Connection timeouts](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023102065322b56ccae8.png)

### Transport Layer Delay (Delay)

[csv-Transport Layer Delay](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=Delay)

![TCP network delay dissection](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023030364019bdd98b78.jpg)

- Delay caused during connection establishment
  - [1] The complete `connection establishment delay` includes the entire time from the client sending a SYN packet to receiving the SYN+ACK packet replied by the server, and then replying with an ACK packet. The connection establishment delay can be further divided into the `client connection establishment delay` and the `server connection establishment delay`.
  - [2] The `client connection establishment delay` is the time for the client to reply with an ACK packet after receiving the SYN+ACK packet.
  - [3] The `server connection establishment delay` is the time for the server to reply with a SYN+ACK packet after receiving the SYN packet.
- Delay generated during data communication, which can be broken down into `client wait delay` + `data transfer delay`.
  - [4] The `client wait delay` is the time for the client to first send a request after a successful connection; it is the time for the client to send another data packet after receiving the server's data packet.
  - [5] The `data transfer delay` is the time from the client sending a data packet to receiving a reply data packet from the server.
  - [6] During the data transfer delay, there will be system protocol stack processing delays, called `system delay`, which is the time for the data packet to receive the ACK packet.

### Application Layer Metrics (Application)

[csv-Application Layer Metrics](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=Application)

### Cardinality Statistics (Cardinality)

The number of non-repeated tags counted in the statistical period. For example, if you query the metric "client IP address (ip_0)" that all access to `pod_1`, the expression implies how many non-repeated client IP addresses are there in all the traffic visiting `pod_1`.

[csv-Cardinality Statistics](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=Cardinality)

# Operators

Operators compute the data in the original data source according to the selected time range and interval. For example, when using a line chart to view the original data source of 1s, the latest 5 minutes, according to 20s time interval Avg data, taking one point on the line chart as an example (14:43:00), it is to read all the data in the time range of 14:42:40 - 14:43:00 in the original data source, and then calculate the average.

Operators support nested stacking. Among them, `aggregation operators` do not support stacking. For example, the expression PerSecond(Avg(byte)) means to calculate Avg(byte) first, and then the obtained value is secondarily calculated according to PerSecond.

## Aggregation Operators

| Operator        | Applicable Metric Types     | Description                                                        |
| --------------- | --------------------------- | ------------------------------------------------------------------ |
| Avg             | All types                   | Average                                                            |
| Sum             | All types except Percentage | Sum                                                                |
| Max             | All types                   | Maximum                                                            |
| Min             | All types                   | Minimum                                                            |
| Percentile      | All types                   | Estimated Percentile                                               |
| PercentileExact | All types                   | Exact Percentile                                                   |
| Spread          | All types                   | Absolute span, the period of statistics inside, Max minus Min      |
| Rspread         | All types                   | Relative span, the period of statistics inside, Max divided by Min |
| Stddev          | All types                   | Standard deviation                                                 |
| Apdex           | Delay type                  | Latency Satisfaction Index                                         |
| Last            | All types                   | Most recent value                                                  |
| Uniq            | Cardinality type            | Estimated cardinality statistics                                   |
| UniqExact       | Cardinality type            | Accurate cardinality statistics                                    |

## Secondary Operators

| Operator   | Description                                                                         |
| ---------- | ----------------------------------------------------------------------------------- |
| PerSecond  | Calculates the rate, dividing the metric quantity by the time interval (in seconds) |
| Math       | Arithmetic operations, supports +, -, \*, /                                         |
| Percentage | Unit conversion %                                                                   |

# Operator Calculation Logic for Different Metrics

## Counter/Gauge Type Metrics

- Flow_metric data table:
  - First use `Sum` to aggregate according to `data_precision`.
  - Then use the specific operator selected to call the `ClickHouse` function to calculate.
- Flow_log data table:
  - Use the specific operator selected to call the `ClickHouse` function to calculate.

## Quotient/Percentage Type Metrics

- Flow_metric data table:
  - First use `Sum(x)/Sum(y)` to aggregate according to `data_precision`.
  - Then call the `ClickHouse` function to calculate according to the specific operator selected.
- Flow_log data table:
  - Use the specific operator selected to call the `ClickHouse` function `func(x/y)` to perform calculation.

## Delay Type Metrics

- Flow_metric data table:
  - Use the specific operator selected to call the `ClickHouse` function to calculate.
- Flow_log data table:
  - Use the specific operator selected to call the `ClickHouse` function to calculate.
