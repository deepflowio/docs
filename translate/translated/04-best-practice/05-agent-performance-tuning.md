---
title: Agent Performance Tuning
permalink: /best-practice/agent-performance-tuning/
---

> This document was translated by ChatGPT

This article explains how to configure the DeepFlow Agent to reduce CPU and memory overhead or to enhance the Agent's processing capabilities. Configuration items marked with **$** generally have a significant impact.

# Reducing Memory Overhead

## Disabling Unnecessary Data

| Configuration Item                  | Data                                          | Description                                                                                                                                                                                                                                                     |
| ----------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **$** `obfuscate-enabled-protocols` | Data obfuscation for MySQL, PostgreSQL, Redis | When obfuscation is enabled, variable data is not included in the call logs, which can reduce the length of `request_resource`, [notably effective when Redis obfuscation is enabled](https://deepflow.io/blog/zh/052-build-in-sql-and-redis-data-obfuscation/) |
| **$** `tap_interface_regex`         | AF_PACKET/cBPF data                           | By default, it collects data from Pod NIC, Loopback NIC, etc. You can trim it as needed to reduce the amount of collected traffic                                                                                                                               |
| `capture_bpf`                       | AF_PACKET/cBPF data                           | The default is empty, indicating that all traffic from a network card is collected. You can specify a [BPF expression](https://biot.com/capstats/bpf.html) to reduce the amount of collected traffic                                                            |

For more such configuration items, please refer to: [Reducing Storage Overhead](./reduce-storage-overhead/).

## Reducing the Length of Raw Data

| Configuration Item          | Purpose                                          | Description                                                                                                               | Side Effects of Adjustment                                                          |
| --------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **$** `capture_packet_size` | Length of AF_PACKET/cBPF collected packets       | The default is 64K, which can be reduced to equal `l7_log_packet_size` as needed                                          | Reducing it will affect the enterprise version's traffic distribution functionality |
| **$** `l7_log_packet_size`  | Number of bytes for application protocol parsing | Effective for both AF_PACKET/cBPF and eBPF collected data, indicating how many bytes are intercepted for protocol parsing | Reducing it may affect the parsing of fields like TraceID/SpanID in call logs       |

## Reducing Memory Buffer Size

Note: Reducing such parameters will decrease the buffer capacity for burst traffic. If reducing causes data loss alarms, increase appropriately.

| Configuration Item | Purpose | Description |
| ------------------ | ------- | ----------- |
| **$** `afpacket-blocks` | AF_PACKET/cBPF data buffer size | The default is `max_memory/16` and does not exceed 128MB. Note that this configuration item generally needs to be used together with `afpacket-blocks-enabled` |
| **$** `ebpf`.`ring-size` | eBPF data buffer size | The default is 64K, each being `l7_log_packet_size` bytes, i.e., 64MB by default |
| `analyzer-raw-packet-block-size` | AF_PACKET/cBPF data buffer size | Only for enterprise version exclusive collectors |
| `flow-buffer-size` | PCAP assembly buffer size | Only for the enterprise version PCAP download function. Each `l4_flow_log` that requires PCAP collection will allocate a buffer of this size in memory |
| `packet-sequence-block-size` | TCP packet header buffer size | Only for the enterprise version TCP sequence diagram function. Each `l4_flow_log` will allocate a buffer of this size in memory |
| `grpc-buffer-size` | gRPC buffer size | Used for control plane communication between agent and server. Reducing it may cause server RPC calls to fail. The default is 5MB |

## Reducing Memory Queue Size

Note: Reducing such parameters will decrease the buffer capacity for burst traffic. If reducing causes data loss alarms, increase appropriately.

| Configuration Item | Purpose | Description |
| ------------------ | ------- | ----------- |
| `flow-queue-size` | Memory buffer queue size | The default is 64K in length. When the queue is full, it may occupy up to 32MB of memory, used for passing flow logs and call logs between threads |
| `flow-aggr-queue-size` | Memory buffer queue size | The default is 64K in length. When the queue is full, it may occupy up to 32MB of memory, used for passing second-level flow logs between threads |
| `flow-sender-queue-size` | Memory buffer queue size | The default is 64K in length. When the queue is full, it may occupy up to 32MB of memory, used for passing flow logs and call logs between threads |
| `flow-sender-queue-count` | Number of memory buffer queues | The default is 1. Increasing it will improve the ability to send observability signals, but will increase memory consumption |
| `quadruple-queue-size` | Memory buffer queue size | The default is 64K in length. When the queue is full, it may occupy up to 32MB of memory, used for passing flow logs between threads |
| `collector-sender-queue-size` | Memory buffer queue size | The default is 64K in length, used for passing all to-be-sent observability signals between threads |
| `collector-sender-queue-count` | Number of memory buffer queues | The default is 1. When the queue is full, it may occupy up to 32MB of memory. Increasing it will improve the ability to send observability signals, but will increase memory consumption |
| `toa-sender-queue-size` | Memory buffer queue size | The default is 64K in length. When the queue is full, it may occupy up to 4MB of memory, used for passing TOA (TCP Option Address) information to the Server between threads |
| `packet-sequence-queue-size` | Memory buffer queue size | Only for the enterprise version TCP sequence diagram function. The default is 64K in length. When the queue is full, it may occupy up to `128*packet-sequence-block-size` bytes of memory, used for passing TCP packet headers between threads |
| **$** `analyzer-queue-size` | Memory buffer queue size | Only for enterprise version exclusive collectors. The default is 128K in length. When the queue is full, it may occupy up to `128*capture_packet_size` bytes of memory, used for passing raw traffic between threads |
| **$** `pcap`.`queue-size` | Memory buffer queue size | Only for the enterprise version PCAP download function. The default is 64K in length. When the queue is full, it may occupy up to `128*capture_packet_size` bytes of memory, used for passing raw traffic between threads |

## Reducing Hash Table Size

Except for `flow`.`flow-count-limit`, other configuration items have lower benefits and are generally not recommended to be adjusted.

| Configuration Item | Purpose | Description |
| ------------------ | ------- | ----------- |
| **$** `flow`.`flow-count-limit` | Total size of `l4_flow_log` hash table | The default is 64Kx2 (one table each for cBPF and eBPF). Each entry is about 1500B, with a default maximum occupancy of 192MB |
| `flow`.`flow-slots-size` | Hash slot size of `l4_flow_log` hash table | Used for network flow aggregation |
| `fast-path-map-size` | AutoTagging fast table size | The default will automatically adjust based on `max_memory` |
| `toa-lru-cache-size` | LRU size for TOA (TCP Option Address) | The default is 64K |

# Reducing CPU Overhead

TODO
