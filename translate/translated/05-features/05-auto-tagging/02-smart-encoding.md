---
title: SmartEncoding
permalink: /features/auto-tagging/smart-encoding
---

> This document was translated by ChatGPT

DeepFlow automatically injects resource, service, and business tags into all observability data. In a typical production environment, the number of tags that need to be automatically injected into a single piece of data can be as many as 100+. These tags put significant pressure on backend storage. DeepFlow's leading SmartEncoding mechanism innovatively solves this problem, significantly reducing performance overhead.

![SmartEncoding in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b164952a5.png)

SmartEncoding relies on the encoding and association of various tag data. First, the Agent collects string-formatted tags and aggregates them on the Server. Next, the Server encodes all the tags. After this, the SmartEncoding process for observability data includes three stages:

- Collection Stage: The Agent automatically injects VPC (Integer), IP, and PID tags into each piece of observability data.
- Storage Stage: The Server, based on the VPC, IP, and PID tags marked by the Agent, automatically injects a small number of Int-encoded meta tags into the observability data, including cloud resource attributes, K8s resource attributes, and process attributes corresponding to IP and PID.
- Query Stage: The Server automatically calculates the associations between all custom tags and meta tags. Users can directly query (filter, group) all tags on all observability data through SQL/PromQL, with an experience no different from using a BigTable.

We see that AutoTagging solves the pain point of data silos, and the SmartEncoding mechanism addresses the pain point of resource overhead. From the implementation mechanism, we can see that DeepFlow can actually support **unlimited custom tag injection**. Therefore, when using DeepFlow, we strongly recommend:

- When opening resources, inject as many custom tags as possible into cloud resources.
- When launching a business, inject as many Labels, Annotations, and Env tags as possible into K8s.
- Synchronize business tags from CMDB and continuous release systems to DeepFlow via API.

Through these methods, we can greatly avoid the cumbersome process of manually injecting tags in business code and significantly reduce backend storage pressure.

Our Benchmark of SmartEncoding shows that encoding tags can improve the write performance of meta tags by 10 times. We randomly generated a set of tags with a length of 16 characters and a cardinality of 5000. Based on this data model, we compared SmartEncoding, ClickHouse LowCard, and no encoding solutions. The test results are as follows:

| Type                  | Tag Field Type   | CPU Usage | Memory Usage | Disk Usage |
| --------------------- | ---------------- | --------- | ------------ | ---------- |
| Baseline (SmartEncoding) | Int             | 1         | 1            | 1          |
| Write-time Encoding   | LowCard(string)  | 10        | 1            | 1.5        |
| No Encoding           | string           | 5         | 1.5          | 7.5        |

For all custom tags (K8s custom Labels/Annotations/Env, cloud resource custom tags, business tags in CMDB, business tags in continuous release systems), we do not need to store them coupled with observability data. Therefore, these massive custom tags can be considered as having zero storage overhead. Additionally, since the encoded data system is significantly reduced, it also reduces disk scan volume during data queries, improving query performance.