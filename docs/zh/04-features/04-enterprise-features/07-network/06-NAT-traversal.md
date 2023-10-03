---
title: NAT 追踪
permalink: /features/enterprise-features/network/NAT-traversal/
---

# NAT 追踪

NAT 追踪可对任意 TCP 四元组或五元组发起追踪，利用 DeepFlow 自研算法自动追踪 NAT 前后流量。NAT 追踪页面通过表格的形式展示被点击数据的四元组所对应的指标量，点击`追踪`则可对四元组发起追踪。

## 总览介绍

![6_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b080e18.png)

- 页面按钮功能，使用详情，请参阅【[应用 - 调用日志](../application/call-log/)】章节
- 网络追踪表格：以表格形式展示客户端、服务端、分组信息、流量速率、TCP重传比例、TCP建连失败、TCP建连时延。
  - 操作:
    - 点击行：点击数据行，即可通过右滑框的形式查看该数据的详情信息，使用详情，请参阅【[右滑框 - 网络指标](../application/right-sliding-box/)】章节
    - 操作按钮：点击`NAT 追踪`按钮，可对该数据进行追踪，使用详情，请参阅【[右滑框 - NAT追踪详情](../application/right-sliding-box/)】章节

