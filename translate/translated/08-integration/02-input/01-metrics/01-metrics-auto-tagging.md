---
title: AutoTagging
permalink: /integration/input/metrics/metrics-auto-tagging
---

> This document was translated by ChatGPT

DeepFlow automatically calculates all related [cloud resources, K8s resources, K8s Label/Annotation/Env](../../../features/auto-tagging/eliminate-data-silos/) tags based on existing labels in metric data such as `pod_name` (Telegraf), `pod` (Prometheus), and `instance` (Prometheus). This enables the integrated metric data to be seamlessly connected with other observability data, enhancing the drill-down capabilities of the integrated data.

With the AutoTagging capability, application developers no longer need to worry about inserting a large number of tags into metric data. All tag injection is automatically completed along with business resource provisioning, microservice releases, and other traffic events. In addition, DeepFlow’s [SmartEncoding](../../../features/auto-tagging/smart-encoding/) mechanism ensures that automatically inserted tags consume only minimal resources. Finally, for the large number of tags already injected in Prometheus and Telegraf, thanks to ClickHouse’s sparse index mechanism, developers no longer need to worry about high cardinality issues.