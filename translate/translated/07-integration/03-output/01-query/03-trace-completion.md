---
title: Trace Completion API
permalink: /integration/output/query/trace-completion
---

> This document was translated by ChatGPT

# Introduction

APM focuses on the code level and lacks the ability to view issues from a full-stack, multi-dimensional perspective without blind spots. Additionally, due to the hindrance of instrumentation, it often fails to cover all services. DeepFlow relies on eBPF zero-instrumentation to fully capture distributed tracing data and generate call chains. In scenarios where DeepFlow and APM are deployed independently, they can collaborate in a loosely coupled manner by using DeepFlow's Trace Completion API to enhance APM's call chains, eliminating blind spots in APM for cloud-native infrastructure and non-instrumented services, significantly reducing the time for triage.

Before introducing the API, let's use a diagram to explain the data that APM can complete after calling the DeepFlow API.

![Full Stack Distributed Tracing](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230606647ea8bc946f1.jpg)

- In the diagram, Spans starting with A represent application Spans (from APM); those starting with S represent system Spans (from DeepFlow); and those starting with N represent network Spans (from DeepFlow).
- The black parts in the diagram are the input parameters for APM calling the DeepFlow API. DeepFlow will use these `application Spans` as search boundaries to complete the surrounding `system/network Spans` and reconstruct the Parent-Child relationships.
- The blue parts in the diagram are `application Spans` injected with TraceID/SpanID in the protocol from APM, and the `system/network Spans` calculated based on them. These complete the kernel system calls and network transmission paths such as Syscall, Bridge, and IPVS between two services for APM.
- The green parts in the diagram are basic service calls automatically traced by DeepFlow's `system Spans`, such as non-instrumented DNS calls and MySQL calls, Redis calls, etc., where TraceID/SpanID cannot be injected.
- The red parts in the diagram are upstream and downstream services automatically traced by DeepFlow's `system Spans`, such as non-instrumented ALB, NLB, Ingress gateway services, and other services in the business logic that APM has not instrumented.

# API Description

Get the DeepFlow service endpoint port number:

```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-app)
```

Trace Completion API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/stats/querier/tracing-completion-by-external-app-spans"
```

## Input Parameters Description

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

| Field            | Type            | Required | Description                                                                                 |
| ---------------- | --------------- | -------- | ------------------------------------------------------------------------------------------- |
| max_iteration    | int             | No       | Depth of system Span tracing, default is 30, unit: layers                                    |
| network_delay_us | int             | No       | Time span for network Span tracing, default is 3000000, unit: microseconds                   |
| app_spans        | array[AppSpans] | Yes      | List of `application Spans` to complete the call chain, can be all `application Spans` in a complete Trace (not recommended) |

app_spans are usually part of the application Spans of a Trace in APM. DeepFlow completes based on this. It is recommended to carry the following Spans for each call:

- The most concerned application Span (hereinafter referred to as X), and the service it belongs to is called a
- The ancestor Spans of X, until the first ancestor Span that is not service a is found, for example, in SkyWalking, it is the first ancestor Span of type Exit
- The descendant Spans of X, each branch until the first descendant Span that is not service a is found, for example, in SkyWalking, it is the first descendant Span of type Entry for each branch

The purpose of carrying these Spans in the request is to inform DeepFlow to complete around Span X and reconstruct the parent-child relationships of all Spans in the returned result with the ancestors and descendants of X as boundaries. The specific parameters required for each app_span are as follows:

| Field           | Type   | Required | Description                                                                                                                                |
| -------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| trace_id       | string | Yes      | TraceID of the `application Span`                                                                                                          |
| span_id        | string | Yes      | SpanID of the `application Span`                                                                                                           |
| parent_span_id | string | Yes      | ParentSpanID of the `application Span`                                                                                                     |
| span_kind      | int    | Yes      | Span type of the `application Span`, same meaning as in OpenTelemetry, optional values: 0: unspecified, 1: internal, 2: server, 3: client, 4: producer, 5: consumer |
| start_time_us  | int    | Yes      | Start time of the `application Span`, unit: microseconds                                                                                   |
| end_time_us    | int    | Yes      | End time of the `application Span`, unit: microseconds                                                                                     |

## Output Parameters Description

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

The tracing in the returned result is the complete Spans traced by DeepFlow, which is an array. Each item in the array is a Span, including both application Spans from APM and system/network Spans from DeepFlow. Important attributes of each Span are:

| Field                    | Type   | Description                                                                                                                                                        |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| start_time_us           | int    | Start time of the Span, unit: microseconds                                                                                                                         |
| end_time_us             | int    | End time of the Span, unit: microseconds                                                                                                                           |
| duration                | int    | Execution time of the Span, unit: microseconds                                                                                                                     |
| name                    | string | Name of the Span, system/network Spans correspond to DeepFlow's [`request_resource` field description](../../../features/universal-map/request-log/)               |
| signal_source           | int    | Source of the Span, corresponding to DeepFlow's [`signal_source` field description](../../../features/universal-map/request-log/)                                  |
| tap_side                | int    | Span statistics location, corresponding to DeepFlow's [`tap_side` field description](../../../features/universal-map/auto-metrics/#%E7%BB%9F%E8%AE%A1%E4%BD%8D%E7%BD%AE%E8%AF%B4%E6%98%8E) |
| trace_id                | string | TraceID, if `system/network Span` has a corresponding `application Span`, it is the value of the corresponding `application Span`; otherwise, the value is empty    |
| span_id                 | string | Original Span ID, if `system/network Span` has a corresponding `application Span`, it is the value of the corresponding `application Span`; otherwise, the value is empty |
| parent_span_id          | string | Original parent Span ID, if `system/network Span` has a corresponding `application Span`, it is the value of the corresponding `application Span`; otherwise, the value is empty |
| deepflow_span_id        | string | Span ID recalculated by DeepFlow                                                                                                                                   |
| deepflow_parent_span_id | string | Parent Span ID recalculated by DeepFlow                                                                                                                            |

In addition, the API will return some extra fields for each Span:

| Field                      | Type   | Description                                                                                                         | Remarks      |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- | ------------ |
| \_ids                     | array  | DeepFlow call logs corresponding to the Span                                                                        |              |
| related_ids               | int    | Other DeepFlow call logs related to the Span                                                                        |              |
| flow_id                   | string | DeepFlow flow logs corresponding to the Span, no data for application/system Spans                                   |
| l7_protocol               | int    | Application protocol of the Span, corresponding to DeepFlow's [`l7_protocol` field description](../../../features/universal-map/request-log/) |
| l7_protocol_str           | string | Application protocol of the Span                                                                                    |
| request_type              | string | Request type of the Span                                                                                            |
| request_id                | string | Request ID of the Span                                                                                              |
| endpoint                  | string | Request endpoint of the Span                                                                                        |
| request_resource          | string | Request resource of the Span                                                                                        |
| response_status           | int    | Response status of the Span, corresponding to DeepFlow's [`response_status` field description](../../../features/universal-map/request-log/) |
| process_id                | int    | Process ID to which the Span belongs, only system Spans have data                                                   |
| app_service               | string | Service to which the Span belongs, only application Spans have data                                                 |
| app_instance              | string | Instance to which the Span belongs, only application Spans have data                                                |
| vtap_id                   | int    | Collector ID corresponding to the Span                                                                              |
| req_tcp_seq               | int    | TCP Seq corresponding to the Span request, only system/network Spans have data                                      | Used for tracing calculation |
| resp_tcp_seq              | int    | TCP Seq corresponding to the Span response, only system/network Spans have data                                     | Used for tracing calculation |
| x_request_id              | string | X-Request-ID of the Span request or response, only system/network Spans have data                                   | Used for tracing calculation |
| syscall_trace_id_request  | string | Syscall TraceID corresponding to the Span request, only system Spans have data                                      | Used for tracing calculation |
| syscall_trace_id_response | string | Syscall TraceID corresponding to the Span response, only system Spans have data                                     | Used for tracing calculation |
| syscall_cap_seq_0         | string | Syscall Seq corresponding to the Span request, only system Spans have data                                          | Used for tracing calculation |
| syscall_cap_seq_1         | string | Syscall Seq corresponding to the Span response, only system Spans have data                                         | Used for tracing calculation |

Note:

- The new parent-child relationships of Spans in the returned result need to be constructed using the `deepflow_span_id` and `deepflow_parent_span_id` fields.
- TraceID/SpanID injected into the protocol after application instrumentation can be automatically parsed and collected by the Agent. By default, it is adapted to the Header format of OpenTelemetry and SkyWalking. If there are custom Headers, please modify the Agent configuration. For details, refer to [Agent Advanced Configuration](../../../best-practice/agent-advanced-config/).