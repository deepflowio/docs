---
title: Agent 性能调优
permalink: /best-practice/agent-performance-tuning/
---

本文介绍如何对 DeepFlow Agent 配置以降低 CPU、内存开销，或提升 Agent 的处理能力。其中标记 **$** 的配置项一般效果非常显著。

# 降低内存开销

## 关闭不需要的数据

| 配置项 | 数据 | 说明 |
| ------ | ---- | ---- |
| `tap_interface_regex` **$** | AF_PACKET/cBPF 数据 | 默认采集 Pod NIC、Node NIC、Loopback NIC，可按需精简，以降低采集流量大小 |
| `capture_bpf` | AF_PACKET/cBPF 数据 | 默认为空，表示一个网卡的所有流量都采集，支持填写 [BPF 表达式](https://biot.com/capstats/bpf.html)以降低采集流量大小 |
| `obfuscate-enabled-protocols` **$** | MySQL、PostgreSQL、Redis 数据脱敏 | 开启脱敏后调用日志中不会包含变量，可减小 `request_resource` 长度，[开启 Redis 的脱敏效果显著](https://deepflow.io/blog/zh/052-build-in-sql-and-redis-data-obfuscation/) |

更多此类配置项请参考：[降低存储压力](./reduce-storage-overhead/)。

## 降低原始数据的长度

| 配置项 | 作用 | 说明 | 调整副作用 |
| ------ | ---- | ---- | ---------- |
| `capture_packet_size` **$** | AF_PACKET/cBPF 采集包长度 | 默认 64K，可按需降低为等于 `l7_log_packet_size` | 调小会影响企业版流量分发能力 |
| `l7_log_packet_size` **$**  | 应用协议解析的包长        | 对 AF_PACKET/cBPF、eBPF 采集数据均生效，表示截取多少自己进行协议解析 | 调小会影响 TraceID/SpanID 等字段解析成功率 |

## 降低内存缓冲区大小

注意：调小此类参数会降低突发流量的缓冲能力，可能出现采集丢包。若调小引发了丢数据告警，需要适当增大。

| 配置项 | 作用 | 说明 |
| ------ | ---- | ---- |
| `afpacket-blocks` **$** | AF_PACKET/cBPF 数据缓冲区大小 | 默认为 `$max_memory/16` 且不超过 128MB，注意此配置项需要结合 `afpacket-blocks-enabled` 一起使用 |
| `analyzer-raw-packet-block-size` | AF_PACKET/cBPF 数据缓冲区大小 | 仅针对企业版专属采集器 |
| `static_config.ebpf.ring-size` **$** | eBPF 数据缓冲区大小 | 默认 64K，每一个为 `l7_log_packet_size` 字节，即默认 64MB |
| `flow-buffer-size` | PCAP 组装缓冲区大小 | 仅用于企业版 PCAP 下载功能，每一个需要采集 PCAP 的 `l4_flow_log` 都会在内存中开辟一个此尺寸的缓冲区 |
| `packet-sequence-block-size` | TCP 包头缓冲区大小 | 仅用于企业版 TCP 时序图功能，每一个 `l4_flow_log` 都会在内存中开辟一个此尺寸的缓冲区 |
| `grpc-buffer-size` | gRPC 缓冲区大小 | 用于 agent 和 server 的控制面通信，调小可能导致调用 server RPC 失败，默认 5MB |

## 降低内存队列尺寸

注意：调小此类参数会降低突发流量的缓冲能力，可能出现采集丢包。一般不建议调整，反而需要在丢数据时调大。

| 配置项 | 作用 | 说明 |
| ------ | ---- | ---- |
| `flow-queue-size` | 内存缓冲队列大小 | 默认 64K，用于线程间传递流日志、调用日志 |
| `flow-sender-queue-size` | 内存缓冲队列大小 | 默认 64K，用于线程间传递流日志、调用日志 |
| `flow-sender-queue-count` | 内存缓冲队列数量 | 默认 1，增大会提升发送观测信号的能力，但会增大内存消耗 |
| `quadruple-queue-size` | 内存缓冲队列大小 | 默认 64K，用于线程间传递流日志 |
| `collector-sender-queue-size` | 内存缓冲队列大小 | 默认 64K，用于线程间传递所有待发送的观测信号 |
| `collector-sender-queue-count` | 内存缓冲队列数量 | 默认 1，增大会提升发送观测信号的能力，但会增大内存消耗 |
| `toa-sender-queue-size` | 内存缓冲队列大小 | 默认 64K，用于线程间传递需要发送给 Server 的 TOA（TCP Option Address）信息 |
| `analyzer-queue-size` | 内存缓冲队列大小 | 仅企业版专属采集器，默认 128K，用于线程间传递原始流量 |
| `pcap.queue-size` | 内存缓冲队列大小 | 仅用于企业版 PCAP 下载功能 |
| `flow-aggr-queue-size` | 内存缓冲队列大小 | 默认 64K，用于线程间传递秒粒度流日志 |
| `packet-sequence-queue-size` | 仅企业版 TCP 时序图功能，内存缓冲队列大小 | 默认 64K，用于线程间传递 TCP 包头 |

## 降低哈希表尺寸

一般不建议调整。

| 配置项 | 作用 | 说明 |
| ------ | ---- | ---- |
| `fast-path-map-size` | AutoTagging 快表尺寸 | 默认会根据 `max_memory` 自动调整 |
| `toa-lru-cache-size` | TOA LRU 尺寸 | 默认 64K |
| `flow.flow-slots-size` | `l4_flow_log` 大小 | 用于网络流聚合 |

# 降低 CPU 开销

TODO
