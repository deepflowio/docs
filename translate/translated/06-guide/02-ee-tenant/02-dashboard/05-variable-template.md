---
title: Template Variables
permalink: /guide/ee-tenant/dashboard/variable-template/
---

> This document was translated by ChatGPT

# Template Variables

Template variables allow you to define a set of variables in the current Dashboard, which can be referenced in chart search conditions. By quickly changing the values of these variables, you can update the search conditions of charts without having to create multiple identical visualization Panels just because the search conditions differ.

## Managing Template Variables

You can manage template variables centrally through the `Template Variable List`.

As shown below, in the template variable list, you can `① Add`, `② Delete`, and `③ Edit` variables. You can also enter any string in the `⑤ Search Bar`, and adjust the column width display in `④ Settings`, such as evenly distributing column widths or adjusting them based on content.

![00-Template Variable List](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf59d3ef4d.png)

## Creating a New Template Variable

When you need to build quick search conditions for the current Dashboard, you can create a `new template variable` to achieve this.  
For example: When building an `Application Observability Dashboard`, if you need to quickly view different `applications`, you can create a template variable for the `application` search condition.

**Step 1**: On the Dashboard details page, click the `① Settings` button and select `② Manage Template Variables`.

![01-Step 1](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf68c0b038.png)

**Step 2**: In the template variable list pop-up, click the `③ New Template Variable` button.

![02-Step 2](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf70be224b.png)

**Step 3**: Create the template variable as needed. The DeepFlow platform provides three types of template variables: `Dropdown Selection`, `Text Input`, and `Group`. Detailed descriptions are provided in the following sections.

![03-Step 3](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf7bb39bbe.png)

### Dropdown Selection

A dropdown selection type template variable changes the search condition via a dropdown menu.  
Currently, this type supports building template variables for `resource` and `xx_enum` type `Tags` in the DeepFlow platform database.

- <mark>Note</mark>: For a description of the DeepFlow platform database, see later sections.

![04-Dropdown Selection](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf81b3b73b.png)

- **① Query Type:** Different query types pass values differently  
  - Query by ID: Supports passing IDs for queries  
  - Query by Name: Supports passing strings for queries
- **② Value Range:** Supports two ways to set template variable values: `Static Values` and `Dynamic Values`  
  - Static Values: Fixed value range after being referenced  
  - Dynamic Values: Compared to static values, the range can be affected by `Static Values` or `Value Tag`. For details, see the **Creation and Reference** section  
- **③ Data Source:** Specifies the data table where the template variable values come from  
- **④ Value Tag:** Specifies the Tag corresponding to the template variable values  
- **⑤ Value Range:** Selects the values corresponding to the template variable  
- **⑥ Selection Mode:** Changes the search condition via a dropdown menu, single-select by default  
  - Multi-select: Check `Multi-select` to enable multi-selection mode  
  - Select All: Check `Select All` to add a `Select All` option in the dropdown, selecting all values for the template variable  
- How to reference: When adding a query condition in the chart search bar, enter the Tag. Any existing template variable with the same `Tag` will appear as a dropdown option. For details, see the **Creation and Reference** section.

#### Creation and Reference

The following demonstrates how to create and reference `static template variables` and `dynamic template variables`, and how to link dynamic and static template variables.

- First, create a static template variable named `K8s Namespace` with Tag `pod_ns`, and set its value range to `deepflow-ebpf-istio-demo, deepflow-otel-grpc-demo, deepflow-telegraf-demo`.

![05-Create Static Template Variable](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4b0c94b.png)

- Next, create a dynamic template variable named `K8s Workload` with Tag `pod_group`, and set its value range to `pod_ns = K8s Namespace`. This means the dropdown options for `pod_group` will change based on the selection of `pod_ns`.

![06-Create Dynamic Template Variable](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4c9cee2.png)

- Then, select the query condition `pod_group = K8s Workload` to reference the template variable in the chart search conditions.

![07-Template Variable Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4e0596a.png)

- Finally, you can quickly switch the referenced template variables at the top of the Dashboard. Different selections for `K8s Namespace` will result in different options for `K8s Workload`.

![08-Using Template Variables](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd504e2f4.png)

![09-Switch Template Variables](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd5108331.png)

### Text Input

A text input type template variable changes the search condition by entering a string.

![10-Text Input](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716002b8.png)

Text input type template variables can be referenced by any `Tag` or `operator` that allows direct input.  
In search conditions, they appear similar to `Dropdown Selection` type template variables.

- ① Tag Reference: Supports int, int_enum, string, ip, and mac types. All these Tag types support all operators.

![11-Tag Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271402080.png)

- ② Operator Reference: Supports :, !:, =~, and !~ operators. All these operators support all Tag types.

![12-Operator Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716add4e.png)

### Group

A group type template variable changes the grouping via a dropdown menu.  
For example, when drilling down into data from `K8s Cluster` -> `K8s Namespace` -> `K8s Service` -> `K8s Workload` -> `K8s POD`, you can create this type of template variable.

![13-Group](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650827184c5b7.png)

- Value Range: All `Tags` in the DeepFlow platform database can be used as values for this type of template variable  
  - ①: Specifies the data table where the template variable values come from  
  - ②: Selects the values corresponding to the template variable  
- Selection Mode: For details, see the description of the <mark>Dropdown Selection</mark> type template variable  
  - <mark>Note</mark>: The main group cannot reference template variables in `Multi-select` or `Select All` mode

Group type template variables can only be referenced in the grouping section of search conditions. They appear as dropdown options in the grouping menu.

![14-Group Reference](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082715de5ff.png)