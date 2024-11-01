---
title: AutoTagging
permalink: /integration/input/profile/profile-auto-tagging
---

> This document was translated by ChatGPT

DeepFlow Agent needs to inject IP tags into the data so that DeepFlow Server can expand all other tags based on this. For continuous profiling data, when the data is sent to the DeepFlow Agent via the HTTP protocol, it will obtain the upstream client IP and inject it into the data. Reducing data transfer can improve matching accuracy, for example, by sending it directly to the service without going through an intermediate proxy when sending to the DeepFlow Agent.

Based on DeepFlow's AutoTagging capability, we have automated the association of tracing data with other observability data, without requiring developers to insert any code.
