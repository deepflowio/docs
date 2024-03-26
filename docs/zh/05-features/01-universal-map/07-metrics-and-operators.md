---
title: 指标和算子的计算逻辑
permalink: /features/universal-map/metrics-and-operators
---

本文将介绍不同类型指标，不同算子的计算逻辑。

# 指标

指标分为`应用性能指标`和`网络性能指标`两个大类。

## 应用性能指标

应用指标是用来衡量服务在实际运行中的性能表现的指标，主要关注服务的吞吐量、响应时延和异常情况。通过统计这些指标量，可以帮助运维人员和开发者更好地了解应用程序在实际使用中的表现，并且发现潜在的性能问题，从而采取相应的措施进行优化和改进。

以下描述的指标会在每个统计周期内都记录一个指标量，统计周期用户可以自定义，目前系统默认支持的为 1m（一分钟）和 1s（一秒）(这些数据 DeepFlow 平台统称为原始数据源)，如果在一个统计周期内，计算得到多个指标量时，最终会聚合记录为一个指标量，聚合的逻辑见后续`类型`的描述。

### 吞吐量（Throughput）

[csv-吞吐量](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.ch?Category=Throughput)

### 时延（Delay）

[csv-时延](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.ch?Category=Delay)

### 异常（Error）

[csv-异常](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/application.ch?Category=Error)

## 网络性能指标

网络指标是用来评估网络性能的一些量化指标，涵盖网络层、传输层和应用层，这些指标包括吞吐量、延迟、性能和异常类型等

### 网络层吞吐量 (L3 Throughput)

[csv-网络层吞吐](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=L3 Throughput)

### 传输层吞吐量（L4 Throughput）

[csv-传输层吞吐量](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=L4 Throughput)

活跃连接计算逻辑：
- 采集器以四元组（客户端 IP、服务端 IP、协议、服务端口）为单位统计原始活跃连接数，并进而计算出资源、路径对应的活跃连接数
- 数据源对应的时间间隔内能采集到流量，则统计活跃连接，但存在一些特殊情况：
  - 1s 数据源：描述每秒统计到的活跃连接数
    - 每分钟第1秒：包括该秒内无流量但未结束的连接，一般可用于评估并发连接（无交叠且持续时间小于一秒的多个连接会带来一些误差）
    - 每分钟后59秒：如果相同四元组的多条流在该秒内均无流量，这一秒会忽略该四元组对应的连接数，一般可用于评估并发连接的下界
  - 1m 数据源：描述每分钟统计到的活跃连接数
    - 包括没有流量但仍未结束的连接，一般可用于评估并发连接的上界
  - 自定义数据源：根据 1s/1m 数据源通过 Avg/Max/Min 计算得到，含义与直接使用 1s/1m 数据源并选择 Avg/Max/Min 算子得到的值相同

### 传输层 TCP 性能 (TCP Slow)

[csv-传输层 TCP 性能](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=TCP Slow)

### 传输层 TCP 异常 (TCP Error)

[csv-传输层 TCP 异常](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=TCP Error)

TCP 客户端建连异常

![TCP 客户端建连异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032666028569e59b9.jpg)

TCP 服务端建连异常

![ TCP 服务端建连异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240326660285689dbfc.jpg)

TCP 传输异常

![TCP传输异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023102065322b5796c4c.png)

TCP 断连异常

![TCP 断连异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310206532388b33760.jpg)

传输 TCP 连接超时

![ TCP 连接超时](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023102065322b56ccae8.png)

### 传输层时延 (Delay)

[csv-传输层时延](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=Delay)

![TCP 网络时延解剖](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023030364019bdd98b78.jpg)

- 建连时产生的时延
  - [1] 完整的`建连时延`包含客户端发出 SYN 包到收到服务端回复的 SYN+ACK 包，并再次回复 ACK 包的整个时间。建连时延拆解开又可分为`客户端建连时延`与`服务端建连时延`
  - [2] `客户端建连时延`为客户端收到 SYN+ACK 包后，回复 ACK 包的时间
  - [3] `服务端建连时延`为服务端收到 SYN 包后，回复 SYN+ACK 包的时间
- 数据通信时产生的时延，可拆解为`客户端等待时延`+`数据传输时延`
  - [4] `客户端等待时延`为建连成功后，客户端首次发送请求的时间；为收到服务端的数据包后，客户端再发起数据包的时间
  - [5] `数据传输时延`为客户端发送数据包到收到服务端回复数据包的时间
  - [6] 在数据传输时延中还会产生系统协议栈的处理时延，称为`系统时延`，为数据包收到 ACK 包的时间

### 应用层指标（Application）

[csv-应用层指标](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=Application)

### 基数统计 (Cardinality)

统计周期内，计数采集到的数据不重复的 tag 个数。例如查询所有访问 pod_1 的`客户端 IP 地址 (ip_0)`这个指标量，表达的含义则是访问 pod_1 所有流量里面不重复的客户端 IP 地址有多少个。

[csv-基数统计](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/network.ch?Category=Cardinality)

# 算子

算子根据选定的时间范围及时间间隔，对原始数据源中的数据进行计算。例如使用折线图查看 1s 的原始数据源，最近 5 分钟，按 20s 的时间间隔的 Avg 数据，以折线图上一个点为例（14:43:00）则是读取原始数据源里面的 14:42:40 - 14:43:00 这个时间范围内的所有数据，然后求平均值。

算子支持嵌套叠加，其中`聚合算子`不支持叠加，例如 PerSecond(Avg(byte)) 表达的含义为先求 Avg(byte)，然后得到的值再根据 PerSecond 二次计算。

## 聚合算子

| 算子            | 英文名                        | 适用的指标类型   | 描述 |
| --------------- | ----------------------------- | ---------------- | ---- |
| Avg             | Average                       | 所有类型         | 平均值（用于 Counter/Gauge 指标时不会忽略零值）|
| AAvg            | Arithmetic Average            | 所有类型         | 算数平均值（先求每个时间点的均值，再求均值的平均）|
| Sum             | Sum                           | Counter 类型     | 加和值 |
| Max             | Maximum                       | 所有类型         | 最大值 |
| Min             | Minimum                       | 所有类型         | 最小值 |
| Percentile      | Estimated Percentile          | 所有类型         | 估算百分位数 |
| PercentileExact | Exact Percentile              | 所有类型         | 精准百分位数 |
| Spread          | Spread                        | 所有类型         | 绝对跨度，统计周期内，Max 减去 Min |
| Rspread         | Relative Spread               | 所有类型         | 相对跨度，统计周期内，Max 除以 Min |
| Stddev          | Standard Deviation            | 所有类型         | 标准差 |
| Apdex           | Application Performance Index | Delay 类型       | 时延满意度 |
| Last            | Last                          | 所有类型         | 最新值 |
| Uniq            | Estimated Uniq                | Cardinality 类型 | 估算基数统计 |
| UniqExact       | Exact Uniq                    | Cardinality 类型 | 精准基数统计 |

## 二级算子

| 算子 |  描述 |
| ---- |  ---- |
| PerSecond  | 计算速率，将指标量除以时间间隔（单位为秒） |
| Math  | 四则运算，支持 +、-、*、/ |
| Percentage  | 单位转化 % |

# 不同指标的算子计算逻辑

## Counter/Gauge 类指标

- flow_metrics 的数据表
  - `Sum`算子
    - 计算查询时间范围内所有数据的`Sum`
  - `Avg`算子
    - 计算查询时间范围内所有数据的`Sum`，并除以`interval/data_precision`
  - 其他算子
    - 先使用`Sum`根据`data_precision`进行聚合
    - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
  - 当被迫（由于同语句中其他指标量的需要）使用两层`SQL`计算时
    - `Sum/Avg`算子
      - 先使用`Sum`根据`data_precision`进行聚合
      - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算
- prometheus/ext_metrics/deepflow_system 的数据表
  - 与 flow_metrics 数据表一致
- 额外说明
  - `Min`算子对无数据或数据为`null`的时间点进行`fill 0`

## Quotient/Percentage 类指标

- flow_metric 的数据表
  - `Avg`算子
    - 计算查询时间范围内所有数据的`Sum(x)/Sum(y)`
  - 其他算子
    - 先使用`Sum(x)/Sum(y)`根据`data_precision`进行聚合
    - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
  - 当被迫（由于同语句中其他指标量的需要）使用两层`SQL`计算时
    - `Avg`算子
      - 先使用`Sum(x)/Sum(y)`根据`data_precision`进行聚合
      - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数`func(x/y)`进行计算
- 额外说明
  - `Percentage`类指标量的`Min`算子对无数据的时间点进行`fill 0`
  - 计算`Sum(x)/Sum(y)`时，忽略分母为`0/null`或分子为`null`的点

## Delay/BoundedGauge 类指标

- flow_metric 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算
  - 当被迫（由于同语句中其他指标量的需要）使用两层`SQL`计算时
    - `Avg/Min/Max`算子
      - 两层均根据选择的具体算子调用`ClickHouse`的函数进行计算
    - `Spread/Rspread`算子
      - 先使用`Max`和`Min`根据`data_precision`进行聚合
      - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
    - 其他算子
      - 先使用`groupArray`进行聚合
      - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算
- 额外说明
  - `BoundedGauge`类指标的`Min`算子对无数据或数据为`null`的时间点进行`fill 0`
  - `Delay`类指标忽略 0 的点，认为 0 是无意义的时延值

## 不同数据库/表的 data_precision

| 数据库          | data_precision | 备注                                                            |
| --------------- |  ------------- | --------------------------------------------------------------- |
| flow_metrics    | 1s/1m          | 默认支持 1s、1m，可聚合为 1h、1d                                |
| flow_log        | 1s             | 实际上没有`data_precision`的概念，其取值仅为方便计算            |
| prometheus      | 10s            | 可通过`server.yaml`的`data_source_prometheus_interval`字段修改  |
| ext_metrics     | 10s            | 可通过`server.yaml`的`data_source_ext_metrics_interval`字段修改 |
| deepflow_system | 10s            |                                                                 |
