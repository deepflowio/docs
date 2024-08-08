---
title: 业务故障诊断定位通用方法
permalink: /best-practice/trouble-shooting-flow/
---

# 总体概述

## 统一的观测数据湖

DeepFlow 可观测性平台通过 eBPF 采集以及开放的数据接口汇聚 metrics、tracing、logging、profiling、events 等各种各样的海量观测数据。

同时通过 AutoTagging 标签注入技术，DeepFlow 能够将所有的观测数据注入丰富的文本标签，这些富含文本语义的信息标签包括了资源标签、业务标签等，比如应用实例的云资源信息、容器资源信息，CI/CD 流水线中标记的开发者、维护者、版本号、commit_id、仓库地址等等。通过标签信息的注入，在故障诊断过程中便可以用文本字段一次检索出与某笔业务或某个应用相关的所有 metrics、tracing、logging、profiling、events 数据，并呈现在一个工作台上，经过工程师 3-5 步的数据分析得到故障诊断结论。

![统一的观测数据湖](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3281c6db18.jpeg)

## 多团队统一协作

在常见的 IT 业务系统运维中，业务部署跨多个可用区，架构复杂，组件众多，运维保障和故障诊断涉及应用、PaaS 平台、IaaS 云等不同团队间的大量沟通协作。DeepFlow 可观测性平台通过打通数据孤岛，构建数据关联，提供了面向应用、PaaS、IaaS、网络等各个运维团队的统一观测、统一协作的运维能力。

![多团队统一协作](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4b0683ed7b.jpeg)


## 从宏观到微观，从一维到多维

![从应用出发的故障诊断流程](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4b0696e08d.jpeg)

在 DeepFlow 可观测性平台中，一般通过应用 RED 指标观测、调用日志检索、调用链追踪、多维度应用诊断、多维度系统诊断、多维度网络诊断，从宏观到微观，从一个维度的数据观测到多个维度的数据分析，逐步回答如下 5 个问题，有序诊断出问题根因：
- **Who is in trouble?**
- **When it's in trouble?**
- **Which request is in trouble?**
- **Where is the root position?**
- **What is the root cause?**

# 宏观——指标分析，发现并预警

## 应用 RED 指标观测

在 IT 系统的运维中，通常使用 **RED** 指标（Rate、Error、Duration）作为核心监测指标评估系统的业务质量/应用服务质量：
- **Rate** (请求速率)——表征单位时间内接收的请求数量，用于衡量服务的吞吐量/压力。
- **Error** (异常比例)——表征所有请求中返回错误响应的比例，用于发现服务的异常，通常分为客户端原因导致的 Error 和 服务端原因导致的 Error，而服务端原因导致的 Error 通常是应用的关注重点。
- **Duration** (响应时延)——表征从请求到响应消耗的时间，用于发现服务响应慢的情况；通常使用“响应时延均值”、“响应时延P95”、“响应时延P99”等观测响应时延的统计结果。

在 DeepFlow 平台中，同样使用面向应用调用的 RED 指标作为观测运维、故障诊断的入口，通常通过命名空间（pod_ns）、容器服务（pod_servce）、工作负载（pod_group)、应用调用协议（l7_protocol）等不同维度的条件组合过滤，观测您所关注的对象的 RED 指标。

- Step1：如果您是某一个应用系统的运维人员，而应用模块部署并隔离在 K8s 的名字为“A”的命名空间（k8s namespace） 中，那么可以使用`pod_ns = A`来观测该业务系统所有应用服务的 RED 指标。
- Step2：如果你想在此基础之上仅观测“A”命名空间中名字为“b”的容器服务，则仅需再增加一个 `pod_svc = b` 的过滤条件。
- Step3：如果您想仅观测 http 协议调用的 RED 指标，则仅需增加一个 `l7_protocol = http` 的过滤条件。

至此，您基本可以使用 DeepFlow 平台开始可观测性之旅。

![DeepFlow 的应用 RED 指标观测](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32824d0259.jpeg)

当然，DeepFlow 还提供了更多的过滤条件在不同场景下灵活使用，您可以在未来的使用中不断探索。

通过观测应用服务的 RED 指标可以回答 **Who** 和 **When** 的问题，即：
- **Who is in trouble?**——哪一个观测对象（比如 IT 系统中的某个容器服务、某个工作负载、某个 Pod、某一条路径等）的服务质量出现异常（出现响应错误、响应慢或超时），需要我们关注。
- **When it's in trouble?**——哪一个时间点出现了异常？

下一步便可以在异常时间点快速检索异常对象的每一次异常应用调用，开始对每一次异常应用调用的微观观测。

# 微观——调用追踪，定界定位

## 调用日志检索

DeepFlow 平台为每一个观测对象提供了隐藏的“右滑窗”，在指标曲线、指标统计列表等位置点击任意观测对象即可自动展开“右滑窗”。在“右滑窗”中提供了包括“应用指标”、“端点列表”、“调用日志”、“网络指标”等一系列的数据观测窗口，用于分析观测对象不同维度的数据。

“右滑窗”中的“调用日志”中可以回答 **Which** 的问题（**Which request is in trouble?**）——即哪一条应用调用出现异常？

调阅异常时间点的全部调用日志，并过滤其中的异常应用调用（响应错误、响应慢或超时）：

![DeepFlow 的调用日志检索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3282b398ec.jpeg)

## 调用链追踪

找到的单次异常请求之后，即可在 DeepFlow 平台中对单次异常请求进行调用链的追踪，回答 **Where** 的问题（**Where is the root postion of the trouble?**）——即通过调用链追踪火焰图找到响应错误、响应慢、响应超时的根因 Span。

![DeepFlow 的调用链追踪示意图](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3282d820d0.jpeg)

背景阅读：
- [3 分钟理解 DeepFlow 调用链追踪火焰图](https://www.bilibili.com/video/BV1di421k7JE/)
- [3 分钟理解 DeepFlow 调用链追踪实现原理](https://www.bilibili.com/video/BV1ZC411E7ad/)

## 常见的调用链追踪火焰图示例及分析

我们通过一个简化的应用服务模型来了解如何通过 DeepFlow 调用链追踪火焰图快速找到 **Root Position**。
在这个场景中，Client 使用`http get`访问前端服务，前端服务查询 DNS 服务后访问 MySQL 数据库，再进行一次 RPC 调用，最后向 Client 返回`http response`。
![（简化）应用服务模型](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328390aa62.png)

### 应用类问题

- 应用服务—— IO 线程慢

如果前端服务的「POD 网卡 Span」与 前端服务的「系统 Span」之间的时延出现了明显的差值，便可确定`http get`在从 POD 网卡队列进入前端服务的处理队列时出现了卡顿。
常见的 IO 线程调度繁忙便可能引发这种状况。

![火焰图样例 1（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284a1f3bb.png)

- 应用服务—— Work 线程慢

如果前端服务接收`http get`的「系统 Span」与发送`dns query`的「系统 Span」之间的时延出现了明显的差值，便可确定前端服务在内部处理时出现了卡顿。
常见的 Work 线程调度繁忙便可能引发这种状况的出现。

![火焰图样例 2（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284d7fe39.png)

- 中间件——DNS 服务响应慢

如果 DNS 服务的「系统 Span」出现明显的时间长度，便可确定 DNS 服务进程在查询并返回 DNS 解析结果时消耗了过多的时间，并直接导致此次业务请求的慢响应。

![火焰图样例 3（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328508566e.png)

- 中间件——MySQL 服务响应慢

与 DNS 服务类似，如果 MySQL 服务的「系统 Span」出现明显的时间长度，便可确定 MySQL 服务进程在处理并返回结果时消耗了过多的时间，并直接导致此次业务请求的慢响应。

![火焰图样例 4（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3285438f40.png)

- 其他应用服务——RPC 服务响应慢

与 DNS 服务类似，如果 RPC 服务的「系统 Span」出现明显的时间长度，便可确定 RPC 服务进程在处理并返回结果时消耗了过多的时间，并直接导致此次业务请求的慢响应。

![火焰图样例 5（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328575653a.png)

- 客户端——进程处理慢

如果前端服务向 Client 端返回的`http response`在到达 Client 端的「POD 网卡 Span」之后，等待一段时间才到达「系统 Span」，便可确定`http response`在从 POD 网卡队列进入 Client 进程的处理队列时出现了卡顿。

![火焰图样例 6（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3285982a40.png)

### 网络类问题

- 网络传输——TCP 建连慢

如果 Client 端的「系统 Span」与「POD 网卡 Span」之间的时延出现了明显的差值，便可以确定`http get`在进入网络之前即出现了卡顿。

这种情况一般出现在 Client 端采用 TCP 短连接的情况下，发送`http get`之前需要首先建立 TCP 连接，TCP 建连的三次握手过程中出现丢包、卡顿均可能引发这种状况。

![火焰图样例 7（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3283e248cf.png)

- 网络传输——客户端容器节点内传输慢
  
如果`http get`在 Client 端的「POD 网卡 Span」与「Node 网卡 Span」之间的时延出现了明显的差值，便可确定`http get`在客户端的容器节点内的虚拟网络中传输交换出现了卡顿。

![火焰图样例 8（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284069e45.png)

- 网络传输——容器节点间传输慢

如果 Client 端的「Node 网卡 Span」与前端服务的「Node 网卡 Span」之间的时延出现了明显的差值，便可确定`http get`在两个容器节点之间的网络中传输交换出现了卡顿。

![火焰图样例 9（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3284283c8e.png)

- 网络传输——服务端容器节点内传输慢

如果前端服务的「Node 网卡 Span」与 前端服务的「POD 网卡 Span」之间的时延出现了明显的差值，便可确定`http get`在服务端容器节点内的虚拟网络中传输交换出现了卡顿。

![火焰图样例 10（示意图）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328473bf8b.png)

# 多维度分析——根因诊断

DeepFlow 平台的应用调用链追踪帮助我们回答了“**Where is the root position?**” 的问题之后，下一步便是围绕 **Root Position** 展开多维度的数据分析，继续回答“**What**”的问题（**What is the root cause？**）。
- 当通过调用链追踪做定界定位，确定问题边界是某一个应用进程后，即可进入“应用诊断”环节，对应用实例进行多个维度数据的分析诊断，确定应用故障的根因。
- 当通过调用链追踪做定界定位，确定问题边界是网络传输的原因后，即可进入“网络诊断”环节，对网络传输进行多个维度数据的分析诊断，确定网络故障的根因。
- 当确定问题与系统性能相关时（比如系统 CPU 用量、系统 Load、系统接口），还可进入“系统诊断”环节，对操作系统进行多个维度数据的分析诊断，确定操作系统故障的根因。

## 应用诊断

如果 **Root Postion** 是某个应用实例，便可以在 DeepFlow 平台中对应用实例进行资源指标（CPU、内存、磁盘等）分析、OnCPU 持续剖析、OffCPU 持续剖析、Memory 剖析、应用指标分析、应用日志检索等不同维度的数据诊断，找到应用内的 **Root Cause**。

### 应用实例资源指标分析

在 DeepFlow 平台可以集成并统一观测分析容器 Pod/Container 的计算资源指标，通过异常时间点的指标快速确定容器资源是否为 Root Cause。

- Pod 状态列表观测

![POD 状态观测样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32862b4f18.jpeg)

- Container 指标详情观测

![Container 指标观测样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328672066c.png)

### OnCPU 持续剖析

在 DeepFlow 平台可以对应用的 OnCPU 进行持续剖析，发现应用进程中的 CPU 热点函数。

![OnCPU 持续剖析样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3286e73055.png)

### OffCPU 持续剖析

在 DeepFlow 平台可以对应用的 OffCPU 进行持续剖析，发现应用内因 IO 等待、锁等原因导致的受阻塞函数。

![OffCPU 持续剖析样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3288a5dc39.png)

### Memory 剖析

在 DeepFlow 平台可以对应用的 Memory 进行剖析，发现应用进程的 Memory 热点函数。

### 应用指标分析

在 DeepFlow 平台可以集成并统一分析应用主动暴露的 metrics，进而通过应用指标发现程序内的 Root Cause。

### 应用日志分析

在 DeepFlow 平台可以集成并统一分析应用主动的打印日志，进而通过应用打印日志发现程序内的 Root Cause。

## 系统诊断

### 文件 IO 事件分析

当调用链追踪中确定某个「系统 Span」 是 Root Postion 后，随即一键调阅该 Span 伴随发生的文件慢 IO 列表，确定文件 IO 性能是否为 Root Cause。

![文件 IO 事件分析样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3287b2741a.png)

### K8s 资源变更事件分析

分析 Root Position 在异常时间点的 K8s 资源变更事件列表，确定容器创建、销毁过程是否为 Root Cause。

![K8s 资源变更事件分析样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3287e6aa0e.jpeg)


### 系统指标分析

在 DeepFlow 平台可以集成并统一观测分析云服务器、容器 Node 的系统指标，通过异常时间点的系统指标快速确定系统资源是否为 Root Cause。

- 主机指标列表观测

![主机指标列表样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b32896e4f7a.png)

### 系统日志分析

在 DeepFlow 平台可以集成并统一分析系统输出的日志，进而通过系统日志发现系统内的 Root Cause。

## 网络诊断

### 网络指标分析

当调用链追踪中确定某个「网络 Span」 是 Root Postion 后，随即一键调阅该次应用调用关联的“网络性能”， 进而确定 TCP 会话在三次握手、TLS 建连、数据交互、系统响应等不同过程的时延，确定网络传输慢的关键原因：
- TCP 建连时延——TCP 三次握手过程的时延；
- TLS 建连时延——TLS 建连过程的时延；
- 平均数据时延——请求 Data 到响应 Data的时延（多次过程的平均值）
- 平均系统时延——请求 Data 到回复 ACK 消息的时延（多次过程的平均值）
- 平均客户端等待时延——客户端从上一次 ACK 消息或响应 Data 到下一次请求之间等待的时延（多次过程的平均值）

![调用链追踪中的网络指标分析样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328833d96a.png)

### 流日志分析

当调阅该次应用调用所关联的“网络性能”不能完全确定 Root Cause， 还可以进一步“查看流日志”，调阅 TCP 会话的详细数据，确定是否存在重传、零窗、TCP RST 等情况发生。

![流日志的关键信息](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328a51deb5.jpeg)

### TCP 时序分析

当通过流日志无法完全确定 Root Cause 时，还可以查看流日志对应的“TCP 时序图”，查阅 TCP 会话中各个数据包交互过程，从中发现数据包的交互顺序异常、数据包之间的时间差异常等信息，从而找出 Root Cause。

![TCP 时序图样例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b3289a9c9aa.png)

- TCP 时序图 Root Cause 分析经验案例

故障现象：服务端向客户端回复响应数据包后的 15 秒内未收到任何新的业务请求，因此触发计时器超时并关闭 TCP 连接，但 53ns 后收到客户端发送的新一轮的业务请求数据包，由于 TCP 连接在本端已关闭所以无法处理，只能再次发送 RST 消息通知客户端侧停止发送业务请求。
故障影响：最后一次应用请求无响应。
解决办法：调大服务端的 TCP 连接超时时长（大于客户端侧），每次业务处理完毕后均由客户端主动关闭 TCP 连接。

![TCP 时序图故障分析案例](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080766b328a3b7ad0.jpeg)

### 网络设备指标分析

在 DeepFlow 平台还可以通过 Telegraf 集成网络设备的运行指标。当通过调用链追踪确定 Root Postion 在物理网络中时，可以对网络设备指标统一观测分析，进而找到网络设备中的 Root Cause。
