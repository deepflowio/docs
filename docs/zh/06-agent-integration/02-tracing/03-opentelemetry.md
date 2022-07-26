---
title: 集成 OpenTelemetry 数据
permalink: /agent-integration/tracing/opentelemetry
---

# 数据流

```mermaid
flowchart TD

subgraph K8s-Cluster
  subgraph AppPod
    OTelSDK1["otel-sdk / otel-javaagent"]
  end
  OTelAgent1["otel-collector (agent mode, daemonset)"]
  DeepFlowAgent1["deepflow-agent (daemonset)"]
  DeepFlowServer["deepflow-server (statefulset)"]

  OTelSDK1 -->|traces| OTelAgent1
  OTelAgent1 -->|traces| DeepFlowAgent1
  DeepFlowAgent1 -->|traces| DeepFlowServer
end

subgraph Host
  subgraph AppProcess
    OTelSDK2["otel-sdk / otel-javaagent"]
  end
  OTelAgent2["otel-collector (agent mode)"]
  DeepFlowAgent2[deepflow-agent]

  OTelSDK2 -->|traces| OTelAgent2
  OTelAgent2 -->|traces| DeepFlowAgent2
  DeepFlowAgent2 -->|traces| DeepFlowServer
end
```

# 配置 OpenTelemetry

我们推荐使用 agent 模式的 otel-collector 向 deepflow-agent 发送 trace 数据，以避免数据跨 K8s 节点传输。
当然使用 gateway 模式的 otel-collector 也是完全可行的。以下的文档中以 otel-agent 为例介绍部署和配置方法。

## 安装 otel-agent

查看 [OpenTelemetry 文档](https://opentelemetry.io/docs/) 可了解相关背景知识。
如果你的环境中还没有 OpenTelemetry，可以使用如下命令在 `open-telemetry` 命名空间中快速部署一个 otel-agent DaesmonSet：
```bash
kubectl apply -n open-telemetry -f https://raw.githubusercontent.com/deepflowys/deepflow-demo/main/open-telemetry/open-telemetry.yaml
```

安装完毕之后，可以在环境里看到这样一个组件清单：
```bash
kubectl get all -n open-telemetry
```

| Type | Component |
| --- | --- |
| Daemonset | otel-agent |
| Service | otel-agent |
| ConfigMap | otel-agent |

如果你需要使用其他版本或更新的 opentelemetry-collector-contrib，
请在 [otel-docker](https://hub.docker.com/r/otel/opentelemetry-collector-contrib/tags) 仓库中，
找到你想要的镜像版本，然后使用如下命令更新镜像：
```bash
LATEST_TAG="xxx"  # FIXME

kubectl set image -n open-telemetry daemonset/otel-agent otel-agent=otel/opentelemetry-collector-contrib:${LATEST_TAG}
```

## 配置 otel-agent

我们需要配置 otel-agent ConfigMap 中的 `otel-agent-config.exporters.otlphttp`，将 trace 发送至 DeepFlow。首先查询当前配置：
```bash
kubectl get cm -n open-telemetry otel-agent-conf -o custom-columns=DATA:.data | \
    grep -A 5 otlphttp:
```

deepflow-agent 使用 NodePort 接收 trace，默认端口为 38086，将 otel-agent 的配置进行修改：
```yaml
otlphttp:
  traces_endpoint: "http://${HOST_IP}:38086/api/v1/otel/trace"
  tls:
    insecure: true
  retry_on_failure:
    enabled: true
```

# 配置 DeepFlow

接下来我们需要开启 deepflow-agent 的数据接收服务。

首先我们确定 deepflow-agent 所在的采集器组 ID，一般为名为 default 的组的ID：
```bash
deepflow-ctl agent-group list
```

确认该采集器组是否已经有了配置：
```bash
deepflow-ctl agent-group-config list
```

若已有配置，将其导出至 yaml 文件中便于进行修改：
```bash
deepflow-ctl agent-group-config list <your-agent-group-id> > your-agent-group-config.yaml
```

修改 yaml 文件，确认包含如下配置项：
```bash
vtap_group_id: <your-agent-group-id>
external_agent_http_proxy_enabled: 1   # required
external_agent_http_proxy_port: 38086  # optional, default 38086
```

更新采集器组的配置：
```
deepflow-ctl agent-group-config update <your-agent-group-id> -f your-agent-group-config.yaml
```

如果采集器组还没有配置，可使用如下命令基于 your-agent-group-config.yaml 文件新建配置：
```bash
deepflow-ctl agent-group-config create -f your-agent-group-config.yaml
```

# 基于 Spring Boot Demo 体验

## 部署 Demo

此Demo来源于 [这个 GitHub 仓库](https://github.com/liuzhibin-cn/my-demo)，这是一个基于 Spring Boot 编写的由五个微服务组成的 WebShop 应用，其架构如下：

![Sping Boot Demo Architecture](./imgs/spring-boot-webshop-arch.png)

使用如下命令可以一键部署这个 Demo：
```bash
kubectl apply -n deepflow-otel-spring-demo -f https://raw.githubusercontent.com/deepflowys/deepflow-demo/main/DeepFlow-Otel-Spring-Demo/deepflow-otel-spring-demo.yaml
```

## 查看追踪数据

前往 Grafana，打开 `Distributed Tracing` Dashboard，选择 `namespace = deepflow-otel-spring-demo` 后，可选择一个调用进行追踪。
DeepFlow 能够将 OpenTelemetry、eBPF、BPF 获取到的追踪数据关联展示在一个 Trace 火焰图中，
覆盖一个 Spring Boot 应用从业务代码、系统函数、网络接口的全栈调用路径，实现真正的全链路分布式追踪，效果如下：

![OTel Spring Demo](./imgs/otel-spring-demo.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-otel-spring-demo&from=deepflow-doc) 查看效果。
上图中的调用链火焰图对应的拓扑图如下。

```mermaid
flowchart TD

loadgenerator_locust_send(1-eBPF: loadgenerator locust send):::loadgenerator
loadgenerator_vnic_send(2-BPF: loadgenerator vnic send):::nic
node1_nic_send_lw("3-BPF: node1 nic send loadgen->webshop"):::nic
node0_nic_recv_lw("4-BPF: node0 nic recv loadgen->webshop"):::nic

webshop_vnic_recv(5-BPF: web-shop vnic recv):::nic
webshop_java_recv(6-eBPF: web-shop java recv):::webshop_1
webshop_otel_span_fulltest_1(7-OTel: web-shop otel span full-test-1):::webshop_2
webshop_otel_span_fulltest_2(8-OTel: web-shop otel span full-test-2):::webshop_2
webshop_otel_span_register_1(9-OTel: web-shop otel span register-1):::webshop_2
webshop_otel_span_register_2(10-OTel: web-shop otel span register-2):::webshop_1
webshop_otel_span_register_3(11-OTel: web-shop otel span register-3):::webshop_1
webshop_java_send_register(12-eBPF: web-shop java send register):::webshop_1
webshop_vnic_send_register(13-BPF: web-shop vnic send register):::nic
node0_nic_send_register(14-BPF: node0 nic send register):::nic
node1_nic_recv_register(15-BPF: node1 nic recv register):::nic
svcuser_vnic_recv_register(16-BPF: svc-user vnic recv register):::nic
svcuser_java_recv_register(17-eBPF: svc-user java recv register):::svcuser
svcuser_otel_span_register_1(18-OTel: svc-user otel span register-1):::svcuser
svcuser_otel_span_register_2(19-OTel: svc-user otel span register-2):::svcuser
svcuser_otel_span_register_3(20-OTel: svc-user otel span register-3):::svcuser
svcuser_otel_span_register_sql_1(21-OTel: svc-user otel span register sql-1):::svcuser
svcuser_otel_span_register_sql_2(22-OTel: svc-user otel span register sql-2):::svcuser
svcuser_otel_span_register_sql_3(23-OTel: svc-user otel span register sql-3):::svcuser

webshop_otel_span_login_1(24-OTel: web-shop otel span login-1):::webshop_2
webshop_otel_span_login_2(25-OTel: web-shop otel span login-2):::webshop_1
webshop_otel_span_login_3(26-OTel: web-shop otel span login-3):::webshop_1
webshop_java_send_login(27-eBPF: web-shop java send login):::webshop_1
webshop_vnic_send_login(28-BPF: web-shop vnic send login):::nic
node0_nic_send_login(29-BPF: node0 nic send login):::nic
node1_nic_recv_login(30-BPF: node1 nic recv login):::nic
svcuser_vnic_recv_login(31-BPF: svc-user vnic recv login):::nic
svcuser_java_recv_login(32-eBPF: svc-user java recv login):::svcuser
svcuser_otel_span_login_1(33-OTel: svc-user otel span login-1):::svcuser
svcuser_otel_span_login_2(34-OTel: svc-user otel span login-2):::svcuser
svcuser_otel_span_login_3(35-OTel: svc-user otel span login-3):::svcuser
svcuser_otel_span_login_sql_1(36-OTel: svc-user otel span login sql-1):::svcuser
svcuser_otel_span_login_sql_2(37-OTel: svc-user otel span login sql-2):::svcuser

webshop_otel_span_finditem_1(38-OTel: web-shop otel span finditem-1):::webshop_2
webshop_otel_span_finditem_2(39-OTel: web-shop otel span finditem-2):::webshop_1
webshop_otel_span_finditem_3(40-OTel: web-shop otel span finditem-3):::webshop_1
webshop_java_send_finditem(41-eBPF: web-shop java send finditem):::webshop_1
webshop_vnic_send_finditem(42-BPF: web-shop vnic send finditem):::nic
node0_nic_send_finditem(43-BPF: node0 nic send finditem):::nic
node1_nic_recv_finditem(44-BPF: node1 nic recv finditem):::nic
svcitem_vnic_recv_finditem(45-BPF: svc-item vnic recv finditem):::nic
svcitem_java_recv_finditem(46-eBPF: svc-item java recv finditem):::svcitem
svcitem_otel_span_finditem_1(47-OTel: svc-item otel span finditem-1):::svcitem
svcitem_otel_span_finditem_2(48-OTel: svc-item otel span finditem-2):::svcitem
svcitem_otel_span_finditem_3(49-OTel: svc-item otel span finditem-3):::svcitem

webshop_otel_span_createorder_1(50-OTel: web-shop otel span createorder-1):::webshop_2
webshop_otel_span_createorder_2(51-OTel: web-shop otel span createorder-2):::webshop_1
webshop_otel_span_createorder_3(52-OTel: web-shop otel span createorder-3):::webshop_1
webshop_java_send_createorder(53-eBPF: web-shop java send createorder):::webshop_1
webshop_vnic_send_createorder(54-BPF: web-shop vnic send createorder):::nic
node0_nic_send_createorder(55-BPF: node0 nic send createorder):::nic
node2_nic_recv_createorder(56-BPF: node2 nic recv createorder):::nic
svcorder_vnic_recv_createorder(57-BPF: svc-order vnic recv createorder):::nic
svcorder_java_recv_createorder(58-eBPF: svc-order java recv createorder):::svcorder
svcorder_otel_span_createorder_1(59-OTel: svc-order otel span createorder-1):::svcorder
svcorder_otel_span_createorder_2(60-OTel: svc-order otel span createorder-2):::svcorder
svcorder_otel_span_createorder_3(61-OTel: svc-order otel span createorder-3):::svcorder

svcorder_otel_span_getitem_1(62-OTel: svc-order otel span getitem-1):::svcorder
svcorder_otel_span_getitem_2(63-OTel: svc-order otel span getitem-2):::svcorder
svcorder_java_send_sql_1(64-eBPF: svc-order java send sql-1):::svcorder
dbdemo_mysql_recv_sql_1(65-eBPF: db-demo mysql recv sql-1):::dbdemo

svcorder_java_send_getitem(66-eBPF: svc-order java send getitem):::svcorder
svcorder_vnic_send_getitem(67-BPF: svc-order vnic send getitem):::nic
node2_nic_send_getitem(68-BPF: node2 nic send getitem):::nic
node1_nic_recv_getitem(69-BPF: node0 nic recv getitem):::nic
svcitem_vnic_recv_getitem(70-BPF: svc-item vnic recv getitem):::nic
svcitem_java_recv_getitem(71-eBPF: svc-item java recv getitem):::svcitem
svcitem_otel_span_getitem_1(72-OTel: svc-item otel span getitem-1):::svcitem
svcitem_otel_span_getitem_2(73-OTel: svc-item otel span getitem-2):::svcitem
svcitem_otel_span_getitem_3(74-OTel: svc-item otel span getitem-3):::svcitem

svcorder_otel_span_getitem_3(75-OTel: svc-order otel span getitem-3):::svcorder
svcorder_otel_span_getitem_4(76-OTel: svc-order otel span getitem-4):::svcorder
svcorder_java_send_getitem_2(77-eBPF: svc-order java send getitem-2):::svcorder
svcorder_vnic_send_getitem_2(78-BPF: svc-order vnic send getitem-2):::nic
node2_nic_send_getitem_2(79-BPF: node2 nic send getitem-2):::nic
node1_nic_recv_getitem_2(80-BPF: node0 nic recv getitem-2):::nic
svcitem_vnic_recv_getitem_2(81-BPF: svc-item vnic recv getitem-2):::nic
svcitem_java_recv_getitem_2(82-eBPF: svc-item java recv getitem-2):::svcitem
svcitem_otel_span_getitem_4(83-OTel: svc-item otel span getitem-4):::svcitem
svcitem_otel_span_getitem_5(84-OTel: svc-item otel span getitem-5):::svcitem
svcitem_otel_span_getitem_6(85-OTel: svc-item otel span getitem-6):::svcitem

svcorder_otel_span_getstock_1(86-OTel: svc-order otel span getstock-1):::svcorder
svcorder_otel_span_getstock_2(87-OTel: svc-order otel span getstock-2):::svcorder
svcorder_java_send_getstock(88-eBPF: svc-order java send getstock):::svcorder
svcorder_vnic_send_getstock(89-BPF: svc-order vnic send getstock):::nic
svcstock_vnic_recv_getstock(90-BPF: svc-stock vnic recv getstock):::nic
svcstock_java_recv_getstock(91-eBPF: svc-stock java recv getstock):::svcstock
svcstock_otel_span_getstock_1(92-OTel: svc-stock otel span getstock-1):::svcstock
svcstock_otel_span_getstock_2(93-OTel: svc-stock otel span getstock-2):::svcstock
svcstock_otel_span_getstock_3(94-OTel: svc-stock otel span getstock-3):::svcstock

svcorder_java_send_sql_2(95-eBPF: svc-order java send sql-2):::svcorder
dbdemo_mysql_recv_sql_2(96-eBPF: db-demo mysql recv sql-2):::dbdemo

subgraph node1-1 [k8s node1]
    subgraph loadgenerator pod
        loadgenerator_locust_send
    end

    loadgenerator_vnic_send
    node1_nic_send_lw
end

subgraph k8s node0
    node0_nic_recv_lw
    webshop_vnic_recv

    subgraph web-shop pod
        webshop_java_recv

        webshop_otel_span_fulltest_1
        webshop_otel_span_fulltest_2
        webshop_otel_span_register_1
        webshop_otel_span_register_2
        webshop_otel_span_register_3
        webshop_java_send_register

        webshop_otel_span_login_1
        webshop_otel_span_login_2
        webshop_otel_span_login_3
        webshop_java_send_login

        webshop_otel_span_finditem_1
        webshop_otel_span_finditem_2
        webshop_otel_span_finditem_3
        webshop_java_send_finditem

        webshop_otel_span_createorder_1
        webshop_otel_span_createorder_2
        webshop_otel_span_createorder_3
        webshop_java_send_createorder
    end

    webshop_vnic_send_register
    webshop_vnic_send_login
    webshop_vnic_send_finditem
    webshop_vnic_send_createorder

    node0_nic_send_register
    node0_nic_send_login
    node0_nic_send_finditem
    node0_nic_send_createorder
end

subgraph node1-2 [k8s node1]
    node1_nic_recv_register
    node1_nic_recv_login
    node1_nic_recv_finditem

    svcuser_vnic_recv_register
    svcuser_vnic_recv_login
    svcitem_vnic_recv_finditem

    subgraph svc-user pod
        svcuser_java_recv_register
        svcuser_otel_span_register_1
        svcuser_otel_span_register_2
        svcuser_otel_span_register_3
        svcuser_otel_span_register_sql_1
        svcuser_otel_span_register_sql_2
        svcuser_otel_span_register_sql_3

        svcuser_java_recv_login
        svcuser_otel_span_login_1
        svcuser_otel_span_login_2
        svcuser_otel_span_login_3
        svcuser_otel_span_login_sql_1
        svcuser_otel_span_login_sql_2
    end

    subgraph svc-item pod
        svcitem_java_recv_finditem
        svcitem_otel_span_finditem_1
        svcitem_otel_span_finditem_2
        svcitem_otel_span_finditem_3

        svcitem_java_recv_getitem
        svcitem_otel_span_getitem_1
        svcitem_otel_span_getitem_2
        svcitem_otel_span_getitem_3

        svcitem_java_recv_getitem_2
        svcitem_otel_span_getitem_4
        svcitem_otel_span_getitem_5
        svcitem_otel_span_getitem_6
    end

    node1_nic_recv_getitem
    node1_nic_recv_getitem_2
    svcitem_vnic_recv_getitem
    svcitem_vnic_recv_getitem_2
end

subgraph k8s node2
    node2_nic_recv_createorder
    svcorder_vnic_recv_createorder

    subgraph svc-order pod
        svcorder_java_recv_createorder
        svcorder_otel_span_createorder_1
        svcorder_otel_span_createorder_2
        svcorder_otel_span_createorder_3

        svcorder_otel_span_getitem_1
        svcorder_otel_span_getitem_2

        svcorder_java_send_sql_1
        svcorder_java_send_getitem

        svcorder_otel_span_getitem_3
        svcorder_otel_span_getitem_4
        svcorder_java_send_getitem_2

        svcorder_otel_span_getstock_1
        svcorder_otel_span_getstock_2
        svcorder_java_send_getstock

        svcorder_java_send_sql_2
    end

    svcorder_vnic_send_getitem
    svcorder_vnic_send_getitem_2
    svcorder_vnic_send_getstock
    svcstock_vnic_recv_getstock

    subgraph svc-stock pod
        svcstock_java_recv_getstock
        svcstock_otel_span_getstock_1
        svcstock_otel_span_getstock_2
        svcstock_otel_span_getstock_3
    end

    subgraph db-demo pod
        dbdemo_mysql_recv_sql_1
        dbdemo_mysql_recv_sql_2
    end

    node2_nic_send_getitem
    node2_nic_send_getitem_2
end

loadgenerator_locust_send --> loadgenerator_vnic_send --> node1_nic_send_lw -->|IPIP encap| node0_nic_recv_lw --> webshop_vnic_recv --> webshop_java_recv --> webshop_otel_span_fulltest_1 --> webshop_otel_span_fulltest_2

webshop_otel_span_fulltest_2 --> webshop_otel_span_register_1 --> webshop_otel_span_register_2 --> webshop_otel_span_register_3 --> webshop_java_send_register --> webshop_vnic_send_register --> node0_nic_send_register -->|IPIP encap| node1_nic_recv_register --> svcuser_vnic_recv_register

svcuser_vnic_recv_register --> svcuser_java_recv_register --> svcuser_otel_span_register_1 --> svcuser_otel_span_register_2 --> svcuser_otel_span_register_3 --> svcuser_otel_span_register_sql_1
svcuser_otel_span_register_3 --> svcuser_otel_span_register_sql_2
svcuser_otel_span_register_3 --> svcuser_otel_span_register_sql_3

webshop_otel_span_fulltest_2 --> webshop_otel_span_login_1 --> webshop_otel_span_login_2 --> webshop_otel_span_login_3 --> webshop_java_send_login --> webshop_vnic_send_login --> node0_nic_send_login -->|IPIP encap| node1_nic_recv_login --> svcuser_vnic_recv_login

svcuser_vnic_recv_login --> svcuser_java_recv_login --> svcuser_otel_span_login_1 --> svcuser_otel_span_login_2 --> svcuser_otel_span_login_3 --> svcuser_otel_span_login_sql_1
svcuser_otel_span_login_3 --> svcuser_otel_span_login_sql_2

webshop_otel_span_fulltest_2 --> webshop_otel_span_finditem_1 --> webshop_otel_span_finditem_2 --> webshop_otel_span_finditem_3 --> webshop_java_send_finditem --> webshop_vnic_send_finditem --> node0_nic_send_finditem -->|IPIP encap| node1_nic_recv_finditem --> svcitem_vnic_recv_finditem

svcitem_vnic_recv_finditem --> svcitem_java_recv_finditem --> svcitem_otel_span_finditem_1 --> svcitem_otel_span_finditem_2 --> svcitem_otel_span_finditem_3

webshop_otel_span_fulltest_2 --> webshop_otel_span_createorder_1 --> webshop_otel_span_createorder_2 --> webshop_otel_span_createorder_3 --> webshop_java_send_createorder --> webshop_vnic_send_createorder --> node0_nic_send_createorder -->|IPIP encap| node2_nic_recv_createorder --> svcorder_vnic_recv_createorder

svcorder_vnic_recv_createorder --> svcorder_java_recv_createorder --> svcorder_otel_span_createorder_1 --> svcorder_otel_span_createorder_2 --> svcorder_otel_span_createorder_3

svcorder_otel_span_createorder_3--> svcorder_otel_span_getitem_1 --> svcorder_otel_span_getitem_2 --> svcorder_java_send_sql_1 --> dbdemo_mysql_recv_sql_1

svcorder_otel_span_getitem_2 --> svcorder_java_send_getitem --> svcorder_vnic_send_getitem --> node2_nic_send_getitem -->|IPIP encap| node1_nic_recv_getitem --> svcitem_vnic_recv_getitem

svcitem_vnic_recv_getitem --> svcitem_java_recv_getitem --> svcitem_otel_span_getitem_1 --> svcitem_otel_span_getitem_2 --> svcitem_otel_span_getitem_3

svcorder_otel_span_createorder_3--> svcorder_otel_span_getitem_3 --> svcorder_otel_span_getitem_4 --> svcorder_java_send_getitem_2 --> svcorder_vnic_send_getitem_2 --> node2_nic_send_getitem_2 -->|IPIP encap| node1_nic_recv_getitem_2 --> svcitem_vnic_recv_getitem_2

svcitem_vnic_recv_getitem_2 --> svcitem_java_recv_getitem_2 --> svcitem_otel_span_getitem_4 --> svcitem_otel_span_getitem_5 --> svcitem_otel_span_getitem_6

svcorder_otel_span_createorder_3--> svcorder_otel_span_getstock_1 --> svcorder_otel_span_getstock_2 --> svcorder_java_send_getstock --> svcorder_vnic_send_getstock --> svcstock_vnic_recv_getstock

svcstock_vnic_recv_getstock  --> svcstock_java_recv_getstock --> svcstock_otel_span_getstock_1 --> svcstock_otel_span_getstock_2 --> svcstock_otel_span_getstock_3

svcorder_otel_span_getstock_2 --> svcorder_java_send_sql_2 --> dbdemo_mysql_recv_sql_2

classDef loadgenerator fill:#ceb961,color:black;
classDef nic fill:#a1a1a1,color:white;
classDef webshop_1 fill:#8498d1,color:white;
classDef webshop_2 fill:#45b0d6,color:white;
classDef svcuser fill:#9cdbc3,color:black;
classDef svcorder fill:#16a9e8,color:white;
classDef svcitem fill:#eadbc4,color:black;
classDef svcstock fill:#49b292,color:white;
classDef dbdemo fill:#aa48bc,color:black;
```

对这个追踪 Demo 我们总结一下：
- 集成 OTel、eBPF 和 BPF，自动追踪到了这个 Trace 的 96 个 Span，含 20 个 eBPF Span、30 个 BPF Span
- 对 OTel 无插码的服务，支持通过 eBPF 自动追踪补齐，例如 Span 1-6（loadgenerator）等
- 对 OTel 无法插码的服务，支持通过 eBPF 自动追踪补齐，例如 Span 65、96 的 eBPF Span 描绘出了 MySQL Transaction 的开始和结束（SET autocommit、commit）
- 支持追踪同 K8s Node 上两个 Pod 之间的网络路径，例如 Span 89-90 等
- 支持追踪跨 K8s Node 上两个 Pod 之间的网络路径，即使中间经过了隧道封装，例如 Span 2-5 等（IPIP 隧道封装）
- eBPF 和 BPF Span 穿插在 OTel Span 之间，让追踪无盲点，例如 eBPF Span 12、27、41、53 与它们的父 Span（OTel）的显著时差可用于确定真实的性能瓶颈，避免上下游应用开发团队的迷惑

# 基于 OpenTelemetry WebStore Demo 体验

## 部署 Demo

此 Demo 来源于 [opentelemetry-webstore-demo](https://github.com/open-telemetry/opentelemetry-demo-webstore)，
这个 Demo 由 Go、C#、Node.js、Python、Java 等语言实现的十多个微服务组成，它的应用架构如下：
```mermaid
graph TD
  subgraph Service Diagram
  adservice(Ad Service):::java
  cache[(Cache<br/>&#40redis&#41)]
  cartservice(Cart Service):::dotnet
  checkoutservice(Checkout Service):::golang
  currencyservice(Currency Service):::nodejs
  emailservice(Email Service):::ruby
  frontend(Frontend):::golang
  loadgenerator([Load Generator]):::python
  paymentservice(Payment Service):::nodejs
  productcatalogservice(ProductCatalog Service):::golang
  recommendationservice(Recommendation Service):::python
  shippingservice(Shipping Service):::golang

  Internet -->|HTTP| frontend
  loadgenerator -->|HTTP| frontend

  checkoutservice --> cartservice --> cache
  checkoutservice --> productcatalogservice
  checkoutservice --> currencyservice
  checkoutservice --> emailservice
  checkoutservice --> paymentservice
  checkoutservice --> shippingservice

  frontend --> adservice
  frontend --> cartservice
  frontend --> productcatalogservice
  frontend --> checkoutservice
  frontend --> currencyservice
  frontend --> recommendationservice --> productcatalogservice
  frontend --> shippingservice
end

classDef java fill:#b07219,color:white;
classDef dotnet fill:#178600,color:white;
classDef golang fill:#00add8,color:black;
classDef cpp fill:#f34b7d,color:white;
classDef ruby fill:#701516,color:white;
classDef python fill:#3572A5,color:white;
classDef nodejs fill:#f1e05a,color:black;
classDef rust fill:#dea584,color:black;
classDef erlang fill:#b83998,color:white;
classDef php fill:#4f5d95,color:white;
```

使用如下命令可以一键部署这个 Demo：
```bash
kubectl apply -n deepflow-otel-grpc-demo -f https://raw.githubusercontent.com/deepflowys/deepflow-demo/main/DeepFlow-Otel-Grpc-Demo/deepflow-otel-grpc-demo.yaml
```

## 查看追踪数据

前往 Grafana，打开 `Distributed Tracing` Dashboard，选择 `namespace = deepflow-otel-grpc-demo` 后，可选择一个调用进行追踪。
DeepFlow 能够将 OpenTelemetry、eBPF、BPF 获取到的追踪数据关联展示在一个 Trace 火焰图中，
覆盖一个多语言应用从业务代码、系统函数、网络接口的全栈调用路径，实现真正的全链路分布式追踪，效果如下：

![OTel gRPC Demo](./imgs/otel-grpc-demo.png)

你也可以访问 [DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-otel-grpc-demo&from=deepflow-doc) 查看效果。
