---
title: Prometheus Remote Write
permalink: /integration/output/export/prometheus-remote-write
---

# 功能

通过 Prometheus Remote Write 的方式，可以将 DeepFlow 的生成的指标导出到外部的平台。结合 Prometheus 的生态继续使用，比如可以通过 Prometheus 查看指标，配置告警等能力

# Metrics 简介

在 DeepFlow 内，关于 Metric 可以分为两种

- 应用性能指标：[具体可参考](../../../05-features/01-universal-map/02-application-metrics.md)

- 网络性能指标：[具体可参考](../../../05-features/01-universal-map/04-network-metrics.md)

当前导出的指标，主要是应用性能指标，对应到 clickhouse 里是 `flow_metrics.vtap_app_edge_port` 表数据，其它方式后续再迭代增加，作为可配置的方式

# Prometheus Remote Write

协议格式可参考 Prometheus 的 pb 文件定义：https://github.com/prometheus/prometheus/blob/main/prompb/remote.proto


# DeepFlow Server 配置指引

在 Server 的配置下，增加如下配置，即可开启指标导出

```yaml
ingester:
  metrics-prom-writer:
    enabled: true
    endpoint: "{replace_with_remote_write_url}"  # eg: "http://localhost:1234/receive"
    metrics-filter:
    - app
```

# 详细参数说明

|     字段   |    类型    |   必选   |  描述  |
|-----------|------------|--------|--------|
| enabled       | bool  | 是 | 是否开启，默认:false |
| endpoint      | string| 是 | 远端接收地址，remote write接收地址|
| metrics-filter| list | 是 | 导出类型，目前仅支持app一种，代表导出应用性能指标 |
| headers       | map  | 否 | 远端HTTP请求的头部字段，比如有效验需求的，可以在这里补充token等信息|
| batch-size    | int  | 否 | 批次大小，当达到这个数值，成批的发送。默认值: 2048|
| flush-timeout | int  | 否 | 刷新间隔，当达到这个时间，则直接发送。单位: 秒，默认值: 5|
| concurrency   | int  | 否 | 并发发送数，默认值: 2|



# 快速实践 demo

- 搭建一个 RemoteWrite 接收端，可参考 Prometheus 的这个[demo](https://github.com/prometheus/prometheus/tree/main/documentation/examples/remote_storage/example_write_adapter)

- 添加配置

```yaml
ingester:
    metrics-prom-writer:
    enabled: true
    endpoint: "http://localhost:1234/receive"
    metrics-filter:
    - app
```

- 重启 DeepFlow Server，稍等片刻后，即可在 RemoteWrite 接收端，看到如图输出结果

![](./imgs/remote-write.png)



