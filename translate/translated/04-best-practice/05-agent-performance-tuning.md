---
title: Agent Performance Tuning
permalink: /best-practice/agent-performance-tuning/
---

> This document was translated by ChatGPT

This article introduces how to configure the DeepFlow Agent to reduce CPU and memory overhead or enhance the Agent's processing capabilities. Configuration items marked with **$** generally have a significant effect.

# Reducing Memory Overhead

## Disabling Unnecessary Data

| Configuration Item               | Data                              | Description                                                                                                                                                                        |
| -------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **$** `obfuscate-enabled-protocols` | MySQL, PostgreSQL, Redis Data Obfuscation | Enabling obfuscation will exclude variables from the call logs, reducing the length of `request_resource`, [especially effective when Redis obfuscation is enabled](https://deepflow.io/blog/zh/052-build-in-sql-and-redis-data-obfuscation/) |
| **$** `tap_interface_regex`      | AF_PACKET/cBPF Data               | By default, it collects Pod NIC, Loopback NIC, etc. You can streamline it as needed to reduce the size of the collected traffic                                                     |
| `capture_bpf`                    | AF_PACKET/cBPF Data               | Default is empty, meaning all traffic on a network card is collected. You can use [BPF expressions](https://biot.com/capstats/bpf.html) to reduce the size of the collected traffic |

For more such configuration items, please refer to: [Reducing Storage Overhead](./reduce-storage-overhead/).

## Reducing the Length of Raw Data

| Configuration Item               | Function                   | Description                                                                 | Adjustment Side Effects                          |
| -------------------------------- | -------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| **$** `capture_packet_size`      | AF_PACKET/cBPF Capture Packet Length | Default is 64K, can be reduced to equal `l7_log_packet_size` as needed       | Reducing it may affect the enterprise version's traffic distribution functionality |
| **$** `l7_log_packet_size`       | Bytes for Application Protocol Parsing | Effective for both AF_PACKET/cBPF and eBPF collected data, indicating how many bytes to capture for protocol parsing | Reducing it may affect the parsing of fields like TraceID/SpanID in call logs |

## Reducing Memory Buffer Size

Note: Reducing these parameters will lower the buffer capacity for burst traffic. If reducing them causes data loss alarms, you need to increase them appropriately.

| Configuration Item               | Function                   | Description                                                                 |
| -------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| **$** `afpacket-blocks`          | AF_PACKET/cBPF Data Buffer Size | Default is `max_memory/16` and does not exceed 128MB. Note that this configuration item generally needs to be used together with `afpacket-blocks-enabled` |
| **$** `ebpf`.`ring-size`         | eBPF Data Buffer Size      | Default is 64K, each one is `l7_log_packet_size` bytes, i.e., default is 64MB |
| `analyzer-raw-packet-block-size` | AF_PACKET/cBPF Data Buffer Size | Only for the enterprise version's exclusive collector                        |
| `flow-buffer-size`               | PCAP Assembly Buffer Size  | Only for the enterprise version's PCAP download function. Each `l4_flow_log` that needs to collect PCAP will open a buffer of this size in memory |
| `packet-sequence-block-size`     | TCP Header Buffer Size     | Only for the enterprise version's TCP sequence diagram function. Each `l4_flow_log` will open a buffer of this size in memory |
| `grpc-buffer-size`               | gRPC Buffer Size           | Used for control plane communication between agent and server. Reducing it may cause server RPC call failures. Default is 5MB |

## Reducing Memory Queue Size

Note: Reducing these parameters will lower the buffer capacity for burst traffic. If reducing them causes data loss alarms, you need to increase them appropriately.

| Configuration Item               | Function                   | Description                                                                                                                            |
| -------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `flow-queue-size`                | Memory Buffer Queue Size   | Default is 64K length. When the queue is full, it may occupy up to 32MB of memory, used for passing flow logs and call logs between threads |
| `flow-aggr-queue-size`           | Memory Buffer Queue Size   | Default is 64K length. When the queue is full, it may occupy up to 32MB of memory, used for passing second-granularity flow logs between threads |
| `flow-sender-queue-size`         | Memory Buffer Queue Size   | Default is 64K length. When the queue is full, it may occupy up to 32MB of memory, used for passing flow logs and call logs between threads |
| `flow-sender-queue-count`        | Memory Buffer Queue Count  | Default is 1. Increasing it will enhance the ability to send observability signals but will increase memory consumption                   |
| `quadruple-queue-size`           | Memory Buffer Queue Size   | Default is 64K length. When the queue is full, it may occupy up to 32MB of memory, used for passing flow logs between threads             |
| `collector-sender-queue-size`    | Memory Buffer Queue Size   | Default is 64K length, used for passing all observability signals to be sent between threads                                             |
| `collector-sender-queue-count`   | Memory Buffer Queue Count  | Default is 1. When the queue is full, it may occupy up to 32MB of memory. Increasing it will enhance the ability to send observability signals but will increase memory consumption |
| `toa-sender-queue-size`          | Memory Buffer Queue Size   | Default is 64K length. When the queue is full, it may occupy up to 4MB of memory, used for passing TOA (TCP Option Address) information to be sent to the server |
| `packet-sequence-queue-size`     | Memory Buffer Queue Size   | Only for the enterprise version's TCP sequence diagram function. Default is 64K length. When the queue is full, it may occupy up to `128*packet-sequence-block-size` bytes of memory, used for passing TCP headers between threads |
| **$** `analyzer-queue-size`      | Memory Buffer Queue Size   | Only for the enterprise version's exclusive collector. Default is 128K length. When the queue is full, it may occupy up to `128*capture_packet_size` bytes of memory, used for passing raw traffic between threads |
| **$** `pcap`.`queue-size`        | Memory Buffer Queue Size   | Only for the enterprise version's PCAP download function. Default is 64K length. When the queue is full, it may occupy up to `128*capture_packet_size` bytes of memory, used for passing raw traffic between threads |

## Reducing Hash Table Size

Except for `flow`.`flow-count-limit`, other configuration items have lower benefits and are generally not recommended for adjustment.

| Configuration Item               | Function                   | Description                                                                 |
| -------------------------------- | -------------------------- | --------------------------------------------------------------------------- |
| **$** `flow`.`flow-count-limit`  | Total Size of `l4_flow_log` Hash Table | Default is 64Kx2 (one table each for cBPF and eBPF). Each entry is about 1500B, i.e., the default maximum occupancy is 192MB |
| `flow`.`flow-slots-size`         | Hash Slot Size of `l4_flow_log` Hash Table | Used for network flow aggregation                                            |
| `fast-path-map-size`             | AutoTagging Fast Table Size | Default will automatically adjust based on `max_memory`                      |
| `toa-lru-cache-size`             | LRU Size of TOA (TCP Option Address) | Default is 64K                                                               |

# Reducing CPU Overhead

TODO
