---
title: RPC
permalink: /features/l7-protocols/rpc
---

# Dubbo

支持 Hessian2 和 Kryo 两种序列化算法, 通过解析 [Dubbo](https://dubbo.apache.org/en/docs3-v2/java-sdk/reference-manual/protocol/overview/) 协议，将 Dubbo Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                  | 中文         | Request Header           | Response Header  | 描述                                                                                                                          |
| ----- | --------------------- | ------------ | ------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Req.  | version               | 协议版本     | version                  | --               | --                                                                                                                            |
|       | request_type          | 请求类型     | Method-Name              | --               | --                                                                                                                            |
|       | request_domain        | 请求域名     | --                       | --               | --                                                                                                                            |
|       | request_resource      | 请求资源     | Service-Name             | --               | --                                                                                                                            |
|       | request_id            | 请求 ID      | Request-ID               | Request-ID       | --                                                                                                                            |
|       | endpoint              | 端点         | Service-Name/Method-Name | --               | --                                                                                                                            |
| Resp. | response_code         | 响应码       | --                       | Status           | --                                                                                                                            |
|       | response_status       | 响应状态     | --                       | Status           | 正常: 20; 客户端异常: 30/40/90; 服务端异常: 31/50/60/70/80/100                                                                |
|       | response_exception    | 响应异常     | --                       | Status           | Status 的描述，参考 [Dubbo 协议详解](https://dubbo.apache.org/zh/blog/2018/10/05/dubbo-%E5%8D%8F%E8%AE%AE%E8%AF%A6%E8%A7%A3/) |
|       | response_result       | 响应结果     | --                       | --               | --                                                                                                                            |
| Trace | trace_id              | TraceID      | traceparent, sw8         | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称                                                                   |
|       | span_id               | SpanID       | traceparent, sw8         | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称                                                                    |
|       | x_request_id          | X-Request-ID | --                       | --               | --                                                                                                                            |
| Misc. | attribute.rpc_service | --           | Service-Name             | --               | --                                                                                                                            |

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

# gRPC

通过解析 gRPC 协议，将 gRPC Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                  | 中文            | Request Header    | Response Header  | 描述                                                                                                          |
| ----- | --------------------- | --------------- | ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Req.  | version               | 协议版本        | Version           | --               | --                                                                                                            |
|       | request_type          | 请求类型        | Method            | --               | --                                                                                                            |
|       | request_domain        | 请求域名        | Host 或 Authority | --               | --                                                                                                            |
|       | request_resource      | 请求资源        | Service-Name      | --               | --                                                                                                            |
|       | request_id            | 请求 ID         | Stream ID         | Stream ID        | --                                                                                                            |
|       | endpoint              | 端点            | Path              | --               | --                                                                                                            |
| Resp. | response_code         | 响应码          | --                | Status Code      | --                                                                                                            |
|       | response_status       | 响应状态        | --                | Status Code      | 正常: 1XX/2XX/3XX; 客户端异常: 4XX; 服务端异常: 5XX                                                           |
|       | response_exception    | 响应异常        | --                | Status Code      | Status Code 的描述，参考 [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|       | response_result       | 响应结果        | --                | --               | --                                                                                                            |
| Trace | trace_id              | TraceID         | traceparent, sw8  | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称                                                   |
|       | span_id               | SpanID          | traceparent, sw8  | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称                                                    |
|       | x_request_id          | X-Request-ID    | X-Request-ID      | X-Request-ID     | Agent 的 `http_log_x_request_id` 配置项可定义提取的 Header 名称                                               |
|       | http_proxy_client     | HTTP 代理客户端 | X-Forwarded-For   | --               | Agent 的 `http_log_proxy_client` 配置项可定义提取的 Header 名称                                               |
| Misc. | attribute.rpc_service | --              | Service-Name      | --               | --                                                                                                            |
| Misc. | attribute.x           | --              | x                 | x                | 支持采集自定义头部字段 [1]                                                                                    |

- [1] 可通过采集器配置中的 static_config.l7-protocol-advanced-features.extra-log-fields 定义需要额外采集的协议头字段，例如在配置中添加 User-Agent、Cookie 时调用日志中可查看到 attribute.user_agent 和 attribute.cookie 字段。

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | HTTP2 Request Header | HTTP2 Response Header | 描述                               |
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

# SOFARPC

通过解析 [SOFARPC](https://blog.51cto.com/throwable/4896897) 协议，将 SOFARPC Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header                  | Response Header | 描述                                     |
| ----- | ------------------ | ------------ | ------------------------------- | --------------- | ---------------------------------------- |
| Req.  | version            | 协议版本     | --                              | --              | --                                       |
|       | request_type       | 请求类型     | method_name 等 [1]              | --              | --                                       |
|       | request_domain     | 请求域名     | --                              | --              | --                                       |
|       | request_resource   | 请求资源     | target_service 等 [2]           | --              | --                                       |
|       | request_id         | 请求 ID      | req_id                          | req_id          | --                                       |
|       | endpoint           | 端点         | $request_type/$request_resource | --              | --                                       |
| Resp. | response_code      | 响应码       | --                              | resp_code       | --                                       |
|       | response_status    | 响应状态     | --                              | resp_code       | 正常: 0; 客户端异常: 8; 服务端异常: 其他 |
|       | response_exception | 响应异常     | --                              | --              | --                                       |
|       | response_result    | 响应结果     | --                              | --              | --                                       |
| Trace | trace_id           | TraceID      | sofaTraceId 等 [3]              | --              | --                                       |
|       | span_id            | SpanID       | trace_context 等 [4]            | --              | --                                       |
|       | x_request_id       | X-Request-ID | --                              | --              | --                                       |
| Misc. | --                 | --           | --                              | --              | --                                       |

- [1] Request header 中的 sofa_head_method_name，或者 com.alipay.sofa.rpc.core.request.SofaRequest 类的 methodName 字段。
- [2] Request header 中的 sofa_head_target_service，或者 com.alipay.sofa.rpc.core.request.SofaRequest 的 targetServiceUniqueName 字段。
- [3] Request header 中的 rpc_trace_context.sofaTraceId，或者 new_rpc_trace_context，或者 com.alipay.sofa.rpc.core.request.SofaRequest 类的 sofaTraceId 字段。
- [4] Request header 中的 new_rpc_trace_context 字段。

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

# FastCGI

通过解析 [FastCGI](https://www.mit.edu/~yandros/doc/specs/fcgi-spec.html) 协议，将 FastCGI Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header            | Response Header  | 描述                                                            |
| ----- | ------------------ | ------------ | ------------------------- | ---------------- | --------------------------------------------------------------- |
| Req.  | version            | 协议版本     | --                        | --               | --                                                              |
|       | request_type       | 请求类型     | PARAM 中的 REQUEST_METHOD | --               | --                                                              |
|       | request_domain     | 请求域名     | PARAM 中的 HTTP_HOST      | --               | --                                                              |
|       | request_resource   | 请求资源     | PARAM 中的 REQUEST_URI    | --               | --                                                              |
|       | request_id         | 请求 ID      | Request ID                | Request ID       | --                                                              |
|       | endpoint           | 端点         | PARAM 中的 DOCUMENT_URI   | --               | --                                                              |
| Resp. | response_code      | 响应码       | --                        | Status Code      | STDOUT 中的 Status，默认 200                                    |
|       | response_status    | 响应状态     | --                        | Status Code      | 正常: 1XX/2XX/3XX; 客户端异常: 4XX; 服务端异常: 5XX             |
|       | response_exception | 响应异常     | --                        | --               | --                                                              |
|       | response_result    | 响应结果     | --                        | --               | --                                                              |
| Trace | trace_id           | TraceID      | traceparent, sw8          | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称     |
|       | span_id            | SpanID       | traceparent, sw8          | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称      |
|       | x_request_id       | X-Request-ID | X-Request-ID              | X-Request-ID     | Agent 的 `http_log_x_request_id` 配置项可定义提取的 Header 名称 |
| Misc. | --                 | --           | --                        | --               | --                                                              |

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

# bRPC

通过解析 [bRPC](https://github.com/apache/brpc/blob/master/docs/cn/baidu_std.md) 协议，将 bRPC Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header           | Response Header     | 描述                               |
| ----- | ------------------ | ------------ | ------------------------ | ------------------- | ---------------------------------- |
| Req.  | version            | 协议版本     | --                       | --                  | --                                 |
|       | request_type       | 请求类型     | request.method_name      | --                  | --                                 |
|       | request_domain     | 请求域名     | --                       | --                  | --                                 |
|       | request_resource   | 请求资源     | request.service_name     | --                  | --                                 |
|       | request_id         | 请求 ID      | correlation_id           | --                  | correlation_id 64 位整型的高 32 位 |
|       | endpoint           | 端点         | service_name/method_name | --                  | --                                 |
| Resp. | response_code      | 响应码       | --                       | Status Code         | --                                 |
|       | response_status    | 响应状态     | --                       | response.error_code | --                                 |
|       | response_exception | 响应异常     | --                       | response.error_text | --                                 |
|       | response_result    | 响应结果     | --                       | --                  | --                                 |
| Trace | trace_id           | TraceID      | --                       | --                  | --                                 |
|       | span_id            | SpanID       | --                       | --                  | --                                 |
|       | x_request_id       | X-Request-ID | request.log_id           | --                  | --                                 |
| Misc. | --                 | --           | --                       | --                  | --                                 |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response | 描述                               |
| ------------------ | -------------- | ------- | -------- | ---------------------------------- |
| request            | 请求           | --      | --       | Request 个数                       |
| response           | 响应           | --      | --       | Response 个数                      |
| session_length     | 会话长度       | --      | --       | --                                 |
| request_length     | 请求长度       | --      | --       | --                                 |
| response_length    | 响应长度       | --      | --       | --                                 |
| log_count          | 日志总量       | --      | --       | --                                 |
| error              | 异常           | --      | --       | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | --       | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --      | --       | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --       | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --       | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --       | 服务端异常 / 响应                  |
