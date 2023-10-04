---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

# AutoProfiling

通过 eBPF 获取应用程序的函数调用栈快照，DeepFlow 可绘制任意进程的 CPU Profile，帮助开发者快速定位函数性能瓶颈。**函数调用栈中除了包含业务函数以外，还可展现动态链接库、内核系统调用函数的耗时情况**。除此之外，DeepFlow 在采集函数调用栈时生成了唯一标识，可用于与调用日志相关联，实现分布式追踪和函数性能剖析的联动。

![DeepFlow 中的 CPU Profile 和 Network Profile](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac3060c3.png)

# 当前限制

eBPF Profile 数据目前无法在 Grafana 上展现，仅可在企业版页面中查看。
