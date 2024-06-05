---
title: Edit Right Slide Box
permalink: /guide/ee-tenant/dashboard/right-slide-box/
---

> This document was translated by ChatGPT

# Edit Right Slide Box

The right slide box of the dashboard chart can be edited as needed. You can customize the addition and deletion of `system panels` and `dashboard panels`. The edited panels are saved and remembered for each chart in the dashboard.

- System Panels: Predefined panels by the DeepFlow system. For details, refer to [Application - Right Slide Box](/guide/ee-tenant/application/right-sliding-box/)
- Dashboard Panels: Panels that users customize and add in the `dashboard`

![Right Slide Box Panels](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240516664579a8512bb.png)

- **① Right Slide Box Panels:** The display position of the panels, by default, shows all `system panels`
- **② Panel Management:** You can `sort`, `delete`, and `edit` dashboard panels
- **③ Add Panel:** See the following sections for details

## Add Panel

You can add `system panels` and `dashboard panels`

### Add System Panel

![Add System Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240516664579b508cbe.png)

**① Select Panel:** Quickly add or remove a system panel by clicking the checkbox.

### Add Dashboard Panel

![Add Dashboard Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240516664579aab5031.png)

- **① Dashboard Name:** Select the name of the dashboard to be added to the right slide box panel. Duplicate additions are not allowed. Once the dashboard panel is successfully added, it is loaded in the right slide box in `read-only` mode.
- **Associated Conditions:** Set the values read by the template variables when the dashboard is loaded in the right slide box
  - **② Template Variables:** Template variables in the dashboard
  - **③ Template Variable Values:** Set the values for the template variables, which can be:
    - Default Variable Value: When the dashboard loads, it reads the default value set for the template variable in the dashboard
    - $Tag: When the dashboard loads, it reads the value of the corresponding Tag from the search conditions when entering the right slide box. For example, if the search condition data carries `protocol = tcp` when entering the right slide box, the `protocol` template variable will be set to `tcp` when the page loads
