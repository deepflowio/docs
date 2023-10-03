---
title: 消除数据孤岛
permalink: /features/auto-tagging/elimilate-data-silos
---

DeepFlow 的 **AutoTagging** 能力为所有观测数据注入统一的属性标签，包括：
- 云资源：区域、可用区、云服务器、VPC、子网、路由器、安全组、NAT网关、负载均衡器、对等连接、云企业网、RDS、Redis
- 云资源自定义标签：租户在云服务器上定义的业务标签
- K8s资源：集群、节点、命名空间、服务、Ingress、工作负载、ReplicaSet、Pod
- K8s 自定义标签：例如工作负载的 Label/Annotation/Env，常见的 Label 例如 owner、commitId、version、app、group 等
- CMDB 中的业务标签：DeepFlow Server 提供声明式 API 将 CMDB 中的业务标签与云资源、容器资源关联
- 持续部署系统中的业务标签：在非 K8s 环境中，持续部署系统知晓进程相关的业务标签，DeepFlow Agent 中可通过插件将标签与进程关联

为所有 Agent 的数据注入统一的标签，有助于我们能从全栈、全链路视角完整观测一个 Request 的性能变化，迅速定位问题相关的资源、服务和业务。

此外，DeepFlow 支持接收开源 Prometheus、Telegraf、OpenTelemetry、SkyWalking 的丰富观测数据，将数据发送至 DeepFlow 的额外收益在于统一的 AutoTagging 机制能彻底打破数据孤岛，并能增强数据的下钻切分能力。
