---
title: Spring Boot Demo
permalink: /features/distributed-tracing/spring-boot-demo
---

> This document was translated by ChatGPT

# Introduction

This chapter uses a microservice application developed with Spring Boot as an example to demonstrate DeepFlow's AutoTracing capabilities.

# Deploying the Spring Boot Demo

The demo we use is sourced from [this GitHub repository](https://github.com/chanjarster/spring-boot-istio-jaeger-demo), and its call chain is relatively simple: `foo_svc -> bar_svc -> loo_svc`.

You can quickly deploy the demo in K8s using the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/deepflowio/deepflow-demo/main/DeepFlow-EBPF-Sping-Demo/deepflow-ebpf-spring-demo.yaml
```

The original GitHub code repository for this demo uses Jaeger for active tracing. To demonstrate AutoTracing capabilities, we have specifically removed Jaeger in the above deployment script.

# Viewing Distributed Tracing

Go to Grafana, open the `Distributed Tracing` Dashboard, select `namespace = deepflow-ebpf-spring-demo`, and then choose a call to trace. The effect is shown in the figure below:

![eBPF Sping Demo](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20220823630441420077b.png)

DeepFlow's tracing data contains three types of Spans, tracking the entire trajectory of a request:

- N: Spans extracted from network traffic via BPF
- S: Spans extracted from system or application function calls via eBPF
- A: Spans collected from within the application via OTel

The figure above shows the first two types, and the third type can be displayed by [integrating OpenTelemetry](../../integration/input/tracing/opentelemetry/).

[Visit DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-ebpf-spring-demo&from=deepflow-doc) to also view the tracing effect. The topology corresponding to the call chain flame graph in the figure above is as follows.

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

To summarize this tracing demo:

- Zero Instrumentation: The entire tracing process does not require manually inserting any tracing code or injecting any TraceID/SpanID into the HTTP Header.
- Multi-language: Supports tracing for Java applications and C (curl) language basic services.
- Full Link: Utilizing eBPF and BPF, it automatically traces 18 Spans for this trace, including 6 eBPF Spans and 12 BPF Spans.
- Full Stack: Supports tracing the network path between two Pods across K8s Nodes, even if it passes through tunnel encapsulation in the middle, such as Spans 2-5 (IPIP tunnel encapsulation).