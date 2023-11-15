> This document was translated by GPT-4

---

title: Suggestions for Production Environment Deployment
permalink: /best-practice/production-deployment/

---

# Introduction

DeepFlow recommendations for production environment deployment.

# Use LTS Version of DeepFlow

Add the --version 6.2.6 parameter to helm for installing the LTS version of DeepFlow Server and Agent:

## Install LTS Version of DeepFlow Server

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
# helm repo add deepflow https://deepflowio.github.io/deepflow

helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 6.2.6 --create-namespace
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
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 6.2.6 --create-namespace \
  -f values-custom.yaml
```

:::

## Install LTS Version of DeepFlow Agent

### K8s Environment

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
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 6.2.6 --create-namespace \
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
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 6.2.6 --create-namespace \
  -f values-custom.yaml
```

:::

### Cloud Host Environment

Switch the Agent download link to the LTS version:

::: code-tabs#shell

@tab rpm

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/rpm/agent/v6.2.6/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-rpm.zip
unzip deepflow-agent-rpm.zip
yum -y localinstall x86_64/deepflow-agent-1.0*.rpm
```

@tab deb

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/deb/agent/v6.2.6/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-deb.zip
unzip deepflow-agent-deb.zip
dpkg -i x86_64/deepflow-agent-1.0*.systemd.deb
```

@tab binary file

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/v6.2.6/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent.tar.gz
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

## Install LTS Version of Cli

Switch the Cli download link to the LTS version:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/v6.2.6/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Use Hosted MySQL

In a production environment, it is recommended to use a managed MySQL for availability. MySQL 8.0 or above is suggested.
You need to create the following databases and grant user privileges in advance:

- deepflow
- grafana

`values-custom.yaml` configuration:

```yaml
global:
  externalMySQL:
    enabled: true ## Enable external MySQL
    ip: 10.1.2.3 ## External MySQL IP address, Need to allow deepflow-server and clickhouse access
    port: 3306 ## External Mysql port
    username: root ## External Mysql username
    password: password ## External Mysql password
mysql:
  enabled: false ## Close MySQL deployment
```

# Use Hosted ClickHouse

In a production environment, it is advised to use a managed ClickHouse for availability. The recommended minimum version for ClickHouse is 21.8.
You need to create the following databases and grant user access earlier:

- deepflow_system
- event
- ext_metrics
- flow_log
- flow_metrics
- flow_tag
- profile

`values-custom.yaml` configuration:

```yaml
global:
  externalClickHouse:
    enabled: true ## Enable external ClickHouse
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

DeepFlow will write the IP:Port information of ClickHouse into a Service's Endpoint. The controller and ingester of deepflow-server will obtain the ClickHouse address list through `list&watch` of this Service's Endpoint. The controller connects all the ClickHouse to create a library, table structure, etc. The ingester sorts the pod names of all deepflow-server and Endpoint's IP, corresponds to deepflow-server and ClickHouse, and creates libraries, table structures and writes observation data. Querier accesses this Service to query observation data.

Because ClickHouse needs to request MySQL, it is recommended to use a hosted MySQL while using a managed Clickhouse.

If you only use the managed ClickHouse but not the managed MySQL, it is suggested to open the NodePort of MySQL and configure `global.externalMySQL` as the NodePort access address.

`values-custom.yaml` configuration:

```yaml
global:
  externalClickHouse:
    enabled: true ## Enable external ClickHouse
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
    ip: xx.xx.xx.xx ## External Mysql IP address, Need to allow deepflow-server and clickhouse access
    port: 30123 ## External Mysql port
    username: root ## External Mysql username
    password: deepflow
clickhouse:
  enabled: false ## Close ClickHouse deployment

mysql:
  service:
    type: NodePort
```

If you want to reuse the port allocated by NodePort, you need to deploy twice, and fill in the port allocated for the first time in `global.externalMySQL.port` before the second deployment.

As Clickhouse will save the connection method of MySQL, you need to delete all databases of Clickhouse and restart deepflow-server to reset the database after modifying the MySQL connection.

# Optimize the traffic path from deepflow-agent to deepflow-server

When deepflow-agent starts, it will request deepflow-server using the `controller-ips` in the local configuration file (including ConfigMap). deepflow-server will default to issue the Node IP of deepflow-server Pod to deepflow-agent (issue the Pod IP of deepflow-server by default in the same cluster) for subsequent requests for configuration and data sending. When there are multiple deepflow-server, it will issue different deepflow-server Node IPs for load balancing, and reissue after load balancing for a certain period of time.

There are two ports at this time whose IPS are dynamically issued by deepflow-server to deepflow-agent:

- deepflow-agent and deepflow-server are not in the same cluster
  - control plane 30035
  - data plane 30033
- deepflow-agent and deepflow-server are in the same cluster
  - control plane 20035 (configured in deepflow-server ConfigMap `controller.grpc-port`, default 20035)
  - data plane 20033 (configured in deepflow-server ConfigMap `ingester.listen-port`, default 20033)

By default, deepflow-agent uses NodePort to connect to deepflow-server. This NodePort service uses `externalTrafficPolicy = Cluster`. The traffic from NodePort to deepflow-server is usually forwarded again, occupying unnecessary inter-node bandwidth. In extreme cases, kube-proxy may consume too much CPU and other resources due to excessive traffic.

## Use LoadBalancer Type Service

Environments that have LoadBalancer conditions can modify the Service type of deepflow-server to LoadBalancer, which uses LoadBalancer to proxy the traffic from deepflow-agent to deepflow-server, thereby increasing availability.

`values-custom.yaml` configuration:

```yaml
server:
  service:
    type: LoadBalancer
```

After modifying the Service type of deepflow-server to LoadBalance, you need to configure agent-group-config to switch the address of deepflow-server requested by deepflow-agent to LoadBalance IP:

```yaml
proxy_controller_ip: 1.2.3.4 # FIXME: Your LoadBalancer IP address
analyzer_ip: 1.2.3.4 # FIXME: Your LoadBalancer IP address
proxy_controller_port: 30035 # The default is 30035
analyzer_port: 30033 # The default is 30033
```

Note: After the configuration is fixed, this IP will be issued to the collector as the data transmission IP, and the collector will also use the controller-ips in the local configuration file to request the control plane 30035 port to get the configuration information.

## Use Local externalTrafficPolicy

Environments without LoadBalancer conditions can configure the Service of deepflow-server to `externalTrafficPolicy=Local` to ensure that the traffic accessing the NodePort of a node is only routed to the deepflow-server on the node.
Because using `externalTrafficPolicy=Local` and factors like the drift of deepflow-server may cause the NodePort on some nodes to not be able to access deepflow-server, one must be careful to avoid affecting the controller-ip in the configuration file of deepflow-agent.

`values-custom.yaml` configuration:

```yaml
server:
  service:
    externalTrafficPolicy: Local
```

## Use HostNetwork

Turn on the HostNetWork of deepflow-server to reduce the pressure on kube-proxy.

`values-custom.yaml` configuration:

```yaml
server:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

After opening the HostNetwork of deepflow-server, you need to configure agent-group-config to switch the port of the deepflow-server requested by deepflow-agent:

```yaml
proxy_controller_port: 20035 # The deepflow-server controller listens on the port. The default port is 20035
analyzer_port: 20033 # The deepflow-server ingester listens on the port. The default port is 20033
```

# Access to Existing Grafana

## Download and Install Plugins

DeepFlow supports the access to existing Grafana. It is recommended to use version 9.0 or above，and the lowest supported version is 8.0. Currently, the plugin of DeepFlow is undergoing certification. Before the certification is completed, Grafana needs to be configured to allow loading uncertificated plugins:

```ini
[plugins]
allow_loading_unsigned_plugins = deepflow-querier-datasource,deepflow-apptracing-panel,deepflow-topo-panel,deepflowio-tracing-panel,deepflowio-deepflow-datasource,deepflowio-topo-panel
```

Download the plugin installation package:

```
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/pkg/grafana-plugin/stable/deepflow-gui-grafana.tar.gz
```

Unzip the downloaded plugins to the Grafana plugin directory, e.g. `/var/lib/grafana/plugins`, and restart Grafana to load the plugins:

```bash
tar -zxvf deepflow-gui-grafana.tar.gz -C /var/lib/grafana/plugins/
```

## Add DeepFlow Data source

You can find DeepFlow Querier in Grafana Data sources, add the following configuration items:

- `Request Url`: Grafana accesses the NodePort of the querier port of the deepflow-server service. Execute the following command to get the access address:

  ```bash
  echo "http://$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}"):$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)"
  ```

- `API Token`: No need to fill in

- `Tracing Url`: Grafana accesses the NodePort of the app port of the deepflow-app service. Execute the following command to open the NodePort and get the access address:
  `values-custom.yaml` configuration:
  ```yaml
  app:
    service:
      type: NodePort
  ```
  ```bash
  helm upgrade deepflow -n deepflow deepflow/deepflow -f values-custom.yaml
  echo "http://$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}"):$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-app)"
  ```

## Import Dashboard

Click to enter the recently added DeepFlow Data source, switch to the `Dashboards` page, click 'Import' on the dashboard to import the dashboard.
