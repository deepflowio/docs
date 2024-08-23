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

- Aliyun
- Tencent Cloud
- Huawei Cloud

Supported private cloud providers include:

- Aliyun Dedicated Cloud

# Custom Auto Grouping Tags

The DeepFlow system provides two default auto-grouping tags: auto_instance and auto_service:

- auto_instance: Automatically identifies the corresponding instance tag based on IP or process ID. The system sets recognizable tags and their priorities (Container POD > Process > Container Node > Others > IP).

[csv-auto_instance_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_instance_type.en)

- auto_service: Automatically identifies the corresponding service tag based on IP or process ID. The system sets recognizable tags and their priorities (Container Service > Workload > Process > Container Cluster > Others > IP).
  - Compared to auto_instance, auto_service removes `Container POD` and adds `Container Service` and `Workload` tags that better reflect services. The `Container Service` tag has a higher priority than `Workload`, so when an IP belongs to both `Container Service` and `Workload`, it will be identified as `Container Service`.

[csv-auto_service_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_service_type.en)

DeepFlow also supports the ability to customize auto-grouping tags. You can configure the tags and their priorities as needed. The configuration document is as follows:

```yaml
querier:
  auto-custom-tag:
    # The Name of Custom Tag
    # Note: Cannot use colon, space, or backquote.
    tag-name: auto_my_tag
    # The Value of Custom Tag
    # Note: Range of source tags for retrieving the field value. Each row of data will
    #   automatically use the first non-zero tag encountered from top to bottom as the
    #   value for the custom tag. Here you can enter any tags seen in the results of
    #   the `show tags from <table>` API.
    tag-values:
      - k8s.label.app
      - auto_service
```

The `$tag-name` tag defined above is used similarly to `auto_instance` and `auto_service`, with the following additional restrictions:

- The `$tag-name` defined here cannot be used for grouping with `*` simultaneously.
- The `$tag-name` defined here cannot be used for grouping with any tags included in the `$tag-values` definition simultaneously.