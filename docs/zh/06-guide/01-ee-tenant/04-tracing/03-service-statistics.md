---
title: 路径分析
permalink: /guide/ee-tenant/tracing/service-statistics/
---

# 路径分析

路径分析页面在资源分析页面的基础上，展示了请求应用的客户端与服务端，能从更多维度更灵活的来分析应用性能指标，可以了解服务请求速率、响应时间和异常比例等指标信息，有助于定位系统瓶颈和优化系统性能。

## 总览介绍

![总览介绍](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a6ba9e6900.png)

- **① 时间选择器**：支持时间过滤查询，使用详情，请参阅【[视图详情 - 时间选择器](../dashboard/use/)】章节
- **② 搜索快照**：支持将搜索条件保存为快照，使用详情，请参阅【[查询 - 搜索快照](../query/history/)】章节
- **③ 搜索保存与设置**：
  - 搜索保存：支持将当前页面的搜索条件快速保存，使用详情，请参阅【[查询 - 搜索快照](../query/history/)】章节
  - 设置：页面设置操作的集合
    - 数据库字段：支持查看当前页面使用的数据表中的 tag、metrics
    - 开启/关闭 Tip 同步：开启后，可同时查看所有折线图在相同时间点时的指标数据
    - 切换补值方式：当数据在某个时间点不存在时，可通过切换补值方式来按需处理
    - 切换堆叠：快速切换功能页面所有时序相关子视图平铺/堆叠的显示形式
    - 名称缺省/全称显示：图例的名称全称显示或缺省显示
- **④ 搜索框**：支持对 Tag 进行搜索或分组，使用详情，请参阅【[查询](../query/overview/)】章节
- **⑤ 左侧快速过滤**：可快速过滤数据，使用详情，请参阅【[查询 - 左侧快速过滤](../query/left-quick-filter/)】章节
- **⑥ 区域查询**：支持快速切换查询区域数据
- **表格操作**：
  - 点击行：点击表格的数据，可快速进入右滑框查看对应应用服务的相关信息，使用详情，请参阅【[右滑框](./right-sliding-box/)】章节
