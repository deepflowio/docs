---
title: 指标量算子的计算逻辑
permalink: /auto-metrics/metric-calc-desc
---

本文将介绍不同类型指标，不同算子的计算逻辑

# 指标

指标分为`应用指标`和`网络指标`两个大类

## 应用指标

应用指标是用来衡量服务在实际运行中的性能表现的指标，主要关注服务的吞吐量、响应时延和异常情况。通过统计这些指标量，可以帮助运维人员和开发者更好地了解应用程序在实际使用中的表现，并且发现潜在的性能问题，从而采取相应的措施进行优化和改进。

以下描述的指标会在每个统计周期内都记录一个指标量，统计周期用户可以自定义，目前系统默认支持的为 1m（一分钟）和 1s（一秒）(这些数据 DeepFlow 平台统称为原始数据源)，如果在一个统计周期内，计算得到多个指标量时，最终会聚合记录为一个指标量，聚合的逻辑见后续`类型`的描述。

### 吞吐量（Throuthput）

[csv-吞吐量](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_app_port.ch?Category=Throuthput)

### 时延（Delay）

[csv-时延](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_app_port.ch?Category=Delay)

### 异常（Error）

[csv-异常](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_app_port.ch?Category=Error)

## 网络指标

网络指标是用来评估网络性能的一些量化指标，涵盖网络层、传输层和应用层，这些指标包括吞吐量、延迟、性能和异常类型等

### 网络层吞吐量 (L3 Throughput)

[csv-网络层吞吐](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch?Category=L3 Throughput)

### 传输层吞吐量（L4 Throughput）

[csv-传输层吞吐量](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch?Category=L4 Throughput)

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

[csv-传输层 TCP 性能](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch?Category=L4 TCP Slow)

### 传输层 TCP 异常 (TCP Error)

[csv-传输层 TCP 异常](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch?Category=TCP Error)

TCP 客户端建连异常

![TCP 客户端建连异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023031764140f2adf916.png)

TCP 服务端建连异常

![ TCP 服务端建连异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023031764140f29db7e2.png)

TCP 传输异常

![TCP传输异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023031764140f2adcc35.png)

TCP 断连异常

![TCP 断连异常](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023031764140f3e9b26f.png)

传输 TCP 连接超时
- 现象：连接未关闭，但长时间无数据传输
- 原因：主机离线或应用异常
- 检查：检查主机或应用健康状态

### 传输层时延 (Delay)

[csv-传输层时延](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch?Category=Delay)

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

[csv-应用层指标](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch?Category=Application)  

### 基数统计 (Cardinality)

统计周期内，计数采集到的数据不重复的 tag 个数。例如查询所有访问 pod_1 的`客户端 IP 地址 (ip_0)`这个指标量，表达的含义则是访问 pod_1 所有流量里面不重复的客户端 IP 地址有多少个。

[csv-基数统计](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_metrics/vtap_flow_port.ch?Category=Cardinality)  

# 算子

算子根据选定的时间范围及时间间隔，对原始数据源中的数据进行计算。例如使用折线图查看 1s 的原始数据源，最近 5 分钟，按 20s 的时间间隔的 Avg 数据，以折线图上一个点为例（14:43:00）则是读取原始数据源里面的 14:42:40 - 14:43:00 这个时间范围内的所有数据，然后求平均值。

算子支持嵌套叠加，其中`聚合算子`不支持叠加，例如 PerSecond(Avg(byte)) 表达的含义为先求 Avg(byte)，然后得到的值再根据 PerSecond 二次计算。

## 聚合算子

| 算子 | 适用的指标类型 | 描述 |
| ---- | ------------ | ---- |
| Avg  | 所有类型 | 平均值 |
| Sum  | 除 Percentage 以外的所有类型| 加和值 |
| Max  | 所有类型 | 最大值 |
| Min  | 所有类型 | 最小值 |
| Percentile  | 所有类型 | 估算百分位数 |
| PercentileExact | 所有类型 | 精准百分位数 |
| Spread | 所有类型 | 绝对跨度，统计周期内，Max 减去 Min |
| Rspread | 所有类型 | 相对跨度，统计周期内，Max 除以 Min |
| Stddev | 所有类型 | 标准差 |
| Apdex | Delay 类型 | 时延满意度 |
| Last | 所有类型 | 最新值 |
| Uniq | Cardinality 类型 | 估算基数统计 |
| UniqExact | Cardinality 类型 | 精准基数统计 |

## 二级算子

| 算子 |  描述 |
| ---- |  ---- |
| PerSecond  | 计算速率，将指标量除以时间间隔（单位为秒） |
| Math  | 四则运算，支持 +、-、*、/ |
| Percentage  | 单位转化 % |

# 类型

## Counter/Gauge 类型

- flow_metric 的数据表
  - 先使用`Sum`根据`data_precision`进行聚合
  - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算

## Quotient/Percentage 类型

- flow_metric 的数据表
  - 先使用`Sum(x)/Sum(y)`根据`data_precision`进行聚合
  - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数`func(x/y)`进行计算

## Delay 类型

- flow_metric 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算
