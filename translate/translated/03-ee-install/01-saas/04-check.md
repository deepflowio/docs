---
title: Check and Enable First Observation
permalink: /ee-install/saas/check
---

> This document was translated by ChatGPT

# Introduction

This chapter will guide you on how to check the running status and enable the first observation after completing the deployment of DeepFlow Agent.

# Check

## Check Collector Running Status

Check the list of collectors on the DeepFlow web page to confirm that the DeepFlow Agent is running.

Access path: `System` - `Collectors` - `List`, refer to the steps in the image below:

![Check Collector Running Status](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a70007388.png)

After checking, confirm that the collector is running and there are no abnormal messages before proceeding to the next step.

## Check Application Observability Data

Check the application call logs on the DeepFlow web page to confirm that the data collection function of the DeepFlow Agent has started running.

Access path: `Tracing` - `Call Logs`, refer to the steps in the image below:

![Check Application Observability Data](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4a70c9beff.png)

After checking, confirm that the application call logs of the collector have been normally collected and displayed before proceeding to the next step.

# Start Your First Observation Journey

If you want to understand the status of your cloud resources, you can go to `Resources` - `Resource Pool` - `Computing Resources`/`Network Resources`, [guide link](../../guide/ee-tenant/resources/computing-resources/).

If you want to understand the status of your container cluster resources and applications, you can go to `Resources` - `Resource Pool` - `Container Resources` - `Container Cluster`/`Namespace`/`Container Node`/`Ingress`/`Container Service`/`Workload`/`Container POD`, [guide link](../../guide/ee-tenant/resources/container-resources/).

If you want to observe the application topology of a specific cloud server or container service, you can go to `Tracing` - `Topology Analysis`, [guide link](../../guide/ee-tenant/tracing/path-topology/).

If you want to observe the application performance of a specific cloud server or container service, you can go to `Tracing` - `Resource Analysis`, [guide link](../../guide/ee-tenant/tracing/service-list/).

If you want to perform distributed tracing for a specific business request, you can go to `Tracing` - `Distributed Tracing`, [guide link](../../guide/ee-tenant/tracing/call-chain-tracing/).

If you want to continuously profile the performance of a specific application process, you can go to `Profiling` - `Continuous Profiling`, [guide link](../../guide/ee-tenant/profiling/continue-profile/).

If you want to observe the network traffic topology of a specific cloud server or container service, you can go to `Network` - `Topology Analysis`, [guide link](../../guide/ee-tenant/network/network-map/).

If you want to observe the network performance of a specific cloud server or container service, you can go to `Network` - `Resource Analysis`, [guide link](../../guide/ee-tenant/network/service-statistics/).

In addition, there are more observability usage methods waiting for you to explore...