---
title: NAT Tracing
permalink: /guide/ee-tenant/network/NAT-traversal/
---

> This document was translated by GPT-4

# NAT Tracing

NAT tracing can initiate tracing for any TCP four-tuple or five-tuple through the proprietary algorithm of DeepFlow to automatically trace the traffic before and after NAT. The NAT tracing page displays the metrics corresponding to the four-tuple of the clicked data in the form of a table. By clicking on `tracing`, you can initiate tracing for the four-tuple.

## Overview Introduction

![6_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac6b080e18.png)

- For page button functionality details, please refer to the chapter of [Application - Call Log](../application/call-log/)】
- Network tracking table: Displays the client, server, group information, traffic rate, TCP retransmission ratio, TCP connection failure, and TCP connection delay in the form of a table.
  - Operation:
    - Click the row: Click on the data row, and you can check the detailed information of this data through the right slide box. For details about this, please refer to the chapter of [Right Slide Box - Network Metrics](../application/right-sliding-box/)
    - Operation Button: Click on the `NAT tracing` button to trace the data. For details about this, please refer to the chapter of [Right Slide Box - NAT Tracing Details](../application/right-sliding-box/).
