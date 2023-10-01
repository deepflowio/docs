---
title: Server 性能调优
permalink: /diagnose/how-to-profile-deepflow-server-ingester
---

# 简介

通过 [Golang Profile](https://go.dev/blog/pprof)，我们可以捕获 DeepFlow Server 的数据写入性能进行分析并优化。

# 步骤

1. 安装 [deepflow-ctl](../install/upgrade/#%E5%8D%87%E7%BA%A7-deepflow-cli) 工具。
2. 找到需要 Profile 分析的 DeepFlow Server Pod IP，如果 DeepFlow Server 的副本数大于1，从中挑任意一个即可：
```bash
deepflow_server_pod_ip=$(kubectl -n deepflow get pods -o wide | grep deepflow-server | awk '{print $6}')
```
3. 开启 Profile 功能：
```bash
deepflow-ctl -i $deepflow_server_pod_ip ingester profiler on
```

# 获取 CPU Profile

```bash
go tool pprof http://$deepflow_server_pod_ip:9526/debug/pprof/profile
```
执行命令后，默认采样时间为 30s，可通过 `http://$deepflow_server_pod_ip:9526/debug/pprof/profile?seconds=60` 即带上 `seconds=x` 参数修改 Profile 时长，Profile 结束后，可输入 `svg` 命令生成矢量图格式的 Profile 结果图，并复制到本地通过浏览器查看。

# 获取 Memory Profile
```bash
go tool pprof http://$deepflow_server_pod_ip:9526/debug/pprof/heap
```
执行命令后，会进行实时采样，获取当前的内存快照，然后同样可输入 `svg` 命令生成矢量图格式的 Profile 结果图，并复制到本地通过浏览器查看。

# 其他 Profile 信息

如果还想获取其他 Profile 信息，可在 [Golang SourceCode](https://github.com/golang/go/blob/master/src/net/http/pprof/pprof.go#L350) 找到所有可供分析的类型。
