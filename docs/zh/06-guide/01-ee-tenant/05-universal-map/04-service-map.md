---
title: 服务拓扑
permalink: /guide/ee-tenant/universal-map/service-map/
---

# 服务拓扑

将用户在`业务定义`中定义的`服务`通过瀑布拓扑的形式展示。

![01-服务拓扑](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fa1b279.png)

- **① 业务切换下拉框**：快速切换业务，默认为第一个标星的业务
- **② 服务管理**：点击按钮，进入业务详情页
- **③ 设置**：支持`查看API`、`加入视图`等
- **④ 图例**：查看 ICON 的语义
- **⑤ 服务组**：由`名称行`+`方框`组成，如图中的客户端、gcp-microservices-demo、DNS、Redis 都为独立的服务组
- **⑥ 服务**：拓扑中每一个块都代表一个服务，由`名称行`+`指标量`组成，悬停可查看 TIP，点击将通过右滑框查看服务详情，见后续章节说明
  - 名称行：ICON 表达服务类型
  - 指标量：只显示服务作为服务端的指标量，当指标量超过阈值时，名称行及对应的指标量都会标红
- **⑦ 路径**：代表客户端访问服务端实际有数据的路径，悬停可查看 TIP，点击将通过右滑框查看路径详情，见后续章节说明

## 右滑框

点击`服务`或`路径`都将进入右滑框，查看其详细信息，右滑框由上层`调用拓扑`及下层 TAB 组成。

### 调用拓扑

通过`调用拓扑`查看选中服务的客户端及服务端，也可查看选中的路径。

![02-调用拓扑](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fc61c4d.png)

- **① 切换分组**：可按 * 、auto_service、auto_instance 三个维度查看调用拓扑
- **② 名称**：当前被点击的`服务`或者`路径`名称，对应下层 TAB 查看的对象。
- **③ 节点**：参考[流量拓扑](../dashboard/panel/topology/)介绍
- **④ 路径**：参考[流量拓扑](../dashboard/panel/topology/)介绍

### 知识图谱

![03-知识图谱](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f435c6d.png)

参考[应用-右滑框-知识图谱](../application/right-sliding-box/)介绍

### 应用性能

可利用`应用性能`分析选中的服务或路径是否存在应用层的异常。

![04-应用性能](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f6ac6b5.png)

TAB 由吞吐、时延、异常三个曲线图及下方的端点列表组成，点击端点列表的行可进入下一级右滑框。

![04-1-应用性能](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f764e5d.png)
![04-2-应用性能](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f799476.png)

下级右滑框可查看某个端点的 RED 指标及日志详情，当存在异常是可查看`异常分析`。


### 网络性能

可利用`网络性能`分析选中的服务或路径是否存在应用层的异常。

![05-网络性能](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9625df.png)

TAB 由吞吐、时延、异常、性能四个曲线图及下方的服务端口列表组成，点击列表的行可进入下一级右滑框。
- 服务：可分别查看服务`作为客户端`或者`作为服务端`的数据
- 路径：通过点击`路径拓扑`上每一个`路径统计位置`，分别查看每个`路径统计位置`的数据

![05-1-网络性能](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9c515d.png)
![05-2-网络性能](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fd02700.png)

下级右滑框可查看某个服务端口的 RED 指标及日志详情，当存在异常是可查看`异常分析`。

### 事件

查看`服务`或`路径`的资源变更事件

![06-事件](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fcdb8b4.png)

参考[应用-右滑框-事件](../application/right-sliding-box/)介绍
