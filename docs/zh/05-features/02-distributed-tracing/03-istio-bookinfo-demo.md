---
title: Istio Bookinfo Demo
permalink: /features/distributed-tracing/istio-bookinfo-demo
---

# 简介

本章以一个由 Java、Python、Ruby、Node.js 四种语言实现的微服务应用为例，展示 DeepFlow 在多语言、Istio 服务网格下的 AutoTracing 能力。

# 部署 Istio Bookinfo Demo

## 部署 Istio

你可参考 [Istio 官方文档](https://istio.io/latest/zh/docs/setup/getting-started/)部署 Istio。也可以使用如下命令快速部署：
```bash
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH
istioctl install --set profile=demo -y
```

DeepFlow 目前已经支持了 Golang 应用的 HTTPS 采集能力，其他语言的支持还在迭代中。我们在此 Demo 中先关闭 Istio mTLS：
```bash
kubectl apply -f - <<EOF
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: "default"
  namespace: "istio-system"
spec:
  mtls:
    mode: DISABLE
EOF
```

## 部署 Bookinfo Demo

我们使用的 Demo 源自[这个 GitHub 仓库](https://github.com/istio/istio/tree/master/samples/bookinfo)，它的应用架构如下：

![Bookinfo Application with Istio](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/yunshan-ticket/svg/e7e48d8a0700e87de42f72b0d8f9df19_20240112174222.svg)

使用如下命令可在 K8s 中快速部署 Demo：
```bash
kubectl apply -f https://raw.githubusercontent.com/deepflowio/deepflow-demo/main/Istio-Bookinfo/bookinfo.yaml
```

这个 Demo 原始的 GitHub 代码仓库中使用 Jaeger 进行了主动追踪，为了演示 AutoTracing 能力我们特意在上述部署脚本中去掉了 Jaeger。

# 查看分布式追踪

前往 Grafana，打开 `Distributed Tracing` Dashboard，选择 `namespace = deepflow-ebpf-istio-demo` 后，可选择一个调用进行追踪，效果如下图：

![eBPF Istio Demo](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2022082363044b235153a.png)

[访问 DeepFlow Online Demo](https://ce-demo.deepflow.yunshan.net/d/Distributed_Tracing/distributed-tracing?var-namespace=deepflow-ebpf-istio-demo&from=deepflow-doc) 也可查看追踪效果。
上图中的调用链火焰图对应的拓扑图如下。

```mermaid
flowchart TD

loadgenerator_curl_send(1-eBPF: loadgenerator curl send):::loadgenerator
loadgenerator_envoy_egress_recv(2-eBPF: loadgenerator envoy egress recv):::loadgenerator
loadgenerator_envoy_egress_send(3-eBPF: loadgenerator envoy egress send):::loadgenerator
loadgenerator_vnic_send(4-BPF: loadgenerator vnic send):::nic

productpage_vnic_recv(5-BPF: productpage vnic recv):::nic
productpage_envoy_ingress_recv(6-eBPF: productpage envoy ingress recv):::productpage_1
productpage_envoy_ingress_send(7-eBPF: productpage envoy ingress send):::productpage_1
productpage_python_recv(8-eBPF: productpage python recv):::productpage_2
productpage_python_send_d("9-eBPF: productpage python send ->details"):::productpage_2
productpage_envoy_egress_recv_d("10-eBPF: productpage envoy egress recv ->details"):::productpage_2
productpage_envoy_egress_send_d("11-eBPF: productpage envoy egress send ->details"):::productpage_2
productpage_vnic_send_d("12-BPF: productpage vnic send ->details"):::nic
node2_nic_send_pd("13-BPF: node2 nic send prod->details"):::nic
node1_nic_recv_pd("14-BPF: node1 nic recv prod->details"):::nic

details_vnic_recv(15-BPF: details vnic recv):::nic
details_envoy_ingress_recv(16-eBPF: details envoy ingress recv):::details_1
details_envoy_ingress_send(17-eBPF: details envoy ingress send):::details_1
details_ruby_recv(18-eBPF: details ruby recv):::details_2

productpage_python_send_r("19-eBPF: productpage python send prod->review"):::productpage_2
productpage_envoy_egress_recv_r("20-eBPF: productpage envoy egress recv prod->review"):::productpage_2
productpage_envoy_egress_send_r("21-eBPF: productpage envoy egress send prod->review"):::productpage_2
productpage_vnic_send_r("22-BPF: productpage vnic send prod->review"):::nic
node2_nic_send_pr("23-BPF: node2 nic send prod->review"):::nic
node1_nic_recv_pr("24-BPF: node1 nic recv prod->review"):::nic

reviews_vnic_recv(25-BPF: reviews vnic recv):::nic
reviews_envoy_ingress_recv(26-eBPF: reviews envoy ingress recv):::reviews_1
reviews_envoy_ingress_send(27-eBPF: reviews envoy ingress send):::reviews_1
reviews_java_recv(28-eBPF: reviews java recv):::reviews_2
reviews_java_send(29-eBPF: reviews java send):::reviews_2
reviews_envoy_egress_recv(30-eBPF: reviews envoy egress recv):::reviews_2
reviews_envoy_egress_send(31-eBPF: reviews envoy egress send):::reviews_2
reviews_vnic_send(32-BPF: reviews vnic send):::nic
node1_nic_send_rr("33-BPF: node1 nic send reviews->ratings"):::nic
node2_nic_recv_rr("34-BPF: node2 nic recv reviews->ratings"):::nic

ratings_vnic_recv(35-BPF: ratings vnic recv):::nic
ratings_envoy_ingress_recv(36-eBPF: ratings envoy ingress recv):::ratings_1
ratings_envoy_ingress_send(37-eBPF: ratings envoy ingress send):::ratings_1
ratings_nodejs_recv(38-eBPF: ratings node.js recv):::ratings_2

subgraph node2-1 [k8s node2]
    subgraph loadgenerator pod
        subgraph loadgenerator curl container
            loadgenerator_curl_send
        end
        subgraph loadgenerator envoy container
            loadgenerator_envoy_egress_recv
            loadgenerator_envoy_egress_send
        end
    end

    loadgenerator_vnic_send
    productpage_vnic_recv

    subgraph productpage pod
        subgraph productpage envoy container
            productpage_envoy_ingress_recv
            productpage_envoy_ingress_send
            productpage_envoy_egress_recv_d
            productpage_envoy_egress_send_d
            productpage_envoy_egress_recv_r
            productpage_envoy_egress_send_r
        end
        subgraph productpage python container
            productpage_python_recv
            productpage_python_send_d
            productpage_python_send_r
        end
    end

    productpage_vnic_send_d
    productpage_vnic_send_r
    node2_nic_send_pd
    node2_nic_send_pr
end

subgraph node2-2 [k8s node2]
    node2_nic_recv_rr
    ratings_vnic_recv

    subgraph ratings pod
        subgraph ratings envoy container
            ratings_envoy_ingress_recv
            ratings_envoy_ingress_send
        end
        subgraph ratings nodejs container
            ratings_nodejs_recv
        end
    end
end

subgraph k8s node1
    node1_nic_recv_pd
    node1_nic_recv_pr
    details_vnic_recv
    reviews_vnic_recv

    subgraph details pod
        subgraph details envoy container
            details_envoy_ingress_recv
            details_envoy_ingress_send
        end
        subgraph details ruby container
            details_ruby_recv
        end
    end
    subgraph reviews pod
        subgraph reviews envoy container
            reviews_envoy_ingress_recv
            reviews_envoy_ingress_send
            reviews_envoy_egress_recv
            reviews_envoy_egress_send
        end
        subgraph reviews java container
            reviews_java_recv
            reviews_java_send
        end
    end

    reviews_vnic_send
    node1_nic_send_rr
end

loadgenerator_curl_send --> loadgenerator_envoy_egress_recv --> loadgenerator_envoy_egress_send --> loadgenerator_vnic_send --> productpage_vnic_recv

productpage_vnic_recv --> productpage_envoy_ingress_recv --> productpage_envoy_ingress_send --> productpage_python_recv
productpage_python_recv --> productpage_python_send_d --> productpage_envoy_egress_recv_d --> productpage_envoy_egress_send_d --> productpage_vnic_send_d --> node2_nic_send_pd -->|IPIP encap| node1_nic_recv_pd --> details_vnic_recv
productpage_python_recv --> productpage_python_send_r --> productpage_envoy_egress_recv_r --> productpage_envoy_egress_send_r --> productpage_vnic_send_r --> node2_nic_send_pr -->|IPIP encap| node1_nic_recv_pr --> reviews_vnic_recv

details_vnic_recv --> details_envoy_ingress_recv --> details_envoy_ingress_send --> details_ruby_recv

reviews_vnic_recv --> reviews_envoy_ingress_recv --> reviews_envoy_ingress_send --> reviews_java_recv
reviews_java_recv --> reviews_java_send --> reviews_envoy_egress_recv --> reviews_envoy_egress_send --> reviews_vnic_send --> node1_nic_send_rr -->|IPIP encap| node2_nic_recv_rr --> ratings_vnic_recv

ratings_vnic_recv --> ratings_envoy_ingress_recv --> ratings_envoy_ingress_send --> ratings_nodejs_recv

classDef loadgenerator fill:#8498d1,color:white;
classDef nic fill:#a1a1a1,color:white;
classDef productpage_1 fill:#9cdbc3,color:black;
classDef productpage_2 fill:#eadb92,color:black;
classDef details_1 fill:#16a9e8,color:white;
classDef details_2 fill:#b38ebc,color:white;
classDef reviews_1 fill:#49b292,color:white;
classDef reviews_2 fill:#ceb961,color:black;
classDef ratings_1 fill:#6aaec6,color:black;
classDef ratings_2 fill:#aa48bc,color:black;
```

对这个追踪 Demo 我们总结一下：
- 零插码：整个追踪过程不需要手动插入任何追踪代码，不需要向 HTTP Header 中注入任何 TraceID/SpanID
- 多语言：支持对 Java、Python、Ruby、NodeJS 语言应用及 C/C++（curl/envoy）语言基础服务的追踪
- 全链路：利用 eBPF 和 BPF，自动追踪到了这个 Trace 的 38 个 Span，含 24 个 eBPF Span、14 个 BPF Span
- 全栈：支持追踪同 K8s Node 上两个 Pod 之间的网络路径，例如 Span 4-5 等
- 全栈：支持追踪跨 K8s Node 上两个 Pod 之间的网络路径，即使中间经过了隧道封装，例如 Span 12-15 等（IPIP 隧道封装）
- 全栈：支持追踪一个 Pod 内部从 Envoy Ingress、服务进程、Envoy Egress 的全过程，例如 Span 6-11 等
