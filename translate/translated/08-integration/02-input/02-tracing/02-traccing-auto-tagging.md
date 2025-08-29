---
title: AutoTagging
permalink: /integration/input/tracing/traccing-auto-tagging
---

> This document was translated by ChatGPT

The DeepFlow Agent needs to inject VPC and IP tags into the data so that the DeepFlow Server can extend all other tags based on them. For tracing data, we want the OpenTelemetry Agent to label IP information for the DeepFlow Agent. Fortunately, the [k8s attributes processor](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/k8sattributesprocessor#section-readme) plugin can automatically inject the IP address of the Span sender, and `attribute.net.peer.ip` can be automatically injected by most OpenTelemetry Instrumentations.

With DeepFlow’s AutoTagging capability, we can automatically associate tracing data with other observability data, without requiring developers to insert any code.