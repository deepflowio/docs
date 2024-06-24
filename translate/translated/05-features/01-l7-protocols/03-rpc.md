---
title: RPC
permalink: /features/l7-protocols/rpc
---

> This document was translated by ChatGPT

# Dubbo

Supports Hessian2 and Kryo serialization algorithms. By parsing the [Dubbo](https://dubbo.apache.org/en/docs3-v2/java-sdk/reference-manual/protocol/overview/) protocol, the fields of Dubbo Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name                  | Chinese      | Request Header           | Response Header  | Description                                                                                                                               |
| -------- | --------------------- | ------------ | ------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Req.     | version               | 协议版本     | version                  | --               | --                                                                                                                                        |
|          | request_type          | 请求类型     | Method-Name              | --               | --                                                                                                                                        |
|          | request_domain        | 请求域名     | --                       | --               | --                                                                                                                                        |
|          | request_resource      | 请求资源     | Service-Name             | --               | --                                                                                                                                        |
|          | request_id            | 请求 ID      | Request-ID               | Request-ID       | --                                                                                                                                        |
|          | endpoint              | 端点         | Service-Name/Method-Name | --               | --                                                                                                                                        |
| Resp.    | response_code         | 响应码       | --                       | Status           | --                                                                                                                                        |
|          | response_status       | 响应状态     | --                       | Status           | Normal: 20; Client Exception: 30/40/90; Server Exception: 31/50/60/70/80/100                                                              |
|          | response_exception    | 响应异常     | --                       | Status           | Description of Status, refer to [Dubbo 协议详解](https://dubbo.apache.org/zh/blog/2018/10/05/dubbo-%E5%8D%8F%E8%AE%AE%E8%AF%A6%E8%A7%A3/) |
|          | response_result       | 响应结果     | --                       | --               | --                                                                                                                                        |
| Trace    | trace_id              | TraceID      | traceparent, sw8         | traceparent, sw8 | The `http_log_trace_id` configuration item of the Agent can define the name of the Header to be extracted                                 |
|          | span_id               | SpanID       | traceparent, sw8         | traceparent, sw8 | The `http_log_span_id` configuration item of the Agent can define the name of the Header to be extracted                                  |
|          | x_request_id          | X-Request-ID | --                       | --               | --                                                                                                                                        |
| Misc.    | attribute.rpc_service | --           | Service-Name             | --               | --                                                                                                                                        |

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request     | Response    | Description                                           |
| ------------------ | -------------- | ----------- | ----------- | ----------------------------------------------------- |
| request            | 请求           | --          | --          | Number of Requests                                    |
| response           | 响应           | --          | --          | Number of Responses                                   |
| session_length     | 会话长度       | --          | --          | Request length + Response length                      |
| request_length     | 请求长度       | Data length | --          | --                                                    |
| response_length    | 响应长度       | --          | Data length | --                                                    |
| log_count          | 日志总量       | --          | --          | --                                                    |
| error              | 异常           | --          | --          | Client Exception + Server Exception                   |
| client_error       | 客户端异常     | --          | Status      | Refer to the description of Tag field `response_code` |
| server_error       | 服务端异常     | --          | Status      | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --          | --          | Exception / Response                                  |
| client_error_ratio | 客户端异常比例 | --          | --          | Client Exception / Response                           |
| server_error_ratio | 服务端异常比例 | --          | --          | Server Exception / Response                           |

# gRPC

By parsing the gRPC protocol, the fields of gRPC Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name                  | Chinese         | Request Header    | Response Header  | Description                                                                                                               |
| -------- | --------------------- | --------------- | ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Req.     | version               | 协议版本        | Version           | --               | --                                                                                                                        |
|          | request_type          | 请求类型        | Method            | --               | --                                                                                                                        |
|          | request_domain        | 请求域名        | Host or Authority | --               | --                                                                                                                        |
|          | request_resource      | 请求资源        | Service-Name      | --               | --                                                                                                                        |
|          | request_id            | 请求 ID         | Stream ID         | Stream ID        | --                                                                                                                        |
|          | endpoint              | 端点            | Path              | --               | --                                                                                                                        |
| Resp.    | response_code         | 响应码          | --                | Status Code      | --                                                                                                                        |
|          | response_status       | 响应状态        | --                | Status Code      | Normal: 1XX/2XX/3XX; Client Exception: 4XX; Server Exception: 5XX                                                         |
|          | response_exception    | 响应异常        | --                | Status Code      | Description of Status Code, refer to [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
|          | response_result       | 响应结果        | --                | --               | --                                                                                                                        |
| Trace    | trace_id              | TraceID         | traceparent, sw8  | traceparent, sw8 | The `http_log_trace_id` configuration item of the Agent can define the name of the Header to be extracted                 |
|          | span_id               | SpanID          | traceparent, sw8  | traceparent, sw8 | The `http_log_span_id` configuration item of the Agent can define the name of the Header to be extracted                  |
|          | x_request_id          | X-Request-ID    | X-Request-ID      | X-Request-ID     | The `http_log_x_request_id` configuration item of the Agent can define the name of the Header to be extracted             |
|          | http_proxy_client     | HTTP 代理客户端 | X-Forwarded-For   | --               | The `http_log_proxy_client` configuration item of the Agent can define the name of the Header to be extracted             |
| Misc.    | attribute.rpc_service | --              | Service-Name      | --               | --                                                                                                                        |
| Misc.    | attribute.x           | --              | x                 | x                | Supports collecting custom header fields [1]                                                                              |

- [1] The protocol header fields that need to be additionally collected can be defined through the static_config.l7-protocol-advanced-features.extra-log-fields in the collector configuration. For example, when User-Agent and Cookie are added in the configuration, the fields attribute.user_agent and attribute.cookie can be viewed in the call log.

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | HTTP2 Request Header | HTTP2 Response Header | Description                                           |
| ------------------ | -------------- | -------------------- | --------------------- | ----------------------------------------------------- |
| request            | 请求           | --                   | --                    | Number of Requests                                    |
| response           | 响应           |                      | --                    | Number of Responses                                   |
| session_length     | 会话长度       | --                   | --                    | Request length + Response length                      |
| request_length     | 请求长度       | Content-Length       | --                    | --                                                    |
| request_length     | 响应长度       | --                   | Content-Length        | --                                                    |
| log_count          | 日志总量       | --                   | --                    | --                                                    |
| error              | 异常           | --                   | --                    | Client Exception + Server Exception                   |
| client_error       | 客户端异常     | --                   | Status Code           | Refer to the description of Tag field `response_code` |
| server_error       | 服务端异常     | --                   | Status Code           | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --                   | --                    | Exception / Response                                  |
| client_error_ratio | 客户端异常比例 | --                   | --                    | Client Exception / Response                           |
| server_error_ratio | 服务端异常比例 | --                   | --                    | Server Exception / Response                           |

# SOFARPC

By parsing the [SOFARPC](https://blog.51cto.com/throwable/4896897) protocol, the fields of SOFARPC Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese      | Request Header                  | Response Header | Description                                              |
| -------- | ------------------ | ------------ | ------------------------------- | --------------- | -------------------------------------------------------- |
| Req.     | version            | 协议版本     | --                              | --              | --                                                       |
|          | request_type       | 请求类型     | method_name etc. [1]            | --              | --                                                       |
|          | request_domain     | 请求域名     | --                              | --              | --                                                       |
|          | request_resource   | 请求资源     | target_service etc. [2]         | --              | --                                                       |
|          | request_id         | 请求 ID      | req_id                          | req_id          | --                                                       |
|          | endpoint           | 端点         | $request_type/$request_resource | --              | --                                                       |
| Resp.    | response_code      | 响应码       | --                              | resp_code       | --                                                       |
|          | response_status    | 响应状态     | --                              | resp_code       | Normal: 0; Client Exception: 8; Server Exception: others |
|          | response_exception | 响应异常     | --                              | --              | --                                                       |
|          | response_result    | 响应结果     | --                              | --              | --                                                       |
| Trace    | trace_id           | TraceID      | sofaTraceId etc. [3]            | --              | --                                                       |
|          | span_id            | SpanID       | trace_context etc. [4]          | --              | --                                                       |
|          | x_request_id       | X-Request-ID | --                              | --              | --                                                       |
| Misc.    | --                 | --           | --                              | --              | --                                                       |

- [1] sofa_head_method_name in the request header, or the methodName field of the com.alipay.sofa.rpc.core.request.SofaRequest class.
- [2] sofa_head_target_service in the request header, or the targetServiceUniqueName field of the com.alipay.sofa.rpc.core.request.SofaRequest class.
- [3] rpc_trace_context.sofaTraceId in the request header, or new_rpc_trace_context, or the sofaTraceId field of the com.alipay.sofa.rpc.core.request.SofaRequest class.
- [4] new_rpc_trace_context field in the request header.

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request | Response    | Description                                           |
| ------------------ | -------------- | ------- | ----------- | ----------------------------------------------------- |
| request            | 请求           | --      | --          | Number of Requests                                    |
| response           | 响应           | --      | --          | Number of Responses                                   |
| session_length     | 会话长度       | --      | --          | --                                                    |
| request_length     | 请求长度       | --      | --          | --                                                    |
| request_length     | 响应长度       | --      | --          | --                                                    |
| log_count          | 日志总量       | --      | --          | --                                                    |
| error              | 异常           | --      | --          | Client Exception + Server Exception                   |
| client_error       | 客户端异常     | --      | Status Code | Refer to the description of Tag field `response_code` |
| server_error       | 服务端异常     | --      | Status Code | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --      | --          | Exception / Response                                  |
| client_error_ratio | 客户端异常比例 | --      | --          | Client Exception / Response                           |
| server_error_ratio | 服务端异常比例 | --      | --          | Server Exception / Response                           |

# FastCGI

By parsing the [FastCGI](https://www.mit.edu/~yandros/doc/specs/fcgi-spec.html) protocol, the fields of FastCGI Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table, the following table only includes fields with mapping relationships**

| Category | Name               | Chinese      | Request Header          | Response Header  | Description                                                                                                   |
| -------- | ------------------ | ------------ | ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Req.     | version            | 协议版本     | --                      | --               | --                                                                                                            |
|          | request_type       | 请求类型     | REQUEST_METHOD in PARAM | --               | --                                                                                                            |
|          | request_domain     | 请求域名     | HTTP_HOST in PARAM      | --               | --                                                                                                            |
|          | request_resource   | 请求资源     | REQUEST_URI in PARAM    | --               | --                                                                                                            |
|          | request_id         | 请求 ID      | Request ID              | Request ID       | --                                                                                                            |
|          | endpoint           | 端点         | DOCUMENT_URI in PARAM   | --               | --                                                                                                            |
| Resp.    | response_code      | 响应码       | --                      | Status Code      | Status in STDOUT, default 200                                                                                 |
|          | response_status    | 响应状态     | --                      | Status Code      | Normal: 1XX/2XX/3XX; Client Exception: 4XX; Server Exception: 5XX                                             |
|          | response_exception | 响应异常     | --                      | --               | --                                                                                                            |
|          | response_result    | 响应结果     | --                      | --               | --                                                                                                            |
| Trace    | trace_id           | TraceID      | traceparent, sw8        | traceparent, sw8 | The `http_log_trace_id` configuration item of the Agent can define the name of the Header to be extracted     |
|          | span_id            | SpanID       | traceparent, sw8        | traceparent, sw8 | The `http_log_span_id` configuration item of the Agent can define the name of the Header to be extracted      |
|          | x_request_id       | X-Request-ID | X-Request-ID            | X-Request-ID     | The `http_log_x_request_id` configuration item of the Agent can define the name of the Header to be extracted |
| Misc.    | --                 | --           | --                      | --               | --                                                                                                            |

**Metrics Field Mapping Table, the following table only includes fields with mapping relationships**

| Name               | Chinese        | Request | Response    | Description                                           |
| ------------------ | -------------- | ------- | ----------- | ----------------------------------------------------- |
| request            | 请求           | --      | --          | Number of Requests                                    |
| response           | 响应           | --      | --          | Number of Responses                                   |
| session_length     | 会话长度       | --      | --          | --                                                    |
| request_length     | 请求长度       | --      | --          | --                                                    |
| request_length     | 响应长度       | --      | --          | --                                                    |
| log_count          | 日志总量       | --      | --          | --                                                    |
| error              | 异常           | --      | --          | Client Exception + Server Exception                   |
| client_error       | 客户端异常     | --      | Status Code | Refer to the description of Tag field `response_code` |
| server_error       | 服务端异常     | --      | Status Code | Refer to the description of Tag field `response_code` |
| error_ratio        | 异常比例       | --      | --          | Exception / Response                                  |
| client_error_ratio | 客户端异常比例 | --      | --          | Client Exception / Response                           |
| server_error_ratio | 服务端异常比例 | --      | --          | Server Exception / Response                           |

# bRPC

By parsing the [bRPC](https://github.com/apache/brpc/blob/master/docs/cn/baidu_std.md) protocol, the fields of bRPC Request/Response are mapped to the corresponding fields in l7_flow_log. The mapping relationship is shown in the table below:

**Tag Field Mapping Table: The following table includes only the fields that have a mapping relationship**

| Category | Name               | Chinese      | Request Header           | Response Header     | Description                                |
| -------- | ------------------ | ------------ | ------------------------ | ------------------- | ------------------------------------------ |
| Req.     | version            | 协议版本     | --                       | --                  | --                                         |
|          | request_type       | 请求类型     | request.method_name      | --                  | --                                         |
|          | request_domain     | 请求域名     | --                       | --                  | --                                         |
|          | request_resource   | 请求资源     | request.service_name     | --                  | --                                         |
|          | request_id         | 请求 ID      | correlation_id           | --                  | Upper 32 bits of the 64-bit correlation_id |
|          | endpoint           | 端点         | service_name/method_name | --                  | --                                         |
| Resp.    | response_code      | 响应码       | --                       | Status Code         | --                                         |
|          | response_status    | 响应状态     | --                       | response.error_code | --                                         |
|          | response_exception | 响应异常     | --                       | response.error_text | --                                         |
|          | response_result    | 响应结果     | --                       | --                  | --                                         |
| Trace    | trace_id           | TraceID      | --                       | --                  | --                                         |
|          | span_id            | SpanID       | --                       | --                  | --                                         |
|          | x_request_id       | X-Request-ID | request.log_id           | --                  | --                                         |
| Misc.    | --                 | --           | --                       | --                  | --                                         |

**Metrics Field Mapping Table: The following table includes only the fields that have a mapping relationship**

| Name               | Chinese        | Request | Response | Description                                           |
| ------------------ | -------------- | ------- | -------- | ----------------------------------------------------- |
| request            | 请求           | --      | --       | Number of Requests                                    |
| response           | 响应           | --      | --       | Number of Responses                                   |
| session_length     | 会话长度       | --      | --       | --                                                    |
| request_length     | 请求长度       | --      | --       | --                                                    |
| response_length    | 响应长度       | --      | --       | --                                                    |
| log_count          | 日志总量       | --      | --       | --                                                    |
| error              | 异常           | --      | --       | Client Errors + Server Errors                         |
| client_error       | 客户端异常     | --      | --       | Refer to the description of `response_code` tag field |
| server_error       | 服务端异常     | --      | --       | Refer to the description of `response_code` tag field |
| error_ratio        | 异常比例       | --      | --       | Errors / Responses                                    |
| client_error_ratio | 客户端异常比例 | --      | --       | Client Errors / Responses                             |
| server_error_ratio | 服务端异常比例 | --      | --       | Server Errors / Responses                             |
