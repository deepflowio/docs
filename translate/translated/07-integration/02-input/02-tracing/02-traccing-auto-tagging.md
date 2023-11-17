---
title: AutoTagging
permalink: /integration/input/tracing/traccing-auto-tagging
---

> This document was translated by GPT-4

The DeepFlow Agent needs to inject VPC and IP tags into the data so that the DeepFlow Server can extend all other tags based on this. For tracing data, we hope that the OpenTelemetry Agent can mark IP information for the DeepFlow Agent. Fortunately, the [k8s attributes processor](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/k8sattributesprocessor#section-readme) plugin can automatically inject the IP address of the Span sending side, and `attribute.net.peer.ip` can be automatically injected by most OpenTelemetry Instrumentation.

Based on DeepFlow's AutoTagging capabilities, we have automatically implemented the association of tracing data with other observable data, without the need for developers to insert any code.
