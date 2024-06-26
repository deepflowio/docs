---
title: Custom Resource Tags
permalink: /features/auto-tagging/custom-tags
---

> This document was translated by ChatGPT

# K8s Label

DeepFlow currently supports automatically associating K8s custom Labels with the following resources:

- Container services
- Workloads
  - Deployment
  - StatefulSet
  - DaemonSet
  - ReplicationController
  - CafeDeployment
  - CloneSet
- ReplicaSet/InPlaceSet
- Pod

# K8s Annotation

DeepFlow (Enterprise Edition only) currently supports automatically associating K8s custom Annotations with the following resources:

- Container services
- Pod

# K8s Env

DeepFlow (Enterprise Edition only) currently supports automatically associating K8s custom Annotations with the following resources:

- Pod

# Cloud Resource Custom Tags

DeepFlow (Enterprise Edition only) currently supports automatically associating cloud resource custom tags with the following resources:

- Cloud servers

Supported public cloud providers include:

- Aliyun 阿里云
- Tencent Cloud 腾讯云
- Huawei Cloud 华为云

Supported private cloud providers include:

- Aliyun Private Cloud

# Custom Auto Grouping Tags

The DeepFlow system by default provides two auto-grouping tags: auto_instance and auto_service:

- auto_instance: Automatically identifies the corresponding instance tag based on IP or process ID. The system sets recognizable tags and their priorities (Container POD > Process > Container Node > Others > IP).

[csv-auto_instance_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_instance_type.en)

- auto_service: Automatically identifies the corresponding service tag based on IP or process ID. The system sets recognizable tags and their priorities (Container Service > Workload > Process > Container Cluster > Others > IP).
  - Compared to auto_instance, auto_service removes `Container POD` and adds tags like `Container Service` and `Workload` that better reflect services. The priority of `Container Service` recognition is higher than `Workload`, so when an IP belongs to both `Container Service` and `Workload`, it will be recognized as `Container Service`.

[csv-auto_service_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_service_type.en)

DeepFlow also supports the ability to customize auto-grouping tags. You can configure the tags and their priorities as needed. The configuration document is as follows:

```
todo
```

The usage of the defined `$tag-name` tag is basically the same as `auto_instance/auto_service`, with the following restrictions:

- `*` cannot be used for grouping simultaneously with `$tag-name`
- Tags included in `$tag_values` cannot be used for grouping simultaneously with `$tag-name`