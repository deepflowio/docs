---
title: AutoTagging
permalink: /integration/input/metrics/metrics-auto-tagging
---

> This document was translated by GPT-4

DeepFlow automatically calculates all related tags of [cloud resources, K8s resources, K8s Label/Annotation/Env](../../../features/auto-tagging/eliminate-data-silos/) from existing tags such as `pod_name` (Telegraf), `pod` (Prometheus), `instance` (Prometheus) in the metric data. This connects the integrated metric data with other observational data, and enhances its drilling ability.

With the AutoTagging feature, application developers no longer need to worry about inserting a bunch of tags into the metric data. All tag injections will be automatically completed with the opening of business resources, micro-service releases, and other traffic. Besides, DeepFlow's [SmartEncoding](../../../features/auto-tagging/smart-encoding/) mechanism ensures that automatically inserted tags only consume extremely low resource overhead. Finally, as for the vast amount of tags already injected in Prometheus and Telegraf, developers no longer have to worry about high cardinality issues, thanks to the sparse index mechanism of ClickHouse.
