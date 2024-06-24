---
title: Resource Pool
permalink: /guide/ee-tenant/resources/resource-pool/
---

> This document was translated by ChatGPT

# Resource Pool

The resource pool in a cloud computing environment organizes and displays resource collection information at three levels: cloud platform, region, and availability zone. By organizing resource pools in the cloud environment, the cloud computing platform can better manage its internal resources, improve resource utilization and efficiency, and meet users' personalized needs.

Next, we will introduce the three organizations separately.

## Cloud Platform

The cloud platform displays the resource pools and related service information data within the cloud computing environment's cloud platform. It supports creating new cloud platforms, configuring synchronization intervals, modifications, and other functions. The page displays the data information of each added cloud platform in a table format, such as type, number of regions, number of availability zones, affiliated container clusters, resource synchronization controllers, status, and other information.

![01-云平台](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230424644643e1209c0.png)

- **① Action Buttons**:
  - Create Cloud Platform: Supports creating new cloud platforms that have been connected
  - Export CSV: Supports downloading data
  - Configure Sync Interval: Sets the cloud platform synchronization rate
  - Sync Time Statistics: Displays the synchronization time data of all added cloud platforms in a line chart
- **② Expand Row**: Click the data row header to further display detailed information of the corresponding cloud platform
- **③ Number of Regions**: Click to jump to the page to view the corresponding region information, please refer to the [Region] section
- **④ Number of Availability Zones**: Click to jump to the page to view the corresponding availability zone information, please refer to the [Availability Zone] section
- **⑤ Enable/Disable**: Enable or stop synchronizing data for the cloud platform
- **⑥ Edit**: Edit the data in this row
- **⑦ Delete**: Delete the data in this row

## Region

The region displays the geographical location of data centers within the cloud platform. It allows viewing related information of the region, such as the number of availability zones, VPCs, subnets, cloud servers, and PODs. It also supports creating new regions, modifications, and exporting data.

![02-区域](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230424644650cec4b7f.png)

- **① Action Buttons**:
  - Create Region: Supports creating new regions
  - Export CSV: Supports downloading data
- **② Number of Availability Zones**: Click to jump to the page to view the information of availability zones within the region, please refer to the [Availability Zone] section
- **③ Number of VPCs**: Click to jump to the page to view the information of VPCs within the region, please refer to the [Network Resources - VPC](./network-resources/) section
- **④ Number of Subnets**: Click to jump to the page to view the information of subnets within the region, please refer to the [Network Resources - Subnet](./network-resources/) section
- **⑤ Number of Cloud Servers**: Click to jump to the page to view the information of cloud servers within the region, please refer to the [Compute Resources - Cloud Server](./network-resources/) section
- **⑥ Number of PODs**: Click to jump to the page to view the information of container PODs within the region, please refer to the [Container Resources - Container POD](./network-resources/) section
- **⑦ Edit**: Edit the data in this row

## Availability Zone

The availability zone displays the data center information within the cloud platform, the region where the availability zone is located, the cloud platform, the number of cloud servers, and the number of PODs. It supports creating new availability zones, modifications, and exporting data.

![03-可用区](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230425644783b74e992.png)

- For page button usage, please refer to the [Region] section
