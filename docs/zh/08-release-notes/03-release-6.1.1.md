---
title: DeepFlow 6.1.1 Release Notes
permalink: /release-notes/release-6.1.1
---

V6.1.1 历时三个月开发，是 V6 系列的一个重大迭代版本，也是 DeepFlow 正式发布的第一个社区版。自此以后企业版和社区版将会同步迭代，也将会提升到`每两周发布一个小版本`的开发节奏，并于大约四个小版本后发布 V6.1 的最后一个小版本（LTS 版本）。

为了打造一个<mark>高度自动化</mark>的开源可观测性平台，这个版本我们对软件架构进行了较大调整，包括将过多的微服务合并、消除部分组件对 DaemonSet、HostNet 等部署模式的依赖、使用 Golang 重构部分 Python 模块等。

最为重要的是，在这个版本中我们极大的增强了应用性能监控能力：
- 支持集成并关联 OpenTelemetry、SkyWalking 追踪数据，解锁全栈、全链路的无盲点分布式追踪能力，提升不同开发团队之间的沟通效率
- 支持集成并关联 Prometheus、Telegraf 指标数据，在一个平台上沉淀系统、应用、业务全栈指标，让运维、开发、运营能够协同工作
- 增强 AutoTagging 和 SmartEncoding 能力，支持注入更多的 K8s 自定义 Label
- 增强 eBPF AutoTracing 能力，支持采集 Golang HTTPS 调用

注：下述 Release Note 不包含企业版功能。

# 应用功能

- <mark>指标数据增强</mark>
  - 支持集成 Prometheus 指标数据（实现 `remote_write` 接口）
  - 支持集成 Telegraf 指标数据
  - 支持向集成的指标数据中自动注入云资源、容器资源、K8s 自定义 Label 标签（AutoTagging）
- <mark>分布式追踪增强</mark>
  - 支持集成 OpenTelemetry 追踪数据
  - 支持集成 SkyWalking 追踪数据
  - 支持关联应用、系统、网络 Span，实现全栈、全链路的无盲点追踪能力
  - 支持向集成的追踪数据中自动注入云资源、容器资源、K8s 自定义 Label 标签（AutoTagging）
- <mark>应用调用采集能力增强</mark>
  - 支持 eBPF 采集 Golang 的 HTTPS 调用日志和性能指标
  - 支持 eBPF/BPF 采集 MQTT 3.1 调用日志和性能指标（Beta）
  - 应用协议解析去掉端口号限制
- <mark>Grafana 支持增强</mark>
  - 新增交互式的 DeepFlow Query Editor，一个全新的零门槛查询条件编辑器
  - 新增 DeepFlow AppTracing Panel，用于绘制调用链追踪火焰图
  - 新增 DeepFlow Topo Panel，用于绘制调用拓扑图
- 搜索能力提升
  - 支持查询已删除资源的历史数据
  - 支持利用 K8s 自定义 Label 搜索所有数据
  - 支持基于 K8s 自定义 Label 对所有数据进行分组
  - 支持基于所有可搜索字段创建模板变量
- 流日志聚合逻辑调整
  - 流日志仅记录当前周期内出现的 TCP Flag
  - 在采集到的 FIN-FIN-ACK 序列后滞后超时，等待最后一个 ACK
  - 存储流量中的 VLAN 字段
- 指标量新增 Math 算子

# 系统功能

- 提供 deepflow-ctl 命令行工具用于 CLI 管理
- Agent（采集器）
  - 支持同时解析 HTTP、Dubbo 协议中多种规范的 TraceID、SpanID
  - 支持采集 loopback 接口上 VIP 的网络和应用性能数据
  - 采集网口默认配置支持 Calico、Flannel、Qemu、Cilium、Kube-OVN、localhost、物理网卡
  - 将所有不阻碍采集器启动的配置项上移到由控制器下发，提供声明式的分组配置 API
  - 支持远程限制 deepflow-agent（Rust）的 CPU 用量
  - 采集器分配控制器或数据节点失败后支持自愈
- Server（控制器、数据节点）
  - 支持同步 K8s 自定义 Label
  - 支持滞后删除已删除资源的信息
  - 为所有数据表提供统一的 Schema API 和 SQL 查询 API
  - 合并控制器、数据节点的主要模块为 deepflow-server
  - 优化控制器、数据节点部署方式，降低对 DaemonSet、HostNet 的依赖
  - 优化主控制器选举逻辑，去掉对 Zookeeper 的依赖
  - 消除数据库中存储的明文秘钥
