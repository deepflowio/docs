# l7_flow_log 字段说明

l7_flow_log 数据库表存储按分钟粒度聚合的各种协议的请求日志，由 Tag 和 Metrics 两大类字段组成：
- Tag 字段：字段主要用于分组，过滤
- Metrics 字段：字段主要用于计算

## Tag 字段说明

| 名称（en）                                        |   类型       |        枚举值           |         分类        | 描述 |
| ------------------------------------------------ | ------------ | ---------------------- | ------------------- | ---- |
| UID（_id）                                       | id           | --                      | Flow Info           | 日志 ID |
| 时间（time）                                      | time        |                         |  Flow Info          | 日志时间戳，将 end_time 取整到秒 |
| 流日志 ID（flow_id）                              | int         |                         |  Flow Info          | -- |
| 开始时间（start_time）                            | int         |                         |  Flow Info          | 单位: 微秒。表示当前请求开始的时间 |
| 结束时间（end_time）                              | int         |                         |  Flow Info          | 单位: 微秒。表示当前响应开始的时间，但对 OTel 是响应结束时间 |
| 区域（region）                                    | resource    |                         |  Universal Tag      | -- |
| 可用区（az）                                      | resource    |                         |  Universal Tag      | -- |
| 宿主机（host）                                    | resource    |                         |  Universal Tag      | -- |
| 云服务器（chost）                                 | resource    |                         |  Universal Tag      | -- |
| VPC（vpc）                                        | resource    |                         |  Universal Tag      | -- |
| 转发 VPC（l2_vpc）                                | resource    |                         |  Universal Tag      | -- |
| 子网（subnet）                                    | resource    |                         |  Universal Tag      | -- |
| 路由器（router）                                  | resource    |                         |  Universal Tag      | -- |
| DHCP 网关（dhcpgw）                               | resource    |                         |  Universal Tag      | -- |
| 负载均衡器（lb）                                  | resource    |                         |  Universal Tag      | -- |
| 负载均衡监听器（lb_listener）                     | resource    |                         |  Universal Tag      | -- |
| NAT 网关（natgw）                                 | resource    |                         |  Universal Tag      | -- |
| Redis（redis）                                    | resource    |                         |  Universal Tag      | -- |
| RDS（rds）                                        | resource    |                         |  Universal Tag      | -- |
| K8s 容器集群（pod_cluster）                       | resource    |                         |  Universal Tag      | -- |
| K8s 命名空间（pod_ns）                            | resource    |                         |  Universal Tag      | -- |
| K8s 容器节点（pod_node）                          | resource    |                         |  Universal Tag      | -- |
| K8s Ingress（pod_ingress）                        | resource    |                         |  Universal Tag      | -- |
| K8s 容器服务（pod_service）                       | resource    |                         |  Universal Tag      | -- |
| K8s 工作负载（pod_group）                         | resource    |                         |  Universal Tag      | -- |
| K8s 容器 POD（pod）                               | resource    |                         |  Universal Tag      | -- |
| 服务（service）                                   | resource    |                         |  Universal Tag      | 暂时禁用 |
| 类型-容器 POD 优先（resource_gl0_type）           | int_enum    |  [resource_gl0_type](#resource_gl0_type)    |  Universal Tag      | `资源-容器 POD 优先`资源对应的类型 |
| 资源-容器 POD 优先（resource_gl0）                | resource    |                         |  Universal Tag      | IP 对应的资源 |
| 类型-工作负载优先（resource_gl1_type）            | int_enum    |  [resource_gl1_type](#resource_gl1_type)      |  Universal Tag      | `资源-工作负载优先`资源对应的类型 |
| 资源-工作负载优先（resource_gl1）                 | resource    |                         |  Universal Tag      | 在`资源-容器 POD 优先`基础上，将 POD 聚合为工作负载 |
| 类型-服务优先（resource_gl2_type）                | int_enum    |  [resource_gl2_type](#resource_gl2_type)       |  Universal Tag      | `资源-服务优先`资源对应的类型 |
| 资源-服务优先（resource_gl2）                     | resource    |                         |  Universal Tag      | 在`资源-工作负载优先`基础上，将容器服务 ClusterIP 与工作负载聚合为容器服务 |
| K8s Labels（labels）                              | map         |                         |  K8s Labels         | K8s 自定义 Label |
| Attributes（attributes）                          | map         |                         |  Attributes         | 协议自定义属性信息 |
| IP 地址（ip）                                     | ip          |                         |  Network Layer      | -- |
| IPv4 标志（is_ipv4）                              | int_enum    |  [ip_type](#ip_type)                 |  Network Layer      | -- |
| Internet IP 标志（is_internet）                   | bool        |                         |  Network Layer      | Internet IP 为  AutoTagging  未学习到的 IP |
| 网络协议（protocol）                              | int_enum    |  [l7_ip_protocol](#l7_ip_protocol)          |  Network Layer      | -- |
| 隧道类型（tunnel_type）                           | int_enum    |  [tunnel_type](#tunnel_type)             |  Tunnel Info        | -- |
| 客户端口（client_port）                           | int         |                         |  Transport Layer    | -- |
| 服务端口（server_port）                           | int_enum    |  [server_port](https://github.com/deepflowys/deepflow/blob/16a20c3580d0d9d5296157bdcaf0cf85234cab64/server/querier/db_descriptions/clickhouse/tag/enum/server_port)            |  Transport Layer    | 参考 IANA 端口和服务的定义 |
| 请求 TCP Seq 号（req_tcp_seq）                    | int         |                         |  Transport Layer    | -- |
| 响应 TCP Seq 号（resp_tcp_seq）                   | int         |                         |  Transport Layer    | -- |
| 应用协议（l7_protocol）                           | int_enum    |  [l7_protocol](#l7_protocol)            |  Application Layer  | -- |
| 应用协议（l7_protocol_str）                       | string      |                         |  Application Layer  | -- |
| 协议版本（version）                               | string      |                         |  Application Layer  | -- |
| 日志类型（type）                                  | int_enum    |  [l7_log_type](#l7_log_type)            |  Application Layer  | -- |
| 请求类型（request_type）                          | string      |                         |  Application Layer  | -- |
| 请求域名（request_domain）                        | string      |                         |  Application Layer  | -- |
| 请求资源（request_resource）                      | string      |                         |  Application Layer  | -- |
| 请求 ID（request_id）                             | int         |                         |  Application Layer  | -- |
| 响应状态（response_status）                       | int_enum    |  [response_status](#response_status)        |  Application Layer  | -- |
| 响应码（response_code）                           | int         |                         |  Application Layer  | -- |
| 响应异常（response_exception）                    | string      |                         |  Application Layer  | -- |
| 响应结果（response_result）                       | string      |                         |  Application Layer  | -- |
| 服务名称（service_name）                          | string      |                         |  Service Info       | -- |
| 服务实例（service_instance_id）                   | string      |                         |  Service Info       | -- |
| 端点（endpoint）                                  | string      |                         |  Service Info       | -- |
| 进程 ID（process_id）                             | int         |                         |  Service Info       | -- |
| 内核线程名（process_kname）                       | string      |                         |  Service Info       | -- |
| TraceID（trace_id）                               | string      |                         |  Tracing Info       | -- |
| SpanID（span_id）                                 | string      |                         |  Tracing Info       | -- |
| ParentSpanID（parent_span_id）                    | string      |                         |  Tracing Info       | -- |
| Span 类型（span_kind）                            | int_enum    |  [span_kind](#span_kind)              |  Tracing Info       | -- |
| X-Request-ID（x_request_id）                      | string      |                         |  Tracing Info       | -- |
| HTTP 代理客户端（http_proxy_client）              | string      |                         |  Tracing Info       | -- |
| 请求 Syscall TraceID（syscall_trace_id_request）  | int         |                         |  Tracing Info       | -- |
| 响应 Syscall TraceID（syscall_trace_id_response） | int         |                         |  Tracing Info       | -- |
| 请求 Syscall 线程（syscall_thread_0）             | int         |                         |  Tracing Info       | -- |
| 响应 Syscall 线程（syscall_thread_1）             | int         |                         |  Tracing Info       | -- |
| 请求 Syscall 序号（syscall_cap_seq_0）            | int         |                         |  Tracing Info       | -- |
| 响应 Syscall 序号（syscall_cap_seq_1）            | int         |                         |  Tracing Info       | -- |
| 采集点（tap）                                     | resource    |                         |  Capture Info       | Traffic Access Point，流量采集点，使用固定值（虚拟网络）表示云内流量，其他值表示传统 IDC 流量（支持最多 254 个自定义值表示镜像分光的位置） |
| 采集器（vtap）                                    | resource    |                         |  Capture Info       | -- |
| 采集位置标识（tap_port）                          | mac         |                         |  Capture Info       | 当采集位置类型为本地网卡时，此值表示采集网卡的 MAC 地址后缀（后四字节） |
| 采集位置名称（tap_port_name）                     | string      |                         |  Capture Info       | 当采集位置类型为本地网卡时，此值表示采集网卡的名称 |
| 采集位置类型（tap_port_type）                     | int_enum    |  [tap_port_type](#tap_port_type)          |  Capture Info       | 表示流量采集位置的类型 |
| 路径统计位置（tap_side）                          | string_enum |  [tap_side](#tap_side)               |  Capture Info       | 采集位置在流量路径中所处的逻辑位置 |

### 枚举类型（xxx_enum）值说明

<b id="resource_gl0_type">resource_gl0_type</b> 枚举值说明

| ID      | 值                         | 描述|
| ------- | -------------------------- | -- |
| 0       | Internet IP（Internet IP） | -- |
| 1       | 云服务器（Cloud Host） | -- |
| 5       | 路由器（Router） | -- |
| 6       | 宿主机（VM Hypervisor） | -- |
| 9       | DHCP 网关（DHCP Gateway） | -- |
| 10      | 容器 POD（K8s POD） | -- |
| 11      | 容器服务（K8s Service） | -- |
| 12      | RDS（RDS） | -- |
| 13      | Redis（Redis） | -- |
| 14      | 容器节点（K8s Node） | -- |
| 15      | 负载均衡器（Load Balancer） | -- |
| 16      | NAT 网关（NAT Gateway） | -- |
| 255     | IP（IP） | -- |

<b id="resource_gl1_type">resource_gl1_type</b> 枚举值说明 

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       | Internet IP（Internet IP） | -- |
| 1       | 云服务器（Cloud Host） | -- |
| 5       | 路由器（Router） | -- |
| 6       | 宿主机（VM Hypervisor） | -- |
| 9       | DHCP 网关（DHCP Gateway） | -- |
| 10      | 容器 POD（K8s POD） | -- |
| 11      | 容器服务（K8s Service） | -- |
| 12      | RDS（RDS） | -- |
| 13      | Redis（Redis） | -- |
| 15      | 负载均衡器（Load Balancer） | -- |
| 16      | NAT 网关（NAT Gateway） | -- |
| 101     | 工作负载（K8s Workload）| -- |
| 255     | IP（IP） | -- |
    
<b id="resource_gl2_type">resource_gl2_type</b> 枚举值说明     

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       | Internet IP（Internet IP） | -- |
| 1       | 云服务器（Cloud Host） | -- |
| 5       | 路由器（Router） | -- |
| 6       | 宿主机（VM Hypervisor） | -- |
| 9       | DHCP 网关（DHCP Gateway） | -- |
| 10      | 容器 POD（K8s POD） | -- |
| 11      | 容器服务（K8s Service） | -- |
| 12      | RDS（RDS） | -- |
| 13      | Redis（Redis） | -- |
| 15      | 负载均衡器（Load Balancer） | -- |
| 16      | NAT 网关（NAT Gateway） | -- |
| 101     | 工作负载（K8s Workload）| -- |
| 102     | 服务（Service）| -- |
| 255     | IP（IP） |   -- | 

<b id="ip_type">ip_type</b> 枚举值说明   

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       | IPv6                       | -- |
| 1       | IPv4                       | -- |

<b id="l7_ip_protocol">l7_ip_protocol</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 6       | TCP                        | -- |
| 17      | UDP                        | -- |

<b id="tunnel_type">tunnel_type</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       |  N/A  |  无隧道 |
| 1       |  VXLAN  |  -- |
| 2       |  IPIP  |  -- |
| 3       |  GRE  |  -- |

<b id="l7_protocol">l7_protocol</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       | N/A  | 不解析应用协议的流量，例如非 TCP/UDP、非 DNS 的 UDP、没有 Payload 的 TCP 流量 |
| 1       | Others  | 可解析应用协议的流量，但是目前无法识别 |
| 20      | HTTP  |  -- |
| 21      | HTTP2  |  -- |
| 22      | HTTP1_TLS  |  仅支持通过 eBPF 获取协议数据 |
| 23      | HTTP2_TLS  |  仅支持通过 eBPF 获取协议数据 |
| 40      | Dubbo  |  -- |
| 41      | gRPC  |  -- |
| 60      | MySQL  |  -- |
| 61      | PostgreSQL  |  -- |
| 80      | Redis  |  -- |
| 100     | Kafka  |  -- |
| 101     | MQTT  |  -- |
| 120     | DNS  |  -- |

<b id="l7_log_type">l7_log_type</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       | 请求（Request）   |  -- |
| 1       | 回复（Response）  |  -- |
| 2       | 会话（Session）   |  合并聚合时间范围内的`请求`与`回复`日志 |

<b id="response_status">response_status</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       | 正常（Success）  |  -- |
| 2       | 未知（Unknown）  |  -- |
| 3       | 服务端异常（Server Error）  |  -- |
| 4       | 客户端异常（Client Error）  |  -- |

<b id="span_kind">span_kind</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0 | SPAN_KIND_UNSPECIFIED |  -- |
| 1 | SPAN_KIND_INTERNAL |  -- |
| 2 | SPAN_KIND_SERVER |  -- |
| 3 | SPAN_KIND_CLIENT |  -- |
| 4 | SPAN_KIND_PRODUCER |  -- |
| 5 | SPAN_KIND_CONSUMER |  -- |

<b id="tap_port_type">tap_port_type</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- |
| 0       | 本地网卡（Local NIC） |  -- |
| 1       | 云网关网卡（NFV Gateway NIC） |  -- |
| 2       | ERSPAN（ERSPAN） |  -- |
| 3       | ERSPAN（IPv6）（ERSPAN (IPv6)） |  -- |
| 4       | 分光镜像（Traffic Mirror） |  -- |
| 5       | NetFlow（NetFlow） |  -- |
| 6       | sFlow（sFlow） |  -- |
| 7       | eBPF（eBPF） |  -- |
| 8       | OTel（OTel）|  -- |                  

<b id="tap_side">tap_side</b> 枚举值说明

| ID      | 值                         | 描述 |
| ------- | -------------------------- | -- | 
| c-app   | 客户端应用（Client Application） |  -- |
| c-p     | 客户端进程（Client Process） |  -- |
| c       | 客户端网卡（Client NIC） |  -- |
| c-nd    | 客户端容器节点（Client K8s Node） |  -- |
| c-hv    | 客户端宿主机（Client VM Hypervisor） |  -- |
| c-gw-hv | 客户端到网关宿主机（Client-side Gateway Hypervisor） |  -- |
| c-gw    | 客户端到网关（Client-side Gateway） |  -- |
| local   | 本机网卡（Local NIC） |  -- |
| rest    | 其他网卡（Other NIC） |  -- |
| s-gw    | 网关到服务端（Server-side Gateway） |  -- |
| s-gw-hv | 网关宿主机到服务端（Server-side Gateway Hypervisor） |  -- |
| s-hv    | 服务端宿主机（Server VM Hypervisor） |  -- |
| s-nd    | 服务端容器节点（Server K8s Node） |  -- |
| s       | 服务端网卡（Server NIC） |  -- |
| s-p     | 服务端进程（Server Process） |  -- |
| s-app   | 服务端应用（Server Application） |  -- |
| app     | 应用（Application） |  -- |  
             

## Metrics 字段说明

| 名称（en）                           | 类型        |  单位      |分类         | 描述 |
| ----------------------------------- | ----------- |  -------- | ----------- | ---- |
| 请求（request）                      | counter    | 个          | Throughput  | -- | 
| 响应（response）                     | counter    | 个          | Throughput  | -- |
| 会话长度（session_length）           | counter    | 字节（Byte）| Throughput  | 请求长度 + 响应长度 |
| 请求长度（request_length）           | counter    | 字节（Byte）| Throughput  | -- |
| 响应长度（response_length）          | counter    | 字节（Byte）| Throughput  | -- |
| SQL影响行数（sql_affected_rows）     | counter    | 行（Row）   | Throughput  | -- |
| 日志总量（log_count）                | counter    | 个          | Throughput  | -- |
| 异常（error）                        | counter    | 个          | Error       | 客户端异常 + 服务端异常 |
| 客户端异常（client_error）           | counter    | 个          | Error       | -- |
| 服务端异常（server_error）           | counter    | 个          | Error       | -- |
| 异常比例（error_ratio）              | percentage | %           | Error       | 异常 / 响应 |
| 客户端异常比例（client_error_ratio） | percentage | %           | Error       | 客户端异常 / 响应 |
| 服务端异常比例（server_error_ratio） | percentage | %           | Error       | 服务端异常 / 响应 |
| 响应时延（response_duration）        | delay      | 微秒（us）  | Delay       | 结束时间 - 开始时间 |
| IP类型（ip_version）                 | tag        | 个          | Cardinality | -- |
| 服务端口（server_port）              | tag        | 个          | Cardinality | -- |
| 协议版本（version）                  | tag        | 个          | Cardinality | -- |
| 请求类型（request_type）             | tag        | 个          | Cardinality | -- |
| 请求域名（request_domain）           | tag        | 个          | Cardinality | -- |
| 请求资源（request_resource）         | tag        | 个          | Cardinality | -- |
| 响应码（response_code）              | tag        | 个          | Cardinality | -- |
| 响应结果（response_result）          | tag        | 个          | Cardinality | -- |
| 采集点（tap）                        | tag        | 个          | Cardinality | -- |
| 采集器（vtap）                       | tag        | 个          | Cardinality | -- |

## 协议映射

### HTTP 协议映射

通过解析 HTTP 协议，将 HTTP Request / Response 的字段映射到 l7_flow_log 对应字段中，映射关系如下表

** Tag 字段映射表格，以下表格只包含存在映射关系的字段 **

| 名称（en） | HTTP Request |  HTTP Response |  描述 |
| --------- | ---- | --- |  ---- |
| attribute.http_user_agent            | User-Agent Header                      | -- | -- |
| attribute.http_referer               | Referer Header                         | -- | -- |
| 应用协议（l7_protocol）              | HTTP / HTTP2                           | -- | -- |
| 协议版本（version）                  | Version                                | -- | -- |
| 请求类型（request_type）             | Method                                 | -- | -- |
| 请求域名（request_domain）           | Host Header                            | -- | -- |
| 请求资源（request_resource）         | Path Header                            | -- | -- |
| 请求 ID（request_id）                | Stream ID                              | -- | 仅解析 HTTP2 协议 |
| 响应状态（response_status）          | --                                     | 客户端异常：Status=4xx; 服务端异常：Status=5xx | -- |
| 响应码（response_code）              | --                                     | Status Code | -- |
| 响应异常（response_exception）       |                                        | -- | 响应码对应的官方英文描述[参考维基百科List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)|             
| TraceID（trace_id）                  | 支持自定义配置，默认为 traceparent,sw8 | -- | 对应 deepflow-agent 的 http_log_trace_id 配置，详细说明见后续段落描述 |      
| SpanID（span_id）                    | 支持自定义配置，默认为 traceparent,sw8 | -- | 对应 deepflow-agent 的 http_log_span_id 配置，详细说明见后续段落描述 |             
| HTTP 代理客户端（http_proxy_client） | 支持自定义配置，默认为 X-Forwarded-For | -- | 对应 deepflow-agent 的 http_log_proxy_client 配置 |  
| X-Request-ID（x_request_id）         | 支持自定义配置，默认为 X-Request-ID    | -- | 对应 deepflow-agent 的 http_log_x_request_id 配置 |  

- TraceID（trace_id）只读取以下 HTTP Header 部分数据，其他 Header 读取全部数据：
  - `sw8`/`sw6` Header 中的 `trace ID`
  - `uber-trace-id` Header 中的 `{trace-id}`
  - `traceparent` Header 中的 `trace-id`
- SpanID（span_id）只读取以下 HTTP Header 部分数据，其他 Header 读取全部数据：
  - `sw8`/`sw6` Header 中的`segment ID-span ID`
  - `uber-trace-id` Header 中的 `{parent-span-id}`
  - `traceparent` Header 中的 `parent-id`

** Metrics 字段映射表格 **

| 名称（en）                            | HTTP Request         |  HTTP Response        | 描述 |
| ------------------------------------ | -------------------- | --------------------- | -- |
| 请求（request）                      | Request 个数          | --                    | -- |  
| 响应（response）                     |                       | Response 个数         | -- |  
| 会话长度（session_length）           | --                    | --                    | 请求长度 + 响应长度 | 
| 请求长度（request_length）           | Content-Length Header | --                    | -- |
| 响应长度（request_length）           | --                    | Content-Length Header | -- | 
| SQL影响行数（sql_affected_rows）     | --                    | --                    | -- |
| 日志总量（log_count）                | --                    | --                    | -- |
| 异常（error）                        | --                    | --                    | 客户端异常 + 服务端异常 |
| 客户端异常（client_error）           | --                    | Status = 4xx          | -- |
| 服务端异常（server_error）           | --                    | Status = 5xx          | -- |
| 异常比例（error_ratio）              | --                    | --                    | 异常 / 响应 |
| 客户端异常比例（client_error_ratio） | --                    | Status = 4xx          | 客户端异常 / 响应 |
| 服务端异常比例（server_error_ratio） | --                    | Status = 5xx          | 服务端异常 / 响应 |
| 响应时延（response_duration）        | --                    |                       | 结束时间 - 开始时间 |
| IP类型（ip_version）                 | --                    |                       | -- |
| 服务端口（server_port）              | --                    |                       | -- |
| 协议版本（version）                  | --                    |                       | -- |
| 请求类型（request_type）             | --                    |                       | -- |
| 请求域名（request_domain）           | --                    |                       | -- |
| 请求资源（request_resource）         | --                    |                       | -- |
| 响应码（response_code）              | --                    |                       | -- |
| 响应结果（response_result）          | --                    |                       | -- |
| 采集点（tap）                        | --                    |                       | -- |
| 采集器（vtap）                       | --                    |                       | -- |

### DNS 协议映射

### 