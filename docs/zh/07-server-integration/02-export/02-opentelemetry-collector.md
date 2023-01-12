---
title: 输出至 OpenTelemetry Collector
permalink: /server-integration/export/opentelemetry-collector
---
# 功能

通过转换标准 OTLP 协议后，将 DeepFlow 的 Span 数据输送至外部平台，可供外部团队补充和完善自己的可观测性平台。


# Span 简介

在 DeepFlow 内，关于 Span 可以分类为：
- 应用 Span：使用进程级别的 Trace 框架（Agent/SDK）产生的应用级别的 Span 数据，包括 应用自定义 Span, 中间件 Client 埋点 Span, 通讯框架等。 这里的 Trace 框架包括但不仅限于：Apache SkyWalking Agent，OpenTelemetry Java Agent 以及其他。
- 系统 Span：DeepFlow 通过 eBPF 零侵入采集的 Span，覆盖系统调用、应用函数（如 HTTPS）、API Gateway、服务网格 Sidecar。
- 网络 Span：DeepFlow 通过 BPF 从网络流量中采集的 Span，覆盖 iptables/ipvs/OvS/LinuxBridge 等容器网络组件。


# OTel 相关

关于 [OTLP Proto ](https://github.com/open-telemetry/opentelemetry-proto/blob/main/opentelemetry/proto/trace/v1/trace.proto)可以在这里找到关于你想要的 找到，其中关于 [Trace 语义约定](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/trace/semantic_conventions) 在这里可以看到，Trace 内部 [Resource 语义约定](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification/resource/semantic_conventions) 可以在这里看到。


# 对等转换

在 Flow_log 中有套内部逻辑将所有数据按照层级进行分类，在这里的对等转换即为 将分层的 [Flow_Log](https://deepflow.yunshan.net/docs/zh/auto-metrics/flow-log/) 数据转换为标准的 OTel 格式数据。

### Tracing Info

隶属 OTel 的 Span 相关数据原封不动，其他字段则计入 span.attributes 内。

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| x_request_id    			| span.attributes 		| df.span.x_request_id				|  |
| http_proxy_client     	| span.attributes 		| df.span.http_proxy_client 		|  |
| syscall_trace_id_request  | span.attributes 		| df.span.syscall_trace_id_request	|  |
| syscall_trace_id_response | span.attributes 		| df.span.syscall_thread_0			|  |
| syscall_thread_0     		| span.attributes 		| df.span.syscall_thread_0			|  |
| syscall_thread_1			| span.attributes 		| df.span.syscall_thread_1			|  |
| syscall_cap_seq_0			| span.attributes 		| df.span.syscall_cap_seq_0			|  |
| syscall_cap_seq_1			| span.attributes 		| df.span.syscall_cap_seq_1			|  备注：|

### Service Info

Service 应用级别信息，全部计入 span.attributes 内，这里包括应用相关和进程以及线程相关，关于进程及线程相关若有特殊需求，请使用 OTel Processor 进行转换。

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| service_name    			| span.attributes 		| df.span.service_name				| 当且仅当同时使用 Skywalking 才会使用到|
| service_instance_id     	| span.attributes 		| df.span.service_instance_id 		| 当且仅当同时使用 Skywalking 才会使用到|
| endpoint  				| span.attributes 		| df.span.endpoint					| 当且仅当同时使用 Skywalking 才会使用到|
| process_id 				| span.attributes 		| df.span.process_id				| |
| process_kname     		| span.attributes 		| df.span.process_kname				| 备注：|


## Flow Info

包括字段： \_id，time，flow_id，start_time，end_time，close_type，status，is_new_flow。

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| \_id        | resource.attributes 		| df.flow_info.id 			| |
| time        | resource.attributes 		| df.flow_info.time 		| |
| flow_id     | resource.attributes 		| df.flow_info.flow_id 		| |
| start_time  | span.start_time_unix_nano 	| span.start_time_unix_nano | 注意时间格式转换，会转换为符合 OTel 的时间 |
| end_time    | span.end_time_unix_nano   	| span.end_time_unix_nano 	| 注意时间格式转换，会转换为符合 OTel 的时间 |
| close_type  | resource.attributes 		| df.flow_info.close_type 	| |
| status      | span.status 				| span.status 				| 原始取值：0:正常, 1:异常 ,2:不存在，3:服务端异常, 4:客户端异常 映射后会匹配到标准 OTel Status|
| is_new_flow | resource.attributes 		| df.flow_info.is_new_flow  | 备注：|

### Capture Info	

包括字段：signal_source，tap，nat_source，tap_port，tap_port_name，tap_port_type，tap_side，l2_end	，l3_end，has_pcap，nat_real_ip，nat_real_port

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| signal_source     | resource.attributes 		| df.apture_info.signal_source 	| |
| tap     			| resource.attributes 		| df.apture_info.tap 			| |
| nat_source     	| resource.attributes 		| df.apture_info.nat_source 	| |
| tap_port     		| resource.attributes 		| df.apture_info.tap_port 		| |
| tap_port_name     | resource.attributes 		| df.apture_info.tap_port_name 	| |
| tap_port_type     | resource.attributes 		| df.apture_info.tap_port_type 	| |
| tap_side     		| resource.attributes 		| df.apture_info.tap_side 		| |
| l2_end	     	| resource.attributes 		| df.apture_info.l2_end 		| |
| l3_end     		| resource.attributes 		| df.apture_info.l3_end 		| |
| has_pcap     		| resource.attributes 		| df.apture_info.has_pcap 		| |
| nat_real_ip     	| resource.attributes 		| df.apture_info.nat_real_ip 	| |
| nat_real_port     | resource.attributes 		| df.apture_info.nat_real_port 	| 备注：|

### Tunnel Info	

包括字段：tunnel_tier，tunnel_type，tunnel_tx_id，tunnel_rx_id，tunnel_tx_ip_0，tunnel_tx_ip_1，tunnel_rx_ip_0，tunnel_rx_ip_1，tunnel_tx_mac_0，tunnel_tx_mac_1，tunnel_rx_mac_0，tunnel_rx_mac_1

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| tunnel_tier     	| resource.attributes 		| df.tunnel_info.tunnel_tier 		| |
| tunnel_type     	| resource.attributes 		| df.tunnel_info.tunnel_type 		| |
| tunnel_tx_id     	| resource.attributes 		| df.tunnel_info.tunnel_tx_id 		| |
| tunnel_rx_id     	| resource.attributes 		| df.tunnel_info.tunnel_rx_id 		| |
| tunnel_tx_ip_0    | resource.attributes 		| df.tunnel_info.tunnel_tx_ip_0 	| |
| tunnel_tx_ip_1    | resource.attributes 		| df.tunnel_info.tunnel_tx_ip_1 	| |
| tunnel_rx_ip_0    | resource.attributes 		| df.tunnel_info.tunnel_rx_ip_0 	| |
| tunnel_rx_ip_1	| resource.attributes 		| df.tunnel_info.tunnel_rx_ip_1 	| |
| tunnel_tx_mac_0   | resource.attributes 		| df.tunnel_info.tunnel_tx_mac_0 	| |
| tunnel_tx_mac_1   | resource.attributes 		| df.tunnel_info.tunnel_tx_mac_1 	| |
| tunnel_rx_mac_0   | resource.attributes 		| df.tunnel_info.tunnel_rx_mac_0 	| |
| tunnel_rx_mac_1   | resource.attributes 		| df.tunnel_info.tunnel_rx_mac_1 	| 备注：|

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
| resource_gl0_type     | resource.attributes 		| df.universal_tag.resource_gl0_type 	| |
| resource_gl0     		| resource.attributes 		| df.universal_tag.resource_gl0 		| |
| resource_gl1_type     | resource.attributes 		| df.universal_tag.resource_gl1_type 	| |
| resource_gl1     		| resource.attributes 		| df.universal_tag.resource_gl1 		| |
| resource_gl2_type     | resource.attributes 		| df.universal_tag.resource_gl2_type 	| |
| resource_gl2     		| resource.attributes 		| df.universal_tag.resource_gl2 		| 备注：|


### Custom Tag	

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| k8s.labels.xxx     	| resource.attributes 		| df.custom_tag.k8s.labels.xxx 		| 备注：|

### Data Link Layer

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| eth_type    	| resource.attributes 		| df.data_link.eth_type	| |
| vlan     		| resource.attributes 		| df.data_link.vlan 	| |
| mac     		| resource.attributes 		| df.data_link.mac		| 备注：|

### Network Layer

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| ip    		| resource.attributes 		| df.network.ip			| |
| is_ipv4     	| resource.attributes 		| df.network.is_ipv4 	| |
| is_internet   | resource.attributes 		| df.network.is_internet| |
| province     	| resource.attributes 		| df.network.province	| |
| protocol     	| resource.attributes 		| df.network.protocol	| 备注：|

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

### Application Layer

| 原始字段名   | 映射后的位置 | 映射后的名称 | 备注说明 |
| :----       | :----       | :---- 	  | :-----  |
| l7_protocol    	| resource.attributes 		| df.application.l7_protocol | 字段映射详细说明|