---
title: DeepFlow 授权功能
permalink: /about/v6-license
---

# 授权介绍

# 流量分发

支持将采集到的流量分发给外部 NPB 设备、NPM 工具、安全监控、数据库审计等消费方

## 分发策略

分发策略用于定义和管理流量的分发规则。用户可以根据采集点、流量方向和过滤条件，将采集到的网络流量灵活分发到指定的分发点，实现按需抓取与精确监控。

![分发策略](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027171931.png)
 
## 分发点

分发点是接收分发流量的隧道端点，可以是交换机上接收隧道的接口IP，也可以是具备解析隧道协议的分析工具所在的宿主机/云服务器的接口IP。

![分发点](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027171952.png)

# 网络监控

基于 cBPF 的零侵扰特性，全栈观测服务间网络通信的性能指标，支持追踪云网络、容器网络的转发路径以及云网关的 NAT 转发路径，并提供流日志、原始包头和原始网包的历史回溯能力

## 资源分析

资源分析以折线图和列表的形式展示的网络流的各网络位置上的网络流量相关信息。用户可快速获取网络流量情况以及各个网络节点的实时状态。

![网络观测-资源分析](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027170320.png)

## 路径分析

路径分析以折线图和表格的形式展示在数据链路中网络位置统计到的流量信息。利用 DeepFlow 自研流追踪的算法，可将网络流或应用调用在虚拟网络或物理网络经过的观测点都追踪出来。

![网络观测-路径分析](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027170355.png)

## 拓扑分析

拓扑分析页面通过拓扑的形式将网络流在虚拟或物理网络中的观测点关系展示出来。

![网络观测-拓扑分析](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027170504.png)

## 流日志

流日志是按分钟粒度记录每一条流的详细信息，通过趋势分析图及表格的形式展示流日志数据。通过在链路上的网络位置获取到的数据层层解析后进行 AutoTagging 自动打标签后对数据进行梳理后得到流日志。

![网络观测-流日志](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027170555.png)

## NAT 追踪

NAT 追踪可对任意 TCP 四元组或五元组发起追踪，利用 DeepFlow 自研算法自动追踪 NAT 前后流量。NAT 追踪页面通过表格的形式展示被点击数据的四元组所对应的指标量，点击追踪则可对四元组发起追踪。

![网络观测-NAT 追踪](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027170618.png)

点击行，则可以对所看到的流发起 NAT 追踪。

![网络观测-NAT 追踪-右滑框](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027170857.png)

## PCAP 策略

PCAP 策略支持设置网络数据包抓取时的策略或规则。策略支持设置抓包网络位置、采集器，设置过滤规则、Payload 截断等，即应该抓取哪些类型的数据包以及如何过滤不需要的数据包。

![网络观测-PCAP 策略](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027171251.png)

## PCAP 分析

PCAP 分析功能用于对采集到的网络流量进行深度解析与可视化展示。通过配置 PCAP 策略，用户可精准指定需要抓取的流量范围并生成 PCAP 文件。功能支持多种分析方式：既可通过搜索与过滤条件快速定位目标流量，查看详细的会话数据与关键字段；也可通过时序图还原通信过程，直观呈现请求与响应的交互关系；同时集成在线 Wireshark 功能，无需下载即可在页面中完成协议解码与报文内容解析，实现从流量采集到分析诊断的全流程可观测。

![网络观测-PCAP 分析-流日志](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027171449.png)

![网络观测-PCAP 分析-Wireshark 在线](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027171557.png)

![网络观测-PCAP 分析-时序图](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027171525.png)

## 其他

在应用观测模块中，当 信号源（signal_source） 设置为 Packet 且 应用协议（l7_protocol） 为 HTTP 或 DNS 时，对应的数据可在网络监控授权范围内进行可视化与分析。

# 调用监控

基于 eBPF、cBPF 与 Wasm 的零侵扰采集能力，实现全栈、全链路的应用调用观测。系统可持续监测应用间远程调用的性能指标与分布式调用链，覆盖各类编程语言实现的微服务体系，以及网关、缓存、消息队列、DNS 等中间件与资产观测服务。调用监控模块可直接查看来源于 应用观测（signal_source = Packet/eBPF） 的数据，实现对关键调用路径的性能分析与可视化展示。

## 调用链追踪

调用链追踪用于记录每一次调用的完整上下文与详细信息，支持对分布式调用过程的可视化分析。该功能仅适用于由 eBPF 采集的数据，或通过 OpenTelemetry 协议上报至 DeepFlow 的调用发起追踪数据。

![应用观测-调用链追踪列表](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027174030.png)

点击列表中的任意调用记录，可对该调用发起分布式追踪。追踪结果支持以调用链、火焰图和瀑布图等多种形式进行展示，便于从不同维度分析调用路径与性能瓶颈。

![应用观测-调用链追踪-调用链](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027174102.png)

![应用观测-调用链追踪-火焰图](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027174135.png)

![应用观测-调用链追踪-瀑布图](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027174201.png)

## 调用链拓扑

调用链拓扑功能基于分布式追踪数据构建服务间调用关系的可视化拓扑，通过对追踪链路的聚合分析，直观展示各服务节点的交互路径与依赖关系，帮助用户洞察系统整体调用结构及性能瓶颈。当前版本仅支持基于 trace_id 的链路构建。

![应用观测-调用链拓扑](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027174951.png)

## 资源分析

资源分析页面提供了一个集中方式，用以呈现 DeepFlow 监控的应用服务的概览。它包括了各个应用服务的名称、来源、黄金指标等信息。通过资源分析页面，用户可以快速地获取应用服务的整体状况，方便地定位到需要关注的应用服务，并进一步查看应用服务的详细信息以进行性能分析、故障排查和优化。这有助于提高服务监控的效率和准确性。

![应用观测-资源分析](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027175027.png)

## 路径分析

路径分析页面在资源分析页面的基础上，展示了请求应用的客户端与服务端，能从更多维度更灵活的来分析应用性能指标，可以了解服务请求速率、响应时间和异常比例等指标信息，有助于定位系统瓶颈和优化系统性能。

![应用观测-路径分析](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027175108.png)

## 拓扑分析

拓扑分析页面通过拓扑的形式展示服务或资源间的依赖关系，结合指标量的阈值可快速发现系统中的瓶颈和问题，并及时采取行动进行响应和处理。此外，通过不断监控和更新拓扑分析路径，还可以持续优化系统架构和性能。

![应用观测-拓扑分析](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027175139.png)

## 调用日志

调用日志用于记录每一次调用的完整明细信息，包含调用时间、参与方、请求参数及响应结果等关键数据。

![应用观测-调用日志列表](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027175214.png)

![应用观测-调用日志详情](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027175248.png)

## 文件读写

文件读写页面，可以记录文件的读取、写入操作。用户可以查看文件读写的时间、读写者、文件路径等关键信息，以便及时发现和处理异常行为。

![应用观测-文件读写列表](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027175348.png)

点击任意行，可查看文件读写详情。

![应用观测-文件读写详情](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027175322.png)
        
# 数据库监控

基于 eBPF、cBPF、Wasm 的零侵扰采集能力，实现对数据库语句与事务的全栈、全链路观测。系统可在数据库中间件、数据库实例及分布式数据库组件层面，采集并关联性能指标与分布式调用链，全面洞察数据库访问性能与依赖关系。具有`数据库监控`授权的用户，可查看来源于应用观测（signal_source = Packet/eBPF）的数据，具体功能可参考`调用监控`。与`调用监控`相比，数据库观测进一步提供数据库相关的调用细节与性能分析，例如下图所示：

![应用观测-调用日志列表](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027180025.png)

![应用观测-调用链追踪-火焰图](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027180150.png)

# 函数监控

基于 eBPF 的零侵扰采集能力，系统可实现对应用内部函数执行的全栈资源消耗观测，帮助快速定位性能瓶颈代码。同时支持集成 Java、Golang 等语言的传统插桩剖析数据，兼容多语言运行环境。通过 eBPF 获取应用程序的函数调用栈快照，DeepFlow 能够绘制任意进程的 Profiling 火焰图，直观展示函数级性能分布，助力开发者精准定位性能热点。函数调用栈不仅包含业务函数，还可呈现动态链接库、语言运行时及内核函数的耗时情况。此外，DeepFlow 在采集函数调用栈时会生成唯一标识，可与 调用日志 数据关联，实现分布式追踪与函数级性能剖析的联动分析。

获取指定主机的 Profile，选择对应的主机名称，在 `app_service` 中选择 `Total`。

![代码观测-持续剖析-Total](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027180745.png)

获取指定进程的 Profile，在 `app_service` 中选择需要查看的进程名。

![代码观测-持续剖析-进程](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251027181039.png)

# 应用监控

支持集成 OpenTelemetry、SkyWalking 等符合 OTLP 协议的分布式追踪数据，实现对应用调用过程的统一观测与分析。具有`应用监控`授权的用户，可查看来源于应用观测（signal_source = OTel） 的数据，具体功能可参考`调用监控`。相较于`调用监控`，`应用监控`进一步提供更丰富的应用层追踪信息及性能分析数据，例如下图所示：

![应用观测-调用日志列表](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251028105102.png)

![应用观测-调用链追踪-火焰图](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251028105149.png)

# 指标监控

集成 Prometheus、InfluxDB 等协议的指标数据，可在`指标中心`查看`数据库 = prometheus/ext_metrics`的数据，也可在视图中构建对应的指标视图

## 指标中心

DeepFlow 通过对接 Prometheus、InfluxDB 等协议的数据，以列表的形式展示基础设施状态、CPU、内存等指标。同时，支持搜索查看指标数据信息，以及对指定数据表添加指标模版。

![指标中心-Prometheus 指标](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251028110656.png)

![指标中心-InfluxDB 指标](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251028110554.png)

## 自定义视图

自定义视图支持将 Prometheus、InfluxDB 等数据源的指标以多种图表形式可视化展示。用户可根据实际需求自由配置指标、维度与展示方式，构建符合业务场景的监控视图，实现灵活、直观的指标分析。

![自定义视图](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251028111627.png)

![自定义视图-编辑](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251028111709.png)

# 日志监控

日志监控用于展示系统及应用进程的运行信息。DeepFlow 通过集成 Vector 增强日志采集与处理能力，并依托 AutoTagging 技术实现日志与指标、追踪等多源数据的关联。系统同时强化了日志的存储与可视化展示能力，以满足企业级场景下对统一观测与高性能分析的需求。

## 日志中心

![日志中心-日志查看](http://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/png/d2b5ca33bd970f64a6301fa75ae2eb22_20251028112150.png)