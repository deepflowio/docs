---
title: 检查并首次观测
permalink: /ee-install/saas/check
---

# 简介

本章节将向您介绍在完成 DeepFlow Agent 部署之后，如何检查运行情况，以及如何开启第一次观测。

# 检查

## 检查采集器运行状态

在 DeepFlow 的 Web 页面中检查采集器的列表，以确认 DeepFlow Agent 处于运行状态。

访问入口：`系统`-`采集器`-`列表`，操作步骤参考下图：

![检查采集器运行状态](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202407036685209d99561.png)

经过检查，确认采集器处于运行状态，且无异常提示信息即可进入下一步。

## 检查应用观测数据

在 DeepFlow 的 Web 页面中检查应用调用日志，以确认 DeepFlow Agent 的数据采集功能开始运行。

访问入口：`追踪`-`调用日志`，操作步骤参考下图：

![检查应用观测数据](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202407036685209fb556f.png)

经过检查，确认采集器的应用调用日志已正常采集和呈现即可进入下一步。

# 开启首次观测之旅

如果您想了解您的云资源情况，可进入`资源`-`资源池`-`计算资源`/`网络资源`，[指导链接](/guide/ee-tenant/resources/computing-resources/)。

如果您想了解您的容器集群资源和应用情况，可进入`资源`-`资源池`-`容器资源`-`容器集群`/`命名空间`/`容器节点`/`Ingress`/`容器服务`/`工作负载`/`容器 POD`，[指导链接](/guide/ee-tenant/resources/container-resources/)。

如果您想观测某一个云服务器或容器服务的应用拓扑，可进入`追踪`-`拓扑分析`，[指导链接](/guide/ee-tenant/tracing/path-topology/)。

如果您想观测某一个云服务器或容器服务的应用性能，可进入`追踪`-`资源分析`，[指导链接](/guide/ee-tenant/tracing/service-list/)。

如果您想对某一次业务请求做调用链追踪，可进入`追踪`-`调用链追踪`，[指导链接](/guide/ee-tenant/tracing/call-chain-tracing/)。

如果您想持续剖析某一个应用进程的性能，可进入`剖析`-`持续剖析`，[指导链接](/guide/ee-tenant/profiling/continue-profile/)。

如果您想观测某一个云服务器或容器服务的网络流量拓扑，可进入`网络`-`拓扑分析`，[指导链接](/guide/ee-tenant/network/network-map/)。

如果您想观测某一个云服务器或容器服务的网络性能，可进入`网络`-`资源分析`，[指导链接](/guide/ee-tenant/network/service-statistics/)。

除此之外，还有更多的可观测性使用方法等待您的发掘……

