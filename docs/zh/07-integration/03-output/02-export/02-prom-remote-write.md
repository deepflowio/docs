---
title: Prometheus Remote Write
permalink: /integration/output/export/prometheus-remote-write
---

# 功能

通过Prometheus Remote Write的方式，可以将DeepFlow的生成的指标导出到外部的平台。结合Prometheus的生态继续使用，比如可以通过Prometheus查看指标，配置告警等能力

# Metrics简介

在DeepFlow内，关于Metric可以分为两种

- 应用性能指标：[具体可参考](../../../05-features/01-universal-map/02-application-metrics.md)

- 网络性能指标：[具体可参考](../../../05-features/01-universal-map/04-network-metrics.md)

当前导出的指标，主要是应用性能指标，对应到clickhouse里是`flow_metrics.vtap_app_edge_port`表数据，其它方式后续再迭代增加，作为可配置的方式

# Prometheus Remote Write

协议格式可参考Prometheus的pb文件定义：https://github.com/prometheus/prometheus/blob/main/prompb/remote.proto


# DeepFlow Server配置指引

在Server的配置下，增加如下配置，即可开启指标导出

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



# 快速实践demo

- 搭建一个RemoteWrite接收端，可参考Prometheus的这个[demo](https://github.com/prometheus/prometheus/tree/main/documentation/examples/remote_storage/example_write_adapter)

- 添加配置

```yaml
ingester:
    metrics-prom-writer:
    enabled: true
    endpoint: "http://localhost:1234/receive"
    metrics-filter:
    - app
```

- 重启DeepFlow Server，稍等片刻后，即可在RemoteWrite接收端，看到如图输出结果

![](./imgs/remote-write.png)



