---
title: PCAP Strategy
permalink: /guide/ee-tenant/network/pacp-strategy/
---

> This document was translated by GPT-4

# PCAP Strategy

The PCAP strategy allows the setting of policies or rules for capturing network data packets. The policy can set the packet capture points and collectors, set filtering rules, payload truncation, etc., that is, what types of packets should be captured and how to filter out unnecessary packets.

## Overview

![8_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b204ac3.png)

- **① Add New**: Supports creating a new PCAP strategy. For details, please refer to the "Add New Policy" section.
- **② Enable/Disable**: Choose to enable or disable the current PCAP strategy. Start to filter and capture data after enabling.
- **③ View Captured Traffic**: Click to jump to the PCAP download page to view the traffic data captured by this strategy. For details, please refer to the "[PCAP download](./pcap-download/)" section.
- **④ Edit**: Edit the clicked policy.
- **⑤ Delete**: Delete the strategy.

### Add New Policy

![8_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b31a676.png)

- Name: Required, the name of the PCAP strategy.
- Capture Point: Required, select the capture point to capture data.
- Collector: Choose the supported collector based on the selected capture point.
- Capture Point Filter: Required, you can select from computing resources, network resources, and container resources.
  - For different categories of resources, further selection of different resource information is supported. If you choose the IP address under network resources, you need to fill in the IP address to be filtered.
- VPC: Optional, filter according to needs.
- Protocol: Optional, filter according to needs.
- Port: Optional, filter according to needs.
- Peer: Off by default, supports filtering peer data.
  - Peer Filter: Required, fill in according to `Collector Filter`.
  - Port: Optional, filter according to needs.
- Payload truncation: Enter the amount of traffic to capture, in bytes.
  - Defaulted at 0, meaning no truncation.
