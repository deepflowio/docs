---
title: Settings
permalink: /guide/ee-tenant/configuration/settings/
---

> This document was translated by ChatGPT

# Settings

The settings module supports editing preferences, viewing platform information, and more.

## Preferences

Supports configuring the usage preferences of the search box on the page.

### Search Box Configuration

The search box configuration only applies to pages under [Events], [Applications], and [Network].

![Search Box Configuration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a4bfcef96.png)

- Follow System Settings: If selected, the configuration is consistent with the default system settings. If you want to adjust the settings yourself, uncheck it.
- **Page Initial Load**: Whether to query data when the page is first loaded
  - Do Not Trigger Search: No data on the initial page load. You need to click the [Search] button or add query conditions to display data.
  - Search by Default Conditions: `Default system setting`, data is queried and displayed when the page loads.
- **Search Trigger Method**: Set the method to trigger search queries
  - Instant Trigger: `Default system setting`, queries are triggered immediately when search conditions change.
  - Click [Search] Button to Trigger: When search conditions change, you need to click the [Search] button to trigger the query.
- **Default Search Box Form**: Set the default display form of the search box for `Path` type pages
  - Simplified Search: `Default system setting`, for details, please refer to [Resource Search Box](../query/service-search/)
  - Unidirectional Path: For details, please refer to [Path Search Box](../query/path-search/)
  - Bidirectional Path: For details, please refer to [Path Search Box](../query/path-search/)
- **Default Search Box Content**: The search box can be set to quick search mode

  - Free Search: For details, please refer to [Resource Search Box](../query/service-search/)
  - Container Search: For details, please refer to [Resource Search Box](../query/service-search/)
  - Process Search: `Default system setting`, for details, please refer to [Resource Search Box](../query/service-search/)

## Platform Information

Platform information allows you to view the current system version number, feedback email, vendor information, and more.

![Platform Information](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645829f09cbb.png)