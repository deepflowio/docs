---
title: Container Resources
permalink: /guide/ee-tenant/resources/container-resources/
---

> This document was translated by ChatGPT

# Container Resources

Container resources include multiple dimensions of resources. Through proper configuration and limitation, resources can be allocated and managed reasonably to ensure that applications can run stably and reliably in a container environment. In container resources, you can view information on container clusters, namespaces, container nodes, Ingress, container services, workloads, ReplicaSets, and container PODs respectively.

## Container Cluster

A container cluster is a group of connected containers that achieve high availability and scalability by sharing network and storage resources. On the container resources page, you can view and download related information such as management platform, availability zone, cloud platform, VPC, number of nodes, etc.

## Namespace

A namespace is used to provide an isolated runtime environment for containers to avoid conflicts between them. On the namespace page, you can view and download related information such as availability zone, number of PODs, number of ReplicaSets, clusters, etc.

## Container Node

A container node refers to a physical or virtual server that runs container instances in a container orchestration system. On the container node page, you can view and download related information such as availability zone, cloud server, type, status, IP, internal routing IP, CPU, memory, cluster, number of PODs, collectors, etc.

## Ingress

Ingress is a way to expose HTTP and HTTPS services in a K8s cluster. This is achieved by creating an API object in the cluster, which routes public network traffic to the corresponding service.

![01-Ingress](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448dfd092f9a.png)

- All forwarding rules: Supports viewing and downloading all forwarding rules. The list includes protocol type, domain name, path, service, service PORT, and associated Ingress.
- Actions:
  - View forwarding rules: You can view and download the forwarding rules under the current Ingress.
- For the usage of other buttons on the page, please refer to the **[Resource Pool - Region](./network-resources/)** section.

## Container Service

A container service is a cloud-based service that packages applications and services into one or more containers and deploys them to the cloud, enabling them to run anywhere. This simplifies the deployment and management process of applications.

![02-Container Service](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448e6b382c9a.png)

- All port mappings: Supports viewing and downloading all mappings of application ports inside containers to the host (node) ports, displaying protocol type, node PORT, service PORT, container PORT, and associated service, and also supports downloading.
- Actions:
  - View port mappings: You can view and download the port mapping list of the current container.
- For the usage of other buttons on the page, please refer to the **[Resource Pool - Region](./network-resources/)** section.

## Workload

A workload refers to applications and services hosted on a cloud platform, including multiple components, services, processes, and containers. They can run based on container or virtualization technology to ensure availability and scalability. On the workload page, you can view and download related information such as availability zone, type, number of running PODs, number of desired PODs, number of ReplicaSets, namespace, cluster, K8s label, etc.

## ReplicaSet

A ReplicaSet is a controller in a K8s cluster for high availability, elasticity, and automated replica management. It ensures the availability of Pods and automatically adjusts the number of PODs when needed. On the ReplicaSet page, you can view and download related information such as availability zone, number of running PODs, number of desired PODs, workload, namespace, cluster, K8s label, etc.

## Container POD

A container is a way to package applications and dependencies, while a POD is a collection of multiple containers that can share resources and work together. On the container POD page, you can view and download related information such as service, MAC, IP, status, namespace, cluster, etc.