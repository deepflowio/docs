---
title: Network
permalink: /features/l7-protocols/network
---

# DNS

通过解析 [DNS](https://www.ietf.org/rfc/rfc1035.txt) 协议，将 DNS Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表：

**Tag 字段映射表格，以下表格只包含存在映射关系的字段**

| 类别  | 名称               | 中文         | Request Header | Response Header | 描述                                                                                          |
| ----- | ------------------ | ------------ | -------------- | --------------- | --------------------------------------------------------------------------------------------- |
| Req.  | version            | 协议版本     | --             | --              | --                                                                                            |
|       | request_type       | 请求类型     | QTYPE          | --              | --                                                                                            |
|       | request_domain     | 请求域名     | QNAME          | --              | 仅在查询 IPv4 或 IPv6 地址时有值                                                              |
|       | request_resource   | 请求资源     | QNAME          | --              | --                                                                                            |
|       | request_id         | 请求 ID      | ID             | ID              | --                                                                                            |
|       | endpoint           | 端点         | QNAME          | --              | --                                                                                            |
| Resp. | response_code      | 响应码       | --             | RCODE           | --                                                                                            |
|       | response_status    | 响应状态     | --             | RCODE           | 正常: RCODE=0x0; 客户端异常: RCODE=0x1/0x3; 服务端异常: 其他                                  |
|       | response_exception | 响应异常     | --             | RCODE           | RCODE 的描述，参考 [RFC 2929 Section 2.3](https://www.rfc-editor.org/rfc/rfc2929#section-2.3) |
|       | response_result    | 响应结果     | --             | RDATA           | --                                                                                            |
| Trace | trace_id           | TraceID      | --             | --              | --                                                                                            |
|       | span_id            | SpanID       | --             | --              | --                                                                                            |
|       | x_request_id       | X-Request-ID | --             | --              | --                                                                                            |
| Misc. | --                 | --           | --             | --              | --                                                                                            |

**Metrics 字段映射表格，以下表格只包含存在映射关系的字段**

| 名称               | 中文           | Request | Response | 描述                               |
| ------------------ | -------------- | ------- | -------- | ---------------------------------- |
| request            | 请求           | --      | --       | Request 个数                       |
| response           | 响应           | --      | --       | Response 个数                      |
| log_count          | 日志总量       | --      | --       | Request Log 行数                   |
| error              | 异常           | --      | --       | 客户端异常 + 服务端异常            |
| client_error       | 客户端异常     | --      | RCODE    | 参考 Tag 字段`response_code`的说明 |
| server_error       | 服务端异常     | --      | RCODE    | 参考 Tag 字段`response_code`的说明 |
| error_ratio        | 异常比例       | --      | --       | 异常 / 响应                        |
| client_error_ratio | 客户端异常比例 | --      | --       | 客户端异常 / 响应                  |
| server_error_ratio | 服务端异常比例 | --      | --       | 服务端异常 / 响应                  |
