> This document was translated by GPT-4

---

title: Container Resources
permalink: /guide/ee-tenant/resources/container-resources/

---

# Container Resources

Container resources encompass a variety of dimensional resources. Through proper configuration and restriction, resources can be reasonably allocated and managed to ensure that applications can run smoothly and reliably in a container environment. Within container resources, you can view container clusters, namespaces, container nodes, Ingress, container services, workloads, ReplicaSets, and container POD information separately.

## Container Cluster

A container cluster is a group of linked containers that attain high availability and scalablity through shared network and storage resources. The container resources page allows for viewing and downloading related information such as management platforms, availability zones, cloud platforms, VPCs, the number of nodes, etc.

## Namespace

A namespace is used to provide isolated operational environments for containers to avoid conflicts between them. The namespace page allows for viewing and downloading information such as availability zones, the number of PODs, the number of ReplicaSets, clusters, etc.

## Container Nodes

Container nodes refer to physical or virtual servers running container instances in container orchestration systems. The container nodes page allows for viewing and downloading information such as availability zones, cloud servers, type, status, IP address, internal route IP, CPU, memory, cluster, the number of PODs, collectors, etc.

## Ingress

Ingress is a method to expose HTTP and HTTPS services in a K8s cluster. This objective is achieved by creating an API object in the cluster to route public network traffic to corresponding services.

![08-container_resources_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448dfd092f9a.png)

- All Forwarding Rules: You can view and download all forwarding rules. The list includes protocol type, domain, path, service, service PORT, and related Ingress.
- Operation:
  - View Forwarding Rules: You can view and download the forwarding rules under the current Ingress.
- For the use of other buttons on the page, please refer to the description in the [Resource Pool – Area](./network-resources/) chapter.

## Container Services

Container service is a cloud computing-based service, which packages applications and services into one or more containers and deploys them to the cloud, enabling them to run anywhere, thus simplifying the application deployment and management process.

![08-container_resources_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202304266448e6b382c9a.png)

- All Port Mappings: You can view and download all port mappings from the application ports inside the container to the ports on the host (node). The display includes protocol type, node PORT, service PORT, container PORT, and related service.
- Operation:
  - View Port Mapping: You can view and download the port mapping list of the current container.
- For the use of other buttons on the page, please refer to the description in the [Resource Pool – Area](./network-resources/) chapter.

## Workloads

Workloads refer to applications and services hosted on the cloud platform, which encompass multiple components, services, processes, and containers. They can run based on container or virtualization technology to ensure availability and scalability. The workloads page allows for viewing and downloading information such as availability zones, type, the number of running PODs, expected PODs, the number of ReplicaSets, namespace, cluster, K8s label, etc.

## ReplicaSet

A ReplicaSet is a controller in a K8s cluster to manage replicas for high availability, elasticity, and automation. It ensures the availability of Pods and automatically adjusts the number of Pods when necessary. The ReplicaSet page allows for viewing and downloading related information such as availability zones, running PODs, expected PODs, workload, namespace, cluster, K8s label, etc.

## Container POD

A container is a method of packaging applications and dependencies, and a POD is a collection of multiple containers that can share resources and work in synergy. The container POD page allows for viewing and downloading information such as service, MAC, IP, status, namespace, cluster, etc.
