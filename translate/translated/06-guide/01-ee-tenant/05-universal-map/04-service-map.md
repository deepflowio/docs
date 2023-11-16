---
title: Service Topology
permalink: /guide/ee-tenant/universal-map/service-map/
---

> This document was translated by GPT-4

# Service Topology

Displaying the `services` defined by users in `business definitions` in a waterfall topology format.

![01-Service Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fa1b279.png)

- **① Business Switch Dropdown Box**: Quick switch between businesses, default to the first starred business
- **② Service Management**: Click the button to enter the business details page
- **③ Settings**: Support `viewing APIs`, `adding to views` etc.
- **④ Legend**: Understand the semantics of the ICONs
- **⑤ Service Group**: Consist of `name row` + `box`, such as client, gcp-microservices-demo, DNS, Redis are independent service groups
- **⑥ Service**: Each block in the topology represents a service, composed of a `name row` + `metric quantity`, hover over to see the TIP, click to see the service details via the right slide box, see the following sections for explanations
  - Name Row: The ICON expresses the service type
  - Metric Quantity: Only the metric quantity showing the service as the server is displayed. When the metric quantity exceeds the threshold, both the name row and its corresponding metric quantity will be marked in red
- **⑦ Path**: Represents the actual data path for the client visiting the server, hover over to see the TIP, click to see the path details via the right slide box, see the following sections for explanations

## Right Slide Box

Click on `Service` or `Path` to enter the right slide box and view its detailed information. The right slide box is composed of the upper `Invocation Topology` and lower TAB.

### Invocation Topology

Through `Invocation Topology`, you can view the client and server of the selected service, and also view the selected path.

![02-Invocation Topology](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fc61c4d.png)

- **① Switch Group**: You can view the Invocation Topology from \*, auto_service, auto_instance three dimensions
- **② Name**: The name of the currently clicked `service` or `path`, corresponding to the object viewed by the lower TAB.
- **③ Node**: Refer to [Traffic Topology](../dashboard/panel/topology/) for introduction
- **④ Path**: Refer to [Traffic Topology](../dashboard/panel/topology/) for introduction

### Knowledge Graph

![03-Knowledge Graph](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f435c6d.png)

Refer to [Application - Right Slide Box - Knowledge Graph](../application/right-sliding-box/) for introduction

### Application Performance

You can utilize `Application Performance` to analyze whether there are abnormalities in the application layer of the selected service or path.

![04-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f6ac6b5.png)

The TAB consists of throughput, latency, exception three curves, and the endpoint list below. Click on a row in the endpoint list to go to the next level right slide box.

![04-1-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f764e5d.png)
![04-2-Application Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f799476.png)

The next-level right slide box can view the RED metrics and log details of an endpoint. When an exception occurs, you can view `Exception Analysis`.

### Network Performance

You can utilize `Network Performance` to analyze whether there are abnormalities in the application layer of the selected service or path.

![05-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9625df.png)

The TAB consists of throughput, latency, exception, performance four curves, and the service port list below. Click on a row in the list to go to the next level right slide box.

- Service: You can view the data of the service `acting as a client` or `acting as a server`
- Path: By clicking each `path statistical location` on the `Path Topology`, you can view the data of each `path statistical location`

![05-1-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3f9c515d.png)
![05-2-Network Performance](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fd02700.png)

The next-level right slide box can view the RED metrics and log details of a service port. When an exception occurs, you can view `Exception Analysis`.

### Events

Check the resource change events of `services` or `paths`

![06-Events](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310196530f3fcdb8b4.png)

Refer to [Application - Right Slide Box - Events](../application/right-sliding-box/) for introduction
