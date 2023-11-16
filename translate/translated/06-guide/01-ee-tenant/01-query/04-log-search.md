---
title: Log Search Box
permalink: /guide/ee-tenant/query/log-search/
---

> This document was translated by GPT-4

# Log Search Box

Both Application - Call Logs/Distributed Tracing and Network - Stream Logs use the `Log Search Box`.

The `Log Search Box` is similar to the `Path Search Box`, except it lacks the `group` function. For detailed operation instructions, please refer to [Path Search Box](./path-search/)

![1-Log Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f5e7a6cd.png)

# Use Cases

## View abnormal calls in a service

- Feature page: Application - Call Logs

---

- Service collection: S1
- Search tags: pod_service = frontend-external, response_status != normal
- Path: In-service, Out-of-service, WAN
- Direction: Bi-directional

![2-Query results](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f61ad6e0.png)

## View a service's MySQL calls

- Feature page: Application - Call Logs

---

- Service collection: S1
- Search tags: pod_service = cars, l7_protocol = MySQL
- Path: In-service, Out-of-service, WAN
- Direction: Bi-directional

![3-Query results](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f60c6540.png)

## View stream logs of a 5-tuple

- Feature page: Network - Stream Logs

---

- Service collection: S1
- Search tags: pod = insurances-v1-d895774d6-26wf7, client_port = 46168, protocol = TCP
- Path: In-service
- Main Group: pod
- Subgroup: tap_side
- Direction: Client-side

---

- Service collection: S2
- Search tags: pod = mysqldb-v1-5cc78df8d-fwrn4, server_port = 3306
- Path: In-service
- Main Group: pod
- Subgroup: tap_side
- Direction: Server-side

![4-Query results](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f601adf9.png)

## View the stream logs of a POD with connection issues

- Feature page: Network - Stream Logs

---

- Service collection: S1
- Search tags: pod = frontend-97cc49c74-qs6wh, close_type = Connection - Server side SYN ended, close_type = Connection - Client side SYN ended, close_type = Connection - Client port multiplexing, close_type = Connection - Server directly reset, close_type = Connection - Server other resets
- Path: In-service, Out-of-service, WAN
- Direction: Bi-directional

![5-Query results](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4f5f68325.png)
