---
title: Custom Resource Tags
permalink: /features/auto-tagging/custom-tags
---

> This document was translated by ChatGPT

# K8s Label

DeepFlow currently supports automatically associating K8s custom Label resources, including:

- Container Service
- Workload
  - Deployment
  - StatefulSet
  - DaemonSet
  - ReplicationController
  - CafeDeployment
  - CloneSet
- ReplicaSet/InPlaceSet
- Pod

# K8s Annotation

DeepFlow (Enterprise Edition only) currently supports automatically associating K8s custom Annotation resources, including:

- Container Service
- Pod

# K8s Env

DeepFlow (Enterprise Edition only) currently supports automatically associating K8s custom Annotation resources, including:

- Pod

# Cloud Resource Custom Tags

DeepFlow (Enterprise Edition only) currently supports automatically associating cloud resource custom tags for the following resources:

- Cloud Server

Supported public cloud providers include:

- Aliyun
- Tencent Cloud
- Huawei Cloud

Supported private cloud providers include:

- Alibaba Private Cloud

# Custom Auto Grouping Tags

The DeepFlow system provides two default auto-grouping tags: `auto_instance` and `auto_service`:

- auto_instance: Automatically identifies the corresponding instance tag based on IP or process ID. The system has predefined recognizable tags and their priorities (Container POD > Process > Container Node > Others > IP)

[csv-auto_instance_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_instance_type.en)

- auto_service: Automatically identifies the corresponding service tag based on IP or process ID. The system has predefined recognizable tags and their priorities (Custom Service > Container Service > Workload > Process > Container Cluster > Others > IP)  
  - Compared to `auto_instance`, `auto_service` removes `Container POD` and adds `Custom Service` (Enterprise Edition only), `Container Service`, and `Workload` tags that better represent services. Among them, `Container Service` has a higher recognition priority than `Workload`. Therefore, when an IP belongs to both `Container Service` and `Workload`, it will be recognized as `Container Service`.

[csv-auto_service_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_service_type.en)

DeepFlow also supports defining custom auto-grouping tags. You can configure the tags to be recognized and their priorities as needed. The configuration document is as follows:

```yaml
querier:
  auto-custom-tags:
    # The Name of Custom Tag
    # Note: Cannot use colon, space, or backquote.
    - tag-name: auto_my_tag
      # The Value of Custom Tag
      # Note: Range of source tags for retrieving the field value. Each row of data will
      #   automatically use the first non-zero tag encountered from top to bottom as the
      #   value for the custom tag. Here you can enter any tags seen in the results of
      #   the `show tags from <table>` API.
      tag-fields:
        - k8s.label.app
        - auto_service
```

The `$tag-name` tag defined above works basically the same as `auto_instance` and `auto_service`, with the following additional restrictions:

- The `$tag-name` defined here cannot be used for grouping together with `*`
- The `$tag-name` defined here cannot be used for grouping together with any tags included in `$tag-fields` in its definition