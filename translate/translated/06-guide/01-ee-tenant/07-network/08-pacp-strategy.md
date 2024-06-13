---
title: PCAP Strategy
permalink: /guide/ee-tenant/network/pacp-strategy/
---

> This document was translated by ChatGPT

# PCAP Strategy

The PCAP strategy supports setting policies or rules for capturing network data packets. The strategy allows setting the network location for packet capture, the collector, filtering rules, payload truncation, etc., specifying which types of data packets should be captured and how to filter out unnecessary packets.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b204ac3.png)

- **① New**: Supports creating a new PCAP strategy. For details, please refer to the [New Strategy](#new-strategy) section.
- **② Enable/Disable**: Choose to enable or disable the current PCAP strategy. Once enabled, data filtering and capturing will commence.
- **③ View Collected Traffic**: Click to navigate to the PCAP download page to view the traffic data collected by this strategy. For details, please refer to the [PCAP Download](./pcap-download/) section.
- **④ Edit**: Modify the selected strategy.
- **⑤ Delete**: Delete the selected strategy.

### New Strategy

![New Strategy](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b31a676.png)

- Name: Required, the name of the PCAP strategy.
- Network Location: Required, select the network location where data will be captured.
- Collector: Choose the supported collector based on the selected network location.
- Collection Point Filter: Required, can be selected from computing resources, network resources, or container resources.
  - Supports further selection of different resource information under different categories. For example, if an IP address under network resources is selected, the IP address to be filtered must be specified.
- VPC: Optional, filter based on requirements.
- Protocol: Optional, filter based on requirements.
- Port: Optional, filter based on requirements.
- Peer: Disabled by default, supports filtering peer data.
  - Peer Filter: Required, please refer to `Collection Point Filter` for details.
  - Port: Optional, filter based on requirements.
- Payload Truncation: Enter the size of the traffic to be truncated, in bytes.
  - The default is 0, meaning no truncation.
