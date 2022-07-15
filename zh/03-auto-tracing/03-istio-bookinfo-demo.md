---
title: Istio Bookinfo Demo
---

# 简介

本章以一个由 Java、Python、Ruby、Node.js 四种语言实现的微服务应用为例，展示 MetaFlow 在多语言、Istio 服务网格下的 AutoTracing 能力。

# 部署 Istio Bookinfo Demo

我们使用的 Demo 源自[这个 GitHub 仓库](https://github.com/istio/istio/tree/master/samples/bookinfo)，它的应用架构如下：
![Bookinfo Application with Istio](https://istio.io/latest/docs/examples/bookinfo/withistio.svg)

使用如下命令可在 K8s 中快速部署 Demo：
```bash
kubectl apply -f https://raw.githubusercontent.com/metaflowys/metaflow-demo/main/Istio-Bookinfo/bookinfo.yaml
```

# 查看分布式追踪

TODO
