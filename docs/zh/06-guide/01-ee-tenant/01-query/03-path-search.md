---
title: 路径搜索框
permalink: /guide/ee-tenant/query/path-search/
---

# 路径搜索框

应用-路径分析/拓扑分析、网络-路径分析/拓扑分析/NAT追踪都使用的是`路径搜索框`。

![00-路径搜索框](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065faac6eb6f17.png)
 
- **①/②/③/④/⑦**：详细的操作使用说明可参考[资源搜索框](./service-search/) 
- **⑤ 搜索模式**：可切换`精简模式`、`单向路径`、`双向路径`三种种模式，配合`路径过滤`能力，查询所需路径的数据
  - 精简搜索：输入的`搜索标签`，将作为`客户端`及`服务端`的条件进行查询。使用详情，请参阅【精简模式】章节
  - 单向路径：输入的`搜索标签`，将作为对应的`客户端`或`服务端`的条件进行查询。使用详情，请参阅【单向路径】章节
  - 双向路径：输入的`搜索标签`，不指定查询方向。使用详情，请参阅【双向路径】章节
- **⑥ 路径过滤**：仅在`精简搜索`模式下支持。使用详情，请参阅【精简模式】章节 

## 精简模式

![01-精简模式](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065fab1ff0d41a.png)

路径搜索框可切换`精简模式`、`单向路径`、`双向路径`三种种模式，配合`路径过滤`能力，查询所需路径的数据。
- **①/②/③/④**：详细的操作使用说明可参考[资源搜索框](./service-search/) 
- **⑤ 搜索模式**：点击可切换到`精简搜索`或`路径搜索`两种模式 
- **⑤ 路径过滤**：支持选择查询的路径，并支持查询三种类型的路径，仅在`精简搜索`模式下支持
  - 服务内路径：服务或者资源之间的路径
  - 服务外路径：服务或资源与其他服务或资源之间的路径
  - 广域网路径：服务或者资源与广域网之间的路径  

## 单向路径

![02-单向路径](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065fab3eccc2de.png)
 
- **①/②/③/④**：详细的操作使用说明可参考[资源搜索框](./service-search/) 
- **⑤ 搜索模式**：可切换搜索模式。使用详情，请参阅【路径搜索框】章节  
- **⑥ 交换方向**：点击可快速交换`客户端`与`服务端`的搜索条件，仅在`单向路径`模式下支持 

## 双向路径

![03-双向路径](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032065fab5961fd4e.png)
 
- **①/②/③/④**：详细的操作使用说明可参考[资源搜索框](./service-search/) 
- **⑤ 搜索模式**：可切换搜索模式。使用详情，请参阅【路径搜索框】章节 

# 应用场景

## 查看某命名空间内所有服务的调用拓扑

- 功能页面：应用-拓扑分析
- 数据表：指标（分钟级）
-----------------------------
- 搜索标签：pod_ns = gcp-microservices-demo
- 路径：服务内
- 主分组：auto_service
- 次分组：observation_point

![04-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b00145.png)

## 查看某服务所有路径的应用性能

- 功能页面：应用-路径总览
- 数据表：指标（分钟级）
-----------------------------
- 搜索标签：pod_ns = gcp-microservices-demo，pod_service = productpageservice
- 路径：服务内，服务外，广域网
- 主分组：auto_service
- 次分组：observation_point

![05-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8b659a4.png)

## 查看某服务访问云外 MySQL 的应用性能

- 功能页面：应用-路径总览
- 数据表：调用日志
-----------------------------
- 方向：客户端
- 搜索标签：pod_service = finaxxx，l7_protocol = MySQL
- 主分组：auto_service
- 次分组：observation_point
----------------------------------------
- 方向：服务端
- 搜索标签：ip = 8.x.x.x（为云外 MySQL 的地址）
- 主分组：auto_service
- 次分组：observation_point

![06-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8c96f16.png)

## 查看某两个工作负载互访的精细到 POD 粒度的应用性能

- 功能页面：应用-路径总览
- 数据表：指标（分钟级）
-----------------------------
- 搜索标签：pod_group = recommendationservice，pod_group = productcatalogservice
- 路径：服务内
- 主分组：auto_service
- 次分组：observation_point

![07-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8d313a2.png)

## 查看某域名对应路径的性能数据

- 功能页面：应用-路径总览
- 数据表：调用日志
-----------------------------
- 搜索标签：request_domain : hotels.travel-agency:8000
- 路径：服务内，服务外，广域网
- 主分组：auto_service
- 次分组：observation_point，request_domain

![08-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8de4a50.png)

## 查看访问某云服务器的流量 TOP 5 的其他资源

- 功能页面：网络-路径分析
- 数据表：指标（分钟级）
------------------------------
- 方向：客户端
- 搜索标签：chost != cn-zhxxx
- 主分组：auto_service
- 次分组：observation_point

-----------------------------
- 方向：服务端
- 搜索标签：chost = cn-zhxxx
- 主分组：chost
- 次分组：observation_point

![09-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8eb246e.png)

## 查看访问某云服务器某服务端口流量 TOP 5 的广域网 IP

- 功能页面：网络-路径总览
- 数据表：流日志
------------------------------
- 方向：客户端
- 搜索标签：is_internet = 是
- 主分组：auto_service
- 次分组：observation_point

-----------------------------
- 方向：服务端
- 搜索标签：chost = cn-zhxx，server_port = 80
- 主分组：chost
- 次分组：observation_point，server_port

![10-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f8f9ac67.png)

## 查看某客户端（POD）访问服务端（POD）的网络性能

- 功能页面：网络-路径总览
- 数据表：指标（分钟级）
-----------------------------
- 方向：客户端
- 搜索标签：pod = nginx-xxxx
- 主分组：pod
- 次分组：observation_point

------------------------------
- 方向：服务端
- 搜索标签：pod = bohriu-xxxx
- 主分组：pod
- 次分组：observation_point

![11-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f9054a2e.png)
