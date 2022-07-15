---
title: Spring Boot Demo
---

# 简介

本章以一个使用 Spring Boot 开发的微服务应用为例，展示 MetaFlow 的 AutoTracing 能力。

# 部署 Spring Boot Demo

我们使用的 Demo 源自[这个 GitHub 仓库](https://github.com/chanjarster/spring-boot-istio-jaeger-demo)，
它的调用链比较简单：`foo_svc -> bar_svc -> loo_svc -> redis`。

使用如下命令可在 K8s 中快速部署 Demo：
```bash
kubectl apply -f https://raw.githubusercontent.com/metaflowys/metaflow-demo/main/MetaFlow-EBPF-Sping-Demo/metaflow-ebpf-spring-demo.yaml
```

# 查看分布式追踪

TODO
