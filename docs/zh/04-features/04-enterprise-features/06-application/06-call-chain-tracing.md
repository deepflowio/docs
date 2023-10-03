---
title: 调用链追踪
permalink: /features/enterprise-features/application/call-chain-tracing/
---

# 调用链追踪

调用链追踪记录每一次调用的详细信息，仅支持 eBPF 采集的数据或者通过 OpenTelemetry 协议传输给 DeepFlow 的调用发起追踪。

## 总览介绍

![6_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650aa718393da.png)

- **① 时间选择器**：支持时间过滤查询，使用详情，请参阅【[视图详情 - 时间选择器](../dashboard/use/)】章节
- **② 搜索快照**：支持将搜索条件保存为快照，使用详情，请参阅【[查询 - 搜索快照](../query/history/)】章节
- **③ 搜索保存与设置**：
  - 搜索保存：支持将当前页面的搜索条件快速保存，使用详情，请参阅【[查询 - 搜索快照](../query/history/)】章节
  - 设置：页面设置操作的集合
    - 数据库字段：支持查看当前页面使用的数据表中的 tag、metrics
    - 名称缺省/全称显示：图例的名称全称显示或缺省显示
- **④ 服务搜索框**：支持对 Tag 进行搜索或分组，使用详情，请参阅【[查询](../query/overview/)】章节
- **⑤ 左侧快速过滤**：可快速过滤数据，使用详情，请参阅【[查询 - 左侧快速过滤](../query/left-quick-filter/)】章节
- **⑥ 区域查询**：支持快速切换查询区域数据
- **应用追踪表格**：展示一定时间内服务或资源间的调用信息，如客户端、服务端、请求资源、请求类型、请求域名等，使用详情，请参阅【[表格](../dashboard/panel/table/)】章节
  - **操作:** 点击`追踪`按钮，可进入右滑框中查看由该请求追踪出来的的整个调用生命周期，使用详情，请参阅【[右滑框 - 调用链追踪](./right-sliding-box/)】章节
