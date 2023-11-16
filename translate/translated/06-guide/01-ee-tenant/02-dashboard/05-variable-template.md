---
title: Template Variables
permalink: /guide/ee-tenant/dashboard/variable-template/
---

> This document was translated by GPT-4

# Template Variables

Template variables allow you to define a set of variables in the current view and reference these variables in the search criteria of the subviews. By changing the variable's value in one view, the corresponding view can be quickly changed without having to construct multiple identical visualization panels due to different search conditions.

## Managing Template Variables

You can manage template variables via the `Template Variable List`.

As displayed below, in the template variable list, operations such as `① Adding`, `② Deleting`, `③ Modifying` are supported. You can also input any string in the `⑤ Search bar` and adjust the display mode of the `④ Setting` column width, like distributing column width evenly or basing on the content.

![5_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271003b1f.png)

## Creating Template Variables

When you need to set up some quick search conditions for the current view, you can `Create template variables`. For instance, when constructing an `Application Observability View`, if you need to quickly check the views of different `Applications`, you can establish a `Template Variable` for the search condition of `Application`.

**Step One**: Click the `① Settings` button on the view details page and select `② Manage template variables`.

![5_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082710acc0d.png)

**Step Two**: Click the `③ Create template variable` button in the template variable list pop-up box.

![5_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508281781e9e.png)

**Step Three**: Create a template variable according to your needs. The DeepFlow platform offers three types of template variables, namely `Dropdown Selection`, `Text Input`, and `Grouping`. Detailed descriptions will follow in the subsequent sections.

![5_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508270fc440b.png)

### Dropdown Selection

The dropdown selection type of template variables changes search conditions through the dropdown box switch. It currently supports constructing this type of template variable for the DeepFlow platform's database `resource` and `xx_enum` type `Tag`.

- <mark>Note</mark>: For DeepFlow platform database description, please see the following explanation.

![5_5.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650827189345b.png)

- Value Range: Select the value range of the template variable.
  - ① Transmission Mode: Different data have different transmission methods.
    - Only transmit value: Support id query transmission.
    - Transmit label: Support string query transmission.
  - ② Value Range: Determine the database of the template variable value.
    - ③: Determine the corresponding Tag of the template variable value.
    - ④: Choose the corresponding value of the template variable.
- Selection Mode: Change the search condition by switching through the dropdown box, the default is single selection.
  - ⑤: Check `Multiple Selections`, then switch to `Multiple Selections` mode.
  - ⑤: Check `Select All`, then the option `Select All` will appear in the candidate list, which means to select all values of the current template variable.

The dropdown selection type of template variables can only be referenced by `Tags` with the same `name` and `type`. For example, if the value is derived from the `Tag` named `chost` in the `flow_metrics.vtap_flow_port` data table, it can only be referenced by `chost` when cited. The template variable will appear in the search condition as a dropdown list candidate, and if you choose the template variable, you have successfully referenced the template variable.

![5_6.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082713aca9a.png)

![5_7.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082ac9cb794.png)

### Text Input

The text input type of template variables changes search conditions by inputting the string.

![5_8.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716002b8.png)

The text input type of template variables supports any directly input `Tag` or `Operator` reference. The appearance in the search condition is similar to the `Dropdown selection` type of template variables.

- ① Tag Reference: Supports types such as int, int_enum, string, ip, mac. All these data types' Tags support all operators.

![5_9.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271402080.png)

- ② Operator Reference: Supports :, !:, =~, !~ types. All these types support all kinds of Tags.

![5_10.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716add4e.png)

### Grouping

The grouping type of template variables changes groups by switching through the dropdown box. For instance, when you need to delve into the data from `K8s Cluster` -> `K8s Namespace` -> `K8s Container Service` -> `K8s Workload` -> `K8s Container POD`, you could construct this template variable.

![5_11.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650827184c5b7.png)

- Value Range: Currently, all `Tags` in the DeepFlow platform database can be used as the value for this type of template variable.
  - ①: Determine the database of the template variable value.
  - ②: Choose the corresponding value of the template variable.
- Selection Mode: For detailed descriptions, see <mark>Dropdown Selection</mark>'s template variable description.
- <mark>Note</mark>: The main group cannot reference template variables in the `Multiple Selections` or `Select All` mode.

The grouping type of template variables can only be referenced by the groups in search conditions. It appears as a candidate in the group dropdown list.

![5_12.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082715de5ff.png)

## Operating Template Variables

Once the template variable is successfully referenced, you can change the value of the template variable at the top of the view to quickly switch data of the view.

![5_13.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082719abddf.png)
