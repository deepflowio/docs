---
title: DeepFlow 6.2 Release Notes
permalink: /release-notes/release-6.2
---

# 6.2.4 [TBD]

## 新特性 (GA)

- Universal Application Topology
  - **支持零插码自动展现进程粒度的全景应用拓扑** [FR-001-小米](https://github.com/deepflowio/deepflow/issues/1481)
- AutoTagging
  - 支持批量录入负载均衡器及其监听器的信息 [FR-022-小米](https://github.com/deepflowio/deepflow/issues/2406)

# 6.2.3 [2022/02/21]

## 新特性 (Alpha)

- SQL API
  - 新增 SLIMIT 参数以限制返回结果中的 Series 数量

## 新特性 (GA)

- Universal Application Topology
  - **支持利用 TOA（TCP Option Address）机制计算 NAT 前、后的真实访问关系** [FR-002-小米](https://github.com/deepflowio/deepflow/issues/1490)
- AutoTagging
  - 进程自动继承其父进程的元数据（os\_app 标签） [FR-024-小米](https://github.com/deepflowys/deepflow/issues/2456)
  - 支持同步百度云云智能网（CSN）资源信息
- Grafana
  - 增加 Grafana backend 插件模块，支持标准的 Grafana 告警策略配置

## 优化

- Management
  - 远程升级云服务器上的 deepflow-agent 可完全通过 deepflow-ctl 完成，无需为 deepflow-server 手动挂载 hostPath
- AutoTagging
  - 适配 K8s 1.18、1.20 的资源信息同步
- SQL API
  - 获取 enum 类型 Tag 字段的可选值时，返回取值对应的描述信息

# 6.2.2 [2022/02/07]

## 新特性 (GA)

- AutoTracing
  - **支持零插码的 Golang 应用分布式追踪**
- AutoTagging
  - **支持为进程、云服务器、K8s Namespace 增加自定义元数据** [FR-001-小米](https://github.com/deepflowys/deepflow/issues/1481)
  - 支持自动同步 AWS 和阿里云账号下的 K8s 集群信息
- Management
  - 支持 ClickHouse 节点数大于 deepflow-server 副本数 [FR-003-中通](https://github.com/deepflowys/deepflow/issues/1623)
  - 支持 deepflow-agent 以普通进程（而非 Pod）形态运行于 K8s Node 上 [FR-004-腾讯](https://github.com/deepflowys/deepflow/issues/1710)
  - 支持为 deepflow-agent 指定域名形式的 controller 或 ingester 地址 [FR-008-小米](https://github.com/deepflowys/deepflow/issues/1998)

## 优化

- deepflow-agent
  - 扫描进程的正则表达式列表（os-proc-regex）支持配置 action=drop 用于表达忽略语义 [FR-010-小米](https://github.com/deepflowys/deepflow/issues/2280)
  - 支持运行于低于 3.0 的 Linux Kernel 环境中 [FR-012-小米](https://github.com/deepflowys/deepflow/issues/2283)
  - 使用操作系统的 socket 信息校正流日志的方向 [FR-011-小米](https://github.com/deepflowys/deepflow/issues/2281)
  - 当 agent 运行环境的 ctrl\_ip 或 ctrl\_mac 发生变化时，支持自动更新 agent 的相应信息
- deepflow-server
  - UDP 流超时结束时，l4\_flow\_log 的 status 字段置为正常

# 6.2.1 [2022/01/17]

## 新特性 (Alpha)

- Universal Application Topology
  - **支持零插码自动展现进程粒度的全景应用拓扑** [FR-001-小米](https://github.com/deepflowio/deepflow/issues/1481)
- AutoTagging
  - **支持为进程、云服务器、K8s Namespace 增加自定义元数据** [FR-001-小米](https://github.com/deepflowio/deepflow/issues/1481)
  - 支持自动同步 AWS 和阿里云账号下的 K8s 集群信息
  - 支持同步百度云云智能网（CSN）资源信息
- Querier API
  - **支持 PromQL**
- Management
  - 支持 ClickHouse 节点数大于 deepflow-server 副本数 [FR-003-中通](https://github.com/deepflowio/deepflow/issues/1623)
  - 支持 deepflow-agent 以普通进程（而非 Pod）形态运行于 K8s Node 上 [FR-004-腾讯](https://github.com/deepflowio/deepflow/issues/1710)
  - 支持为 deepflow-agent 指定域名形式的 controller 或 ingester 地址 [FR-008-小米](https://github.com/deepflowio/deepflow/issues/1998)

## 优化

- Querier API
  - 支持返回 AS 之前的原始字段名
- Grafana
  - 优化 Enum 类型的 Variable，避免选择 All 时在 SQL 中将所有候选值全部展开

# 6.2.0 [2022/12/29]

## 新特性 (Alpha)

- AutoTracing
  - **支持零插码的 Golang 应用分布式追踪**
- Universal Application Topology
  - **支持利用 TOA（TCP Option Address）机制计算 NAT 前、后的真实访问关系** [FR-002-小米](https://github.com/deepflowio/deepflow/issues/1490)

## 优化

- AutoTracing
  - 当应用进程仅作为客户端时，避免 eBPF 将所有请求关联至同一个 Trace
  - 简化 eBPF 代码中的协议识别逻辑 [FR-005-云杉](https://github.com/deepflowio/deepflow/issues/1739)
- Management
  - 支持创建 agent-group 时指定 group ID [FR-007-小米](https://github.com/deepflowio/deepflow/issues/1864)
