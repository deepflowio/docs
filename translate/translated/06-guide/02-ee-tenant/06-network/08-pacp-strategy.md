---
title: PCAP Strategy
permalink: /guide/ee-tenant/network/pacp-strategy/
---

> This document was translated by ChatGPT

# PCAP Strategy

The PCAP strategy supports setting policies or rules for capturing network packets. The strategy allows you to configure the network location for packet capture, the collector, filtering rules, payload truncation, etc., i.e., which types of packets should be captured and how to filter out unnecessary packets.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b204ac3.png)

- **① Create New**: Supports creating a new PCAP strategy. For details, please refer to the **New Strategy** section.
- **② Enable/Disable**: Choose to enable or disable the current PCAP strategy. Once enabled, data filtering and capturing will be performed.
- **③ View Captured Traffic**: Click to jump to the PCAP download page to view the traffic data collected by this strategy. For details, please refer to the **[PCAP Download](./pcap-download/)** section.
- **④ Edit**: Modify the selected strategy.
- **⑤ Delete**: Delete the strategy.

### Create New Strategy

![Create New Strategy](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b31a676.png)

- Name: Required. The name of the PCAP strategy.
- Network Location: Required. Select the network location where data will be captured.
- Collector: Select a supported collector based on the chosen network location.
- Capture Point Filter: Required. You can choose from computing resources, network resources, or container resources.
  - For resources under different categories, you can further select specific resource information. For example, if you select an IP address under network resources, you need to enter the IP address to filter.
- VPC: Optional. Filter as needed.
- Protocol: Optional. Filter as needed.
- Port: Optional. Filter as needed.
- Peer: Disabled by default. Supports filtering peer data.
  - Peer Filter: Required. Please refer to `Collector Filter` for input.
  - Port: Optional. Filter as needed.
- Payload Truncation: Enter the size of the traffic to be truncated, in bytes.
  - Default is 0, meaning no truncation.