---
title: OpenTelemetry Exporter
permalink: /integration/output/export/opentelemetry-exporter
---

> This document was translated by GPT-4

# Features

The function of OpenTelemetry exporter is to transport the Span data of DeepFlow to external platforms after transforming through the standard OTLP protocol. This allows external teams to supplement and improve their observability platforms.

# Span Overview

Within DeepFlow, Spans can be categorized into:

- Application Spans: Application-level Span data generated using process-level Trace frameworks (Agent/SDK), including custom application Spans, middleware client embedded Spans, communication frameworks and more. The Trace frameworks here include but are not limited to Apache SkyWalking Agent, OpenTelemetry Java Agent and others.
- System Spans: Spans collected by DeepFlow through instrumentation-free eBPF, covering system calls, application functions (such as HTTPS), API Gateways, Service Mesh Sidecar, etc.
- Network Spans: Spans collected by DeepFlow from network traffic through BPF, covering container network components like iptables/ipvs/OvS/LinuxBridge, etc.

# Relevance of OTel

You can find the [OTLP Proto](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/trace/v1/trace.proto) here. As for the internal [Trace Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) and [Resource Semantic Conventions](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/resource/semantic_conventions), you can read them here.

# Configuration

```yaml
ingester:
  exporters:
    enabled: true
    export-datas: [cbpf-net-span, ebpf-sys-span]
    export-data-types:
      [
        service_info,
        tracing_info,
        network_layer,
        flow_info,
        transport_layer,
        application_layer,
        metrics,
      ]
    export-custom-k8s-labels-regexp:
    export-only-with-traceid: false
    otlp-exporters:
      - enabled: true
        addr: 127.0.0.1:4317
        queue-count: 4
        queue-size: 1000000
        export-batch-count: 32
        export-datas: [cbpf-net-span, ebpf-sys-span]
        export-data-types:
          [
            service_info,
            tracing_info,
            network_layer,
            flow_info,
            transport_layer,
            application_layer,
            metrics,
          ]
        export-custom-k8s-labels-regexp:
        export-only-with-traceid: false
        grpc-headers:
          ${key1}: ${value1}
          ${key2}: ${value2}
```

Information about [detailed configuration](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml#L474).

# Field Mapping

There are a set of internal logic in Flow_log that classifies all data based on levels. The mapping here refers to converting common fields from layered [Flow Logs](../../../features/universal-map/request-log/) to the standard OTel data format.

### Tracing Info

Fields belonging to OTel Span remain unchanged, while other fields are sorted into span.attributes.

| Original Field            | Mapped Location | Mapped Name                      | Remarks |
| :------------------------ | :-------------- | :------------------------------- | :------ |
| x_request_id              | span.attributes | df.span.x_request_id             |         |
| syscall_trace_id_request  | span.attributes | df.span.syscall_trace_id_request |         |
| syscall_trace_id_response | span.attributes | df.span.syscall_thread_0         |         |
| syscall_thread_0          | span.attributes | df.span.syscall_thread_0         |         |
| syscall_thread_1          | span.attributes | df.span.syscall_thread_1         |         |
| syscall_cap_seq_0         | span.attributes | df.span.syscall_cap_seq_0        |         |
| syscall_cap_seq_1         | span.attributes | df.span.syscall_cap_seq_1        | Note:   |

### Service Info

Service level application information, all sorted into resource.attributes. This includes application-related information and process and thread-related information. If there is a special requirement for process and thread-related information, please use the OTel Processor for conversion.

| Original Field | Mapped Location     | Mapped Name         | Remarks        |
| :------------- | :------------------ | :------------------ | :------------- |
| auto_service   | resource.attributes | service.name        | Standard field |
| auto_instance  | resource.attributes | service.instance.id | Standard       |
| process_id     | resource.attributes | process.pid         | Note:          |
| process_kname  | resource.attributes | thread.name         | Note:          |

### Flow Info

Includes fields: \_id, time, flow_id, start_time, end_time, close_type, status, is_new_flow.

| Original Field | Mapped Location           | Mapped Name               | Remarks                                                                                                    |
| :------------- | :------------------------ | :------------------------ | :--------------------------------------------------------------------------------------------------------- |
| \_id           | resource.attributes       | df.flow_info.id           |                                                                                                            |
| time           | resource.attributes       | df.flow_info.time         |                                                                                                            |
| flow_id        | resource.attributes       | df.flow_info.flow_id      |                                                                                                            |
| start_time     | span.start_time_unix_nano | span.start_time_unix_nano | Be careful with the time format conversion, as it will be converted to the time format complying with OTel |
| end_time       | span.end_time_unix_nano   | span.end_time_unix_nano   | Be careful with the time format conversion, as it will be converted to the time format complying with OTel |

### Capture Info

Fields include: signal_source, tap, nat_source, tap_port, tap_port_name, tap_port_type, tap_side, l2_end, l3_end, has_pcap, nat_real_ip, nat_real_port

| Original Field | Mapped Location     | Mapped Name                   | Remarks |
| :------------- | :------------------ | :---------------------------- | :------ |
| signal_source  | resource.attributes | df.capture_info.signal_source |         |
| tap            | resource.attributes | df.capture_info.tap           |         |
| vtap           | resource.attributes | df.capture_info.vtap          |         |
| nat_source     | resource.attributes | df.capture_info.nat_source    |         |
| tap_port       | resource.attributes | df.capture_info.tap_port      |         |
| tap_port_name  | resource.attributes | df.capture_info.tap_port_name |         |
| tap_port_type  | resource.attributes | df.capture_info.tap_port_type |         |
| tap_side       | resource.attributes | df.capture_info.tap_side      |         |

### Universal Tag

Includes fields: region, az, host, chost, vpc, l2_vpc, subnet, router, dhcpgw, lb, lb_listener, natgw, pod_cluster, pod_ns, pod_node, pod_ingress, pod_service, pod_group, pod, service, resource_gl0_type, resource_gl0, resource_gl1_type, resource_gl1, resource_gl2_type, resource_gl2.

If necessary, please use the OTel Processor for format conversion.

| Original Field     | Mapped Location     | Mapped Name                         | Remarks |
| :----------------- | :------------------ | :---------------------------------- | :------ |
| host               | resource.attributes | df.universal_tag.host               |         |
| chost              | resource.attributes | df.universal_tag.chost              |         |
| vpc                | resource.attributes | df.universal_tag.vpc                |         |
| l2_vpc             | resource.attributes | df.universal_tag.l2_vpc             |         |
| subnet             | resource.attributes | df.universal_tag.subnet             |         |
| router             | resource.attributes | df.universal_tag.router             |         |
| service            | resource.attributes | df.universal_tag.service            |         |
| auto_service       | resource.attributes | df.universal_tag.auto_service       |         |
| auto_service_type  | resource.attributes | df.universal_tag.auto_service_type  |         |
| auto_instance      | resource.attributes | df.universal_tag.auto_instance      |         |
| auto_instance_type | resource.attributes | df.universal_tag.auto_instance_type |         |

### Custom Tag

| Original Field | Mapped Location     | Mapped Name                  | Remarks |
| :------------- | :------------------ | :--------------------------- | :------ |
| k8s.labels.xxx | resource.attributes | df.custom_tag.k8s.labels.xxx | Note:   |

### Network Layer

| Original Field | Mapped Location     | Mapped Name                                 | Remarks  |
| :------------- | :------------------ | :------------------------------------------ | :------- |
| ip             | resource.attributes | df.network.ip                               |          |
| is_ipv4        | resource.attributes | df.network.is_ipv4                          |          |
| is_internet    | resource.attributes | df.network.is_internet                      |          |
| protocol       | resource.attributes | net.transport = ip\_(lowercase ${protocol}) | Standard |

### Transport Layer

| Original Field Name | Mapped Location     | Mapped Name                     | Remarks  |
| :------------------ | :------------------ | :------------------------------ | :------- |
| client_port         | resource.attributes | df.transport.client_port        |          |
| server_port         | resource.attributes | df.transport.server_port        |          |
| tcp_flags_bit       | resource.attributes | df.transport.tcp_flags_bit      |          |
| syn_seq             | resource.attributes | df.transport.syn_seq            |          |
| syn_ack_seq         | resource.attributes | df.transport.syn_ack_seq        |          |
| last_keepalive_seq  | resource.attributes | df.transport.last_keepalive_seq |          |
| last_keepalive_ack  | resource.attributes | df.transport.last_keepalive_ack | Remarks: |
| req_tcp_seq         | resource.attributes | df.transport.req_tcp_seq        |          |
| resp_tcp_seq        | resource.attributes | df.transport.resp_tcp_seq       |          |

### Application Layer

| Original Field Name | Mapped Location     | Mapped Name                | Remarks                            |
| :------------------ | :------------------ | :------------------------- | :--------------------------------- |
| l7_protocol         | resource.attributes | df.application.l7_protocol | Detailed field mapping description |

# Protocol Field Equivalent Conversion

Special supplements are made here for the mapping of special fields of each protocol to OTLP standard fields (please refer to the above for common fields):

## Additional Fields for Application Protocols

The following fields apply to all application layer protocols:

| Original Field Name | Mapped Location     | Mapped Name                              | Remarks                                                                     |
| :------------------ | :------------------ | :--------------------------------------- | :-------------------------------------------------------------------------- |
| None                | resource.attributes | telemetry.sdk.name=deepflow              | Custom                                                                      |
| None                | resource.attributes | telemetry.sdk.version=${current_version} | Custom                                                                      |
| chost_0/pod_node_0  | span.attributes     | net.host.name                            | Standard, first try to get chost_x, if not present then try pod_node_x      |
| chost_1/pod_node_1  | span.attributes     | net.peer.name                            | Standard, first try to get chost_x, if not present then try pod_node_x      |
| client_port         | span.attributes     | net.host.port                            | Standard                                                                    |
| server_port         | span.attributes     | net.peer.port                            | Standard                                                                    |
| ip_0                | span.attributes     | net.sock.host.addr                       | Standard                                                                    |
| ip_1                | span.attributes     | net.sock.peer.addr                       | Standard                                                                    |
| response_status     | span.status         | span.status                              | 0: Normal -> Ok; 1: Server, Client Exception -> Error; Not present -> Unset |

## HTTP Protocol Family

### HTTP

| Original Field Name | Mapped Location | Mapped Name                                    | Remarks                                 |
| :------------------ | :-------------- | :--------------------------------------------- | :-------------------------------------- |
| version             | span.attributes | http.flavor                                    | Standard field                          |
| request_type        | span.attributes | http.method                                    | Standard field                          |
| request_domain      | span.attributes | net.peer.name                                  | Standard field                          |
| request_resource    | span.attributes | df.http.path                                   | Custom                                  |
| request_id          | span.attributes | df.global.request_id                           | Custom                                  |
| response_code       | span.attributes | http.status_code                               | Standard field                          |
| response_exception  | span.event      | event.name                                     | Standard field                          |
| http_proxy_client   | span.attributes | df.http.proxy_client                           | Custom                                  |
| None                | span.name       | span.name= ${request_type} + ${request_source} | Standard field with space in the middle |

### HTTP2

TODO

## RPC Protocol Family

### Dubbo

| Original Field Name | Mapped Location | Mapped Name                                                         | Remarks                                                     |
| :------------------ | :-------------- | :------------------------------------------------------------------ | :---------------------------------------------------------- |
| None                | span.attributes | rpc.system=apache_dubbo                                             | Standard field                                              |
| None                | span.attributes | rpc.service=${request_resource}                                     | Standard field                                              |
| None                | span.attributes | rpc.method=${request_type}                                          | Standard field                                              |
| None                | span.attributes | span.name= ${request_source} + "/" + ${request_type} == ${endpoint} | Standard field, prioritize concatenation                    |
| response_exception  | span.event      | event.name                                                          | Standard field                                              |
| request_domain      | span.attributes | df.dubbo.request_domain                                             | If not available, use neet.peer.name as an additional field |
| version             | span.attributes | df.dubbo.version                                                    | Custom                                                      |
| request_id          | span.attributes | df.global.request_id                                                | Custom                                                      |
| response_code       | span.attributes | df.response_code                                                    | Custom                                                      |

### gRPC

| Original Field Name | Mapped Location | Mapped Name                                                         | Remarks        |
| :------------------ | :-------------- | :------------------------------------------------------------------ | :------------- |
| None                | span.attributes | rpc.system=grpc                                                     | Standard field |
| None                | span.attributes | rpc.system=${request_resource}                                      | Standard field |
| None                | span.attributes | rpc.system=${request_type}                                          | Standard field |
| None                | span.attributes | span.name= ${request_source} + "/" + ${request_type} == ${endpoint} | Standard field |

| response

\_exception | span.event | event.name | Standard field |
| version | span.attributes | http.flavor | Standard field |
| request_domain | span.attributes | df.grpc.request_domain | If not available, use neet.peer.name as an additional field |
| request_id | span.attributes | df.global.request_id | Custom |

### SOFARPC

TODO

### FastCGI

TODO

## SQL Protocol Suite

### MySQL

| Original Field Name | Mapped Location | Mapped Name                             | Remarks                                        |
| :------------------ | :-------------- | :-------------------------------------- | :--------------------------------------------- |
| None                | span.attributes | db.system==mysql                        | Standard                                       |
| None                | span.attributes | db.operation=${C/R/U/D}                 | Standard field                                 |
| None                | span.attributes | db.statement=${request_resource}        | Standard field                                 |
| request_type        | span.attributes | df.mysql.request_type                   | Custom: Defined as SQL keyword in db.operation |
| response_exception  | span.event      | event.name                              | Standard field                                 |
| None                | span.name       | span.name=${C/R/U/D} + ${db} + ${table} | Standard field                                 |

### PostgreSQL

| Original Field Name | Mapped Location | Mapped Name                             | Remarks                                        |
| :------------------ | :-------------- | :-------------------------------------- | :--------------------------------------------- |
| None                | span.attributes | db.system==postgresql                   | Standard                                       |
| None                | span.attributes | db.operation=${C/R/U/D}                 | Standard field                                 |
| None                | span.attributes | db.statement=${request_resource}        | Standard field                                 |
| request_type        | span.attributes | df.postgresql.request_type              | Custom: Defined as SQL keyword in db.operation |
| response_exception  | span.event      | event.name                              | Standard field                                 |
| None                | span.name       | span.name=${C/R/U/D} + ${db} + ${table} | Standard field                                 |

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

## Message Queue Protocol Suite

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

| Original Field Name | Mapped Location | Mapped Name                                                  | Remarks                                                                     |
| :------------------ | :-------------- | :----------------------------------------------------------- | :-------------------------------------------------------------------------- |
| None                | span.attributes | messaging.system=mqtt                                        | Standard                                                                    |
| None                | span.attributes | messaging.operation=${request_type}                          | Standard. Where: PUBLISH -> publish, SUBSCRIBE -> process, others discarded |
| None                | span.name       | span.name=${request_resource} + " " + ${messaging.operation} | Standard                                                                    |
| request_type        | span.attributes | df.mqtt.request_type                                         | Custom                                                                      |
| request_resource    | span.attributes | df.mqtt.request_resource                                     | Custom                                                                      |
| request_domain      | span.attributes | df.mqtt.request_domain                                       | Custom                                                                      |
| response_code       | span.attributes | df.mqtt.response_code                                        | Custom                                                                      |
| response_exception  | span.event      | event.name                                                   | Standard field                                                              |

## Network Protocol Suite

### DNS

| Original Field Name | Mapped Location | Mapped Name             | Remarks        |
| :------------------ | :-------------- | :---------------------- | :------------- |
| request_type        | span.attributes | df.dns.request_type     | Custom         |
| request_resource    | span.attributes | df.dns.request_resource | Custom         |
| request_id          | span.attributes | df.global.request_id    | Custom         |
| response_code       | span.attributes | df.dns.response_code    | Custom         |
| response_exception  | span.event      | event.name              | Standard field |
| response_result     | span.attributes | df.dns.response_result  | Custom         |
