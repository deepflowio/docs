---
title: 基础资源标签
permalink: /features/auto-tagging/meta-tags
---

# 云资源标签

DeepFlow 目前支持资源信息同步的公有云厂商包括：

- AWS
- Aliyun 阿里云
- Baidu Cloud 百度云
- Huawei Cloud 华为云
- Microsoft Azure
- QingCloud 青云
- Tencent Cloud 腾讯云

支持自动注入的资源标签信息包括：

- 区域
- 可用区
- 云服务器
- VPC
- 子网
- 路由器
- 安全组
- NAT 网关
- 负载均衡器
- 对等连接
- 云企业网
- RDS
- Redis

# K8s 资源标签

DeepFlow 支持自动注入的 K8s 资源信息包括：

- 集群
- 节点
- 命名空间
- 容器服务
- Ingress
- 工作负载
  - Deployment
  - StatefulSet
  - DaemonSet
  - ReplicationController
  - CafeDeployment
  - CloneSet
- ReplicaSet / InPlaceSet
- Pod

# 依赖的 K8s API

DeepFlow 会调用（list & watch）K8s apiserver 来获取如下各类资源的关键字段，各个字段的值类型可参考 `kubectl get XXX -o json` 命令的输出。当你修改了这些资源的 API 时请注意进行必要的适配。

你也可以选择自己实现一个 pseudo-deepflow-agent 来完成 K8s 资源标签的同步，从而避免 deepflow-agent 直接访问 K8s apiserver，[文档见此](../../best-practice/special-environment-deployment/#不允许-deepflow-agent-请求-apiserver)。

## \*v1.Node 的必要字段

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
    "name": "xxxx" // 名称
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
        "reason": "KubeletReady", // 用于判断 Node 状态
        "status": "True" // 用于判断 Node 状态
      }
    ]
  },
  "spec": {
    "podCIDR": "x.x.x.x/x" // 用于获取该 Node 使用的 POD Cidr
  }
}
```

## \*v1.Namespace 的必要字段

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
    "name": "xxxx" // 名称
  }
}
```

## \*v1.Deployment/StatefulSet/DaemonSet/ReplicationController 的必要字段

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
    "name": "xxxx", // 名称
    "namespace": "xxxx", // 所属 namespace 的名称
    "labels": {
      // labels，可以上传空字典
      "key1": "value1"
    }
  },
  "spec": {
    "replicas": 1
  }
}
```

## \*v1.ReplicaSet 的必要字段

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
    "name": "xxxx", // 名称
    "namespace": "xxxx", // 所属 namespace 的名称
    "labels": {
      // labels，可以上传空字典
      "key1": "value1"
    },
    "ownerReferences": {
      // 所属工作负载信息
      "name": "xxxx",
      "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  },
  "spec": {
    "replicas": 1
  }
}
```

## \*v1.Pod 的必要字段

```json
{
  "metadata": {
    "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
    "name": "xxxx", // 名称
    "namespace": "xxxx", // 所属 namespace 的名称
    "labels": {
      // labels，当不上报 *v1.Service 资源时可以上传空字典
      "key1": "value1"
    },
    "ownerReferences": [
      // 所属工作负载信息
      {
        // 工作负载类型
        // 目前支持：DaemonSet/Deployment/ReplicaSet/StatefulSet/ReplicationController
        "kind": "xxxx",
        "name": "xxxx",
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      }
    ],
    "creationTimestamp": "2024-04-29T10:02:38Z", // 创建时间
    "generate_name": "xxxx" // 仅 StatefulSet 的 Pod 需要携带
  },
  "status": {
    "hostIP": "x.x.x.x", // Node IP
    "podIP": "x.x.x.x", // Pod IP
    "conditions": [
      // POD 状态
      {
        "type": "xxxx",
        "status": "xxxx"
      }
    ],
    "containerStatuses": [
      {
        "containerID": "containerd://xxxxxxxxxxxx..." // POD 中的 container 标识
      }
    ]
  }
}
```

## \*v1.Service 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx",                                // 名称
        "namespace": "xxxx",                           // 所属 namespace 的名称
        "labels": {                                    // labels，可以上传空字典
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
        "selector": { // selector 中是 label 信息，service 通过 selector 中的 label 与 Pod 关联
            "key": "value"
        },
        "type": "xxxx" // 当前支持 NodePort 和 ClusterIP
    }
}
```

## \*v1beta1.Ingress 的必要字段

```json
{
    "metadata": {
        "uid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 唯一标识
        "name": "xxxx",                                // 名称
        "namespace": "xxxx"                            // 所属 namespace 的名称
    },
    "spec": {
        "rules": [ // 转发规则
            {
                "host": "", // 域名
                "http": {   // 目前仅支持 http 协议
                    "paths": [
                        {
                            "path": "",   // 路径
                            "backend": {  // 后端服务信息
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
