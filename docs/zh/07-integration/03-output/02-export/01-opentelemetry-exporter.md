---
title: OpenTelemetry Exporter
permalink: /integration/output/export/opentelemetry-exporter
---
# 功能

通过转换标准 OTLP 协议后，将 DeepFlow 的 Span 数据输送至外部平台，可供外部团队补充和完善自己的可观测性平台。

# Span 简介

在 DeepFlow 内，关于 Span 可以分类为：
- 应用 Span：使用进程级别的 Trace 框架（Agent/SDK）产生的应用级别的 Span 数据，包括 应用自定义 Span，中间件 Client 埋点 Span，通讯框架等。 这里的 Trace 框架包括但不仅限于：Apache SkyWalking Agent，OpenTelemetry Java Agent 以及其他。
- 系统 Span：DeepFlow 通过 eBPF 零侵入采集的 Span，覆盖系统调用、应用函数（如 HTTPS）、API Gateway、服务网格 Sidecar。
- 网络 Span：DeepFlow 通过 BPF 从网络流量中采集的 Span，覆盖 iptables/ipvs/OvS/LinuxBridge 等容器网络组件。

# OTel 相关

关于 [OTLP Proto](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/trace/v1/trace.proto) 可以在这里找到，其中关于 [Trace 语义约定](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) 在这里可以看到，Trace 内部 [Resource 语义约定](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/resource/semantic_conventions)可以在这里看到。

# 配置相关

```yaml
ingester:
  exporters:
    enabled: true
    export-datas: [cbpf-net-span,ebpf-sys-span]
    export-data-types: [service_info,tracing_info,network_layer,flow_info,transport_layer,application_layer,metrics]
    export-custom-k8s-labels-regexp:
    export-only-with-traceid: false
    otlp-exporters:
    - enabled: true
      addr: 127.0.0.1:4317
      queue-count: 4
      queue-size: 1000000
      export-batch-count: 32
      export-datas: [cbpf-net-span,ebpf-sys-span]
      export-data-types: [service_info,tracing_info,network_layer,flow_info,transport_layer,application_layer,metrics]
      export-custom-k8s-labels-regexp:
      export-only-with-traceid: false
      grpc-headers:
        ${key1}: ${value1}
        ${key2}: ${value2}
```

关于[详细配置](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml#L474)。

# 通用字段对等转换

在 Flow_log 中有套内部逻辑将所有数据按照层级进行分类，在这里的对等转换即为 将分层的 [Flow_Log](../../../features/universal-map/request-log/) 通用字段转换到标准的 OTel 格式数据。

### Tracing Info

隶属 OTel 的 Span 相关数据原封不动，其他字段则计入 span.attributes 内。

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| x_request_id    			| span.attributes 		| df.span.x_request_id				|  |
| syscall_trace_id_request  | span.attributes 		| df.span.syscall_trace_id_request	|  |
| syscall_trace_id_response | span.attributes 		| df.span.syscall_thread_0			|  |
| syscall_thread_0     		| span.attributes 		| df.span.syscall_thread_0			|  |
| syscall_thread_1			| span.attributes 		| df.span.syscall_thread_1			|  |
| syscall_cap_seq_0			| span.attributes 		| df.span.syscall_cap_seq_0			|  |
| syscall_cap_seq_1			| span.attributes 		| df.span.syscall_cap_seq_1			|  备注：|

### Service Info

Service 应用级别信息，全部计入 resource.attributes 内，这里包括应用相关和进程以及线程相关，关于进程及线程相关若有特殊需求，请使用 OTel Processor 进行转换。

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| auto_service          | resource.attributes 		| service.name				| 标准字段|
| auto_instance     	| resource.attributes 		| service.instance.id       		| 标准|
| process_id 	        | resource.attributes 		| process.pid				| 备注：|
| process_kname         | resource.attributes 		| thread.name				| 备注：|


### Flow Info

包括字段： \_id，time，flow_id，start_time，end_time，close_type，status，is_new_flow。

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| \_id        | resource.attributes 		| df.flow_info.id 			| |
| time        | resource.attributes 		| df.flow_info.time 		| |
| flow_id     | resource.attributes 		| df.flow_info.flow_id 		| |
| start_time  | span.start_time_unix_nano 	| span.start_time_unix_nano | 注意时间格式转换，会转换为符合 OTel 的时间 |
| end_time    | span.end_time_unix_nano   	| span.end_time_unix_nano 	| 注意时间格式转换，会转换为符合 OTel 的时间 |

### Capture Info

包括字段：signal_source，tap，nat_source，tap_port，tap_port_name，tap_port_type，tap_side，l2_end	，l3_end，has_pcap，nat_real_ip，nat_real_port

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| signal_source     | resource.attributes 		| df.capture_info.signal_source 	| |
| tap     			| resource.attributes 		| df.capture_info.tap 			| |
| vtap     			| resource.attributes 		| df.capture_info.vtap 			| |
| nat_source     	| resource.attributes 		| df.capture_info.nat_source 	| |
| tap_port     		| resource.attributes 		| df.capture_info.tap_port 		| |
| tap_port_name     | resource.attributes 		| df.capture_info.tap_port_name 	| |
| tap_port_type     | resource.attributes 		| df.capture_info.tap_port_type 	| |
| tap_side     		| resource.attributes 		| df.capture_info.tap_side 		| |

### Universal Tag

包括字段：region，az，host，chost，vpc，l2_vpc，subnet，router，dhcpgw，lb，lb_listener，natgw，pod_cluster，pod_ns，pod_node，pod_ingress，pod_service，pod_group，pod，service，resource_gl0_type，resource_gl0，resource_gl1_type，resource_gl1，resource_gl2_type，resource_gl2

如有需要，请使用 OTel Processor 进行格式转换即可。

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| region      			| resource.attributes 		| df.universal_tag.region 				| |
| az        			| resource.attributes 		| df.universal_tag.az 					| |
| host     				| resource.attributes 		| df.universal_tag.host 				| |
| chost  				| resource.attributes		| df.universal_tag.chost  				| |
| vpc    				| resource.attributes   	| df.universal_tag.vpc 					| |
| l2_vpc  				| resource.attributes 		| df.universal_tag.l2_vpc  				| |
| subnet      			| resource.attributes 		| df.universal_tag.subnet  				| |
| router 				| resource.attributes 		| df.universal_tag.router 				| |
| dhcpgw      			| resource.attributes 		| df.universal_tag.dhcpgw 				| |
| lb        			| resource.attributes 		| df.universal_tag.lb 					| |
| lb_listener     		| resource.attributes 		| df.universal_tag.lb_listener 			| |
| natgw  				| resource.attributes 		| df.universal_tag.natgw 				| |
| pod_cluster    		| resource.attributes   	| df.universal_tag.pod_cluster 			| 按照官方文档定义，这里本应是 k8s.pod_cluster，如有需要可自行转换 |
| pod_ns    			| resource.attributes   	| df.universal_tag.pod_ns 				| 按照官方文档定义，这里本应是 k8s.pod_ns，如有需要可自行转换 |
| pod_node    			| resource.attributes   	| df.universal_tag.pod_node 			| 按照官方文档定义，这里本应是 k8s.pod_node，如有需要可自行转换 |
| pod_ingress    		| resource.attributes   	| df.universal_tag.pod_ingress 			| 按照官方文档定义，这里本应是 k8s.pod_ingress，如有需要可自行转换 |
| pod_service    		| resource.attributes   	| df.universal_tag.pod_service 			| 按照官方文档定义，这里本应是 k8s.pod_service，如有需要可自行转换 |
| pod_group    			| resource.attributes   	| df.universal_tag.pod_group 			| 按照官方文档定义，这里本应是 k8s.pod_group，如有需要可自行转换 |
| pod    				| resource.attributes   	| df.universal_tag.pod 					| 按照官方文档定义，这里本应是 k8s.pod.xxx 语义未明，如有需要可自行转换 |
| pod_cluster    		| resource.attributes   	| df.universal_tag.pod_cluster 			| 按照官方文档定义，这里本应是 k8s.pod_cluster，如有需要可自行转换 |
| service     			| resource.attributes 		| df.universal_tag.service 				| |
| auto_service     | resource.attributes 		| df.universal_tag.auto_service 	| |
| auto_service_type | resource.attributes 		| df.universal_tag.auto_service_type 		| |
| auto_instance    | resource.attributes 		| df.universal_tag.auto_instance 	| |
| auto_instance_type     		| resource.attributes 		| df.universal_tag.auto_instance_type 		| |


### Custom Tag

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| k8s.labels.xxx     	| resource.attributes 		| df.custom_tag.k8s.labels.xxx 		| 备注：|


### Network Layer

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| ip    		| resource.attributes 		| df.network.ip			| |
| is_ipv4     	| resource.attributes 		| df.network.is_ipv4 	| |
| is_internet   | resource.attributes 		| df.network.is_internet| |
| protocol     	| resource.attributes.	 		| net.transport = ip_(小写后的${protocol})	|标准字段|

### Transport Layer


| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| client_port    	| resource.attributes 		| df.transport.client_port			| |
| server_port     	| resource.attributes 		| df.transport.server_port 			| |
| tcp_flags_bit   	| resource.attributes 		| df.transport.tcp_flags_bit		| |
| syn_seq     		| resource.attributes 		| df.transport.syn_seq				| |
| syn_ack_seq     	| resource.attributes 		| df.transport.syn_ack_seq			| |
| last_keepalive_seq| resource.attributes 		| df.transport.last_keepalive_seq	| |
| last_keepalive_ack| resource.attributes 		| df.transport.last_keepalive_ack	| 备注：|
| req_tcp_seq     	| resource.attributes 		| df.transport.req_tcp_seq				| |
| resp_tcp_seq     	| resource.attributes 		| df.transport.resp_tcp_seq			| |


### Application Layer

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| l7_protocol    	| resource.attributes 		| df.application.l7_protocol | 字段映射详细说明|


# 协议字段对等转换

这里对每种协议特殊字段映射到 OTLP 标准字段内做特殊补充（通用字段请从上面查找）：

## 应用协议附加字段

以下字段针对于各个应用层协议均适用：

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无     	         | resource.attributes 		| telemetry.sdk.name=deepflow   	  | 自定义|
| 无     	         | resource.attributes 		| telemetry.sdk.version=${当前版本}  | 自定义|
| chost_0/pod_node_0| span.attributes        | net.host.name  	                 | 标准，先获取chost_x，如果不存在再尝试获取 pod_node_x|
| chost_1/pod_node_1| span.attributes        | net.peer.name  	                 | 标准，先获取chost_x，如果不存在再尝试获取 pod_node_x|
| client_port     	| span.attributes        | net.host.port                     | 标准|
| server_port     	| span.attributes        | net.peer.port                     | 标准|
| ip_0     	        | span.attributes        | net.sock.host.addr                | 标准|
| ip_1     	        | span.attributes        | net.sock.peer.addr                | 标准|
| response_status   | span.status 				   | span.status 				               | 0:正常 -> Ok 1;服务端异常，客户端异常 -> Error; 不存在->Unset|

## HTTP 协议簇

### HTTP

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| version    		| span.attributes 		| http.flavor			| 标准字段|
| request_type     	| span.attributes 		| http.method 			| 标准字段|
| request_domain   	| span.attributes 		| net.peer.name 		| 标准字段|
| request_resource  | span.attributes 		| df.http.path			| 自定义|
| request_id     	| span.attributes 		| df.global.request_id	| 自定义|
| response_code    	| span.attributes 		| http.status_code		| 标准字段|
| response_exception| span.event 		    | event.name			| 标准字段|
| http_proxy_client | span.attributes 		| df.http.proxy_client	| 自定义|
| 无 | span.name 		| span.name= ${request_type} + ${request_source}	| 标准字段 中间空格|

### HTTP2

TODO

## RPC 协议簇

### Dubbo

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无 | span.attributes	 	| rpc.system=apache_dubbo	| 标准字段|
| 无 | span.attributes	 	| rpc.service=${request_resource}	| 标准字段|
| 无 | span.attributes	 	| rpc.method=${request_type}	| 标准字段|
| 无 | span.attributes 		| span.name= ${request_source} + "/" + ${request_type}	== ${endpoint}| 标准字段 优先拼接|
| response_exception | span.event 		    | event.name				| 标准字段|
| request_domain   	| span.attributes 		| df.dubbo.request_domain | 不可获取为 neet.peer.name 作为额外字段即可|
| version    		     | span.attributes 		| df.dubbo.version			| 自定义|
| request_id     	   | span.attributes 		| df.global.request_id		| 自定义|
| response_code    	| span.attributes 		| df.response_code	| 自定义|

### gRPC

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无 | span.attributes	 	| rpc.system=grpc	| 标准字段|
| 无 | span.attributes	 	| rpc.system=${request_resource}	| 标准字段|
| 无 | span.attributes	 	| rpc.system=${request_type}	| 标准字段|
| 无 | span.attributes 		| span.name= ${request_source} + "/" + ${request_type}	== ${endpoint}| 标准字段|
| response_exception | span.event 		    | event.name				| 标准字段|
| version    		| span.attributes 		| http.flavor			| 标准字段|
| request_domain   	| span.attributes 		| df.grpc.request_domain 		| 不可获取为 neet.peer.name 作为额外字段即可|
| request_id     	| span.attributes 		| df.global.request_id	| 自定义|

### SOFARPC

TODO

### FastCGI

TODO

## SQL 协议簇

### MySQL

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无     	         | span.attributes 		 | db.system==mysql                         | 标准|
| 无                | span.attributes 		 | db.operation=${C/R/U/D}			| 标准字段|
| 无                | span.attributes 		 | db.statement=${request_resource}			| 标准字段|
| request_type     	| span.attributes 		| df.mysql.request_type 	                 | 自定义: db.operation 定义的为 SQL 关键字|
| response_exception| span.event 		      | event.name				| 标准字段|
| 无                | span.name 		 | span.name=${C/R/U/D} + ${db} + ${table}			| 标准字段|

### PostgreSQL

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无     	         | span.attributes 		 | db.system==postgresql                         | 标准|
| 无                | span.attributes 		 | db.operation=${C/R/U/D}			| 标准字段|
| 无                | span.attributes 		 | db.statement=${request_resource}			| 标准字段|
| request_type     	| span.attributes 		| df.postgresql.request_type 	                 | 自定义: db.operation 定义的为 SQL 关键字|
| response_exception| span.event 		      | event.name				| 标准字段|
| 无                | span.name 		 | span.name=${C/R/U/D} + ${db} + ${table}			| 标准字段|

## NoSQL 协议簇

### Redis

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无     	         | span.attributes 		 | db.system==redis        | 自定义|
| 无                | span.attributes 		 | db.operation=${request_type}			| 标准字段|
| 无                | span.attributes 		 | db.statement=${request_resource}			| 标准字段|
| response_exception| span.event 		    | event.name				| 标准字段|
| 无                | span.name 		    | span.name=${request_type}			| 标准字段|


### MongoDB

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :----     | :-----  |
| 无                | span.attributes     | db.system==mongodb        | 自定义|
| 无                | span.attributes     | db.operation=${request_type}     | 标准字段|
| 无                | span.attributes     | db.statement=${request_resource}     | 标准字段|
| response_exception| span.event        | event.name        | 标准字段|
| 无                | span.name        | span.name=${request_type}     | 标准字段|

## 消息队列协议簇

### Kafka

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无     	         | span.attributes 		| messaging.system=kafka 	| 标准|
| 无     	         | span.name 		      | span.name=${request_type} 	| 非标准|
| request_type     	| span.attributes 		| df.kafka.request_type 	| 自定义|
| request_id     	| span.attributes 		| df.global.request_id		| 自定义|
| request_resource     	| span.attributes 		| df.global.request_resource		| 自定义|
| request_domain	| span.attributes 	   | df.kafka.request_domain	| 自定义|
| response_code    	| span.attributes 		| df.kafka.response_code	| 自定义|
| response_exception| span.event 		    | event.name				| 标准字段|

### MQTT

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| 无     	         | span.attributes 		| messaging.system=mqtt 	| 标准|
| 无     	         | span.attributes 		| messaging.operation=${request_type} 	| 标准 其中：PUBLISH -> publish, SUBSCRIBE -> process, 其余过滤丢弃|
| 无     	         | span.name 		      | span.name=${request_resource} + " " + ${messaging.operation} 	| 标准。|
| request_type     	| span.attributes 	 | df.mqtt.request_type 		| 自定义|
| request_resource  | span.attributes 	 | df.mqtt.request_resource	| 自定义|
| request_domain	| span.attributes 	   | df.mqtt.request_domain	| 自定义|
| response_code    	| span.attributes 	 | df.mqtt.response_code		| 自定义|
| response_exception| span.event 		     | event.name				| 标准字段|

## 网络协议簇

### DNS

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| request_type     	| span.attributes 		| df.dns.request_type   	| 自定义|
| request_resource  | span.attributes 		| df.dns.request_resource	| 自定义|
| request_id     	| span.attributes 		| df.global.request_id		| 自定义|
| response_code    	| span.attributes 		| df.dns.response_code		| 自定义|
| response_exception| span.event 		    | event.name				| 标准字段|
| response_result 	| span.attributes 		| df.dns.response_result	| 自定义|
