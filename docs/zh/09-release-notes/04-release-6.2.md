---
title: DeepFlow 6.2 Release Notes
permalink: /release-notes/release-6.2
---

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
