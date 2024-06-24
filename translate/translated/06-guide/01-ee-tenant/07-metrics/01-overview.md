---
title: Overview
permalink: /guide/ee-tenant/metrics/overview/
---

> This document was translated by ChatGPT

# Overview

DeepFlow integrates with Prometheus data to display infrastructure status, CPU, memory, and other metrics in a list format. Currently, it supports displaying data for `hosts` and `containers`. Additionally, it supports searching for metric data information and adding metric templates to specified data tables.

- [Hosts](./host/)
- [Containers](./container/)
- [Metrics Viewing](./metrics-viewing/)
- [Metric Summary](./metric-summary/)
- [Metrics Template](./metrics-template/)

Note: When using `hosts` or `containers`, Prometheus node_exporter data needs to be pushed to DeepFlow. For the push method, refer to [Integrating Prometheus Data](../../../integration/input/metrics/prometheus/)