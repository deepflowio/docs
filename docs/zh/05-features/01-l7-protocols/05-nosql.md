---
title: NoSQL
permalink: /features/l7-protocols/nosql
---

# Redis

通过解析 [Redis](https://redis.io/docs/reference/protocol-spec/) 协议，将 Redis Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header   | Response Header  | 描述                                      |
| ----- | ------------------ | ------------ | ---------------- | ---------------- | ----------------------------------------- |
| Req.  | version            | 协议版本     | --               | --               | --                                        |
|       | request_type       | 请求类型     | Payload 首个单词 | --               | --                                        |
|       | request_domain     | 请求域名     | --               | --               | --                                        |
|       | request_resource   | 请求资源     | Payload 余下字符 | --               | --                                        |
|       | request_id         | 请求 ID      | --               | --               | --                                        |
|       | endpoint           | 端点         | --               | --               | --                                        |
| Resp. | response_code      | 响应码       | --               | --               | --                                        |
|       | response_status    | 响应状态     | --               | ERR 消息         | 正常: 无 `ERR` 消息; 服务端异常: ERR 消息 |
|       | response_exception | 响应异常     | --               | ERR 消息 Payload | --                                        |
|       | response_result    | 响应结果     | --               | --               | --                                        |
| Trace | trace_id           | TraceID      | --               | --               | --                                        |
|       | span_id            | SpanID       | --               | --               | --                                        |
|       | x_request_id       | X-Request-ID | --               | --               | --                                        |
| Misc. | --                 | --           | --               | --               | --                                        |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response                                | 描述                               |
| ------------------ | -------------- | ------- | --------------------------------------- | ---------------------------------- |
| request            | 请求           | --      | --                                      | Request 个数                       |
| response           | 响应           | --      |                                         | Response 个数                      |
| sql_affected_rows  | SQL 影响行数   | --      | `command complete` 报文的 Affected Rows | --                                 |
| log_count          | 日志总量       | --      | --                                      | --                                 |
| error              | 异常           | --      | --                                      | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | --                                      | --                                 |
| server_error       | 服务端异常     | --      | `ERR`报文                               | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --                                      | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --                                      | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --                                      | 服务端异常 / 响应                  |

# MongoDB

通过解析 [MongoDB](https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/) 协议，将 MongoDB Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header | Response Header        | 描述           |
| ----- | ------------------ | ------------ | -------------- | ---------------------- | -------------- |
| Req.  | version            | 协议版本     | --             | --                     | --             |
|       | request_type       | 请求类型     | OpCode         | --                     | --             |
|       | request_domain     | 请求域名     | --             | --                     | --             |
|       | request_resource   | 请求资源     | BodyDocument   | --                     | --             |
|       | request_id         | 请求 ID      | --             | --                     | --             |
|       | endpoint           | 端点         | --             | --                     | --             |
| Resp. | response_code      | 响应码       | --             | BodyDocument 的 Code   | --             |
|       | response_status    | 响应状态     | --             | BodyDocument 的 Code   | 根据 Code 判断 |
|       | response_exception | 响应异常     | --             | BodyDocument 的 errmsg | --             |
|       | response_result    | 响应结果     | --             | --                     | --             |
| Trace | trace_id           | TraceID      | --             | --                     | --             |
|       | span_id            | SpanID       | --             | --                     | --             |
|       | x_request_id       | X-Request-ID | --             | --                     | --             |
| Misc. | --                 | --           | --             | --                     | --             |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response  | 描述                               |
| ------------------ | -------------- | ------- | --------- | ---------------------------------- |
| request            | 请求           | --      | --        | Request 个数                       |
| response           | 响应           | --      |           | Response 个数                      |
| error              | 异常           | --      | --        | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | --        | --                                 |
| server_error       | 服务端异常     | --      | `ERR`报文 | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --        | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --        | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --        | 服务端异常 / 响应                  |
