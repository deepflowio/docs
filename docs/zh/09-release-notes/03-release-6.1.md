---
title: DeepFlow 6.1 Release Notes
permalink: /release-notes/release-6.1
---

# 6.1.6 [2022/11/09]

## 新特性

- AutoLogging
  - HTTP 协议增加 `attribute.http_user_agent` 和 `attribute.http_referer` 字段
  - 增加 `attribute.rpc_service` 字段，取值为 Dubbo/gRPC 的 `ServiceName`
  - 增加 `endpoint` 字段，取值为 Dubbo/gRPC 的 `ServiceName/MethodName`
  - 支持将符合 gRPC 协议规范的 HTTP2 数据标记为 gRPC （而非 HTTP2）协议
- AutoTagging
  - 支持同步 AWS 公有云的资源信息，并作为标签自动注入到观测数据中
  - 支持为公有云托管 K8s 集群的观测数据同时注入云资源和容器标签
- 管理
  - 支持配置 deepflow-agent 是否开启对各类应用协议的解析
  - 支持配置 deepflow-agent 通过 eBPF uprobe 采集数据的 Golang/openssl 进程名正则表达式
  - 支持 deepflow-agent standalone 模式，此时 Flow Log 和 Request Log 写入本地日志文件
  - 支持 i18n，默认显示为英文

## 优化

- AutoLogging
  - 匹配 SQL 关键词，降低 MySQL 和 PostgreSQL 协议识别的误报率
- Grafana
  - 在 Panel 的 Query Editor 中显示 SQL 查询语句，帮助开发者了解如何调用 API
  - 优化 Distributed Tracing 火焰图中空字段信息的显示
- 管理
  - 优化 deepflow-server 和 clickhouse 之间的流量，优先写入同节点的 clickhouse Pod
  - 支持压缩 deepflow-agent 接收的 OTel Span 数据，发送至 deepflow-server 时的带宽消耗可降低约 7 倍

# 6.1.5 [2022/10/26]

## 新特性

- AutoMetrics、AutoTracing、AutoLogging
  - 支持采集 PostgreSQL 的性能指标及访问日志，并关联至分布式追踪中
  - 支持采集使用 openssl 库的 HTTPS 性能指标和访问日志，并关联至分布式追踪中
- Integration
  - deepflow-server 支持为 Prometheus 提供 RemoteRead 接口
  - deepflow-agent 支持跳过 otel-collector 直接接收 OpenTelemetry 数据
  - Grafana Variable 的查询语句中支持使用自定义变量和内置变量，[详见文档](https://deepflow.yunshan.net/docs/zh/server-integration/query/sql/#使用-tag-自身名称过滤)，使用场景包括：
    - 利用变量 pod\_cluster 的当前选择值过滤变量 pod 的取值范围
    - 利用变量 ingress\_wildcard 的输入内容改变变量 ingress 的取值范围
    - 利用内置变量 `$__from` 和 `$__to` 的当前取值提升变量取值范围的查询速度
  - Grafana 中增加两个零侵扰的可观测性 Dashboard：K8s Ingresss、SQL Monitoring
- SQL API
  - `string_enum` 和 `int_enum` 类型的 Tag 支持利用 `Enum()` 函数将 Value 翻译为 Name，用于查询过滤和结果返回
  - 支持 SELECT tags/attributes/labels 查询每一行数据的所有 tag.X/attribute.X/label.X 字段，无需指定具体的字段名
- 管理
  - 支持 ClickHouse 冷数据使用磁盘（作为对象存储的替代）
  - 支持使用 `deepflow-ctl agent rebalance` 均衡 deepflow-agent 到新增和恢复的 deepflow-server

## 优化

- AutoLogging
  - 梳理应用协议解析流程，降低[添加支持更多应用协议](https://github.com/deepflowys/deepflow/blob/main/docs/HOW_TO_SUPPORT_YOUR_PROTOCOL_CN.MD)的门槛
- AutoTagging
  - 增加 `deepflow-ctl cloud info` 命令调试从云平台 API 同步到的资源信息
- SmartEncoding
  - 循环复用已删除资源的 Tag 编码值，提升压缩率和查询速度
- SQL API
  - 优化 server\_port Tag 字段枚举值的 display\_name，包含对应的 int value 以避免含义不明
- 管理
  - deepflow-server 修改为使用 Deployment Controller 部署，**升级时请注意更新 helm chart**
  - deepflow-agent 支持运行于非特权模式下，具体权限需求请[参考文档](https://deepflow.yunshan.net/docs/zh/install/overview/#运行权限及内核要求)
  - 优化 Prometheus 指标与 DeepFlow Table 的映射关系，每个 Metrics 对应一个 Table

# 6.1.4 [2022/10/12]

## 新特性

- AutoTagging
  - 支持同步腾讯公有云的资源信息，并作为标签自动注入到观测数据中
- AutoTracing
  - 在无法运行 eBPF 的环境中支持关联应用 Span 和网络 Span，消除追踪盲点
- SQL API
  - show tags 新增返回 map 类型的字段，例如 labels、attributes、tags
  - show tag values 新增 limit、offset、like 参数
- 生产环境部署
  - 支持使用托管的 ClickHouse 和 MySQL
  - deepflow-agent 未完成注册时支持由 deepflow-server 下发配置
- Grafana
  - 新增 DeepFlow 自我监控的 Dashboard

## 优化

- SQL API
  - OTel Span 中的指标数据支持通过 show metrics API 返回
- 系统能力
  - 支持不依赖 sidecar 完成 deepflow-server master 选举
  - deepflow-server 支持向后兼容 deepflow-agent
  - 默认与 deepflow-server 所在容器节点的 NTP 服务器同步
  - 规范化进程的 -v 输出

# 6.1.3 [2022/09/23]

## 应用

- AutoMetrics
  - 新增指标：客户端等待时延、SYN 包数、SYN-ACK 包数、SYN 重传包数、SYN-ACK 重传包数
- AutoTracing
  - 支持将 eBPF uprobe Span 与 cBPF Span、OTel Span 关联，展示在追踪火焰图中
- AutoLogging
  - 支持使用 eBPF uprobe 采集 Golang HTTP2、HTTP2\_TLS 调用
  - 支持采集裁剪了标准符号表的 Golang 进程 uprobe 数据（Golang >= 1.13 且 < 1.18）
- AutoTagging
  - 对于未关联云服务器的 K8s 节点，自动生成云服务器标签
  - 支持同步华为公有云的资源信息
- Querier SQL API
  - GROUP BY 后的字段自动返回，无需在 SELECT 后显式声明
- Grafana
  - 拓扑图（DeepFlow Topo）、追踪火焰图（DeepFlow AppTracing）增加缩略图展示
  - 优化追踪火焰图中的 Span Tip，显示 Span 自身耗时比例

## 系统

- 首次部署时等待 agent 上线的时间从 7 分钟优化到 4 分钟
- 同一个 K8s 集群内对 deepflow-server 和 clickhouse 的访问不再使用 NodeIP
- deepflow-server 默认使用 `externalTrafficPolicy=Cluster` 避免部分环境的 kube-proxy 的 `externalTrafficPolicy=Local` 的功能不可用和部分 CNI 兼容性问题，可手动修改为 `Local` 以优化跨集群流量
- deepflow-server 新增 `ext-metrics-ttl`、`flow-metrics-ttl`、`flow-log-ttl` 配置参数用于初始化数据保留时长
- deepflow-agent 支持将 `l4_flow_log` 和 `l7_flow_log` 写入到本地文件中
- deepflow-agent 去除对 libbpf 的依赖

# 6.1.2 [2022/09/08]

V6.1.2 是开源之后的第二个版本，我们正式开启两周一个小版本的节奏。

## 应用

- AutoMetrics、AutoLogging
  - MySQL 新增 `COM_STMT_PREPARE`、`COM_STMT_EXECUTE`、`COM_STMT_FETCH`、`COM_STMT_CLOSE` [命令](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_command_phase.html)解析能力
  - 支持采集 MQTT 3.1 调用日志和性能指标
- SQL API
  - 支持 `SELECT labels` 获取所有的自定义 label 列

## 系统

- deepflow-agent
  - 增加`非活跃 IP 指标数据`配置项，关闭此配置后没有回复流量的 IP 将会被聚合
  - 使用 BPF 预过滤采集接口，提升采集性能
  - 提供 deb 安装包
- deepflow-ctl
  - agent-group-config update 无需再指定 agent-group-id 参数

# 6.1.1 [2022/08/25]

V6.1.1 历时三个月开发，是 V6 系列的一个重大迭代版本，也是 DeepFlow 正式发布的第一个社区版。自此以后企业版和社区版将会同步迭代，也将会提升到`每两周发布一个小版本`的开发节奏，并于大约四个小版本后发布 V6.1 的最后一个小版本（LTS 版本）。

为了打造一个<mark>高度自动化</mark>的开源可观测性平台，这个版本我们对软件架构进行了较大调整，包括将过多的微服务合并、消除部分组件对 DaemonSet、HostNet 等部署模式的依赖、使用 Golang 重构部分 Python 模块等。

最为重要的是，在这个版本中我们极大的增强了应用性能监控能力：
- 支持集成并关联 OpenTelemetry、SkyWalking 追踪数据，解锁全栈、全链路的无盲点分布式追踪能力，提升不同开发团队之间的沟通效率
- 支持集成并关联 Prometheus、Telegraf 指标数据，在一个平台上沉淀系统、应用、业务全栈指标，让运维、开发、运营能够协同工作
- 增强 AutoTagging 和 SmartEncoding 能力，支持注入更多的 K8s 自定义 Label
- 增强 eBPF AutoTracing 能力，支持采集 Golang HTTPS 调用

注：下述 Release Note 不包含企业版功能。

## 应用功能

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

## 系统功能

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
