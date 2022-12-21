---
title: 数据库字段
permalink: /auto-metrics/db-field-desc
---

# l7_flow_log 字段说明

l7_flow_log 数据库表存储按分钟粒度聚合的各种协议的请求日志，由 Tag 和 Metrics 两大类字段组成：
- Tag 字段：字段主要用于分组，过滤。详细字段描述如下[csv-querier 组件的数据库字段描述](https://raw.githubusercontent.com/deepflowys/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.ch)
- Metrics 字段：字段主要用于计算，详细字段描述如下[csv-querier 组件的数据库字段描述](https://raw.githubusercontent.com/deepflowys/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.ch)

## HTTP 协议映射

通过解析 HTTP 协议，将 HTTP Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                      |中文             | Request Header  | Response Header |  描述 |
| ------------------------- | -------------- | ---------------- | ----------- | -- |
| version                   | 协议版本        | 首行的 Version   | --          | -- |                 
| request_type              | 请求类型        | 首行的 Method    | --          | -- |         
| request_domain            | 请求域名        | Host             | --          | -- | 
| request_resource          | 请求资源        | Path             | --          | -- |
| request_id                | 请求 ID         | Stream ID        | --          | 仅针对 HTTP2 |      
| response_status           | 响应状态        | --               | Status Code | 客户端异常：Status Code=4xx; 服务端异常：Status Code=5xx |     
| response_code             | 响应码          | --               | Status Code | -- |             
| response_exception        | 响应异常        | --               | Status Code | Status Code 对应的官方英文描述，[参考维基百科List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)| 
| trace_id                  | TraceID         | traceparent, sw8 | traceparent, sw8          | 可配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Header，详细描述见后续说明 |                
| span_id                   | SpanID          | traceparent, sw8 | traceparent, sw8          | 可配置 deepflow-agent 的 http_log_span_id 修改匹配的 Header，详细描述见后续说明 |                          
| http_proxy_client         | HTTP 代理客户端  | X-Forwarded-For  | --          | 可配置 deepflow-agent 的 http_log_proxy_client 修改匹配的 Header |  
| x_request_id              | X-Request-ID    | X-Request-ID     | X-Request-ID          | 可配置 deepflow-agent 的 http_log_x_request_id 修改匹配的 Header |     
| attribute.http_user_agent | --              | User-Agent       | --          | -- |
| attribute.http_referer    | --              | Referer          | --          | -- |

- TraceID（trace_id）只读取以下 HTTP Header 部分数据，其他 Header 读取全部数据：
  - `sw8`/`sw6` Header 中的 `trace ID`
  - `uber-trace-id` Header 中的 `{trace-id}`
  - `traceparent` Header 中的 `trace-id`
- SpanID（span_id）只读取以下 HTTP Header 部分数据，其他 Header 读取全部数据：
  - `sw8`/`sw6` Header 中的 `segment ID-span ID`
  - `uber-trace-id` Header 中的 `{span-id}`
  - `traceparent` Header 中的 `parent-id`

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称              | 中文            | Request Header |  Response Header | 描述 |
| ---------------- | -------------- | --------------- | -------------- | -- |
|request            | 请求           | --             | --             | Request 个数 |  
|response           | 响应           | --             | --             | Response 个数 |  
|session_length     | 会话长度       | --             | --             | 请求长度 + 响应长度 | 
|request_length     | 请求长度       | Content-Length | --             | -- |
|request_length     | 响应长度       | --             | Content-Length | -- | 
|log_count          | 日志总量       | --             | --             | Request Log 行数 |
|error              | 异常           | --             | --             | 客户端异常 + 服务端异常 |
|client_error       | 客户端异常     | --             | Status Code    | 参考 Tag 字段`response_code`的说明 |
|server_error       | 服务端异常     | --             | Status Code    | 参考 Tag 字段`response_code`的说明 |
|error_ratio        | 异常比例       | --             | --             | 异常 / 响应 |
|client_error_ratio | 客户端异常比例 | --             | --             | 客户端异常 / 响应 |
|server_error_ratio | 服务端异常比例 | --             | --             | 服务端异常 / 响应 |

## DNS 协议映射

通过解析 DNS 协议，将 DNS Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称 | 中文         | Request | Response | 描述 |
| -------------------|-------- | ------ | ----- | -- |
| request_type       | 请求类型 | QTYPE  | --    | -- |
| request_resource   | 请求资源 | QNAME  | --    | -- |
| request_id         | 请求 ID  | ID     | ID    | -- |
| response_status    | 响应状态 | --     | RCODE | 正常: RCODE=0x0; 客户端异常: RCODE=0x1/0x3; 服务端异常: RCODE!=0x0/0x1/0x3 |
| response_code      | 响应码   | --     | RCODE | -- |
| response_exception | 响应异常 | --     | RCODE | RCODE 对应的官方英文描述，[参考 RFC 2929 Section 2.3](https://www.rfc-editor.org/rfc/rfc2929#section-2.3) |
| response_result    | 响应结果 | --     | RDATA | -- |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | Request |  Response | 描述 |
| ------------------ | -------------- | -- | ----- | -- |
| request            | 请求           | -- | --    | Request 个数 |  
| response           | 响应           | -- | --    | Response 个数 |  
| log_count          | 日志总量       | -- | --    | Request Log 行数 |
| error              | 异常           | -- | --    | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | -- | RCODE | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | -- | RCODE | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | -- | --    | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | -- | --    | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | -- | --    | 服务端异常 / 响应 |

## Dubbo 协议

通过解析 Dubbo 协议，将 Dubbo Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                  | 中文     | Request                             | Response | 描述 |
| --------------------  |-------- | ----------------------------------- | ----- | -- |
| version               | 协议版本 | Version                             | --     | -- |
| request_type          | 请求类型 | Method name                         | --     | -- |
| request_resource      | 请求资源 | Service name                        | --     | -- |
| request_id            | 请求 ID  | Request ID                          | --     | -- |
| response_status       | 响应状态 | --                                  | Status | 正常: Status=20; 客户端异常: Status=30/40/90; 服务端异常: Status=31/50/60/70/80/100 |
| response_code         | 响应码   | --                                  | Status | -- |
| response_exception    | 响应异常 | --                                  | Status | Status 对应的官方英文描述[参考 Dubbo 协议详解](https://dubbo.apache.org/zh/blog/2018/10/05/dubbo-%E5%8D%8F%E8%AE%AE%E8%AF%A6%E8%A7%A3/) |
| endpoint              | 端点     | Service name/Method name            | --     | -- |
| trace_id              | TraceID  | Attachments 字段的 traceparent, sw8 | --     | 可配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Attachments 字段，详细说明见 HTTP 协议描述 |      
| span_id               | SpanID   | Attachments 字段的 traceparent, sw8 | --     | 对配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Attachments 字段，详细说明见 HTTP 协议描述 |
| attribute.rpc_service | --       | Service name                        | --     | -- | 

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | Request      |  Response   | 描述 |
| ------------------ | -------------- | ------------ | ----------- | -- |
| request             | 请求           | --          | --          | Request 个数 | 
| response            | 响应           | --          | --          | Response 个数 |
| session_length      | 会话长度       | --          | --          | 请求长度 + 响应长度 |
| request_length      | 请求长度       | Data length | --          | -- |
| response_length     | 响应长度       | --          | Data length | -- |
| log_count           | 日志总量       | --          | --          | -- |
| error               | 异常           | --          | --          | 客户端异常 + 服务端异常 |
| client_error        | 客户端异常     | --          | Status      | 参考 Tag 字段`response_code`的说明 |
| server_error        | 服务端异常     | --          | Status      | 参考 Tag 字段`response_code`的说明 |
| error_ratio         | 异常比例       | --          | --          | 异常 / 响应 |
| client_error_ratio  | 客户端异常比例 | --          | --          | 客户端异常 / 响应 |
| server_error_ratio  | 服务端异常比例 | --          | --          | 服务端异常 / 响应 |

## gRPC 协议

通过解析 gRPC 协议，将 gRPC Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                       | 中文         | HTTP2 Request Header |  HTTP2 Response Header | 描述 |
| ------------------------- | ------------ | ---------------- | --------------- | -- |
| version                   | 协议版本      | Version          | --              | -- |
| request_type              | 请求类型      | Method           | --              | -- |
| request_domain            | 请求域名      | Host             | --              | -- |
| request_resource          | 请求资源      | Service-Name     | --              | -- |
| request_id                | 请求 ID       | Stream ID        | --              | -- |
| response_status           | 响应状态      | --               | Status Code     | 客户端异常：Status Code=4xx; 服务端异常：Status Code=5xx |
| response_code             | 响应码        | --               | Status Code     | -- |
| response_exception        | 响应异常      | --               | Status Code     | Status Code 对应的官方英文描述[参考维基百科List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)|             
| endpoint                  | 端点          | Path             | --              | -- |
| trace_id                  | TraceID       | traceparent, sw8 | raceparent, sw8 | 可配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Header，详细说明见HTTP协议描述 |      
| span_id                   | SpanID        | traceparent, sw8 | raceparent, sw8 | 可配置 deepflow-agent 的 http_log_span_id 修改匹配的 Header，详细说明见HTTP协议描述 |             
| http_proxy_client         | HTTP 代理客户  | X-Forwarded-For  | X-Forwarded-For | 可配置 deepflow-agent 的 http_log_proxy_client 修改匹配的 Header |  
| x_request_id              | X-Request-ID  | X-Request-ID     | X-Request-ID    | 可配置 deepflow-agent 的 http_log_x_request_id 修改匹配的 Header |  
| attribute.rpc_service     | --            | Service-Name     | --              | -- |
| attribute.http_user_agent | --            | User-Agent       | --              | -- |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | HTTP2 Request Header |  HTTP2 Response Header  | 描述 |
| ------------------ | -------------- | ------------ | ----------- | -- |
| request            | 请求           | --             | --             | Request 个数 |  
| response           | 响应           |                | --             | Response 个数 |  
| session_length     | 会话长度       | --             | --             | 请求长度 + 响应长度 | 
| request_length     | 请求长度       | Content-Length | --             | -- |
| request_length     | 响应长度       | --             | Content-Length | -- | 
| log_count          | 日志总量       | --             | --             | -- |
| error              | 异常           | --             | --             | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --             | Status Code    | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --             | Status Code    | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --             | --             | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --             | --             | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --             | --             | 服务端异常 / 响应 |

## MySQL 协议

通过解析 MySQL 协议，将 MySQL Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                | 中文    | Request          | Response       | 描述 |
| ------------------ | ------- | ---------------- | --------------- | -- |
| request_type       | 请求类型 | Command   | --                         | 目前支持解析 COM_QUERY, COM_QUIT, COM_INIT_DB, COM_FIELD_LIST, COM_STMT_PREPARE, COM_STMT_EXECUTE, COM_STMT_FETCH, COM_STMT_CLOSE |
| request_resource   | 请求资源 | Statement | --                         | -- | 
| response_status    | 响应状态 | --        | `ERR` 报文的 ERROR CODE    | 正常：无`ERR` 报文; 客户端异常: ERROR CODE=2000-2999 或客户端发送的1-999; 服务端异常: ERROR CODE=1000-1999/3000-4000 或服务端发送的1-999 |
| response_code      | 响应码   | --        | `ERR` 报文的 ERROR CODE    | -- |
| response_exception | 响应异常 | --        | `ERR` 报文的 ERROR Message | -- | 

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

## PostgreSQL 协议

通过解析 PostgreSQL 协议，将 PostgreSQL Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                | 中文    | Request                     | Response                    | 描述 |
| ------------------ | ------- | --------------------------- | ---------------------------- | -- |
| request_type       | 请求类型 | `regular` 报文的 `char tag` | --                           | -- |
| request_resource   | 请求资源 | `regular` 报文的 `payload`  | --                           | -- | 
| response_status    | 响应状态 | --                          | Error Code                   | 正常：无 `error return` 类型的报文; 客户端异常: Error Code=03/0A/0B/0F/0L/0P/20/22/23/26/2F/34/3D/3F/42; 服务端异常: Error Code=08/09/0Z/21/24/25/27/28/2B/2D/38/39/3B/40/44/53/54/55/57/5/72/F0/HV/P0/XX  |
| response_exception | 响应异常 | --                          | Error Code                   | Error Code 对应的[官方英文描述](https://www.postgresql.org/docs/10/errcodes-appendix.html) |
| response_result    | 响应结果 | --                          | `error return` 报文的 `code` | -- |

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

## Redis 协议

通过解析 Redis 协议，将 MySQL Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                | 中文    | Request                     | Response             | 描述 |
| -------------------| ------- | --------------------------- | -------------------- | -- |
| request_type       | 请求类型 | payload 的第一个单词         | --                   | -- |
| request_resource   | 请求资源 | payload 第一个单词后的字符串 | --                   | -- | 
| response_status    | 响应状态 | --                           | `ERR`报文            | 正常：无 `ERR` 报文; 客户端异常: 无; 服务端异常: 全部 `ERR` 报文 |
| response_exception | 响应异常 | --                           | `ERR` 报文的 payload | -- | 

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文             | Request              |  Response            | 描述 |
| ------------------ | -----------------| -------------------- | --------------------- | -- |
| request            | 请求           | --                    | --                                      | Request 个数 |  
| response           | 响应           | --                    |                                         | Response 个数 |  
| sql_affected_rows  | SQL影响行数    | --                    | `command complete` 报文的 Affected Rows | -- |
| log_count          | 日志总量       | --                    | --                                      | -- |
| error              | 异常           | --                    | --                                      | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --                    | --                                       | -- |
| server_error       | 服务端异常     | --                    | `ERR`报文                                | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --                    | --                                      | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --                    | --                                      | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --                    | --                                      | 服务端异常 / 响应 |

## Kafka 协议

通过解析 Kafka 协议，将 Kafka Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                | 中文    | Request         | Response   | 描述 |
| -------------------| ------- | --------------- | ---------- | -- |
| request_type       | 请求类型 | request_api_key | --         | -- |
| request_id         | 请求 ID  | correlation_id  | --         | -- |
| response_status    | 响应状态 | --              | error_code | 正常: error_code=0; 客户端异常: 无; 服务端异常: error_code!=0 |
| response_code      | 响应码   | --              | error_code | 目前仅解析 Fetch 一个命令类型的响应码 |
| response_exception | 响应异常 | --              | error_code | error_code 对应的[官方英文描述](http://kafka.apache.org/protocol#protocol_error_codes) |


**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文             | Request              |  Response            | 描述 |
| ------------------ | -----------------| -------------------- | --------------------- | -- |
| request            | 请求           | --           | --           | Request 个数 |  
| response           | 响应           | --           |              | Response 个数 |  
| session_length     | 会话长度       | --           | --           | 请求长度 + 响应长度 | 
| request_length     | 请求长度       | message_size | --           | -- |
| request_length     | 响应长度       | --           | message_size | -- | 
| log_count          | 日志总量       | --           | --           | -- |
| error              | 异常           | --           | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --           | error_code   | 参考 Tag 字段`响应状态`的说明 |
| server_error       | 服务端异常     | --           | error_code   | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --           | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --           | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --           | --           | 服务端异常 / 响应 |

## MQTT 协议

通过解析 MQTT 协议，将 MQTT Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称              | 中文    | Request         | Response   | 描述 |
| -----------------| ------- | --------------- | ---------- | -- |
| request_type     | 请求类型 | PacketKind      | -- | -- |
| request_domain   | 请求域名 | client_id       | -- | -- |
| request_resource | 请求资源 | topic           | -- | -- |
| response_status  | 响应状态 | --              | `connect_ack` 报文返回的 code | 正常: code=0; 客户端异常: code=1/2/4/5; 服务端异常: error_code=3 |
| response_code    | 响应码   | --              | `connect_ack` 报文返回的 code | -- |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称              | 中文    | Request         | Response   | 描述 |
| -----------------| ------- | --------------- | ---------- | -- |
| request            | 请求           | --           | --           | Request 个数 |  
| response           | 响应           | --           |              | Response 个数 |  
| log_count          | 日志总量       | --           | --           | -- |
| error              | 异常           | --           | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --           | `connect_ack` 报文返回的 code   | 参考 Tag 字段`响应状态`的说明 |
| server_error       | 服务端异常     | --           | `connect_ack` 报文返回的 code   | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --           | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --           | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --           | --           | 服务端异常 / 响应 |

## OpenTelemetry 协议

通过解析 OpenTelemetry 协议，将 OpenTelemetry 协议的数据结构的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                 | 中文        | OpenTelemetry 数据结构 | 描述 |
| ------------------- | ----------- | ---------------------- | ---- |
| start_time          | 开始时间     | span.start_time_unix_nano | -- |
| end_time            | 结束时间     | span.end_time_unix_nano   | -- |
| protocol            | 网络协议     | span.attribute.net.transport | 映射到对应的枚举值 |
| attributes          | Attributes   | resource./span.attributes | -- |
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
| tap_side            | 路径统计位置 | span.spankind.SPAN_KIND_CLIENT/SPAN_KIND_PRODUCER：客户端应用(c-app)；span.spankind.SPAN_KIND_SERVER/SPAN_KIND_CONSUMER：服务端应用(s-app)；span.spankind.SPAN_KIND_UNSPECIFIED/SPAN_KIND_INTERNAL：应用(app) | -- |

- tap_side = c-app
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