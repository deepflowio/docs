---
title: FAQ
permalink: /diagnose/FAQ
---

# 部署

1. all-in-one 模式部署和普通部署的差别是什么？

   答：all-in-one 是指存储组件 `clickhouse` 与 `mysql` 没有对应的 PVC，采用 `hostPath` 模式部署，如果 K8S 集群有多个节点，重启了 `deepflow-clickhouse/mysql` 的 Pod 之后有可能会漂移到其他节点上，导致之前采集的数据无法查询，建议可在体验时使用 all-in-one 部署，测试/POC 环节可用普通部署模式。

2. 数据一般保留多久，可以调整吗？

   答：不同的数据保留时长有差异，可在 [server.yaml](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml#L296-L310) 查看不同类型数据的保留时长，并在`第一次部署前`调整保留时长，通过[helm 安装时](../best-practice/server-advanced-config/#%E4%BF%AE%E6%94%B9-server-%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)修改默认配置并完成安装。

3. 如何使用外部 MySQL/Clickhouse？

   答：可见[生产环境部署建议](../best-practice/production-deployment/)中[使用托管 MySQL](../best-practice/production-deployment/#%E4%BD%BF%E7%94%A8%E6%89%98%E7%AE%A1-mysql)与[使用托管 ClickHouse](../best-practice/production-deployment/#%E4%BD%BF%E7%94%A8%E6%89%98%E7%AE%A1-clickhouse)两小节。

4. 部署规格中包含了`mysql`与`clickhouse`两个存储组件，它们有什么区别？

   答：`mysql` 中会保存从部署集群中获取到的元数据信息，如：虚拟机、K8S资源、同步采集器信息等。`clickhouse` 则会保存实时采集数据，比如从集群中采集到的网络流日志，并进行聚合分析。

5. 部署完成之后 Grafana 上没有数据？

   答：请先按以下步骤排查：

   - 检查是否所有 Pod 都正常运行：执行 `kubectl get pods -n deepflow` 命令并确认所有 Pod 都在 `Running` 状态。

   - 检查 DeepFlow Agent 与 DeepFlow Server 是否对接成功，可通过 `deepflow-ctl domain list` 检查是否已成功创建服务域，并通过 `deepflow-ctl agent list` 查看 `STATE` 是否已处于 `NORMAL` 状态。

   - 如果是 `Network - X` 一类的 dashboard 没有数据，请检查网卡名称是否符合抓取规则，可通过 `deepflow-ctl agent-group-config example | grep tap_interface_regex` 命令查看默认的抓取范围，如果使用了自定义 CNI 或通过其他方式搭建了网络，可将网卡匹配规则加入到 `tap_interface_regex` 中，并通过[更新 agent 配置](../best-practice/agent-advanced-config/#%E6%9B%B4%E6%96%B0-agent-group-config-%E9%85%8D%E7%BD%AE) 完成修改。

   - 如果只有 `Application - X` 一类的 dashboard 没有数据，请确认集群内使用的应用协议满足[支持列表](../features/universal-map/request-log/)。

6. 我配置了 OpenTelemetry 数据集成/想使用 DeepFlow 提供的 eBPF 追踪与网络追踪能力，但是在 `Distributed Tracing` dashboard 中没有看到数据？

   答：请先按以下步骤排查：

   - 使用 OpenTelemetry 集成：

     - 请确认应用已经做了 OTel SDK 集成或启动了 OTel Agent。

     - 请确认已经按照[配置 DeepFlow](../integration/input/tracing/opentelemetry/#%E9%85%8D%E7%BD%AE-deepflow) 步骤完成配置，可在 `deepflow-agent` 所在的容器节点上通过 `netstat -alntp | grep 38086` 命令检查此功能是否正常启动，如已完成配置，可在 `Network - Flow Log` 中检查是否存在 `Server Port` 为 38086 的流日志。

     - 请在 `Application - K8s Pod Map` dashboard 中检查是否存在应用到 otel-agent 到容器节点的流量，确保这个链路网络通畅且正有请求发生。

     - 请在 `Application - Request Log` dashboard 中确认发出的请求是否存在异常。

   - 使用 eBPF 能力：

     - 请确认服务器内核版本[符合要求](../install/overview/#%E8%BF%90%E8%A1%8C%E6%9D%83%E9%99%90%E5%8F%8A%E5%86%85%E6%A0%B8%E8%A6%81%E6%B1%82)。

     - 请检查 `deepflow-agent` 的所有副本：通过 ``kubectl logs -n deepflow ds/deepflow-agent | grep 'ebpf collector'`` 命令检查 eBPF 模块是否正常启动，通过 `kubectl logs -n deepflow ds/deepflow-agent | grep TRACER` 命令确认 eBPF Tracer 功能正常运行。

# 产品

1. 安装部署完了之后，我应该做什么？有产品案例或使用场景可以分享吗？

   答：可在我们的[开启可观测性](https://deepflow.io/blog/tags/Dashboard/)系列博客以及 [troubleshooting](https://deepflow.io/blog/tags/troubleshooting/) 系列博客中看到我们分享的案例，同时也可以在我们的[Bilibili 账号](https://space.bilibili.com/2040480780/video)中回顾往期分享。

2. 我觉得有些功能不够好，想给你们提建议，有什么方式？

   答：欢迎在 [Github Issue](https://github.com/deepflowio/deepflow/issues) 提交 Feature Request，如果你已经有成熟的想法，也可以直接付诸实践，在 [GithubPR](https://github.com/deepflowio/deepflow/pulls) 中直接提交即可。

3. 哪里可以跟踪 DeepFlow 的最新动态？

   答：可在[发行注记](../release-notes/release-6.2-ce/)中查看我们的最新发行概况或关注我们的最新[博客](https://deepflow.io/blog/)。

# 联系我们

如果以上帮助都无法解决你的问题，可通过 [Github Issue](https://github.com/deepflowio/deepflow/issues) 提交问题或直接[联系我们](https://github.com/deepflowio/deepflow#contact-us)交流。
