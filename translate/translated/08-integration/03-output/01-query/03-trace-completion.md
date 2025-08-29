---
title: Trace Completion API
permalink: /integration/output/query/trace-completion
---

> This document was translated by ChatGPT

# Introduction

APM focuses on the code level and lacks the capability to observe issues across the full stack and multiple dimensions without blind spots. Additionally, due to the limitations of instrumentation, it is often difficult to cover all services. DeepFlow relies on eBPF for zero-instrumentation, full-coverage collection of distributed tracing data, and correlates it to generate call chains. In scenarios where DeepFlow and APM are deployed completely independently, the two can collaborate in a loosely coupled manner — by using DeepFlow’s Trace Completion API to enhance APM’s call chains, eliminating blind spots in APM for cloud-native infrastructure and non-instrumented services, and significantly shortening the time for problem triage.

Before introducing the API, let’s first use a diagram to illustrate the data that APM can complete after calling the DeepFlow API.

![Full Stack Distributed Tracing](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230606647ea8bc946f1.jpg)

- Spans starting with **A** in the diagram represent application spans (from APM); those starting with **S** represent system spans (from DeepFlow); those starting with **N** represent network spans (from DeepFlow).
- The black parts in the diagram are the input parameters when APM calls the DeepFlow API. DeepFlow will use these `application spans` as the search boundary, complete the surrounding `system/network spans`, and reconstruct the parent-child relationships.
- The blue parts in the diagram are `system/network spans` calculated based on `application spans` in APM that have TraceID/SpanID injected into the protocol. These fill in kernel system calls such as Syscall, Bridge, IPVS, and network transmission paths between two services for APM.
- The green parts in the diagram are basic service calls automatically traced from DeepFlow’s `system spans`, such as non-instrumented DNS calls, and MySQL/Redis calls where TraceID/SpanID cannot be injected.
- The red parts in the diagram are upstream and downstream services without instrumentation, automatically traced from DeepFlow’s `system spans`, such as non-instrumented ALB, NLB, Ingress gateway services, as well as other services in business logic that APM has not instrumented.

# API Description

Get the DeepFlow server endpoint port number:

```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-app)
```

Trace Completion API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/stats/querier/tracing-completion-by-external-app-spans"
```

## Request Parameters

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

| Field            | Type            | Required | Description                                                                                  |
| ---------------- | --------------- | -------- | -------------------------------------------------------------------------------------------- |
| max_iteration    | int             | No       | Depth of system span tracing, default 30, unit: layers                                       |
| network_delay_us | int             | No       | Time span for network span tracing, default 3000000, unit: microseconds                      |
| app_spans        | array[AppSpans] | Yes      | List of `application spans` to complete the call chain. Can be all `application spans` in a complete trace (not recommended) |

`app_spans` are usually a subset of application spans from a trace in APM. DeepFlow uses them for completion. It is recommended that each call carries the following spans:

- The most concerned application span (hereinafter referred to as X), and the service it belongs to is called **a**.
- Ancestor spans of X, until the first ancestor span that does not belong to service **a** is found. For example, in SkyWalking, this is the first ancestor span of type Exit.
- Descendant spans of X, for each sub-branch until the first descendant span that does not belong to service **a** is found. For example, in SkyWalking, this is the first descendant span of type Entry for each sub-branch.

The purpose of carrying these spans in the request is to tell DeepFlow to complete the call chain centered on span X, and to reconstruct the parent-child relationships of all spans in the returned result using X’s ancestors and descendants as boundaries. The parameters required for each `app_span` are as follows:

| Field           | Type   | Required | Description                                                                                                                       |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| trace_id        | string | Yes      | TraceID of the `application span`                                                                                                 |
| span_id         | string | Yes      | SpanID of the `application span`                                                                                                  |
| parent_span_id  | string | Yes      | ParentSpanID of the `application span`                                                                                            |
| span_kind       | int    | Yes      | Span type of the `application span`, same meaning as in OpenTelemetry. Options: 0: unspecified, 1: internal, 2: server, 3: client, 4: producer, 5: consumer |
| start_time_us   | int    | Yes      | Start time of the `application span`, unit: microseconds                                                                          |
| end_time_us     | int    | Yes      | End time of the `application span`, unit: microseconds                                                                            |

## Response Parameters

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

The `tracing` in the returned result is an array of complete spans traced by DeepFlow. Each item in the array is a span, including both application spans from APM and system/network spans from DeepFlow. Key attributes of each span include:

| Field                   | Type   | Description                                                                                                                                   |
| ----------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| start_time_us           | int    | Span start time, unit: microseconds                                                                                                           |
| end_time_us             | int    | Span end time, unit: microseconds                                                                                                             |
| duration                | int    | Span execution time, unit: microseconds                                                                                                       |
| name                    | string | Span name. For system/network spans, corresponds to DeepFlow’s [`request_resource` field description](../../../features/universal-map/request-log/) |
| signal_source           | int    | Span source, corresponds to DeepFlow’s [`signal_source` field description](../../../features/universal-map/request-log/)                     |
| tap_side                | int    | Span collection location, corresponds to DeepFlow’s [`tap_side` field description](../../../features/universal-map/auto-metrics/#%E7%BB%9F%E8%AE%A1%E4%BD%8D%E7%BD%AE%E8%AF%B4%E6%98%8E) |
| trace_id                | string | TraceID. For `system/network spans` with a corresponding `application span`, this is the value from the application span; otherwise empty    |
| span_id                 | string | Original Span ID. For `system/network spans` with a corresponding `application span`, this is the value from the application span; otherwise empty |
| parent_span_id          | string | Original Parent Span ID. For `system/network spans` with a corresponding `application span`, this is the value from the application span; otherwise empty |
| deepflow_span_id        | string | Span ID recalculated by DeepFlow                                                                                                              |
| deepflow_parent_span_id | string | Parent Span ID recalculated by DeepFlow                                                                                                       |

In addition, the API returns extra fields for each span:

| Field                     | Type   | Description                                                                                                    | Notes         |
| ------------------------- | ------ | -------------------------------------------------------------------------------------------------------------- | ------------- |
| \_ids                     | array  | DeepFlow request logs corresponding to the span                                                                |               |
| related_ids               | int    | Other DeepFlow request logs related to the span                                                                |               |
| flow_id                   | string | DeepFlow flow log corresponding to the span. No data for application/system spans                              |               |
| l7_protocol               | int    | Application protocol of the span, corresponds to DeepFlow’s [`l7_protocol` field description](../../../features/universal-map/request-log/) |
| l7_protocol_str           | string | Application protocol of the span                                                                               |
| request_type              | string | Request type of the span                                                                                        |
| request_id                | string | Request ID of the span                                                                                          |
| endpoint                  | string | Request endpoint of the span                                                                                    |
| request_resource          | string | Request resource of the span                                                                                    |
| response_status           | int    | Response status of the span, corresponds to DeepFlow’s [`response_status` field description](../../../features/universal-map/request-log/) |
| process_id                | int    | Process ID the span belongs to, only available for system spans                                                 |
| app_service               | string | Service the span belongs to, only available for application spans                                               |
| app_instance              | string | Instance the span belongs to, only available for application spans                                              |
| vtap_id                   | int    | Collector ID corresponding to the span                                                                          |
| req_tcp_seq               | int    | TCP Seq of the span’s request, only available for system/network spans                                          | For tracing calculation |
| resp_tcp_seq              | int    | TCP Seq of the span’s response, only available for system/network spans                                         | For tracing calculation |
| x_request_id              | string | X-Request-ID of the span’s request or response, only available for system/network spans                         | For tracing calculation |
| syscall_trace_id_request  | string | Syscall TraceID of the span’s request, only available for system spans                                          | For tracing calculation |
| syscall_trace_id_response | string | Syscall TraceID of the span’s response, only available for system spans                                         | For tracing calculation |
| syscall_cap_seq_0         | string | Syscall Seq of the span’s request, only available for system spans                                              | For tracing calculation |
| syscall_cap_seq_1         | string | Syscall Seq of the span’s response, only available for system spans                                             | For tracing calculation |

Note:

- The new parent-child relationships of spans in the returned result should be constructed using the `deepflow_span_id` and `deepflow_parent_span_id` fields.
- TraceID/SpanID injected into the protocol after application instrumentation can be automatically parsed and collected by the Agent. By default, the OpenTelemetry and SkyWalking header formats are supported. For custom headers, please modify the Agent configuration. See [Agent Advanced Configuration](../../../best-practice/agent-advanced-config/) for details.