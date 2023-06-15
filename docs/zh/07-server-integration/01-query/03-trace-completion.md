---
title: 传统 APM 通过调用 DeepFlow API 具备全栈追踪能力
permalink: /server-integration/query/trace-completion
---

# 简介

传统 APM 聚焦在代码层面，不具备全栈多维度无盲点看问题的能力，同时由于插码的阻碍往往难以覆盖所有微服务，DeepFlow 依靠 eBPF 零代码修改采集全栈追踪数据并聚合生成了调用关系，可以增强传统 APM 的数据，大大缩短问题定界时间。对于已经使用传统 APM 工具的用户，可以使用 DeepFlow 提供的 API 来增强调用追踪，以获得全栈数据追踪能力。

在开始介绍 API 之前，先结合一张图说明传统 APM 在调用 DeepFlow API 在追踪层面能补齐的数据。

![全栈数据追踪图](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230606647ea8bc946f1.jpg)

- 图中 A 表示应用 Span（来源传统 APM）；S 表示网络 Span（来源 DeepFlow）；N 表示网络 Span（来源 DeepFlow）
- 图中黑色部分为传统 APM 调用 DeepFlow API 的入参：需要补齐 DeepFlow `系统/网络 Span` 的`应用 Span`
- 图中蓝色部分为 DeepFlow 返回的全栈追踪 Span：利用传统 APM 的`应用 Span` 中 TraceID 与 SpanID 关联的 DeepFlow 的`系统/网络 Span`
- 图中绿色部分为 为 DeepFlow 返回的无插桩的基础服务对应的 Span：利用 eBPF 能力，为传统 APM 自动化追踪 DNS/MySQL/Redis 等基础服务对应的`系统/网络 Span`
- 图中红色部分为 为 DeepFlow 返回的无插桩的网关服务对应的 Span：利用 eBPF 能力，为传统 APM 自动化追踪 NLB/ALB/Ingress 等网关服务对应的`系统/网络 Span`

# API 说明

获取服务端点端口号：
```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-app)
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/stats/querier/tracing-completion-by-external-app-spans" 
```

## 入参说明

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

| 字段 | 类型 | 必填 | 说明 |
| ---- | --- | ---- | ---- |
| max_iteration | int | 否 | 系统 Span 追踪的深度，默认30, 单位：层 |
| network_delay_us | int | 否 | 网络 Span 追踪的时间跨度 ，默认3000000，单位：微秒|
| app_spans | array[AppSpans] | 是 | 需要补齐 DeepFlow `系统/网络 Span`的`应用 Span`，可以是完整的一次 tracing 的所有`应用 Span`，也可以是其中部分`应用 Span`|

AppSpans

| 字段 | 类型 | 必填 | 说明 |
| ---- | --- | ---- | ---- |
| trace_id | string | 是 | `应用 Span` 的 TraceID |
| span_id | string | 是 | `应用 Span` 的 SpanID |
| parent_span_id | string | 是 | `应用 Span` 的 ParentSpanID |
| span_kind | int | 是 | `应用 Span` 的 Span 类型，含义同 OpenTelemetry，可选值：0: unspecified, 1: internal, 2: server, 3: client, 4: producer, 5: consumer |
| start_time_us | int | 是 | `应用 Span` 的 Span 开始时间，单位：微秒 |
| end_time_us |int | 是 | `应用 Span` 的 Span 结束时间，单位：微秒 |

## 出参说明

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

tracing 为 DeepFlow 追踪的完整 Span，数组类型，数组中的每一项为一个 Span，既包含传统 APM 的应用 Span，也包含 DeepFlow 的系统/网络 Span。

| 字段 | 类型 | 说明 |
| --- | --- | ------ |
| start_time_us | int | Span 开始时间，单位：微秒 |
| end_time_us | int | Span 结束时间，单位：微秒 |
| duration | int | Span 执行时间，单位：微秒 |
| name | string | Span 名称，系统/网络 Span 对应 DeepFlow 的[`request_resource`字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/) |
| signal_source | int | Span 来源，对应 DeepFlow 的[`signal_source`字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/)  |
| tap_side | int | Span 统计位置，对应 DeepFlow 的[`tap_side`字段说明](https://deepflow.io/docs/zh/auto-metrics/metrics-without-instrumentation/#%E7%BB%9F%E8%AE%A1%E4%BD%8D%E7%BD%AE%E8%AF%B4%E6%98%8E) |
| trace_id | string | Span 的 TraceID，`系统/网络 Span` 如有对应`应用 Span`，则为`应用 Span`的 TraceID；否则，则无数据 |
| span_id | string | Span ID，`系统/网络 Span` 如有对应`应用 Span`，则为`应用 Span`的 SpanID；否则，则无数据 |
| parent_span_id | string | Span 父 ID，`系统/网络 Span` 如有对应`应用 Span`，则为`应用 Span`的 ParentSpanID；否则，则无数据 |
| deepflow_span_id | string | DeepFlow 重新计算的所有 Span ID |
| deepflow_parent_span_id | string | DeepFlow 重新计算的所有 Span 父 ID |

以下都为 Span 的属性字段
| 字段 | 类型 | 说明 | 备注 |
| --- | --- | ------ | ---- |
| _ids | array | Span 对应的 DeepFlow 调用日志 |  |
| related_ids | int | Span 关联的 DeepFlow 调用日志 |  |
| flow_id | string | Span 对应的 DeepFlow 流日志，应用/系统 Span 无数据 |
| l7_protocol | int | Span 的应用协议，对应 DeepFlow 的[`l7_protocol`字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/) |
| l7_protocol_str | string | Span 的应用协议 |
| request_type | string | Span 的请求类型  |
| request_id | string | Span 的请求ID  |
| endpoint | string | Span 的请求端点 |
| request_resource | string | Span 的请求资源 |
| response_status | int | Span 的响应状态，对应 DeepFlow 的[`response_status`字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/) |
| process_id | int | Span 所属的进程ID，仅系统 Span 有数据 |
| app_service | string | Span 所属的服务，仅应用 Span 有数据 |
| app_instance | string | Span 所属的实例，仅应用 Span 有数据 |
| vtap_id | int | Span 对应的采集器 ID |
| req_tcp_seq | int | Span 请求对应的 TCP Seq，仅系统/网络 Span 有数据 | 用于自动化追踪 |
| resp_tcp_seq | int | Span 响应对应的 TCP Seq，仅系统/网络 Span 有数据 | 用于自动化追踪 |
| x_request_id | string | Span 请求或响应的 X-Request-ID，仅系统/网络 Span 有数据 | 用于自动化追踪 |
| syscall_trace_id_request | string | Span 请求对应的 Syscall TraceID，仅系统 Span 有数据 | 用于自动化追踪 |
| syscall_trace_id_response | string | Span 响应对应的 Syscall TraceID，仅系统 Span 有数据 | 用于自动化追踪 |
| syscall_cap_seq_0 | string | Span 请求对应的 Syscall Seq，仅系统 Span 有数据 | 用于自动化追踪 |
| syscall_cap_seq_1 | string | Span 响应对应的 Syscall Seq，仅系统 Span 有数据 | 用于自动化追踪 |

注：
- Span 的父子关系，需要使用`deepflow_span_id`与`deepflow_parent_span_id`字段来构建
- 应用 Span 的 trace_id/span_id/parent_span_id 在系统/网络 Span 可见，需要修改 agent 配置，具体参考 [Agent 高级配置](https://deepflow.io/docs/zh/install/advanced-config/agent-advanced-config/)
