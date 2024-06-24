---
title: Eliminate Data Silos
permalink: /features/auto-tagging/eliminate-data-silos
---

> This document was translated by ChatGPT

DeepFlow's **AutoTagging** capability injects unified attribute tags into all observability data, including:

- Cloud resources: region, availability zone, cloud server, VPC, subnet, router, security group, NAT gateway, load balancer, peering connection, cloud enterprise network, RDS, Redis
- Custom cloud resource tags: business tags defined by tenants on cloud servers
- K8s resources: cluster, node, namespace, service, Ingress, workload, ReplicaSet, Pod
- Custom K8s tags: such as workload Label/Annotation/Env, common labels like owner, commitId, version, app, group, etc.
- Business tags in CMDB: DeepFlow Server provides a declarative API to associate business tags in CMDB with cloud resources and container resources
- Business tags in continuous deployment systems: In non-K8s environments, continuous deployment systems are aware of business tags related to processes, and DeepFlow Agent can associate tags with processes through plugins

Injecting unified tags into the data of all Agents helps us to comprehensively observe the performance changes of a request from a full-stack, end-to-end perspective, and quickly locate the related resources, services, and businesses.

Additionally, DeepFlow supports receiving rich observability data from open-source Prometheus, Telegraf, OpenTelemetry, and SkyWalking. The additional benefit of sending data to DeepFlow lies in the unified AutoTagging mechanism, which can completely eliminate data silos and enhance the data's drill-down and segmentation capabilities.