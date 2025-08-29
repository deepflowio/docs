---
title: Overview
permalink: /guide/ee-tenant/metrics/overview/
---

> This document was translated by ChatGPT

# Overview

DeepFlow integrates with Prometheus data to display infrastructure status, CPU, memory, and other metrics in a list format. It currently supports displaying data for `Host` and `Container`. It also supports searching and viewing metric data information, as well as adding metric templates to specified data tables.

- [Host](./host/)
- [Container](./container/)
- [Metrics Viewing](./metrics-viewing/)
- [Metric Summary](./metric-summary/)
- [Metrics Template](./metrics-template/)

Note: When using `Host` or `Container`, you need to push Prometheus node_exporter data to DeepFlow. For the push method, refer to [Integrating Prometheus Data](../../../integration/input/metrics/prometheus/)