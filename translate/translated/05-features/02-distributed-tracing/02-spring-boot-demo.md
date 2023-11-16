---
title: Spring Boot Demo
permalink: /features/distributed-tracing/spring-boot-demo
---

> This document was translated by GPT-4

# Introduction

This is an example of a microservice application developed using Spring Boot to illustrate the AutoTracing capability of DeepFlow.

# Deploying the Spring Boot Demo

The demo we used comes from [this GitHub repository](https://github.com/chanjarster/spring-boot-istio-jaeger-demo). It has a simple distribution tracing chain: `foo_svc -> bar_svc -> loo_svc`.

And this is the command to quickly deploy the Demo in K8s:

```bash
kubectl apply -f https://raw.githubusercontent.com/deepflowio/deepflow-demo/main/DeepFlow-EBPF-Sping-Demo/deepflow-ebpf-spring-demo.yaml
```

The original demo in the GitHub repository used Jaeger for primary tracing. In order to demonstrate AutoTracing capabilities, we removed Jaeger from the deployment script mentioned above.

# Exploring Distributed Tracing

You can proceed to Grafana and open the `Distributed Tracing` Dashboard by selecting `namespace = deepflow-ebpf-spring-demo`. Then, choose an invocation to trace. Here's how it looks:

![eBPF Sping Demo](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20220823630441420077b.png)

The tracing data in DeepFlow includes three types of Spans that track the entire trajectory of a request:

- N: Spans extracted from network traffic using BPF
- S: Spans extracted from system or application function calls using eBPF
- A: Spans collected internally from the application using OTel

The image above shows the first two types. The third one can be displayed upon [integrating OpenTelemetry](../../integration/input/tracing/opentelemetry/).

You can also view the effect of tracing by [visiting DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-ebpf-spring-demo&from=deepflow-doc). The corresponding topology diagram of the call chain flame graph in the image above is as follows:

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

To summarize this Demo,

- Zero code injection: No manual code injection is required for the entire tracing process, nor is there a need for any TraceID/SpanID injection into the HTTP Header.
- Multilingual: Supports tracing of Java applications and C (curl) basic services.
- Full-link: Utilizes eBPF and BPF to automatically trace 18 Spans in this Trace, including 6 eBPF Spans and 12 BPF Spans.
- Full stack: Supports tracing of network paths between two Pods on different K8s Nodes, even if the path goes through tunnel encapsulations, such as Span 2-5 (IPIP tunnel encapsulation).
