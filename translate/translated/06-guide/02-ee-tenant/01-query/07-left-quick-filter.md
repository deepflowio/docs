---
title: Left-Side Quick Filter
permalink: /guide/ee-tenant/query/left-quick-filter/
---

> This document was translated by ChatGPT

# Left-Side Quick Filter

The left-side quick filter feature supports fast filtering of **tag** and **metric** fields. The following uses the Path Overview page as an example to demonstrate how to use the left-side filter.

![00-Left-Side Quick Filter](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb1183e5.png)

The left-side quick filter allows you to filter table data on the page by specific fields, enabling quick searches and improving query efficiency. Currently, the left-side quick filter only supports certain fields, with more fields to be gradually supported in the future.

## Usage Guide

Click the `Quick Filter` button in the upper left corner to expand a panel on the left side of the page showing the available filter fields. Hovering over a data item displays explanations for the data and option values. When the left-side quick filter is active, the query conditions in the page’s service search bar are synchronized.

![01-Usage Guide](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650a9fb139c2f.png)

- The left-side quick filter panel is open by default.
- **Operation Instructions:**
  - When hovering over a data item or checkbox, a tooltip will indicate the state after clicking at that position.
  - State descriptions:
    - **Select All**: By default, all options under each field are selected, and no filtering is applied to the page query.
    - **Select Only This Item**: Clicking the row of an option means only the current option value for that field will be used as the query condition.
    - **Deselect**: Clicking the row of an option cancels the **Select Only This Item** state and restores **Select All**.
    - **Toggle State**: Clicking the checkbox selects or deselects the option.
      - **Selected**: The checkbox is checked, meaning the option will be included in the query.
      - **Deselected**: The checkbox is unchecked, meaning the option will be excluded from the query.
    - **Clear Filter**: Clicking the clear filter icon in the upper right corner of the data panel clears the value filter for that field and restores **Select All**.