---
title: 采集器
permalink: /guide/ee-tenant/system/agent/
---

# 采集器

DeepFlow 采集器是一种用于收集网络和应用性能数据的工具，支持解析 HTTP、Dubbo 等协议中多种规范的 TraceID、SpanID。

接下来对采集器模块进行介绍。

## 列表

采集器列表展示了采集器安装部署以及运行情况，同时支持对采集器进批量操作的能力。

![01-列表](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4a708edd.png)

- 首行操作按钮：
  - 启用：多选采集器，批量执行启用操作
  - 禁用：多选采集器，批量执行禁用操作
  - 注册：多选采集器，批量执行注册操作
  - 加入采集器组：多选采集器，批量执行加入采集器组操作
  - 导出 CSV：多选采集器，批量执行导出 CSV 操作
- 采集器列表
  - 名称：点击后跳转采集器详情页面查看采集器信息
    - 基本信息：展示目前采集器基本信息、采集器的环境配置、状态信息及采集器所处运行环境的信息
    - 配置信息：展示采集器对应的采集器组配置的详细信息
    - 监控数据：展示目前采集器详情页的所有监控图表
    - 运行日志：支持多区域部署场景下，查看非主区域采集器的运行日志。展示记录与 ES 中的采集器的所有日志，且 WARN 日志标黄、ERR 日志标红
  - 组：采集器所属的组，点击可跳转至【组】页面，未指定组的采集器属于默认组，请参考【组】章节描述
  - 类型：展示当前采集器的运行环境
    - KVM：采集器 Trident 进程运行于宿主机（如 KVM）上
    - 容器-V/容器-P：采集器 Trident 以 DaemonSet 的方式运行于每个容器节点（K8S Node）上
    - ESXi：采集器 Trident 进程运行于 vSphere ESXi 上的专用虚拟机中，采集 ESXi 上所有业务虚拟机的镜像流量
    - 专属服务器：采集器 Trident 进程运行于专属服务器上，采集物理交换机镜像流量
    - Workload-V：采集器 Trident 进程运行于业务虚拟机内部
    - Workload-P：采集器 Trident 进程运行于业务裸金属服务器内部
    - 隧道解封装：采集器 Rosen 进程运行于独立服务器上，用于解除分发流量的隧道封装
  - 体系架构：采集器运行环境的系统信息
  - 操作系统：采集器运行环境的系统信息
  - 控制 IP：采集器与控制器通信的 IP 地址
  - 控制 MAC：采集器与控制器通信的 MAC 地址
  - 状态：展示采集器目前状态，包括未注册/运行/失联/禁用
  - 异常：当采集器运行过程中存在异常时该列会显示红色感叹号，目前支持的异常信息包括
    - 自检失败：日志所在磁盘剩余空间不足 100MB
    - 自检失败：可用内存不足
    - 分发熔断触发
    - 分发流量达到限速
    - 到分发点的网关 ARP 无法找到
    - 到数据节点的网关 ARP 无法找到
  - 软件版本：显示 Trident/Agent 软件的版本号，用于故障排查和升级指示
  - 启动时间：表示的为采集器进程启动的时间
  - 控制器：表示采集器请求策略的从控制器 IP 地址（同时也是发送监控信息的目的数据节点 IP 地址），点击可跳转至【控制器列表】页面中，使用详情，请参考【控制器】章节描述
  - 控制器同步时间：展示的采集器最近一次与控制器同步云平台信息的时间
  - 数据节点：表示采集器发送数据的目标数据节点，点击可跳转至【数据节点】页面中，使用详情，请参考【数据节点】章节描述
  - 当前访问数据节点：当数据节点在 SLB 后未采集器提供服务时，此字段展示采集器正在请求的真实数据节点 IP
  - 数据节点通信时间：表示采集器与数据节点的最后通信时间，注意此项值的更新会存在一些 Cache 导致的滞后
  - 操作：启用/禁用、删除
    - 启用/禁用：对采集器启用或禁用
    - 删除：删除无用的采集器

## 组

通过列表的形式展示采集器组的信息，如包含采集器个数、禁用采集器个数、未注册采集器个数等信息。

![02-组](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4c187e7f.png)

- 以列表的形式展示了，采集器组中所包含的采集器个数、禁用采集器个数以及未注册采集个数，点击数量可进入采集页面进行查看
  - 支持新建采集组、注册、禁用、启用、删除等功能
- 采集器组：通过将相同类型的宿主机/云服务器归纳为一组，方便统一管理
  - 默认：如用户未给采集器自定义组，则都划分为默认组中
  - 默认组不可能修改和删除，采集器以最后加入的组为准
- 注：对于平台建立的采集器组，用户无注册采集器、编辑、禁用等操作权限

## 配置

通过列表的形式展示采集器组的详细信息，如 CPU 限制、内存限制、采集包限速、分发流限速、分发熔断阈值、采集网口等信息。

![03-配置](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4d1b64aa.png)

- 点击行：进一步展示当前采集器组的详细信息，如资源限制、基础配置参数、全景图配置参数、包分发配置参数、基础功能、全景图功能开关、包分发功能开关等

## 统计

以图表的形式展示的当前采集器相关状态数据，如采集总流量、分发总流量、采集器 CPU 用量、采集器内存用量、运行环境负载、丢包数、云服务器采集流量、云服务器分发流量等。

![04-统计](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4e252f7f.png)
