---
title: 集成 SkyWalking 数据
---

# 数据流

```mermaid
flowchart TD

subgraph K8s-Cluster
  subgraph AppPod
    SWSDK1["sw-sdk / sw-javaagent"]
  end
  OTelAgent1["otel-collector (agent mode, daemonset)"]
  DeepFlowAgent1["deepflow-agent (daemonset)"]
  DeepFlowServer["deepflow-server (statefulset)"]

  SWSDK1 -->|sw-traces| OTelAgent1
  OTelAgent1 -->|otel-traces| DeepFlowAgent1
  DeepFlowAgent1 -->|otel-traces| DeepFlowServer
end

subgraph Host
  subgraph AppProcess
    SWSDK2["sw-sdk / sw-javaagent"]
  end
  OTelAgent2["otel-collector (agent mode)"]
  DeepFlowAgent2[deepflow-agent]

  SWSDK2 -->|sw-traces| OTelAgent2
  OTelAgent2 -->|otel-traces| DeepFlowAgent2
  DeepFlowAgent2 -->|otel-traces| DeepFlowServer
end
```

# 配置 OpenTelemetry SkyWalking Receiver

## 背景知识

你可以查看 [OpenTelemetry 文档](https://opentelemetry.io/docs/) 了解 OpenTelemetry 背景知识，并参考前序章节中的 [OpenTelemetry 安装](../tracing/opentelemetry/#配置-opentelemetry) 快速安装 OpenTelemetry。

你可以查看 [SkyWalking 文档](https://skywalking.apache.org/docs/) 了解 SkyWalking 背景知识，这个 Demo 不需要安装完整的 SkyWalking ，我们将使用 OpenTelemetry 来集成 SkyWalking 的 Trace 数据。

## 确认 OpenTelemetry 版本

首先，你需要开启 OpenTelemetry 的 SkyWalking 数据接收能力，将数据经过 OpenTelemetry 标准协议处理之后，发送到 DeepFlow Agent。

OpenTelemetry 接收 SkyWalking 数据存在 Bug，最近我们在 [这个 PR](https://github.com/open-telemetry/opentelemetry-collector-contrib/pull/11562) 中进行了修复，接下来的 Demo 我们需要 OpenTelemetry 的 [Collector 镜像](https://hub.docker.com/r/otel/opentelemetry-collector-contrib) 版本 `>= 0.56.0`。请检查你的环境中 otel-agent 的镜像版本，并确保它符合要求。可参考前序章节中的 [OpenTelemetry 安装](../tracing/opentelemetry/#配置-otel-agent)，更新你的环境中的 otel-agent 版本。

## 配置 OpenTelemetry 接收 SkyWalking 数据

我们假设 OpenTelemetry 所在的命名空间为 `open-telemetry`，假设 otel-agent 使用的 ConfigMap 名为 `otel-agent-conf`，使用如下命令修改 otel-agent 配置：
```bash
kubectl -n open-telemetry edit cm otel-agent-conf
```

在 `receivers` 和 `service.pipelines.traces` 两节中，增加如下内容：
```yaml
receivers:
  # add the following config
  skywalking:
    protocols:
      grpc:
        endpoint: 0.0.0.0:11800
      http:
        endpoint: 0.0.0.0:12800
service:
  pipelines:
    traces:
      # add receiver `skywalking`
      receivers: [skywalking]
```

修改 otel-agent Daemonset 配置：
```bash
kubectl -n open-telemetry edit daemonset otel-agent
```

打开用于 grpc 和 http 的两个转发端口：
```yaml
spec:
  template:
    spec:
      ports:
      - containerPort: 11800
        protocol: TCP
      - containerPort: 12800
        protocol: TCP
```

修改 otel-agent Service 配置：
```bash
kubectl -n open-telemetry edit service otel-agent
```

增加以下配置：
```yaml
spec:
  ports:
    - name: sw-http
      port: 12800
      protocol: TCP
      targetPort: 12800
    - name: sw-grpc
      port: 11800
      protocol: TCP
      targetPort: 11800
```

最后，重启 otel-agent 完成应用更新：
```bash
kubectl rollout restart -n open-telemetry daemonset/otel-agent
```

# 配置 DeepFlow

请参考 [配置 DeepFlow](../tracing/opentelemetry/#配置-deepflow) 一节内容，完成 DeepFlow Agent 的配置。

# 基于 WebShop Demo 体验

## 部署 Demo

此Demo来源于 [这个 GitHub 仓库](https://github.com/liuzhibin-cn/my-demo)，这是一个基于 Spring Boot 编写的由五个微服务组成的 WebShop 应用，其架构如下：

![Sping Boot Demo Architecture](./imgs/spring-boot-webshop-arch.png)

使用如下命令可以一键部署这个 Demo：
```bash
kubectl apply -f https://raw.githubusercontent.com/deepflowys/deepflow-demo/main/DeepFlow-Otel-SkyWalking-Demo/deepflow-otel-skywalking-demo.yaml
```

## 查看追踪数据

前往 Grafana，打开 `Distributed Tracing` Dashboard，选择 `namespace = deepflow-otel-skywalking-demo` 后，可选择一个调用进行追踪。
DeepFlow 能够将 SkyWalking、eBPF、BPF 获取到的追踪数据关联展示在一个 Trace 火焰图中，
覆盖一个 Spring Boot 应用从业务代码、系统函数、网络接口的全栈调用路径，实现真正的全链路分布式追踪，效果如下：

![OTel SkyWalking Demo](./imgs/otel-skywalking-demo.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/a3x57qenk/distributed-tracing?orgId=1&var-cluster=All&var-namespace=15&var-workload=All&var-vm=All&var-trace_id=*&var-span_id=*&var-request_resource=*&from=now-5m&to=now&from=deepflow-doc) 查看效果。
