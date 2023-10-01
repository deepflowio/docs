---
title: 路径搜索框
---

# 路径搜索框

应用-路径统计/路径拓扑、网络-网络路径/网络拓扑/NAT追踪都使用的是`路径搜索框`。

![1-路径搜索框](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f883b6cf.png)

![2-路径搜索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f891b970.png)

![3-路径过滤](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8a31f4c.png)

路径搜索框可切换到`精简搜索`与`路径搜索`两种模式，配合`路径过滤`能力，查询所需路径的数据。
- **①/②/③/⑥**：详细的操作使用说明可参考[服务搜索框](./02-service_search.md)
- **④ 编辑服务外过滤条件**：编辑`外部服务集合`，默认此集合是不可见的
- **④ 切换精简搜索/路径搜索**：点击可切换到`精简搜索`及`路径搜索`两种模式
  - 精简搜索：过滤`搜索条件输入框`输入的 Tag 为`客户端`或者`服务端`的数据
  - 路径搜索：显示定义路径`客户端`及`服务端`两个方向，指定方向过滤数据
- **⑤ 路径过滤**：在`精简搜索`模式下，编辑路径过滤条件，DeepFlow 平台定义了三种类型的路径
  - 服务内路径：`搜索条件输入框`过滤的服务或者资源之间的路径
  - 服务外路径：`搜索条件输入框`过滤的服务或资源与其他服务或资源之间的路径
  - 广域网路径：`搜索条件输入框`过滤的服务或者资源与广域网之间的路径
- **⑦/⑧ 路径方向**：`路径搜索`模式下的方向
- **⑨ 交换方向**：点击可快速切换`客户端`与`服务端`

# 应用场景

## 查看某命名空间内所有服务的调用拓扑

- 功能页面：应用-路径拓扑
- 数据表：指标（分钟级）
-----------------------------
- 搜索标签：pod_ns = gcp-microservices-demo
- 路径：服务内
- 主分组：auto_service
- 次分组：tap_side

![4-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b00145.png)

## 查看某服务所有路径的应用性能

- 功能页面：应用-路径总览
- 数据表：指标（分钟级）
-----------------------------
- 搜索标签：pod_ns = gcp-microservices-demo，pod_service = productpageservice
- 路径：服务内，服务外，广域网
- 主分组：auto_service
- 次分组：tap_side

![5-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b659a4.png)

## 查看某服务访问云外 MySQL 的应用性能

- 功能页面：应用-路径总览
- 数据表：调用日志
-----------------------------
- 方向：客户端
- 搜索标签：pod_service = finaxxx，l7_protocol = MySQL
- 主分组：auto_service
- 次分组：tap_side
----------------------------------------
- 方向：服务端
- 搜索标签：ip = 8.x.x.x（为云外 MySQL 的地址）
- 主分组：auto_service
- 次分组：tap_side

![6-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8c96f16.png)

## 查看某两个工作负载互访的精细到 POD 粒度的应用性能

- 功能页面：应用-路径总览
- 数据表：指标（分钟级）
-----------------------------
- 搜索标签：pod_group = recommendationservice，pod_group = productcatalogservice
- 路径：服务内
- 主分组：auto_service
- 次分组：tap_side

![7-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8d313a2.png)

## 查看某域名对应路径的性能数据

- 功能页面：应用-路径总览
- 数据表：调用日志
-----------------------------
- 搜索标签：request_domain : hotels.travel-agency:8000
- 路径：服务内，服务外，广域网
- 主分组：auto_service
- 次分组：tap_side，request_domain

![8-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8de4a50.png)

## 查看访问某云服务器的流量 TOP 5 的其他资源 

- 功能页面：网络-网络路径
- 数据表：指标（分钟级）
------------------------------
- 方向：客户端
- 搜索标签：chost != cn-zhxxx
- 主分组：auto_service
- 次分组：tap_side

-----------------------------
- 方向：服务端
- 搜索标签：chost = cn-zhxxx
- 主分组：chost
- 次分组：tap_side

![9-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8eb246e.png)

## 查看访问某云服务器某服务端口流量 TOP 5 的广域网 IP

- 功能页面：网络-路径总览
- 数据表：流日志
------------------------------
- 方向：客户端
- 搜索标签：is_internet = 是
- 主分组：auto_service
- 次分组：tap_side

-----------------------------
- 方向：服务端
- 搜索标签：chost = cn-zhxx，server_port = 80
- 主分组：chost
- 次分组：tap_side，server_port

![10-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8f9ac67.png)

## 查看某客户端（POD）访问服务端（POD）的网络性能

- 功能页面：网络-路径总览
- 数据表：指标（分钟级）
-----------------------------
- 方向：客户端
- 搜索标签：pod = nginx-xxxx
- 主分组：pod
- 次分组：tap_side

------------------------------
- 方向：服务端
- 搜索标签：pod = bohriu-xxxx
- 主分组：pod
- 次分组：tap_side

![11-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f9054a2e.png)
