---
title: HTTP
permalink: /features/l7-protocols/http
---

# HTTP

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

# HTTP2

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
