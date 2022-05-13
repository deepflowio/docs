---
title: MetaFlow Introduction
---

<mark>Attention: This page is translated by Google. Your contributions are welcome!</mark>

# What is MetaFlow

MetaFlow is a highly automated observability platform open sourced by [YUNSHAN Network Inc.](https://yunshan.net). It is a full stack, full span and high-performance data engine built for cloud-native observability application developers. With new technologies such as eBPF, WASM and OpenTelemetry, MetaFlow innovatively implements core mechanisms such as AutoTracing, AutoMetrics, AutoTagging and SmartEncoding, helping developers to improve the automation level of code injection, reducing the maintanence complexity of the observability platform. With the programmability and open API of MetaFlow, developers can quickly integrate it into their observability stack.

# Solve Two Problems

Building observability has become a must for cloud-native application developers, yet existing solutions are quietly consuming more and more of developers' time. [A survey by Epsagon](https://thenewstack.io/observability-takes-too-much-developer-time-so-automate-it/) shows that application developers spend up to 30% of their time building observability capabilities, and another 20% on code debugging, which happens to be observability. Caused by insufficient construction.

The pain points of observability construction include two aspects:
- **Difficult to bury the code**:
  - Developers need to consider embedding and coding for each language and each framework. The business development team of some companies is fortunate to have a team like IDP (Internal Developer Platform) responsible for the observability capability building of the entire company, providing SDK for embedding and plugging. However, most languages lack a bytecode injection mechanism similar to JVM. Every SDK upgrade of the IDP team requires the business development team to release and go online synchronously.
  - Developers need to consider how tracing contexts are passed between microservices. It also needs to be embedded and inserted for each language and each framework. On the other hand, protocols such as MQTT 3.X, MySQL, and Redis that lack the Header Option field often become a tracking nightmare. Even if the application protocols all use HTTP, the tracking context may be lost due to special RPC frameworks and special programming languages in the call chain.
  - Developers need to inject a large number of attribute tags for each indicator, tracking, and log data, so that the observation data can be flexibly filtered, grouped, and correlated in the future. However, these tags already exist in the K8s apiserver, service registry, and application protocol headers, and developers have to repeat the work to move them into the observation data.
- **Difficulty in platform operation and maintenance**
  - Developers need to consider how to avoid carrying high-base tags in the metric data. Sometimes, due to the insufficient performance of the back-end TSDB (Time Series Database), the high-base Tag fields can be converted into Metrics, or even discarded.
  - Developers need to consider limiting the rampant growth of observational data, and trade-offs between complex sampling strategies to reduce data volume, but often find that data is incomplete and cannot be performed during a troubleshooting.
  - Developers need to consider how to maintain complex observable platforms, which usually have load balancing and message queue dependencies. As complexity grows, so does the observability capabilities of the observability platform itself.

# Key Features

- **Any Stack**: With the AutoMetrics mechanism implemented by AF\_PACKET, BPF and eBPF technologies, MetaFlow can automatically collect RED (Request, Error, Delay) performance metrics of any application, down to every application call, covering all software technologie stacks from application to infrastructure. In cloud-native environments, the AutoTagging mechanism of MetaFlow automatically discovers the attributes of services, instances and APIs, and automatically injects rich tags into each observation data, thereby eliminating data silos and releasing data drill-down capabilities.
- **End to End**: MetaFlow innovatively implements the AutoTracing mechanism using eBPF technology. It automatically traces the distributed request chain of any microservice and infrastructure service in cloud-native environments. On this basis, through data integration with OpenTelemetry, MetaFlow automatically associates eBPF Event with OTel Span to achieve complete full stack and full span tracing, eliminating any tracing blind spots.
- **High Performance**: The innovative SmartEncoding tag injection mechanism of MetaFlow can improve the storage performance of tag data by 10 times, no more high-based tags and data sampling anxiety. MetaFlow Agent is implemented in Rust for extreme processing performance and memory safety. MetaFlow Server is implemented in Golang, and rewrites standard library map and pool for a nearly 10x performance in data query and memory application.
- **Programmability**: MetaFlow supports parsing HTTP, Dubbo, MySQL, Redis, Kafka and DNS at the moment, and will iterate to support more application protocols. In addition, MetaFlow provides a programmable interface based on WASM technology, allowing developers to parse private protocols quickly, and can be used to construct business analysis capabilities for specific scenarios, such as 5GC signaling analysis, financial transaction analysis, vehicle computer communication analysis, etc.
- **Open Interface**: MetaFlow embraces the open source community, supports a wide range of observability data sources, and uses AutoTagging and SmartEncoding to provide high-performance, unified tag injection capabilities. MetaFlow has a plugable database interface, developers can freely add and replace the most suitable database. MetaFlow provides a unified standard SQL query capability for all observability data upwards, which is convenient for users to quickly integrate into their own observability platform, and also provides the possibility of developing dialect QLs on this basis.
- **Easy to Maintain**: MetaFlow only consists of two components, Agent and Server, hiding the complexity within the process and reduces the maintenance difficulty to the extreme. The MetaFlow Server cluster can manage Agents in multiple resource pools, heterogeneous resource pools and cross-region/cross-AZ resource pools in a unified manner, and can achieve horizontal scaling and load balancing without any external components.

# Mission & Vision

- **Mission**: Make observations more automatic and developers more free.
- **Vision**: To be the first choice for cloud native developers to build observability capabilities.
