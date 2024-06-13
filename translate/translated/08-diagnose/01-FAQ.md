---
title: FAQ
permalink: /diagnose/FAQ
---

> This document was translated by ChatGPT

# Deployment

1. What's the difference between all-in-one deployment mode and standard deployment mode?

   Answer: All-in-one deployment means the storage components `clickhouse` and `mysql` aren't assigned corresponding PVCs, but use `hostPath` deployment mode instead. If your Kubernetes cluster has multiple nodes, restarting the `deepflow-clickhouse/mysql` Pod might cause it to drift to other nodes, making the data previously collected unsearchable. It is recommended to use all-in-one deployment for trials or testing/POC stages.

2. How long is data generally retained, and can this be adjusted?

   Answer: Different types of data have different retention periods. You can refer to the [server.yaml](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml#L296-L310) file to check the retention period of each data type. The retention time can be adjusted `before the first deployment`. Adjust the default settings and complete the installation when [installing via helm](../best-practice/server-advanced-config/#modify-server-configuration-file).

3. How can I use an external MySQL/Clickhouse?

   Answer: Please refer to the sections on [utilizing a managed MySQL solution](../best-practice/production-deployment/#use-managed-mysql) and [utilizing a managed ClickHouse solution](../best-practice/production-deployment/#use-managed-clickhouse) in the [production environment deployment recommendations](../best-practice/production-deployment/).

4. The deployment specifications include `mysql` and `clickhouse` storage components. What's the difference between them?

   Answer: `mysql` stores metadata information obtained from the deployment cluster, such as virtual machines, Kubernetes resources, sync collector information, etc. `clickhouse` stores real-time collected data, such as network stream logs from the cluster, and performs aggregation analysis.

5. Why is there no data on Grafana after deployment?

   Answer: Please troubleshoot using the following steps:

   - Check if all Pods are running normally: Run the `kubectl get pods -n deepflow` command and confirm all Pods are in `Running` status.

   - Check whether DeepFlow Agent and DeepFlow Server have been successfully connected. Use `deepflow-ctl domain list` to check if the service domain has been successfully created, then use `deepflow-ctl agent list` to check if the `STATE` is in `NORMAL` status.

   - If the `Network - X` dashboards have no data, check whether the network card name complies with the capture rules. Use the `deepflow-ctl agent-group-config example | grep tap_interface_regex` command to check the default capture scope. If you've used a custom CNI or constructed the network in other ways, add the network card match rule to `tap_interface_regex`, and then complete the changes by [updating the agent configuration](../best-practice/agent-advanced-config/#update-agent-group-config-configuration).

   - If only the `Application - X` dashboards have no data, ensure that the application protocol used within your cluster meets the [support list](../features/universal-map/request-log/) requirements.

6. I've set up OpenTelemetry data integration/I'd like to use eBPF tracing and network tracing capabilities offered by DeepFlow, but I can't see any data on the `Distributed Tracing` dashboard.

   Answer: Please troubleshoot using the following steps:

   - When using OpenTelemetry integration：

     - Ensure that the application has integrated with the OTel SDK or started the OTel Agent.

     - Confirm you've completed the configuration according to the [DeepFlow configuration](../integration/input/tracing/opentelemetry/#configure-deepflow). On the container node where `deepflow-agent` is located, use the `netstat -alntp | grep 38086` command to check if this function has started normally. If the configuration is complete, check the `Network - Flow Log` for flow logs with `Server Port` listed as 38086.

     - Check the `Application - K8s Pod Map` dashboard to see if there's traffic from the application to the otel-agent container node. Ensure this network link is unobstructed and actually processing requests.

     - In the `Application - Request Log` dashboard, verify that the outgoing requests aren't abnormal.

   - When using eBPF capabilities:

     - Confirm that the server kernel version [meets requirements](../ce-install/overview/#kernel-requirements).

     - Check all instances of `deepflow-agent`: Use the `kubectl logs -n deepflow ds/deepflow-agent | grep 'ebpf collector'` command to check if the eBPF module has started normally. Use the `kubectl logs -n deepflow ds/deepflow-agent | grep TRACER` command to ensure eBPF Tracer is functioning correctly.

# Product

1. After installing and deploying, what should I do next? Are there product cases or usage scenarios you can share?

   Answer: You can see our shared cases in our [Start Observability](https://deepflow.io/blog/tags/Dashboard/) and [troubleshooting](https://deepflow.io/blog/tags/troubleshooting/) blog series. Also, you can revisit previous shares on our [Bilibili account](https://space.bilibili.com/2040480780/video).

2. I think some features aren't optimal and would like to offer suggestions. How can I do this?

   Answer: You're welcome to submit Feature Requests on [Github Issue](https://github.com/deepflowio/deepflow/issues). If you already have a mature idea, you can put it into practice and submit it directly at [GithubPR](https://github.com/deepflowio/deepflow/pulls).

3. Where can I keep track of the latest developments of DeepFlow?

   Answer: You can check our latest release overview in the [release notes](../release-notes/release-6.2-ce/) or follow our latest [blog](https://deepflow.io/blog/).

# Contact Us

If the above help cannot resolve your problem, you can submit your questions via [Github Issue](https://github.com/deepflowio/deepflow/issues) or [contact us](https://github.com/deepflowio/deepflow#contact-us) directly for discussion.
