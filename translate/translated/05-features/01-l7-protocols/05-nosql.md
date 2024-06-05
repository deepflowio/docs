---
title: NoSQL
permalink: /features/l7-protocols/nosql
---

> This document was translated by ChatGPT

# Redis

By parsing the [Redis](https://redis.io/docs/reference/protocol-spec/) protocol, the fields of Redis Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese      | Request Header                  | Response Header     | Description                                         |
| -------- | ------------------ | ------------ | ------------------------------- | ------------------- | --------------------------------------------------- |
| Req.     | version            | 协议版本     | --                              | --                  | --                                                  |
|          | request_type       | 请求类型     | First word of Payload           | --                  | --                                                  |
|          | request_domain     | 请求域名     | --                              | --                  | --                                                  |
|          | request_resource   | 请求资源     | Remaining characters of Payload | --                  | --                                                  |
|          | request_id         | 请求 ID      | --                              | --                  | --                                                  |
|          | endpoint           | 端点         | --                              | --                  | --                                                  |
| Resp.    | response_code      | 响应码       | --                              | --                  | --                                                  |
|          | response_status    | 响应状态     | --                              | ERR message         | Normal: No `ERR` message; Server error: ERR message |
|          | response_exception | 响应异常     | --                              | ERR message Payload | --                                                  |
|          | response_result    | 响应结果     | --                              | --                  | --                                                  |
| Trace    | trace_id           | TraceID      | --                              | --                  | --                                                  |
|          | span_id            | SpanID       | --                              | --                  | --                                                  |
|          | x_request_id       | X-Request-ID | --                              | --                  | --                                                  |
| Misc.    | --                 | --           | --                              | --                  | --                                                  |

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request | Response                                    | Description                                           |
| ------------------ | -------------- | ------- | ------------------------------------------- | ----------------------------------------------------- |
| request            | 请求           | --      | --                                          | Number of Requests                                    |
| response           | 响应           | --      | --                                          | Number of Responses                                   |
| sql_affected_rows  | SQL 影响行数   | --      | Affected Rows of `command complete` message | --                                                    |
| log_count          | 日志总量       | --      | --                                          | --                                                    |
| error              | 异常           | --      | --                                          | Client error + Server error                           |
| client_error       | 客户端异常     | --      | --                                          | --                                                    |
| server_error       | 服务端异常     | --      | `ERR` message                               | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --      | --                                          | Error / Response                                      |
| client_error_ratio | 客户端异常比例 | --      | --                                          | Client error / Response                               |
| server_error_ratio | 服务端异常比例 | --      | --                                          | Server error / Response                               |

# MongoDB

By parsing the [MongoDB](https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/) protocol, the fields of MongoDB Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese      | Request Header | Response Header        | Description    |
| -------- | ------------------ | ------------ | -------------- | ---------------------- | -------------- |
| Req.     | version            | 协议版本     | --             | --                     | --             |
|          | request_type       | 请求类型     | OpCode         | --                     | --             |
|          | request_domain     | 请求域名     | --             | --                     | --             |
|          | request_resource   | 请求资源     | BodyDocument   | --                     | --             |
|          | request_id         | 请求 ID      | --             | --                     | --             |
|          | endpoint           | 端点         | --             | --                     | --             |
| Resp.    | response_code      | 响应码       | --             | Code of BodyDocument   | --             |
|          | response_status    | 响应状态     | --             | Code of BodyDocument   | Judged by Code |
|          | response_exception | 响应异常     | --             | errmsg of BodyDocument | --             |
|          | response_result    | 响应结果     | --             | --                     | --             |
| Trace    | trace_id           | TraceID      | --             | --                     | --             |
|          | span_id            | SpanID       | --             | --                     | --             |
|          | x_request_id       | X-Request-ID | --             | --                     | --             |
| Misc.    | --                 | --           | --             | --                     | --             |

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request | Response      | Description                                           |
| ------------------ | -------------- | ------- | ------------- | ----------------------------------------------------- |
| request            | 请求           | --      | --            | Number of Requests                                    |
| response           | 响应           | --      | --            | Number of Responses                                   |
| error              | 异常           | --      | --            | Client error + Server error                           |
| client_error       | 客户端异常     | --      | --            | --                                                    |
| server_error       | 服务端异常     | --      | `ERR` message | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --      | --            | Error / Response                                      |
| client_error_ratio | 客户端异常比例 | --      | --            | Client error / Response                               |
| server_error_ratio | 服务端异常比例 | --      | --            | Server error / Response                               |
