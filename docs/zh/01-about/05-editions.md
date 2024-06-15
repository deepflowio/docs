---
title: DeepFlow 产品
permalink: /about/editions
---

# 社区版（Community Edition）

DeepFlow 社区版是一个开源版本，是一个高度自动化的可观测性`数据平台`。
它的核心采用 Apache 2.0 许可证，前端页面完全基于 Grafana，因此采用 AGPL 许可证。
它具备高效建设可观测性所需要的的常用功能，包括：

- Universal Map（AutoMetrics）
  - 基于 eBPF/cBPF，自动采集应用、网络、系统全栈性能指标
  - 基于 eBPF/cBPF，自动采集 TCP/UDP 流日志
  - 基于 eBPF/cBPF，自动采集 HTTP1/2、HTTPS（Golang/openssl）、Dubbo、gRPC、SOFARPC、FastCGI、bRPC、MySQL、PostgreSQL、Redis、MongoDB、Kafka、MQTT、AMQP（RabbitMQ）、OpenWire（ActiveMQ）、NATS、Pulsar、ZMTP（ZeroMQ）、RocketMQ、DNS 等应用调用日志
- Distributed Tracing（AutoTracing）
  - 基于 eBPF/cBPF，自动追踪微服务分布式调用链
- Continuous Profiling（AutoProfiling）
  - 支持基于 eBPF 的零侵扰 On-CPU 持续性能剖析
  - 支持 JVM 虚拟机语言，C/C++/Golang/Rust 等编译型语言
- Integration
  - 集成 Prometheus/Telegraf 等指标数据，解决数据孤岛和高基数问题
  - 集成 OpenTelemetry/SkyWalking 等追踪数据，实现全栈分布式追踪
  - 集成 Vector 等日志数据，解决数据孤岛和资源消耗问题
- AutoTagging
  - 支持同步公有云资源标签，并自动注入到所有观测数据中
  - 支持同步容器资源标签和自定义 Label，并自动注入到所有观测数据中
  - 支持 SmartEncoding 高性能数据标签存储
- 集成和管理
  - 支持使用 Grafana 展示指标、追踪数据
  - 支持统一监控多个 K8s 集群及普通云服务器
  - 采集 Agent 支持运行于 K8s 节点、Serverless Pod、Linux Host 环境中
  - 支持在 X86、ARM 体系架构下部署

# 企业版（Enterprise Edition）

DeepFlow 企业版是一个高度自动化的`一站式`可观测性`分析平台`，
它拥有企业级的可视化及管理界面、具备完整的数据分析能力和增强的数据治理能力。
除社区版所有功能之外，它还有如下功能：

- 更强大的 AutoMetrics、AutoTracing、AutoProfiling 数据
  - 基于 eBPF/cBPF，支持采集 TLS、Oracle 等应用调用日志，支持 TCP 流重组
  - 支持基于 eBPF 的零侵扰 Off-CPU、Memory、GPU 持续性能剖析，支持 Python 等解释型语言
  - 支持基于 cBPF 的 TCP 逐包时序图、原始 Packet 等 Network Profiling 能力
  - Agent 支持运行于多租户 Serverless K8s 节点、Android 设备、Windows Host 上
  - Agent 支持运行于 KVM/HyperV/ESXi/Xen 宿主机环境中
  - Agent 支持运行于使用 DPDK 数据面的宿主机和物理服务器上
  - Agent 支持运行于专属服务器上以收集和分析物理交换机的镜像流量，分析传统四七层网关、专有云四七层网关的性能
  - Agent 支持运行于专属服务器上以收集物理交换机的 NetFlow、sFlow 数据
- AutoTagging
  - 与专有云产品深度适配，包括阿里云、腾讯云、华为云等主流云平台
- 分析能力
  - 支持指标、追踪、日志数据的关联查询、自动跳转
  - 支持一站式的告警、报表、自定义视图等多团队协同功能
- 高级特性
  - 支持按需配置流量过滤策略，向安全、网络、审计等流量消费工具分发流量
  - 支持为多租户提供服务，支持数据权限隔离
  - 支持 Agent 与 Server 之间的加密数据传输
  - 支持统一监控多个 Region 的专有云、公有云、容器资源
- 企业级服务
  - 提供完善的金融、能源、运营商（IT、5GC）、车联网等行业的云原生可观测性建设解决方案
  - 提供企业级的售后支持服务，包括故障排查、性能调优、版本升级、可观测性最佳实践落地等

# 云服务（Cloud Edition）

DeepFlow 云服务版是一个完全托管的一站式可观测性平台，
它拥有与企业版一致的功能，目前处于测试试用阶段。

# 版本功能对比

| 模块                 | <center>支持能力</center>                 | 社区版 | 企业版 |
| -------------------- | :---------------------------------------- | ------ | ------ |
| Universal Map        | eBPF/cBPF AutoMetrics                     | ✔      | ✔      |
|                      | 应用协议解析 - TLS、Oracle                |        | ✔      |
|                      | 应用协议解析 - 其他                       | ✔      | ✔      |
|                      | 基于 TCP 流重组的增强协议解析能力         |        | ✔      |
|                      | Wasm/so 协议解析插件 SDK                  | ✔      | ✔      |
|                      | 应用性能指标 - 进程/容器/云服务器         | ✔      | ✔      |
|                      | 应用性能指标 - 宿主机/专有云网关/网络设备 |        | ✔      |
|                      | 网络性能指标 - 进程/容器/云服务器         | ✔      | ✔      |
|                      | 网络性能指标 - 宿主机/专有云网关/网络设备 |        | ✔      |
|                      | 网络性能指标 - NetFlow/sFlow              |        | ✔      |
|                      | 数据库性能指标 - 进程/容器/服务器         | ✔      | ✔      |
|                      | 数据库性能指标 - 宿主机/专有云网关        |        | ✔      |
|                      | 应用调用日志 - 进程/容器/服务器           | ✔      | ✔      |
|                      | 应用调用日志 - 宿主机/专有云网关/网络设备 |        | ✔      |
|                      | 网络流日志 - 进程/容器/服务器             | ✔      | ✔      |
|                      | 网络流日志 - 宿主机/专有云网关/网络设备   |        | ✔      |
|                      | 网络流日志 - NetFlow/sFlow                |        | ✔      |
| Distributed Tracing  | eBPF/cBPF AutoTracing                     | ✔      | ✔      |
|                      | 利用 X-Request-ID 增强 AutoTracing        | ✔      | ✔      |
|                      | 利用 MySQL Comment 增强 AutoTracing       | ✔      | ✔      |
|                      | 利用开源 APM TraceID 增强 AutoTracing     | ✔      | ✔      |
|                      | 利用闭源 APM TraceID 增强 AutoTracing     |        | ✔      |
|                      | Wasm/so AutoTracing 增强插件 SDK          | ✔      | ✔      |
|                      | 集成 APM Span - OpenTelemetry/SkyWalking  | ✔      | ✔      |
|                      | eBPF Span - kprobe/uprobe                 | ✔      | ✔      |
|                      | cBPF Span - 容器/云服务器                 | ✔      | ✔      |
|                      | cBPF Span - 宿主机/专有云网关/网络设备    |        | ✔      |
|                      | 专有云网关智能 NAT 追踪                   |        | ✔      |
| Continuous Profiling | eBPF AutoProfiling - On-CPU               | ✔      | ✔      |
|                      | eBPF AutoProfiling - Off-CPU              |        | ✔      |
|                      | eBPF AutoProfiling - Memory               |        | ✔      |
|                      | eBPF AutoProfiling - GPU                  |        | ✔      |
|                      | JVM 语言 AutoProfiling                    | ✔      | ✔      |
|                      | C/C++/Golang/Rust 语言 AutoProfiling      | ✔      | ✔      |
|                      | Python 语言 AutoProfiling                 |        | ✔      |
|                      | 无符号表进程的 AutoProfiling              |        | ✔      |
|                      | TCP 逐包时序图（Network Profiling）       |        | ✔      |
|                      | Packet 回溯（Network Profiling）          |        | ✔      |
| Event                | eBPF AutoEvents                           | ✔      | ✔      |
|                      | Linux 文件读写 AutoEvents                 | ✔      | ✔      |
|                      | 云资源、容器资源变更事件                  | ✔      | ✔      |
| AutoTagging          | SmartEncoding                             | ✔      | ✔      |
|                      | K8s 容器资源、自定义 Label 标签           | ✔      | ✔      |
|                      | K8s 自定义 Annotation/Env 标签            |        | ✔      |
|                      | 公有云资源标签                            | ✔      | ✔      |
|                      | 公有云自定义业务标签                      |        | ✔      |
|                      | 私有云/专有云资源标签                     |        | ✔      |
|                      | 私有云/专有云自定义业务标签               |        | ✔      |
|                      | 提供 API 支持注入 CMDB 业务标签           | ✔      | ✔      |
|                      | 提供插件机制支持注入进程业务标签          | ✔      | ✔      |
| Integration          | 集成 Prometheus/Telegraf 指标数据         | ✔      | ✔      |
|                      | 集成 OpenTelemetry/SkyWalking 追踪数据    | ✔      | ✔      |
|                      | 集成 Pyroscope 持续性能剖析数据           | ✔      | ✔      |
|                      | 集成 Vector 日志数据                      | ✔      | ✔      |
|                      | 提供 SQL、PromQL API                      | ✔      | ✔      |
|                      | 提供 Grafana Datasource 和 Panel          | ✔      |        |
|                      | 使用 Grafana Tempo 展示分布式追踪数据     | ✔      |        |
|                      | 追踪数据输出至 SkyWalking                 | ✔      | ✔      |
|                      | 追踪数据输出至 OpenTelemetry Collector    | ✔      | ✔      |
|                      | 指标/追踪/事件数据输出至 Kafka            | ✔      | ✔      |
|                      | 指标数据输出至 Prometheus                 | ✔      | ✔      |
| Analytics            | 企业级可观测性分析平台                    |        | ✔      |
|                      | 自定义视图管理                            |        | ✔      |
|                      | 告警管理                                  |        | ✔      |
|                      | 报表管理                                  |        | ✔      |
| Compatibility        | Agent/Server 运行于 X86/ARM 服务器        | ✔      | ✔      |
|                      | Agent 运行于专有 K8s 节点                 | ✔      | ✔      |
|                      | Agent 运行于 Serverless K8s Pod 内        | ✔      | ✔      |
|                      | Agent 运行于 Serverless K8s 节点          |        | ✔      |
|                      | Agent 运行于 Linux 服务器                 | ✔      | ✔      |
|                      | Agent 运行于 Windows 服务器               |        | ✔      |
|                      | Agent 运行于 Android 终端                 |        | ✔      |
|                      | Agent 运行于 KVM/HyperV/ESXi/Xen          |        | ✔      |
|                      | Agent 运行于 DPDK 数据面环境              |        | ✔      |
|                      | Agent 运行于专属服务器采集镜像流量        |        | ✔      |
| Advanced Feature     | 云网流量分发（NPB）                       |        | ✔      |
|                      | 多 Region 统一管理                        |        | ✔      |
|                      | 多租户及权限隔离                          |        | ✔      |
|                      | 加密传输                                  |        | ✔      |
|                      | Agent 注册安全确认                        |        | ✔      |
| Advanced Service     | 行业可观测性解决方案                      |        | ✔      |
|                      | 企业级售后服务支持                        |        | ✔      |
