---
title: 流量分发
permalink: /features/enterprise-features/network/traffic-distribution/
---

# 流量分发

流量分发支持将网络流量分配到不同的网络设备或服务器上进行处理或响应。通过流量分发技术，可以提高网络的吞吐量、平衡网络负载、增加网络可靠性、优化网络性能以及提高网络安全性。

## 总览介绍

分发策略以表格形式展示，支持对分发策略进行新建、修改、删除等操作。

![10_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82c830aa.png)

- **① 新建**：支持新建分发策略。使用详情，请参阅【新建策略】章节
- **② 开启/禁用**：选择开启或禁用当前分发策略，开启后进行数据过滤抓取
- **③ 编辑**：对点击的分发策略进行修改
- **④ 删除**：删除该分发策略

### 新建策略

![10_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82e79fa2.png)

- 新建策略表格填写，部分可参阅【[PCAP下载 - 新建策略](./pacp-strategy/)】章节
- 分发动作：对获取到的流量进行处理
  - 流量处理：可选择对数据进行分发或丢弃
  - 分发点：选择添加要进行操作的分发点，分发点的添加，请参阅【分发点】章节

# 分发点

分发点以表格的形式展示所有建立的分发点信息。

## 总览介绍

![10_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82edb823.png)

- **① 新建分发点**：支持新建分发点，使用详情，请参阅【新建分发点】章节
- **② 关联分发策略数量**：点击后可跳转到分发策略页面中查看使用该分发点的分发策略
- **③ 编辑**：对点击的分发点进行修改
- **④ 删除**：删除该分发点

### 新建分发点

![10_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82fcea4c.png)

- 名称：填写分发点名称
- 分发协议：选择分发协议，支持 XVLAN、ERSPAN、TCP-NPB 协议
- 分发端点：填写分发点的 IP 地址
