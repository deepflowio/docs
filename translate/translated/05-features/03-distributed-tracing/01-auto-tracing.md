---
title: AutoTracing
permalink: /features/distributed-tracing/auto-tracing
---

> This document was translated by ChatGPT

# AutoTracing

Traditionally, we have inserted tracing code through SDKs, bytecode enhancement, or manual instrumentation, which imposes a heavy burden on application developers as they need to adapt to various programming languages and RPC frameworks. When the business uses non-Java languages, even if the Tracer can be encapsulated through SDKs to reduce intrusiveness, there still exists the issue of needing to redeploy the application due to SDK updates. On the other hand, in a cloud-native environment, manual instrumentation faces more challenges. Any application call needs to traverse complex paths from microservices, Sidecar, iptables/ipvs container networks, virtual machine vswitch, cloud networks, NFV gateways, etc. Observability should cover the full stack from applications to infrastructure in a cloud-native environment, but this cannot be achieved by inserting tracing code into business code.

Based on eBPF, DeepFlow innovatively implements zero-intrusion distributed tracing, meaning **distributed tracing can be achieved without generating, injecting, or propagating TraceID**. DeepFlow correlates eBPF Event, BPF Packet, Thread ID, Coroutine ID, Request arrival sequence, and TCP send sequence to achieve highly automated distributed tracing (**AutoTracing**). Currently, AutoTracing supports **all same-thread call** scenarios and **some cross-thread call** scenarios (by parsing protocol headers and X-Request-ID, TraceID/SpanID in MySQL Comments), supports **all kernel thread scheduling** ([Kernel Threads](<https://en.wikipedia.org/wiki/Thread_(computing)>)) scenarios and **some user-space thread scheduling** (User Threads, such as Golang Goroutine) scenarios, enabling zero-intrusion tracing of distributed call chains for any service in these scenarios.

This chapter will demonstrate DeepFlow's AutoTracing capabilities using two demo applications. These demos do not rely on inserting any Jaeger, OpenTelemetry, SkyWalking code and can complete distributed tracing entirely based on data collected by eBPF.

# X-Request-ID

Almost all gateways support injecting a random unique ID into the HTTP Header to track a call. The principle behind this behavior is: when the client requests the gateway, the gateway generates a random ID (usually named X-Request-ID) and injects it into the HTTP Header sent to the upstream. Upon receiving the upstream response, the gateway injects the same random ID into the response sent to the client. From this principle, it can be seen that this information injection does not require any modifications on the business side, and DeepFlow can also use this information to achieve zero-intrusion tracing of the call chain before and after the gateway.

Almost all gateways support this kind of random ID auto-injection, such as:

- [Envoy: X-Request-ID](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers#x-request-id)
- [Nginx: X-Request-ID](https://www.nginx.com/blog/application-tracing-nginx-plus/)
- [HAProxy: X-Request-ID](https://stackoverflow.com/questions/46531909/setting-a-unique-http-request-id-with-haproxys-http-request-set-header)
- [BFE: X-Bfe-Log-Id](https://www.bfe-networks.net/en_us/modules/mod_logid/mod_logid/)
- [Tencent Cloud CLB: Stgw-request-id](https://cloud.tencent.com/document/product/214/15171)
- [Baidu Cloud BLB: X-BLB-Request-Id](https://cloud.baidu.com/doc/BLB/s/gkk3kb8ic)

Since the names of the random IDs injected by different gateways vary, DeepFlow supports specifying the field names to be parsed through the `http_log_x_request_id` configuration in the Agent. The default value of this configuration is `X-Request-ID`, and it supports multiple field names.

Additionally, similar information exists in message queues, such as:

- [Kafka's CorrelationID in Request-Response communication scenarios](https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-CommonRequestandResponseStructure)
- [ActiveMQ's CorrelationID](https://activemq.apache.org/how-should-i-implement-request-response-with-jms)

# Current Limitations

AutoTracing based on eBPF is a groundbreaking innovation, and we welcome you to join this exciting exploration! The current TODO tasks include:

- Cross-thread request handling
  - [ ] Receiving requests and sending requests downstream are on different threads, usually using in-memory message queues (such as Golang Channel, etc.)
  - [x] Receiving requests and responding to requests are on different threads
  - [x] Gateways like HAProxy/Envoy handle requests across threads
- Coroutine scheduling scenarios
  - [ ] Applications using coroutines or lightweight threads like Erlang
  - [x] Golang Goroutine
- Utilizing message queues
  - [ ] Service A produces messages, which are consumed by Service B after passing through message queues (such as Kafka/Redis)

In fact, in real business scenarios, the above limitations are not difficult to solve, for example:

- In financial applications, a `transaction serial number` is generally injected into the request, which can be extracted by DeepFlow Wasm Plugin and used as TraceID
- If the entire RPC framework is unified, a random ID for tracing can be injected into the RPC Header (a much lighter task than instrumentation-based distributed tracing)
- The business may have already partially used instrumentation-based distributed tracing, and DeepFlow can also extract the TraceID from the request to solve some cross-thread issues

Additionally, these seemingly `compromised` solutions are very effective in practice, and can even avoid the requirement of eBPF for kernel 4.14+, achieving distributed tracing purely relying on cBPF capabilities.

# Full-Stack Distributed Tracing

The distributed tracing capabilities of eBPF and APM are not contradictory. APM can be used to trace the function call paths within application processes and is good at solving cross-thread and asynchronous scenarios. eBPF, on the other hand, has global coverage capabilities, easily covering gateways, basic services, network paths, and multi-language services. In DeepFlow, we support invoking APM's Trace API to display a full-link distributed tracing map of APM + eBPF, and also provide the `Trace Completion API` for APM to call DeepFlow to obtain and associate eBPF's tracing data. Additionally, DeepFlow and APM can also use the OTLP protocol to export their tracing data to each other.

![DeepFlow and APM Integration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20231002651a886330ed3.png)

For specific methods of integrating DeepFlow and APM, refer to the [Full-Stack Distributed Tracing](../../integration/input/tracing/full-stack-distributed-tracing/) section.