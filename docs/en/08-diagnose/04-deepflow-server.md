> This document was translated by GPT-4

---

title: Server Performance Optimization
permalink: /diagnose/how-to-profile-deepflow-server-ingester

---

# Introduction

With [Golang Profile](https://go.dev/blog/pprof), we can capture and optimize the data writing performance of DeepFlow Server.

# Steps

1. Install the [deepflow-ctl](../ce-install/upgrade/#%E5%8D%87%E7%BA%A7-deepflow-cli) tool.
2. Find the DeepFlow Server Pod IP that needs to be profiled. If the number of replicas of DeepFlow server is larger than 1, pick any one from them:

```bash
deepflow_server_pod_ip=$(kubectl -n deepflow get pods -o wide | grep deepflow-server | awk '{print $6}')
```

3. Turn on the Profile function:

```bash
deepflow-ctl -i $deepflow_server_pod_ip ingester profiler on
```

# Get CPU Profile

```bash
go tool pprof http://$deepflow_server_pod_ip:9526/debug/pprof/profile
```

After executing the command, the default sampling time is 30s. You can modify the Profile duration by adding `seconds=x` parameter such as `http://$deepflow_server_pod_ip:9526/debug/pprof/profile?seconds=60`. After profiling, you can enter the `svg` command to generate a vector graphic format of the Profile result image and copy it to your local machine for inspection through a browser.

# Get Memory Profile

```bash
go tool pprof http://$deepflow_server_pod_ip:9526/debug/pprof/heap
```

After executing the command, it will take a real-time sampling and get the current memory snapshot. Then similarly, you can enter the `svg` command to generate a vector format of the Profile result image and copy it to your local machine for inspection through a browser.

# Other Profile Information

If you want to get other Profile information, you can find all the available types for analysis in the [Golang SourceCode](https://github.com/golang/go/blob/master/src/net/http/pprof/pprof.go#L350).
