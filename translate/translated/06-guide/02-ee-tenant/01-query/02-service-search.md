---
title: Resource Search Box
permalink: /guide/ee-tenant/query/service-search/
---

> This document was translated by ChatGPT

# Resource Search Box

The `Resource Search Box` is used in Application - Resource Analysis, Network - Resource Analysis, and Network - Resource Inventory.

![01-Resource Search Box](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664ac73e1e086.png)

- **① Search Snapshot**: Refer to the [Search Snapshot](./history/) section for details  
- **② Search Input Mode**: Allows switching between different search input modes, currently including Free Search, Container Search, and Process Search. See the following sections for details.

## Free Search

![02-Free Search](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405156644260e09259.png)

- **① Search Condition Input Box**: Supports Chinese and English auto-completion, and supports using Tags from the data table as search conditions  
- **② Clear Search Conditions**: Clears the `Search Condition Input Box`  
- **③ Switch Primary Group**: Resource grouping, corresponding to `Resource` in the feature interface  
- **④ Switch Secondary Group**: Other groupings, corresponding to `Group Attributes` in the feature interface  

In the `Search Condition Input Box`, each complete search condition is called a `Search Tag`. The following explains in detail how to manage `Search Tags`.

![03-Search Tag](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa57a56f.png)

![04-Operators](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa702aed.png)

![05-Candidates](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c50ecc63c1.png)

- **① Tag Name**: Supports querying Tags in the data table. For detailed descriptions, see `Database Fields`  
  - Supports Chinese and English auto-completion  
  - Hover over the Tag name to view detailed information  
  - Semantics: Different Tags are connected with `and`. The same Tag uses different logical operators depending on the `operator`:
    - a: `=` , `:` , `~` are connected with `or`
    - b: `!=` , `!:` , `!~` are connected with `and`
    - c: `>=` , `<=` , `>` , `<` are connected with `and`
    - After connecting a/b/c, they are further connected with `and`. For example:  
      `Search Condition Input Box: server_port > 20, server_port < 80, server_port != 44, server_port != 45`  
      The effective condition is `(server_port > 20 and server_port < 80) and (server_port != 44 and server_port != 45)`
- **② Operator**: Currently supports exact match, fuzzy match, and regex match  
  - Exact Match: Corresponds to `=` , `!=` , `>=` , `<=` operators. For `resource type` Tags, exact match is based on resource ID; for others, it matches exactly as entered  
  - Fuzzy Match: Corresponds to `:` , `!:` operators. String matching supports `*` wildcard. For example, `*123*` matches all strings <mark>containing</mark> `123`, while `123` matches only strings <mark>exactly equal to</mark> `123`  
  - Regex Match: Corresponds to `~` , `!~` operators. Performs string regex matching  
- **③ Tag Value**: Select or directly enter the value to filter  
  - NULL: Null value, usually used with `!=` to mean filtering out `all`  
  - **⑦ Table Filtering**: When candidate items have duplicate names or multiple selections are needed, use `Table Filtering` to precisely locate resources  
- **④ Disable**: Disables the search condition corresponding to the current `Search Tag`  
- **⑤ Edit**: Edits the search condition corresponding to the current `Search Tag`  
- **⑥ Delete**: Deletes the current `Search Tag`  

## Container Search

The container search mode fixes commonly used resource Tags in container scenarios as dropdown menus, making it easy to quickly filter container resources.

![06-Container Search](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664425a2b3c16.png)

- **① Container Resource Dropdown**: Click the dropdown to quickly select the container resource to filter. The options in the following dropdowns can be linked to the previous selection.  
- **② Search Condition Input Box**: See the `Free Search` section above for details  
- **③ Collapse Search Condition Input Box**: Click to quickly collapse the `Search Condition Input Box`  
- **④ Switch Group**: Quickly switch container resource Tags  

## Process Search

The process search mode is similar to container search, but fixes commonly used process-related Tags as dropdown menus to quickly filter process resources.

![07-Process Search](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664426411eea4.png)

# Application Scenarios

## View the service performance of a specific workload

- Feature Page: Application - Metrics  
- Search Tag: pod_ns = gcp-microservices-demo  
- Primary Group: auto_service  
- Secondary Group: --  

![05-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa039078.png)

## View the performance of a specific workload in a specific namespace

- Feature Page: Application - Metrics  
- Search Tag: pod_ns = gcp-microservices-demo, pod_group : loadgenerator  
- Primary Group: auto_service  
- Secondary Group: --  

![06-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa17b7c6.png)

## View the top 5 cloud servers by traffic

- Feature Page: Network - Services  
- Search Tag: None  
- Primary Group: chost  
- Secondary Group: --  

![07-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2642e9.png)

## View the top 5 server ports by traffic for a specific cloud server

- Feature Page: Network - Services  
- Search Tag: role = server  
- Primary Group: chost  
- Secondary Group: server_port  

![08-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2adfda.png)

## View the network performance of a specific port on a specific cloud server

- Feature Page: Network - Services  
- Search Tag: role = server, chost = cn-chengdu.172.16.0.196, server_port = 22  
- Primary Group: chost  
- Secondary Group: server_port  

![09-Query Result](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa44b491.png)