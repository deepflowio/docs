---
title: Service Search Box
permalink: /guide/ee-tenant/query/service-search/
---

> This document was translated by GPT-4

# Service Search Box

The `Service Search Box` is used in the Application-Metric Statistics, Network-Service Statistics, and Network-Resource Inventory.

![1-Service Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa530137.png)

- **① Search condition input box**: Supports Chinese and English predictive typing, supports Tags in the data table as search conditions
- **② Switch main group**: Resource grouping, corresponds to the `resource` in the function interface
- **③ Switch sub-group**: Other groups, corresponds to the `group attribute` in the function interface
- **④ Clear search conditions**: Clear the `search condition input box` and the `main and sub-group` returns to default values
- **⑤ Save search conditions**: Save the search conditions entered on the current interface

Each complete search condition in the `Search condition input box` is referred to as a `search tag`. The management of `search tags` is explained in detail below.

![2-Search Tags](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa57a56f.png)

![3-Operator](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa702aed.png)

![4-Candidates](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa702aed.png)

- **① Tag Name**: Supports searching for tags in the data table, details can be viewed in `database field`
  - Supports English and Chinese predictive typing
  - Hover the mouse over the tag name to view its details
  - Semantics: Different tags are connected with "and", the same tags depending on the `operator` will use different logical operators.
    - a: `=`, `:`, `~` are connected with "or"
    - b: `!=`, `:!`, `!~` are connected with "and"
    - c: `>=`, `<=`, `>`, `<` are connected with "and"
    - a/b/c are connected with "and". For example: `search condition input box: server_port > 20, server_port < 80, server_port != 44, server_port != 45`, the effective condition is `(server_port > 20 and server_port < 80) and (server_port != 44 and server_port != 45)`
- **② Operator**: Currently supports exact match, fuzzy match, and regular match
  - Exact match: Corresponding to `=`, `!=`, `>=`, `<=` operator, `resource types` of tags are exact matched according to the resource ID, others are exact matched according to the actual input
  - Fuzzy match: Corresponding to `:`, `:!` operator, string matching, supports `*` wildcard. For example, `*123*` matches all strings that <mark>includes</mark>`123`, while `123` only matches strings that are <mark>exactly equalto</mark>`123`
  - Regular match: Corresponding to `~`, `!~` operator, string regular match
- **③ Tag Value**: Filter or directly input the value needed to be filtered
  - NULL: Null value, generally combined with `!=` is used, the semantics of filtering `all`
  - ⑦ Table Filter: When filter candidates appear duplicated situation or need to select more, they can use `table filter` to locate resources precisely
- **④ Disable**: Disable the search condition for the current `search tag`
- **⑤ Modify**: Modify the search condition for the current `search tag`
- **⑥ Delete**: Delete the current `search tag`

# Application Scenarios

## View the service performance of a workload

- Function page: Application-Metrics
- Search Tags: pod_ns = gcp-microservices-demo
- Main Group: auto_service
- Subgroup: --

![5-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa039078.png)

## View the performance of a workload in a namespace

- Function page: Application-Metrics
- Search Tags: pod_ns = gcp-microservices-demo, pod_group : loadgenerator
- Main Group: auto_service
- Subgroup: --

![6-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa17b7c6.png)

## View the TOP 5 cloud servers in traffic

- Function page: Network-Services
- Search Tags: none
- Main Group: chost
- Sub-Group: --

![7-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2642e9.png)

## View the TOP 5 service ports of a cloud server in terms of traffic

- Function page: Network-Services
- Search Tags: role = server
- Main Group: chost
- Sub-Group: server_port

![8-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2adfda.png)

## View the network performance of a specific port on a cloud server

- Function page: Network-Services
- Search Tags: role = server, chost = cn-chengdu.172.16.0.196, server_port = 22
- Main Group: chost
- Sub-Group: server_port

![9-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa44b491.png)
