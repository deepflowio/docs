---
title: Production Deployment Recommendations
permalink: /best-practice/production-deployment/
---

> This document was translated by ChatGPT

# Introduction

DeepFlow production deployment recommendations.

# Use the LTS Version of DeepFlow

Run `helm search repo deepflow -l` to check the [latest LTS version](../release-notes/release-timeline)

## Install the LTS Version of DeepFlow Server

::: code-tabs#shell

@tab Use Github and DockerHub

```bash
# helm repo add deepflow https://deepflowio.github.io/deepflow

helm repo update deepflow # use `helm repo update` when helm < 3.7.0
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 7.0.014 --create-namespace
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
helm upgrade --install deepflow -n deepflow deepflow/deepflow --version 7.0.014 --create-namespace \
  -f values-custom.yaml
```

:::

## Install the LTS Version of DeepFlow Agent

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
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 7.0.014 --create-namespace -f values-custom.yaml
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
helm upgrade --install deepflow-agent -n deepflow deepflow/deepflow-agent --version 7.0.014 --create-namespace -f values-custom.yaml
```

:::

### Cloud Host Environment

Switch the Agent download link to the LTS version:

::: code-tabs#shell

@tab rpm

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/rpm/agent/v7.0/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-rpm.zip
unzip deepflow-agent-rpm.zip
yum -y localinstall x86_64/deepflow-agent-1.0*.rpm
```

@tab deb

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/deb/agent/v7.0/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent-deb.zip
unzip deepflow-agent-deb.zip
dpkg -i x86_64/deepflow-agent-1.0*.systemd.deb
```

@tab binary file

```bash
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/agent/v7.0/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-agent.tar.gz
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

## Install the LTS Version of Cli

Switch the Cli download link to the LTS version:

```bash
curl -o /usr/bin/deepflow-ctl https://deepflow-ce.oss-cn-beijing.aliyuncs.com/bin/ctl/v7.0/linux/$(arch | sed 's|x86_64|amd64|' | sed 's|aarch64|arm64|')/deepflow-ctl
chmod a+x /usr/bin/deepflow-ctl
```

# Use Managed MySQL

In production environments, it is recommended to use managed MySQL to ensure availability. MySQL 8.0 or above is recommended.  
You need to create the following databases in advance and grant account permissions:

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

In production environments, it is recommended to use managed ClickHouse to ensure availability. The recommended ClickHouse version is at least 21.8.  
You need to create the following databases in advance and grant account permissions:

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

DeepFlow writes the IP:Port information of ClickHouse into a Service Endpoint. The controller and ingester of deepflow-server obtain the ClickHouse address list through `list&watch` of this Service Endpoint. The controller connects to all ClickHouse instances to create databases, table structures, etc. The ingester sorts all deepflow-server pod names and Endpoint IPs, maps them to deepflow-server and ClickHouse in order, and creates databases, table structures, and writes observability data. The querier queries observability data by accessing this Service.

Since ClickHouse needs to request MySQL, it is recommended to use managed MySQL together when using managed ClickHouse.

If you only use managed ClickHouse without managed MySQL, it is recommended to open MySQL's NodePort and configure `global.externalMySQL` to the NodePort access address.

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

If you want to reuse the port assigned by NodePort, you need to deploy twice, and before the second deployment, fill in the port assigned in the first deployment into `global.externalMySQL.port`.

Since ClickHouse stores MySQL connection information, after modifying the MySQL connection, you need to delete all databases in ClickHouse and restart deepflow-server to reset the database.

# Optimize the Traffic Path from deepflow-agent to deepflow-server

When deepflow-agent starts, it uses the `controller-ips` in the local configuration file (including ConfigMap) to request deepflow-server. By default, deepflow-server sends the Node IP of the deepflow-server Pod to deepflow-agent (Pod IP in the same cluster) for subsequent configuration requests and data sending. When there are multiple deepflow-servers, different Node IPs are sent to deepflow-agent for load balancing, and re-sent periodically after load balancing.

At this time, there are two ports whose IPs are dynamically sent from deepflow-server to deepflow-agent:

- deepflow-agent and deepflow-server are not in the same cluster:
  - Control plane 30035
  - Data plane 30033
- deepflow-agent and deepflow-server are in the same cluster:
  - Control plane 20035 (`controller.grpc-port` configured in deepflow-server ConfigMap, default 20035)
  - Data plane 20033 (`ingester.listen-port` configured in deepflow-server ConfigMap, default 20033)

By default, deepflow-agent connects to deepflow-server via NodePort. This NodePort Service uses `externalTrafficPolicy=Cluster`, and traffic from NodePort to deepflow-server is usually forwarded again, consuming unnecessary inter-node bandwidth. In extreme cases, kube-proxy may consume excessive CPU and other resources due to high traffic.

## Use a LoadBalancer Type Service

In environments with LoadBalancer capability, you can change the deepflow-server Service type to LoadBalancer to proxy deepflow-agent traffic to deepflow-server, improving availability.

`values-custom.yaml` configuration:

```yaml
server:
  service:
    type: LoadBalancer
```

After changing the deepflow-server Service type to LoadBalancer, you need to configure agent-group-config to switch the deepflow-agent request address to the LoadBalancer IP:

```yaml
proxy_controller_ip: 1.2.3.4 # FIXME: Your LoadBalancer IP address
analyzer_ip: 1.2.3.4 # FIXME: Your LoadBalancer IP address
proxy_controller_port: 30035 # The default is 30035
analyzer_port: 30033 # The default is 30033
```

Note: After configuration, this IP will be fixed as the data transmission IP sent to the collector, and the collector will also always use the controller-ips in the local configuration file to request the control plane port 30035 for configuration information.

## Use Local externalTrafficPolicy

In environments without LoadBalancer capability, you can configure the deepflow-server Service with `externalTrafficPolicy=Local` to ensure that traffic accessing a NodePort on a node is only routed to the deepflow-server on that node.  
Due to `externalTrafficPolicy=Local` and deepflow-server migration, some NodePorts may not be able to access deepflow-server. Be careful to avoid affecting the controller-ip in the deepflow-agent configuration file.

`values-custom.yaml` configuration:

```yaml
server:
  service:
    externalTrafficPolicy: Local
```

## Use HostNetwork

Enable HostNetwork for deepflow-server to reduce kube-proxy load.

`values-custom.yaml` configuration:

```yaml
server:
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

After enabling HostNetwork for deepflow-server, you need to configure agent-group-config to switch the ports used by deepflow-agent to request deepflow-server:

```yaml
proxy_controller_port: 20035 # The deepflow-server controller listens on the port. The default port is 20035
analyzer_port: 20033 # The deepflow-server ingester listens on the port. The default port is 20033
```

# Integrate with an Existing Grafana

## Download and Install the Plugin

DeepFlow supports integration with an existing Grafana. Grafana 9.0 or above is recommended, with a minimum supported version of 8.0.  
Currently, DeepFlow's plugin is undergoing certification. Before certification is complete, you need to configure Grafana to allow loading unsigned plugins:

```ini
[plugins]
allow_loading_unsigned_plugins = deepflow-querier-datasource,deepflow-apptracing-panel,deepflow-topo-panel,deepflowio-tracing-panel,deepflowio-deepflow-datasource,deepflowio-topo-panel
```

Download the plugin package:

```
curl -O https://deepflow-ce.oss-cn-beijing.aliyuncs.com/pkg/grafana-plugin/stable/deepflow-gui-grafana.tar.gz
```

Extract the downloaded plugin to the Grafana plugin directory, e.g., `/var/lib/grafana/plugins`, and restart Grafana to load the plugin:

```bash
tar -zxvf deepflow-gui-grafana.tar.gz -C /var/lib/grafana/plugins/
```

## Add DeepFlow Data Source

You can find DeepFlow Querier in Grafana Data sources and add the following configuration items:

- `Request Url`: The NodePort of the deepflow-server service querier port accessed by Grafana. Run the following command to get the access address:

  ```bash
  echo "http://$(kubectl get nodes -o jsonpath="{.items[0].status.addresses[0].address}"):$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)"
  ```

- `API Token`: Leave blank

- `Tracing Url`: The NodePort of the deepflow-app service app port accessed by Grafana. Run the following command to open the NodePort and get the access address:  
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

Click to enter the newly added DeepFlow Data source, switch to the `Dashboards` page, and click `Import` on the dashboard to import it.