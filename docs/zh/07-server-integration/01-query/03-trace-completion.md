---
title: Trace Completion API
permalink: /server-integration/query/trace-completion
---

# 简介

APM 聚焦在代码层面，不具备全栈多维度无盲点看问题的能力，同时由于插桩的阻碍往往难以覆盖所有服务。DeepFlow 依靠 eBPF 零插桩、全覆盖采集分布式追踪数据，并关联生成调用链。在完全独立部署 DeepFlow 与 APM 的场景下，二者可以通过一种松耦合的方式协同，即使用 DeepFlow 的 Trace Completion API 增强 APM 的调用链，消除 APM 中云原生基础设施及未插桩服务的盲点，大大缩短问题定界时间。

在开始介绍 API 之前，先结合一张图说明 APM 在调用 DeepFlow API 后能补全的数据。

![全覆盖分布式追踪（Full Stack Distributed Tracing）](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230606647ea8bc946f1.jpg)

- 图中以 A 开头的 Span 表示应用 Span（来自 APM）；S 开头表示系统 Span（来源 DeepFlow）；N 开头表示网络 Span（来源 DeepFlow）
- 图中黑色部分为 APM 调用 DeepFlow API 的入参，DeepFlow 将以这些 `应用 Span` 为搜索边界，补全周边的 `系统/网络 Span`，并重构 Parent-Child 关系
- 图中蓝色部分为根据 APM 中向协议注入了 TraceID/SpanID 的 `应用 Span`，计算出的 `系统/网络 Span`，它为 APM 补全了两个服务之间的 Syscall、Bridge、IPVS 等内核系统调用及网络传输路径
- 图中绿色部分为根据 DeepFlow 的 `系统 Span` 自动追踪出的基础服务调用，例如未插桩的 DNS 调用，以及无法注入 TraceID/SpanID 的 MySQL 调用、Redis 调用等
- 图中红色部分为根据 DeepFlow 的 `系统 Span` 自动追踪出的未插桩上下游服务，例如未插桩的 ALB、NLB、Ingress 等网关服务，也包括业务逻辑中 APM 未插桩的其他服务

# API 说明

获取 DeepFlow 服务端点端口号：
```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-app)
```

Trace Completion API 调用方式：
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
| app_spans | array[AppSpans] | 是 | 希望补全调用链的 `应用 Span` 列表，可以是一次完整的 Trace 中所有`应用 Span`（但不建议） |

app_spans 通常为 APM 中一个 Trace 的一部分应用 Span，DeepFlow 据此进行补全，建议每一次调用携带如下 Span：
- 最关注的一个应用 Span（下称 X），称它所在的服务为 a
- X 的祖先 Span，直到找到第一个不是服务 a 的祖先 Span 为止，例如在 SkyWalking 中就是找到第一个类型为 Exit 的祖先 Span
- X 的子孙 Span，每一个子分支直到找到第一个不是服务 a 的祖先 Span 为止，例如在 SkyWalking 中就是对每一个子分支找到第一个类型为 Entry 的子孙 Span

在请求中携带这些 Span 的目的是，告知 DeepFlow 以 Span X 为核心进行补全，且以 X 的祖先和子孙为边界来重构返回结果中所有 Span 的父子关系。具体每一个 app_span 需要携带的参数如下：

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

返回结果中的 tracing 为 DeepFlow 追踪的完整 Span，数组类型，数组中的每一项为一个 Span，既包含来自 APM 的应用 Span，也包含 DeepFlow 中的系统/网络 Span。每个 Span 的重要属性有：

| 字段 | 类型 | 说明 |
| --- | --- | ------ |
| start_time_us | int | Span 开始时间，单位：微秒 |
| end_time_us | int | Span 结束时间，单位：微秒 |
| duration | int | Span 执行时间，单位：微秒 |
| name | string | Span 名称，系统/网络 Span 对应 DeepFlow 的 [`request_resource` 字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/) |
| signal_source | int | Span 来源，对应 DeepFlow 的 [`signal_source` 字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/)  |
| tap_side | int | Span 统计位置，对应 DeepFlow 的 [`tap_side` 字段说明](https://deepflow.io/docs/zh/auto-metrics/metrics-without-instrumentation/#%E7%BB%9F%E8%AE%A1%E4%BD%8D%E7%BD%AE%E8%AF%B4%E6%98%8E) |
| trace_id | string | TraceID，`系统/网络 Span` 如有对应的 `应用 Span`，则为对应 `应用 Span` 的此值；否则值为空 |
| span_id | string | 原始 Span ID，`系统/网络 Span` 如有对应的 `应用 Span`，则为对应 `应用 Span` 的此值；否则值为空 |
| parent_span_id | string | 原始父 Span ID，`系统/网络 Span` 如有对应的 `应用 Span`，则为对应 `应用 Span` 的此值；否则值为空 |
| deepflow_span_id | string | DeepFlow 重新计算的 Span ID |
| deepflow_parent_span_id | string | DeepFlow 重新计算的父 Span ID |

除此之外，API 还会为每个 Span 额外返回一些字段：

| 字段 | 类型 | 说明 | 备注 |
| --- | --- | ------ | ---- |
| \_ids | array | Span 对应的 DeepFlow 调用日志 |  |
| related_ids | int | Span 关联的其他 DeepFlow 调用日志 |  |
| flow_id | string | Span 对应的 DeepFlow 流日志，应用/系统 Span 无数据 |
| l7_protocol | int | Span 的应用协议，对应 DeepFlow 的 [`l7_protocol` 字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/) |
| l7_protocol_str | string | Span 的应用协议 |
| request_type | string | Span 的请求类型  |
| request_id | string | Span 的请求 ID  |
| endpoint | string | Span 的请求端点 |
| request_resource | string | Span 的请求资源 |
| response_status | int | Span 的响应状态，对应 DeepFlow 的 [`response_status` 字段说明](https://deepflow.io/docs/zh/auto-metrics/request-log/) |
| process_id | int | Span 所属的进程ID，仅系统 Span 有数据 |
| app_service | string | Span 所属的服务，仅应用 Span 有数据 |
| app_instance | string | Span 所属的实例，仅应用 Span 有数据 |
| vtap_id | int | Span 对应的采集器 ID |
| req_tcp_seq | int | Span 请求对应的 TCP Seq，仅系统/网络 Span 有数据 | 用于追踪计算 |
| resp_tcp_seq | int | Span 响应对应的 TCP Seq，仅系统/网络 Span 有数据 | 用于追踪计算 |
| x_request_id | string | Span 请求或响应的 X-Request-ID，仅系统/网络 Span 有数据 | 用于追踪计算 |
| syscall_trace_id_request | string | Span 请求对应的 Syscall TraceID，仅系统 Span 有数据 | 用于追踪计算 |
| syscall_trace_id_response | string | Span 响应对应的 Syscall TraceID，仅系统 Span 有数据 | 用于追踪计算 |
| syscall_cap_seq_0 | string | Span 请求对应的 Syscall Seq，仅系统 Span 有数据 | 用于追踪计算 |
| syscall_cap_seq_1 | string | Span 响应对应的 Syscall Seq，仅系统 Span 有数据 | 用于追踪计算 |

注意：
- 返回结果中 Span 的新父子关系，需要使用 `deepflow_span_id` 与 `deepflow_parent_span_id` 字段来构建
- 应用插桩后向协议中注入的 TraceID/SpanID 可自动被 Agent 解析采集，默认已适配 OpenTelemetry、SkyWalking 的 Header 格式，如有自定义 Header 请修改 Agent 配置，具体参考 [Agent 高级配置](https://deepflow.io/docs/zh/install/advanced-config/agent-advanced-config/)
