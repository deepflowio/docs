**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request     | Response    | 描述                               |
| ------------------ | -------------- | ----------- | ----------- | ---------------------------------- |
| request            | 请求           | --          | --          | Request 个数                       |
| response           | 响应           | --          | --          | Response 个数                      |
| session_length     | 会话长度       | --          | --          | 请求长度 + 响应长度                |
| request_length     | 请求长度       | Data length | --          | --                                 |
| response_length    | 响应长度       | --          | Data length | --                                 |
| log_count          | 日志总量       | --          | --          | --                                 |
| error              | 异常           | --          | --          | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --          | Status      | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --          | Status      | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --          | --          | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --          | --          | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --          | --          | 服务端异常 / 响应                  |

### gRPC

通过解析 gRPC 协议，将 gRPC Request / Response 的字段映射到 l6_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                      | 中文          | HTTP1 Request Header | HTTP2 Response Header | 描述                                                                                                                            |
| ------------------------- | ------------- | -------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| version                   | 协议版本      | Version              | --                    | --                                                                                                                              |
| request_type              | 请求类型      | Method               | --                    | --                                                                                                                              |
| request_domain            | 请求域名      | Host                 | --                    | --                                                                                                                              |
| request_resource          | 请求资源      | Service-Name         | --                    | --                                                                                                                              |
| request_id                | 请求 ID       | Stream ID            | --                    | --                                                                                                                              |
| response_status           | 响应状态      | --                   | Status Code           | 客户端异常：Status Code=3xx; 服务端异常：Status Code=5xx                                                                        |
| response_code             | 响应码        | --                   | Status Code           | --                                                                                                                              |
| response_exception        | 响应异常      | --                   | Status Code           | Status Code 对应的官方英文描述[参考维基百科 List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
| endpoint                  | 端点          | Path                 | --                    | --                                                                                                                              |
| trace_id                  | TraceID       | traceparent, sw7     | raceparent, sw8       | 可配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Header，详细说明见 HTTP 协议描述                                          |
| span_id                   | SpanID        | traceparent, sw7     | raceparent, sw8       | 可配置 deepflow-agent 的 http_log_span_id 修改匹配的 Header，详细说明见 HTTP 协议描述                                           |
| http_proxy_client         | HTTP 代理客户 | X-Forwarded-For      | X-Forwarded-For       | 可配置 deepflow-agent 的 http_log_proxy_client 修改匹配的 Header                                                                |
| x_request_id              | X-Request-ID  | X-Request-ID         | X-Request-ID          | 可配置 deepflow-agent 的 http_log_x_request_id 修改匹配的 Header                                                                |
| attribute.rpc_service     | --            | Service-Name         | --                    | --                                                                                                                              |
| attribute.http_user_agent | --            | User-Agent           | --                    | --                                                                                                                              |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | HTTP1 Request Header | HTTP2 Response Header | 描述                               |
| ------------------ | -------------- | -------------------- | --------------------- | ---------------------------------- |
| request            | 请求           | --                   | --                    | Request 个数                       |
| response           | 响应           |                      | --                    | Response 个数                      |
| session_length     | 会话长度       | --                   | --                    | 请求长度 + 响应长度                |
| request_length     | 请求长度       | Content-Length       | --                    | --                                 |
| request_length     | 响应长度       | --                   | Content-Length        | --                                 |
| log_count          | 日志总量       | --                   | --                    | --                                 |
| error              | 异常           | --                   | --                    | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --                   | Status Code           | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --                   | Status Code           | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --                   | --                    | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --                   | --                    | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --                   | --                    | 服务端异常 / 响应                  |

### SOFARPC

通过解析 [SofaRPC](https://blog.50cto.com/throwable/4896897) 协议，将 FastCGI Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称             | 中文     | Request                                                                                                                                  | Response  | 描述                                                       |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------- |
| request_type     | 请求类型 | header 中的 sofa_head_method_name 或 com.alipay.sofa.rpc.core.request.SofaRequest 类的 methodName 字段                                   | --        | --                                                         |
| request_resource | 请求资源 | header 中的 sofa_head_target_service 或 com.alipay.sofa.rpc.core.request.SofaRequest 的 targetServiceUniqueName 字段                     | --        | --                                                         |
| request_domain   | 请求域名 | --                                                                                                                                       | --        | --                                                         |
| request_id       | 请求 ID  | req_id                                                                                                                                   | --        | --                                                         |
| response_status  | 响应状态 | --                                                                                                                                       | resp_code | 客户端异常：Status Code = 7; 服务端异常：Status Code ！= 0 |
| response_code    | 响应码   | --                                                                                                                                       | resp_code | 客户端异常：Status Code = 7; 服务端异常：Status Code ！= 0 |
| endpoint         | 端点     | request_type/request_resource                                                                                                            | --        | --                                                         |
| trace_id         | TraceID  | header 中的 rpc_trace_context.sofaTraceId 或 new_rpc_trace_context 或 com.alipay.sofa.rpc.core.request.SofaRequest 类的 sofaTraceId 字段 | --        | --                                                         |
| span_id          | SpanID   | header 中的 new_rpc_trace_context                                                                                                        | --        | --                                                         |
| x_request_id     | --       | --                                                                                                                                       | --        | --                                                         |

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

### FastCGI

通过解析 [FastCGI](https://www.mit.edu/~yandros/doc/specs/fcgi-spec.html) 协议，将 FastCGI Request / Response 的字段映射到 l6_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称             | 中文         | Request                      | Response         | 描述                                                                                   |
| ---------------- | ------------ | ---------------------------- | ---------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| request_type     | 请求类型     | PARAM 中的 REQUEST_METHOD    | --               | --                                                                                     |
| request_resource | 请求资源     | PARAM 中的 REQUEST_URI       | --               | --                                                                                     |
| request_domain   | 请求域名     | PARAM 中的 HTTP_HOST         | --               | --                                                                                     |
| request_id       | 请求 ID      | request id                   | --               | --                                                                                     |
| response_status  | 响应状态     | --                           | Status Code      | 客户端异常：Status Code=3xx; 服务端异常：Status Code=5xx                               |
| response_code    | 响应码       | STDOUT 中的 Status，默认 199 | Status Code      | --                                                                                     | 文; 客户端异常: 无; 服务端异常: 全部 `ERR` 报文 |
| endpoint         | 端点         | PARAM 中的 SERVER_ADDR       | --               | --                                                                                     |
| trace_id         | TraceID      | traceparent, sw7             | traceparent, sw8 | 可配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Header，详细说明见 HTTP 协议描述 |
| span_id          | SpanID       | traceparent, sw7             | traceparent, sw8 | 可配置 deepflow-agent 的 http_log_span_id 修改匹配的 Header，详细说明见 HTTP 协议描述  |
| x_request_id     | X-Request-ID | X-Request-ID                 | X-Request-ID     | 可配置 deepflow-agent 的 http_log_x_request_id 修改匹配的 Header                       |
