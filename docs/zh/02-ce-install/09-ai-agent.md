---
title: 安装 AskGPT 智能体
permalink: /ce-install/ai-agent
---

# 前提条件

DeepFlow 部署时，默认不会启用 AI 组件，需手动在 `values-custom.yaml` 文件中添加 AI 组件配置：

```yaml
stella-agent-ce:
  enabled: true
  replicas: 1
  hostNetwork: "false"
  dnsPolicy: ClusterFirst
  imagePullSecrets: []
  nameOverride: ""
  fullnameOverride: ""
  podAnnotations: {}

  image:
    repository: "{{ .Values.global.image.repository }}/deepflowio-stella-agent-ce"
    pullPolicy: Always
    # Overrides the image tag whose default is the chart appVersion.
    tag: latest

  podSecurityContext: {}
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
    clusterIP: ""

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
    loadBalancerIP: ""
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
      sql_show: "false"
      log_file: "/var/log/df-llm-agent.log"
      log_level: "info"
      instance_path: "/root/df-llm-agent"
      mysql:
        host: "{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.ip}}{{ else }}{{ $.Release.Name }}-mysql{{end}}"
        port: "{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.port}}{{ else }}30130{{end}}"
        user_name: "{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.username}}{{ else }}root{{end}}"
        user_password: "{{ if $.Values.global.externalMySQL.enabled }}{{$.Values.global.externalMySQL.password}}{{ else }}{{ .Values.global.password.mysql }}{{end}}"
        database: "deepflow_llm"

  resources: {}
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
  nodeAffinityLabelSelector: []
    # - matchExpressions:
    #     - key: kubernetes.io/hostname
    #       operator: In
    #       values: controller
  nodeAffinityTermLabelSelector: []
```

# 配置会话模型

目前服务支持如下模型，可按需开启，通过 `values-custom.yaml` 配置：

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
              - 'xxx' # FIXME（模型部署名称）
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

更新 DeepFlow：

```bash
helm upgrade deepflow -n deepflow -f values-custom.yaml  deepflow/deepflow
```

# 在 Grafana 中使用

AI 模型解读功能（alpha 版）目前可以在 `DeepFlow Topo Panel` 和 `DeepFlow Tracing Panel` 中使用：

![DeepFlow Topo Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a950a6ac.png)

![DeepFlow Tracing Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a93501df.png)

# 调用 API 使用

Method：POST

URL：

- http[s]:://{ip}:{port}/v1/ai/stream/{platform_name}?engine={engine_name}
- 参数说明
  - ip/port：stella-agent 的 K8s Service，默认端口为 30831。
  - platform_name：模型所在平台名称，比如：azure。
  - engine_name：引擎名称，比如：DF-GPT4-32K。

Header：

```
content-type: application/json
```

请求的 JSON Body：

```
{
  "system_content": "你是一个web方面的专家", # 模型角色定位
  "user_content": "web页面如何调优" # 问题描述
}
```

Response：

```text
Web页面调优是指通过各种手段来提高网页的性能，包括加载速度、响应速度、用户体验等。

Web页面调优是一项复杂的综合性工作，涉及多个方面，包括前端、后端、网络等。需要根据具体情况进行分析和优化。

以下是一些常见的Web页面调优方法：

前端优化

减少HTTP请求：减少HTTP请求可以减少网络延迟和浏览器解析时间。可以通过以下方法来减少HTTP请求：
合并CSS和JavaScript文件。
使用精灵图。
使用延迟加载。
优化资源：优化资源可以减少资源大小，从而提高加载速度。可以通过以下方法来优化资源：
压缩图片。
使用适当的图像格式。
缩小CSS和JavaScript文件。
合理使用缓存：缓存可以减少重复的网络请求，从而提高加载速度。可以通过以下方法来合理使用缓存：
设置合理的缓存头。
使用浏览器缓存。
优化DOM结构：合理的DOM结构可以减少浏览器的解析和渲染时间。可以通过以下方法来优化DOM结构：
减少DOM元素的数量和层级。
避免使用复杂的CSS选择器。
优化JavaScript代码：优化JavaScript代码可以提高代码执行效率。可以通过以下方法来优化JavaScript代码：
避免使用全局变量。
使用缓存。
使用合理的算法和数据结构。
后端优化

优化数据库查询：优化数据库查询可以减少数据库服务器的负载，从而提高页面响应速度。可以通过以下方法来优化数据库查询：
使用合适的索引。
避免使用不必要的查询。
使用缓存。
优化应用服务器：优化应用服务器可以提高应用服务器的性能。可以通过以下方法来优化应用服务器：
使用合理的负载均衡策略。
使用缓存。
优化代码。
网络优化

选择合适的CDN：CDN可以将内容分发到离用户更近的服务器，从而减少网络延迟。
优化DNS解析：优化DNS解析可以提高DNS解析速度。可以使用以下方法来优化DNS解析：
使用CDN。
配置DNS记录。
使用Gzip压缩：Gzip压缩可以减少传输数据量，从而提高加载速度。
工具

可以使用各种工具来测试和分析Web页面的性能，例如：

Google PageSpeed Insights
Lighthouse
WebPageTest
通过使用这些工具，可以发现Web页面的性能瓶颈，并进行相应的优化。

Web页面调优是一个持续的过程，需要不断地进行测试和优化，才能获得最佳的性能。

以下是一些额外的建议：

在开发Web页面时，要始终考虑性能。
使用性能测试工具来测试Web页面的性能。
监控Web页面的性能，并定期进行优化。
希望这些信息对您有所帮助。
```
