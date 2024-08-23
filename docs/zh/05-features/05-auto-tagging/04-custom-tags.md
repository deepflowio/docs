---
title: 自定义资源标签
permalink: /features/auto-tagging/custom-tags
---

# K8s Label

DeepFlow 目前支持自动关联 K8s 自定义 Label 的资源包括：

- 容器服务
- 工作负载
  - Deployment
  - StatefulSet
  - DaemonSet
  - ReplicationController
  - CafeDeployment
  - CloneSet
- ReplicaSet/InPlaceSet
- Pod

# K8s Annotation

DeepFlow（仅企业版）目前支持自动关联 K8s 自定义 Annotation 的资源包括：

- 容器服务
- Pod

# K8s Env

DeepFlow（仅企业版）目前支持自动关联 K8s 自定义 Annotation 的资源包括：

- Pod

# 云资源自定义标签

DeepFlow（仅企业版）目前支持自动关联云资源自定义标签的资源包括：

- 云服务器

支持的公有云厂商包括：

- Aliyun 阿里云
- Tencent Cloud 腾讯云
- Huawei Cloud 华为云

支持的私有云厂商包括：

- 阿里专有云

# 自定义自动分组标签

DeepFlow 系统默认提供 auto_instance/auto_service 两个自动分组的标签：

- auto_instance：自动根据 IP 或 进程 ID 识别对应的实例 Tag，系统设置了可识别的 Tag 及优先级（容器 POD > 进程 > 容器节点 > 其他 > IP ）

[csv-auto_instance_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_instance_type.ch)

- auto_service：自动根据 IP 或 进程 ID 识别对应的服务 Tag，系统设置了可识别的 Tag 及优先级（容器服务 > 工作负载 > 进程 > 容器集群 > 其他 > IP）
  - 对比 auto_instance 来说，auto_service 去掉了 `容器 POD`，增加了`容器服务`、`工作负载`等更能体现服务的 Tag。其中 `容器服务`识别的优先级高于`工作负载`，因此当一个 IP 既属于`容器服务`又属于`工作负载`时，会识别为`容器服务`

[csv-auto_service_type](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/auto_service_type.ch)

DeepFlow 同时也支持自定义自动分组标签的能力，按需配置其需要识别的 Tag 及优先级即可，配置文档如下：

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

上述定义的 `$tag-name` 标签使用上与 `auto_instance`、`auto_service` 基本一致，额外的限制如下：

- 此处定义的 `$tag-name` 不能与 `*` 同时用于分组
- 此处定义的 `$tag-name` 不能与定义中 `$tag-values` 所包含的 Tag 同时用于分组
