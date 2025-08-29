---
title: AutoTagging
permalink: /integration/input/log/log-auto-tagging
---

> This document was translated by ChatGPT

The DeepFlow Agent needs to inject IP tags into the data so that the DeepFlow Server can use them to derive all other tags. For log data using the [Kubernetes_Log](https://vector.dev/docs/reference/configuration/sources/kubernetes_logs/) module of Vector, it automatically discovers and appends the PodName of the log source to the log stream, enabling DeepFlow to automatically match the data source.

With DeepFlow’s AutoTagging capability, we automate the association between tracing data and other observability data, without requiring developers to insert any code.