---
title: Data Node
permalink: /guide/ee-tenant/system/data-node/
---

> This document was translated by ChatGPT

# Data Node

This section presents the configuration information of database-related data tables used on the page in a list format.

![Data Node](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673ddda82472.png)

- **Create New Data Table**: Users can customize new data tables based on existing data sources, supporting up to 10 data tables. The creation information is roughly as follows:
  - Name: Supports Chinese, English, numbers, and underscores, with a maximum length of 10 characters.
  - Data Table Collection: Supports user-created data table collections, presented as database.data_table_collection.
    - Options: flow_metrics.vtap_flow*, flow_metrics.vtap_app*
  - Original Time Granularity: The original time granularity of the `data table collection`. The system currently supports 1m (one minute) and 1s (one second) by default.
  - Time Granularity: The data table will perform aggregation calculations based on the selected time granularity.
    - Options: 1h (one hour), 1d (one day)
  - Retention Period: Set the data retention period.
  - Additive Metric Aggregation: If the original data table uses sum, only sum can be selected; if the original data table uses max/min, only max/min can be selected.
  - Non-Additive Metric Aggregation: todo
- **Edit**: Supports modifying the retention period of the data table.
- **Delete**: Only supports deleting user-defined new data sources.
- **Note**:
  - The system has 15 default basic data tables, none of which can be deleted.
  - Metric data tables (flow*metrics*_) and log data tables (flow*log*_) have a default retention period of 1 week for minute-granularity data and 1 day for second-granularity data. Expired data is automatically deleted. Users can set an appropriate retention period based on this.
  - PCAP data is retained for 1 week by default. Data older than 1 week is automatically deleted. Users can set an appropriate retention period based on this.
  - Monitoring data in the system is retained for 1 week by default. Data older than 1 week is automatically deleted. Users can set an appropriate retention period based on this.