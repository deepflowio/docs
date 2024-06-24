---
title: Service Topology
permalink: /guide/ee-tenant/universal-map/service-map/
---

> This document was translated by ChatGPT

# Service Topology

Displays the `services` defined by the user in `Business Definition` in a waterfall topology format.

![01-Service Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a9bb16811.png)

- **① Business Switch Dropdown**: Quickly switch businesses, defaults to the first starred business
- **② Service Management**: Click the button to enter the business details page
- **③ Modify Metrics**: Supports displaying/hiding metrics and setting primary metrics
- **④ Save**: Supports saving the `time range`, `service topology position`, and `configuration` of the service topology
- **⑤ Settings**: Supports `edit`, `view API`, `add to Dashboard`, `reset`, and other functions
  - Reset: The service topology will revert to its initial layout
- **⑥ Service Group**: Consists of `name row` + `box`, as shown in the figure, client, gcp-microservices-demo, DNS, and Redis are all independent service groups
- **⑦ Path**: Represents the actual data path from the client to the server, hover to view TIP, click to view path details through the right sliding panel, see subsequent chapters for details
- **⑧ Service**: Each block in the topology represents a service, consisting of `name row` + `metrics`, hover to view TIP, click to view service details through the right sliding panel, see subsequent chapters for details
  - Name Row: ICON represents the service type
  - Metrics: Displays metrics according to the priority of [observability points](../../../features/universal-map/auto-metrics) (s-xx > local > rest > app). When the metrics exceed the threshold, the name row and corresponding metrics will be marked in red
- **⑨ Operation Set**: Supports layout, connection, zooming, and other operations on the topology
  - Layout: Enter manual layout mode, supports dragging `services`, click the `save` button again to exit and save the layout position
  - Edit: Enter path editing mode, supports adding or deleting `paths`. Click the `edit` button again to exit the path editing mode
    - Add Path: Supports adding connections between `services/auto-grouped service groups`, converting connections to `paths`
    - Delete Path: Click the close button on the path to delete the corresponding `path`
  - Zoom In/Out: Zoom in or out of the topology
  - Scroll Wheel Zoom: When scroll wheel zoom is disabled, only the `zoom in/out` buttons can be used to control the size of the topology

## Right Sliding Panel

Clicking on `service` or `path` will enter the right sliding panel to view detailed information. The right sliding panel consists of the upper `call topology` and the lower TAB.

### Call Topology

View the client and server of the selected service through `call topology`, and also view the selected path.

![02-Call Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a9aa20975.png)

- **① Switch Group**: View the call topology by \*, auto_service, auto_instance, and [custom auto-grouping tags](../../../features/auto-tagging/custom-tags)
- **② Name**: The name of the currently clicked `service` or `path`, corresponding to the object viewed in the lower TAB.
- **③ Node**: Refer to [Traffic Topology](../dashboard/panel/topology/) introduction
- **④ Path**: Refer to [Traffic Topology](../dashboard/panel/topology/) introduction

### Knowledge Graph

![03-Knowledge Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f435c6d.png)

Refer to [Application - Right Sliding Panel - Knowledge Graph](../tracing/right-sliding-box/) introduction

### Application Performance

Use `Application Performance` to analyze whether there are application layer anomalies in the selected service or path.

![04-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f6ac6b5.png)

The TAB consists of three curve charts for throughput, latency, and anomalies, and a list of endpoints below. Clicking on a row in the endpoint list will enter the next level of the right sliding panel.

![04-1-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f764e5d.png)
![04-2-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f799476.png)

The next level of the right sliding panel can view the RED metrics and log details of a specific endpoint. When there are anomalies, `anomaly analysis` can be viewed.

### Network Performance

Use `Network Performance` to analyze whether there are application layer anomalies in the selected service or path.

![05-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9625df.png)

The TAB consists of four curve charts for throughput, latency, anomalies, and performance, and a list of service ports below. Clicking on a row in the list will enter the next level of the right sliding panel.

- Service: View data for the service `as a client` or `as a server` separately
- Path: Click on each `observability point` in the `topology analysis` to view the data of each `observability point` separately

![05-1-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9c515d.png)
![05-2-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fd02700.png)

The next level of the right sliding panel can view the RED metrics and log details of a specific service port. When there are anomalies, `anomaly analysis` can be viewed.

### Infrastructure

Use `Infrastructure` to analyze the CPU, memory, status, and other data of the infrastructure instances corresponding to the service.

![06-Infrastructure](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a9ae67608.png)

**① Switch Service:** Switch the service to view the infrastructure, the options are the services at both ends of the clicked path or the clicked service

### Events

View resource change events of `service` or `path`

![06-Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fcdb8b4.png)

Refer to [Tracing - Right Sliding Panel - Events](../tracing/right-sliding-box/) introduction