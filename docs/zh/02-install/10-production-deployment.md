---
title: 生产环境部署建议
permalink: /install/production-deployment/
---

# 简介

DeepFlow 生产环境部署建议。

# 使用托管 MySQL

在生产环境中建议使用托管的 MySQL 来保证可用性，建议使用 MySQL 8.0 及以上版本。
`values-custom.yaml` 配置：
```yaml
global:
  externalMySQL:
    enabled: true ## Enable external MySQL
    ip: 10.1.2.3 ## External Mysql IP address, Need to allow deepflow-server and clickhouse access
    port: 3306 ## External Mysql port
    username: root ## External Mysql username
    password: password ## External Mysql password
mysql:
  enabled: false ## Close MySQL deployment
```

# 使用托管 ClickHouse

在生产环境中建议使用托管的 ClickHouse 来保证可用性，建议 ClickHouse 的版本至少为 21.8。
`values-custom.yaml` 配置：
```yaml
global:
  externalClickHouse:
    enabled: true  ## Enable external ClickHouse
    type: ep

    ## External ClickHouse clusterName,The default value is 'default', query method:  'select cluster,host_address,port from system.clusters;'
    clusterName: default 

    ## External ClickHouse storage policy name,The default value is 'default', query method: 'select policy_name from storage_policies;'
    storagePolicy: default 
    username: default ## External ClickHouse username
    password: password ## External ClickHouse Password

    ## External ClickHouse IP address and port list, DeepFlow writes IP and port information to an svc endpoint, deepflow-server obtains ClickHouse's IP:Port through get&wath&list endpoint.
    ## deepflow-server needs to access the real IP address of ClickHouse, the port is connected using tcp-port, usually 9000, and query IP:Port through 'select host_address,port from system.clusters;'.
    hosts:
    - ip: 10.1.2.3
      port: 9000
    - ip: 10.1.2.4
      port: 9000
    - ip: 10.1.2.5
      port: 9000
clickhouse:
  enabled: false ## Close ClickHouse deployment
```

DeepFlow 会将 ClickHouse 的 IP:Port 信息写入一个 Service 的 Endpoint 中，deepflow-server 的 controller 和 ingester 通过 `list&watch` 这个 Service 的 Endpoint 来获取 ClickHouse 地址列表，其中 controller 连接所有的 ClickHouse 进行创建库、表结构等操作，ingester 通过对所有 deepflow-server pod 名称和 Endpoint 的 IP 进行排序，依次对应 deepflow-server 和 ClickHouse，并进行创建库、表结构和写入观测数据，querier 通过访问这个 service 来查询观测数据。

因 ClickHouse 需要请求 MySQL，使用托管 Clickhosue 的同时建议使用托管 Mysql。
如果只使用托管 ClickHouse 而不使用托管 MySQL，建议打开 MySQL 的 NodePort，并配置 `global.externalMySQL` 为 NodePort 访问地址。

# 优化 deepflow-agent 到 deepflow-server 的流量路径

## 使用 Local externalTrafficPolicy
默认配置下，deepflow-server 的 NodePort 使用的 `externalTrafficPolicy=Cluster`，经过 NodePort 到 deepflow-server 的流量一般会再次进行转发，占用不必要的节点间带宽，可以配置为 `externalTrafficPolicy=Local` 来保证访问某个节点 NodePort 的流量只会路由到该节点上的 deepflow-server。
因使用 `externalTrafficPolicy=Local` 和 deepflow-server 漂移等因素可能会造成部分节点的 NodePort 无法访问到 deepflow-server，需要注意避免影响 deepflow-agent 配置文件中的 controller-ip。
`values-custom.yaml` 配置：
```yaml
server:
  service:
    externalTrafficPolicy: Local
```

## 使用 HostNetwork
极端情况下，kube-proxy 可能会因为流量过多而占用过多的 CPU 等资源，可以打开 deepflow-server 的 HostNetWork 以减少 kube-proxy 的压力。
`values-custom.yaml` 配置：
```yaml
server:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

打开 deepflow-server 的 HostNetwork后，需要配置 agent-group-config 切换 deepflow-agent 请求 deepflow-server 的端口:
```yaml
proxy_controller_port: 20035 # The deepflow-server controller listens on the port. The default port is 20035
analyzer_port: 20033 # The deepflow-server ingester listens on the port. The default port is 20033
```