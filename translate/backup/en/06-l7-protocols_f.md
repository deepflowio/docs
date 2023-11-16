**Metrics Field Mapping Table, the table below only includes fields with mapping relationships**

| Name     | Chinese  | Request | Response | Description         |
| -------- | -------- | ------- | -------- | ------------------- |
| request  | Request  | --      | --       | Number of requests  |
> This document was translated by GPT-4

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
