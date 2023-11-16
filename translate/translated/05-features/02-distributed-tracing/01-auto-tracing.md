---
title: AutoTracing
permalink: /features/distributed-tracing/auto-tracing
---

> This document was translated by GPT-4

# AutoTracing

In the past, we generally inserted trace code by actively using SDKs, bytecode enhancements, or manual embedding, which brought a heavy burden to application developers who need to adapt to various development languages and RPC frameworks. When the business uses non-Java language implementation, even if the Tracer can encapsulate it via SDK to reduce invasiveness, there is still the issue of requiring re-publication due to SDK updates. On the other hand, manual coding in cloud-native environments faces more challenges. Any application call needs to traverse through a complex path from microservices, Sidecar, iptables/ipvs container network, virtual machine vsiwtch, cloud network, NFV gateways, etc. The establishment of observability should cover the full stack from application to infrastructure in a cloud-native environment, but this cannot be achieved by inserting trace code into the business code.

Based on eBPF, DeepFlow has innovatively implemented non-disturbing distributed tracing. DeepFlow associates eBPF Event, BPF Packet, Thread ID, Coroutine ID, Request arrival time sequence, TCP transmission timing, and accomplishes highly-automated distributed tracing (**AutoTracing**). Currently, AutoTracing supports **all the same thread call scenarios**, **some cross-thread call scenarios** (by parsing the protocol header and X-Request-ID, TraceID/SpanID in MySQL Comment), **all kernel thread scheduling scenarios** ([Kernel Threads](<https://en.wikipedia.org/wiki/Thread_(computing)>)), and **some user thread scheduling scenarios** (User Threads, for example, Golang Goroutine). In these scenarios, support is provided for tracing any service's distributed call chain.

This chapter will use two Demo apps as examples to demonstrate DeepFlow's AutoTracing capabilities. These two Demos do not depend on inserting any Jaeger, OpenTelemetry, SkyWalking, etc. codes. They can complete distributed tracing solely based on data collected by eBPF.

# Current Limitations

The AutoTracing based on eBPF is a disruptive innovation, and we invite you to join this exciting exploration! The current TODO work includes:

- Cross-thread request processing
  - [ ] Receiving requests and sending requests downstream are located in different threads, usually using memory message queues (such as Golang Channel, etc.)
  - [x] The thread that receives the request and the thread that responds to the request are different
  - [x] Cross-thread request handling on gateways like HAProxy/Envoy
- Coroutine scheduling scenarios
  - [ ] Applications of coroutines or lightweight threads, such as Erlang
  - [x] Golang Goroutine
- Use of message queues
  - [ ] Service A produces a message, and after the message queue (like Kafka/Redis), it is consumed by Service B

In fact, in real business scenarios, the above limitations are not difficult to overcome. For example:

- In financial applications, 'Transaction Serial Number' is generally injected into the request. DeepFlow Wasm Plugin can extract this field and use it as TraceID.
- If the entire RPC framework is unified, a random ID for tracing can be injected into the RPC Header (far lighter than instrumented distributed tracing).
- If instrumented distributed tracing has already been partially used in the business, DeepFlow can also extract the TraceID from the request to solve some cross-thread problems.

Moreover, these seemingly 'compromise' solutions are very useful in reality, can even bypass the eBPF requirement for kernel 4.14+, and purely rely on cBPF's capabilities to implement distributed tracing.

# Full-stack Distributed Tracing

The distributed tracing capabilities of eBPF and APM are not contradictory. APM can be used to trace the function call path inside the application process and is also good at cross-threading and asynchronous scenarios. However, eBPF has global coverage, which can easily cover gateways, basic services, network paths, multi-language services. In DeepFlow, we allow calling of APM's Trace API to display APM + eBPF full-link distributed tracing diagram and also provide `Trace Completion API` to enable APM to call DeepFlow to obtain and associate eBPF tracing data. Besides, DeepFlow and APM can use the OTLP protocol to export their tracing data to each other.

![DeepFlow & APM Integration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

For specific methods of DeepFlow combined with APM, refer to the chapter on [Full-stack Distributed Tracing](../../integration/input/tracing/full-stack-distributed-tracing/).
