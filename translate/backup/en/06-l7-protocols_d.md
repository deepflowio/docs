**Metrics Field Mapping Table, the following table only contains fields with existing mapping relationships**

| Name               | in Chinese         | Request | Response    | Description                                           |
| ------------------ | ------------------ | ------- | ----------- | ----------------------------------------------------- |
| request            | request            | --      | --          | Number of requests                                    |
> This document was translated by GPT-4

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
