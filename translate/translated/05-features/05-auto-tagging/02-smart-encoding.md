---
title: SmartEncoding
permalink: /features/auto-tagging/smart-encoding
---

> This document was translated by ChatGPT

DeepFlow automatically injects resource, service, and business tags into all observation data. In a typical production environment, the number of tags that need to be automatically injected into a piece of data could be as many as 100+. These tags exert a heavy load on the backend storage. DeepFlow's leading-edge SmartEncoding mechanism innovatively solves this issue, significantly reducing the performance overhead.

![SmartEncoding in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b164952a5.png)

SmartEncoding depends on the encoding and association of various types of tag data. First, the Agent obtains string-formatted tags and summarizes them on the Server. Then, the Server encodes all the tags. After this, the SmartEncoding process of observing data includes three stages:

- Collection stage: The Agent automatically injects VPC (Integer), IP, PID tags into each observation data.
- Storage stage: Based on the VPC, IP, PID tags marked by the Agent, the Server automatically injects a small amount of Int-coded Meta Tags into the observation data, including the cloud resource properties, K8s resource properties, and process properties corresponding to IP and PID.
- Query stage: The Server automatically calculates the association between all custom tags and Meta Tags. Users can directly query (filter, group) all tags on all observation data through SQL/PromQL. The user experience is no different from that of a BigTable.

We see that AutoTagging solved the pain point of data isolated islands, and the SmartEncoding mechanism solved the pain point of resource overhead. From the implementation mechanism, we can see that DeepFlow can actually support **limitless custom tag injection**. Therefore, when using DeepFlow, we strongly suggest:

- When resources are provisioned, inject as many custom tags as possible into the cloud resources.
- When the business goes live, inject as many Labels, Annotations, and Env tags as possible into K8s.
- Synchronize the business tags in CMDB and the Continuous Delivery System to DeepFlow via API.

By these means, we can greatly prevent the tedious process of manually injecting tags into the business code and significantly reduce the pressure on the backend storage.

Our Benchmark on SmartEncoding shows that by encoding the tags, the write performance of Meta Tags can be improved 10 times. We randomly generated a set of tags of 16 characters in length, with a Cardinality of 5000. Based on such a data model, we compared SmartEncoding, ClickHouse LowCard, and No Encoding. The test results are as follows:

| Type | Tag Field Type | CPU Usage | Memory Usage | Disk Usage |
| ------------------------ | --------------- | --------- | ------------ | ---------- |
| Baseline (SmartEncoding) | Int | 1 | 1 | 1 |
| Write-time Encoding | LowCard(string) | 10 | 1 | 1.5 |
| No Encoding | string | 5 | 1.5 | 7.5 |

For all custom tags (K8s custom Lable/Annotation/Env, custom tags of cloud resources, business tags in CMDB, business tags in Continuous Delivery Systems), we do not need to bind them with observation data for storage. Therefore, these massive custom tags can be considered as having zero storage overhead. Furthermore, since the size of the data system is significantly reduced after encoding, the amount of disk scanning during data query is also reduced, thereby improving query performance.
