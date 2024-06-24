---
title: Left Quick Filter
permalink: /guide/ee-tenant/query/left-quick-filter/
---

> This document was translated by ChatGPT

# Left Quick Filter

The left quick filter feature supports quick filtering of tag and metric fields. Let's take the Path Overview page as an example to demonstrate how to use the left filter.

![00-Left Quick Filter](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb1183e5.png)

The left quick filter supports field filtering queries for the data in the table on the page, making it convenient for users to quickly search the data and improve query efficiency. Currently, the left quick filter only supports filtering for some fields, and other fields will be gradually opened in the future.

## Usage Introduction

Click the `Quick Filter Button` at the top left, and the panel on the left side of the page will expand to display the fields that can be filtered. When the mouse hovers over the data, you can view the explanation of the data and option values. When the left quick filter is effective, the query conditions in the page service search bar are synchronized.

![01-Usage Introduction](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb139c2f.png)

- The page opens the left quick filter panel by default
- **Operation Instructions:**
  - When the mouse hovers over the data item and the checkbox, it will prompt the state after clicking at the current position
  - State Explanation:
    - Select All: By default, all options under all fields are selected initially, and the page query does not perform any filtering
    - Select Only This Item: Clicking the row of the option indicates that only the current option value of the field is selected as the query condition
    - Deselect: Clicking the row of the option indicates canceling the `Select Only This Item` state, reverting to `Select All`
    - Toggle State: Clicking the checkbox indicates `selecting` or `deselecting` the option
      - Select: The checkbox is checked, indicating that the option is included in the query
      - Deselect: The checkbox is unchecked, indicating that the option is not included in the query
    - Clear Filter: Click the clear filter icon at the top right of the data panel to clear the value filter for that field, reverting to `Select All`