---
title: Business Definition
permalink: /guide/ee-tenant/universal-map/business-def/
---

> This document was translated by GPT-4

# Business Definition

Business definition includes the business name, the definition of the data table, as well as the definition of service groups, services, and paths within the business. The following describes how to define these properties.

![00-Terminology Explanation](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f64f1d682.jpg)

A business can consist of multiple `services` and `paths`. `Services` can be entirely user-defined and included in a `custom service group`; or you can only define the service group and auto-generate the `services` within the group, which are then part of an `automated service group`. The `paths` come from specifying the access relationships of the services. The following explains the above image:

- Business: Mobile Banking Business
- Services:
  - Independent services not part of any service group: Front-end load service
  - Services in custom service groups, front-end service group: Operational front-end service, Financial front-end service
  - Services generated through automated service groups, middle tier service group: Rights Center service, Search Center service, Average Center service, Payment Center service
- Paths:
  - Custom: Front-end load service -> Operational front-end service; Front-end load service -> Financial front-end service; Operational front-end service -> Middleware service group (automated); Financial front-end service -> Middleware service group (automated)
  - Auto-generated: Access relationships between services within the middleware service group (automated)

## Business List

![01- Business List](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29f899d76.png)

- **① New Business**: Supports the creation of a new business. For a detailed usage explanation, please refer to the description in the [New Business] section
- **② Name**: Clicking will take you to the `Business Details Page`
- **③ Star**: Click to `star` or `unstar`. The list will be sorted in descending order of the default star plus dictionary order by name
- **④ Service Topology**: Clicking will take you to the `Service Topology` page to view the current business in the form of a waterfall topology
- **⑤ Service List**: Clicking will take you to the `Service List` page
- **⑥ Edit**: Edit the business
- **⑦ Delete**: Delete the business

### Creating a New Business

![02-Create a New Business](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29fa54caf.png)

- Name: Required, the business name
- Data Table: Required, the data table where the business data comes from. For example, if you want to view the network indicators of the business, you can select `Network-Path-Index Data (xx)`, and if you want to view the application indicators of the business, you can select `Application-Path-Index Data (xx)`

### Business Details Page

You can access the Business Details Page by either `creating a new business` or clicking on the `business list-name`. Here, you can define the `services`, `service groups`, and `paths` for your business.

- Service Group
- Path

#### Service

![03-Service](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29f2327f0.png)

Each row represents a service in the business, such as CLB/APIGW/MySQL/Business Service, can be an independent service.

![04-New Service](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29f30aa57.png)

- Name: Required, service name must be unique within the business
- Legend: The service ICON displayed in `Service Topology` and `Service List`. Current options are `Resource-Legend`
- Filter Conditions: Define service data based on filter conditions
  - Direction: Defines filter conditions for the service in different roles
    - Bidirectional: Filter conditions when acting as both client and server
    - Server: Filter conditions when acting only as server
    - Client: Filter conditions when acting only as client
  - For operations on filter conditions, please refer to [query](../query/overview/)
    - Grouping: The default `*` is used
- Service Group: Supports adding to `custom type service group`. A `service` can only join one `service group`. For the definition of the `service group`, refer to the following sections
- Indicator Threshold: You can adjust the indicator threshold for each service
  - The indicator is retracted by default and can be unfolded and edited by clicking the unfold button
  - When the indicator quantity exceeds the threshold, the corresponding `service` display will be marked in red

#### Service Group

![05-Service Group](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29f49d073.png)

Each row represents a group of services in the business. For example, the front-end service group, which can include APP access service, Web access service. Both custom services added one by one to DeepFlow service group and services recognized automatically can form a service group.

![06-New Service Group](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29f57d791.png)

- Name: Required, service group name must be unique within the business
- Type: Divided into `auto grouping` and `custom` types
  - Custom: User-defined, can autonomously select `services` to join
  - Auto Grouping: A group of services recognized automatically through `filter conditions`, based on `auto_service` -`Direction`, `filter conditions` usage instructions, refer to [Service] section
- Indicator Threshold

#### Path

![07-Path](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29f3e2852.png)

Each row represents a path from a `service`/`service group` to another `service`/`service group`. For example, `client=serviceA, server=serviceB` expresses the path data queried from `serviceA` accessing `serviceB` according to the `client` and `server`'s `filter conditions`.

![08-New Path](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d29f6e5248.png)

- Name: Required, path name
- Client: Single choice, the candidates are user-defined `services` or `auto grouped type service groups`
- Server: Single choice, the candidates are user-defined `services` or `auto grouped type service groups`.
