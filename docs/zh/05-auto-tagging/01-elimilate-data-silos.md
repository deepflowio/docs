---
title: 消除数据孤岛
permalink: /auto-tagging/elimilate-data-silos
---

DeepFlow 的 **AutoTagging** 能力为所有观测数据注入统一的属性标签，包括：
- K8s资源：集群、节点、命名空间、服务、Ingress、工作负载（Deployment/StatefulSet/DaemonSet）、ReplicaSet、Pod
- K8s Label：工作负载 Label、ReplicaSet Label、Pod Label，常见的 Label 例如 owner、commitId、version、env、group 等
- 云资源：区域、可用区、云服务器、VPC、子网、路由器、安全组、NAT网关、负载均衡器、对等连接、云企业网、RDS、Redis

为所有 Agent 的数据注入统一的标签，使得我们能从全栈、全链路视角完整观测一个 Request 的性能变化，迅速定位问题所在。此外，DeepFlow 支持接收开源 Prometheus、Telegraf、OpenTelemetry、SkyWalking 的丰富观测数据，将数据发送至 DeepFlow 的好处在于统一的 AutoTagging 机制能彻底打破数据孤岛，并能增强数据的下钻切分能力。
