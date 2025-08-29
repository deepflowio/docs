---
title: FAQ
permalink: /diagnose/FAQ
---

> This document was translated by ChatGPT

# Deployment

1. What is the difference between all-in-one deployment mode and regular deployment?

   A: All-in-one means that the storage components `clickhouse` and `mysql` do not have corresponding PVCs and are deployed using the `hostPath` mode. If the K8S cluster has multiple nodes, after restarting the `deepflow-clickhouse/mysql` Pod, it may drift to another node, causing previously collected data to be unavailable for query. It is recommended to use all-in-one deployment for trial purposes, and use regular deployment mode for testing/POC phases.

2. How long is the data generally retained, and can it be adjusted?

   A: The retention period varies for different types of data. You can check the retention periods for different data types in [server.yaml](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml#L296-L310), and adjust them `before the first deployment` by modifying the default configuration during [helm installation](../best-practice/server-advanced-config/#%E4%BF%AE%E6%94%B9-server-%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6).

3. How to use external MySQL/ClickHouse?

   A: See the sections [Using Managed MySQL](../best-practice/production-deployment/#%E4%BD%BF%E7%94%A8%E6%89%98%E7%AE%A1-mysql) and [Using Managed ClickHouse](../best-practice/production-deployment/#%E4%BD%BF%E7%94%A8%E6%89%98%E7%AE%A1-clickhouse) in [Production Deployment Recommendations](../best-practice/production-deployment/).

4. The deployment specification includes two storage components, `mysql` and `clickhouse`. What is the difference between them?

   A: `mysql` stores metadata obtained from the deployed cluster, such as virtual machines, K8S resources, and synchronized collector information. `clickhouse` stores real-time collected data, such as network flow logs collected from the cluster, and performs aggregation and analysis.

5. No data on Grafana after deployment?

   A: Please troubleshoot as follows:

   - Check whether all Pods are running normally: run `kubectl get pods -n deepflow` and confirm that all Pods are in the `Running` state.

   - Check whether DeepFlow Agent and DeepFlow Server are connected successfully: run `deepflow-ctl domain list` to check if a service domain has been successfully created, and run `deepflow-ctl agent list` to check whether the `STATE` is `NORMAL`.

   - If dashboards of the `Network - X` type have no data, check whether the NIC name matches the capture rules. You can run `deepflow-ctl agent-group-config example | grep tap_interface_regex` to view the default capture range. If you are using a custom CNI or have set up the network in another way, add the NIC matching rule to `tap_interface_regex` and [update the agent configuration](../best-practice/agent-advanced-config/#%E6%9B%B4%E6%96%B0-agent-group-config-%E9%85%8D%E7%BD%AE).

   - If only dashboards of the `Application - X` type have no data, confirm that the application protocols used in the cluster meet the [supported list](../features/universal-map/request-log/).

6. I have configured OpenTelemetry data integration / want to use DeepFlow's eBPF tracing and network tracing capabilities, but there is no data in the `Distributed Tracing` dashboard?

   A: Please troubleshoot as follows:

   - Using OpenTelemetry integration:

     - Confirm that the application has integrated the OTel SDK or started the OTel Agent.

     - Confirm that you have completed the configuration according to [Configure DeepFlow](../integration/input/tracing/opentelemetry/#%E9%85%8D%E7%BD%AE-deepflow). On the container node where `deepflow-agent` is located, run `netstat -alntp | grep 38086` to check whether this feature has started normally. If configured, check in `Network - Flow Log` whether there are flow logs with `Server Port` 38086.

     - In the `Application - K8s Pod Map` dashboard, check whether there is traffic from the application to the otel-agent to the container node, ensuring that the network path is smooth and requests are occurring.

     - In the `Application - Request Log` dashboard, confirm whether there are any anomalies in the requests sent.

   - Using eBPF capabilities:

     - Confirm that the server kernel version [meets the requirements](../ce-install/overview/#%E8%BF%90%E8%A1%8C%E6%9D%83%E9%99%90%E5%8F%8A%E5%86%85%E6%A0%B8%E8%A6%81%E6%B1%82).

     - Check all replicas of `deepflow-agent`: run `kubectl logs -n deepflow ds/deepflow-agent | grep 'ebpf collector'` to check whether the eBPF module has started normally, and run `kubectl logs -n deepflow ds/deepflow-agent | grep TRACER` to confirm that the eBPF Tracer function is running normally.

# Product

1. After installation and deployment, what should I do next? Are there any product cases or usage scenarios to share?

   A: You can find our shared cases in the [Getting Started with Observability](https://deepflow.io/blog/tags/Dashboard/) blog series and the [troubleshooting](https://deepflow.io/blog/tags/troubleshooting/) blog series. You can also review past sharing sessions on our [Bilibili account](https://space.bilibili.com/2040480780/video).

2. I think some features are not good enough and want to give suggestions. How can I do that?

   A: You are welcome to submit a Feature Request in [Github Issue](https://github.com/deepflowio/deepflow/issues). If you already have a mature idea, you can also put it into practice directly and submit it in [Github PR](https://github.com/deepflowio/deepflow/pulls).

3. Where can I follow the latest updates of DeepFlow?

   A: You can check our latest release overview in the [Release Notes](../release-notes/release-6.2-ce/) or follow our latest [blog](https://deepflow.io/blog/).

# Contact Us

If the above information does not solve your problem, you can submit an issue via [Github Issue](https://github.com/deepflowio/deepflow/issues) or [contact us directly](https://github.com/deepflowio/deepflow#contact-us) for communication.