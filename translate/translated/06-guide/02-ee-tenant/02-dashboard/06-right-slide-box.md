---
title: Edit Right Slide Box
permalink: /guide/ee-tenant/dashboard/right-slide-box/
---

> This document was translated by ChatGPT

# Edit Right Slide Box

The right slide box of a dashboard chart allows you to edit tabs as needed. You can customize the addition or removal of `system tabs` and `dashboard tabs`. Edited tabs will be saved in the dashboard and remembered for each chart.

- System tabs: Predefined tabs by the DeepFlow system. For details, refer to [Tracing - Right Slide Box](/guide/ee-tenant/tracing/right-sliding-box/)
- Dashboard tabs: Dashboards that users customize and add in a `dashboard`

![Right Slide Box Tabs](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240516664579a8512bb.png)

- **① Right Slide Box Tabs:** The display area for tabs, which by default shows all `system tabs`
- **② Tab Management:** Allows you to `sort`, `delete`, and `edit` dashboard tabs
- **③ Add Tab:** See the following sections for details

## Add Tab

You can add both `system tabs` and `dashboard tabs`

### Add System Tab

![Add System Tab](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240516664579b508cbe.png)

**① Select Tab:** Quickly add or remove a system tab by clicking the checkbox.

### Add Dashboard Tab

![Add Dashboard Tab](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240516664579aab5031.png)

- **① Dashboard Name:** Select the dashboard name to be added to the right slide box tabs. Duplicate additions are not allowed. Once successfully added, the dashboard tab will be loaded in the right slide box in a `read-only` mode.
- **Association Conditions:** Set the values of template variables when the dashboard is loaded in the right slide box
  - **② Template Variable:** Template variables in the dashboard
  - **③ Template Variable Value:** Set the value of the template variable, which can be one of the following:
    - Variable default value: When the dashboard loads, it reads the default value set for the template variable in the dashboard
    - $Tag: When the dashboard loads, it reads the value of the Tag corresponding to the search condition when entering the right slide box. For example, if the search condition of the clicked data when entering the right slide box carries `protocol = tcp`, then the `Protocol` template variable will be set to `tcp` when the page loads