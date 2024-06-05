---
title: Basic Resource Tags
permalink: /features/auto-tagging/meta-tags
---

> This document was translated by ChatGPT

# Cloud Resource Tags

DeepFlow currently supports resource information synchronization for the following public cloud providers:

- AWS
- Aliyun 阿里云
- Baidu Cloud 百度云
- Huawei Cloud 华为云
- Microsoft Azure
- QingCloud 青云
- Tencent Cloud 腾讯云

The resource tag information that supports automatic injection includes:

- Region
- Availability Zone
- Cloud Server
- VPC
- Subnet
- Router
- Security Group
- NAT Gateway
- Load Balancer
- Peering Connection
- Cloud Enterprise Network
- RDS
- Redis

# K8s Resource Tags

DeepFlow supports automatic injection of the following K8s resource information:

- Cluster
- Node
- Namespace
- Container Service
- Ingress
- Workload
  - Deployment
  - StatefulSet
  - DaemonSet
  - ReplicationController
  - CafeDeployment
  - CloneSet
- ReplicaSet / InPlaceSet
- Pod

# Dependent K8s API

DeepFlow will call (list & watch) the K8s apiserver to obtain key fields of the following types of resources. The value types of each field can be referenced from the output of the `kubectl get XXX -o json` command. Please make necessary adaptations when you modify the APIs of these resources.

You can also choose to implement a pseudo-deepflow-agent yourself to complete the synchronization of K8s resource tags, thus avoiding direct access to the K8s apiserver by the deepflow-agent. [See the documentation here](../../best-practice/special-environment-deployment/#不允许-deepflow-agent-请求-apiserver).

## Required Fields of \*v1.Node

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Unique Identifier
    "name": "xxxx" // Name
  },
  "status": {
    "addresses": [
      {
        "address": "x.x.x.x", // Node IP
        "type": "InternalIP"
      }
    ],
    "conditions": [
      {
        "reason": "KubeletReady", // Used to determine Node status
        "status": "True" // Used to determine Node status
      }
    ]
  },
  "spec": {
    "podCIDR": "x.x.x.x/x" // Used to get the POD Cidr used by this Node
  }
}
```

## Required Fields of \*v1.Namespace

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Unique Identifier
    "name": "xxxx" // Name
  }
}
```

## Required Fields of \*v1.Deployment/StatefulSet/DaemonSet/ReplicationController

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Unique Identifier
    "name": "xxxx", // Name
    "namespace": "xxxx", // Name of the associated namespace
    "labels": {
      // Labels, can upload an empty dictionary
      "key1": "value1"
    }
  },
  "spec": {
    "replicas": 1
  }
}
```

## Required Fields of \*v1.ReplicaSet

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Unique Identifier
    "name": "xxxx", // Name
    "namespace": "xxxx", // Name of the associated namespace
    "labels": {
      // Labels, can upload an empty dictionary
      "key1": "value1"
    },
    "ownerReferences": {
      // Information of the associated workload
      "name": "xxxx",
      "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  },
  "spec": {
    "replicas": 1
  }
}
```

## Required Fields of \*v1.Pod

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Unique Identifier
    "name": "xxxx", // Name
    "namespace": "xxxx", // Name of the associated namespace
    "labels": {
      // Labels, can upload an empty dictionary if *v1.Service resources are not reported
      "key1": "value1"
    },
    "ownerReferences": [
      // Information of the associated workload
      {
        // Workload type
        // Currently supported: DaemonSet/Deployment/ReplicaSet/StatefulSet/ReplicationController
        "kind": "xxxx",
        "name": "xxxx",
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      }
    ],
    "creationTimestamp": "2024-04-29T10:02:38Z", // Creation time
    "generate_name": "xxxx" // Required only for StatefulSet Pods
  },
  "status": {
    "hostIP": "x.x.x.x", // Node IP
    "podIP": "x.x.x.x", // Pod IP
    "conditions": [
      // POD status
      {
        "type": "xxxx",
        "status": "xxxx"
      }
    ],
    "containerStatuses": [
      {
        "containerID": "containerd://xxxxxxxxxxxx..." // Identifier of the container in the POD
      }
    ]
  }
}
```

## Required Fields of \*v1.Service

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Unique Identifier
        "name": "xxxx",                                // Name
        "namespace": "xxxx",                           // Name of the associated namespace
        "labels": {                                    // Labels, can upload an empty dictionary
            "key1": "value1"
        }
    },
    "spec": {
        "clusterIP": "x.x.x.x",
        "ports": [
            {
                "name": "xxxx",
                "nodePort": xxxx,
                "port": xxxx,
                "protocol": "xxxx",
                "targetPort": xxxx
            }
        ],
        "selector": { // The selector contains label information, and the service associates with the Pod through the labels in the selector
            "key": "value"
        },
        "type": "xxxx" // Currently supports NodePort and ClusterIP
    }
}
```

## Required Fields of \*v1beta1.Ingress

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Unique Identifier
        "name": "xxxx",                                // Name
        "namespace": "xxxx"                            // Name of the associated namespace
    },
    "spec": {
        "rules": [ // Forwarding rules
            {
                "host": "", // Domain
                "http": {   // Currently only supports HTTP protocol
                    "paths": [
                        {
                            "path": "",   // Path
                            "backend": {  // Backend service information
                                "service": {
                                    "name": "",
                                    "port": {
                                        "number": xxxx
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
}
```
