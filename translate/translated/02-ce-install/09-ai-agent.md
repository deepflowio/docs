---
title: Install AskGPT Agent
permalink: /ce-install/ai-agent
---

> This document was translated by ChatGPT

# Prerequisites

When deploying DeepFlow, the AI component is not enabled by default. You need to manually add the AI component configuration in the `values-custom.yaml` file:

```yaml
stella-agent-ce:
  enabled: true
  replicas: 1
  hostNetwork: 'false'
  dnsPolicy: ClusterFirst
  imagePullSecrets: []
  nameOverride: ''
  fullnameOverride: ''
  podAnnotations: {}

  image:
    repository: '{{ .Values.global.image.repository }}/deepflowio-stella-agent-ce'
    pullPolicy: Always
    # Overrides the image tag whose default is the chart appVersion.
    tag: latest

  podSecurityContext:
    {}
    # fsGroup: 2000

  securityContext:
    # privileged: true
    # capabilities:
    #   drop:
    #   - ALL
    # readOnlyRootFilesystem: false
    # runAsNonRoot: false
    # runAsUser: 0

  service:
    ## Configuration for ClickHouse service
    annotations: {}
    labels: {}
    clusterIP: ''

    ## Port for ClickHouse Service to listen on
    ports:
      - name: tcp
        port: 20831
        targetPort: 20831
        nodePort:
        protocol: TCP
    # Additional ports to open for server service
    additionalPorts: []
    externalIPs: []
    loadBalancerIP: ''
    loadBalancerSourceRanges: []

    ## Denotes if this Service desires to route external traffic to node-local or cluster-wide endpoints
    externalTrafficPolicy: Cluster
    type: ClusterIP

  readinessProbe:
    httpGet:
      path: /v1/health/
      port: http
    failureThreshold: 10
    initialDelaySeconds: 15
    periodSeconds: 10
    successThreshold: 1
  livenessProbe:
    failureThreshold: 6
    initialDelaySeconds: 15
    periodSeconds: 20
    successThreshold: 1
    httpGet:
      path: /v1/health/
      port: http
    timeoutSeconds: 1

  configmap:
    df-llm-agent.yaml:
      daemon: true
      api_timeout: 500
      sql_show: 'false'
      log_file: '/var/log/df-llm-agent.log'
      log_level: 'info'
      instance_path: '/root/df-llm-agent'
      mysql:
        host: '{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.ip}}{{ else }}{{ $.Release.Name }}-mysql{{end}}'
        port: '{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.port}}{{ else }}30130{{end}}'
        user_name: '{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.username}}{{ else }}root{{end}}'
        user_password: '{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.password}}{{ else }}{{ .Values.global.password.mysql }}{{end}}'
        database: 'deepflow_llm'

  resources:
    {}
    # limits:
    #   cpu: 100m
    #   memory: 128Mi
    # requests:
    #   cpu: 100m
    #   memory: 128Mi

  nodeSelector: {}

  tolerations: []

  podAntiAffinityLabelSelector: []
  podAntiAffinityTermLabelSelector: []
  podAffinityLabelSelector: []
  podAffinityTermLabelSelector: []
  nodeAffinityLabelSelector:
    []
    # - matchExpressions:
    #     - key: kubernetes.io/hostname
    #       operator: In
    #       values: controller
  nodeAffinityTermLabelSelector: []
```

# Configure Conversation Models

Currently, the service supports the following models, which can be enabled as needed via `values-custom.yaml`:

```yaml
stella-agent-ce:
  configmap:
    df-llm-agent.yaml:
      ai:
        enable: False
        platforms:
          - platform: 'azure' # https://learn.microsoft.com/zh-cn/azure/ai-services/openai/
            enable: False
            model: 'gpt'
            api_type: 'azure'
            api_key: 'xxx' # FIXME
            api_base: 'xxx' # FIXME
            api_version: 'xxx' # FIXME
            engine_name:
              - 'xxx' # FIXME (model deployment name)
          - platform: 'aliyun' # https://help.aliyun.com/zh/dashscope/create-a-chat-foundation-model
            enable: False
            model: 'dashscope'
            api_key: 'xxx' # FIXME
            engine_name:
              - 'qwen-turbo'
              - 'qwen-plus'
          - platform: 'baidu' # https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html
            enable: False
            model: 'qianfan'
            api_key: 'xxx' # FIXME
            api_secret: 'xxx' # FIXME
            engine_name:
              - 'ERNIE-Bot'
              - 'ERNIE-Bot-turbo'
          - platform: 'zhipu' # https://open.bigmodel.cn/
            enable: False
            model: 'zhipuai'
            api_key: 'xxx' # FIXME
            engine_name:
              - 'chatglm_turbo'
```

Update DeepFlow:

```bash
helm upgrade deepflow -n deepflow -f values-custom.yaml  deepflow/deepflow
```

# Using in Grafana

The AI model interpretation feature (alpha version) is currently available in the `DeepFlow Topo Panel` and `DeepFlow Tracing Panel`:

![DeepFlow Topo Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a950a6ac.png)

![DeepFlow Tracing Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a93501df.png)

# Using via API

Method: POST

URL:

- http[s]:://{ip}:{port}/v1/ai/stream/{platform_name}?engine={engine_name}
- Parameter description:
  - ip/port: The K8s Service of stella-agent, default port is 30831.
  - platform_name: The name of the platform where the model is located, e.g., azure.
  - engine_name: The engine name, e.g., DF-GPT4-32K.

Header:

```
content-type: application/json
```

Request JSON Body:

```
{
  "system_content": "You are an expert in web technologies", # Model role definition
  "user_content": "How to optimize a web page" # Question description
}
```

Response:

```text
Web page optimization refers to various methods to improve the performance of a web page, including load speed, response time, and user experience.

Web page optimization is a complex and comprehensive task involving multiple aspects, including frontend, backend, and network. It requires analysis and optimization based on the specific situation.

Here are some common web page optimization methods:

Frontend Optimization

Reduce HTTP requests: Reducing HTTP requests can decrease network latency and browser parsing time. This can be achieved by:
Merging CSS and JavaScript files.
Using sprite images.
Implementing lazy loading.
Optimize resources: Optimizing resources can reduce their size, thus improving load speed. This can be done by:
Compressing images.
Using appropriate image formats.
Minifying CSS and JavaScript files.
Use caching effectively: Caching can reduce repeated network requests, thus improving load speed. This can be done by:
Setting appropriate cache headers.
Using browser caching.
Optimize DOM structure: A well-structured DOM can reduce browser parsing and rendering time. This can be done by:
Reducing the number and depth of DOM elements.
Avoiding complex CSS selectors.
Optimize JavaScript code: Optimizing JavaScript can improve execution efficiency. This can be done by:
Avoiding global variables.
Using caching.
Using appropriate algorithms and data structures.
Backend Optimization

Optimize database queries: Optimizing database queries can reduce the load on the database server, thus improving page response speed. This can be done by:
Using appropriate indexes.
Avoiding unnecessary queries.
Using caching.
Optimize application servers: Optimizing application servers can improve their performance. This can be done by:
Using appropriate load balancing strategies.
Using caching.
Optimizing code.
Network Optimization

Choose an appropriate CDN: A CDN can distribute content to servers closer to users, reducing network latency.
Optimize DNS resolution: Optimizing DNS resolution can improve DNS lookup speed. This can be done by:
Using a CDN.
Configuring DNS records.
Use Gzip compression: Gzip compression can reduce the amount of data transmitted, thus improving load speed.
Tools

Various tools can be used to test and analyze web page performance, such as:

Google PageSpeed Insights
Lighthouse
WebPageTest
By using these tools, you can identify performance bottlenecks in web pages and perform corresponding optimizations.

Web page optimization is an ongoing process that requires continuous testing and optimization to achieve the best performance.

Here are some additional suggestions:

Always consider performance when developing web pages.
Use performance testing tools to test web page performance.
Monitor web page performance and optimize regularly.
I hope this information is helpful to you.
```