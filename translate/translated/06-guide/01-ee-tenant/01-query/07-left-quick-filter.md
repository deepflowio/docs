---
title: Left Quick Filter
permalink: /guide/ee-tenant/query/left-quick-filter/
---

> This document was translated by ChatGPT

# Left Quick Filter

The left quick filter feature supports quick filtering of tag and metric fields. The following example uses the Path Overview page to demonstrate how to use the left filter.

![00-左侧快速过滤](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb1183e5.png)

The left quick filter supports field filtering queries for the data in the table on the page, making it convenient for users to quickly search data and improve query efficiency. Currently, the left quick filter only supports filtering for some fields, with more fields to be gradually supported in the future.

## Usage Introduction

Click the `Quick Filter Button` at the top left, and a panel displaying filterable fields will expand on the left side of the page. Hovering over the data will show explanations of the data and option values. When the left quick filter is active, the search conditions in the page's service search bar are synchronized.

![01-使用介绍](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb139c2f.png)

- The page opens the left quick filter panel by default.
- **Operation Instructions:**
  - When the mouse is placed over a data item and checkbox, it will prompt the state after clicking at the current position.
  - State Descriptions:
    - Select All: By default, all options under all fields are selected initially, and no query filtering is performed on the page.
    - Select Only This Item: Clicking the row of an option indicates that only the current option value of the field is selected as the query condition.
    - Deselect: Clicking the row of an option indicates canceling the `Select Only This Item` state, reverting to `Select All`.
    - Toggle State: Clicking the checkbox indicates `selecting` or `deselecting` the option.
      - Select: The checkbox is checked, indicating that the option is included in the query.
      - Deselect: The checkbox is unchecked, indicating that the option is excluded from the query.
    - Clear Filter: Clicking the clear filter icon at the top right of the data panel clears the value filter for the field, reverting to `Select All`.
