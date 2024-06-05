---
title: Service Topology
permalink: /guide/ee-tenant/universal-map/service-map/
---

> This document was translated by ChatGPT

# Service Topology

Displays the `services` defined by the user in `Business Definition` in a waterfall topology format.

![01-Service Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a9bb16811.png)

- **① Business Switch Dropdown**: Quickly switch businesses, defaulting to the first starred business.
- **② Service Management**: Click the button to enter the business details page.
- **③ Modify Metrics**: Supports displaying/hiding metrics and setting primary metrics.
- **④ Save**: Supports saving the `time range`, `service topology position`, and `configuration` of the service topology.
- **⑤ Settings**: Supports functions such as `Edit`, `View API`, `Add to Dashboard`, `Reset`, etc.
  - Reset: The service topology will revert to its initial layout.
- **⑥ Service Group**: Consists of `name row` + `box`, such as client, gcp-microservices-demo, DNS, and Redis in the figure, all of which are independent service groups.
- **⑦ Path**: Represents the actual data path from the client to the server. Hover to view the TIP, click to view path details through the right sliding panel, as explained in subsequent sections.
- **⑧ Service**: Each block in the topology represents a service, consisting of `name row` + `metrics`. Hover to view the TIP, click to view service details through the right sliding panel, as explained in subsequent sections.
  - Name Row: ICON represents the service type.
  - Metrics: Displays metrics according to the priority of [observation points](../../../features/universal-map/auto-metrics) (s-xx > local > rest > app). When metrics exceed the threshold, the name row and corresponding metrics will be marked in red.
- **⑨ Operation Set**: Supports operations such as layout, connection, zooming, etc., on the topology.
  - Layout: Enter manual layout mode, supports dragging `services`, click the `Save` button again to exit and save the layout position.
  - Edit: Enter path editing mode, supports adding or deleting `paths`. Click the `Edit` button again to exit the path editing mode.
    - Add Path: Supports adding connections between `services/auto-grouped service groups`, converting connections to `paths`.
    - Delete Path: Click the close button on the path to delete the corresponding `path`.
  - Zoom In/Out: Zoom in or out of the topology.
  - Scroll Wheel Zoom: When scroll wheel zoom is disabled, only the `Zoom In/Out` buttons can control the topology size.

## Right Sliding Panel

Clicking on `service` or `path` will enter the right sliding panel to view detailed information. The right sliding panel consists of the upper `call topology` and the lower TAB.

### Call Topology

View the client and server of the selected service through `call topology`, and also view the selected path.

![02-Call Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a9aa20975.png)

- **① Switch Group**: View the call topology by dimensions such as \*, auto_service, auto_instance, and [custom auto-grouping tags](../../../features/auto-tagging/custom-tags).
- **② Name**: The name of the currently clicked `service` or `path`, corresponding to the object viewed in the lower TAB.
- **③ Node**: Refer to [Traffic Topology](../dashboard/panel/topology/) introduction.
- **④ Path**: Refer to [Traffic Topology](../dashboard/panel/topology/) introduction.

### Knowledge Graph

![03-Knowledge Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f435c6d.png)

Refer to [Application-Right Sliding Box-Knowledge Graph](../application/right-sliding-box/) introduction.

### Application Performance

Use `Application Performance` to analyze whether there are application layer anomalies in the selected service or path.

![04-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f6ac6b5.png)

The TAB consists of three curve charts for throughput, latency, and anomalies, and an endpoint list below. Clicking on a row in the endpoint list will enter the next level of the right sliding panel.

![04-1-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f764e5d.png)
![04-2-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f799476.png)

The next level of the right sliding panel can view the RED metrics and log details of a specific endpoint. When there are anomalies, `anomaly analysis` can be viewed.

### Network Performance

Use `Network Performance` to analyze whether there are application layer anomalies in the selected service or path.

![05-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9625df.png)

The TAB consists of four curve charts for throughput, latency, anomalies, and performance, and a service port list below. Clicking on a row in the list will enter the next level of the right sliding panel.

- Service: View data for the service `as a client` or `as a server` separately.
- Path: Click on each `observation point` on the `path topology` to view the data for each `observation point` separately.

![05-1-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9c515d.png)
![05-2-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fd02700.png)

The next level of the right sliding panel can view the RED metrics and log details of a specific service port. When there are anomalies, `anomaly analysis` can be viewed.

### Infrastructure

Use `Infrastructure` to analyze the CPU, memory, status, and other data of the infrastructure instances corresponding to the service.

![06-Infrastructure](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645a9ae67608.png)

**① Switch Service:** Switch the service to view the infrastructure. The candidates are the services at both ends of the clicked path or the clicked service.

### Events

View resource change events of `service` or `path`.

![06-Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fcdb8b4.png)

Refer to [Application-Right Sliding Box-Events](../application/right-sliding-box/) introduction.
