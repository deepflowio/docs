---
title: Spring Boot Demo
permalink: /features/distributed-tracing/spring-boot-demo
---

# 简介

本章以一个使用 Spring Boot 开发的微服务应用为例，展示 DeepFlow 的 AutoTracing 能力。

# 部署 Spring Boot Demo

我们使用的 Demo 源自[这个 GitHub 仓库](https://github.com/chanjarster/spring-boot-istio-jaeger-demo)，
它的调用链比较简单：`foo_svc -> bar_svc -> loo_svc`。

使用如下命令可在 K8s 中快速部署 Demo：

```bash
kubectl apply -f https://raw.githubusercontent.com/deepflowio/deepflow-demo/main/DeepFlow-EBPF-Sping-Demo/deepflow-ebpf-spring-demo.yaml
```

这个 Demo 原始的 GitHub 代码仓库中使用 Jaeger 进行了主动追踪，为了演示 AutoTracing 能力我们特意在上述部署脚本中去掉了 Jaeger。

# 查看分布式追踪

前往 Grafana，打开 `Distributed Tracing` Dashboard，选择 `namespace = deepflow-ebpf-spring-demo` 后，可选择一个调用进行追踪，效果如下图：

![eBPF Sping Demo](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20220823630441420077b.png)

DeepFlow 的追踪数据中含有三种 Span，跟踪一次请求的整个轨迹：

- N：通过 BPF 从网络流量中提取的 Span
- S：通过 eBPF 从系统或应用函数调用中提取的 Span
- A：通过 OTel 从应用内部采集的 Span

上图中展示了前两种，第三种在[集成 OpenTelemetry](../../integration/input/tracing/opentelemetry/) 可以展示出来。

[访问 DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-ebpf-spring-demo&from=deepflow-doc) 也可查看追踪效果。
上图中的调用链火焰图对应的拓扑图如下。

```mermaid
flowchart TD

loadgenerator_curl_send(1-eBPF: loadgenerator curl send):::loadgenerator
loadgenerator_vnic_send(2-BPF: loadgenerator vnic send):::nic
node2_nic_send_lg(3-BPF: node2 nic send loadgenerator):::nic
node1_nic_recv_lg(4-BPF: node1 nic recv loadgenerator):::nic

foo_vnic_recv(5-BPF: foo vnic recv):::nic
foo_java_recv(6-eBPF: foo java recv):::foo
foo_java_send(7-eBPF: foo java send):::foo
foo_vnic_send(8-BPF: foo vnic send):::nic
node1_nic_send_foo(9-BPF: node1 nic send foo):::nic
node2_nic_recv_foo(10-BPF: node2 nic recv foo):::nic

bar_vnic_recv(11-BPF: bar vnic recv):::nic
bar_java_recv(12-eBPF: bar java recv):::bar
bar_java_send(13-eBPF: bar java send):::bar
bar_vnic_send(14-BPF: bar vnic send):::nic
node2_nic_send_bar(15-BPF: node2 nic send bar):::nic
node1_nic_recv_bar(16-BPF: node1 nic recv bar):::nic

loo_vnic_recv(17-BPF: loo vnic recv):::nic
loo_java_recv(18-eBPF: loo java recv):::loo

subgraph k8s node2
    subgraph loadgenerator pod
        loadgenerator_curl_send
    end

    loadgenerator_vnic_send
    node2_nic_send_lg

    node2_nic_recv_foo
    bar_vnic_recv

    subgraph bar pod
        bar_java_recv
        bar_java_send
    end

    bar_vnic_send
    node2_nic_send_bar
end

subgraph k8s node1
    node1_nic_recv_lg
    foo_vnic_recv

    subgraph foo pod
        foo_java_recv
        foo_java_send
    end

    foo_vnic_send
    node1_nic_send_foo

    node1_nic_recv_bar
    loo_vnic_recv

    subgraph loo pod
        loo_java_recv
    end
end

loadgenerator_curl_send --> loadgenerator_vnic_send --> node2_nic_send_lg -->|IPIP encap| node1_nic_recv_lg --> foo_vnic_recv

foo_vnic_recv --> foo_java_recv --> foo_java_send --> foo_vnic_send --> node1_nic_send_foo -->|IPIP encap| node2_nic_recv_foo --> bar_vnic_recv

bar_vnic_recv --> bar_java_recv --> bar_java_send --> bar_vnic_send --> node2_nic_send_bar -->|IPIP encap| node1_nic_recv_bar --> loo_vnic_recv

loo_vnic_recv --> loo_java_recv

classDef loadgenerator fill:#16a9e8,color:white;
classDef nic fill:#a1a1a1,color:white;
classDef foo fill:#8498d1,color:white;
classDef bar fill:#9cdbc3,color:black;
classDef loo fill:#eadb92,color:black;
```

对这个追踪 Demo 我们总结一下：

- 零插码：整个追踪过程不需要手动插入任何追踪代码，不需要向 HTTP Header 中注入任何 TraceID/SpanID
- 多语言：支持对 Java 语言应用及 C（curl）语言基础服务的追踪
- 全链路：利用 eBPF 和 BPF，自动追踪到了这个 Trace 的 18 个 Span，含 6 个 eBPF Span、12 个 BPF Span
- 全栈：支持追踪跨 K8s Node 上两个 Pod 之间的网络路径，即使中间经过了隧道封装，例如 Span 2-5 等（IPIP 隧道封装）
