---
title: Collector
permalink: /guide/ee-tenant/system/agent/
---

> This document was translated by ChatGPT

# Collector

The DeepFlow Collector is a tool used for collecting network and application performance data, supporting the parsing of various TraceID and SpanID specifications in protocols such as HTTP and Dubbo.

Next, we will introduce the collector module.

## List

The collector list displays the installation, deployment, and running status of collectors, and also supports batch operations on collectors.

![01-列表](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4a708edd.png)

- First row operation buttons:
  - Enable: Select multiple collectors to perform batch enable operations
  - Disable: Select multiple collectors to perform batch disable operations
  - Register: Select multiple collectors to perform batch registration operations
  - Add to Collector Group: Select multiple collectors to perform batch add to collector group operations
  - Export CSV: Select multiple collectors to perform batch export CSV operations
- Collector List
  - Name: Click to jump to the collector details page to view collector information
    - Basic Information: Displays the current basic information of the collector, the environment configuration of the collector, status information, and information about the running environment of the collector
    - Configuration Information: Displays detailed information about the collector group configuration corresponding to the collector
    - Monitoring Data: Displays all monitoring charts on the current collector details page
    - Running Logs: Supports viewing the running logs of non-primary region collectors in multi-region deployment scenarios. Displays all logs recorded with the collector in ES, with WARN logs marked in yellow and ERR logs marked in red
  - Group: The group to which the collector belongs. Click to jump to the [Group] page. Collectors not assigned to a group belong to the default group. Please refer to the [Group] section for details
  - Type: Displays the current running environment of the collector
    - KVM: The collector Trident process runs on the host machine (e.g., KVM)
    - Container-V/Container-P: The collector Trident runs as a DaemonSet on each container node (K8S Node)
    - ESXi: The collector Trident process runs in a dedicated virtual machine on vSphere ESXi, collecting mirror traffic from all business virtual machines on ESXi
    - Dedicated Server: The collector Trident process runs on a dedicated server, collecting mirror traffic from physical switches
    - Workload-V: The collector Trident process runs inside the business virtual machine
    - Workload-P: The collector Trident process runs inside the business bare metal server
    - Tunnel Decapsulation: The collector Rosen process runs on an independent server, used to decapsulate the tunnel of distributed traffic
  - Architecture: System information of the collector's running environment
  - Operating System: System information of the collector's running environment
  - Control IP: The IP address for communication between the collector and the controller
  - Control MAC: The MAC address for communication between the collector and the controller
  - Status: Displays the current status of the collector, including unregistered/running/disconnected/disabled
  - Exception: When there is an exception during the collector's operation, this column will display a red exclamation mark. Currently supported exception information includes
    - Self-check failed: Less than 100MB of remaining space on the log disk
    - Self-check failed: Insufficient available memory
    - Distribution circuit breaker triggered
    - Distribution traffic reached rate limit
    - Gateway ARP to distribution point not found
    - Gateway ARP to data node not found
  - Software Version: Displays the version number of the Trident/Agent software, used for troubleshooting and upgrade indications
  - Start Time: Indicates the start time of the collector process
  - Controller: Indicates the IP address of the controller from which the collector requests policies (also the destination data node IP address for sending monitoring information). Click to jump to the [Controller List] page. For details, please refer to the [Controller] section
  - Controller Sync Time: Displays the last time the collector synchronized cloud platform information with the controller
  - Data Node: Indicates the target data node to which the collector sends data. Click to jump to the [Data Node] page. For details, please refer to the [Data Node] section
  - Current Access Data Node: When the data node provides services behind SLB, this field displays the real data node IP that the collector is currently requesting
  - Data Node Communication Time: Indicates the last communication time between the collector and the data node. Note that the update of this value may have some cache-induced delay
  - Actions: Enable/Disable, Delete
    - Enable/Disable: Enable or disable the collector
    - Delete: Delete unused collectors

## Group

Displays information about collector groups in a list form, such as the number of collectors included, the number of disabled collectors, the number of unregistered collectors, etc.

![02-组](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4c187e7f.png)

- Displays the number of collectors included in the collector group, the number of disabled collectors, and the number of unregistered collectors in a list form. Click the number to enter the collection page for viewing
  - Supports creating new collection groups, registering, disabling, enabling, deleting, and other functions
- Collector Group: Groups hosts/cloud servers of the same type for unified management
  - Default: If the user does not customize a group for the collector, they are all classified into the default group
  - The default group cannot be modified or deleted, and the collector is subject to the last added group
- Note: For collector groups established by the platform, users do not have permissions for registering collectors, editing, disabling, etc.

## Configuration

Displays detailed information about collector groups in a list form, such as CPU limits, memory limits, collection packet rate limits, distribution flow rate limits, distribution circuit breaker thresholds, collection network interfaces, etc.

![03-配置](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4d1b64aa.png)

- Click the row: Further displays detailed information about the current collector group, such as resource limits, basic configuration parameters, universal map configuration parameters, packet distribution configuration parameters, basic functions, universal map function switches, packet distribution function switches, etc.

## Statistics

Displays current collector-related status data in chart form, such as total collection traffic, total distribution traffic, collector CPU usage, collector memory usage, running environment load, packet loss, cloud server collection traffic, cloud server distribution traffic, etc.

![04-统计](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202406206673d4e252f7f.png)