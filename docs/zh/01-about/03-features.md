---
title: DeepFlow 关键特性
permalink: /about/features
---

# 三大核心功能

通过利用 eBPF 采集应用函数、系统调用函数、网卡收发的数据，DeepFlow 首先聚合成 TCP/UDP 流日志（Flow Log），经过应用协议识别后聚合得到应用调用日志（Request Log），进而计算出全栈的 RED（Request/Error/Delay）性能指标，并关联生成分布式追踪火焰图。除此之外，DeepFlow 在流日志聚合过程中还计算了 TCP 吞吐、时延、建连异常、重传、零窗等网络层性能指标，以及通过 Hook 文件读写操作计算了 IO 吞吐和时延指标，并将所有这些指标关联至每个调用日志上。另外，DeepFlow 也支持通过 eBPF 获取每个进程的 OnCPU、OffCPU 函数火焰图，以及分析 TCP 包绘制 Network Profile 时序图。所有这些能力最终体现为三大核心功能：
- Universal Map for Any Service，任意服务的全景图
- Distributed Tracing for Any Request，任意调用的分布式追踪
- Continuous Profiling for Any Function，任何函数的持续性能剖析

![DeepFlow 基于 eBPF 的三大核心功能](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9abb97855.png)

## 服务全景图

**全景图直接体现出了 eBPF 零侵扰的优势，对比 APM 有限的覆盖能力，所有的服务都能出现在全景图中**。但 eBPF 获取的调用日志不能直接用于拓扑展现，DeepFlow 为所有的数据注入了丰富的标签，包括云资源属性、K8s 资源属性、自定义 K8s 标签等。通过这些标签可以快速过滤出指定业务的全景图，并且可以按不同标签分组展示，例如 K8s Pod、K8s Deployment、K8s Service、自定义标签等。**全景图不仅描述了服务之间的调用关系，还展现了调用路径上的全栈性能指标**，例如下图右侧为两个 K8s 服务的进程在相互访问时的逐跳时延变化。我们可以很快的发现性能瓶颈到底位于业务进程、容器网络、K8s 网络、KVM 网络还是 Underlay 网络。充足的中立观测数据是快速定界的必要条件。

![DeepFlow 的全景图对比 APM Agent 获取的拓扑图](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023110465463725dd5ff.png)

目前，DeepFlow 已经内置支持解析主流应用协议，包括 HTTP 1/2、HTTPS（Golang/openssl）、Dubbo、gRPC、SOFARPC、FastCGI、MySQL、PostgreSQL、Redis、MongoDB、Kafka、MQTT、DNS，未来还将扩展更多应用协议的支持。

## 分布式追踪

零侵扰的分布式追踪（**AutoTracing**）是 DeepFlow 中的一个重大创新，在通过 eBPF 和 cBPF 采集调用日志时，DeepFlow 基于系统调用上下文计算出了 syscall\_trace\_id、thread\_id、goroutine\_id、cap\_seq、tcp\_seq 等信息，**无需修改应用代码、无需注入 TraceID、SpanID 即可实现分布式追踪**。目前 DeepFlow 除了跨线程（通过内存 Queue 或 Channel 传递信息）和异步调用以外，都能实现零侵扰的分布式追踪。此外也支持解析应用注入的唯一 Request ID（例如几乎所有网关都会注入 X-Request-ID）来解决跨线程和异步的问题。下图对比了 DeepFlow 和 APM 的分布式追踪能力。APM 仅能对插桩的服务实现追踪，常见的是利用 Java Agent 覆盖 Java 服务。DeepFlow 使用 eBPF 实现了所有服务的追踪，包括 Nginx 等 SLB、Spring Cloud Gateway 等微服务网关、Envoy 等 Service Mesh 边车，以及 MySQL、Redis、CoreDNS 等基础服务（包括它们读写文件的耗时），除此之外还覆盖了 Pod NIC、Node NIC、KVM NIC、物理交换机等网络传输路径，更重要的是对 Java、Golang 以及所有语言都可无差别支持。

![DeepFlow 和 APM 的分布式追踪对比](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091164febd459455b.png)

注意 eBPF 和 APM 的分布式追踪能力并不是矛盾的。APM 能用于追踪应用进程内部的函数调用路径，也擅长于解决跨线程和异步场景。而 eBPF 有全局的覆盖能力，能轻松覆盖网关、基础服务、网络路径、多语言服务。在 DeepFlow 中，我们支持调用 APM 的 Trace API 以展示 APM + eBPF 的全链路分布式追踪图，同时也对外提供了 `Trace Completion API` 使得 APM 可调用 DeepFlow 以获取并关联 eBPF 的追踪数据。另外 DeepFlow 与 APM 之间也可利用 OTLP 协议将自身的追踪数据导出给对方。

![DeepFlow 与 APM 集成](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

## 持续性能剖析

通过获取应用程序的函数调用栈快照，DeepFlow 可绘制任意进程的 CPU Profile，帮助开发者快速定位函数性能瓶颈。**函数调用栈中除了包含业务函数以外，还可展现动态链接库、内核系统调用函数的耗时情况**。除此之外，DeepFlow 在采集函数调用栈时生成了唯一标识，可用于与调用日志相关联，实现分布式追踪和函数性能剖析的联动。特别地，DeepFlow 还利用 cBPF 对网络中的逐包进行了分析，使得在低内核环境中可以绘制每个 TCP 流的 Network Profile，剖析其中的建连时延、系统（ACK）时延、服务响应时延、客户端等待时延，可用于推断应用程序中性能瓶颈的代码范围。

![DeepFlow 中的 CPU Profile 和 Network Profile](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac3060c3.png)

# 注入业务语义

使用 APM Agent 的另一个诉求是向数据中注入业务语义，例如**一个调用关联的用户信息、交易信息，以及服务所在的业务模块名称等**。从 eBPF 采集到的原始字节流中很难用通用的方法提取业务语义，在 DeepFlow 中我们实现了两个插件机制来弥补这个不足：通过 Wasm Plugin 注入调用粒度的业务语义，通过 API 注入服务粒度的业务语义。

**第一、通过 Wasm Plugin 注入调用粒度的业务语义**：DeepFlow Agent 内置了常见应用协议的解析能力，且在持续迭代增加中，下图中蓝色部分均为原生支持的协议。我们发现实际业务环境中情况会更加复杂：开发会坚持返回 HTTP 200 同时将错误信息放到自定义 JSON 结构中，大量 RPC 的 Payload 部分使用 Protobuf、Thrift 等依赖 Schema 进行解码的序列化方式，调用的处理流程中发生了跨线程导致 eBPF AutoTracing 断链。为了解决这些问题 DeepFlow 提供了 Wasm Plugin 机制，支持开发者对 Pipeline 中的 ProtocolParser 进行增强。

![利用 DeepFlow Wasm Plugin 注入调用粒度的业务语义](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac4b08f7.png)

实际上，我们也观察到在金融、电信、游戏等行业中，已经存在了「天然」的分布式追踪标记，例如金融业务中的全局交易流水号，电信核心网中的呼叫 ID、游戏业务中的业务请求 ID 等等。这些 ID 会携带在所有调用中，但具体的位置是业务自身决定的。通过 Wasm Plugin 释放的灵活性，开发者可以很容易的编写插件支持将这些信息提取为 TraceID。

**第二、通过 API 注入服务粒度的业务语义**：默认情况下，DeepFlow 的 SmartEncoding 机制会自动为所有观测信号注入云资源、容器 K8s 资源、K8s 自定义 Label/Annotation 标签。然而这些标签体现的只是应用层面的语义，为了帮助用户将 CMDB 等系统中的业务语义注入到观测数据中，DeepFlow 提供了一套用于业务标签注入的 API。

# 生态与性能

DeepFlow 完全拥抱开源社区，除了能够利用 eBPF 技术零侵扰采集观测数据以外，DeepFlow 还支持集成主流的可观测性技术栈，例如支持作为 Prometheus、OpenTelemetry、SkyWalking、Pyroscope 等技术栈的存储后端，并提供 SQL、PromQL、OTLP Export 接口作为 Grafana、Prometheus、OpenTelemetry、SkyWalking 的数据源，使得开发者可以快速将其融入到自己的可观测性解决方案中。

![DeepFlow 与主流可观测性技术栈的集成](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b163cac67.png)

当作为存储后端时，DeepFlow 并不只是简单的存储数据，利用独有的 AutoTagging 和 SmartEncoding 机制，高性能、自动化的为所有观测信号注入统一的属性标签，消除数据孤岛，并增强数据的下钻切分能力。

对高性能的追求体现在多个方面。自 2016 年开始，最早 DeepFlow 企业版使用 Golang 实现 Agent，从 2021 年开始我们决定将 Agent 使用 Rust 重构。这一决定使得我们在处理海量 eBPF/BPF 数据时能够消耗更低的资源，通常相当于应用自身的 1%~5%。Rust 有着极致的内存安全性和逼近 C 的性能，特别是在内存消耗、GC 等方面相比 Golang 有显著的优势，这些优势也使得 Agent 同样适合运行于终端设备的 Android 操作系统内。

与之对比的是，DeepFlow Server 依然使用 Golang 实现，使得我们能获得更高的迭代速度。得益于我们在 Golang 版本 Agent 的深厚积累，我们重写的高性能 map、高性能 pool 均达到了十倍性能的提升，能够显著降低 Server 的资源消耗。一个每秒写入 1M Span 的生产环境中 Server 消耗的资源一般为业务自身消耗的 1%。

![DeepFlow 中的 SmartEncoding](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b164952a5.png)

与观测数据直接相关的性能优化体现在 SmartEncoding 机制上。Agent 通过信息同步获取到字符串格式的标签，汇总到 Server 上。Server 通过对所有的标签进行编码，为所有的数据统一注入 Int 类型的标签并存储到数据库中，与此同时 Grafana 可以直接以字符串格式的标签进行过滤和分组查询。这一编码机制可将标签写入的性能提升 10 倍，极大的降低了数据存储的资源开销。除此之外，Server 还会将 K8s 标签以元数据的方式与观测数据分离存储，无需在每一行观测数据中都存储所有的标签，进一步将资源消耗降低一半。最后，这样的编码机制也能减少数据查询时的磁盘扫描量，提升搜索性能。
