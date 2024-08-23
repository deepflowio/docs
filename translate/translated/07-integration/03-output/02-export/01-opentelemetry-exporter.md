---
title: OpenTelemetry Exporter
permalink: /integration/output/export/opentelemetry-exporter
---

> This document was translated by ChatGPT

# Features

By converting the standard OTLP protocol, DeepFlow's Span data can be delivered to external platforms, allowing external teams to supplement and enhance their own observability platforms.

# Span Overview

In DeepFlow, Spans can be categorized as:

- Application Span: Application-level Span data generated using process-level Trace frameworks (Agent/SDK), including custom application Spans, middleware client embedded Spans, communication frameworks, etc. The Trace frameworks here include but are not limited to: Apache SkyWalking Agent, OpenTelemetry Java Agent, and others.
- System Span: Spans collected by DeepFlow through eBPF with zero intrusion, covering system calls, application functions (such as HTTPS), API Gateway, and service mesh Sidecar.
- Network Span: Spans collected by DeepFlow from network traffic using BPF, covering container network components like iptables/ipvs/OvS/LinuxBridge.

# OTel Related

The [OTLP Proto](https://github.com/open-telemetry/opentelemetry-proto/blob/v1.3.1/opentelemetry/proto/trace/v1/trace.proto) can be found here, and the [Trace Semantic Conventions](https://github.com/open-telemetry/semantic-conventions/blob/v1.25.0/docs/general/trace.md) can be seen here. The internal [Resource Semantic Conventions](https://github.com/open-telemetry/semantic-conventions/tree/v1.25.0/docs/resource) can be found here.

# Configuration

```yaml
ingester:
  exporters:
    - protocol: opentelemetry
      enabled: true
      endpoints: [127.0.0.1:4317] # only support protocol grpc
      data-sources:
        - flow_log.l7_flow_log # only support 'flow_log.l7_flow_log'
      queue-count: 4
      queue-size: 100000
      batch-size: 32
      flush-timeout: 10
      tag-filters:
      export-fields:
        - $tag
        - $metrics
        - $k8s.label
      extra-headers:
        key1: value1
        key2: value2
      export-empty-tag: false
      export-empty-metrics-disabled: false
      enum-translate-to-name-disabled: false
      universal-tag-translate-to-name-disabled: false
```

# Detailed Parameter Description

| Field         | Type    | Required | Description                                                                                            |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------ |
| protocol      | string  | Yes      | Fixed value `opentelemetry`                                                                            |
| data-sources  | strings | Yes      | Only supports `flow_log.l7_flow_log`                                                                   |
| endpoints     | strings | Yes      | Remote receiving address, only supports gRPC protocol, randomly selects one that can send successfully |
| batch-size    | int     | No       | Batch size, sends in batches when this value is reached. Default: 32                                   |
| extra-headers | map     | No       | Header fields for remote gRPC requests, such as tokens for authentication, can be added here           |
| export-fields | strings | Yes      | Recommended configuration: [$tag, $metrics, $k8s.label]                                                |

[Detailed Configuration Reference](./exporter-config/)

# General Field Mapping

In Flow_log, there is an internal logic that categorizes all data hierarchically. The mapping here refers to converting the hierarchical [Flow_Log](../../../features/universal-map/request-log/) general fields to standard OTel format data.

### Tracing Info

Span-related data belonging to OTel remains unchanged, while other fields are included in span.attributes.

| Original Field Name       | Mapped Location | Mapped Name                      | Remarks |
| :------------------------ | :-------------- | :------------------------------- | :------ |
| x_request_id              | span.attributes | df.span.x_request_id             |         |
| syscall_trace_id_request  | span.attributes | df.span.syscall_trace_id_request |         |
| syscall_trace_id_response | span.attributes | df.span.syscall_thread_0         |         |
| syscall_thread_0          | span.attributes | df.span.syscall_thread_0         |         |
| syscall_thread_1          | span.attributes | df.span.syscall_thread_1         |         |
| syscall_cap_seq_0         | span.attributes | df.span.syscall_cap_seq_0        |         |
| syscall_cap_seq_1         | span.attributes | df.span.syscall_cap_seq_1        |         |

### Service Info

Service application-level information, all included in resource.attributes, including application-related, process, and thread-related information. For special requirements regarding process and thread-related information, please use OTel Processor for conversion.

| Original Field Name | Mapped Location     | Mapped Name         | Remarks        |
| :------------------ | :------------------ | :------------------ | :------------- |
| auto_service        | resource.attributes | service.name        | Standard field |
| auto_instance       | resource.attributes | service.instance.id | Standard       |
| process_id          | resource.attributes | process.pid         |                |
| process_kname       | resource.attributes | thread.name         |                |

### Flow Info

Including fields: \_id, time, flow_id, start_time, end_time, close_type, status, is_new_flow.

| Original Field Name | Mapped Location           | Mapped Name               | Remarks                                                               |
| :------------------ | :------------------------ | :------------------------ | :-------------------------------------------------------------------- |
| \_id                | resource.attributes       | df.flow_info.id           |                                                                       |
| time                | resource.attributes       | df.flow_info.time         |                                                                       |
| flow_id             | resource.attributes       | df.flow_info.flow_id      |                                                                       |
| start_time          | span.start_time_unix_nano | span.start_time_unix_nano | Note time format conversion, will be converted to OTel-compliant time |
| end_time            | span.end_time_unix_nano   | span.end_time_unix_nano   | Note time format conversion, will be converted to OTel-compliant time |

### Capture Info

Including fields: signal_source, agent, nat_source, capture_nic, capture_nic_name, capture_nic_type, observation_point, l2_end, l3_end, has_pcap, nat_real_ip, nat_real_port

| Original Field Name | Mapped Location     | Mapped Name                       | Remarks |
| :------------------ | :------------------ | :-------------------------------- | :------ |
| signal_source       | resource.attributes | df.capture_info.signal_source     |         |
| agent               | resource.attributes | df.capture_info.agent             |         |
| nat_source          | resource.attributes | df.capture_info.nat_source        |         |
| capture_nic         | resource.attributes | df.capture_info.capture_nic       |         |
| capture_nic_name    | resource.attributes | df.capture_info.capture_nic_name  |         |
| capture_nic_type    | resource.attributes | df.capture_info.capture_nic_type  |         |
| observation_point   | resource.attributes | df.capture_info.observation_point |         |

### Universal Tag

Including fields: region, az, host, chost, vpc, l2_vpc, subnet, router, dhcpgw, lb, lb_listener, natgw, pod_cluster, pod_ns, pod_node, pod_ingress, pod_service, pod_group, pod, service, auto_service, auto_service_type, auto_instance, auto_instance_type

For necessary conversions, please use OTel Processor.

| Original Field Name | Mapped Location     | Mapped Name                         | Remarks                                                                                                      |
| :------------------ | :------------------ | :---------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| region              | resource.attributes | df.universal_tag.region             |                                                                                                              |
| az                  | resource.attributes | df.universal_tag.az                 |                                                                                                              |
| host                | resource.attributes | df.universal_tag.host               |                                                                                                              |
| chost               | resource.attributes | df.universal_tag.chost              |                                                                                                              |
| vpc                 | resource.attributes | df.universal_tag.vpc                |                                                                                                              |
| l2_vpc              | resource.attributes | df.universal_tag.l2_vpc             |                                                                                                              |
| subnet              | resource.attributes | df.universal_tag.subnet             |                                                                                                              |
| router              | resource.attributes | df.universal_tag.router             |                                                                                                              |
| dhcpgw              | resource.attributes | df.universal_tag.dhcpgw             |                                                                                                              |
| lb                  | resource.attributes | df.universal_tag.lb                 |                                                                                                              |
| lb_listener         | resource.attributes | df.universal_tag.lb_listener        |                                                                                                              |
| natgw               | resource.attributes | df.universal_tag.natgw              |                                                                                                              |
| pod_cluster         | resource.attributes | df.universal_tag.pod_cluster        | According to the official documentation, this should be k8s.pod_cluster, convert if necessary                |
| pod_ns              | resource.attributes | df.universal_tag.pod_ns             | According to the official documentation, this should be k8s.pod_ns, convert if necessary                     |
| pod_node            | resource.attributes | df.universal_tag.pod_node           | According to the official documentation, this should be k8s.pod_node, convert if necessary                   |
| pod_ingress         | resource.attributes | df.universal_tag.pod_ingress        | According to the official documentation, this should be k8s.pod_ingress, convert if necessary                |
| pod_service         | resource.attributes | df.universal_tag.pod_service        | According to the official documentation, this should be k8s.pod_service, convert if necessary                |
| pod_group           | resource.attributes | df.universal_tag.pod_group          | According to the official documentation, this should be k8s.pod_group, convert if necessary                  |
| pod                 | resource.attributes | df.universal_tag.pod                | According to the official documentation, this should be k8s.pod.xxx, semantics unclear, convert if necessary |
| pod_cluster         | resource.attributes | df.universal_tag.pod_cluster        | According to the official documentation, this should be k8s.pod_cluster, convert if necessary                |
| service             | resource.attributes | df.universal_tag.service            |                                                                                                              |
| auto_service        | resource.attributes | df.universal_tag.auto_service       |                                                                                                              |
| auto_service_type   | resource.attributes | df.universal_tag.auto_service_type  |                                                                                                              |
| auto_instance       | resource.attributes | df.universal_tag.auto_instance      |                                                                                                              |
| auto_instance_type  | resource.attributes | df.universal_tag.auto_instance_type |                                                                                                              |

### Custom Tag

| Original Field Name | Mapped Location     | Mapped Name                  | Remarks |
| :------------------ | :------------------ | :--------------------------- | :------ |
| k8s.labels.xxx      | resource.attributes | df.custom_tag.k8s.labels.xxx |         |

### Network Layer

| Original Field Name | Mapped Location     | Mapped Name                                 | Remarks        |
| :------------------ | :------------------ | :------------------------------------------ | :------------- |
| ip                  | resource.attributes | df.network.ip                               |                |
| is_ipv4             | resource.attributes | df.network.is_ipv4                          |                |
| is_internet         | resource.attributes | df.network.is_internet                      |                |
| protocol            | resource.attributes | net.transport = ip\_(lowercase ${protocol}) | Standard field |

### Transport Layer

| Original Field Name | Mapped Location     | Mapped Name                     | Remarks |
| :------------------ | :------------------ | :------------------------------ | :------ |
| client_port         | resource.attributes | df.transport.client_port        |         |
| server_port         | resource.attributes | df.transport.server_port        |         |
| tcp_flags_bit       | resource.attributes | df.transport.tcp_flags_bit      |         |
| syn_seq             | resource.attributes | df.transport.syn_seq            |         |
| syn_ack_seq         | resource.attributes | df.transport.syn_ack_seq        |         |
| last_keepalive_seq  | resource.attributes | df.transport.last_keepalive_seq |         |
| last_keepalive_ack  | resource.attributes | df.transport.last_keepalive_ack |         |
| req_tcp_seq         | resource.attributes | df.transport.req_tcp_seq        |         |
| resp_tcp_seq        | resource.attributes | df.transport.resp_tcp_seq       |         |

### Application Layer

| Original Field Name | Mapped Location     | Mapped Name                | Remarks               |
| :------------------ | :------------------ | :------------------------- | :-------------------- |
| l7_protocol         | resource.attributes | df.application.l7_protocol | Field mapping details |

# Protocol Field Mapping

Here, special mappings of protocol-specific fields to OTLP standard fields are supplemented (general fields can be found above):

## Application Protocol Additional Fields

The following fields apply to all application layer protocols:

| Original Field Name | Mapped Location     | Mapped Name                              | Remarks                                                                |
| :------------------ | :------------------ | :--------------------------------------- | :--------------------------------------------------------------------- |
| None                | resource.attributes | telemetry.sdk.name=deepflow              | Custom                                                                 |
| None                | resource.attributes | telemetry.sdk.version=${current version} | Custom                                                                 |
| chost_0/pod_node_0  | span.attributes     | net.host.name                            | Standard, first get chost_x, if not present, try to get pod_node_x     |
| chost_1/pod_node_1  | span.attributes     | net.peer.name                            | Standard, first get chost_x, if not present, try to get pod_node_x     |
| client_port         | span.attributes     | net.host.port                            | Standard                                                               |
| server_port         | span.attributes     | net.peer.port                            | Standard                                                               |
| ip_0                | span.attributes     | net.sock.host.addr                       | Standard                                                               |
| ip_1                | span.attributes     | net.sock.peer.addr                       | Standard                                                               |
| response_status     | span.status         | span.status                              | 0: OK -> Ok; server error, client error -> Error; not present -> Unset |

## HTTP Protocol Suite

### HTTP

| Original Field Name | Mapped Location | Mapped Name                                    | Remarks                          |
| :------------------ | :-------------- | :--------------------------------------------- | :------------------------------- |
| version             | span.attributes | http.flavor                                    | Standard field                   |
| request_type        | span.attributes | http.method                                    | Standard field                   |
| request_domain      | span.attributes | net.peer.name                                  | Standard field                   |
| request_resource    | span.attributes | df.http.path                                   | Custom                           |
| request_id          | span.attributes | df.global.request_id                           | Custom                           |
| response_code       | span.attributes | http.status_code                               | Standard field                   |
| response_exception  | span.event      | event.name                                     | Standard field                   |
| http_proxy_client   | span.attributes | df.http.proxy_client                           | Custom                           |
| None                | span.name       | span.name= ${request_type} + ${request_source} | Standard field, space in between |

### HTTP2

TODO

## RPC Protocol Suite

### Dubbo

| Original Field Name | Mapped Location | Mapped Name                                                         | Remarks                                                     |
| :------------------ | :-------------- | :------------------------------------------------------------------ | :---------------------------------------------------------- |
| None                | span.attributes | rpc.system=apache_dubbo                                             | Standard field                                              |
| None                | span.attributes | rpc.service=${request_resource}                                     | Standard field                                              |
| None                | span.attributes | rpc.method=${request_type}                                          | Standard field                                              |
| None                | span.attributes | span.name= ${request_source} + "/" + ${request_type} == ${endpoint} | Standard field, prioritize concatenation                    |
| response_exception  | span.event      | event.name                                                          | Standard field                                              |
| request_domain      | span.attributes | df.dubbo.request_domain                                             | If not obtainable, use net.peer.name as an additional field |
| version             | span.attributes | df.dubbo.version                                                    | Custom                                                      |
| request_id          | span.attributes | df.global.request_id                                                | Custom                                                      |
| response_code       | span.attributes | df.response_code                                                    | Custom                                                      |

### gRPC

| Original Field Name | Mapped Location | Mapped Name                                                         | Remarks                                                     |
| :------------------ | :-------------- | :------------------------------------------------------------------ | :---------------------------------------------------------- |
| None                | span.attributes | rpc.system=grpc                                                     | Standard field                                              |
| None                | span.attributes | rpc.system=${request_resource}                                      | Standard field                                              |
| None                | span.attributes | rpc.system=${request_type}                                          | Standard field                                              |
| None                | span.attributes | span.name= ${request_source} + "/" + ${request_type} == ${endpoint} | Standard field                                              |
| response_exception  | span.event      | event.name                                                          | Standard field                                              |
| version             | span.attributes | http.flavor                                                         | Standard field                                              |
| request_domain      | span.attributes | df.grpc.request_domain                                              | If not obtainable, use net.peer.name as an additional field |
| request_id          | span.attributes | df.global.request_id                                                | Custom                                                      |

### SOFARPC

TODO

### FastCGI

TODO

## SQL Protocol Suite

### MySQL

| Original Field Name | Mapped Location | Mapped Name                             | Remarks                                     |
| :------------------ | :-------------- | :-------------------------------------- | :------------------------------------------ |
| None                | span.attributes | db.system==mysql                        | Standard                                    |
| None                | span.attributes | db.operation=${C/R/U/D}                 | Standard field                              |
| None                | span.attributes | db.statement=${request_resource}        | Standard field                              |
| request_type        | span.attributes | df.mysql.request_type                   | Custom: db.operation defined as SQL keyword |
| response_exception  | span.event      | event.name                              | Standard field                              |
| None                | span.name       | span.name=${C/R/U/D} + ${db} + ${table} | Standard field                              |

### PostgreSQL

| Original Field Name | Mapped Location | Mapped Name                             | Remarks                                     |
| :------------------ | :-------------- | :-------------------------------------- | :------------------------------------------ |
| None                | span.attributes | db.system==postgresql                   | Standard                                    |
| None                | span.attributes | db.operation=${C/R/U/D}                 | Standard field                              |
| None                | span.attributes | db.statement=${request_resource}        | Standard field                              |
| request_type        | span.attributes | df.postgresql.request_type              | Custom: db.operation defined as SQL keyword |
| response_exception  | span.event      | event.name                              | Standard field                              |
| None                | span.name       | span.name=${C/R/U/D} + ${db} + ${table} | Standard field                              |

## NoSQL Protocol Suite

### Redis

| Original Field Name | Mapped Location | Mapped Name                      | Remarks        |
| :------------------ | :-------------- | :------------------------------- | :------------- |
| None                | span.attributes | db.system==redis                 | Custom         |
| None                | span.attributes | db.operation=${request_type}     | Standard field |
| None                | span.attributes | db.statement=${request_resource} | Standard field |
| response_exception  | span.event      | event.name                       | Standard field |
| None                | span.name       | span.name=${request_type}        | Standard field |

### MongoDB

| Original Field Name | Mapped Location | Mapped Name                      | Remarks        |
| :------------------ | :-------------- | :------------------------------- | :------------- |
| None                | span.attributes | db.system==mongodb               | Custom         |
| None                | span.attributes | db.operation=${request_type}     | Standard field |
| None                | span.attributes | db.statement=${request_resource} | Standard field |
| response_exception  | span.event      | event.name                       | Standard field |
| None                | span.name       | span.name=${request_type}        | Standard field |

## Messaging Protocols

### Kafka

| Original Field Name | Mapped Location | Mapped Name                | Remarks        |
| :------------------ | :-------------- | :------------------------- | :------------- |
| None                | span.attributes | messaging.system=kafka     | Standard       |
| None                | span.name       | span.name=${request_type}  | Non-standard   |
| request_type        | span.attributes | df.kafka.request_type      | Custom         |
| request_id          | span.attributes | df.global.request_id       | Custom         |
| request_resource    | span.attributes | df.global.request_resource | Custom         |
| request_domain      | span.attributes | df.kafka.request_domain    | Custom         |
| response_code       | span.attributes | df.kafka.response_code     | Custom         |
| response_exception  | span.event      | event.name                 | Standard field |

### MQTT

| Original Field Name | Mapped Location | Mapped Name                                                  | Remarks                                                                 |
| :------------------ | :-------------- | :----------------------------------------------------------- | :---------------------------------------------------------------------- |
| None                | span.attributes | messaging.system=mqtt                                        | Standard                                                                |
| None                | span.attributes | messaging.operation=${request_type}                          | Standard: PUBLISH -> publish, SUBSCRIBE -> process, others filtered out |
| None                | span.name       | span.name=${request_resource} + " " + ${messaging.operation} | Standard                                                                |
| request_type        | span.attributes | df.mqtt.request_type                                         | Custom                                                                  |
| request_resource    | span.attributes | df.mqtt.request_resource                                     | Custom                                                                  |
| request_domain      | span.attributes | df.mqtt.request_domain                                       | Custom                                                                  |
| response_code       | span.attributes | df.mqtt.response_code                                        | Custom                                                                  |
| response_exception  | span.event      | event.name                                                   | Standard field                                                          |

## Network Protocols

### DNS

| Original Field Name | Mapped Location | Mapped Name             | Remarks        |
| :------------------ | :-------------- | :---------------------- | :------------- |
| request_type        | span.attributes | df.dns.request_type     | Custom         |
| request_resource    | span.attributes | df.dns.request_resource | Custom         |
| request_id          | span.attributes | df.global.request_id    | Custom         |
| response_code       | span.attributes | df.dns.response_code    | Custom         |
| response_exception  | span.event      | event.name              | Standard field |
| response_result     | span.attributes | df.dns.response_result  | Custom         |
