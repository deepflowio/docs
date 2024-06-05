---
title: SQL
permalink: /features/l7-protocols/sql
---

> This document was translated by ChatGPT

# MySQL

By parsing the [MySQL](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_basics.html) protocol, the fields of MySQL Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese      | Request Header                | Response Header | Description                                                               |
| -------- | ------------------ | ------------ | ----------------------------- | --------------- | ------------------------------------------------------------------------- |
| Req.     | version            | 协议版本     | --                            | --              | --                                                                        |
|          | request_type       | 请求类型     | Command                       | --              | Supported commands for parsing, see [1]                                   |
|          | request_domain     | 请求域名     | --                            | --              | --                                                                        |
|          | request_resource   | 请求资源     | Statement or COM_STMT_EXECUTE | --              | Parsing `COM_STMT_EXECUTE`, see [4]                                       |
|          | request_id         | 请求 ID      | Statement ID                  | Statement ID    | Extracted from `COM_STMT_PREPARE` response and `COM_STMT_EXECUTE` request |
|          | endpoint           | 端点         | --                            | --              | --                                                                        |
| Resp.    | response_code      | 响应码       | --                            | Error Code      | --                                                                        |
|          | response_status    | 响应状态     | --                            | Error Code      | Normal: non-`ERR` messages; Client/Server exceptions, see [2]             |
|          | response_exception | 响应异常     | --                            | Error Message   | --                                                                        |
|          | response_result    | 响应结果     | --                            | --              | --                                                                        |
| Trace    | trace_id           | TraceID      | SQL Comments                  | --              | TraceID extraction from comments, see [3]                                 |
|          | span_id            | SpanID       | SQL Comments                  | --              | TraceID extraction from comments, see [3]                                 |
|          | x_request_id       | X-Request-ID | --                            | --              | --                                                                        |
| Misc.    | --                 | --           | --                            | --              | --                                                                        |

- [1] Currently supported commands: `COM_QUERY`, `COM_QUIT`, `COM_INIT_DB`, `COM_FIELD_LIST`, `COM_STMT_PREPARE`, `COM_STMT_EXECUTE`, `COM_STMT_FETCH`, `COM_STMT_CLOSE`.
- [2] Client exceptions: Error Code=2000-2999, or client sends 1-999; Server exceptions: Error Code=1000-1999/3000-4000, or server sends 1-999.
- [3] When the application injects TraceID (or composite TraceID + SpanID) in SQL comments, DeepFlow supports extraction for cross-thread distributed tracing. DeepFlow can extract from almost any position in SQL comments (but must appear in the first packet captured by AF_PACKET or the first Socket Data captured by eBPF); key-value pairs in comments can be separated by colon `:` and space ` `, or by equals sign `=` and comma `,`, but note that fields **cannot** contain colons or equals signs.
- [4] Extracting parameters in `COM_STMT_EXECUTE` cannot enable the collector's advanced configuration `obfuscate-enabled-protocols`; parameters will be concatenated with **space + comma + space** (e.g., `123 , abc`) and assigned to `request_resource`; issues like out-of-order, packet loss, retransmission, truncation can cause parameter parsing errors.
  ```sql
  /* your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4 */ SELECT col FROM tbl
  SELECT /* your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4 */ col FROM tbl
  SELECT col FROM tbl # your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4
  SELECT col FROM tbl -- your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4
  SELECT col FROM tbl # your_trace_key=648840f6-7f92-468b-b298-d38f05c541d4
  ```
  Nevertheless, we **strongly recommend adding comments at the beginning of SQL statements** to reduce the performance overhead of SQL parsing. In the examples above, `your_trace_key` depends on the value of `http_log_trace_id` in the Agent configuration (but note that if using traceparent / sw8 / uber-trace-id, please follow the protocol specifications of [OpenTelemetry](https://www.w3.org/TR/trace-context/#traceparent-header-field-values) / [SkyWalking](https://skywalking.apache.org/docs/main/next/en/api/x-process-propagation-headers-v3/) / [Jaeger](https://www.jaegertracing.io/docs/1.54/client-libraries/#tracespan-identity)). For example, when `http_log_trace_id = traceparent, sw8`, DeepFlow can extract TraceID and SpanID conforming to OpenTelemetry specifications from `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`:
  ```sql
  /* traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01 */ SELECT col FROM tbl
  ```

Note, the following are one-way messages and will be directly saved as type=session call logs:

- COM_STMT_CLOSE
- COM_QUIT

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request | Response                      | Description                                           |
| ------------------ | -------------- | ------- | ----------------------------- | ----------------------------------------------------- |
| request            | 请求           | --      | --                            | Number of Requests                                    |
| response           | 响应           | --      | --                            | Number of Responses                                   |
| sql_affected_rows  | SQL 影响行数   | --      | Affected Rows in `OK` message | --                                                    |
| log_count          | 日志总量       | --      | --                            | --                                                    |
| error              | 异常           | --      | --                            | Client exceptions + Server exceptions                 |
| client_error       | 客户端异常     | --      | ERROR CODE                    | Refer to the description of Tag field `response_code` |
| server_error       | 服务端异常     | --      | ERROR CODE                    | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --      | --                            | Errors / Responses                                    |
| client_error_ratio | 客户端异常比例 | --      | --                            | Client errors / Responses                             |
| server_error_ratio | 服务端异常比例 | --      | --                            | Server errors / Responses                             |

# PostgreSQL

By parsing the [PostgreSQL](https://www.postgresql.org/docs/15/protocol-message-formats.html) protocol, the fields of PostgreSQL Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese      | Request Header | Response Header | Description                                                                                    |
| -------- | ------------------ | ------------ | -------------- | --------------- | ---------------------------------------------------------------------------------------------- |
| Req.     | version            | 协议版本     | --             | --              | --                                                                                             |
|          | request_type       | 请求类型     | char tag       | --              | Only `regular` messages                                                                        |
|          | request_domain     | 请求域名     | --             | --              | --                                                                                             |
|          | request_resource   | 请求资源     | payload        | --              | Only `regular` messages                                                                        |
|          | request_id         | 请求 ID      | --             | --              | --                                                                                             |
|          | endpoint           | 端点         | --             | --              | --                                                                                             |
| Resp.    | response_code      | 响应码       | --             | --              | --                                                                                             |
|          | response_status    | 响应状态     | --             | Error Code      | Normal: non-`error return` messages; Client/Server exceptions, see [1]                         |
|          | response_exception | 响应异常     | --             | Error Code      | [English description](https://www.postgresql.org/docs/10/errcodes-appendix.html) of Error Code |
|          | response_result    | 响应结果     | --             | Error Code      | Only `error return` messages                                                                   |
| Trace    | trace_id           | TraceID      | --             | --              | --                                                                                             |
|          | span_id            | SpanID       | --             | --              | --                                                                                             |
|          | x_request_id       | X-Request-ID | --             | --              | --                                                                                             |
| Misc.    | --                 | --           | --             | --              | --                                                                                             |

- [1] Error code classification
  - Client exceptions: Error Code=03/0A/0B/0F/0L/0P/20/22/23/26/2F/34/3D/3F/42
  - Server exceptions: Error Code=08/09/0Z/21/24/25/27/28/2B/2D/38/39/3B/40/44/53/54/55/57/5/72/F0/HV/P0/XX

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request | Response                                    | Description                                           |
| ------------------ | -------------- | ------- | ------------------------------------------- | ----------------------------------------------------- |
| request            | 请求           | --      | --                                          | Number of Requests                                    |
| response           | 响应           | --      | --                                          | Number of Responses                                   |
| sql_affected_rows  | SQL 影响行数   | --      | Affected Rows in `command complete` message | --                                                    |
| log_count          | 日志总量       | --      | --                                          | --                                                    |
| error              | 异常           | --      | --                                          | Client exceptions + Server exceptions                 |
| client_error       | 客户端异常     | --      | Error Code                                  | Refer to the description of Tag field `response_code` |
| server_error       | 服务端异常     | --      | Error Code                                  | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --      | --                                          | Errors / Responses                                    |
| client_error_ratio | 客户端异常比例 | --      | --                                          | Client errors / Responses                             |
| server_error_ratio | 服务端异常比例 | --      | --                                          | Server errors / Responses                             |
