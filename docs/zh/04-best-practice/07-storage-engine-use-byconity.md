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

ByConity 默认对接对象存储，环境要求可参考官方说明。部署时在自定义 values-custom.yaml 文件中添加 byconity 配置即可。
注：本次配置以阿里云 OSS 为例，须将示例中 `endpoint`,`region`,`bucket`,`path`,`ak_id`,`ak_secret` 修改为对象存储的正确参数，并建议将 `byconity-server`、`vw-default` 和 `vw-writer` 副本数量调整至与 `deepflow-server` 或节点数量相同。

```yaml
global:
  storageEngine: byconity

clickhouse:
  enabled: false

byconity:
  enabled: true
  nameOverride: ''
  fullnameOverride: ''

  image:
    repository: '{{ .Values.global.image.repository }}/byconity'
    tag: 1.0.0
    imagePullPolicy: IfNotPresent
  fdbShell:
    image:
      repository: '{{ .Values.global.image.repository }}'
  byconity:
    configOverwrite:
      storage_configuration:
        cnch_default_policy: cnch_default_s3
        disks:
          server_s3_disk_0: # FIXME
            path: byconity0
            endpoint: https://oss-cn-beijing-internal.aliyuncs.com
            region: cn-beijing
            bucket: byconity
            ak_id: XXXXXXX
            ak_secret: XXXXXXX
            type: bytes3
            is_virtual_hosted_style: true

        policies:
          cnch_default_s3:
            volumes:
              bytes3:
                default: server_s3_disk_0
                disk: server_s3_disk_0

    ports:
      tcp: 9000
      http: 8123
      rpc: 8124
      tcpSecure: 9100
      https: 9123
      exchange: 9410
      exchangeStatus: 9510

    usersOverwrite:
      users:
        default:
          password: ''
        probe:
          password: probe
      profiles:
        default:
          allow_experimental_live_view: 1
          enable_multiple_tables_for_cnch_parts: 1

    server:
      replicas: 1 # FIXME
      image: ''
      podAnnotations: {}
      resources: {}
      hostNetwork: false
      nodeSelector: {}
      tolerations: []
      affinity:
        nodeAffinity: {}
      imagePullSecrets: []
      securityContext: {}
      storage:
        localDisk:
          pvcSpec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 30Gi
            storageClassName: openebs-hostpath # FIXME: replace to your storageClassName
        log:
          pvcSpec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 20Gi
            storageClassName: openebs-hostpath # FIXME: replace to your storageClassName
      configOverwrite:
        logger:
          level: trace
        disk_cache_strategies:
          simple:
            lru_max_size: 429496729600 # 400Gi
        # timezone: Etc/UTC

    tso:
      replicas: 1
      image: ''
      podAnnotations: {}
      resources: {}
      hostNetwork: false
      nodeSelector: {}
      tolerations: []
      affinity: {}
      imagePullSecrets: []
      securityContext: {}
      configOverwrite: {}
      additionalVolumes: {}
      storage:
        localDisk:
          pvcSpec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 10Gi
            storageClassName: openebs-hostpath # FIXME: replace to your storageClassName
        log:
          pvcSpec:
            accessModes:
              - ReadWriteOnce
            resources:
              requests:
                storage: 10Gi
            storageClassName: openebs-hostpath # FIXME: replace to your storageClassName

    daemonManager:
      replicas: 1 # Please keep single instance now, daemon manager HA is WIP
      image: ''
      podAnnotations: {}
      resources: {}
      hostNetwork: false
      nodeSelector: {}
      tolerations: []
      affinity: {}
      imagePullSecrets: []
      securityContext: {}
      configOverwrite: {}

    resourceManager:
      replicas: 1
      image: ''
      podAnnotations: {}
      resources: {}
      hostNetwork: false
      nodeSelector: {}
      tolerations: []
      affinity: {}
      imagePullSecrets: []
      securityContext: {}
      configOverwrite: {}

    defaultWorker: &defaultWorker
      replicas: 1
      image: ''
      podAnnotations: {}
      resources: {}
      hostNetwork: false
      nodeSelector: {}
      tolerations: []
      affinity: {}
      imagePullSecrets: []
      securityContext: {}
      livenessProbe:
        exec:
          command: ['/opt/byconity/scripts/lifecycle/liveness']
        failureThreshold: 6
        initialDelaySeconds: 5
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 20
      readinessProbe:
        exec:
          command: ['/opt/byconity/scripts/lifecycle/readiness']
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
        disk_cache_strategies:
          simple:
            lru_max_size: 42949672960 # 40Gi
        # timezone: Etc/UTC

    virtualWarehouses:
      - <<: *defaultWorker
        name: vw_default
        replicas: 1 # FIXME
      - <<: *defaultWorker
        name: vw_write
        replicas: 1 # FIXME

    commonEnvs:
      - name: MY_POD_NAMESPACE
        valueFrom:
          fieldRef:
            fieldPath: 'metadata.namespace'
      - name: MY_POD_NAME
        valueFrom:
          fieldRef:
            fieldPath: 'metadata.name'
      - name: MY_UID
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: 'metadata.uid'
      - name: MY_POD_IP
        valueFrom:
          fieldRef:
            fieldPath: 'status.podIP'
      - name: MY_HOST_IP
        valueFrom:
          fieldRef:
            # fieldPath: "status.hostIP"
            fieldPath: 'status.podIP'
      - name: CONSUL_HTTP_HOST
        valueFrom:
          fieldRef:
            fieldPath: 'status.hostIP'

    additionalEnvs: []

    additionalVolumes:
      volumes: []
      volumeMounts: []

    postStart: ''
    preStop: ''
    livenessProbe: ''
    readinessProbe: ''

    ingress:
      enabled: false

  # For more detailed usage, please check fdb-kubernetes-operator API doc: https://github.com/FoundationDB/fdb-kubernetes-operator/blob/main/docs/cluster_spec.md
  fdb:
    enabled: true
    enableCliPod: true
    version: 7.1.15
    clusterSpec:
      mainContainer:
        imageConfigs:
          - version: 7.1.15
            baseImage: '{{ .Values.global.image.repository }}/foundationdb'
            tag: 7.1.15
      sidecarContainer:
        imageConfigs:
          - version: 7.1.15
            baseImage: '{{ .Values.global.image.repository }}/foundationdb-kubernetes-sidecar'
            tag: 7.1.15-1
      processCounts:
        stateless: 3
        log: 3
        storage: 3
      processes:
        general:
          volumeClaimTemplate:
            spec:
              storageClassName: openebs-hostpath #replace to your storageClassName
              resources:
                requests:
                  storage: 20Gi

  fdb-operator:
    enabled: true
    resources:
      limits:
        cpu: 1
        memory: 512Mi
      requests:
        cpu: 1
        memory: 512Mi
    affinity: {}
    image:
      repository: '{{ .Values.global.image.repository }}/fdb-kubernetes-operator'
      tag: v1.9.0
      pullPolicy: IfNotPresent
    initContainerImage:
      repository: '{{ $.Values.global.image.repository }}/foundationdb-kubernetes-sidecar'
    initContainers:
      6.2:
        image:
          repository: '{{ $.Values.global.image.repository }}/foundationdb/foundationdb-kubernetes-sidecar'
          tag: 6.2.30-1
          pullPolicy: IfNotPresent
      6.3:
        image:
          repository: '{{ $.Values.global.image.repository }}/foundationdb/foundationdb-kubernetes-sidecar'
          tag: 6.3.23-1
          pullPolicy: IfNotPresent
      7.1:
        image:
          repository: '{{ $.Values.global.image.repository }}/foundationdb/foundationdb-kubernetes-sidecar'
          tag: 7.1.15-1
          pullPolicy: IfNotPresent
  hdfs:
    enabled: false
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
