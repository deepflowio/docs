---
title: Artifact Evaluation for DeepFlow
permalink: /auto-tracing/artifact-evaluation
---

# DeepFlow paper

We attach our submitted paper for the committee's reference.
[Network-Centric Distributed Tracing with DeepFlow: Troubleshooting Your Microservices in Zero Code](https://github.com/deepflowio/deepflow/blob/AEC/docs/deepflow_sigcomm2023.pdf)

# Source code

[https://github.com/deepflowio/deepflow/tree/AEC](https://github.com/deepflowio/deepflow/tree/AEC)

Currentlyource code includes the following core modules:

- agent

  It is used to capture trace data using pre-defined eBPF instrumentation hooks and instrumentation extensions. In addition, the Agent is responsible for integrating metrics and tags from third-party frameworks or cloud platforms and transmitting them to the Server.
  Among them, `agent/src/ebpf` is the source code related to eBPF, which is divided into two parts:

  - `kernel`: The source code of the eBPF program, will be compiled into bytecode and loaded into the kernel.
  - `user`: Used for load eBPF bytecode, and receiving tracing data.

- server

  It is responsible for storing spans in the database and assembling them into traces when users query.

# How to install and run artifact

We have prepared a demo of a microservice for your review, sourced from [this GitHub repository](https://github.com/istio/istio/tree/master/samples/bookinfo).
Please follow the instructions in the document below to install and run artifact：

- [Deploying Istio Bookinfo Demo](https://deepflow.io/docs/auto-tracing/istio-bookinfo-demo/).
- [Deploying DeepFlow to monitor a single K8s cluster](https://deepflow.io/docs/install/single-k8s/).

We have set up an online accessible environment for you. Please [click here](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-ebpf-istio-demo&from=deepflow-doc) to access it.

# Artifact Operating Instructions

According to the introduction in Section 3, you can build and run the artifact on your own, or you can [click here](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-ebpf-istio-demo&from=deepflow-doc) to access it directly online.
Go to Grafana, open the `Distributed Tracing` Dashboard, and after selecting `namespace` = `deepflow-ebpf-istio-demo`, you can choose a specific call to trace.

The following video demonstrates the procedure:

<video width="100%" height="100%" controls autoplay muted>
  <source src="./imgs/artifact-evaluation.mp4" type="video/mp4">
</video>

In the `Flame Graph`, you will observe associations among all spans. Here,`S` represents system spans, which are collected by attaching eBPF programs to application service system call interfaces. `N` represents network spans, and the data is collected using the `AF_PACKET` method. These data are correlated using the following four field values:

- `syscall_trace_id_request` and `syscall_trace_id_responseare` trace IDs generated based on the same thread or coroutine, enabling intra-microservice data tracing (association of spans within microservices).
- `req_tcp_seq` and `resp_tcp_seq` are TCP sequence numbers used for associating client and server spans.

You can click on `Related Data` in order to view the connections between all spans.
