---
title: Resource Pool
permalink: /guide/ee-tenant/resources/resource-pool/
---

> This document was translated by GPT-4

# Resource Pool

In a cloud computing environment, resource pool organizes information of resource collections on three levels - Cloud platform, region, and availability zone. By organizing cloud environment resource pools, cloud computing platforms can better manage its internal resources, improve resource usage and efficiency, and satisfy individual user needs.

Next, we'll introduce these organizational levels separately.

## Cloud Platform

Cloud platform shows the resource pool and related service information data in the cloud computing environment's platform, supporting functionalities like new cloud platform creation, configuration of synchronization interval, modification, and more. The page in the form of a table to display data information, such as types, number of regions, number of availability zones, attached container clusters, resource synchronization controllers, status, etc.

![03-resource_pool.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230424644643e1209c0.png)

- **① Operation Buttons**:
  - New Cloud Platform: Supports creating new connected cloud platforms
  - Export CSV: Supports data download
  - Configure Synchronization Interval: Set cloud platform synchronization rate
  - Synchronization Time Statistics: Display sync time data of all added cloud platforms in a line chart form
- **② Expand Row**: Click on the data row header to further detail the corresponding cloud platform data information
- **③ Number of Regions**: Click to jump to the page to view the corresponding region information, please refer to the "Region" section description
- **④ Number of Availability Zones**: Click to view the corresponding availability zone information, please refer to the "Availability Zone" section description
- **⑤ Enable/Disable**: Start or stop syncing data for this cloud platform
- **⑥ Edit**: Edit the row data
- **⑦ Delete**: Delete the row data

## Region

A region shows the geographical location of data centers in the cloud platform, which can view related information of the region, such as availability zones, VPCs, subnets, number of cloud servers, PODs, besides, it supports functions like creating new, modifying, exporting, etc.

![03-resource_pool_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230424644650cec4b7f.png)

- **① Operation Buttons**:
  - New Region: Supports creating a new region
  - Export CSV: Supports data download
- **② Number of Availability Zones**: Click to view information about the availability zones contained in the corresponding region, please refer to the "Availability Zone" section description
- **③ Number of VPCs**: Click to view information about the VPCs contained in the corresponding region, please refer to the [Network Resources - VPC](./network-resources/) section description
- **④ Number of Subnets**: Click to view information about the subnets contained in the corresponding region, please refer to the [Network Resources - Subnet](./network-resources/) section description
- **⑤ Number of Cloud Servers**: Click to view information about the cloud servers contained in the corresponding region, please refer to the [Compute Resources - Cloud Servers](./network-resources/) section description
- **⑥ Number of PODs**: Click to view information about the container PODs contained in the corresponding region, please refer to the [Container Resources - Container POD](./network-resources/) section description
- **⑦ Edit**: Edit the row data

## Availability Zone

The availability zone presents data center information within the cloud platform, such as the region and cloud platform where the availability zone resides, the number of cloud servers, number of PODs, and supports functionalities like creating new, modifying, exporting, etc.

![03-resource_pool_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230425644783b74e992.png)

- For usage of page buttons, please refer to the "Region" section description
