> This document was translated by GPT-4

---

title: AutoMetrics
permalink: /features/universal-map/auto-metrics

---

# Introduction

In the past, we usually inserted statistical codes actively through SDK, bytecode enhancement, or manual embedment, which placed a heavy burden on application developers who needed to adapt to various development languages and types of RPC frameworks. Rapid business iteration often left developers noticing the lack of necessary performance indexes for their services only when troubleshooting. Furthermore, maintenance staff for basic services like Nginx, MySQL, and others were even more passive, having only to hope that the basic service software already exposed key performance indicators. Yet, built-in indicators were often only meticulous down to the instance granularity, unable to differentiate user calls.

DeepFlow's **AutoMetrics** ability can automatically acquire the golden performance indicators of each microservice's API call on the full-stack paths including application functions, system functions, and network communication, and through BPF and AF_PACKET/winpcap expands these abilities to a wider range of Linux kernel versions and Windows operating systems.

At present, DeepFlow has supported the parsing of mainstream application protocols through eBPF, including HTTP 1/2, HTTPS (Golang/openssl), Dubbo, gRPC, SOFARPC, FastCGI, MySQL, PostgreSQL, Redis, MongoDB, Kafka, MQTT, and DNS, and will expand support for more application protocols in the future. Based on DeepFlow's AutoMetrics ability, we can acquire RED( Request, Error, Delay) indicators, throughput, latency, connection exceptions, retransmission, zero window, and other indicators of application and network protocol stack without any disturbance. DeepFlow Agent maintains each TCP connection and each application protocol Request's session status, referred to as `Flow`. All original performance indicator data is detailed to the granularity of Flow, and automatically aggregated to generate 1s and 1min indicator data. Based on these indicator data, we can present full-stack performance data of any service, workload, and API, and can draw a universal map (Universal Map) among any services.

# Types of Indicators

- [Application Performance Indicators](./application-metrics/)
- [Application Call Logs](./request-log/)
- [Network Performance Indicators](./network-metrics/)
- [Network Flow Logs](./flow-log/)

To get a more intuitive feel for the capabilities of AutoMetrics, if there is no operational traffic in your DeepFlow environment, it is recommended to first deploy an official microservice Demo application from OpenTelemetry, referring to the section [Experience Based on OpenTelemetry WebStore Demo - Deployment Demo](../../integration/input/tracing/opentelemetry/#部署-demo-2). This Demo is composed of more than a dozen microservices implemented in languages such as Go, C#, Node.js, Python, and Java. It is specifically mentioned that all the indicator data shown in this chapter have `no dependency on OpenTelemetry`.

# Explanation for Statistics Location

DeepFlow automatically collects indicator data from various locations through cBPF/eBPF. To distinguish the collection locations of these data, we use the `tap_side` label to annotate the data.

For data collected by cBPF, the meanings of the `tap_side` values are as follows:
| Data Source Type | `tap_side` Value | Data Collection Location |
| ---------- | --------------- | -------------------- |
| cBPF | c | Client network card |
| cBPF | c-nd | Client container node |
| cBPF | c-hv | Client host |
| cBPF | c-gw-hv | Client to gateway host |
| cBPF | c-gw | Client to gateway |
| cBPF | local | Local network card |
| cBPF | rest | Other network cards |
| cBPF | s-gw | Gateway to server |
| cBPF | s-gw-hv | Gateway host to server |
| cBPF | s-hv | Server host |
| cBPF | s-nd | Server container node |
| cBPF | s | Server network card |

For data collected by eBPF, the meanings of the `tap_side` values are as follows:
| Data Source Type | `tap_side` Value | Data Collection Location |
| ---------- | --------------- | -------------------- |
| eBPF | c-p | Client process |
| eBPF | s-p | Server process |

In addition, after [integrating OpenTelemetry data](../../integration/input/tracing/opentelemetry/), we will also inject `tap_side` tags, the meanings of the values are as follows:
| Data Source Type | `tap_side` Value | Data Collection Location |
| ---------- | --------------- | -------------------- |
| OTel | c-app | Client Application corresponds to `span.spankind = SPAN_KIND_CLIENT, SPAN_KIND_PRODUCER` |
| OTel | s-app | Server application corresponds to `span.spankind = SPAN_KIND_SERVER, SPAN_KIND_CONSUMER` |
| OTel | app | Application corresponds to other spankind |
