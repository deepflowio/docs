---
title: AutoTagging
permalink: /integration/input/metrics/metrics-auto-tagging
---

> This document was translated by ChatGPT

DeepFlow automatically calculates all related [cloud resources, K8s resources, K8s Label/Annotation/Env](../../../features/auto-tagging/eliminate-data-silos/) tags based on existing tags such as `pod_name` (Telegraf), `pod` (Prometheus), `instance` (Prometheus) in the metric data. This enables the integration of metric data with other observability data and enhances the drill-down capability of integrated data.

With the AutoTagging capability, application developers no longer need to worry about inserting a large number of tags into the metric data. All tag injections will be automatically completed with the activation of business resources, microservice releases, and other traffic. Additionally, DeepFlow's [SmartEncoding](../../../features/auto-tagging/smart-encoding/) mechanism ensures that the automatically inserted tags consume minimal resource overhead. Finally, for the large number of tags already injected in Prometheus and Telegraf, thanks to ClickHouse's sparse index mechanism, developers no longer need to worry about high cardinality issues.
