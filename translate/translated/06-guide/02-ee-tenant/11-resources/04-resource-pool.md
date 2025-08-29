---
title: Resource Pool
permalink: /guide/ee-tenant/resources/resource-pool/
---

> This document was translated by ChatGPT

# Resource Pool

In a cloud computing environment, the resource pool organizes and displays resource collection information at three levels: cloud platform, region, and availability zone. By organizing cloud environment resource pools, a cloud computing platform can better manage its internal resources, improve resource utilization and efficiency, and meet users’ personalized needs.

The following sections introduce each of the three organizational levels.

## Cloud Platform

The cloud platform displays the resource pools and related service information data within the cloud computing environment’s cloud platform, and supports functions such as creating a new cloud platform, configuring synchronization intervals, and making modifications. The page displays the data information of each added cloud platform in a table format, such as type, number of regions, number of availability zones, affiliated container clusters, resource synchronization controllers, status, and more.

![01-Cloud Platform](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230424644643e1209c0.png)

- **① Action Buttons**:
  - Create Cloud Platform: Supports creating a new entry for an already connected cloud platform
  - Export CSV: Supports downloading the data
  - Configure Sync Interval: Sets the synchronization rate for the cloud platform
  - Sync Time Statistics: Displays synchronization time data for all added cloud platforms on the page in a line chart
- **② Expand Row**: Click the row header to display more detailed data information for the corresponding cloud platform
- **③ Number of Regions**: Click to navigate to the page showing the corresponding region information, see the **Region** section
- **④ Number of Availability Zones**: Click to navigate to the page showing the corresponding availability zone information, see the **Availability Zone** section
- **⑤ Enable/Disable**: Start or stop synchronizing data for the cloud platform
- **⑥ Edit**: Edit the data in the row
- **⑦ Delete**: Delete the data in the row

## Region

The region displays the geographical location of data centers within the cloud platform. You can view related information about the region, such as the number of availability zones, VPCs, subnets, cloud servers, and PODs. It also supports creating new entries, modifying, and exporting data.

![02-Region](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230424644650cec4b7f.png)

- **① Action Buttons**:
  - Create Region: Supports creating a new region
  - Export CSV: Supports downloading the data
- **② Number of Availability Zones**: Click to navigate to the page showing the availability zones contained in the corresponding region, see the **Availability Zone** section
- **③ Number of VPCs**: Click to navigate to the page showing the VPCs contained in the corresponding region, see **[Network Resources - VPC](./network-resources/)**
- **④ Number of Subnets**: Click to navigate to the page showing the subnets contained in the corresponding region, see **[Network Resources - Subnet](./network-resources/)**
- **⑤ Number of Cloud Servers**: Click to navigate to the page showing the cloud servers contained in the region, see **[Compute Resources - Cloud Server](./network-resources/)**
- **⑥ Number of PODs**: Click to navigate to the page showing the container PODs contained in the region, see **[Container Resources - Container POD](./network-resources/)**
- **⑦ Edit**: Edit the data in the row

## Availability Zone

The availability zone displays data center information within the cloud platform, including the region and cloud platform it belongs to, the number of cloud servers, and the number of PODs. It supports creating new entries, modifying, and exporting data.

![03-Availability Zone](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230425644783b74e992.png)

- For page button usage, see the **Region** section.