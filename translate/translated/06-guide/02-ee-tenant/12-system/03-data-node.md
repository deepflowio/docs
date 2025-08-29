---
title: Data Node
permalink: /guide/ee-tenant/system/data-node/
---

> This document was translated by ChatGPT

# Data Node

Displays the configuration information of database-related data tables used on the page in a list format.

![Data Node](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673ddda82472.png)

- **Create Data Table**: Users can create new custom data tables based on existing data sources, supporting up to 10 data tables. The creation information is roughly as follows:
  - Name: Supports Chinese, English, numbers, and underscores, with a maximum length of 10 characters
  - Data Table Set: Supports user-created data table sets, in the format of database.data_table_set
    - Options: flow_metrics.vtap_flow*, flow_metrics.vtap_app*
  - Original Time Granularity: The original time granularity of the `data table set`. The system currently supports 1m (one minute) and 1s (one second) by default
  - Time Granularity: The data table will be aggregated and calculated based on the selected time granularity
    - Options: 1h (one hour), 1d (one day)
  - Retention Period: Set the data retention time
  - Additive Metric Aggregation: If the original data table uses sum, only sum can be selected; if the original data table uses max/min, only max/min can be selected
  - Non-additive Metric Aggregation: todo
- **Edit**: Supports modifying the retention period of the data table
- **Delete**: Only supports deleting user-defined new data sources
- **Note**:
  - The system has 15 default basic data tables, which cannot be deleted
  - For metric-type (flow*metrics*_) and log-type (flow*log*_) data tables, minute-granularity data is retained for 1 week by default, and second-granularity data is retained for 1 day by default. Expired data is automatically deleted, and users can set an appropriate retention period accordingly
  - PCAP data is retained for 1 week by default. Data older than 1 week will be automatically deleted, and users can set an appropriate retention period accordingly
  - Monitoring data in the system is retained for 1 week by default. Data older than 1 week will be automatically deleted, and users can set an appropriate retention period accordingly