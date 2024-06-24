---
title: Search Snapshots
permalink: /guide/ee-tenant/query/history/
---

> This document was translated by ChatGPT

# Search Snapshots

The search snapshot feature records the user's past search-related information. It helps you record the current page's query conditions, query time, and chart configuration settings. It also supports quickly selecting search snapshots from a dropdown menu to apply to the page, sharing search snapshots, setting default load pages, and other functions.

Next, we will introduce how to use the search snapshot feature.

## Basic Introduction

![00-Basic Introduction](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d6263c60c9.png)

- **① Search Snapshot Dropdown:** Displays all saved search conditions for the current page in a dropdown menu and supports managing search snapshots. For detailed usage, please refer to [Search Snapshot Dropdown].
- **② Save Search Conditions:** Click to save the current page's search conditions, time, and other information. For detailed usage, please refer to [Save Search Conditions].

## Search Snapshot Dropdown

![01-Dropdown](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d626419381.png)

The search snapshot bar consists of a search bar, dropdown menu, and description box.

- Search Bar: Allows querying the name of the search snapshot, supporting both Chinese and English suggestions.
  - Click the search bar to pop up the dropdown menu, displaying the saved search snapshots for the current page.
- Dropdown Menu: Displays the search condition records saved by the user on the current page and the search conditions shared by other users.
  - Also supports starring, modifying, and other operations on search snapshots. For detailed usage, please refer to the [Manage Search Snapshots] section.
- Description Box: When the mouse hovers over a search snapshot, the description box displays related information.
  - Shows the search snapshot's name, description, search count, permissions, source account, creation time, etc.

## Save Search Conditions

![02-Save Search Conditions](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d6264dba0a.png)

Users can save the search conditions on the current page. Click the `Save` icon to edit the name and description of the save. It also supports remembering the search time range and the configuration of the Panel.

## Manage Search Snapshots

![03-Manage Search Snapshots](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230922650d6265ca207.png)

- **① Star:** Mark the search snapshot as important, displaying it first in the dropdown menu and table to help users find the search snapshot more quickly.
  - Click again to unstar.
- **② Edit:** Modify the `name` or `description` of the search snapshot.
- **③ Share:** Share the search snapshot with one or more specified users, with options to assign `read-only` or `read-write` permissions, and display the share count.
- **④ Query:** Open the search snapshot conditions in a new page and display the query count of the search snapshot.
- **⑤ Set Default Load Page:** Click the icon to set the search snapshot conditions as the default load page for the current page.
  - Once set successfully, the icon will be highlighted, and the setting will take effect when re-entering from other pages.
- **⑥ Delete:** Delete the search snapshot.