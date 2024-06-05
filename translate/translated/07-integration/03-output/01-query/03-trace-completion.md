---
title: Trace Completion API
permalink: /integration/output/query/trace-completion
---

> This document was translated by ChatGPT

# Introduction

APM (Application Performance Management) focuses mainly on code and does not possess the ability to view issues from a full-stack multi-dimensional perspective without any blind spots. Additionally, due to the hindering effect of instrumentation, it often fails to cover all services. DeepFlow leverages the zero-instrumentation, full-coverage data collection of eBPF for distributed tracing, and associates this with the generation of call-chains. In scenarios where DeepFlow and APM are configured to operate independently of each other, they can function in harmony through the use of a loosely coupled methodology. This involves using DeepFlow's Trace Completion API to enhance APM's call chains, eliminating blind spots in APM for cloud-native infrastructure and non-instrumented services, considerably reducing the time for problem triage.

Before we start explaining the API, let's first illustrate how APM can supplement missing data after calling the DeepFlow API using a diagram.

![Full Stack Distributed Tracing](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230606647ea8bc946f1.jpg)

- Span with prefix A denotes Application Span (from APM); Span with prefix S represents System Span (from DeepFlow); Span with prefix N refers to Network Span (from DeepFlow)
- The black part of the diagram displays the parameters when APM calls the DeepFlow API. DeepFlow uses these `Application Span` as search boundaries to supplement surrounding `System/Network Span`, and reconstructs Parent-Child relationship
- The blue part displays `System/Network Span` computed based on `Application Span` that has injected TraceID/SpanID from APM. It fills the gap between two services in APM regarding Syscall, Bridge, IPVS and other kernel system call and network transmission path
- The green part denotes basic service calls that DeepFlow traces automatically based on its `system span`, for instance, non-instrumented DNS calls, and MySQL calls, Redis calls etc., whose TraceID/SpanID can't be injected
- The red part summarizes up and down stream services, traced by DeepFlow automatically based on its system span, that aren't instrumented, such as non-instrumented ALB, NLB, Ingress etc., gateway services, and other services not instrumented by APM in business logic

# API Description

Get DeepFlow service endpoint port number:

```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-app)
```

Trace Completion API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/stats/querier/tracing-completion-by-external-app-spans"
```

## Input Description

```json
{
  "max_iteration": 30,
  "network_delay_us": 3000000,
  "app_spans":[
    {
      "trace_id": "xxxx",
      "span_id": "xxxx",
      "parent_span_id": "xxxx",
      "span_kind": 0,
      "start_time_us": 1681960139619998,
      "end_time_us": 1681960139620004,
    },
    ...
  ]
}
```

| Field            | Type            | Required | Description                                                                                                                                           |
| ---------------- | --------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| max_iteration    | int             | No       | Depth of System Span tracking, default is 30, unit: layers                                                                                            |
| network_delay_us | int             | No       | Time span for Network Span tracking, default is 3000000, unit: microseconds                                                                           |
| app_spans        | array[AppSpans] | Yes      | List of `Application Span` that you want to use to complete call chains, could be all `Application Span` from a complete Trace (not suggested though) |

App_spans normally include a part of Application Span from an APM's Trace, and DeepFlow completes it based on this. It's recommended to carry the following Span each time calling the API:

- The Application Span you care about the most (referred to as X), and the service it belongs to is called a.
- X's ancestor Span, until find the first one whose ancestor Span is not from service a, for instance, in SkyWalking, the first Exit Span.
- X's descendant Span, until find the first one whose ancestor Span is not from service a for every child branch, for instance, in SkyWalking, for each branch, find the first Entry Span.

The purpose of carrying these Span in the request is to tell DeepFlow to complete it with Span X being the core, and reconstruct the relationship between all Span in the return result with X's ancestors and descendants as boundaries. The parameters needed for each app_span are listed below:

| Field | Type | Required | Description |
| -------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| trace_id | string | Yes | TraceID for `Application Span` |
| span_id | string | Yes | SpanID for `Application Span` |
| parent_span_id | string | Yes | ParentSpanID for `Application Span` |
| span_kind | int | Yes | Type of `Application Span` meaning the same as OpenTelemetry, optional value：0: unspecified, 1: internal, 2: server, 3: client, 4: producer, 5: consumer |
| start_time_us | int | Yes | Start time of `Application Span`，unit: microseconds |
| end_time_us | int | Yes | End time of `Application Span`，unit: microseconds |

## Output Description

```json
{
    "OPT_STATUS": "SUCCESS",
    "DESCRIPTION": "",
    "DATA": {
      "tracing": [
        {
          "start_time_us": 1682216627824419,
          "end_time_us": 1681960139620004,
          "name": "querier_client",
          "signal_source": 4,
          "tap_side": "c-app",
          "trace_id": "a03a848c3121b817b0e866fb71607bc2",
          "span_id": "d5b574eb7ac48503",
          "parent_span_id": "69cc875250b4043c",
          "deepflow_span_id": "d5b574eb7ac48503",
          "deepflow_parent_span_id": "69cc875250b4043c",
          "_ids": ["7225065397752915120"],
          "related_ids": [
            "2-app-7225065397752915115"
          ],
          "flow_id": "0",
          "duration": 32219,
          "req_tcp_seq": 0,
          "resp_tcp_seq": 0,
          "l7_protocol": 20,
          "l7_protocol_str": "HTTP",
          "request_type": "POST",
          "request_resource": "xxxx",
          "response_status": 2,
          "request_id": "xxxx",
          "endpoint": "querier_client",
          "process_id": 1234,
          "app_service": "deepflow-statistics",
          "app_instance": "",
          "x_request_id": "",
          "syscall_trace_id_request": "0",
          "syscall_trace_id_response": "0",
          "syscall_cap_seq_0": 0,
          "syscall_cap_seq_1": 0,
          "vtap_id": 1,
        },
        ...
      ]
    }
}
```

The tracing in the returned result is a complete Span traced by DeepFlow, an array type. Each item in this array is a Span, which includes both Application Span from APM and System/Network Span from DeepFlow. Important attributes for each Span include:

| Field | Type | Description |
| ----------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start_time_us | int | Span start time, unit: microseconds |
| end_time_us | int | Span end time, unit: microseconds |
| duration | int | Span execution time, unit: microseconds |
| name | string | Span name, For System/Network Span, it's corresponding to DeepFlow's [`request_resource` field description](../../../features/universal-map/request-log/) |
| signal_source | int | Span source, corresponding to DeepFlow's [`signal_source` field description](../../../features/universal-map/request-log/) |
| tap_side | int | Span statistic location, corresponding to DeepFlow's [`tap_side` field description](../../../features/universal-map/auto-metrics/#%E7%BB%9F%E8%AE%A1%E4%BD%8D%E7%BD%AE%E8%AF%B4%E6%98%8E) |
| trace_id | string | TraceID, if `System/Network Span` has corresponding `Application Span`, value should be the same; otherwise, it's empty |
| span_id | string | Original Span ID, if `System/Network Span` has corresponding `Application Span`, value should be the same; otherwise, it's empty |
| parent_span_id | string | Original Parent Span ID, if `System/Network Span` has corresponding `Application Span`, value should be the same; otherwise, it's empty |
| deepflow_span_id | string | Re-calculated Span ID by DeepFlow |
| deepflow_parent_span_id | string | Re-calculated Parent Span ID by DeepFlow |

Besides, API will return extra fields for each Span:

| Field | Type | Description | Note |
| ------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| \_ids | array | DipFlow call logs corresponding to Span | |
| related_ids | int | Other DeepFlow call logs associated with Span | |
| flow_id | string | DeepFlow flow logs corresponding to Span, no data for Application/ System Span |
| l7_protocol | int | Application protocol for Span, corresponding to DipFlow's [`l7_protocol` field description](../../../features/universal-map/request-log/) |
| l7_protocol_str | string | Application protocol for Span |
| request_type | string | Request type for Span |
| request_id | string | Request ID for Span |
| endpoint | string | Request endpoint for Span |
| request_resource | string | Request resource for Span |
| response_status | int | Response status for Span, corresponding to DipFlow's [`response_status` field description](../../../features/universal-map/request-log/) |
| process_id | int | Process ID for Span, only for System Span |
| app_service | string | Service where Span belongs, only for Application Span |
| app_instance | string | Instance where Span belongs, only for Application Span |
| vtap_id | int | Collection ID corresponding to Span |
| req_tcp_seq | int | TCP Seq for Span request, only for System/ Network Span | Used for trace calculation |
| resp_tcp_seq | int | TCP Seq for Span response, only for System/ Network Span | Used for trace calculation |
| x_request_id | string | X-Request-ID for Span request or response, only for System/ Network Span | Used for trace calculation |
| syscall_trace_id_request | string | Syscall TraceID corresponding to Span request, only for System Span | Used for trace calculation |
| syscall_trace_id_response | string | Syscall TraceID corresponding to Span response, only for System Span | Used for trace calculation |
| syscall_cap_seq_0 | string | Syscall Seq corresponding to Span request, only for System Span | Used for trace calculation |
| syscall_cap_seq_1 | string | Syscall Seq corresponding to Span response, only for System Span | Used for trace calculation |

Note：

- Use `deepflow_span_id` and `deepflow_parent_span_id` to construct the new parent-child relationship in the returned results.
- TraceID/SpanID injected into protocol after application instrumentation can be automatically collected and parsed by agent in default OpenTelemetry and SkyWalking's Header format has been adapted. Please modify agent configuration for custom headers, for detailed instructions, please refer to [Agent Advanced Configuration](../../../best-practice/agent-advanced-config/)
