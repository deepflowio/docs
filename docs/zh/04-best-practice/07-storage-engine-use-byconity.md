---
title: 使用 ByConity 作为存储引擎
permalink: /best-practice/storage-engine-use-byconity/
---

# 简介

[ByConity](https://byconity.github.io/docs/introduction/main-principle-concepts) 是字节跳动基于 ClickHouse（最新同步自 ClickHouse v23.3）Fork 的项目，支持存算分离。

自 6.6 版本起，DeepFlow 支持通过调整部署参数决定使用 ClickHouse 还是 ByConity，默认使用 ClickHouse，可调整为使用 ByConity。

::: tip
ByConity 共有 17 个 Pod，其中 9 个 Pod 的 Request 和 Limit 为 1.1C 1280M，1 个 Pod 的 Request 和 Limit 为 1C 1G，1 个 Pod 的 Request 和 Limit 为 1C 512M。组件 `byconity-server`、`vw-default` 和 `vw-writer` 的本地 Disk Cache 可通过 `lru_max_size` 配置修改，日志数据存储上限可通过 `size`、`count` 配置修改。
资源需求： 
- CPU: 建议 Kubernetes 集群至少剩余 12C 可分配资源，实际会消耗更高的资源。
- 内存: 建议 Kubernetes 集群至少剩余 14G 可分配资源，实际会消耗更高的资源。
- 磁盘: 建议每个数据节点磁盘容量超过 180G，其中本地 Disk Cache `byconity-server`、`vw-default` 和 `vw-writer` 各 40G，日志数据 `byconity-server`、`vw-default` 和 `vw-writer` 各 20G。
:::

## 部署参数
ByConity 默认对接对象存储，修改 `values-custom.yaml`，注意将 `endpoint`，`region`，`bucket`，`path`，`ak_id`，`ak_secret` 修改为对象存储的正确参数。建议将 `byconity-server`、`vw-default` 和 `vw-writer` 副本数量调整至与 `deepflow-server` 或节点数量相同，在修改 `vw-default` 和 `vw-writer` 参数之前，请先将以下 `defaultWorker`、`virtualWarehouses` 内容拷贝到 `values-custom.yaml` 文件中，并在此基础上进行相应修改：

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
      replicas: 1 # Number of replicas of pod byconity-server
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
          size: 2000M # Log file size limit
          count: 10 # Limitation of the number of log files
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
    defaultWorker: &defaultWorker
      hostNetwork: false
      livenessProbe:
        exec:
          command: [ "/opt/byconity/scripts/lifecycle/liveness" ]
        failureThreshold: 6
        initialDelaySeconds: 5
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 20
      readinessProbe:
        exec:
          command: [ "/opt/byconity/scripts/lifecycle/readiness" ]
        failureThreshold: 5
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 10
      storage:
        localDisk:
          pvcSpec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 50Gi
            storageClassName: openebs-hostpath #replace to your storageClassName
        log:
          pvcSpec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 10Gi
            storageClassName: openebs-hostpath #replace to your storageClassName
      configOverwrite:
        logger:
          level: trace
          size: 2000M # Log file size limit
          count: 10 # Limitation of the number of log files
        disk_cache_strategies:
          simple:
            lru_max_object_num: 4000000 # Limit the total number of files
            lru_max_size: 42949672960 # 40Gi
        # timezone: Etc/UTC

    virtualWarehouses:
      - <<: *defaultWorker
        name: vw_default
        replicas: 1 # Number of replicas of pod vw-default
        affinity:
          podAntiAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                - key: byconity-vw
                  operator: In
                  values:
                  - "vw_default"
                - key: byconity-role
                  operator: In
                  values:
                  - "worker" 
              topologyKey: kubernetes.io/hostname
      - <<: *defaultWorker
        name: vw_write
        replicas: 1 #Number of replicas of pod vw-write
        affinity:
          podAntiAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                - key: byconity-vw
                  operator: In
                  values:
                  - "vw_write"
                - key: byconity-role
                  operator: In
                  values:
                  - "worker" 
              topologyKey: kubernetes.io/hostname
  fdb:
    clusterSpec:
      processes:
        general:
          volumeClaimTemplate:
            spec:
              storageClassName: openebs-hostpath #replace to your storageClassName
```

重新部署 DeepFlow：

```bash
helm del deepflow -n deepflow
helm install deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

## 注意事项

- ByConity 只支持 AMD64 架构。
- 如果出现部分 `byconity-fdb-storage` Pod 启动失败的情况，请调整内核参数：
    ```bash
    sudo sysctl -w fs.inotify.max_user_watches=2099999999
    sudo sysctl -w fs.inotify.max_user_instances=2099999999
    sudo sysctl -w fs.inotify.max_queued_events=2099999999
    ```
- Byconity 依赖于 FoundationDB 集群（简称 FDB），该集群用于存储 Byconity 的元数据。若对 FDB 集群进行删除或重建操作，将会导致 FDB 数据的丢失，进而引发 Byconity 数据的丢失。因此，在卸载 Byconity 的过程中，不会删除 FDB 组件。若确实需要删除该组件，请执行相应的删除操作：
    ```bash
    kubectl delete FoundationDBCluster --all -n deepflow
    ```
- 使用私有仓库导致 FDB 部分组件无法拉取镜像情况，可以使用如下命令解决：
    ```bash
    kubectl patch serviceaccount default  -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'  -n deepflow
    kubectl delete pod -n deepflow -l foundationdb.org/fdb-cluster-name=deepflow-byconity-fdb
    ```