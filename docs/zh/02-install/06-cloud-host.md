---
title: 监控云服务器
permalink: /install/cloud-host
---

# 简介

DeepFlow 支持监控云服务器，并通过调用云厂商 API 获取云资源信息，自动注入到所有观测数据中（AutoTagging）。
注意 DeepFlow Server 必须运行在 K8s 之上，如果你没有 K8s 集群，可参考 [All-in-One 快速部署](./all-in-one/)章节先部署 DeepFlow Server。

# 部署拓扑

```mermaid
flowchart TD

subgraph VPC-1
  subgraph K8s-Cluster
    DeepFlowServer["deepflow-server (statefulset)"]
  end

  subgraph Cloud-Host-1
    DeepFlowAgent1[deepflow-agent]
    DeepFlowAgent1 --> DeepFlowServer
  end
end

subgraph VPC-2
  subgraph Cloud-Host-2
    DeepFlowAgent2[deepflow-agent]
    DeepFlowAgent2 -->|"tcp/udp 30033+30035"| DeepFlowServer
  end
end

DeepFlowServer -->|"get resource & label"| CloudAPI[cloud api service]
```

# 创建公有云 Domain

DeepFlow 目前支持如下公有云的资源信息同步（标记为 `TBD` 的正在整理代码中）：
| 云服务商（英文） | 云服务商（中文） | DeepFlow中使用的类型标识 |
| ---------------- | ---------------- | ------------------------ |
| AWS              | AWS              | `TBD`                    |
| Aliyun           | 阿里云           | aliyun                   |
| Baidu Cloud      | 百度云           | baidu\_bce               |
| Huawei Cloud     | 华为云           | `TBD`                    |
| Microsoft Azure  | 微软云           | `TBD`                    |
| QingCloud        | 青云             | qingcloud                |
| Tencent Cloud    | 腾讯云           | `TBD`                    |

可通过 `deepflow-ctl domain example <domain_type>` 命令获取创建公有云 Domain 的配置文件模板。
以阿里云为例：
```bash
deepflow-ctl domain example aliyun > aliyun.yaml
```

修改配置文件 `aliyun.yaml`，填写 AK/SK（需要云资源的只读权限）和资源所在的 Region 信息：
```yaml
name: aliyun
type: aliyun
config:
  # AccessKey Id
  secret_id: xxxxxxxx ## FIXME: your secret_id
  # AccessKey Secret
  secret_key: xxxxxxx ## FIXME: your secret_key
  include_regions: 华北2（北京） ## The region where deepflow is docked, if it is empty, it means all regions, and the regions are separated by commas
```

使用修改好的配置文件创建公有云 Domain：
```bash
deepflow-ctl domain create -f aliyun.yaml
```

# 部署 DeepFlow Agent

下载包含 deepflow-agent rpm 的 zip 包
```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/rpm/agent/latest/linux/amd64/deepflow-agent-rpm.zip
unzip deepflow-agent-rpm.zip
yum -y localinstall x86_64/deepflow-agent-1.0*.rpm
```

修改 deepflow-agent 的配置文件 `/etc/deepflow-agent.yaml` ：
```yaml
controller-ips:
  - 10.1.2.3  # FIXME: K8s Node IPs of deepflow-server
```

启动 deepflow-agent ：
```bash
systemctl enable deepflow-agent
systemctl restart deepflow-agent
```

# 下一步

- [微服务全景图 - 体验 DeepFlow 基于 BPF 的 AutoMetrics 能力](../auto-metrics/metrics-without-instrumentation/)
- [自动分布式追踪 - 体验 DeepFlow 基于 eBPF 的 AutoTracing 能力](../auto-tracing/tracing-without-instrumentation/)
- [消除数据孤岛 - 了解 DeepFlow 的 AutoTagging 和 SmartEncoding 能力](../auto-tagging/elimilate-data-silos/)
- [告别高基烦恼 - 集成 Promethes 等指标数据](../agent-integration/metrics/metrics-auto-tagging/)
- [无缝分布式追踪 - 集成 OpenTelemetry 等追踪数据](../agent-integration/tracing/tracing-without-blind-spot/)
