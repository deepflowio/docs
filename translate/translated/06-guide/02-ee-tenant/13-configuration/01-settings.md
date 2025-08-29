---
title: Settings
permalink: /guide/ee-tenant/configuration/settings/
---

> This document was translated by ChatGPT

# Settings

The Settings module supports editing preferences, viewing platform information, and more.

## Preferences

Supports configuring usage preferences for the search box on pages.

### Search Box Configuration

The search box configuration only applies to pages under **Events**, **Applications**, and **Network**.

![Search Box Configuration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a4bfcef96.png)

- Follow system settings: When selected, the configuration is consistent with the default system settings. To adjust settings manually, simply uncheck this option.
- **Page initial load**: Whether to query data when the page is loaded for the first time.
  - Do not trigger search: No data is displayed when the page first loads. You need to click the **Search** button or add query conditions to display data.
  - Search with default conditions: `Default system setting`. When the page loads, data is queried and displayed simultaneously.
- **Search trigger method**: Set how search queries are triggered.
  - Trigger instantly: `Default system setting`. When search conditions change, the query is triggered immediately.
  - Trigger by clicking the **Search** button: When search conditions change, you need to click the **Search** button to trigger the query.
- **Default search box type**: For `Path`-type pages, set the default display form of the search box.
  - Simplified search: `Default system setting`. For details, see **[Resource Search Box](../query/service-search/)**.
  - One-way path: For details, see **[Path Search Box](../query/path-search/)**.
  - Two-way path: For details, see **[Path Search Box](../query/path-search/)**.
- **Default search box content**: The search box can be set to quick search mode.

  - Free search: For details, see **[Resource Search Box](../query/service-search/)**.
  - Container search: For details, see **[Resource Search Box](../query/service-search/)**.
  - Process search: `Default system setting`. For details, see **[Resource Search Box](../query/service-search/)**.

## Platform Information

Platform information allows you to view the current system version number, feedback email, vendor information, and more.

![Platform Information](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645829f09cbb.png)