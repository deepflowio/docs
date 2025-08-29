---
title: Using ByConity as the Storage Engine
permalink: /best-practice/storage-engine-use-byconity/
---

> This document was translated by ChatGPT

# Introduction

[ByConity](https://byconity.github.io/docs/introduction/main-principle-concepts) is a project forked by ByteDance from ClickHouse (latest synced from ClickHouse v23.3), supporting compute-storage separation.

Starting from version 6.6, DeepFlow supports choosing between ClickHouse and ByConity by adjusting deployment parameters. ClickHouse is used by default, but it can be switched to ByConity.

::: tip
ByConity consists of 17 Pods, among which 9 Pods have a Request and Limit of 1.1C 1280M, 1 Pod has a Request and Limit of 1C 1G, and 1 Pod has a Request and Limit of 1C 512M. The local Disk Cache for components `byconity-server`, `vw-default`, and `vw-writer` can be modified via the `lru_max_size` configuration, and the log data storage limit can be modified via the `size` and `count` configurations.  
Resource requirements:

- CPU: It is recommended that the Kubernetes cluster has at least 12C allocatable resources available, though actual consumption will be higher.
- Memory: It is recommended that the Kubernetes cluster has at least 14G allocatable resources available, though actual consumption will be higher.
- Disk: It is recommended that each data node has more than 180G of disk capacity, with local Disk Cache for `byconity-server`, `vw-default`, and `vw-writer` each at 40G, and log data for `byconity-server`, `vw-default`, and `vw-writer` each at 20G.
  :::

## Deployment Parameters

ByConity connects to object storage by default, and environment requirements can be found in the official documentation. During deployment, simply add the byconity configuration to the custom `values-custom.yaml` file.  
Note: In this example, Alibaba Cloud OSS is used. You must replace `endpoint`, `region`, `bucket`, `path`, `ak_id`, and `ak_secret` in the example with the correct parameters for your object storage. It is also recommended to adjust the replica count of `byconity-server`, `vw-default`, and `vw-writer` to match the number of `deepflow-server` instances or nodes.

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

Redeploy DeepFlow:

```bash
helm del deepflow -n deepflow
helm install deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

## Notes

- ByConity only supports the AMD64 architecture.
- If some `byconity-fdb-storage` Pods fail to start, adjust the kernel parameters:
  ```bash
  sudo sysctl -w fs.inotify.max_user_watches=2099999999
  sudo sysctl -w fs.inotify.max_user_instances=2099999999
  sudo sysctl -w fs.inotify.max_queued_events=2099999999
  ```
- ByConity depends on a FoundationDB cluster (FDB for short), which is used to store ByConity metadata. Deleting or rebuilding the FDB cluster will result in the loss of FDB data, which in turn will cause the loss of ByConity data. Therefore, the FDB component will not be deleted during the uninstallation of ByConity. If you do need to delete this component, execute the following command:
  ```bash
  kubectl delete FoundationDBCluster --all -n deepflow
  ```
- If using a private registry causes some FDB components to fail to pull images, you can resolve it with the following commands:
  ```bash
  kubectl patch serviceaccount default  -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'  -n deepflow
  kubectl delete pod -n deepflow -l foundationdb.org/fdb-cluster-name=deepflow-byconity-fdb
  ```