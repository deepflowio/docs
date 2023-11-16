**Metrics Field Mapping Table, this table only contains fields with mapping relationships**

| Name               | Chinese            | Request     | Response    | Description                           |
| ------------------ | ------------------ | ----------- | ----------- | ------------------------------------- |
| request            | request            | --          | --          | Number of Requests                    |
> This document was translated by GPT-4

| response           | response           | --          | --          | Number of Responses                   |
| session_length     | session length     | --          | --          | Request length + Response length      |
| request_length     | request length     | Data length | --          | --                                    |
| response_length    | response length    | --          | Data length | --                                    |
| log_count          | total logs         | --          | --          | --                                    |
| error              | error              | --          | --          | Client errors + Server errors         |
| client_error       | client error       | --          | Status      | Refer to `response_code` in Tag field |
| server_error       | server error       | --          | Status      | Refer to `response_code` in Tag field |
| error_ratio        | error ratio        | --          | --          | Errors / Responses                    |
| client_error_ratio | client error ratio | --          | --          | Client errors / Responses             |
| server_error_ratio | server error ratio | --          | --          | Server errors / Responses             |

### gRPC

The gRPC protocol is parsed and the fields of gRPC Request / Response are mapped to the corresponding fields in l6_flow_log as shown in the following table：

**Tag Field Mapping Table, this table only contains fields with mapping relationships**

| Name                      | Chinese            | HTTP1 Request Header | HTTP2 Response Header | Description                                                                                                                                              |
| ------------------------- | ------------------ | -------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| version                   | protocol version   | Version              | --                    | --                                                                                                                                                       |
| request_type              | request type       | Method               | --                    | --                                                                                                                                                       |
| request_domain            | request domain     | Host                 | --                    | --                                                                                                                                                       |
| request_resource          | request resource   | Service-Name         | --                    | --                                                                                                                                                       |
| request_id                | request ID         | Stream ID            | --                    | --                                                                                                                                                       |
| response_status           | response status    | --                   | Status Code           | Client error: Status Code=3xx; Server error: Status Code=5xx                                                                                             |
| response_code             | response code      | --                   | Status Code           | --                                                                                                                                                       |
| response_exception        | response exception | --                   | Status Code           | The official English description of Status Code refers to [Wikipedia List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
| endpoint                  | endpoint           | Path                 | --                    | --                                                                                                                                                       |
| trace_id                  | TraceID            | traceparent, sw7     | traceparent, sw8      | The http_log_trace_id of deepflow-agent can be configured to modify the matching Header, as detailed in the HTTP protocol description                    |
| span_id                   | SpanID             | traceparent, sw7     | traceparent, sw8      | The http_log_span_id of deepflow-agent can be configured to modify the matching Header, as detailed in the HTTP protocol description                     |
| http_proxy_client         | HTTP proxy client  | X-Forwarded-For      | X-Forwarded-For       | The http_log_proxy_client of deepflow-agent can be configured to modify the matching Header                                                              |
| x_request_id              | X-Request-ID       | X-Request-ID         | X-Request-ID          | The http_log_x_request_id of deepflow-agent can be configured to modify the matching Header                                                              |
| attribute.rpc_service     | --                 | Service-Name         | --                    | --                                                                                                                                                       |
| attribute.http_user_agent | --                 | User-Agent           | --                    | --                                                                                                                                                       |

**Metrics Field Mapping Table, this table only contains fields with mapping relationships**

| Name               | Chinese            | HTTP1 Request Header | HTTP2 Response Header | Description                           |
| ------------------ | ------------------ | -------------------- | --------------------- | ------------------------------------- |
| request            | request            | --                   | --                    | Number of Requests                    |
| response           | response           |                      | --                    | Number of Responses                   |
| session_length     | session length     | --                   | --                    | Request length + Response length      |
| request_length     | request length     | Content-Length       | --                    | --                                    |
| request_length     | response length    | --                   | Content-Length        | --                                    |
| log_count          | total logs         | --                   | --                    | --                                    |
| error              | error              | --                   | --                    | Client errors + Server errors         |
| client_error       | client error       | --                   | Status Code           | Refer to `response_code` in Tag field |
| server_error       | server error       | --                   | Status Code           | Refer to `response_code` in Tag field |
| error_ratio        | error ratio        | --                   | --                    | Errors / Responses                    |
| client_error_ratio | client error ratio | --                   | --                    | Client errors / Responses             |
| server_error_ratio | server error ratio | --                   | --                    | Server errors / Responses             |

### SOFARPC

The [SofaRPC](https://blog.50cto.com/throwable/4896897) protocol is parsed and the fields of FastCGI Request / Response are mapped to the corresponding fields in l7_flow_log as shown in the following table：

**Tag Field Mapping Table, this table contains only fields with mapping relationships**

| Name             | Chinese          | Request                                                                                                                                           | Response  | Description                                                    |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------- |
| request_type     | request type     | header field `sofa_head_method_name` or the methodName field of class com.alipay.sofa.rpc.core.request.SofaRequest                                | --        | --                                                             |
| request_resource | request resource | `sofa_head_target_service` in header or targetServiceUniqueName field in com.alipay.sofa.rpc.core.request.SofaRequest                             | --        | --                                                             |
| request_domain   | request domain   | --                                                                                                                                                | --        | --                                                             |
| request_id       | request ID       | req_id                                                                                                                                            | --        | --                                                             |
| response_status  | response status  | --                                                                                                                                                | resp_code | Client error: Status Code = 7; Server error: Status Code ！= 0 |
| response_code    | response code    | --                                                                                                                                                | resp_code | Client error: Status Code = 7; Server error: Status Code ！= 0 |
| endpoint         | endpoint         | request_type/request_resource                                                                                                                     | --        | --                                                             |
| trace_id         | TraceID          | rpc_trace_context.sofaTraceId in header or new_rpc_trace_context or the `sofaTraceId` field of class com.alipay.sofa.rpc.core.request.SofaRequest | --        | --                                                             |
| span_id          | SpanID           | new_rpc_trace_context in header                                                                                                                   | --        | --                                                             |
| x_request_id     | --               | --                                                                                                                                                | --        | --                                                             |

**Metrics Field Mapping Table, this table only contains fields with mapping relationships**

| Name               | Chinese            | Request | Response    | Description                           |
| ------------------ | ------------------ | ------- | ----------- | ------------------------------------- |
| request            | request            | --      | --          | Number of Requests                    |
| response           | response           | --      | --          | Number of Responses                   |
| session_length     | session length     | --      | --          | --                                    |
| request_length     | request length     | --      | --          | --                                    |
| request_length     | response length    | --      | --          | --                                    |
| log_count          | total logs         | --      | --          | --                                    |
| error              | error              | --      | --          | Client errors + Server errors         |
| client_error       | client error       | --      | Status Code | Refer to `response_code` in Tag field |
| server_error       | server error       | --      | Status Code | Refer to `response_code` in Tag field |
| error_ratio        | error ratio        | --      | --          | Errors / Responses                    |
| client_error_ratio | client error ratio | --      | --          | Client errors / Responses             |
| server_error_ratio | server error ratio | --      | --          | Server errors / Responses             |

### FastCGI

The [FastCGI](https://www.mit.edu/~yandros/doc/specs/fcgi-spec.html) protocol is parsed and the fields of FastCGI Request / Response are mapped to the corresponding fields in l6_flow_log as shown in the following table：

**Tag Field Mapping Table, this table only contains fields with mapping relationships**

| Name             | Chinese          | Request                 | Response         | Description                                                                                                                           |
| ---------------- | ---------------- | ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| request_type     | request type     | REQUEST_METHOD in PARAM | --               | --                                                                                                                                    |
| request_resource | request resource | REQUEST_URI in PARAM    | --               | --                                                                                                                                    |
| request_domain   | request domain   | HTTP_HOST in PARAM      | --               | --                                                                                                                                    |
| request_id       | request ID       | request id              | --               | --                                                                                                                                    |
| response_status  | response status  | --                      | Status Code      | Client error: Status Code=3xx; Server error: Status Code=5xx                                                                          |
| response_code    | response code    | 199 in STDOUT’s Status  | Status Code      | --                                                                                                                                    |
| endpoint         | endpoint         | SERVER_ADDR in PARAM    | --               | --                                                                                                                                    |
| trace_id         | TraceID          | traceparent, sw7        | traceparent, sw8 | The http_log_trace_id of deepflow-agent can be configured to modify the matching Header, as detailed in the HTTP protocol description |
| span_id          | SpanID           | traceparent, sw7        | traceparent, sw8 | The http_log_span_id of deepflow-agent can be configured to modify the matching Header, as detailed in the HTTP protocol description  |
| x_request_id     | X-Request-ID     | X-Request-ID            | X-Request-ID     | The http_log_x_request_id of deepflow-agent can be configured to modify the matching Header                                           |
