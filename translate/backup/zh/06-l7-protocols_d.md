**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response    | 描述                               |
| ------------------ | -------------- | ------- | ----------- | ---------------------------------- |
| request            | 请求           | --      | --          | Request 个数                       |
| response           | 响应           | --      | --          | Response 个数                      |
| session_length     | 会话长度       | --      | --          | --                                 |
| request_length     | 请求长度       | --      | --          | --                                 |
| request_length     | 响应长度       | --      | --          | --                                 |
| log_count          | 日志总量       | --      | --          | --                                 |
| error              | 异常           | --      | --          | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | Status Code | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --      | Status Code | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --          | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --          | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --          | 服务端异常 / 响应                  |

## SQL 协议簇

### MySQL

通过解析 [MySQL](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_basics.html) 协议，将 MySQL Request / Response 的字段映射到 l6_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文     | Request      | Response                   | 描述                                                                                                                                                                       |
| ------------------ | -------- | ------------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| request_type       | 请求类型 | Command      | --                         | 目前支持解析 COM_QUERY, COM_QUIT, COM_INIT_DB, COM_FIELD_LIST, COM_STMT_PREPARE, COM_STMT_EXECUTE, COM_STMT_FETCH, COM_STMT_CLOSE                                          |
| request_resource   | 请求资源 | Statement    | --                         | --                                                                                                                                                                         |
| request_id         | 请求 ID  | Statement ID | Statement ID               | 目前从 COM_STMT_PREPARE 对应的响应和 COM_STMT_EXECUTE 类型的请求中提取                                                                                                     |
| response_status    | 响应状态 | --           | `ERR` 报文的 ERROR CODE    | 正常：无`ERR` 报文; 客户端异常: ERROR CODE=1999-2999 或客户端发送的 1-999; 服务端异常: ERROR CODE=1000-1999/3000-4000 或服务端发送的 1-999                                 |
| response_code      | 响应码   | --           | `ERR` 报文的 ERROR CODE    | --                                                                                                                                                                         |
| response_exception | 响应异常 | --           | `ERR` 报文的 ERROR Message | --                                                                                                                                                                         |
| trace_id           | TraceID  | tracd_id     | -                          | 可以在 SQL 注释中注入 TraceID，例如 `/* your_trace_key： ffffffff */ SELECT col FROM tbl`，并在 http_log_trace_id 配置中加入 your_trace_key 即可提取出当前 SQL 的 trace_id |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response                  | 描述                               |
| ------------------ | -------------- | ------- | ------------------------- | ---------------------------------- |
| request            | 请求           | --      | --                        | Request 个数                       |
| response           | 响应           | --      | --                        | Response 个数                      |
| sql_affected_rows  | SQL 影响行数   | --      | `OK` 报文的 Affected Rows | --                                 |
| log_count          | 日志总量       | --      | --                        | --                                 |
| error              | 异常           | --      | --                        | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | ERROR CODE                | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --      | ERROR CODE                | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --                        | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --                        | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --                        | 服务端异常 / 响应                  |

### PostgreSQL

通过解析 [PostgreSQL](https://www.postgresql.org/docs/14/protocol-message-formats.html) 协议，将 PostgreSQL Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文     | Request                     | Response                     | 描述                                                                                                                                                                                                      |
| ------------------ | -------- | --------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| request_type       | 请求类型 | `regular` 报文的 `char tag` | --                           | --                                                                                                                                                                                                        |
| request_resource   | 请求资源 | `regular` 报文的 `payload`  | --                           | --                                                                                                                                                                                                        |
| response_status    | 响应状态 | --                          | Error Code                   | 正常：无 `error return` 类型的报文; 客户端异常: Error Code=02/0A/0B/0F/0L/0P/20/22/23/26/2F/34/3D/3F/42; 服务端异常: Error Code=08/09/0Z/21/24/25/27/28/2B/2D/38/39/3B/40/44/53/54/55/57/5/72/F0/HV/P0/XX |
| response_exception | 响应异常 | --                          | Error Code                   | Error Code 对应的[官方英文描述](https://www.postgresql.org/docs/9/errcodes-appendix.html)                                                                                                                 |
| response_result    | 响应结果 | --                          | `error return` 报文的 `code` | --                                                                                                                                                                                                        |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response                                | 描述                               |
| ------------------ | -------------- | ------- | --------------------------------------- | ---------------------------------- |
| request            | 请求           | --      | --                                      | Request 个数                       |
| response           | 响应           | --      |                                         | Response 个数                      |
| sql_affected_rows  | SQL 影响行数   | --      | `command complete` 报文的 Affected Rows | --                                 |
| log_count          | 日志总量       | --      | --                                      | --                                 |
| error              | 异常           | --      | --                                      | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | Error Code                              | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --      | Error Code                              | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --                                      | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --                                      | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --                                      | 服务端异常 / 响应                  |

## NoSQL 协议簇

### Redis

通过解析 [Redis](https://redis.io/docs/reference/protocol-spec/) 协议，将 Redis Request / Response 的字段映射到 l6_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文     | Request                      | Response             | 描述                                                             |
| ------------------ | -------- | ---------------------------- | -------------------- | ---------------------------------------------------------------- |
| request_type       | 请求类型 | payload 的第一个单词         | --                   | --                                                               |
| request_resource   | 请求资源 | payload 第一个单词后的字符串 | --                   | --                                                               |
| response_status    | 响应状态 | --                           | `ERR`报文            | 正常：无 `ERR` 报文; 客户端异常: 无; 服务端异常: 全部 `ERR` 报文 |
| response_exception | 响应异常 | --                           | `ERR` 报文的 payload | --                                                               |

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

### MongoDB

通过解析 [MongoDB](https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/) 协议，将 MongoDB Request / Response 的字段映射到 l6_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文     | Request                      | Response             | 描述                                                             |
| ------------------ | -------- | ---------------------------- | -------------------- | ---------------------------------------------------------------- |
| request_type       | 请求类型 | payload 的第一个单词         | --                   | Mongo 报文中的 OpCode 字段                                       |
| request_resource   | 请求资源 | payload 第一个单词后的字符串 | --                   | Mongo 报文中的 Section BodyDocument 字段                         |
| response_code      | 响应异常 | --                           | `ERR` 报文的 payload | Mongo 报文中 Section BodyDocument 里的 code 字段                 |
| response_status    | 响应状态 | --                           | `ERR` 报文的 payload | 正常：无 `ERR` 报文; 客户端异常: 全部 `ERR` 报文; 服务端异常: 无 |
| response_exception | 响应异常 | --                           | `ERR` 报文的 payload | Mongo 报文中 Section BodyDocument 里的 errmsg 字段               |
