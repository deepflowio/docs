---
title: AutoTracing
permalink: /features/distributed-tracing/auto-tracing
---

# AutoTracing

以往我们一般通过 SDK、字节码增强或手动埋点方式主动插入追踪代码，这给应用开发者带来了沉重的负担，他们需要适配各种开发语言和 RPC 框架。当业务使用非 Java 语言实现时，即使 Tracer 可以通过 SDK 进行封装以降低侵入性，也还会存在 SDK 更新导致应用需要重新发布的问题。另一方面，在云原生环境下手动插码的方式迎来了更多的挑战，任何一个应用调用需要穿越从微服务、Sidecar、iptables/ipvs 容器网络、虚拟机 vsiwtch、云网络、NFV网关等复杂的路径，可观测性建设应该能覆盖云原生环境下从应用到基础设施的全栈，但这并不能通过向业务代码中插入追踪代码来实现。

基于 eBPF，DeepFlow 创新的实现了零侵扰的分布式追踪。DeepFlow 将 eBPF Event、BPF Packet、Thread ID、Coroutine ID、Request 到达时序、TCP 发送时序进行关联，实现了高度自动化的分布式追踪（**AutoTracing**）。目前 AutoTracing 支持**所有同线程调用**场景和**部分跨线程调用**（通过解析协议头和 MySQL Comment 中的 X-Request-ID、TraceID/SpanID）场景，支持**所有内核线程调度**（[Kernel Threads](https://en.wikipedia.org/wiki/Thread_(computing))）场景和**部分用户态线程调度**（User Threads，例如 Golang Goroutine）场景，在这些场景下支持对任意服务的分布式调用链进行追踪。

本章将会以两个 Demo 应用为例，展示 DeepFlow 的 AutoTracing 能力。这两个 Demo 不依赖插入任何 Jaeger、OpenTelemetry、SkyWalking 等代码，完全基于 eBPF 采集的数据即可完成分布式追踪。

# X-Request-ID

几乎所有网关都支持向 HTTP Header 中注入一个随机的唯一 ID，用于跟踪一个调用。这个行为的原理是：客户端请求网关时，网关生成一个随机 ID（一般名为 X-Request-ID），并将其注入到网关向 Upstream 发送的 HTTP Header 中，在收到 Upstream 的响应之后，网关会将同样的随机 ID 注入到向客户端发送的响应中。从原理中可以看到，这个信息的注入不需要业务侧做任何的修改，DeepFlow 也能利用这个信息实现网关前后调用链的零侵扰追踪。

几乎所有的网关都支持此类随机 ID 的自动注入，例如：
- [Envoy: X-Request-ID](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers#x-request-id)
- [Nginx: X-Request-ID](https://www.nginx.com/blog/application-tracing-nginx-plus/)
- [HAProxy: X-Request-ID](https://stackoverflow.com/questions/46531909/setting-a-unique-http-request-id-with-haproxys-http-request-set-header)
- [BFE: X-Bfe-Log-Id](https://www.bfe-networks.net/en_us/modules/mod_logid/mod_logid/)
- [腾讯云 CLB: Stgw-request-id](https://cloud.tencent.com/document/product/214/15171)
- [百度云 BLB: X-BLB-Request-Id](https://cloud.baidu.com/doc/BLB/s/gkk3kb8ic)

由于不同网关注入的随机 ID 名称不同，DeepFlow 支持通过 Agent 配置中的 `http_log_x_request_id` 来指定需要解析的字段名，该配置的默认值为 `X-Request-ID`，且支持填写多个字段名。

另外，实际上消息队列中也不乏类似的信息存在，例如：
- [Kafka 在 Request-Response 通信场景下的 CorrelationID](https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-CommonRequestandResponseStructure)
- [ActiveMQ 中的 CorrelationID](https://activemq.apache.org/how-should-i-implement-request-response-with-jms)

# 当前限制

基于 eBPF 的 AutoTracing 是一项颠覆性创新，欢迎你一起加入这项激动人心的探索！当前 TODO 的工作包括：
- 跨线程处理请求
  - [ ] 接收请求、向下游发送请求位于不同的线程，此时一般使用了内存消息队列（如 Golang Channel 等）
  - [x] 接收请求、响应请求位于不同的线程
  - [x] HAProxy/Envoy 等网关跨线程处理请求
- 协程调度场景
  - [ ] Erlang 等协程或轻量级线程应用
  - [x] Golang Goroutine
- 利用消息队列
  - [ ] 服务 A 生产消息，经过消息队列（如 Kafka/Redis）后由服务 B 消费消息

而实际上，在现实业务场景中上述限制并不难解决，例如：
- 在金融应用中，一般都在请求中注入了`交易流水号`，通过 DeepFlow Wasm Plugin 可提取该字段并作为 TraceID
- 如果整个 RPC 框架是统一的，可在 RPC Header 中注入用于追踪的随机 ID（远比插桩式分布式追踪轻量的工作）
- 业务上可能已经局部使用了插桩式的分布式追踪，DeepFlow 也可提取请求中的 TraceID，解决一部分跨线程的问题

另外，这些看起来是`妥协`的解决方案在实战中非常管用，甚至能避开 eBPF 对内核 4.14+ 的要求，纯粹依靠 cBPF 的能力即可实现分布式追踪。

# 全栈分布式追踪

eBPF 和 APM 的分布式追踪能力并不是矛盾的。APM 能用于追踪应用进程内部的函数调用路径，也擅长于解决跨线程和异步场景。而 eBPF 有全局的覆盖能力，能轻松覆盖网关、基础服务、网络路径、多语言服务。在 DeepFlow 中，我们支持调用 APM 的 Trace API 以展示 APM + eBPF 的全链路分布式追踪图，同时也对外提供了 `Trace Completion API` 使得 APM 可调用 DeepFlow 以获取并关联 eBPF 的追踪数据。另外 DeepFlow 与 APM 之间也可利用 OTLP 协议将自身的追踪数据导出给对方。

![DeepFlow 与 APM 集成](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

DeepFlow 与 APM 结合的具体方法可参考[全栈分布式追踪](../../integration/input/tracing/full-stack-distributed-tracing/)章节。
