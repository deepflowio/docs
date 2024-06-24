---
title: NAT Tracing
permalink: /guide/ee-tenant/network/NAT-traversal/
---

> This document was translated by ChatGPT

# NAT Tracing

NAT tracing can initiate tracing for any TCP quadruple or quintuple, automatically tracing pre- and post-NAT traffic using DeepFlow's proprietary algorithm. The NAT tracing page displays the metrics corresponding to the clicked quadruple in a table format. Clicking `Tracing` initiates tracing for the quadruple.

## Overview

![Overview](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566442f3ee84e5.png)

- For details on page button functions, please refer to the section 【[Tracing - Call Log](../tracing/call-log/)】.
- Network tracing table: Displays client, server, group information, traffic rate, TCP retransmission ratio, TCP connection failures, and TCP connection delay in a table format.
  - Operations:
    - Click on a row: Initiates tracing for the data. For details, please refer to the section 【[Tracing - Right Sliding Box - NAT Tracing Details](../tracing/right-sliding-box/)】.