---
title: FAQ
permalink: /diagnose/FAQ
---

> This document was translated by ChatGPT

# Deployment

1. What is the difference between all-in-one mode deployment and regular deployment?

   Answer: All-in-one means that the storage components `clickhouse` and `mysql` do not have corresponding PVCs and are deployed using the `hostPath` mode. If the K8S cluster has multiple nodes, after restarting the `deepflow-clickhouse/mysql` Pods, they may drift to other nodes, causing previously collected data to be unqueryable. It is recommended to use all-in-one deployment for experience purposes, and regular deployment mode for testing/POC stages.

2. How long is the data generally retained, and can it be adjusted?

   Answer: The retention period for different data varies. You can check the retention period for different types of data in [server.yaml](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml#L296-L310) and adjust the retention period `before the first deployment`. Modify the default configuration during [helm installation](../best-practice/server-advanced-config/#%E4%BF%AE%E6%94%B9-server-%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6) and complete the installation.

3. How to use external MySQL/Clickhouse?

   Answer: Refer to the sections [Using Managed MySQL](../best-practice/production-deployment/#%E4%BD%BF%E7%94%A8%E6%89%98%E7%AE%A1-mysql) and [Using Managed ClickHouse](../best-practice/production-deployment/#%E4%BD%BF%E7%94%A8%E6%89%98%E7%AE%A1-clickhouse) in the [Production Deployment Recommendations](../best-practice/production-deployment/).

4. The deployment specifications include two storage components, `mysql` and `clickhouse`. What is the difference between them?

   Answer: `mysql` stores metadata information obtained from the deployment cluster, such as virtual machines, K8S resources, and synchronized collector information. `clickhouse` stores real-time collected data, such as network flow logs collected from the cluster, and performs aggregation analysis.

5. After deployment, there is no data on Grafana?

   Answer: Please troubleshoot by following these steps:

   - Check if all Pods are running normally: Execute the `kubectl get pods -n deepflow` command and confirm that all Pods are in the `Running` state.

   - Check if DeepFlow Agent and DeepFlow Server are successfully connected. You can check if the service domain has been successfully created using the `deepflow-ctl domain list` command and check if the `STATE` is in the `NORMAL` state using the `deepflow-ctl agent list` command.

   - If there is no data in the `Network - X` type dashboard, check if the network card name matches the capture rules. You can view the default capture range using the `deepflow-ctl agent-group-config example | grep tap_interface_regex` command. If you are using a custom CNI or have set up the network in other ways, you can add the network card matching rules to `tap_interface_regex` and complete the modification by [updating the agent configuration](../best-practice/agent-advanced-config/#%E6%9B%B4%E6%96%B0-agent-group-config-%E9%85%8D%E7%BD%AE).

   - If there is no data in the `Application - X` type dashboard, confirm that the application protocols used in the cluster meet the [supported list](../features/universal-map/request-log/).

6. I have configured OpenTelemetry data integration/want to use DeepFlow's eBPF tracing and network tracing capabilities, but there is no data in the `Distributed Tracing` dashboard?

   Answer: Please troubleshoot by following these steps:

   - Using OpenTelemetry integration:

     - Confirm that the application has integrated the OTel SDK or started the OTel Agent.

     - Confirm that the configuration has been completed according to the steps in [Configuring DeepFlow](../integration/input/tracing/opentelemetry/#%E9%85%8D%E7%BD%AE-deepflow). You can check if this feature is started normally on the container node where `deepflow-agent` is located using the `netstat -alntp | grep 38086` command. If the configuration is completed, you can check if there are flow logs with `Server Port` 38086 in `Network - Flow Log`.

     - Check if there is traffic from the application to the otel-agent to the container node in the `Application - K8s Pod Map` dashboard to ensure that this network link is smooth and requests are occurring.

     - Confirm in the `Application - Request Log` dashboard if there are any anomalies in the sent requests.

   - Using eBPF capabilities:

     - Confirm that the server kernel version [meets the requirements](../ce-install/overview/#%E8%BF%90%E8%A1%8C%E6%9D%83%E9%99%90%E5%8F%8A%E5%86%85%E6%A0%B8%E8%A6%81%E6%B1%82).

     - Check all replicas of `deepflow-agent`: Check if the eBPF module is started normally using the `kubectl logs -n deepflow ds/deepflow-agent | grep 'ebpf collector'` command, and confirm that the eBPF Tracer function is running normally using the `kubectl logs -n deepflow ds/deepflow-agent | grep TRACER` command.

# Product

1. What should I do after installation and deployment? Are there any product cases or usage scenarios to share?

   Answer: You can see the cases we share in our [Starting Observability](https://deepflow.io/blog/tags/Dashboard/) series of blogs and [troubleshooting](https://deepflow.io/blog/tags/troubleshooting/) series of blogs. You can also review past shares on our [Bilibili account](https://space.bilibili.com/2040480780/video).

2. I think some features are not good enough and want to give suggestions. How can I do that?

   Answer: You are welcome to submit a Feature Request on [Github Issue](https://github.com/deepflowio/deepflow/issues). If you already have a mature idea, you can also put it into practice directly and submit it in [GithubPR](https://github.com/deepflowio/deepflow/pulls).

3. Where can I track the latest developments of DeepFlow?

   Answer: You can check our latest release overview in the [Release Notes](../release-notes/release-6.2-ce/) or follow our latest [blogs](https://deepflow.io/blog/).

# Contact Us

If the above help does not solve your problem, you can submit an issue via [Github Issue](https://github.com/deepflowio/deepflow/issues) or directly [contact us](https://github.com/deepflowio/deepflow#contact-us) for communication.