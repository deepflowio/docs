---
title: Production Deployment Recommendations
permalink: /best-practice/production-deployment/
---

> This document was translated by ChatGPT

# Introduction

DeepFlow production environment deployment recommendations.

# Use LTS Version of DeepFlow

Add the `--version 6.4.9` parameter to the helm command to install or upgrade the LTS version of DeepFlow Server and Agent.

## Install LTS Version of DeepFlow Server

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

### Cloud Host Environment

Switch the Agent download link to the LTS version:

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

## Install LTS Version of Cli

Switch the Cli download link to the LTS version:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/v6.4.9/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Use Managed MySQL

In a production environment, it is recommended to use a managed MySQL to ensure availability. It is recommended to use MySQL version 8.0 or above.
You need to create the following databases and grant accounts in advance:

- deepflow
- grafana

`values-custom.yaml` configuration:

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

# Use Managed ClickHouse

In a production environment, it is recommended to use a managed ClickHouse to ensure availability. It is recommended that the ClickHouse version be at least 21.8.
You need to create the following databases and grant accounts in advance:

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

DeepFlow will write the IP:Port information of ClickHouse into the Endpoint of a Service. The controller and ingester of deepflow-server will obtain the ClickHouse address list through the `list&watch` of this Service's Endpoint. The controller connects to all ClickHouse instances to create databases and table structures, while the ingester sorts all deepflow-server pod names and Endpoint IPs, corresponding to deepflow-server and ClickHouse in sequence, creating databases, table structures, and writing observability data. The querier accesses this Service to query observability data.

Since ClickHouse needs to request MySQL, it is recommended to use managed MySQL along with managed ClickHouse.

If you only use managed ClickHouse without managed MySQL, it is recommended to open the NodePort of MySQL and configure `global.externalMySQL` to the NodePort access address.

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

If you want to reuse the port allocated by NodePort, you need to deploy twice. Before the second deployment, fill in the port allocated in the first deployment into `global.externalMySQL.port`.

Since ClickHouse will save the connection method of MySQL, after modifying the MySQL connection, you need to delete all databases in ClickHouse and restart deepflow-server to reset the database.

# Optimize Traffic Path from deepflow-agent to deepflow-server

When deepflow-agent starts, it will use the `controller-ips` in the local configuration file (including ConfigMap) to request deepflow-server. deepflow-server will by default send the Node IP of the deepflow-server Pod to deepflow-agent (the Pod IP of deepflow-server is sent by default in the same cluster) for subsequent request configuration and data sending. When there are multiple deepflow-servers, different deepflow-server Node IPs will be sent for load balancing, and load balancing will be reissued periodically.

At this time, two ports' IPs are dynamically sent by deepflow-server to deepflow-agent:

- deepflow-agent and deepflow-server are not in the same cluster
  - Control plane 30035
  - Data plane 30033
- deepflow-agent and deepflow-server are in the same cluster
  - Control plane 20035 (configured in deepflow-server ConfigMap as `controller.grpc-port`, default is 20035)
  - Data plane 20033 (configured in deepflow-server ConfigMap as `ingester.listen-port`, default is 20033)

By default, deepflow-agent uses NodePort to connect to deepflow-server. This NodePort Service uses `externalTrafficPolicy=Cluster`, and the traffic from NodePort to deepflow-server will generally be forwarded again, occupying unnecessary inter-node bandwidth. In extreme cases, kube-proxy may occupy too much CPU and other resources due to excessive traffic.

## Use LoadBalancer Type Service

In environments with LoadBalancer conditions, you can modify the Service type of deepflow-server to LoadBalancer, using LoadBalancer to proxy the traffic of deepflow-agent requests to deepflow-server, improving availability.

`values-custom.yaml` configuration:

```yaml
server:
  service:
    type: LoadBalancer
```

After modifying the Service type of deepflow-server to LoadBalancer, you need to configure agent-group-config to switch the deepflow-agent request address to the LoadBalancer IP:

```yaml
proxy_controller_ip: 1.2.3.4 # FIXME: Your LoadBalancer IP address
analyzer_ip: 1.2.3.4 # FIXME: Your LoadBalancer IP address
proxy_controller_port: 30035 # The default is 30035
analyzer_port: 30033 # The default is 30033
```

Note: After configuration, this IP will be fixedly sent to the collector as the data transmission IP, and the collector will also use the `controller-ips` in the local configuration file to request the control plane port 30035 to obtain configuration information.

## Use Local externalTrafficPolicy

In environments without LoadBalancer conditions, you can configure the Service of deepflow-server to `externalTrafficPolicy=Local` to ensure that the traffic accessing the NodePort of a certain node will only be routed to the deepflow-server on that node.
Due to the use of `externalTrafficPolicy=Local` and deepflow-server drift, some nodes' NodePorts may not be able to access deepflow-server. You need to be careful to avoid affecting the controller-ip in the deepflow-agent configuration file.

`values-custom.yaml` configuration:

```yaml
server:
  service:
    externalTrafficPolicy: Local
```

## Use HostNetwork

Enable HostNetwork for deepflow-server to reduce the pressure on kube-proxy.

`values-custom.yaml` configuration:

```yaml
server:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

After enabling HostNetwork for deepflow-server, you need to configure agent-group-config to switch the deepflow-agent request ports:

```yaml
proxy_controller_port: 20035 # The deepflow-server controller listens on the port. The default port is 20035
analyzer_port: 20033 # The deepflow-server ingester listens on the port. The default port is 20033
```

# Integrate with Existing Grafana

## Download and Install Plugins

DeepFlow supports integration with existing Grafana. It is recommended to use version 9.0 or above, with the minimum supported version being 8.0. Currently, DeepFlow's plugins are undergoing certification. Before the certification is completed, you need to configure Grafana to allow loading unsigned plugins:

```ini
[plugins]
allow_loading_unsigned_plugins = deepflow-querier-datasource,deepflow-apptracing-panel,deepflow-topo-panel,deepflowio-tracing-panel,deepflowio-deepflow-datasource,deepflowio-topo-panel
```

Download the plugin installation package:

```
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/pkg/grafana-plugin/stable/deepflow-gui-grafana.tar.gz
```

Extract the downloaded plugin to the Grafana plugin directory, such as `/var/lib/grafana/plugins`, and restart Grafana to load the plugin:

```bash
tar -zxvf deepflow-gui-grafana.tar.gz -C /var/lib/grafana/plugins/
```

## Add DeepFlow Data Source

You can find DeepFlow Querier in Grafana Data sources and add the following configuration items:

- `Request Url`: The NodePort of the deepflow-server service querier port accessed by Grafana. Execute the following command to get the access address:

  ```bash
  echo "http://$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}"):$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)"
  ```

- `API Token`: No need to fill in

- `Tracing Url`: The NodePort of the deepflow-app service app port accessed by Grafana. Execute the following command to open the NodePort and get the access address:
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

Click to enter the newly added DeepFlow Data source, switch to the `Dashboards` page, and click `Import` on the dashboard to import the dashboard.
