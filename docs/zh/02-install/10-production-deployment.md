---
title: 生产环境部署建议
permalink: /install/production-deployment/
---

# 简介

DeepFlow 生产环境部署建议。

# 使用 LTS 版本 DeepFlow

helm 增加 --version 6.1.8 参数安装升级 LTS 版本 DeepFlow Server 和 Agent：

## 安装 LTS 版本 DeepFlow Server

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
# helm repo add deepflow https://deepflowio.github.io/deepflow

helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 6.1.8 --create-namespace
```

@tab Use Aliyun

```bash
# helm repo add deepflow https://deepflow-ce.oss-cn-beijing.aliyuncs.com/chart/stable

helm repo update deepflow # use `helm repo update` when helm < 3.7.0
# cat << EOF > values-custom.yaml
# global:
#   image:
#       repository: registry.cn-beijing.aliyuncs.com/deepflow-ce
# grafana:
#   image:
#     repository: registry.cn-beijing.aliyuncs.com/deepflow-ce/grafana
# EOF
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 6.1.8 --create-namespace \
  -f values-custom.yaml
```

:::

## 安装 LTS 版本 DeepFlow Agent

### K8s 环境

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
# cat << EOF > values-custom.yaml
# deepflowServerNodeIPS:
# - 10.1.2.3  # FIXME: K8s Node IPs
# - 10.4.5.6  # FIXME: K8s Node IPs
# clusterNAME: k8s-1  # FIXME: name of the cluster in deepflow
# EOF

# helm repo add deepflow https://deepflowio.github.io/deepflow

helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 6.1.8 --create-namespace \
    -f values-custom.yaml
```

@tab Use Aliyun

```bash
# cat << EOF > values-custom.yaml
# image:
#   repository: registry.cn-beijing.aliyuncs.com/deepflow-ce/deepflow-agent
# deepflowServerNodeIPS:
# - 10.1.2.3  # FIXME: K8s Node IPs
# - 10.4.5.6  # FIXME: K8s Node IPs
# clusterNAME: k8s-1  # FIXME: name of the cluster in deepflow
# EOF

# helm repo add deepflow https://deepflowio.github.io/deepflow

helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 6.1.8 --create-namespace \
  -f values-custom.yaml
```

:::

### 云主机环境

切换 Agent 下载链接至 LTS 版本：

::: code-tabs#shell

@tab rpm

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/rpm/agent/v6.1.8/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-rpm.zip
unzip deepflow-agent-rpm.zip
yum -y localinstall x86_64/deepflow-agent-1.0*.rpm
```

@tab deb

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/deb/agent/v6.1.8/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-deb.zip
unzip deepflow-agent-deb.zip
dpkg -i x86_64/deepflow-agent-1.0*.systemd.deb
```

@tab binary file

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/v6.1.8/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent.tar.gz
tar -zxvf deepflow-agent.tar.gz -C /usr/sbin/

cat << EOF > /etc/systemd/system/deepflow-agent.service
[Unit]
Description=deepflow-agent.service
After=syslog.target network-online.target

[Service]
Environment=GOTRACEBACK=single
LimitCORE=1G
ExecStart=/usr/sbin/deepflow-agent
Restart=always
RestartSec=10
LimitNOFILE=1024:4096

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
```

:::


## 安装 LTS 版本 Cli

切换 Cli 下载链接至 LTS 版本：

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/v6.1.8/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# 使用托管 MySQL

在生产环境中建议使用托管的 MySQL 来保证可用性，建议使用 MySQL 8.0 及以上版本。
需要提前创建如下 database 并授权账户：
- deepflow
- grafana

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
需要提前创建如下 database 并授权账户：
- deepflow_system
- event
- ext_metrics
- flow_log
- flow_metrics
- flow_tag
- profile
  
`values-custom.yaml` 配置：
```yaml
global:
  externalClickHouse:
    enabled: true  ## Enable external ClickHouse
    type: ep

    ## External ClickHouse clusterName,The default value is 'default', query method:  'select cluster,host_address,port from system.clusters;'
    clusterName: default 

    ## External ClickHouse storage policy name,The default value is 'default', query method: 'select policy_name from system.storage_policies;'
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

DeepFlow 会将 ClickHouse 的 IP:Port 信息写入一个 Service 的 Endpoint 中，deepflow-server 的 controller 和 ingester 通过 `list&watch` 这个 Service 的 Endpoint 来获取 ClickHouse 地址列表，其中 controller 连接所有的 ClickHouse 进行创建库、表结构等操作，ingester 通过对所有 deepflow-server pod 名称和 Endpoint 的 IP 进行排序，依次对应 deepflow-server 和 ClickHouse，并进行创建库、表结构和写入观测数据，querier 通过访问这个 Service 来查询观测数据。

因 ClickHouse 需要请求 MySQL，使用托管 Clickhosue 的同时建议使用托管 Mysql。
如果只使用托管 ClickHouse 而不使用托管 MySQL，建议打开 MySQL 的 NodePort，并配置 `global.externalMySQL` 为 NodePort 访问地址。

# 优化 deepflow-agent 到 deepflow-server 的流量路径

deepflow-agent 启动时会使用本地配置文件（包括 ConfigMap ）中的 `controller-ips` 请求deepflow-server， deepflow-server 会默认下发 deepflow-server Pod 的 Node IP 给 deepflow-agent（同一个集群中默认下发 deepflow-server 的 Pod IP） 用于后续的请求配置和发送数据，在有多个 deepflow-server 的时候会下发不同的 deepflow-server 的 Node IP 进行负载均衡，并每隔一段时间进行负载均衡后重新下发。

此时有两个端口的 IP 由 deepflow-server 动态下发给 deepflow-agent：
- deepflow-agent 和 deepflow-server 不在同一个集群
   - 控制面 30035
   - 数据面 30033
- deepflow-agent 和 deepflow-server 在同一个集群
   - 控制面 20035 (deepflow-server ConfigMap 中配置的 `controller.grpc-port`，默认 20035 )
   - 数据面 20033 (deepflow-server ConfigMap 中配置的 `ingester.listen-port`，默认 20033 )

默认配置下，deepflow-agent 使用 NodePort 连接 deepflow-server，该NodePort Service使用的 `externalTrafficPolicy=Cluster`，经过 NodePort 到 deepflow-server 的流量一般会再次进行转发，占用不必要的节点间带宽；极端情况下，kube-proxy 可能会因为流量过多而占用过多的 CPU 等资源。 

## 使用 LoadBalancer 类型的 Service 

有 LoadBalancer 条件的环境可以修改 deepflow-server 的 Service 类型为 LoadBalancer，使用 LoadBalancer 代理 deepflow-agent 请求 deepflow-server 的流量，提高可用性。

`values-custom.yaml` 配置：
```yaml
server:
  service:
    type: LoadBalancer
```

修改 deepflow-server 的 Service 类型为 LoadBalance 后，需要配置 agent-group-config 切换 deepflow-agent 请求的 deepflow-server 地址为 LoadBalance IP:
```yaml
proxy_controller_ip:  1.2.3.4  # FIXME: Your LoadBalancer IP address
analyzer_ip: 1.2.3.4  # FIXME: Your LoadBalancer IP address
proxy_controller_port: 30035 # The default is 30035
analyzer_port: 30033 # The default is 30033
```
注意：配置后会固定给采集器下发此 IP 作为数据传输 IP，并且采集器也会固定使用本地配置文件中的 controller-ips 请求 控制面 30035  端口获取配置信息。

## 使用 Local externalTrafficPolicy

没有 LoadBalancer 条件的环境可以配置 deepflow-server 的 Service 为 `externalTrafficPolicy=Local` 来保证访问某个节点 NodePort 的流量只会路由到该节点上的 deepflow-server。
因使用 `externalTrafficPolicy=Local` 和 deepflow-server 漂移等因素可能会造成部分节点的 NodePort 无法访问到 deepflow-server，需要注意避免影响 deepflow-agent 配置文件中的 controller-ip。

`values-custom.yaml` 配置：
```yaml
server:
  service:
    externalTrafficPolicy: Local
```

## 使用 HostNetwork

打开 deepflow-server 的 HostNetWork 以减少 kube-proxy 的压力。

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

# 接入已有的 Grafana

## 下载安装插件

DeepFlow 支持接入已有的 Grafana，建议使用 9.0 及以上版本，支持的最低版本为 8.0，目前 DeepFlow 的插件目前正在做认证工作，在认证工作完成之前需要配置 Grafana，允许加载未认证插件：
```ini
[plugins]
allow_loading_unsigned_plugins = deepflow-querier-datasource,deepflow-apptracing-panel,deepflow-topo-panel
```

下载插件安装包：
```
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/pkg/grafana-plugin/stable/deepflow-gui-grafana.tar.gz
```

将下载好的插件解压至 Grafana 插件目录，例如 `/var/lib/grafana/plugins`，并重启 Grafana 加载插件：

```bash
tar -zxvf deepflow-gui-grafana.tar.gz -C /var/lib/grafana/plugins/
```

## 添加 DeepFlow Data source

你可以在 Grafana Data sources 中找到 DeepFlow Querier， 并添加如下配置项：

- `Request Url`：Grafana 访问 deepflow-server service querier 端口的 NodePort，执行如下命令可得到访问地址：
  ```bash
  echo "http://$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}"):$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)"
  ```

- `API Token`： 无需填写

- `Tracing Url`: Grafana 访问 deepflow-app service app 端口的 NodePort，执行如下命令可打开 NodePort 并得到访问地址：
  `values-custom.yaml` 配置：
  ```yaml
  app:
    service:
      type: NodePort
  ```
  ```bash
  helm upgrade deepflow -n deepflow deepflow/deepflow -f values-custom.yaml
  echo "http://$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}"):$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-app)"
  ```

## 导入 Dashboard

点击进入刚刚添加的 DeepFlow Data source，切换至 `Dashboards` 页面，点击 dashboard 的 `Import` 即可导入 dashboard。