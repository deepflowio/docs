---
title: Log Search Box
permalink: /guide/ee-tenant/query/log-search/
---

> This document was translated by ChatGPT

# Log Search Box

The `Log Search Box` is used in Application - Call Logs / Distributed Tracing and Network - Flow Logs.

Compared with the `Path Search Box`, the `Log Search Box` only lacks the `grouping` capability. For detailed operation instructions, please refer to [Path Search Box](./path-search/)

![00-Log Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f5e7a6cd.png)

# Application Scenarios

## View calls with exceptions for a specific service

- Feature Page: Application - Call Logs

---

- Service Set: S1  
- Search Tags: pod_service = frontend-external, response_status != Normal  
- Path: Intra-Service, Inter-Service, WAN  
- Direction: Bidirectional

![01-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f61ad6e0.png)

## View MySQL calls for a specific service

- Feature Page: Application - Call Logs

---

- Service Set: S1  
- Search Tags: pod_service = cars, l7_protocol = MySQL  
- Path: Intra-Service, Inter-Service, WAN  
- Direction: Bidirectional

![02-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f60c6540.png)

## View flow logs for a specific five-tuple

- Feature Page: Network - Flow Logs

---

- Service Set: S1  
- Search Tags: pod = insurances-v1-d895774d6-26wf7, client_port = 46168, protocol = TCP  
- Path: Intra-Service  
- Primary Group: pod  
- Secondary Group: observation_point  
- Direction: Client

---

- Service Set: S2  
- Search Tags: pod = mysqldb-v1-5cc78df8d-fwrn4, server_port = 3306  
- Path: Intra-Service  
- Primary Group: pod  
- Secondary Group: observation_point  
- Direction: Server

![03-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f601adf9.png)

## View flow logs with connection establishment exceptions for a specific POD

- Feature Page: Network - Flow Logs

---

- Service Set: S1  
- Search Tags: pod = frontend-97cc49c74-qs6wh, close_type = Connection Establishment - Client ACK Missing, close_type = Connection Establishment - Server SYN Missing, close_type = Connection Establishment - Client Port Reuse, close_type = Connection Establishment - Server Direct Reset, close_type = Connection Establishment - Other Server Reset  
- Path: Intra-Service, Inter-Service, WAN  
- Direction: Bidirectional

![04-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645b087b6e86.png)