---
title: 日志搜索框
permalink: /guide/ee-tenant/query/log-search/
---

# 日志搜索框

应用-调用日志/调用链追踪、网络-流日志都使用的是`日志搜索框`。

`日志搜索框`相比`路径搜索框`仅少了`分组`能力，详细的操作使用说明可参考[路径搜索框](./path-search/)

![00-日志搜索框](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f5e7a6cd.png)

# 应用场景

## 查看某服务存在异常的调用

- 功能页面：应用-调用日志

---

- 服务集合：S1
- 搜索标签：pod_service = frontend-external，response_status != 正常
- 路径：服务内、服务外、广域网
- 方向：双方向

![01-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f61ad6e0.png)

## 查看某服务的 MySQL 调用

- 功能页面：应用-调用日志

---

- 服务集合：S1
- 搜索标签：pod_service = cars，l7_protocol = MySQL
- 路径：服务内、服务外、广域网
- 方向：双方向

![02-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f60c6540.png)

## 查看某五元组的流日志

- 功能页面：网络-流日志

---

- 服务集合：S1
- 搜索标签：pod = insurances-v1-d895774d6-26wf7，client_port = 46168，protocol = TCP
- 路径：服务内
- 主分组：pod
- 次分组：observation_point
- 方向：客户端

---

- 服务集合：S2
- 搜索标签：pod = mysqldb-v1-5cc78df8d-fwrn4，server_port = 3306
- 路径：服务内
- 主分组：pod
- 次分组：observation_point
- 方向：服务端

![03-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f601adf9.png)

## 查看某 POD 存在建连异常的流日志

- 功能页面：网络-流日志

---

- 服务集合：S1
- 搜索标签：pod = frontend-97cc49c74-qs6wh，close_type = 建连-客户端 ACK 缺失，close_type = 建连-服务端 SYN 缺失，close_type = 建连-客户端端口复用，close_type = 建连-服务端直接重置，close_type = 建连-服务端其他重置
- 路径：服务内、服务外、广域网
- 方向：双方向

![04-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645b087b6e86.png)
