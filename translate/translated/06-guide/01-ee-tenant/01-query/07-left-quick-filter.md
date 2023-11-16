---
title: Left Side Quick Filter
permalink: /guide/ee-tenant/query/left-quick-filter/
---

> This document was translated by GPT-4

# Left Side Quick Filter

The left side quick filter feature supports fast filtering and selection for 'tag' and 'metric' fields. The following instructions will use the path overview page as an example to illustrate how to use the left filter.

![7_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb1183e5.png)

The left quick filter supports field filtering queries for the data in the page table, allowing users to quickly search through the data and improve query efficiency. Currently, the left quick filter only supports filtering on some fields, and support for other fields will be gradually added in the future.

## Usage Guide

Click on the `Quick Filter Button` at the top left of the page, the panel on the left will show the fields that can be filtered. When the mouse is placed on the data, you can see the explanation of the data and the option values. When the left quick filter is in effect, the service search bar on the page also synchronizes the query conditions.

![7_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb139c2f.png)

- The left quick filter panel is open by default when the page is loaded.
- **Operation Instructions:**
  - When the mouse is on the data item and the checkbox, it will prompt the status after clicking at the current position.
  - Status Description:
    - Select all: By default, all options under all fields are checked. At this time, the page query does not perform query filtering.
    - Select this item only: Clicking the row where the option is located means that only the current option value is selected as the query condition.
    - Deselect: Click on the row where the option is located, indicating to cancel the 'only select this item' state and restore the 'select all' state.
    - Switch Status: Click on the checkbox, indicating to 'select' or 'deselect' this option.
      - Select: The checkbox is checked, indicating to query this option.
      - Deselect: Deselect the checkbox, indicating not to query this option.
    - Clear filter: Click on the clear filter icon in the upper right corner of the data board to clear the value filter of this field and restore the 'select all' state.
