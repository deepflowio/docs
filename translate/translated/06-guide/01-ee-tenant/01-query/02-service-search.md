---
title: Resource Search Box
permalink: /guide/ee-tenant/query/service-search/
---

> This document was translated by ChatGPT

# Resource Search Box

The `Resource Search Box` is used in Application-Resource Analysis, Network-Resource Analysis, and Network-Resource Inventory.

![01-资源搜索框](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664ac73e1e086.png)

- **① Search Snapshot**: Refer to the [Search Snapshot](./history/) section for details.
- **② Search Input Form**: You can switch the form of search input. Currently, there are Free Search, Container Search, and Process Search. See the following sections for details.

## Free Search

![02-自由搜索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405156644260e09259.png)

- **① Search Condition Input Box**: Supports both Chinese and English associative input, and supports Tags in the data table as search conditions.
- **② Clear Search Conditions**: Clears the `Search Condition Input Box`.
- **③ Switch Main Group**: Resource grouping, corresponding to `Resource` in the functional interface.
- **④ Switch Subgroup**: Other groupings, corresponding to `Group Attributes` in the functional interface.

In the `Search Condition Input Box`, each complete search condition is called a `Search Tag`. The following explains how to manage `Search Tags`.

![03-搜索标签](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa57a56f.png)

![04-操作符](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa702aed.png)

![05-候选项](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c50ecc63c1.png)

- **① Tag Name**: Supports querying Tags in the data table. For detailed descriptions, see `Database Fields`.
  - Supports both Chinese and English associative input.
  - Hover over the Tag Name to view detailed information.
  - Semantics: Different Tags are connected using `and`, while the same Tag uses different logical operators based on the `operator`.
    - a: `=` , `:` , `~` are connected using `or`.
    - b: `!=` , `!:` , `!~` are connected using `and`.
    - c: `>=` , `<=` , `>` , `<` are connected using `and`.
    - After connecting a/b/c, they are further connected using `and`. For example: `Search Condition Input Box: server_port > 20, server_port < 80, server_port != 44, server_port != 45`, the effective condition is `(server_port > 20 and server_port < 80) and (server_port != 44 and server_port != 45)`.
- **② Operator**: Currently supports exact match, fuzzy match, and regex match.
  - Exact Match: Corresponds to `=` , `!=` , `>=` , `<=` operators. For `resource type` Tags, it matches by resource ID; for others, it matches by actual input.
  - Fuzzy Match: Corresponds to `:` , `!:` operators. String matching supports `*` wildcard. For example, `*123*` matches all strings that <mark>contain</mark> `123`, while `123` matches strings that <mark>exactly equal</mark> `123`.
  - Regex Match: Corresponds to `~` , `!~` operators. String regex matching.
- **③ Tag Value**: Filter or directly input the value to be filtered.
  - NULL: Null value, generally used with `!=` to filter `all`.
  - **⑦ Table Filter**: When there are duplicate names in the candidate options or multiple selections are needed, use `Table Filter` for precise resources.
- **④ Disable**: Disable the search condition corresponding to the current `Search Tag`.
- **⑤ Modify**: Modify the search condition corresponding to the current `Search Tag`.
- **⑥ Delete**: Delete the current `Search Tag`.

## Container Search

The container search form fixes commonly used resource Tags in container scenarios as dropdown forms for quick filtering of container resources.

![06-容器搜索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664425a2b3c16.png)

- **① Container Resource Dropdown**: Click the dropdown to quickly select the container resources to be filtered. The options in the dropdown can be linked with the previous selections.
- **② Search Condition Input Box**: See the description in the `Free Search` section above.
- **③ Collapse Search Condition Input Box**: Click to quickly collapse the `Search Condition Input Box`.
- **④ Switch Group**: Quickly switch container resource Tags.

## Process Search

The process search form is similar to the container search, mainly fixing commonly used process-related Tags as dropdown forms for quick filtering of process resources.

![07-进程搜索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664426411eea4.png)

# Application Scenarios

## View Service Performance of a Workload

- Functional Page: Application-Metrics
- Search Tag: pod_ns = gcp-microservices-demo
- Main Group: auto_service
- Subgroup: --

![05-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa039078.png)

## View Performance of a Specific Workload in a Namespace

- Functional Page: Application-Metrics
- Search Tag: pod_ns = gcp-microservices-demo, pod_group : loadgenerator
- Main Group: auto_service
- Subgroup: --

![06-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa17b7c6.png)

## View Top 5 Cloud Servers by Traffic

- Functional Page: Network-Service
- Search Tag: None
- Main Group: chost
- Subgroup: --

![07-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2642e9.png)

## View Top 5 Server Ports by Traffic on a Cloud Server

- Functional Page: Network-Service
- Search Tag: role = server
- Main Group: chost
- Subgroup: server_port

![08-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2adfda.png)

## View Network Performance of a Specific Port on a Cloud Server

- Functional Page: Network-Service
- Search Tag: role = server, chost = cn-chengdu.172.16.0.196, server_port = 22
- Main Group: chost
- Subgroup: server_port

![09-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa44b491.png)