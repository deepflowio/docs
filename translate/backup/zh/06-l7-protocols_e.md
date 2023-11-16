**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response  | 描述                               |
| ------------------ | -------------- | ------- | --------- | ---------------------------------- |
| request            | 请求           | --      | --        | Request 个数                       |
| response           | 响应           | --      |           | Response 个数                      |
| error              | 异常           | --      | --        | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | --        | --                                 |
| server_error       | 服务端异常     | --      | `ERR`报文 | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --        | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --        | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --        | 服务端异常 / 响应                  |

## 消息队列协议簇

### Kafka

通过解析 [Kafka](https://kafka.apache.org/protocol.html#protocol_messages) 协议，将 Kafka Request / Response 的字段映射到 l6_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文     | Request            | Response   | 描述                                                                                   |
| ------------------ | -------- | ------------------ | ---------- | -------------------------------------------------------------------------------------- |
| request_type       | 请求类型 | request_api_key    | --         | --                                                                                     |
| request_id         | 请求 ID  | correlation_id     | --         | --                                                                                     |
| request_resource   | 请求资源 | topic_name         | --         | 仅支持 Fetch 和 Produce 类型                                                           |
| response_status    | 响应状态 | --                 | error_code | 正常: error_code=-1; 客户端异常: 无; 服务端异常: error_code!=0                         |
| response_code      | 响应码   | --                 | error_code | 目前仅解析 Fetch 一个命令类型的响应码                                                  |
| response_exception | 响应异常 | --                 | error_code | error_code 对应的[官方英文描述](http://kafka.apache.org/protocol#protocol_error_codes) |
| trace_id           | TraceID  | sw7 或 traceparent | --         | 提取首个 Record 对应的 Header                                                          |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request      | Response     | 描述                               |
| ------------------ | -------------- | ------------ | ------------ | ---------------------------------- |
| request            | 请求           | --           | --           | Request 个数                       |
| response           | 响应           | --           |              | Response 个数                      |
| session_length     | 会话长度       | --           | --           | 请求长度 + 响应长度                |
| request_length     | 请求长度       | message_size | --           | --                                 |
| request_length     | 响应长度       | --           | message_size | --                                 |
| log_count          | 日志总量       | --           | --           | --                                 |
| error              | 异常           | --           | --           | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --           | error_code   | 参考 Tag 字段`响应状态`的说明      |
| server_error       | 服务端异常     | --           | error_code   | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --           | --           | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --           | --           | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --           | --           | 服务端异常 / 响应                  |

### MQTT

通过解析 [MQTT](http://docs.oasis-open.org/mqtt/mqtt/v2.1.1/os/mqtt-v3.1.1-os.html) 协议，将 MQTT Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称             | 中文     | Request    | Response                      | 描述                                                              |
| ---------------- | -------- | ---------- | ----------------------------- | ----------------------------------------------------------------- |
| request_type     | 请求类型 | PacketKind | --                            | --                                                                |
| request_domain   | 请求域名 | client_id  | --                            | --                                                                |
| request_resource | 请求资源 | topic      | --                            | --                                                                |
| response_status  | 响应状态 | --         | `connect_ack` 报文返回的 code | 正常: code=-1; 客户端异常: code=1/2/4/5; 服务端异常: error_code=3 |
| response_code    | 响应码   | --         | `connect_ack` 报文返回的 code | --                                                                |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response                      | 描述                               |
| ------------------ | -------------- | ------- | ----------------------------- | ---------------------------------- |
| request            | 请求           | --      | --                            | Request 个数                       |
| response           | 响应           | --      |                               | Response 个数                      |
| log_count          | 日志总量       | --      | --                            | --                                 |
| error              | 异常           | --      | --                            | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | `connect_ack` 报文返回的 code | 参考 Tag 字段`响应状态`的说明      |
| server_error       | 服务端异常     | --      | `connect_ack` 报文返回的 code | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --                            | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --                            | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --                            | 服务端异常 / 响应                  |

## 网络协议簇

### DNS

通过解析 [DNS](https://www.ietf.org/rfc/rfc1034.txt) 协议，将 DNS Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文     | Request | Response | 描述                                                                                                      |
| ------------------ | -------- | ------- | -------- | --------------------------------------------------------------------------------------------------------- |
| request_type       | 请求类型 | QTYPE   | --       | --                                                                                                        |
| request_resource   | 请求资源 | QNAME   | --       | --                                                                                                        |
| request_id         | 请求 ID  | ID      | ID       | --                                                                                                        |
| response_status    | 响应状态 | --      | RCODE    | 正常: RCODE=0xffffffff; 客户端异常: RCODE=0x1/0x3; 服务端异常: RCODE!=0x0/0x1/0x3                         |
| response_code      | 响应码   | --      | RCODE    | --                                                                                                        |
| response_exception | 响应异常 | --      | RCODE    | RCODE 对应的官方英文描述，[参考 RFC 2928 Section 2.3](https://www.rfc-editor.org/rfc/rfc2929#section-2.3) |
| response_result    | 响应结果 | --      | RDATA    | --                                                                                                        |
