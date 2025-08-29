---
title: Grafana Related Issues
permalink: /diagnose/grafana
---

> This document was translated by ChatGPT

# Dashboard Panel Cannot Find Kubernetes Resources

> The specific manifestation is as shown in the figure below: In panels related to Pods, some Pods or namespaces are missing or lost (it could be one or two, or it could be many).

<img src="./imgs/grafana_not_found_k8s_resources.png">

**Step 1. Check the status of deepflow-agent in the cluster**

```
  ## On the deepflow server side, check the running status of the agent; NORMAL means normal
  deepflow-ctl agent list
```

**Step 2. Output agent debug logs by adding variables**
<img src="./imgs/deepflow_agent_debug_log.png">

```
  ## Add environment variables to the agent pod:
  ## After running, grep replicasets in the logs, and check in the DEBUG log whether the total time taken to query each page (kubernetes-api-list-limit) exceeds 5 minutes
      - name: RUST_LOG
        value=info,deepflow_agent::platform::kubernetes::resource_watcher=debug
```

If the log output is too much and inconvenient to view, you can directly check the synchronized data through the DeepFlow System - DeepFlow Agent panel.
<img src="./imgs/deepflow_agent_sync_k8s_resources.png">

**Step 3. Solution for excessive synchronized resources**

> As described in Step 2, deepflow-agent synchronizes 1000 pieces of k8s resource information by default each time, while the default expiration time for the k8s continue token is 5 minutes. Exceeding this time will cause synchronization to be interrupted.  
> The purpose of the continue token:
>
> - https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/common-parameters/common-parameters/#continue
> - https://kubernetes.io/zh-cn/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks

Solution:

- Option 1: Increase the number of items queried per page (kubernetes-api-list-limit)  
  https://github.com/deepflowio/deepflow/blob/main/server/agent_config/example.yaml#L468
- Option 2: Increase the continue token expiration time (--etcd-compaction-interval)  
  https://stackoverflow.com/questions/63664353/how-to-modify-default-expired-time-of-continue-token-in-kubernetes