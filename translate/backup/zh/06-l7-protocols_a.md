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

| 名称                      | 中文            | Request Header   | Response Header  | 描述                                                                                                                              |
| ------------------------- | --------------- | ---------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| version                   | 协议版本        | 首行的 Version   | --               | --                                                                                                                                |
| request_type              | 请求类型        | 首行的 Method    | --               | --                                                                                                                                |
| request_domain            | 请求域名        | Host             | --               | --                                                                                                                                |
| request_resource          | 请求资源        | Path             | --               | --                                                                                                                                |
| request_id                | 请求 ID         | Stream ID        | --               | 仅针对 HTTP2                                                                                                                      |
| response_status           | 响应状态        | --               | Status Code      | 客户端异常：Status Code=4xx; 服务端异常：Status Code=5xx                                                                          |
| response_code             | 响应码          | --               | Status Code      | --                                                                                                                                |
| response_exception        | 响应异常        | --               | Status Code      | Status Code 对应的官方英文描述，[参考维基百科 List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
| trace_id                  | TraceID         | traceparent, sw8 | traceparent, sw8 | 可配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Header，详细描述见后续说明                                                  |
| span_id                   | SpanID          | traceparent, sw8 | traceparent, sw8 | 可配置 deepflow-agent 的 http_log_span_id 修改匹配的 Header，详细描述见后续说明                                                   |
| http_proxy_client         | HTTP 代理客户端 | X-Forwarded-For  | --               | 可配置 deepflow-agent 的 http_log_proxy_client 修改匹配的 Header                                                                  |
| x_request_id              | X-Request-ID    | X-Request-ID     | X-Request-ID     | 可配置 deepflow-agent 的 http_log_x_request_id 修改匹配的 Header                                                                  |
| attribute.http_user_agent | --              | User-Agent       | --               | --                                                                                                                                |
| attribute.http_referer    | --              | Referer          | --               | --                                                                                                                                |

- TraceID（trace_id）只读取以下 HTTP Header 部分数据，其他 Header 读取全部数据：
  - `sw8`/`sw6` Header 中的 `trace ID`
  - `uber-trace-id` Header 中的 `{trace-id}`
  - `traceparent` Header 中的 `trace-id`
- SpanID（span_id）只读取以下 HTTP Header 部分数据，其他 Header 读取全部数据：
  - `sw8`/`sw6` Header 中的 `segment ID-span ID`
  - `uber-trace-id` Header 中的 `{span-id}`
  - `traceparent` Header 中的 `parent-id`

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request Header | Response Header | 描述                               |
| ------------------ | -------------- | -------------- | --------------- | ---------------------------------- |
| request            | 请求           | --             | --              | Request 个数                       |
| response           | 响应           | --             | --              | Response 个数                      |
| session_length     | 会话长度       | --             | --              | 请求长度 + 响应长度                |
| request_length     | 请求长度       | Content-Length | --              | --                                 |
| request_length     | 响应长度       | --             | Content-Length  | --                                 |
| log_count          | 日志总量       | --             | --              | Request Log 行数                   |
| error              | 异常           | --             | --              | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --             | Status Code     | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --             | Status Code     | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --             | --              | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --             | --              | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --             | --              | 服务端异常 / 响应                  |

### HTTP2

TODO

## RPC 协议簇

### Dubbo

通过解析 [Dubbo](https://dubbo.apache.org/en/docs3-v2/java-sdk/reference-manual/protocol/overview/) 协议，将 Dubbo Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称                  | 中文     | Request                             | Response | 描述                                                                                                                                    |
| --------------------- | -------- | ----------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| version               | 协议版本 | Version                             | --       | --                                                                                                                                      |
| request_type          | 请求类型 | Method name                         | --       | --                                                                                                                                      |
| request_resource      | 请求资源 | Service name                        | --       | --                                                                                                                                      |
| request_id            | 请求 ID  | Request ID                          | --       | --                                                                                                                                      |
| response_status       | 响应状态 | --                                  | Status   | 正常: Status=20; 客户端异常: Status=30/40/90; 服务端异常: Status=31/50/60/70/80/100                                                     |
| response_code         | 响应码   | --                                  | Status   | --                                                                                                                                      |
| response_exception    | 响应异常 | --                                  | Status   | Status 对应的官方英文描述[参考 Dubbo 协议详解](https://dubbo.apache.org/zh/blog/2018/10/05/dubbo-%E5%8D%8F%E8%AE%AE%E8%AF%A6%E8%A7%A3/) |
| endpoint              | 端点     | Service name/Method name            | --       | --                                                                                                                                      |
| trace_id              | TraceID  | Attachments 字段的 traceparent, sw8 | --       | 可配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Attachments 字段，详细说明见 HTTP 协议描述                                        |
| span_id               | SpanID   | Attachments 字段的 traceparent, sw8 | --       | 对配置 deepflow-agent 的 http_log_trace_id 修改匹配的 Attachments 字段，详细说明见 HTTP 协议描述                                        |
| attribute.rpc_service | --       | Service name                        | --       | --                                                                                                                                      |
