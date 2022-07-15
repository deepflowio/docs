---
title: 集成 OpenTelemetry 数据
---

# 数据流

```mermaid
flowchart TD

subgraph K8s-Cluster
  subgraph AppPod
    OTelSDK1["otel-sdk / otel-javaagent"]
  end
  OTelAgent1["otel-agent (daemonset)"]
  MetaFlowAgent1["metaflow-agent (daemonset)"]
  MetaFlowServer["metaflow-server (statefulset)"]

  OTelSDK1 -->|traces| OTelAgent1
  OTelAgent1 -->|traces| MetaFlowAgent1
  MetaFlowAgent1 -->|traces| MetaFlowServer
end

subgraph Host
  subgraph AppProcess
    OTelSDK2["otel-sdk / otel-javaagent"]
  end
  OTelAgent2[otel-agent]
  MetaFlowAgent2[metaflow-agent]

  OTelSDK2 -->|traces| OTelAgent2
  OTelAgent2 -->|traces| MetaFlowAgent2
  MetaFlowAgent2 -->|traces| MetaFlowServer
end
```

# 安装OpenTelemetry

- 了解[OpenTelemetry](https://opentelemetry.io/docs/)相关知识。

- 使用[MetaFlow-Demo](https://github.com/metaflowys/metaflow-demo)下的部署清单，快速搭建起一个 OpenTelemetry 环境：

  ```bash
  $ kubectl create ns open-telemetry
  $ kubectl apply -n open-telemetry -f https://raw.githubusercontent.com/metaflowys/metaflow-demo/main/OpenTelemetry/open-telemetry.yaml
  ```

  - 安装完毕之后，可以在环境里看到这样一个组件清单

  ```bash
  $ kubectl get all -n open-telemetry
  ```

  | Type | Component |
  | --- | --- |
  | Daemonset | otel-agent | 
  | Service | otel-agent |
  | ConfigMap | otel-agent |

  - 其中，如果你需要使用其他版本或更新的 opentelemetry-collector-contrib ，请在[otel-docker](https://hub.docker.com/r/otel/opentelemetry-collector-contrib/tags)仓库中，找到你想要的镜像版本，然后使用如下命令更新镜像

  ```bash
  $ kubectl set image -n open-telemetry daemonset/otel-agent otel-agent=otel/opentelemetry-collector-contrib:${LASTEST_TAG}
  ```

- 对接 MetaFlow
  - 查看对接 MetaFlow 的地址：

  ```bash
  $ kubectl get cm -n open-telemetry otel-agent-conf -o custom-columns=DATA:.data | grep -A 1 otlphttp
  ```
  - 可在[配置MetaFlow](#配置-metaflow)一节中，检查配置与实际监听的端口是否一致。

# 配置 MetaFlow

- 在部署了 MetaFlow-Ctl 的宿主机上，执行如下命令，开启 MetaFlow Agent 的数据监听服务：

```bash
$ export VTAP_GROUP_ID=$(metaflow-ctl agent-group list  | awk 'NR>1 {print $2}')

$ cat > agent.yaml << EOF
vtap_group_id: ${VTAP_GROUP_ID}
external_agent_http_proxy_enabled: 1
external_agent_http_proxy_port: 38086
EOF

$ metaflow-ctl agent-group-config update ${VTAP_GROUP_ID} -f agent.yaml
```

# 基于 Spring Boot Demo 体验

## 部署Spring Boot Otel Demo

```bash
$ kubectl create ns metaflow-otel-spring-demo
$ kubectl apply -n metaflow-otel-spring-demo -f https://raw.githubusercontent.com/metaflowys/metaflow-demo/main/Spring-Boot-Demo/springboot-otel-demo.yaml
```

## 关于Demo

- 此Demo来源于 https://github.com/liuzhibin-cn/my-demo ，可参考应用架构如下：

![image](https://camo.githubusercontent.com/a3ea4d518362321ddafa7f92223d2790d5086f5c4fd9a8feadfb76602ae6fe84/68747470733a2f2f7269636869652d6c656f2e6769746875622e696f2f79647265732f696d672f31302f3138302f313031342f6172636869746563747572652e706e67)


# 基于 OpenTelemetry WebStore Demo 体验

## 部署OpenTelemetry WebStore Demo

```bash
$ kubectl create ns metaflow-otel-grpc-demo
$ kubectl apply -n metaflow-otel-grpc-demo -f https://raw.githubusercontent.com/metaflowys/metaflow-demo/main/OpenTelemetry-WebStore-Demo/otel-webstore-demo.yaml
```

## 关于Demo

- 此demo来源于 [opentelemetry-webstore-demo](https://github.com/open-telemetry/opentelemetry-demo-webstore)，可参考应用调用架构如下：

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
