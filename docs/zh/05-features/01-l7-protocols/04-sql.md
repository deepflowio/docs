---
title: SQL
permalink: /features/l7-protocols/sql
---

# MySQL

通过解析 [MySQL](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_basics.html) 协议，将 MySQL Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                      | 中文            | Request Header | Response Header | 描述 |
| ----- | ------------------------- | --------------- | -------------- | --------------- | ---- |
| Req.  | version                   | 协议版本        | --             | --              | --   |
|       | request_type              | 请求类型        | Command        | --              | 支持解析的命令详见 [1] |
|       | request_domain            | 请求域名        | --             | --              | --   |
|       | request_resource          | 请求资源        | Statement 或 COM_STMT_EXECUTE | --              | 解析 `COM_STMT_EXECUTE` 详见 [4]   |
|       | request_id                | 请求 ID         | Statement ID   | Statement ID    | 从 `COM_STMT_PREPARE` 响应、`COM_STMT_EXECUTE` 请求中提取 |
|       | endpoint                  | 端点            | --             | --              | --   |
| Resp. | response_code             | 响应码          | --             | Error Code      | --   |
|       | response_status           | 响应状态        | --             | Error Code      | 正常: 非 `ERR` 消息; 客户端异常/服务端异常详见 [2] |
|       | response_exception        | 响应异常        | --             | Error Message   | --   |
|       | response_result           | 响应结果        | --             | --              | --   |
| Trace | trace_id                  | TraceID         | SQL Comments   | --              | 注释中的 TraceID 支持提取，提取及配置方法详见 [3] |
|       | span_id                   | SpanID          | SQL Comments   | --              | 注释中的 TraceID 支持提取，提取及配置方法详见 [3] |
|       | x_request_id              | X-Request-ID    | --             | --              | --   |
| Misc. | --                        | --              | --             | --              | --   |

- [1] 目前支持解析的命令：`COM_QUERY`、`COM_QUIT`、`COM_INIT_DB`、`COM_FIELD_LIST`、`COM_STMT_PREPARE`、`COM_STMT_EXECUTE`、`COM_STMT_FETCH`、`COM_STMT_CLOSE`。
- [2] 客户端异常：Error Code=2000-2999，或客户端发送 1-999；服务端异常：Error Code=1000-1999/3000-4000，或服务端发送 1-999。
- [3] 当应用在 SQL 语句的注释中注入 TraceID（或复合的 TraceID + SpanID）时，DeepFlow 支持提取并用于跨线程的分布式追踪。DeepFlow 支持提取几乎任意位置的 SQL 注释（但必须出现在 AF_PACKET 获取到的首包中，或者 eBPF 获取到的第一个 Socket Data 中）；注释中的键值对可以用冒号 `:` 和空格 ` ` 分割，也可以用等号 `=` 和逗号 `,` 分割，但注意字段中**不能**包含冒号或等号。
- [4] 提取 `COM_STMT_EXECUTE` 中的参数不能开启采集器高级配置 `obfuscate-enabled-protocols`; 参数会使用**空格+逗号+空格**（例如 `123 , abc`）拼接赋值给 `request_resource`; 当流量出现乱序、丢包、重传、截断等会导致参数解析错误。
  ```sql
  /* your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4 */ SELECT col FROM tbl
  SELECT /* your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4 */ col FROM tbl
  SELECT col FROM tbl # your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4
  SELECT col FROM tbl -- your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4
  SELECT col FROM tbl # your_trace_key=648840f6-7f92-468b-b298-d38f05c541d4
  ```
  虽然如此，我们**强烈建议您在 SQL 语句头部添加注释**，以降低 SQL 解析的性能开销。上面的示例中，`your_trace_key` 取决于 Agent 配置项中 `http_log_trace_id` 的值（但请注意如果使用 traceparent / sw8 / uber-trace-id，请遵循 [OpenTelemetry](https://www.w3.org/TR/trace-context/#traceparent-header-field-values) / [SkyWalking](https://skywalking.apache.org/docs/main/next/en/api/x-process-propagation-headers-v3/) / [Jaeger](https://www.jaegertracing.io/docs/1.54/client-libraries/#tracespan-identity) 的协议规范）。例如当 `http_log_trace_id = traceparent, sw8` 时，DeepFlow 能够从 `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01` 中提取符合 OpenTelemetry 规范的 TraceID 和 SpanID：
  ```sql
  /* traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01 */ SELECT col FROM tbl
  ```

注意，以下为单向消息，会被直接保存为 type=session 的调用日志：
- COM_STMT_CLOSE
- COM_QUIT

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | Request | Response             | 描述        |
| ------------------ | -------------- | -------- | ------------------- | ----------- |
| request            | 请求           | --  | --                        | Request 个数 |
| response           | 响应           | --  | --                        | Response 个数 |
| sql_affected_rows  | SQL影响行数    | --  | `OK` 报文的 Affected Rows | -- |
| log_count          | 日志总量       | --  | --                        | -- |
| error              | 异常           | --  | --                        | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --  | ERROR CODE                | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --  | ERROR CODE                | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --  | --                        | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --  | --                        | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --  | --                        | 服务端异常 / 响应 |

# PostgreSQL

通过解析 [PostgreSQL](https://www.postgresql.org/docs/15/protocol-message-formats.html) 协议，将 PostgreSQL Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header             | Response Header  | 描述 |
| ----- | ------------------ | ------------ | -------------------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | --                         | --               | --   |
|       | request_type       | 请求类型     | char tag                   | --               | 仅 `regular` 消息 |
|       | request_domain     | 请求域名     | --                         | --               | --   |
|       | request_resource   | 请求资源     | payload                    | --               | 仅 `regular` 消息 |
|       | request_id         | 请求 ID      | --                         | --               | --   |
|       | endpoint           | 端点         | --                         | --               | --   |
| Resp. | response_code      | 响应码       | --                         | --               | --   |
|       | response_status    | 响应状态     | --                         | Error Code       | 正常: 非 `error return` 消息; 客户端异常/服务端异常详见 [1] |
|       | response_exception | 响应异常     | --                         | Error Code       | Error Code 的[英文描述](https://www.postgresql.org/docs/10/errcodes-appendix.html) |
|       | response_result    | 响应结果     | --                         | Error Code       | 仅 `error return` 消息 |
| Trace | trace_id           | TraceID      | --                         | --               | --   |
|       | span_id            | SpanID       | --                         | --               | --   |
|       | x_request_id       | X-Request-ID | --                         | --               | --   |
| Misc. | --                 | --           | --                         | --               | --   |

- [1] 错误码分类
  - 客户端异常：Error Code=03/0A/0B/0F/0L/0P/20/22/23/26/2F/34/3D/3F/42
  - 服务端异常：Error Code=08/09/0Z/21/24/25/27/28/2B/2D/38/39/3B/40/44/53/54/55/57/5/72/F0/HV/P0/XX

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | Request               | Response                               | 描述        |
| ------------------ | -------------- | --------------------- | -------------------------------------- | ----------- |
| request            | 请求           | --                    | --                                      | Request 个数 |
| response           | 响应           | --                    |                                         | Response 个数 |
| sql_affected_rows  | SQL影响行数    | --                    | `command complete` 报文的 Affected Rows | -- |
| log_count          | 日志总量       | --                    | --                                      | -- |
| error              | 异常           | --                    | --                                      | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --                    | Error Code                              | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --                    | Error Code                              | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --                    | --                                      | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --                    | --                                      | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --                    | --                                      | 服务端异常 / 响应 |
