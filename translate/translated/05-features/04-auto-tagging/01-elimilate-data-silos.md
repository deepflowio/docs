---
title: Eliminate Data Silos
permalink: /features/auto-tagging/eliminate-data-silos
---

> This document was translated by GPT-4

DeepFlow's **AutoTagging** capability injects uniform attribute tags into all observing data, including:

- Cloud resources: region, availability zone, cloud server, VPC, subnet, router, security group, NAT gateway, load balancer, peer connection, cloud business network, RDS, Redis
- Custom tags for cloud resources: business tags defined by tenants on cloud servers
- K8s resources: clusters, nodes, namespaces, services, Ingress, workloads, ReplicaSet, Pod
- Custom tags for K8s: for example, Label/Annotation/Env of the workload, common Labels like owner, commitId, version, app, group, etc.
- Business tags in CMDB: DeepFlow Server provides a declarative API to associate business tags in CMDB with cloud resources and container resources
- Business tags in the continuous deployment system: in non-K8s environments, the continuous deployment system knows business tags related to the process, DeepFlow Agent can associate tags with the process through plugins

Injecting uniform tags into all Agent's data facilitates us to observe the performance change of a Request from a full-stack, full-chain perspective, and quickly locate relevant resources, services, and businesses.

In addition, DeepFlow supports receiving abundant observability data from open-source Prometheus, Telegraf, OpenTelemetry, SkyWalking, and sending data to DeepFlow provides the additional benefit of the uniform AutoTagging mechanism that can thoroughly break data silos and enhance the data drilling and partitioning capabilities.
