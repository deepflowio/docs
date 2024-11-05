---
title: AutoTagging
permalink: /integration/input/log/log-auto-tagging
---

> This document was translated by ChatGPT

DeepFlow Agent needs to inject IP tags into the data so that DeepFlow Server can expand all other tags based on this. For log data using the [Kubernetes_Log](https://vector.dev/docs/reference/configuration/sources/kubernetes_logs/) module of Vector, it automatically discovers and attaches the PodName of the log source in the log stream, allowing DeepFlow to automatically match the data source.

Based on DeepFlow's AutoTagging capability, we have automated the association of tracing data with other observability data, without requiring developers to insert any code.
