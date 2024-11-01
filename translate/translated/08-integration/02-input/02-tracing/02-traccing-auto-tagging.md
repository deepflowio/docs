---
title: AutoTagging
permalink: /integration/input/tracing/traccing-auto-tagging
---

> This document was translated by ChatGPT

DeepFlow Agent needs to inject VPC and IP tags into the data so that DeepFlow Server can expand all other tags based on this. For tracing data, we hope that the OpenTelemetry Agent can tag IP information for the DeepFlow Agent. Fortunately, the [k8s attributes processor](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/k8sattributesprocessor#section-readme) plugin can automatically inject the IP address of the Span sender, and `attribute.net.peer.ip` can be automatically injected by most OpenTelemetry Instrumentation.

Based on DeepFlow's AutoTagging capability, we have automated the association of tracing data with other observability data, without requiring developers to insert any code.
