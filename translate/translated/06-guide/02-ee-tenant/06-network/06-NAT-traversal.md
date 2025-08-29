---
title: NAT Tracing
permalink: /guide/ee-tenant/network/NAT-traversal/
---

> This document was translated by ChatGPT

# NAT Tracing

NAT tracing can initiate tracing for any TCP four-tuple or five-tuple, and uses DeepFlow’s proprietary algorithm to automatically trace traffic before and after NAT. The NAT tracing page displays the metrics corresponding to the four-tuple of the clicked data in a table format. Clicking `Trace` will initiate tracing for the four-tuple.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566442f3ee84e5.png)

- For the functions of the page buttons and detailed usage, please refer to the **[Tracing - Call Log](../tracing/call-log/)** section.
- Network tracing table: Displays client, server, group information, traffic rate, TCP retransmission ratio, TCP connection failures, and TCP connection latency in a table format.  
  - Operations:  
    - Click a row: You can trace the data. For detailed usage, please refer to the **[Tracing - Right Sliding Panel - NAT Tracing Details](../tracing/right-sliding-box/)** section.