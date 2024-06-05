---
title: Template Variables
permalink: /guide/ee-tenant/dashboard/variable-template/
---

> This document was translated by ChatGPT

# Template Variables

Template variables allow you to define a set of variables in the current dashboard and reference these variables in the search conditions of subviews. This enables you to quickly change the search conditions of subviews by simply altering the values of the variables, allowing you to view the corresponding dashboards without needing to create multiple identical visualization panels just because of different search conditions.

## Managing Template Variables

Template variables can be managed uniformly through the `Template Variable List`.

As shown in the figure below, the template variable list supports operations such as `① Add`, `② Delete`, and `③ Modify`. You can also enter any string in the `⑤ Search Bar` and adjust the column width display method in the `④ Settings`, such as evenly distributing column width or allocating column width based on content.

![00-Template Variable List](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf59d3ef4d.png)

## Creating Template Variables

When you need to build some quick search conditions for the current dashboard, you can `Create Template Variables` to achieve this. For example, when building an `Application Observability Dashboard`, you need to quickly view the dashboards of different `applications`, so you can create a `template variable` for the `application` search condition.

**Step 1**: Click the `① Settings` button on the dashboard details page and select `② Manage Template Variables`.

![01-Step 1](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf68c0b038.png)

**Step 2**: Click the `③ Create Template Variable` button in the template variable list popup.

![02-Step 2](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf70be224b.png)

**Step 3**: Create the template variable as needed. The DeepFlow platform provides three types of template variables: `Dropdown`, `Text Input`, and `Grouping`. Detailed descriptions can be found in the corresponding sections below.

![03-Step 3](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf7bb39bbe.png)

### Dropdown

Dropdown type template variables change the search conditions through a dropdown menu. Currently, this type of template variable supports the `resource` and `xx_enum` types of `Tag` in the DeepFlow platform database.

- <mark>Note</mark>: For a description of the DeepFlow platform database, see the subsequent explanation.

![04-Dropdown](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf81b3b73b.png)

- **① Query Type:** Different data transmission methods
  - Query by ID: Supports transmission of id queries
  - Query by Name: Supports transmission of string queries
- **② Value Range:** Supports setting the value range of template variables in two ways: `Static Value` and `Dynamic Value`
  - Static Value: The value range is fixed after referencing
  - Dynamic Value: Compared to static value, the value range of dynamic value can be influenced by `Static Value` or `Value Tag`. For details, please refer to the [Creation and Reference] section
  - **③ Data Source:** Determines the data table where the template variable values are located
  - **④ Value Tag:** Determines the Tag corresponding to the template variable values
  - **⑤ Value Range:** Select the corresponding value for the template variable
- **⑥ Selection Mode:** Changes the search conditions through a dropdown menu, default is single selection
  - Multi-selection: Check `Multi-selection` to switch to `Multi-selection` mode
  - Select All: Check `Select All` to include `Select All` in the options, which selects all values of the current template variable
- How to Reference: When adding query conditions in the search bar of the chart, enter the Tag, and the established template variables with the same `Tag` will appear as options in the dropdown menu. For details, please refer to the [Creation and Reference] section

#### Creation and Reference

Next, we will demonstrate how to create and reference `Static Template Variables` and `Dynamic Template Variables`, and how to link dynamic and static template variables.

- First, create a static template variable named `K8s Namespace` for `pod_ns`, with a value range of `deepflow-ebpf-istio-demo, deepflow-otel-grpc-demo, deepflow-telegraf-demo`.

![05-Create Static Template Variable](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4b0c94b.png)

- Next, create a dynamic template variable named `K8s Workload` for `pod_group`, with a value range of `pod_ns = K8s Namespace`, meaning the dropdown options for `pod_group` will change based on the selection of `pod_ns`.

![06-Create Dynamic Template Variable](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4c9cee2.png)

- Then, select the query condition `pod_group = K8s Workload` and reference the template variable in the search conditions of the chart.

![07-Template Variable Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4e0596a.png)

- Finally, you can quickly switch the referenced template variables at the top of the dashboard. Different selections for `K8s Namespace` will result in different options for `K8s Workload`.

![08-Use Template Variable](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd504e2f4.png)

![09-Switch Template Variable](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd5108331.png)

### Text Input

Text input type template variables change the search conditions by entering a string.

![10-Text Input](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716002b8.png)

Text input type template variables can be referenced by any `Tag` or `Operator` that can be directly entered. The form in which they appear in the search conditions is similar to that of `Dropdown` type template variables.

- ① Tag Reference: Supports int, int_enum, string, ip, mac types. Tags of these data types support all operators.

![11-Tag Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271402080.png)

- ② Operator Reference: Supports :, !:, =~, !~ types. These types support all Tag types.

![12-Operator Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716add4e.png)

### Grouping

Grouping type template variables change the grouping through a dropdown menu. For example, when you need to drill down data layer by layer from `K8s Cluster` -> `K8s Namespace` -> `K8s Container Service` -> `K8s Workload` -> `K8s Container POD`, you can create this type of template variable.

![13-Grouping](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650827184c5b7.png)

- Value Range: Currently, all `Tags` in the DeepFlow platform database can be used as values for this type of template variable.
  - ①: Determine the data table where the template variable values are located
  - ②: Select the corresponding value for the template variable
- Selection Mode: For detailed description, see the <mark>Dropdown</mark> type template variable description
  - <mark>Note</mark>: Main groups cannot reference template variables in `Multi-selection` or `Select All` mode

Grouping type template variables can only be referenced by groupings in search conditions. They appear as options in the grouping dropdown menu.

![14-Grouping Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082715de5ff.png)
