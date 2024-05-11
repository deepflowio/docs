---
title: 应用协议列表
permalink: /features/universal-map/l7-protocols
---

# 支持的应用协议

[csv-L7 Protocol List](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)

# 调用日志字段说明

调用日志（`flow_log.l7_flow_log`）数据表存储按分钟粒度聚合的各种协议的请求日志，由 Tag 和 Metrics 两大类字段组成。

## 标签

Tag 字段：字段主要用于分组，过滤，详细字段描述如下。

[csv-querier 组件的数据库字段描述](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.ch)

## 指标

Metrics 字段：字段主要用于计算，详细字段描述如下。

[csv-querier 组件的数据库字段描述](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.ch)

# 各应用协议的字段映射

## HTTP 协议簇

### HTTP

通过解析 HTTP 协议，将 HTTP Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                      | 中文            | Request Header   | Response Header  | 描述 |
| ----- | ------------------------- | --------------- | ---------------- | ---------------- | ---- |
| Req.  | version                   | 协议版本        | 首行的 Version   | --               | --   |
|       | request_type              | 请求类型        | 首行的 Method    | --               | --   |
|       | request_domain            | 请求域名        | Host             | --               | --   |
|       | request_resource          | 请求资源        | Path             | --               | --   |
|       | request_id                | 请求 ID         | --               | --               | --   |
|       | endpoint                  | 端点            | Path             | --               | Agent 的 `http-endpoint-extraction` 配置项可定义提取规则 |
| Resp. | response_code             | 响应码          | --               | Status Code      | --   |
|       | response_status           | 响应状态        | --               | Status Code      | 正常: 1XX/2XX/3XX; 客户端异常: 4XX; 服务端异常: 5XX |
|       | response_exception        | 响应异常        | --               | Status Code      | Status Code 的描述，参考 [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|       | response_result           | 响应结果        | --               | --               | --   |
| Trace | trace_id                  | TraceID         | traceparent, sw8 [1] | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称 |
|       | span_id                   | SpanID          | traceparent, sw8 [2] | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称 |
|       | x_request_id              | X-Request-ID    | X-Request-ID     | X-Request-ID     | Agent 的 `http_log_x_request_id` 配置项可定义提取的 Header 名称 |
|       | http_proxy_client         | HTTP 代理客户端 | X-Forwarded-For  | --               | Agent 的 `http_log_proxy_client` 配置项可定义提取的 Header 名称 |
| Misc. | attribute.x               | --             | x | x | 支持采集自定义头部字段 [3] |

- [1] TraceID 只截取以下 HTTP Header 的部分值，其他自定义 Header 读取全部值：
  - `traceparent` Header 中的 `trace-id` 部分
  - `sw8`/`sw6` Header 中的 `trace ID` 部分
  - `uber-trace-id` Header 中的 `{trace-id}` 部分
- [2] SpanID 只截取以下 HTTP Header 的部分值，其他自定义 Header 读取全部值：
  - `traceparent` Header 中的 `parent-id` 部分
  - `sw8`/`sw6` Header 中的 `segment ID-span ID` 部分
  - `uber-trace-id` Header 中的 `{span-id}` 部分
- [3] 可通过采集器配置中的 static_config.l7-protocol-advanced-features.extra-log-fields 定义需要额外采集的协议头字段，例如在配置中添加 User-Agent、Cookie 时调用日志中可查看到 attribute.user_agent 和 attribute.cookie 字段。

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

### HTTP2

通过解析 HTTP2 协议，将 HTTP2 Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                      | 中文            | Request Header    | Response Header  | 描述 |
| ----- | ------------------------- | --------------- | ----------------- | ---------------- | ---- |
| Req.  | version                   | 协议版本        | Version           | --               | --   |
|       | request_type              | 请求类型        | Method            | --               | --   |
|       | request_domain            | 请求域名        | Host 或 Authority | --               | --   |
|       | request_resource          | 请求资源        | Path              | --               | --   |
|       | request_id                | 请求 ID         | Stream ID         | Stream ID        | --   |
|       | endpoint                  | 端点            | Path              | --               | --   |
| Resp. | response_code             | 响应码          | --                | Status Code      | --   |
|       | response_status           | 响应状态        | --                | Status Code      | 正常: 1XX/2XX/3XX; 客户端异常: 4XX; 服务端异常: 5XX |
|       | response_exception        | 响应异常        | --                | Status Code      | Status Code 的描述，参考 [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|       | response_result           | 响应结果        | --                | --               | --   |
| Trace | trace_id                  | TraceID         | traceparent, sw8  | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称 |
|       | span_id                   | SpanID          | traceparent, sw8  | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称 |
|       | x_request_id              | X-Request-ID    | X-Request-ID      | X-Request-ID     | Agent 的 `http_log_x_request_id` 配置项可定义提取的 Header 名称 |
|       | http_proxy_client         | HTTP 代理客户端 | X-Forwarded-For   | --               | Agent 的 `http_log_proxy_client` 配置项可定义提取的 Header 名称 |
| Misc. | attribute.x               | --             | x | x | 支持采集自定义头部字段 [1] |

- [1] 可通过采集器配置中的 static_config.l7-protocol-advanced-features.extra-log-fields 定义需要额外采集的协议头字段，例如在配置中添加 User-Agent、Cookie 时调用日志中可查看到 attribute.user_agent 和 attribute.cookie 字段。

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

## RPC 协议簇

### Dubbo

支持 Hessian2 和 Kryo 两种序列化算法, 通过解析 [Dubbo](https://dubbo.apache.org/en/docs3-v2/java-sdk/reference-manual/protocol/overview/) 协议，将 Dubbo Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                  | 中文         | Request Header            | Response Header  | 描述 |
| ----- | --------------------  |------------- | ------------------------- | ---------------- | ---- |
| Req.  | version               | 协议版本     | version                   | --               | --   |
|       | request_type          | 请求类型     | Method-Name               | --               | --   |
|       | request_domain        | 请求域名     | --                        | --               | --   |
|       | request_resource      | 请求资源     | Service-Name              | --               | --   |
|       | request_id            | 请求 ID      | Request-ID                | Request-ID       | --   |
|       | endpoint              | 端点         | Service-Name/Method-Name  | --               | --   |
| Resp. | response_code         | 响应码       | --                        | Status           | --   |
|       | response_status       | 响应状态     | --                        | Status           | 正常: 20; 客户端异常: 30/40/90; 服务端异常: 31/50/60/70/80/100 |
|       | response_exception    | 响应异常     | --                        | Status           | Status 的描述，参考 [Dubbo 协议详解](https://dubbo.apache.org/zh/blog/2018/10/05/dubbo-%E5%8D%8F%E8%AE%AE%E8%AF%A6%E8%A7%A3/) |
|       | response_result       | 响应结果     | --                        | --               | --   |
| Trace | trace_id              | TraceID      | traceparent, sw8          | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称 |
|       | span_id               | SpanID       | traceparent, sw8          | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称 |
|       | x_request_id          | X-Request-ID | --                        | --               | --   |
| Misc. | attribute.rpc_service | --           | Service-Name              | --               | --   |

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

### gRPC

通过解析 gRPC 协议，将 gRPC Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                      | 中文            | Request Header    | Response Header  | 描述 |
| ----- | ------------------------- | --------------- | ----------------- | ---------------- | ---- |
| Req.  | version                   | 协议版本        | Version           | --               | --   |
|       | request_type              | 请求类型        | Method            | --               | --   |
|       | request_domain            | 请求域名        | Host 或 Authority | --               | --   |
|       | request_resource          | 请求资源        | Service-Name      | --               | --   |
|       | request_id                | 请求 ID         | Stream ID         | Stream ID        | --   |
|       | endpoint                  | 端点            | Path              | --               | --   |
| Resp. | response_code             | 响应码          | --                | Status Code      | --   |
|       | response_status           | 响应状态        | --                | Status Code      | 正常: 1XX/2XX/3XX; 客户端异常: 4XX; 服务端异常: 5XX |
|       | response_exception        | 响应异常        | --                | Status Code      | Status Code 的描述，参考 [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|       | response_result           | 响应结果        | --                | --               | --   |
| Trace | trace_id                  | TraceID         | traceparent, sw8  | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称 |
|       | span_id                   | SpanID          | traceparent, sw8  | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称 |
|       | x_request_id              | X-Request-ID    | X-Request-ID      | X-Request-ID     | Agent 的 `http_log_x_request_id` 配置项可定义提取的 Header 名称 |
|       | http_proxy_client         | HTTP 代理客户端 | X-Forwarded-For   | --               | Agent 的 `http_log_proxy_client` 配置项可定义提取的 Header 名称 |
| Misc. | attribute.rpc_service     | --              | Service-Name      | --               | --   |
| Misc. | attribute.x               | --             | x | x | 支持采集自定义头部字段 [1] |

- [1] 可通过采集器配置中的 static_config.l7-protocol-advanced-features.extra-log-fields 定义需要额外采集的协议头字段，例如在配置中添加 User-Agent、Cookie 时调用日志中可查看到 attribute.user_agent 和 attribute.cookie 字段。

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

### SOFARPC

通过解析 [SOFARPC](https://blog.51cto.com/throwable/4896897) 协议，将 SOFARPC Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header                  | Response Header  | 描述 |
| ----- | ------------------ | ------------ | ------------------------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | --                              | --               | --   |
|       | request_type       | 请求类型     | method_name 等 [1]              | --               | --   |
|       | request_domain     | 请求域名     | --                              | --               | --   |
|       | request_resource   | 请求资源     | target_service 等 [2]           | --               | --   |
|       | request_id         | 请求 ID      | req_id                          | req_id           | --   |
|       | endpoint           | 端点         | $request_type/$request_resource | --               | --   |
| Resp. | response_code      | 响应码       | --                              | resp_code        | --   |
|       | response_status    | 响应状态     | --                              | resp_code        | 正常: 0; 客户端异常: 8; 服务端异常: 其他 |
|       | response_exception | 响应异常     | --                              | --               | --   |
|       | response_result    | 响应结果     | --                              | --               | --   |
| Trace | trace_id           | TraceID      | sofaTraceId 等 [3]              | --               | --   |
|       | span_id            | SpanID       | trace_context 等 [4]            | --               | --   |
|       | x_request_id       | X-Request-ID | --                              | --               | --   |
| Misc. | --                 | --           | --                              | --               | --   |

- [1] Request header 中的 sofa_head_method_name，或者 com.alipay.sofa.rpc.core.request.SofaRequest 类的 methodName 字段。
- [2] Request header 中的 sofa_head_target_service，或者 com.alipay.sofa.rpc.core.request.SofaRequest 的 targetServiceUniqueName 字段。
- [3] Request header 中的 rpc_trace_context.sofaTraceId，或者 new_rpc_trace_context，或者 com.alipay.sofa.rpc.core.request.SofaRequest 类的 sofaTraceId 字段。
- [4] Request header 中的 new_rpc_trace_context 字段。

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | Request       |  Response   | 描述 |
| ------------------ | -------------- | ------------  | ----------- | -- |
| request            | 请求          | --             | --           | Request 个数 |
| response           | 响应          | --             | --           | Response 个数 |
| session_length     | 会话长度       | --             | --           | -- |
| request_length     | 请求长度       | --             | --           | -- |
| request_length     | 响应长度       | --             | --           | -- |
| log_count          | 日志总量       | --             | --           | -- |
| error              | 异常          | --             | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --             | Status Code  | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --             | Status Code  | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --             | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例  | --             | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例  | --             | --           | 服务端异常 / 响应 |

### FastCGI

通过解析 [FastCGI](https://www.mit.edu/~yandros/doc/specs/fcgi-spec.html) 协议，将 FastCGI Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header             | Response Header  | 描述 |
| ----- | ------------------ | ------------ | -------------------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | --                         | --               | --   |
|       | request_type       | 请求类型     | PARAM 中的 REQUEST_METHOD  | --               | --   |
|       | request_domain     | 请求域名     | PARAM 中的 HTTP_HOST       | --               | --   |
|       | request_resource   | 请求资源     | PARAM 中的 REQUEST_URI     | --               | --   |
|       | request_id         | 请求 ID      | Request ID                 | Request ID       | --   |
|       | endpoint           | 端点         | PARAM 中的 DOCUMENT_URI    | --               | --   |
| Resp. | response_code      | 响应码       | --                         | Status Code      | STDOUT 中的 Status，默认 200 |
|       | response_status    | 响应状态     | --                         | Status Code      | 正常: 1XX/2XX/3XX; 客户端异常: 4XX; 服务端异常: 5XX |
|       | response_exception | 响应异常     | --                         | --               | --   |
|       | response_result    | 响应结果     | --                         | --               | --   |
| Trace | trace_id           | TraceID      | traceparent, sw8           | traceparent, sw8 | Agent 的 `http_log_trace_id` 配置项可定义提取的 Header 名称 |
|       | span_id            | SpanID       | traceparent, sw8           | traceparent, sw8 | Agent 的 `http_log_span_id` 配置项可定义提取的 Header 名称 |
|       | x_request_id       | X-Request-ID | X-Request-ID               | X-Request-ID     | Agent 的 `http_log_x_request_id` 配置项可定义提取的 Header 名称 |
| Misc. | --                 | --           | --                         | --               | --   |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | Request       |  Response   | 描述 |
| ------------------ | -------------- | ------------  | ----------- | -- |
| request            | 请求          | --             | --           | Request 个数 |
| response           | 响应          | --             | --           | Response 个数 |
| session_length     | 会话长度       | --             | --           | -- |
| request_length     | 请求长度       | --             | --           | -- |
| request_length     | 响应长度       | --             | --           | -- |
| log_count          | 日志总量       | --             | --           | -- |
| error              | 异常          | --             | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --             | Status Code  | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --             | Status Code  | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --             | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例  | --             | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例  | --             | --           | 服务端异常 / 响应 |

### bRPC

通过解析 [bRPC](https://github.com/apache/brpc/blob/master/docs/cn/baidu_std.md) 协议，将 bRPC Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header             | Response Header  | 描述 |
| ----- | ------------------ | ------------ | -------------------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | --                         | --               | --   |
|       | request_type       | 请求类型     | request.method_name        | --               | --   |
|       | request_domain     | 请求域名     | --                         | --               | --   |
|       | request_resource   | 请求资源     | request.service_name       | --               | --   |
|       | request_id         | 请求 ID      | correlation_id            | --               | correlation_id 64 位整型的高 32 位   |
|       | endpoint           | 端点         | service_name/method_name  | --               | --   |
| Resp. | response_code      | 响应码       | --                         | Status Code      | -- |
|       | response_status    | 响应状态     | --                         | response.error_code | -- |
|       | response_exception | 响应异常     | --                         | response.error_text | --   |
|       | response_result    | 响应结果     | --                         | --               | --   |
| Trace | trace_id           | TraceID      | --                       | --                | -- |
|       | span_id            | SpanID       | --                       | --                | -- |
|       | x_request_id       | X-Request-ID | request.log_id            | --                | -- |
| Misc. | --                 | --           | --                         | --               | --   |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文            | Request       |  Response   | 描述 |
| ------------------ | -------------- | ------------  | ----------- | -- |
| request            | 请求          | --             | --           | Request 个数 |
| response           | 响应          | --             | --           | Response 个数 |
| session_length     | 会话长度       | --             | --           | -- |
| request_length     | 请求长度       | --             | --           | -- |
| response_length    | 响应长度       | --             | --           | -- |
| log_count          | 日志总量       | --             | --           | -- |
| error              | 异常          | --             | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --             | --           | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --             | --           |  参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --             | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例  | --             | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例  | --             | --           | 服务端异常 / 响应 |

## SQL 协议簇

### MySQL

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
- [3] 当应用在 SQL 语句的注释中注入 TraceID（或复合的 TraceID + SpanID）时，DeepFlow 支持提取并用于跨线程的分布式追踪。DeepFlow 支持提取几乎任意位置的 SQL 注释（但必须出现在 AF_PACKET 获取到的首包中，或者 eBPF 获取到的第一个 Socket Data 中）：
- [4] 提取 `COM_STMT_EXECUTE` 中的参数不能开启采集器高级配置 `obfuscate-enabled-protocols`; 参数会使用` , `拼接赋值给 `request_resource`; 当流量出现乱序、丢包、重传、截断等会导致参数解析错误。
  ```sql
  /* your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4 */ SELECT col FROM tbl
  SELECT /* your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4 */ col FROM tbl
  SELECT col FROM tbl # your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4
  SELECT col FROM tbl -- your_trace_key: 648840f6-7f92-468b-b298-d38f05c541d4
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

### PostgreSQL

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

## NoSQL 协议簇

### Redis

通过解析 [Redis](https://redis.io/docs/reference/protocol-spec/) 协议，将 Redis Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header   | Response Header  | 描述 |
| ----- | ------------------ | ------------ | ---------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | --               | --               | --   |
|       | request_type       | 请求类型     | Payload 首个单词 | --               | --   |
|       | request_domain     | 请求域名     | --               | --               | --   |
|       | request_resource   | 请求资源     | Payload 余下字符 | --               | --   |
|       | request_id         | 请求 ID      | --               | --               | --   |
|       | endpoint           | 端点         | --               | --               | --   |
| Resp. | response_code      | 响应码       | --               | --               | --   |
|       | response_status    | 响应状态     | --               | ERR 消息         | 正常: 无 `ERR` 消息; 服务端异常: ERR 消息 |
|       | response_exception | 响应异常     | --               | ERR 消息 Payload | --   |
|       | response_result    | 响应结果     | --               | --               | --   |
| Trace | trace_id           | TraceID      | --               | --               | --   |
|       | span_id            | SpanID       | --               | --               | --   |
|       | x_request_id       | X-Request-ID | --               | --               | --   |
| Misc. | --                 | --           | --               | --               | --   |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文             | Request              |  Response            | 描述 |
| ------------------ | -----------------| -------------------- | --------------------- | -- |
| request            | 请求           | --                    | --                                      | Request 个数 |
| response           | 响应           | --                    |                                         | Response 个数 |
| sql_affected_rows  | SQL影响行数    | --                    | `command complete` 报文的 Affected Rows | -- |
| log_count          | 日志总量       | --                    | --                                      | -- |
| error              | 异常           | --                    | --                                      | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --                    | --                                      | -- |
| server_error       | 服务端异常     | --                    | `ERR`报文                               | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --                    | --                                      | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --                    | --                                      | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --                    | --                                      | 服务端异常 / 响应 |

### MongoDB

通过解析 [MongoDB](https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/) 协议，将 MongoDB Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header | Response Header        | 描述 |
| ----- | ------------------ | ------------ | -------------- | ---------------------- | ---- |
| Req.  | version            | 协议版本     | --             | --                     | --   |
|       | request_type       | 请求类型     | OpCode         | --                     | --   |
|       | request_domain     | 请求域名     | --             | --                     | --   |
|       | request_resource   | 请求资源     | BodyDocument   | --                     | --   |
|       | request_id         | 请求 ID      | --             | --                     | --   |
|       | endpoint           | 端点         | --             | --                     | --   |
| Resp. | response_code      | 响应码       | --             | BodyDocument 的 Code   | --   |
|       | response_status    | 响应状态     | --             | BodyDocument 的 Code   | 根据 Code 判断 |
|       | response_exception | 响应异常     | --             | BodyDocument 的 errmsg | --   |
|       | response_result    | 响应结果     | --             | --                     | --   |
| Trace | trace_id           | TraceID      | --             | --                     | --   |
|       | span_id            | SpanID       | --             | --                     | --   |
|       | x_request_id       | X-Request-ID | --             | --                     | --   |
| Misc. | --                 | --           | --             | --                     | --   |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文             | Request              |  Response            | 描述 |
| ------------------ | -----------------| -------------------- | --------------------- | -- |
| request            | 请求           | --                    | --                                      | Request 个数 |
| response           | 响应           | --                    |                                         | Response 个数 |
| error              | 异常           | --                    | --                                      | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | --                    | --                                       | -- |
| server_error       | 服务端异常     | --                    | `ERR`报文                                | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --                    | --                                      | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --                    | --                                      | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --                    | --                                      | 服务端异常 / 响应 |

## 消息队列协议簇

### Kafka

通过解析 [Kafka](https://kafka.apache.org/protocol.html#protocol_messages) 协议，将 Kafka Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header            | Response Header           | 描述 |
| ----- | ------------------ | ------------ | ------------------------- | ------------------------- | ---- |
| Req.  | version            | 协议版本     | request_api_version       | request_api_key           | --  |
|       | request_type       | 请求类型     | request_api_key           | request_api_version       | 支持的 [API Key 列表](https://kafka.apache.org/protocol.html#protocol_api_keys) |
|       | request_domain     | 请求域名     | topic                     | topic                     | 仅 Produce、Fetch 消息，取第一个对应字段 |
|       | request_resource   | 请求资源     | $topic-$partition:$offset | $topic-$partition:$offset | 仅 Produce、Fetch 消息，取第一个对应字段 [1][2] |
|       | request_id         | 请求 ID      | correlation_id            | correlation_id            | 参考：[使用 CorrelationID 关联 Req-Resp 通信场景](https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-CommonRequestandResponseStructure) |
|       | endpoint           | 端点         | $topic-$partition         | $topic-$partition         | 仅 Produce、Fetch 消息，取第一个对应字段 |
| Resp. | response_code      | 响应码       | --                        | error_code                | 仅 Produce、Fetch、JoinGroup、LeaveGroup、SyncGroup 消息 |
|       | response_status    | 响应状态     | --                        | error_code                | 正常: error_code=0; 服务端异常: error_code!=0 |
|       | response_exception | 响应异常     | --                        | error_code                | error_code 的[英文描述](http://kafka.apache.org/protocol#protocol_error_codes) |
|       | response_result    | 响应结果     | --                        | --                        | --   |
| Trace | trace_id           | TraceID      | traceparent, sw8          | traceparent, sw8          | 从首个 Record 的对应 Header 字段中提取 |
|       | span_id            | SpanID       | traceparent, sw8          | traceparent, sw8          | 从首个 Record 的对应 Header 字段中提取 |
|       | x_request_id       | X-Request-ID | correlation_id            | correlation_id            | 参考：[使用 CorrelationID 关联 Req-Resp 通信场景](https://cwiki.apache.org/confluence/display/KAFKA/A+Guide+To+The+Kafka+Protocol#AGuideToTheKafkaProtocol-CommonRequestandResponseStructure) |
| Misc. | attribute.group_id | --           | group_id                  | group_id                  | 仅 JoinGroup、LeaveGroup、SyncGroup 消息 |

- [1] 表中所有 partition 对应 Kafka 协议中的 partition id 或 partition index。
- [2] Produce 的 offset 取自 Response 中的 base_offset，Fetch 的 offset 取自 Request 中的 fetch_offset。

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

### MQTT

通过解析 [MQTT](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) 协议，将 MQTT Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header   | Response Header        | 描述 |
| ----- | ------------------ | ------------ | ---------------- | ---------------------- | ---- |
| Req.  | version            | 协议版本     | --               | --                     | --   |
|       | request_type       | 请求类型     | PacketKind       | --                     | --   |
|       | request_domain     | 请求域名     | client_id        | --                     | --   |
|       | request_resource   | 请求资源     | topic            | --                     | --   |
|       | request_id         | 请求 ID      | --               | --                     | --   |
|       | endpoint           | 端点         | topic            | --                     | --   |
| Resp. | response_code      | 响应码       | --               | code                   | 仅 `connect_ack` 消息获取了 code |
|       | response_status    | 响应状态     | --               | code                   | 正常: code=0; 客户端异常: code=1/2/4/5; 服务端异常: code=3 |
|       | response_exception | 响应异常     | --               | --                     | --   |
|       | response_result    | 响应结果     | --               | --                     | --   |
| Trace | trace_id           | TraceID      | --               | --                     | --   |
|       | span_id            | SpanID       | --               | --                     | --   |
|       | x_request_id       | X-Request-ID | --               | --                     | --   |
| Misc. | --                 | --           | --               | --                     | --   |

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

### AMQP

通过解析 [AMQP](https://www.rabbitmq.com/specification.html) 协议（即 [RabbitMQ](https://www.rabbitmq.com/protocols.html) 的主要协议） 协议，将 AMQP Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header                | Response Header        | 描述 |
| ----- | ------------------ | ------------ | ----------------------------- | ---------------------- | ---- |
| Req.  | version            | 协议版本     | version                       | --                     | 0-9-1 |
|       | request_type       | 请求类型     | class_id.method_id            | --                     | 例如: Channel.OpenOK |
|       | request_domain     | 请求域名     | vhost                         | --                     | --   |
|       | request_resource   | 请求资源     | exchange.routing_key 或 queue | --                     | --   |
|       | request_id         | 请求 ID      | --                            | --                     | --   |
|       | endpoint           | 端点         | exchange.routing_key 或 queue | --                     | --   |
| Resp. | response_code      | 响应码       | --                            | method_id              | OpenOK |
|       | response_status    | 响应状态     | --                            | --                     | 均视为正常 |
|       | response_exception | 响应异常     | --                            | --                     | --   |
|       | response_result    | 响应结果     | --                            | --                     | --   |
| Trace | trace_id           | TraceID      | traceparent, sw8              | traceparent, sw8       | Content Header 中的自定义字段 |
|       | span_id            | SpanID       | traceparent, sw8              | traceparent, sw8       | Content Header 中的自定义字段 |
|       | x_request_id       | X-Request-ID | --                            | --                     | --   |
| Misc. | --                 | --           | --                            | --                     | --   |

注意：受限于协议特征，目前仅支持识别在 agent 启动后建立连接的 AMQP 协议。

另外，以下为单向消息，会被直接保存为 type=session 的调用日志：
- Connection.Blocked (`s->c`)
- Connection.Unblocked (`s->c`)
- Basic.Return (`s->c`)
- Basic.Ack (`both`)
- Basic.Nack (`both`)
- Basic.Reject (`c->s`)
- Basic.RecoverAsync (`c->s`)
- Content-Header (`both`)
- Content-Body (`both`)
- Protocol-Header (`c->s`)
而如下消息可能有、也可能没有 ACK，DeepFlow 统一忽略他们的响应（因为 ACK 中没有关键信息，由于不会稳定 ACK 也无需计算时延）：
- Basic.Publish (`c->s`)
- Basic.Deliver (`s->c`)

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                | 中文          | Request        | Response   | 描述 |
| -----------------  | ------------- | -------------- | ------------ | -- |
| request            | 请求           | --            | --           | Request 个数 |
| response           | 响应           | --            | --           | Response 个数 |
| log_count          | 日志总量        | --            | --           | -- |
| error              | 异常           | --            | --            | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常      | --            | --             | -- |
| server_error       | 服务端异常      | --            | --             | -- |
| error_ratio        | 异常比例        | --            | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例   | --            | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例   | --            | --           | 服务端异常 / 响应 |

### OpenWire

通过解析 [OpenWire](https://activemq.apache.org/openwire)（即 [ActiveMQ](https://activemq.apache.org/protocols) 的默认协议） 协议，将 OpenWire Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header   | Response Header  | 描述 |
| ----- | ------------------ | ------------ | ---------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | version          | --               | --   |
|       | request_type       | 请求类型     | OpenWireCommand  | --               | --   |
|       | request_domain     | 请求域名     | broker_url       | --               | --   |
|       | request_resource   | 请求资源     | topic            | --               | --   |
|       | request_id         | 请求 ID      | command_id       | correlation_id [1]  | 请求与响应的对应关系详见 [2] |
|       | endpoint           | 端点         | topic            | --               | --   |
| Resp. | response_code      | 响应码       | --               | --               | --   |
|       | response_status    | 响应状态     | --               | --               | 正常: 无 error message; 服务端异常: 有 error message |
|       | response_exception | 响应异常     | --               | error message    | --   |
|       | response_result    | 响应结果     | --               | --               | --   |
| Trace | trace_id           | TraceID      | traceparent, sw8 | traceparent, sw8 | --   |
|       | span_id            | SpanID       | traceparent, sw8 | traceparent, sw8 | --   |
|       | x_request_id       | X-Request-ID | correlation_id   | correlation_id   | 参考：[ActiveMQ 中的 CorrelationID](https://activemq.apache.org/how-should-i-implement-request-response-with-jms) |
| Misc. | --                 | --           | --               | --               | --   |

- [1] 注意与下方 x_request_id 对应的 correlation_id 字段区分，为两个不同的字段
- [2] 当 request 的 response_required 为 true 时，对应 response 的 correlation_id 字段与 request 的 command_id 应当一致

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称              | 中文    | Request         | Response   | 描述 |
| -----------------| ------- | --------------- | ---------- | -- |
| request            | 请求           | --           | --           | Request 个数 |
| response           | 响应           | --           |              | Response 个数 |
| log_count          | 日志总量       | --           | --           | -- |
| error              | 异常           | --           | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | -- | --  | -- |
| server_error       | 服务端异常     | -- | --  | -- |
| error_ratio        | 异常比例      | --           | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --           | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --           | --           | 服务端异常 / 响应 |

### NATS

通过解析 [NATS](https://docs.nats.io/reference/reference-protocols/nats-protocol) 协议，将 NATS Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                | 中文          | Request Header   | Response Header  | 描述 |
| ----- | ------------------ | ------------ | ---------------- | ---------------- | ---- |
| Req.  | version            | 协议版本      | version          | --               | 使用 INFO 中的 version |
|       | request_type       | 请求类型      | NatsMessage      | --               | 如 INFO, SUB, PUB, MSG |
|       | request_domain     | 请求域名      | server_name      | --               | 使用 INFO 中的 server_name |
|       | request_resource   | 请求资源      | subject          | --               | --   |
|       | request_id         | 请求 ID       | --               | --               | --   |
|       | endpoint           | 端点          | subject          | --               | 仅 subject 第一个 `.` 之前的部分 |
| Resp. | response_code      | 响应码        | --               | --               | --   |
|       | response_status    | 响应状态      | --               | --               | 均视为正常 |
|       | response_exception | 响应异常      | --               | --               | --   |
|       | response_result    | 响应结果      | --               | --               | --   |
| Trace | trace_id           | TraceID      | traceparent, sw8 | traceparent, sw8 | 在 HMSG, HPUB 中的 NATS headers 提取   |
|       | span_id            | SpanID       | traceparent, sw8 | traceparent, sw8 | 在 HMSG, HPUB 中的 NATS headers 提取   |
|       | x_request_id       | X-Request-ID | --               | --               | --   |
| Misc. | --                 | --           | --               | --               | --   |

注意，除了 Info/Connect、Ping/Pong 这两组消息以外，其他消息均为单向消息，会被直接保存为 type=session 的调用日志：


**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称              | 中文    | Request         | Response   | 描述 |
| -----------------| ------- | --------------- | ---------- | -- |
| request            | 请求          | --           | --           | Request 个数 |
| response           | 响应          | --           |              | Response 个数 |
| log_count          | 日志总量      | --           | --           | -- |
| error              | 异常          | --           | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | -- | --  | -- |
| server_error       | 服务端异常     | -- | --  | -- |
| error_ratio        | 异常比例      | --           | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --           | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --           | --           | 服务端异常 / 响应 |

### Pulsar

通过解析 [Pulsar](https://pulsar.apache.org/docs/3.2.x/client-libraries-python/) 协议，将 Pulsar Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称                | 中文          | Request Header   | Response Header  | 描述 |
| ----- | ------------------ | ------------ | ---------------- | ---------------- | ---- |
| Req.  | version            | 协议版本      | protocol_version | --               | 取 CommandConnect 和 CommandConnected 中的小者 |
|       | request_type       | 请求类型      | command          | --               | --   |
|       | request_domain     | 请求域名      | proxy_to_broker_url | --            | 在 CommandConnect 中 |
|       | request_resource   | 请求资源      | topic            | --               | 取协议 topic 最后一个 / 之后的内容 |
|       | request_id         | 请求 ID       | request_id      | --               | 对于 Send/SendError/SendReceipt，由于命令无 request_id，另取 producer_id 和 sequence_id 的低 16 位拼接作为请求 ID |
|       | endpoint           | 端点          | topic            | --               | --   |
| Resp. | response_code      | 响应码        | --              | code              | --   |
|       | response_status    | 响应状态      | --              | status            | --   |
|       | response_exception | 响应异常      | --              | exception         | --   |
|       | response_result    | 响应结果      | --              | --                | --   |
| Trace | trace_id           | TraceID      | traceparent, sw8 | traceparent, sw8 | 在 HMSG, HPUB 中的 NATS headers 提取   |
|       | span_id            | SpanID       | traceparent, sw8 | traceparent, sw8 | 在 HMSG, HPUB 中的 NATS headers 提取   |
|       | x_request_id       | X-Request-ID | x_request_id     | x_request_id     | --   |
| Misc. | --                 | --           | --               | --               | --   |

注意，以下为单向消息，会被直接保存为 type=session 的调用日志：
- Ack
- Flow
- Message
- RedeliverUnacknowledgedMessages
- ReachedEndOfTopic
- ActiveConsumerChange
- AckResponse
- WatchTopicList
- WatchTopicListSuccess
- WatchTopicUpdate
- WatchTopicListClose
- TopicMigrated

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称              | 中文    | Request         | Response   | 描述 |
| -----------------| ------- | --------------- | ---------- | -- |
| request            | 请求          | --           | --           | Request 个数 |
| response           | 响应          | --           |              | Response 个数 |
| log_count          | 日志总量      | --           | --           | -- |
| error              | 异常          | --           | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | -- | --  | -- |
| server_error       | 服务端异常     | -- | --  | -- |
| error_ratio        | 异常比例      | --           | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --           | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --           | --           | 服务端异常 / 响应 |

### ZMTP

通过解析 [ZMTP](https://rfc.zeromq.org/spec/23/) 协议（即 ZeroMQ 使用的消息传输协议），将 ZMTP Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header   | Response Header  | 描述 |
| ----- | ------------------ | ------------ | ---------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | version          | --               | --   |
|       | request_type       | 请求类型     | frame_type       | --               | --   |
|       | request_domain     | 请求域名     | subscription     | --               | 仅当 socket 类型为 PUB/SUB/XPUB/XSUB |
|       | request_resource   | 请求资源     | subscription     | --               | 仅当 socket 类型为 PUB/SUB/XPUB/XSUB |
| Resp. | response_code      | 响应码       | --               | --               | --   |
|       | response_status    | 响应状态     | --               | --               | 正常: 无 error message; 异常: 有 error message |
|       | response_exception | 响应异常     | --               | error message    | --   |
| Misc. | --                 | --           | --               | --              | --   |

- ZMTP 协议中，仅当一端 socket 为 REQ/REP 时，请求消息必须等待上一次请求得到响应后才能发起，请求与响应将聚合为一个会话
- 其余类型目前仅识别为单向消息，会被直接保存为 type=session 的调用日志

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称              | 中文    | Request         | Response   | 描述 |
| -----------------| ------- | --------------- | ---------- | -- |
| request            | 请求           | --           | --           | Request 个数 |
| response           | 响应           | --           |              | Response 个数 |
| log_count          | 日志总量       | --           | --           | -- |
| error              | 异常           | --           | --           | 客户端异常 + 服务端异常 |
| client_error       | 客户端异常     | -- | --  | -- |
| server_error       | 服务端异常     | -- | --  | -- |
| error_ratio        | 异常比例      | --           | --           | 异常 / 响应 |
| client_error_ratio | 客户端异常比例 | --           | --           | 客户端异常 / 响应 |
| server_error_ratio | 服务端异常比例 | --           | --           | 服务端异常 / 响应 |

## 网络协议簇

### DNS

通过解析 [DNS](https://www.ietf.org/rfc/rfc1035.txt) 协议，将 DNS Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header   | Response Header  | 描述 |
| ----- | ------------------ | ------------ | ---------------- | ---------------- | ---- |
| Req.  | version            | 协议版本     | --               | --               | --   |
|       | request_type       | 请求类型     | QTYPE            | --               | --   |
|       | request_domain     | 请求域名     | QNAME            | --               | 仅在查询 IPv4 或 IPv6 地址时有值 |
|       | request_resource   | 请求资源     | QNAME            | --               | --   |
|       | request_id         | 请求 ID      | ID               | ID               | --   |
|       | endpoint           | 端点         | QNAME            | --               | --   |
| Resp. | response_code      | 响应码       | --               | RCODE            | --   |
|       | response_status    | 响应状态     | --               | RCODE            | 正常: RCODE=0x0; 客户端异常: RCODE=0x1/0x3; 服务端异常: 其他 |
|       | response_exception | 响应异常     | --               | RCODE            | RCODE 的描述，参考 [RFC 2929 Section 2.3](https://www.rfc-editor.org/rfc/rfc2929#section-2.3) |
|       | response_result    | 响应结果     | --               | RDATA            | --   |
| Trace | trace_id           | TraceID      | --               | --               | --   |
|       | span_id            | SpanID       | --               | --               | --   |
|       | x_request_id       | X-Request-ID | --               | --               | --   |
| Misc. | --                 | --           | --               | --               | --   |

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

## OpenTelemetry 数据集成

通过解析 OpenTelemetry 协议，将 OpenTelemetry 协议的数据结构的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                 | 中文        | OpenTelemetry 数据结构 | 描述 |
| ------------------- | ----------- | ---------------------- | ---- |
| start_time          | 开始时间     | span.start_time_unix_nano | -- |
| end_time            | 结束时间     | span.end_time_unix_nano   | -- |
| protocol            | 网络协议     | span.attribute.net.transport | 映射到对应的枚举值 |
| attributes          | Misc.butes   | resource./span.attributes | -- |
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
| observation_point   | 观测点       | span.spankind.SPAN_KIND_CLIENT/SPAN_KIND_PRODUCER：客户端应用(c-app)；span.spankind.SPAN_KIND_SERVER/SPAN_KIND_CONSUMER：服务端应用(s-app)；span.spankind.SPAN_KIND_UNSPECIFIED/SPAN_KIND_INTERNAL：应用(app) | -- |

- observation_point = c-app
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

