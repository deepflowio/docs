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

DeepFlow (Enterprise Edition only) currently supports automatically associating K8s custom Environment variables with the following resources:

- Pod

# Cloud Resource Custom Tags

DeepFlow (Enterprise Edition only) currently supports automatically associating custom tags with the following cloud resources:

- Cloud servers

Supported public cloud providers include:

- Aliyun
- Tencent Cloud

# Custom Auto-Grouping Tags

The DeepFlow system provides two default auto-grouping tags: auto_instance and auto_service.

- auto_instance: Automatically identifies the corresponding instance Tag based on IP or process ID. The system sets recognizable Tags and priorities (Container POD > Process > Container Node > Others > IP).

[csv-auto_instance_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_instance_type.en)

- auto_service: Automatically identifies the corresponding service Tag based on IP or process ID. The system sets recognizable Tags and priorities (Container Service > Workload > Process > Container Cluster > Container Node > Others > IP).
  - Compared to auto_instance, auto_service removes `Container POD` and adds `Container Service` and `Workload`, which better reflect service Tags. The `Container Service` has a higher priority than `Workload`, so if an IP belongs to both `Container Service` and `Workload`, it will be identified as `Container Service`.

[csv-auto_service_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_service_type.en)

DeepFlow also supports the ability to customize auto-grouping tags. You can configure the Tags and their priorities as needed. The configuration document is as follows:

```
todo
```

The usage of the defined `$tag-name` tags is basically the same as `auto_instance/auto_service`, with the following limitations:

- `*` cannot be used for grouping with `$tag-name` simultaneously.
- Tags included in `$tag_values` cannot be used for grouping with `$tag-name` simultaneously.
