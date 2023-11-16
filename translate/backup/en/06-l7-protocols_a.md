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
