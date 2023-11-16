**Metrics Field Mapping Table, the following table only includes fields with mapping relationship**

| Name               | Chinese            | Request | Response  | Description                                                      |
| ------------------ | ------------------ | ------- | --------- | ---------------------------------------------------------------- |
| request            | request            | --      | --        | Number of Requests                                               |
> This document was translated by GPT-4

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
