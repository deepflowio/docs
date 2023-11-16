---
title: List of Application Protocols
permalink: /features/universal-map/l7-protocols
---

> This document was translated by GPT-4

# Supported Application Protocols

[csv-L7 Protocol List](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)

# Explanation of Call Log Fields

The call log (`flow_log.l7_flow_log`) data table stores aggregated request logs for various protocols with a granularity of one minute and is composed of Tag and Metrics fields.

## Tags

Tag fields: These fields are mainly used for grouping and filtering. Detailed field descriptions are as follows.

[csv-querier Component Database Field Description](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.ch)

## Metrics

Metrics fields: These fields are mainly used for calculation. Detailed field descriptions are as follows.

[csv-querier Component Database Field Description](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.ch)

# Field Mapping of Each Application Protocol

## HTTP Protocol Family

### HTTP

By parsing the HTTP protocol, the fields of HTTP Request / Response are mapped to the corresponding fields in `l7_flow_log`, as shown in the table below:

**Tag Field Mapping Table, The Following Table Only Contains Fields With Mapping Relationships**

| Name                      | Chinese            | Request Header     | Response Header  | Description                                                                                                                                         |
| ------------------------- | ------------------ | ------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| version                   | Protocol Version   | First Line Version | --               | --                                                                                                                                                  |
| request_type              | Request Type       | First Line Method  | --               | --                                                                                                                                                  |
| request_domain            | Request Domain     | Host               | --               | --                                                                                                                                                  |
| request_resource          | Request Resource   | Path               | --               | --                                                                                                                                                  |
| request_id                | Request ID         | Stream ID          | --               | Only for HTTP2                                                                                                                                      |
| response_status           | Response Status    | --                 | Status Code      | Client Errors: Status Code=4xx; Server Errors: Status Code=5xx                                                                                      |
| response_code             | Response Code      | --                 | Status Code      | --                                                                                                                                                  |
| response_exception        | Response Exception | --                 | Status Code      | Status Code's official English description, [Refer to Wikipedia List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) |
| trace_id                  | TraceID            | traceparent, sw8   | traceparent, sw8 | Configurable `deepflow-agent`'s `http_log_trace_id` to modify the matching Header, detailed description will follow                                 |
| span_id                   | SpanID             | traceparent, sw8   | traceparent, sw8 | Configurable `deepflow-agent`'s `http_log_span_id` to modify the matching Header, detailed description will follow                                  |
| http_proxy_client         | HTTP Proxy Client  | X-Forwarded-For    | --               | Configurable `deepflow-agent`'s `http_log_proxy_client` to modify the matching Header                                                               |
| x_request_id              | X-Request-ID       | X-Request-ID       | X-Request-ID     | Configurable `deepflow-agent`'s `http_log_x_request_id` to modify the matching Header                                                               |
| attribute.http_user_agent | --                 | User-Agent         | --               | --                                                                                                                                                  |
| attribute.http_referer    | --                 | Referer            | --               | --                                                                                                                                                  |

- TraceID (`trace_id`) only reads the following parts of the HTTP Header data, all other Header data is read:
  - The `trace ID` in the `sw8`/`sw6` Header
  - The `{trace-id}` in the `uber-trace-id` Header
  - The `trace-id` in the `traceparent` Header
- SpanID (`span_id`) only reads the following parts of the HTTP Header data, all other Header data is read:
  - The `segment ID-span ID` in the `sw8`/`sw6` Header
  - The `{span-id}` in the `uber-trace-id` Header
  - The `parent-id` in the `traceparent` Header

**Metrics Field Mapping Table, The Following Table Only Contains Fields With Mapping Relationships**

| Name               | Chinese            | Request Header | Response Header | Description                                           |
| ------------------ | ------------------ | -------------- | --------------- | ----------------------------------------------------- |
| request            | Request            | --             | --              | Number of Requests                                    |
| response           | Response           | --             | --              | Number of Responses                                   |
| session_length     | Session Length     | --             | --              | Request Length + Response Length                      |
| request_length     | Request Length     | Content-Length | --              | --                                                    |
| request_length     | Response Length    | --             | Content-Length  | --                                                    |
| log_count          | Total Log Volume   | --             | --              | Number of Request Log Lines                           |
| error              | Exception          | --             | --              | Client Errors + Server Errors                         |
| client_error       | Client Errors      | --             | Status Code     | Refer to the explanation of Tag field `response_code` |
| server_error       | Server Errors      | --             | Status Code     | Refer to the explanation of Tag field `response_code` |
| error_ratio        | Exception Ratio    | --             | --              | Exceptions / Responses                                |
| client_error_ratio | Client Error Ratio | --             | --              | Client Errors / Responses                             |
| server_error_ratio | Server Error Ratio | --             | --              | Server Errors / Responses                             |

### HTTP2

TODO

## RPC Protocol Family

### Dubbo

By parsing the [Dubbo](https://dubbo.apache.org/en/docs3-v2/java-sdk/reference-manual/protocol/overview/) protocol, the fields of Dubbo Request / Response can be mapped to the corresponding fields in `l7_flow_log`, as shown in the following table:

**Tag Field Mapping Table, The Following Table Only Contains Fields With Mapping Relationships**

| Name                  | Chinese            | Request                            | Response | Description                                                                                                                                                                         |
| --------------------- | ------------------ | ---------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| version               | Protocol Version   | Version                            | --       | --                                                                                                                                                                                  |
| request_type          | Request Type       | Method name                        | --       | --                                                                                                                                                                                  |
| request_resource      | Request Resource   | Service name                       | --       | --                                                                                                                                                                                  |
| request_id            | Request ID         | Request ID                         | --       | --                                                                                                                                                                                  |
| response_status       | Response Status    | --                                 | Status   | Normal: Status=20; Client Errors: Status=30/40/90; Server Errors: Status=31/50/60/70/80/100                                                                                         |
| response_code         | Response Code      | --                                 | Status   | --                                                                                                                                                                                  |
| response_exception    | Response Exception | --                                 | Status   | Status's official English description[Refer to the detailed explanation of Dubbo protocol](https://dubbo.apache.org/zh/blog/2018/10/05/dubbo-%E5%8D%8F%E8%AE%AE%E8%AF%A6%E8%A7%A3/) |
| endpoint              | Endpoint           | Service name/Method name           | --       | --                                                                                                                                                                                  |
| trace_id              | TraceID            | Attachments field traceparent, sw8 | --       | Configurable `deepflow-agent`'s `http_log_trace_id` to modify the matching Attachments field, detailed description given in HTTP protocol description                               |
| span_id               | SpanID             | Attachments field traceparent, sw8 | --       | Configurable `deepflow-agent`'s `http_log_trace_id` to modify the matching Attachments field, detailed description given in HTTP protocol description                               |
| attribute.rpc_service | --                 | Service name                       | --       | --                                                                                                                                                                                  |

**Metrics Field Mapping Table, this table only contains fields with mapping relationships**

| Name               | Chinese            | Request     | Response    | Description                           |
| ------------------ | ------------------ | ----------- | ----------- | ------------------------------------- |
| request            | request            | --          | --          | Number of Requests                    |
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

**Metrics Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request | Response    | Description                                           |
| ------------------ | ------------------ | ------- | ----------- | ----------------------------------------------------- |
| request            | request            | --      | --          | Number of requests                                    |
| response           | response           | --      | --          | Number of responses                                   |
| session_length     | session length     | --      | --          | --                                                    |
| request_length     | request length     | --      | --          | --                                                    |
| request_length     | response length    | --      | --          | --                                                    |
| log_count          | log volume         | --      | --          | --                                                    |
| error              | error              | --      | --          | Client errors + Server errors                         |
| client_error       | client error       | --      | Status Code | Refer to the explanation of Tag field `response_code` |
| server_error       | server error       | --      | Status Code | Refer to the explanation of Tag field `response_code` |
| error_ratio        | error ratio        | --      | --          | Errors / Responses                                    |
| client_error_ratio | client error ratio | --      | --          | Client errors / Responses                             |
| server_error_ratio | server error ratio | --      | --          | Server errors / Responses                             |

## SQL Protocol Group

### MySQL

By parsing the [MySQL](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_basics.html) protocol, the fields of MySQL Request / Response are mapped to the corresponding fields in l6_flow_log, the mapping relationship is as follows:

**Tag Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request      | Response                       | Description                                                                                                                                                                                                         |
| ------------------ | ------------------ | ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| request_type       | request type       | Command      | --                             | Currently supports parsing COM_QUERY, COM_QUIT, COM_INIT_DB, COM_FIELD_LIST, COM_STMT_PREPARE, COM_STMT_EXECUTE, COM_STMT_FETCH, COM_STMT_CLOSE                                                                     |
| request_resource   | request resource   | Statement    | --                             | --                                                                                                                                                                                                                  |
| request_id         | request ID         | Statement ID | Statement ID                   | Currently extracts from the response corresponding to COM_STMT_PREPARE and the request of the type COM_STMT_EXECUTE                                                                                                 |
| response_status    | response status    | --           | ERROR CODE of `ERR` message    | Normal: No `ERR` message; Client error: ERROR CODE=1999-2999 or client-sent 1-999; Server error: ERROR CODE=1000-1999/3000-4000 or server-sent 1-999                                                                |
| response_code      | response code      | --           | ERROR CODE of `ERR` message    | --                                                                                                                                                                                                                  |
| response_exception | response exception | --           | ERROR Message of `ERR` message | --                                                                                                                                                                                                                  |
| trace_id           | TraceID            | trace_id     | -                              | You can inject TraceID in SQL comments, for example `/* your_trace_key： ffffffff */ SELECT col FROM tbl`, and add your_trace_key in the http_log_trace_id configuration to extract the trace_id of the current SQL |

**Metrics Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request | Response                      | Description                                           |
| ------------------ | ------------------ | ------- | ----------------------------- | ----------------------------------------------------- |
| request            | request            | --      | --                            | Number of requests                                    |
| response           | response           | --      | --                            | Number of responses                                   |
| sql_affected_rows  | SQL affected rows  | --      | Affected Rows of `OK` Message | --                                                    |
| log_count          | log volume         | --      | --                            | --                                                    |
| error              | error              | --      | --                            | Client errors + Server errors                         |
| client_error       | client error       | --      | ERROR CODE                    | Refer to the explanation of Tag field `response_code` |
| server_error       | server error       | --      | ERROR CODE                    | Refer to the explanation of Tag field `response_code` |
| error_ratio        | error ratio        | --      | --                            | Errors/Responses                                      |
| client_error_ratio | client error ratio | --      | --                            | Client errors / Responses                             |
| server_error_ratio | server error ratio | --      | --                            | Server errors / Responses                             |

### PostgreSQL

By parsing the [PostgreSQL](https://www.postgresql.org/docs/14/protocol-message-formats.html) protocol, the fields of PostgreSQL Request / Response are mapped to the corresponding fields in l7_flow_log, the mapping relationship is as follows:

**Tag Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request                         | Response                         | Description                                                                                                                                                                                                          |
| ------------------ | ------------------ | ------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| request_type       | request type       | `char tag` of `regular` message | --                               | --                                                                                                                                                                                                                   |
| request_resource   | request resource   | `payload` of `regular` message  | --                               | --                                                                                                                                                                                                                   |
| response_status    | response status    | --                              | Error Code                       | Normal: No `error return` type of message; Client error: Error Code=02/0A/0B/0F/0L/0P/20/22/23/26/2F/34/3D/3F/42; Server error: Error Code=08/09/0Z/21/24/25/27/28/2B/2D/38/39/3B/40/44/53/54/55/57/5/72/F0/HV/P0/XX |
| response_exception | response exception | --                              | Error Code                       | Official English Description of Error Code (https://www.postgresql.org/docs/9/errcodes-appendix.html)                                                                                                                |
| response_result    | response result    | --                              | `code` of `error return` message | --                                                                                                                                                                                                                   |

**Metrics Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request | Response                                    | Description                                           |
| ------------------ | ------------------ | ------- | ------------------------------------------- | ----------------------------------------------------- |
| request            | request            | --      | --                                          | Number of requests                                    |
| response           | response           | --      |                                             | Number of responses                                   |
| sql_affected_rows  | SQL affected rows  | --      | Affected Rows of `command complete` message | --                                                    |
| log_count          | log volume         | --      | --                                          | --                                                    |
| error              | error              | --      | --                                          | Client errors + Server errors                         |
| client_error       | client error       | --      | Error Code                                  | Refer to the explanation of Tag field `response_code` |
| server_error       | server error       | --      | Error Code                                  | Refer to the explanation of Tag field `response_code` |
| error_ratio        | error ratio        | --      | --                                          | Errors / Responses                                    |
| client_error_ratio | client error ratio | --      | --                                          | Client errors / Responses                             |
| server_error_ratio | server error ratio | --      | --                                          | Server errors / Responses                             |

## NoSQL Protocol Group

### Redis

By parsing the [Redis](https://redis.io/docs/reference/protocol-spec/) protocol, the fields of Redis Request / Response are mapped to the corresponding fields in l6_flow_log, the mapping relationship is as follows:

**Tag Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request                                        | Response                 | Description                                                                   |
| ------------------ | ------------------ | ---------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| request_type       | request type       | First word of the payload                      | --                       | --                                                                            |
| request_resource   | request resource   | String following the first word of the payload | --                       | --                                                                            |
| response_status    | response status    | --                                             | `ERR` message            | Normal: No `ERR` message; Client error: None; Server error: All `ERR` message |
| response_exception | response exception | --                                             | Payload of `ERR` message | --                                                                            |

**Metrics Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request | Response                                    | Description                                           |
| ------------------ | ------------------ | ------- | ------------------------------------------- | ----------------------------------------------------- |
| request            | request            | --      | --                                          | Number of requests                                    |
| response           | response           | --      |                                             | Number of responses                                   |
| sql_affected_rows  | SQL affected rows  | --      | Affected Rows of `command complete` message | --                                                    |
| log_count          | log volume         | --      | --                                          | --                                                    |
| error              | error              | --      | --                                          | Client errors + Server errors                         |
| client_error       | client error       | --      | --                                          | --                                                    |
| server_error       | server error       | --      | `ERR` message                               | Refer to the explanation of Tag field `response_code` |
| error_ratio        | error ratio        | --      | --                                          | Errors / Responses                                    |
| client_error_ratio | client error ratio | --      | --                                          | Client errors / Responses                             |
| server_error_ratio | server error ratio | --      | --                                          | Server errors / Responses                             |

### MongoDB

By parsing the [MongoDB](https://www.mongodb.com/docs/manual/reference/mongodb-wire-protocol/) protocol, the fields of MongoDB Request / Response are mapped to the corresponding fields in l6_flow_log, the mapping relationship is as follows:

**Tag Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request                                        | Response                 | Description                                                                   |
| ------------------ | ------------------ | ---------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| request_type       | request type       | First word of the payload                      | --                       | OpCode field in Mongo message                                                 |
| request_resource   | request resource   | String following the first word of the payload | --                       | BodyDocument field in Mongo message's Section                                 |
| response_code      | response exception | --                                             | Payload of `ERR` message | Code field in Mongo message's Section's BodyDocument                          |
| response_status    | response status    | --                                             | Payload of `ERR` message | Normal: No `ERR` message; Client error: All `ERR` message; Server error: None |
| response_exception | response exception | --                                             | Payload of `ERR` message | Errmsg field in Mongo message’s Section's BodyDocument                        |

**Metrics Field Mapping Table, the following table only includes fields with mapping relationship**

| Name               | Chinese            | Request | Response  | Description                                                      |
| ------------------ | ------------------ | ------- | --------- | ---------------------------------------------------------------- |
| request            | request            | --      | --        | Number of Requests                                               |
| response           | response           | --      | --        | Number of Responses                                              |
| error              | error              | --      | --        | Client Errors + Server Errors                                    |
| client_error       | client error       | --      | --        | --                                                               |
| server_error       | server error       | --      | `ERR`text | Refer to the description of the `response_code` in the Tag field |
| error_ratio        | error ratio        | --      | --        | Errors / Responses                                               |
| client_error_ratio | client error ratio | --      | --        | Client Errors / Responses                                        |
| server_error_ratio | server error ratio | --      | --        | Server Errors / Responses                                        |

## Message Queue Protocols Family

### Kafka

By parsing the [Kafka](https://kafka.apache.org/protocol.html#protocol_messages) protocol, the fields of Kafka Request / Response are mapped to the corresponding fields in l6_flow_log, the mapping relationship is as follows:

**Tag Field Mapping Table, the following table only includes fields with mapping relationship**

| Name               | Chinese            | Request            | Response   | Description                                                                                                           |
| ------------------ | ------------------ | ------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| request_type       | request type       | request_api_key    | --         | --                                                                                                                    |
| request_id         | request ID         | correlation_id     | --         | --                                                                                                                    |
| request_resource   | request resource   | topic_name         | --         | Only supports Fetch and Produce types                                                                                 |
| response_status    | response status    | --                 | error_code | Normal: error_code=-1; Client error: none; Server error: error_code!=0                                                |
| response_code      | response code      | --                 | error_code | Currently only parse the response code of Fetch command type                                                          |
| response_exception | response exception | --                 | error_code | The [official English description](http://kafka.apache.org/protocol#protocol_error_codes) corresponding to error_code |
| trace_id           | TraceID            | sw7 or traceparent | --         | Extract the Header of the first Record                                                                                |

**Metrics Field Mapping Table, the following table only includes fields with mapping relationship**

| Name               | Chinese            | Request      | Response     | Description                                                        |
| ------------------ | ------------------ | ------------ | ------------ | ------------------------------------------------------------------ |
| request            | request            | --           | --           | Number of Requests                                                 |
| response           | response           | --           | --           | Number of Responses                                                |
| session_length     | session length     | --           | --           | Request Length + Response Length                                   |
| request_length     | request length     | message_size | --           | --                                                                 |
| request_length     | response length    | --           | message_size | --                                                                 |
| log_count          | total log amount   | --           | --           | --                                                                 |
| error              | error              | --           | --           | Client Errors + Server Errors                                      |
| client_error       | client error       | --           | error_code   | Refer to the description of the `response status` in the Tag field |
| server_error       | server error       | --           | error_code   | Refer to the description of the `response_code` in the Tag field   |
| error_ratio        | error ratio        | --           | --           | Errors / Responses                                                 |
| client_error_ratio | client error ratio | --           | --           | Client Errors / Responses                                          |
| server_error_ratio | server error ratio | --           | --           | Server Errors / Responses                                          |

### MQTT

By parsing the [MQTT](http://docs.oasis-open.org/mqtt/mqtt/v2.1.1/os/mqtt-v3.1.1-os.html) protocol, the fields of MQTT Request / Response are mapped to the corresponding fields in l7_flow_log, the mapping relationship is as follows:

**Tag Field Mapping Table, the following table only includes fields with mapping relationship**

| Name             | Chinese          | Request    | Response                            | Description                                                             |
| ---------------- | ---------------- | ---------- | ----------------------------------- | ----------------------------------------------------------------------- |
| request_type     | request type     | PacketKind | --                                  | --                                                                      |
| request_domain   | request domain   | client_id  | --                                  | --                                                                      |
| request_resource | request resource | topic      | --                                  | --                                                                      |
| response_status  | response status  | --         | code returned by `connect_ack` text | Normal: code=-1; Client error: code=1/2/4/5; Server error: error_code=3 |
| response_code    | response code    | --         | code returned by `connect_ack` text | --                                                                      |

**Metrics Field Mapping Table, the following table only includes fields with mapping relationship**

| Name               | Chinese            | Request | Response                            | Description                                                        |
| ------------------ | ------------------ | ------- | ----------------------------------- | ------------------------------------------------------------------ |
| request            | request            | --      | --                                  | Number of Requests                                                 |
| response           | response           | --      | --                                  | Number of Responses                                                |
| log_count          | total log amount   | --      | --                                  | --                                                                 |
| error              | error              | --      | --                                  | Client Errors + Server Errors                                      |
| client_error       | client error       | --      | code returned by `connect_ack` text | Refer to the description of the `response status` in the Tag field |
| server_error       | server error       | --      | code returned by `connect_ack` text | Refer to the description of the `response_code` in the Tag field   |
| error_ratio        | error ratio        | --      | --                                  | Errors / Responses                                                 |
| client_error_ratio | client error ratio | --      | --                                  | Client Errors / Responses                                          |
| server_error_ratio | server error ratio | --      | --                                  | Server Errors / Responses                                          |

## Network Protocol Family

### DNS

By parsing the [DNS](https://www.ietf.org/rfc/rfc1034.txt) protocol, the fields of DNS Request / Response are mapped to the corresponding fields in l7_flow_log, the mapping relationship is as follows:

**Tag Field Mapping Table, the following table only includes fields with mapping relationship**

| Name               | Chinese            | Request | Response | Description                                                                                                                                  |
| ------------------ | ------------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| request_type       | request type       | QTYPE   | --       | --                                                                                                                                           |
| request_resource   | request resource   | QNAME   | --       | --                                                                                                                                           |
| request_id         | request ID         | ID      | ID       | --                                                                                                                                           |
| response_status    | response status    | --      | RCODE    | Normal: RCODE=0xffffffff; Client error: RCODE=0x1/0x3; Server error: RCODE!=0x0/0x1/0x3                                                      |
| response_code      | response code      | --      | RCODE    | --                                                                                                                                           |
| response_exception | response exception | --      | RCODE    | The official English description corresponding to RCODE, refer to [RFC 2928 Section 2.3](https://www.rfc-editor.org/rfc/rfc2929#section-2.3) |
| response_result    | response result    | --      | RDATA    | --                                                                                                                                           |

**Metrics Field Mapping Table, the table below only includes fields with mapping relationships**

| Name     | Chinese  | Request | Response | Description         |
| -------- | -------- | ------- | -------- | ------------------- |
| request  | Request  | --      | --       | Number of requests  |
| response | Response | --      | --       | Number of responses |

| log_count | Total logs | -- | -- | Number of Request Log lines |
| error | Exception | -- | -- | Client + server exceptions |
| client_error | Client error | -- | RCODE | Refer to `response_code` in Tag fields for explanation |
| server_error | Server error | -- | RCODE | Refer to `response_code` in Tag fields for explanation |
| error_ratio | Error ratio | -- | -- | Exceptions / responses |
| client_error_ratio | Client error ratio | -- | -- | Client exceptions / responses |
| server_error_ratio | Server error ratio | -- | -- | Server exceptions / responses |

## OpenTelemetry Data Integration

By parsing the OpenTelemetry protocol, the fields in the data structure of the OpenTelemetry protocol are mapped to the corresponding fields in l6_flow_log, as shown in the table below:

**Tag Field Mapping Table, the table below only includes fields with mapping relationships**

| Name                | Chinese                   | OpenTelemetry Data Structure                                                                                                                                                                                                            | Description                                                         |
| ------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| start_time          | Start time                | span.start_time_unix_nano                                                                                                                                                                                                               | --                                                                  |
| end_time            | End time                  | span.end_time_unix_nano                                                                                                                                                                                                                 | --                                                                  |
| protocol            | Network protocol          | span.attribute.net.transport                                                                                                                                                                                                            | Mapped to corresponding enumeration value                           |
| attributes          | Attributes                | resource./span.attributes                                                                                                                                                                                                               | --                                                                  |
| ip                  | IP address                | span.attribute.app.host.ip/attribute.net.peer.ip                                                                                                                                                                                        | Detailed explanation in the following paragraphs                    |
| l6_protocol         | Application protocol      | span.attribute.http.scheme/db.system/rpc.system/messaging.system/messaging.protocol                                                                                                                                                     | Mapped to corresponding enumeration value                           |
| l6_protocol_str     | Application protocol      | span.attribute.http.scheme/db.system/rpc.system/messaging.system/messaging.protocol                                                                                                                                                     | --                                                                  |
| version             | Protocol version          | span.attribute.http.flavor                                                                                                                                                                                                              | --                                                                  |
| type                | Log type                  | Session                                                                                                                                                                                                                                 | --                                                                  |
| request_type        | Request type              | span.attribute.http.method/db.operation/rpc.method                                                                                                                                                                                      | --                                                                  |
| request_domain      | Request domain            | span.attribute.http.host/db.connection_string                                                                                                                                                                                           | --                                                                  |
| request_resource    | Request resource          | attribute.http.target/db.statement/messaging.url/rpc.service                                                                                                                                                                            | --                                                                  |
| request_id          | Request ID                |
| response_status     | Response status           | Response code=span.attribute.http.status_code refer to HTTP protocol definition; Response code=span.status.code, Unknown: STATUS_CODE_UNSET; Normal: STATUS_CODE_OK; Server error: STATUS_CODE_ERROR                                    | --                                                                  |
| response_code       | Response code             | span.attribute.http.status_code/span.status.code                                                                                                                                                                                        | span.attribute.http.status_code is used first                       |
| response_exception  | Response exception        | Response code=span.attribute.http.status_code refer to HTTP protocol definition; if response code=span.status.code, it corresponds to `span.status.message`                                                                             | --                                                                  |
| service_name        | Service name              | resource./span.attribute.service.name                                                                                                                                                                                                   | --                                                                  |
| service_instance_id | Service instance          | resource./span.attribute.service.instance.id                                                                                                                                                                                            | --                                                                  |
| endpoint            | Endpoint                  | span.name                                                                                                                                                                                                                               | --                                                                  |
| trace_id            | TraceID                   | span.trace_id/attribute.sw7.trace_id                                                                                                                                                                                                    | attribute.sw8.trace_id is used first                                |
| span_id             | SpanID                    | span.span_id/attribute.sw7.segment_id-attribute.sw8.span_id                                                                                                                                                                             | attribute.sw8.segment_id-attribute.sw8.span_id is used first        |
| parent_span_id      | ParentSpanID              | span.parent_span_id/attribute.sw7.segment_id-attribute.sw8.parent_span_id                                                                                                                                                               | attribute.sw8.segment_id-attribute.sw8.parent_span_id is used first |
| span_kind           | Span type                 | span.span_kind                                                                                                                                                                                                                          | --                                                                  |
| tap_side            | Path statistical position | span.spankind.SPAN_KIND_CLIENT/SPAN_KIND_PRODUCER：Client application (c-app); span.spankind.SPAN_KIND_SERVER/SPAN_KIND_CONSUMER: Server application (s-app); span.spankind.SPAN_KIND_UNSPECIFIED/SPAN_KIND_INTERNAL：Application (app) | --                                                                  |

- tap_side = c-app
  - span.attribute.app.host.ip corresponds to ip\_-1 ; all the rest correspond to ip_1
    - Obtain the IP address of the previous level (the source of the Span) of the current application (otel-agent) through a [k7s attributes processor plug-in](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/k8sattributesprocessor#section-readme). For example: If the Span is generated by a POD, the POD's IP is obtained; if the Span is generated by a process deployed on a virtual machine, the IP of the virtual machine is obtained.
  - span.attribute.net.peer.ip corresponds to ip_0; all the rest correspond to ip_0

**Metrics Field Mapping Table, the table below only includes fields with mapping relationships**

| Name                                            | Chinese            | OpenTelemetry Data Structure                                   | Description                                            |
| ----------------------------------------------- | ------------------ | -------------------------------------------------------------- | ------------------------------------------------------ |
| request                                         | Request            | Number of Spans                                                | --                                                     |
| response                                        | Response           | Number of Spans                                                | --                                                     |
| session_length                                  | Session length     |                                                                | Request length + Response length                       |
| request_length                                  | Request length     | span.attribute.http.request_content_length                     | --                                                     |
| request_length                                  | Response length    | span.attribute.http.response_content_length                    | --                                                     |
| sql_affected_rows                               | SQL affected rows  | span.attribute.db.cassandra.page_size                          | --                                                     |
| log_count                                       | Total logs         | Number of Spans                                                | Number of Request Log lines                            |
| error                                           | Exception          | --                                                             | Client + server exceptions                             |
| client_error                                    | Client error       | span.attribute.http.status_code/span.status.code               | Refer to `response_code` in Tag fields for explanation |
| server_error                                    | Server error       | span.attribute.http.status_code/span.status.code               | Refer to `response_code` in Tag fields for explanation |
| error_ratio                                     | Error ratio        | --                                                             | Exceptions / responses                                 |
| client_error_ratio                              | Client error ratio | --                                                             | Client exceptions / responses                          |
| server_error_ratio                              | Server error ratio | --                                                             | Server exceptions / responses                          |
| message.uncompressed_size                       | --                 | span.attribute.message.uncompressed_size                       | --                                                     |
| messaging.message_payload_size_bytes            | --                 | span.attribute.messaging.message_payload_size_bytes            | --                                                     |
| messaging.message_payload_compressed_size_bytes | --                 | span.attribute.messaging.message_payload_compressed_size_bytes | --                                                     |

