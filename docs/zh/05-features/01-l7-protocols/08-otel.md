---
title: OpenTelemetry
permalink: /features/l7-protocols/otel
---

通过解析 OpenTelemetry 协议，将 OpenTelemetry 协议的数据结构的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                 | 中文        | OpenTelemetry 数据结构 | 描述 |
| ------------------- | ----------- | ---------------------- | ---- |
| start_time          | 开始时间     | span.start_time_unix_nano | -- |
| end_time            | 结束时间     | span.end_time_unix_nano   | -- |
| protocol            | 网络协议     | span.attribute.net.transport | 映射到对应的枚举值 |
| attributes          | Misc.butes   | resource./span.attributes | -- |
| ip                  | IP 地址      | span.attribute.app.host.ip/attribute.net.peer.ip | 详细说明见后面段落 |
| l7_protocol         | 应用协议     | span.attribute.http.scheme/db.system/rpc.system/messaging.system/messaging.protocol | 映射到对应的枚举值 |
| l7_protocol_str     | 应用协议     | span.attribute.http.scheme/db.system/rpc.system/messaging.system/messaging.protocol | -- |
| version             | 协议版本     | span.attribute.http.flavor | -- |
| type                | 日志类型     | 会话 | -- |
| request_type        | 请求类型     | span.attribute.http.method/db.operation/rpc.method | -- |
| request_domain      | 请求域名     | span.attribute.http.host/db.connection_string | -- |
| request_resource    | 请求资源     | attribute.http.target/db.statement/messaging.url/rpc.service | -- |
| request_id          | 请求 ID      |
| response_status     | 响应状态     | 响应码=span.attribute.http.status_code 参考 HTTP 协议定义; 响应码=span.status.code，未知: STATUS_CODE_UNSET; 正常: STATUS_CODE_OK; 服务端异常: STATUS_CODE_ERROR | -- |
| response_code       | 响应码       | span.attribute.http.status_code/span.status.code  | 优先使用 span.attribute.http.status_code |
| response_exception  | 响应异常     | 响应码=span.attribute.http.status_code 参考 HTTP 协议定义; 响应码=span.status.code，则对应 `span.status.message` | -- |
| service_name        | 服务名称     | resource./span.attribute.service.name | -- |
| service_instance_id | 服务实例     | resource./span.attribute.service.instance.id | -- |
| endpoint            | 端点         | span.name | -- |
| trace_id            | TraceID      | span.trace_id/attribute.sw8.trace_id | 优先使用 attribute.sw8.trace_id |
| span_id             | SpanID       | span.span_id/attribute.sw8.segment_id-attribute.sw8.span_id | 优先使用 attribute.sw8.segment_id-attribute.sw8.span_id |
| parent_span_id      | ParentSpanID | span.parent_span_id/attribute.sw8.segment_id-attribute.sw8.parent_span_id | 优先使用attribute.sw8.segment_id-attribute.sw8.parent_span_id |
| span_kind           | Span 类型    | span.span_kind | -- |
| observation_point   | 观测点       | span.spankind.SPAN_KIND_CLIENT/SPAN_KIND_PRODUCER：客户端应用(c-app)；span.spankind.SPAN_KIND_SERVER/SPAN_KIND_CONSUMER：服务端应用(s-app)；span.spankind.SPAN_KIND_UNSPECIFIED/SPAN_KIND_INTERNAL：应用(app) | -- |

- observation_point = c-app
  - span.attribute.app.host.ip 对应 ip_0; 其余都对应 ip_1
    - 通过一个 [k8s attributes processor 插件](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/k8sattributesprocessor#section-readme)获取当前应用 (otel-agent) 对应上一级（即 Span 的来源）的 IP 地址，例如：Span 为 POD 产生，则获取 POD 的 IP；Span 为部署在虚拟机上的进程产生，则获取虚拟机的 IP
  - span.attribute.net.peer.ip 对应 ip_1; 其余都对应 ip_0

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                                           | 中文            |  OpenTelemetry 数据结构                    |  描述 |
| ---------------------------------------------- | -------------- | ------------------------------------------- | -- |
| request                                         |请求           | Span 个数                                                      | -- |
| response                                        |响应           | Span 个数                                                      | -- |
| session_length                                  |会话长度       |                                                                | 请求长度 + 响应长度 |
| request_length                                  |请求长度       | span.attribute.http.request_content_length                     | -- |
| request_length                                  |响应长度       | span.attribute.http.response_content_length                    | -- |
| sql_affected_rows                               |SQL影响行数    | span.attribute.db.cassandra.page_size                          | -- |
| log_count                                       |日志总量       | Span 个数                                                      | Request Log 行数 |
| error                                           |异常           | --                                                             | 客户端异常 + 服务端异常 |
| client_error                                    |客户端异常     | span.attribute.http.status_code/span.status.code               | 参考 Tag 字段`response_code`的说明 |
| server_error                                    |服务端异常     | span.attribute.http.status_code/span.status.code               | 参考 Tag 字段`response_code`的说明 |
| error_ratio                                     |异常比例       | --                                                             | 异常 / 响应 |
| client_error_ratio                              |客户端异常比例 | --        | 客户端异常 / 响应                                  |
| server_error_ratio                              |服务端异常比例 | --        | 服务端异常 / 响应                                  |
| message.uncompressed_size                       | --            | span.attribute.message.uncompressed_size                       | -- |
| messaging.message_payload_size_bytes            | --            | span.attribute.messaging.message_payload_size_bytes            | -- |
| messaging.message_payload_compressed_size_bytes | --            | span.attribute.messaging.message_payload_compressed_size_bytes | -- |
