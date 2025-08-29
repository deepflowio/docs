---
title: Collector
permalink: /guide/ee-tenant/system/agent/
---

> This document was translated by ChatGPT

# Collector

The DeepFlow Collector is a tool used to collect network and application performance data. It supports parsing various TraceID and SpanID formats in protocols such as HTTP and Dubbo.

The following introduces the collector module.

## List

The collector list displays the installation, deployment, and running status of collectors, and also supports batch operations on collectors.

![01-List](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4a708edd.png)

- Top row action buttons:
  - Enable: Select multiple collectors to perform batch enable operations
  - Disable: Select multiple collectors to perform batch disable operations
  - Register: Select multiple collectors to perform batch registration operations
  - Add to Collector Group: Select multiple collectors to perform batch add-to-group operations
  - Export CSV: Select multiple collectors to perform batch export to CSV operations
- Collector list
  - Name: Click to go to the collector details page to view collector information
    - Basic Information: Displays the current basic information of the collector, its environment configuration, status information, and the environment in which it is running
    - Configuration Information: Displays detailed information about the configuration of the collector group to which the collector belongs
    - Monitoring Data: Displays all monitoring charts on the current collector details page
    - Runtime Logs: In multi-region deployment scenarios, supports viewing runtime logs of collectors in non-primary regions. Displays all logs of the collector recorded in ES, with WARN logs highlighted in yellow and ERR logs highlighted in red
  - Group: The group to which the collector belongs. Click to go to the **Group** page. Collectors without a specified group belong to the default group. Please refer to the **Group** section for details
  - Type: Displays the current running environment of the collector
    - KVM: The Trident process of the collector runs on the host machine (e.g., KVM)
    - Container-V / Container-P: The Trident process of the collector runs as a DaemonSet on each container node (K8S Node)
    - ESXi: The Trident process of the collector runs on a dedicated VM on vSphere ESXi, collecting mirrored traffic from all business VMs on ESXi
    - Dedicated Server: The Trident process of the collector runs on a dedicated server, collecting mirrored traffic from physical switches
    - Workload-V: The Trident process of the collector runs inside a business VM
    - Workload-P: The Trident process of the collector runs inside a business bare-metal server
    - Tunnel Decapsulation: The Rosen process of the collector runs on an independent server to remove tunnel encapsulation from distributed traffic
  - Architecture: System information of the collector's running environment
  - Operating System: System information of the collector's running environment
  - Control IP: The IP address used by the collector to communicate with the controller
  - Control MAC: The MAC address used by the collector to communicate with the controller
  - Status: Displays the current status of the collector, including Unregistered / Running / Disconnected / Disabled
  - Exception: Displays a red exclamation mark when there are exceptions during collector operation. Currently supported exceptions include:
    - Self-check failed: Less than 100MB of free disk space for logs
    - Self-check failed: Insufficient available memory
    - Distribution circuit breaker triggered
    - Distribution traffic reached rate limit
    - Gateway ARP to distribution point not found
    - Gateway ARP to data node not found
  - Software Version: Displays the version number of the Trident/Agent software, used for troubleshooting and upgrade guidance
  - Start Time: The time when the collector process was started
  - Controller: The IP address of the controller from which the collector requests policies (also the target data node IP address for sending monitoring information). Click to go to the **Controller List** page. For usage details, please refer to the **Controller** section
  - Controller Sync Time: The last time the collector synchronized cloud platform information with the controller
  - Data Node: The target data node to which the collector sends data. Click to go to the **Data Node** page. For usage details, please refer to the **Data Node** section
  - Current Access Data Node: When the data node is behind an SLB and serving the collector, this field displays the actual data node IP the collector is requesting
  - Data Node Communication Time: The last communication time between the collector and the data node. Note that updates to this value may be delayed due to caching
  - Actions: Enable/Disable, Delete
    - Enable/Disable: Enable or disable the collector
    - Delete: Delete unused collectors

## Group

Displays information about collector groups in list form, such as the number of collectors included, the number of disabled collectors, and the number of unregistered collectors.

![02-Group](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4c187e7f.png)

- Displays in list form the number of collectors in the group, the number of disabled collectors, and the number of unregistered collectors. Click the numbers to go to the collector page for details
  - Supports creating new collector groups, registering, disabling, enabling, and deleting
- Collector Group: Groups hosts/cloud servers of the same type together for unified management
  - Default: If the user does not assign a custom group to a collector, it is placed in the default group
  - The default group cannot be modified or deleted. The collector belongs to the last group it was added to
- Note: For collector groups created by the platform, users do not have permission to register collectors, edit, disable, etc.

## Configuration

Displays detailed information about collector groups in list form, such as CPU limits, memory limits, packet capture rate limits, distribution rate limits, distribution circuit breaker thresholds, capture interfaces, and more.

![03-Configuration](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4d1b64aa.png)

- Click a row to further display detailed information about the current collector group, such as resource limits, basic configuration parameters, universal map configuration parameters, packet distribution configuration parameters, basic functions, universal map feature switches, and packet distribution feature switches

## Statistics

Displays current collector-related status data in chart form, such as total capture traffic, total distribution traffic, collector CPU usage, collector memory usage, running environment load, packet loss count, cloud server capture traffic, and cloud server distribution traffic.

![04-Statistics](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4e252f7f.png)