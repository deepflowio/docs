---
title: HTTP
permalink: /features/l7-protocols/http
---

> This document was translated by ChatGPT

# HTTP

By parsing the HTTP protocol, the fields of HTTP Request/Response are mapped to the corresponding fields in `l7_flow_log`. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese         | Request Header       | Response Header  | Description                                                                                                   |
| -------- | ------------------ | --------------- | -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Req.     | version            | 协议版本        | Version in the first line | --               | --                                                                                                            |
|          | request_type       | 请求类型        | Method in the first line | --               | --                                                                                                            |
|          | request_domain     | 请求域名        | Host                 | --               | --                                                                                                            |
|          | request_resource   | 请求资源        | Path                 | --               | --                                                                                                            |
|          | request_id         | 请求 ID         | --                   | --               | --                                                                                                            |
|          | endpoint           | 端点            | Path                 | --               | The extraction rules can be defined by the Agent's `http-endpoint-extraction` configuration item              |
| Resp.    | response_code      | 响应码          | --                   | Status Code      | --                                                                                                            |
|          | response_status    | 响应状态        | --                   | Status Code      | Normal: 1XX/2XX/3XX; Client Error: 4XX; Server Error: 5XX                                                      |
|          | response_exception | 响应异常        | --                   | Status Code      | Description of Status Code, refer to [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|          | response_result    | 响应结果        | --                   | --               | --                                                                                                            |
| Trace    | trace_id           | TraceID         | traceparent, sw8 [1] | traceparent, sw8 | The header name to extract can be defined by the Agent's `http_log_trace_id` configuration item               |
|          | span_id            | SpanID          | traceparent, sw8 [2] | traceparent, sw8 | The header name to extract can be defined by the Agent's `http_log_span_id` configuration item                |
|          | x_request_id       | X-Request-ID    | X-Request-ID         | X-Request-ID     | The header name to extract can be defined by the Agent's `http_log_x_request_id` configuration item           |
|          | http_proxy_client  | HTTP 代理客户端 | X-Forwarded-For      | --               | The header name to extract can be defined by the Agent's `http_log_proxy_client` configuration item           |
| Misc.    | attribute.x        | --              | x                    | x                | Supports collecting custom header fields [3]                                                                  |

- [1] TraceID only extracts part of the value from the following HTTP Headers, other custom headers read the full value:
  - The `trace-id` part in the `traceparent` header
  - The `trace ID` part in the `sw8`/`sw6` header
  - The `{trace-id}` part in the `uber-trace-id` header
- [2] SpanID only extracts part of the value from the following HTTP Headers, other custom headers read the full value:
  - The `parent-id` part in the `traceparent` header
  - The `segment ID-span ID` part in the `sw8`/`sw6` header
  - The `{span-id}` part in the `uber-trace-id` header
- [3] The protocol header fields that need to be additionally collected can be defined in the collector configuration's `static_config.l7-protocol-advanced-features.extra-log-fields`. For example, when adding User-Agent and Cookie in the configuration, the fields `attribute.user_agent` and `attribute.cookie` can be viewed in the call logs.

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request Header | Response Header | Description                        |
| ------------------ | -------------- | -------------- | --------------- | ---------------------------------- |
| request            | 请求           | --             | --              | Number of Requests                 |
| response           | 响应           | --             | --              | Number of Responses                |
| session_length     | 会话长度       | --             | --              | Request length + Response length   |
| request_length     | 请求长度       | Content-Length | --              | --                                 |
| request_length     | 响应长度       | --             | Content-Length  | --                                 |
| log_count          | 日志总量       | --             | --              | Number of Request Log lines        |
| error              | 异常           | --             | --              | Client Error + Server Error        |
| client_error       | 客户端异常     | --             | Status Code     | Refer to the description of the Tag field `response_code` |
| server_error       | 服务端异常     | --             | Status Code     | Refer to the description of the Tag field `response_code` |
| error_ratio        | 异常比例       | --             | --              | Error / Response                   |
| client_error_ratio | 客户端异常比例 | --             | --              | Client Error / Response            |
| server_error_ratio | 服务端异常比例 | --             | --              | Server Error / Response            |

# HTTP2

By parsing the HTTP2 protocol, the fields of HTTP2 Request/Response are mapped to the corresponding fields in `l7_flow_log`. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese         | Request Header    | Response Header  | Description                                                                                                   |
| -------- | ------------------ | --------------- | ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Req.     | version            | 协议版本        | Version           | --               | --                                                                                                            |
|          | request_type       | 请求类型        | Method            | --               | --                                                                                                            |
|          | request_domain     | 请求域名        | Host or Authority | --               | --                                                                                                            |
|          | request_resource   | 请求资源        | Path              | --               | --                                                                                                            |
|          | request_id         | 请求 ID         | Stream ID         | Stream ID        | --                                                                                                            |
|          | endpoint           | 端点            | Path              | --               | --                                                                                                            |
| Resp.    | response_code      | 响应码          | --                | Status Code      | --                                                                                                            |
|          | response_status    | 响应状态        | --                | Status Code      | Normal: 1XX/2XX/3XX; Client Error: 4XX; Server Error: 5XX                                                      |
|          | response_exception | 响应异常        | --                | Status Code      | Description of Status Code, refer to [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|          | response_result    | 响应结果        | --                | --               | --                                                                                                            |
| Trace    | trace_id           | TraceID         | traceparent, sw8  | traceparent, sw8 | The header name to extract can be defined by the Agent's `http_log_trace_id` configuration item               |
|          | span_id            | SpanID          | traceparent, sw8  | traceparent, sw8 | The header name to extract can be defined by the Agent's `http_log_span_id` configuration item                |
|          | x_request_id       | X-Request-ID    | X-Request-ID      | X-Request-ID     | The header name to extract can be defined by the Agent's `http_log_x_request_id` configuration item           |
|          | http_proxy_client  | HTTP 代理客户端 | X-Forwarded-For   | --               | The header name to extract can be defined by the Agent's `http_log_proxy_client` configuration item           |
| Misc.    | attribute.x        | --              | x                 | x                | Supports collecting custom header fields [1]                                                                  |

- [1] The protocol header fields that need to be additionally collected can be defined in the collector configuration's `static_config.l7-protocol-advanced-features.extra-log-fields`. For example, when adding User-Agent and Cookie in the configuration, the fields `attribute.user_agent` and `attribute.cookie` can be viewed in the call logs.

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | HTTP2 Request Header | HTTP2 Response Header | Description                        |
| ------------------ | -------------- | -------------------- | --------------------- | ---------------------------------- |
| request            | 请求           | --                   | --                    | Number of Requests                 |
| response           | 响应           |                      | --                    | Number of Responses                |
| session_length     | 会话长度       | --                   | --                    | Request length + Response length   |
| request_length     | 请求长度       | Content-Length       | --                    | --                                 |
| request_length     | 响应长度       | --                   | Content-Length        | --                                 |
| log_count          | 日志总量       | --                   | --                    | --                                 |
| error              | 异常           | --                   | --                    | Client Error + Server Error        |
| client_error       | 客户端异常     | --                   | Status Code           | Refer to the description of the Tag field `response_code` |
| server_error       | 服务端异常     | --                   | Status Code           | Refer to the description of the Tag field `response_code` |
| error_ratio        | 异常比例       | --                   | --                    | Error / Response                   |
| client_error_ratio | 客户端异常比例 | --                   | --                    | Client Error / Response            |
| server_error_ratio | 服务端异常比例 | --                   | --                    | Server Error / Response            |