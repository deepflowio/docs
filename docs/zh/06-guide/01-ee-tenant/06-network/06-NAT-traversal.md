---
title: NAT 追踪
permalink: /guide/ee-tenant/network/NAT-traversal/
---

# NAT 追踪

NAT 追踪可对任意 TCP 四元组或五元组发起追踪，利用 DeepFlow 自研算法自动追踪 NAT 前后流量。NAT 追踪页面通过表格的形式展示被点击数据的四元组所对应的指标量，点击`追踪`则可对四元组发起追踪。

## 总览介绍

![总览介绍](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566442f3ee84e5.png)

- 页面按钮功能，使用详情，请参阅【[追踪 - 调用日志](../tracing/call-log/)】章节
- 网络追踪表格：以表格形式展示客户端、服务端、分组信息、流量速率、TCP 重传比例、TCP 建连失败、TCP 建连时延。
  - 操作:
    - 点击行：可对该数据进行追踪，使用详情，请参阅【[追踪 - 右滑框 - NAT 追踪详情](../tracing/right-sliding-box/)】章节
