> This document was translated by GPT-4

---

title: OpenTelemetry Exporter
permalink: /integration/output/export/opentelemetry-exporter

---

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

| Original Field     | Mapped Location     | Mapped Name                     | Remarks |
| :----------------- | :------------------ | :------------------------------ | :------ |
| client_port        | resource.attributes | df.transport.client_port        |         |
| server_port        | resource.attributes | df.transport.server_port        |         |
| tcp_flags_bit      | resource.attributes | df.transport.tcp_flags_bit      |         |
| syn_seq            | resource.attributes | df.transport.syn_seq            |         |
| syn_ack_seq        | resource.attributes | df.transport.syn_ack_seq        |         |
| last_keepalive_seq | resource.attributes | df.transport.last_keepalive_seq |         |
| last_keepalive_ack | resource.attributes | df.transport.last_keepalive_ack | Note:   |
| req_tcp_seq        | resource.attributes | df.transport.req_tcp_seq        |
