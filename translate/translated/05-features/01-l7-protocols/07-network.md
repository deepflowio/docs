---
title: Network
permalink: /features/l7-protocols/network
---

> This document was translated by ChatGPT

# DNS

By parsing the [DNS](https://www.ietf.org/rfc/rfc1035.txt) protocol, the fields of DNS Request / Response are mapped to the corresponding fields in `l7_flow_log`. The mapping relationship is shown in the table below:

**Tag field mapping table — only fields with mapping relationships are included**

| Category | Name               | Chinese       | Request Header | Response Header | Description                                                                                   |
| -------- | ------------------ | ------------- | -------------- | --------------- | --------------------------------------------------------------------------------------------- |
| Req.     | version            | 协议版本      | --             | --              | --                                                                                            |
|          | request_type       | 请求类型      | QTYPE          | --              | --                                                                                            |
|          | request_domain     | 请求域名      | QNAME          | --              | Only populated when querying IPv4 or IPv6 addresses                                           |
|          | request_resource   | 请求资源      | QNAME          | --              | --                                                                                            |
|          | request_id         | 请求 ID       | ID             | ID              | --                                                                                            |
|          | endpoint           | 端点          | QNAME          | --              | --                                                                                            |
| Resp.    | response_code      | 响应码        | --             | RCODE           | --                                                                                            |
|          | response_status    | 响应状态      | --             | RCODE           | Normal: RCODE=0x0; Client error: RCODE=0x1/0x3; Server error: others                          |
|          | response_exception | 响应异常      | --             | RCODE           | Description of RCODE, see [RFC 2929 Section 2.3](https://www.rfc-editor.org/rfc/rfc2929#section-2.3) |
|          | response_result    | 响应结果      | --             | RDATA           | --                                                                                            |
| Trace    | trace_id           | TraceID       | --             | --              | --                                                                                            |
|          | span_id            | SpanID        | --             | --              | --                                                                                            |
|          | x_request_id       | X-Request-ID  | --             | --              | --                                                                                            |
| Misc.    | --                 | --            | --             | --              | --                                                                                            |

**Metrics field mapping table — only fields with mapping relationships are included**

| Name               | Chinese         | Request | Response | Description                                            |
| ------------------ | --------------- | ------- | -------- | ------------------------------------------------------ |
| request            | 请求            | --      | --       | Number of Requests                                     |
| response           | 响应            | --      | --       | Number of Responses                                    |
| log_count          | 日志总量        | --      | --       | Number of Request Log entries                          |
| error              | 异常            | --      | --       | Client errors + Server errors                          |
| client_error       | 客户端异常      | --      | RCODE    | See the description of Tag field `response_code`       |
| server_error       | 服务端异常      | --      | RCODE    | See the description of Tag field `response_code`       |
| error_ratio        | 异常比例        | --      | --       | Errors / Responses                                     |
| client_error_ratio | 客户端异常比例  | --      | --       | Client errors / Responses                              |
| server_error_ratio | 服务端异常比例  | --      | --       | Server errors / Responses                              |

# Ping

By parsing Echo messages in the [ICMP](https://www.rfc-editor.org/rfc/rfc792) protocol, the fields of Echo Request / Response are mapped to the corresponding fields in `l7_flow_log`. The mapping relationship is shown in the table below:

**Tag field mapping table — only fields with mapping relationships are included**

| Category | Name               | Chinese       | Request Header  | Response Header | Description                                                        |
| -------- | ------------------ | ------------- | --------------- | --------------- | ------------------------------------------------------------------ |
| Req.     | version            | 协议版本      | --              | --              | --                                                                 |
|          | request_resource   | 请求资源      | Identifier      | --              | --                                                                 |
|          | request_id         | 请求 ID       | Sequence Number | --              | --                                                                 |
|          | endpoint           | 端点          | --              | --              | --                                                                 |
| Resp.    | response_code      | 响应码        | --              | --              | --                                                                 |
|          | response_status    | 响应状态      | --              | --              | If a response is received, record as normal; if not, record as timeout |
|          | response_exception | 响应异常      | --              | --              | --                                                                 |
|          | response_result    | 响应结果      | --              | --              | --                                                                 |
| Trace    | trace_id           | TraceID       | --              | --              | --                                                                 |
|          | span_id            | SpanID        | --              | --              | --                                                                 |
|          | x_request_id       | X-Request-ID  | --              | --              | --                                                                 |
| Misc.    | --                 | --            | --              | --              | --                                                                 |

**Metrics field mapping table — only fields with mapping relationships are included**

| Name               | Chinese         | Request | Response | Description                                            |
| ------------------ | --------------- | ------- | -------- | ------------------------------------------------------ |
| request            | 请求            | --      | --       | Number of Requests                                     |
| response           | 响应            | --      | --       | Number of Responses                                    |
| log_count          | 日志总量        | --      | --       | Number of Request Log entries                          |
| error              | 异常            | --      | --       | Client errors + Server errors                          |
| client_error       | 客户端异常      | --      | --       | See the description of Tag field `response_code`       |
| server_error       | 服务端异常      | --      | --       | See the description of Tag field `response_code`       |
| error_ratio        | 异常比例        | --      | --       | Errors / Responses                                     |
| client_error_ratio | 客户端异常比例  | --      | --       | Client errors / Responses                              |
| server_error_ratio | 服务端异常比例  | --      | --       | Server errors / Responses                              |