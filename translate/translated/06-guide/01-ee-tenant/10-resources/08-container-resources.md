---
title: Container Resources
permalink: /guide/ee-tenant/resources/container-resources/
---

> This document was translated by ChatGPT

# Container Resources

Container resources encompass various dimensions of resources. Through proper configuration and limitations, resources can be allocated and managed efficiently, ensuring that applications run stably and reliably in a container environment. In container resources, you can view information on container clusters, namespaces, container nodes, Ingress, container services, workloads, ReplicaSets, and container PODs.

## Container Clusters

Container clusters are a group of connected containers that achieve high availability and scalability by sharing network and storage resources. On the container resources page, you can view and download related information such as management platform, availability zone, cloud platform, VPC, number of nodes, etc.

## Namespaces

Namespaces are used to provide isolated runtime environments for containers to avoid conflicts between containers. On the namespaces page, you can view and download related information such as availability zone, number of PODs, number of ReplicaSets, clusters, etc.

## Container Nodes

Container nodes refer to the physical or virtual servers running container instances in the container orchestration system. On the container nodes page, you can view and download related information such as availability zone, cloud server, type, status, IP, internal routing IP, CPU, memory, cluster, number of PODs, collectors, etc.

## Ingress

Ingress is a way to expose HTTP and HTTPS services in a K8s cluster by creating an API object in the cluster that routes public traffic to the corresponding services.

![01-Ingress](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448dfd092f9a.png)

- All forwarding rules: Supports viewing and downloading all forwarding rules. The list includes protocol type, domain name, path, service, service PORT, and associated Ingress.
- Operations:
  - View forwarding rules: You can view and download the forwarding rules under the current Ingress.
- For the usage of other buttons on the page, refer to the [Resource Pool - Region](./network-resources/) section.

## Container Services

Container services are cloud-based services that package applications and services into one or more containers and deploy them to the cloud, allowing them to run anywhere, thereby simplifying the deployment and management process of applications.

![02-Container Services](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448e6b382c9a.png)

- All port mappings: Supports viewing and downloading all internal application port mappings of containers to the host (node) ports, displaying protocol type, node PORT, service PORT, container PORT, associated service, and supports downloading.
- Operations:
  - View port mappings: You can view and download the port mapping list of the current container.
- For the usage of other buttons on the page, refer to the [Resource Pool - Region](./network-resources/) section.

## Workloads

Workloads refer to applications and services hosted on the cloud platform, including multiple components, services, processes, and containers. They can run based on container or virtualization technology to ensure availability and scalability. On the workloads page, you can view and download related information such as availability zone, type, number of running PODs, desired number of PODs, number of ReplicaSets, namespace, cluster, K8s.label, etc.

## ReplicaSet

ReplicaSet is a controller in a K8s cluster that provides high availability, elasticity, and automated management of replicas. It ensures the availability of PODs and automatically adjusts the number of PODs as needed. On the ReplicaSet page, you can view and download related information such as availability zone, number of running PODs, desired number of PODs, workload, namespace, cluster, K8s.label, etc.

## Container PODs

Containers are a way to package applications and dependencies, and PODs are collections of multiple containers that can share resources and work together. On the container POD page, you can view and download related information such as service, MAC, IP, status, namespace, cluster, etc.
