---
title: 指标量算子的计算逻辑
permalink: /auto-metrics/metric-calc-desc
---

本文将介绍不同类型指标，不同算子的计算逻辑

# Counter/Gauge 类型

- flow_metric 的数据表
  - 先使用`Sum`根据`data_precision`进行聚合
  - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算

# Quotient/Percentage 类型

- flow_metric 的数据表
  - 先使用`Sum(x)/Sum(y)`根据`data_precision`进行聚合
  - 再根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数`func(x/y)`进行计算

# Delay 类型

- flow_metric 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算
- flow_log 的数据表
  - 根据选择的具体算子调用`ClickHouse`的函数进行计算
