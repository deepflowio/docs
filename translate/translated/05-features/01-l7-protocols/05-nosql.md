---
title: NoSQL
permalink: /features/l7-protocols/nosql
---

> This document was translated by ChatGPT

# Redis

By parsing the [Redis](https://redis.io/docs/reference/protocol-spec/) protocol, the fields of Redis Request / Response are mapped to the corresponding fields in `l7_flow_log`. The mapping relationship is shown in the table below:

**Tag field mapping table — only fields with mapping relationships are included below**

| Category | Name               | Chinese       | Request Header     | Response Header   | Description                                                                 |
| -------- | ------------------ | ------------- | ------------------ | ----------------- | --------------------------------------------------------------------------- |
| Req.     | version            | 协议版本       | --                 | --                | --                                                                          |
|          | request_type       | 请求类型       | First word in Payload | --             | --                                                                          |
|          | request_domain     | 请求域名       | --                 | --                | --                                                                          |
|          | request_resource   | 请求资源       | Remaining characters in Payload | -- | --                                                                          |
|          | request_id         | 请求 ID        | --                 | --                | --                                                                          |
|          | endpoint           | 端点           | --                 | --                | --                                                                          |
| Resp.    | response_code      | 响应码         | --                 | --                | --                                                                          |
|          | response_status    | 响应状态       | --                 | ERR message       | Normal: no `ERR` message; Server error: ERR message                         |
|          | response_exception | 响应异常       | --                 | ERR message Payload | --                                                                        |
|          | response_result    | 响应结果       | --                 | --                | --                                                                          |
| Trace    | trace_id           | TraceID        | --                 | --                | --                                                                          |
|          | span_id            | SpanID         | --                 | --                | --                                                                          |
|          | x_request_id       | X-Request-ID   | --                 | --                | --                                                                          |
| Misc.    | --                 | --             | --                 | --                | --                                                                          |

**Metrics field mapping table — only fields with mapping relationships are included below**

| Name                | Chinese         | Request | Response                                | Description                                      |
| ------------------- | --------------- | ------- | --------------------------------------- | ------------------------------------------------ |
| request             | 请求             | --      | --                                      | Number of requests                               |
| response            | 响应             | --      |                                         | Number of responses                              |
| sql_affected_rows   | SQL 影响行数     | --      | Affected Rows in `command complete` message | --                                           |
| log_count           | 日志总量         | --      | --                                      | --                                               |
| error               | 异常             | --      | --                                      | Client errors + Server errors                    |
| client_error        | 客户端异常       | --      | --                                      | --                                               |
| server_error        | 服务端异常       | --      | `ERR` message                           | See description of Tag field `response_code`     |
| error_ratio         | 异常比例         | --      | --                                      | Errors / Responses                               |
| client_error_ratio  | 客户端异常比例   | --      | --                                      | Client errors / Responses                        |
| server_error_ratio  | 服务端异常比例   | --      | --                                      | Server errors / Responses                        |

# MongoDB

By parsing the [MongoDB](https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/) protocol, the fields of MongoDB Request / Response are mapped to the corresponding fields in `l7_flow_log`. The mapping relationship is shown in the table below:

**Tag field mapping table — only fields with mapping relationships are included below**

| Category | Name               | Chinese       | Request Header | Response Header          | Description                  |
| -------- | ------------------ | ------------- | -------------- | ------------------------ | ---------------------------- |
| Req.     | version            | 协议版本       | --             | --                       | --                           |
|          | request_type       | 请求类型       | OpCode         | --                       | --                           |
|          | request_domain     | 请求域名       | --             | --                       | --                           |
|          | request_resource   | 请求资源       | BodyDocument   | --                       | --                           |
|          | request_id         | 请求 ID        | --             | --                       | --                           |
|          | endpoint           | 端点           | --             | --                       | --                           |
| Resp.    | response_code      | 响应码         | --             | Code in BodyDocument     | --                           |
|          | response_status    | 响应状态       | --             | Code in BodyDocument     | Determined based on Code     |
|          | response_exception | 响应异常       | --             | errmsg in BodyDocument   | --                           |
|          | response_result    | 响应结果       | --             | --                       | --                           |
| Trace    | trace_id           | TraceID        | --             | --                       | --                           |
|          | span_id            | SpanID         | --             | --                       | --                           |
|          | x_request_id       | X-Request-ID   | --             | --                       | --                           |
| Misc.    | --                 | --             | --             | --                       | --                           |

**Metrics field mapping table — only fields with mapping relationships are included below**

| Name                | Chinese         | Request | Response  | Description                                      |
| ------------------- | --------------- | ------- | --------- | ------------------------------------------------ |
| request             | 请求             | --      | --        | Number of requests                               |
| response            | 响应             | --      |           | Number of responses                              |
| error               | 异常             | --      | --        | Client errors + Server errors                    |
| client_error        | 客户端异常       | --      | --        | --                                               |
| server_error        | 服务端异常       | --      | `ERR` message | See description of Tag field `response_code` |
| error_ratio         | 异常比例         | --      | --        | Errors / Responses                               |
| client_error_ratio  | 客户端异常比例   | --      | --        | Client errors / Responses                        |
| server_error_ratio  | 服务端异常比例   | --      | --        | Server errors / Responses                        |

# Memcached

By parsing the [Memcached](https://github.com/memcached/memcached/blob/master/doc/protocol.txt) protocol, the fields of Memcached Request / Response are mapped to the corresponding fields in `l7_flow_log`. The mapping relationship is shown in the table below:

**Tag field mapping table — only fields with mapping relationships are included below**

| Category | Name               | Chinese       | Request Header             | Response Header                  | Description                  |
| -------- | ------------------ | ------------- | -------------------------- | --------------------------------- | ---------------------------- |
| Req.     | version            | 协议版本       | --                         | --                                | --                           |
|          | request_type       | 请求类型       | First word in Payload      | --                                | --                           |
|          | request_domain     | 请求域名       | --                         | --                                | --                           |
|          | request_resource   | 请求资源       | First line in Payload (\r\n) | --                              | --                           |
|          | request_id         | 请求 ID        | --                         | --                                | --                           |
|          | endpoint           | 端点           | --                         | --                                | --                           |
| Resp.    | response_code      | 响应码         | --                         | --                                | --                           |
|          | response_status    | 响应状态       | --                         | First word in Payload             | --                           |
|          | response_exception | 响应异常       | --                         | Error message in first line of Payload when exception occurs | -- |
|          | response_result    | 响应结果       | --                         | First line in Payload             | --                           |
| Trace    | trace_id           | TraceID        | --                         | --                                | --                           |
|          | span_id            | SpanID         | --                         | --                                | --                           |
|          | x_request_id       | X-Request-ID   | --                         | --                                | --                           |
| Misc.    | --                 | --             | --                         | --                                | --                           |

**Metrics field mapping table — only fields with mapping relationships are included below**

| Name                | Chinese         | Request | Response  | Description                                      |
| ------------------- | --------------- | ------- | --------- | ------------------------------------------------ |
| request             | 请求             | --      | --        | Number of requests                               |
| response            | 响应             | --      |           | Number of responses                              |
| error               | 异常             | --      | --        | Client errors + Server errors                    |
| client_error        | 客户端异常       | --      | --        | --                                               |
| server_error        | 服务端异常       | --      | `ERR` message | See description of Tag field `response_code` |
| error_ratio         | 异常比例         | --      | --        | Errors / Responses                               |
| client_error_ratio  | 客户端异常比例   | --      | --        | Client errors / Responses                        |
| server_error_ratio  | 服务端异常比例   | --      | --        | Server errors / Responses                        |