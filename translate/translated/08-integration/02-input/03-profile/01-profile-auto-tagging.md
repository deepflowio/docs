---
title: AutoTagging
permalink: /integration/input/profile/profile-auto-tagging
---

> This document was translated by ChatGPT

The DeepFlow Agent needs to inject IP tags into the data so that the DeepFlow Server can derive all other tags based on them. For continuous profiling data, when the data is sent to the DeepFlow Agent via the HTTP protocol, the upstream client IP will be obtained and injected into the data. Reducing data relays can improve matching accuracy — for example, sending directly to the DeepFlow Agent instead of going through an intermediate proxy before reaching the service.

With DeepFlow’s AutoTagging capability, we can automatically associate tracing data with other observability data, without requiring developers to insert any code.