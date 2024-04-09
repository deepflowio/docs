---
title: 生产环境部署建议
permalink: /best-practice/production-deployment/
---

# 简介

DeepFlow 生产环境部署建议。

# 使用 LTS 版本 DeepFlow

helm 增加 --version 6.4.9 参数安装升级 LTS 版本 DeepFlow Server 和 Agent

## 安装 LTS 版本 DeepFlow Server

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
# helm repo add deepflow https://deepflowio.github.io/deepflow

helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 6.4.9 --create-namespace
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
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 6.4.9 --create-namespace \
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
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 6.4.9 --create-namespace \
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
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 6.4.9 --create-namespace \
  -f values-custom.yaml
```

:::

### 云主机环境

切换 Agent 下载链接至 LTS 版本：

::: code-tabs#shell

@tab rpm

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/rpm/agent/v6.4.9/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-rpm.zip
unzip deepflow-agent-rpm.zip
yum -y localinstall x86_64/deepflow-agent-1.0*.rpm
```

@tab deb

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/deb/agent/v6.4.9/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-deb.zip
unzip deepflow-agent-deb.zip
dpkg -i x86_64/deepflow-agent-1.0*.systemd.deb
```

@tab binary file

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/v6.4.9/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent.tar.gz
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
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/v6.4.9/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
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
  externalMySQL:
    enabled: true
    ip: xx.xx.xx.xx  ## External Mysql IP address, Need to allow deepflow-server and clickhouse access
    port: 30123  ## External Mysql port
    username: root  ## External Mysql username
    password: deepflow
clickhouse:
  enabled: false ## Close ClickHouse deployment

mysql:
  service:
    type: NodePort
```
如果想复用 NodePort 分配的端口，需要部署两次，在第二次部署前将第一次分配的端口填入 `global.externalMySQL.port`。

由于 Clickhouse 会保存 MySql 的连接方式，所以修改 MySql 连接后需要删除 Clickhouse 所有数据库并重启 deepflow-server 以重置数据库。

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
allow_loading_unsigned_plugins = deepflow-querier-datasource,deepflow-apptracing-panel,deepflow-topo-panel,deepflowio-tracing-panel,deepflowio-deepflow-datasource,deepflowio-topo-panel
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

# 使用AI模型

## 部署

从项目[https://github.com/deepflowio/stella-agent-ce] 中获取服务镜像，参考deploy目录下的配置文件结合实际情况部署以上服务

## 通过yaml来配置会话模型

如果通过yaml来配置模型并且启用，那么会优先使用yaml中定义的模型

目前服务支持如下模型，默认值请保持不变，空缺值请去对应平台获取相应信息后填入

```yaml
ai:
    enable: False # True,False,是否启用，如果启用，模型配置信息会优先使用yaml配置，请补齐后续空缺配置再启用，如果想使用db来配置模型信息请置为False
    platforms:
        -
            enable: False # True,False,是否启用
            platform: "azure"
            model: "gpt"
            api_type: "azure"
            api_key: ""
            api_base: ""
            api_version: ""
            engine_name: 
                - ""
        -
            enable: False
            platform: "aliyun"
            model: "dashscope"
            api_key: ""
            engine_name: 
                - "qwen-turbo"
                - "qwen-plus"
        -
            enable: False
            platform: "baidu"
            model: "qianfan"
            api_key: ""
            api_secre: ""
            engine_name: 
                - "ERNIE-Bot"
                - "ERNIE-Bot-turbo"
        -
            enable: False
            platform: "zhipu"
            model: "zhipuai"
            api_key: ""
            engine_name: 
                - "chatglm_turbo"
```

## 通过db来配置会话模型

如果通过yaml来配置模型并且启用，那么会优先使用yaml中定义的模型

 - 获取所有模型列表示例
   - url
     - /v1/llm_agent_config
   - method
     - get 
   - Response
    ```json
      {
          "OPT_STATUS": "SUCCESS",
          "DATA": {
              // platform_name,模型所在平台名称
              "azure": {
                  // key_name:key_value
                  "model": "gpt",
                  "model_info": "",
                  "engine_name": [
                      "DF-GPT-16K",
                      "DF-GPT4"
                  ],
                  "enable": "1"// 开启：1，关闭：0
              },
              "aliyun": {
                  "model": "dashscope",
                  "model_info": "",
                  "engine_name": [
                      "qwen-turbo",
                      "qwen-plus"
                  ],
                  "enable": "1"
              },
              "baidu": {
                  "model": "qianfan",
                  "model_info": "",
                  "engine_name": [
                      "ERNIE-Bot",
                      "ERNIE-Bot-turbo"
                  ],
                  "enable": "0"
              },
              "zhipu": {
                  "model": "zhipuai",
                  "model_info": "",
                  "engine_name": [
                      "chatglm_turbo"
                  ],
                  "enable": "1"
              }
          },
          "DESCRIPTION": "SUCCESS"
      }
    ```

 - 获取某个模型信息示例
   - url
     - /v1/llm_agent_config/{platform_name} # platform_name: 模型所在平台名称,比如: azure
   - method
     - get 
   - Response
    ```json
      {
          "OPT_STATUS": "SUCCESS",
          "DATA": {
              // platform_name
              "azure": {
                  // key_name: key_value
                  "model": "gpt",
                  "model_info": "",
                  "api_base": "https://df-gpt.openai.azure.com/",
                  "api_key": "906cc0fa3398455dbf5454e88202d",
                  "api_type": "azure",
                  "api_version": "2023-07-17-preview",
                  "engine_name": [
                      "DF-GPT-16K",
                      "DF-GPT4"
                  ],
                  "enable": "1"// 开启：1，关闭：0
              }
          },
          "DESCRIPTION": "SUCCESS"
      }
    ```

 - 修改&更新某个模型下的某个配置示例
   - url
     - /v1/llm_agent_config/{platform_name}/{key_name} # platform_name: 模型所在平台名称,比如: azure, key_name: 配置项名称, 比如: api_base
   - method
     - patch
   - header
     - content-type: application/json
   - body
     - value: "" # 配置项值
   - Response
    ```json
      {
          "OPT_STATUS": "SUCCESS",
          "DATA": true,
          "DESCRIPTION": "SUCCESS"
      }
    ```

 - 添加某个模型下的新引擎示例
   - url
     - /v1/llm_agent_config
   - method
     - post
   - header
     - content-type: application/json
   - body
     - platform: ""              # 模型所属平台,比如: azure
     - model: ""                 # 模型名称,比如: gpt
     - model_info: ""            # 模型描述,比如: "gpt模型"
     - key_name: "engine_name"   # 模型引擎,唯一值，固定
     - value: ""                 # 引擎名称,比如: "DF-GPT4-32K"
   - Response
    ```json
      {
          "OPT_STATUS": "SUCCESS",
          "DATA": true,
          "DESCRIPTION": "SUCCESS"
      }
    ```

 - 删除某个模型下的新引擎
   - url
     - /v1/llm_agent_config/{engine_name} # engine_name: 引擎名称,比如: DF-GPT4-32K
   - method
     - delete
   - Response
    ```json
      {
          "OPT_STATUS": "SUCCESS",
          "DATA": true,
          "DESCRIPTION": "SUCCESS"
      }
    ```


# 使用
请求会话模型，platform_name: 模型所在平台名称,比如: azure, engine_name: 引擎名称,比如: DF-GPT4-32K

  - url
    - /v1/ai/stream/{platform_name}?{engine_name}
  - method
    - post
  - header
    - content-type: application/json
  - body
    - system_content: "你是一个网络专家"    # 模型角色定位
    - user_content: "web测试"              # 问题描述
  - Response
   ```text
     请提供有效信息，我无法回答
   ```


