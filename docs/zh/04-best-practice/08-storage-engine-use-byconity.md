---
title: 使用 ByConity 作为存储引擎
permalink: /best-practice/storage-engine-use-byconity/
---

# 简介

[ByConity](https://byconity.github.io/docs/introduction/main-principle-concepts) 是字节跳动基于 ClickHouse（最新同步自 ClickHouse v23.3）Fork 的项目，支持存算分离。

自 6.6 版本起，DeepFlow 支持通过调整部署参数决定使用 ClickHouse 还是 ByConity，默认使用 ClickHouse，可调整为使用 ByConity。

## 部署参数

ByConity 默认对接对象存储，修改 `values-custom.yaml`，注意将 `endpoint`，`region`，`bucket`，`path`，`ak_id`，`ak_secret` 修改为对象存储的正确参数：

```yaml
global:
  storageEngine: byconity
clickhouse:
  enabled: false
byconity:
  enabled: true
  byconity:
    configOverwrite:
      storage_configuration:
        disks:
          server_s3_disk_0:
            endpoint: https://oss-cn-beijing-internal.aliyuncs.com
            region: cn-beijing
            bucket: FIX_ME_BUCKET
            path: byconity0
            ak_id: FIX_ME_ACCESS_KEY
            ak_secret: FIX_ME_ACCESS_SECRET
    server:
      storage:
        localDisk:
          pvcSpec:
            storageClassName: openebs-hostpath #replace to your storageClassName
        log:
          pvcSpec:
            storageClassName: openebs-hostpath #replace to your storageClassName
      configOverwrite:
        logger:
          level: trace
        disk_cache_strategies:
          simple:
            lru_max_size: 42949672960 # 40Gi # disk Maximum cache space 40 X 1024 X 1024 X 1024
    tso:
      storage:
        localDisk:
          pvcSpec:
            storageClassName: openebs-hostpath #replace to your storageClassName
        log:
          pvcSpec:
            storageClassName: openebs-hostpath #replace to your storageClassName
    defaultWorker:
      storage:
        localDisk:
          pvcSpec:
            storageClassName: openebs-hostpath #replace to your storageClassName
        log:
          pvcSpec:
            storageClassName: openebs-hostpath #replace to your storageClassName
  fdb:
    clusterSpec:
      processes:
        general:
          volumeClaimTemplate:
            spec:
              storageClassName: openebs-hostpath #replace to your storageClassName
```

重建 DeepFlow：

```bash
helm del deepflow -n deepflow
helm install deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

注意事项：
- ByConity 只支持 AMD64 架构。
- 如果出现部分 `byconity-fdb-storage` Pod 启动失败的情况，请调整内核参数：
    ```bash
    sudo sysctl -w fs.inotify.max_user_watches=2099999999
    sudo sysctl -w fs.inotify.max_user_instances=2099999999
    sudo sysctl -w fs.inotify.max_queued_events=2099999999
    ```
- 使用私有仓库导致 foundationDB 部分组件无法拉取镜像情况，可以使用如下命令解决：
    ```bash
    kubectl patch serviceaccount default  -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'  -n deepflow
    kubectl delete pod -n deepflow -l foundationdb.org/fdb-cluster-name=deepflow-byconity-fdb
    ```