---
title: 安装 AskGPT 智能体
permalink: /ce-install/ai-agent
---

# 前提条件

已经在 K8s 中部署了社区版 DeepFlow。

# 部署 Stella

- 从项目 [stella-agent-ce](https://github.com/deepflowio/stella-agent-ce) 中获取服务镜像
  - 镜像通常的位置是：`https://github.com/deepflowio/deepflow/pkgs/container/deepflow-ce%2Fdeepflow-server`
- 进入该项目中的 `deploy/templates` 目录，修改以下文件中的配置参数
  - 修改 `service.yaml`、`deployment.yaml`、`configmap.yaml` 文件中的 `namespace` 为实际使用的值（需要和 mysql 在同一个 namespace 下）
  - 修改 `configmap.yaml`文件中 `mysql`、下的 `host`、`port`、`user_name`、`user_password`、`database` 为真实值
  - 修改 `configmap.yaml`文件中 `ai` 部分，具体注意事项请看下文 `通过 yaml 来配置会话模型`
- 进入该项目中的 `deploy/templates` 目录，执行 yaml 文件部署服务
  - `kubectl apply -f ./configmap.yaml`
  - `kubectl apply -f ./deployment.yaml`
  - `kubectl apply -f ./service.yaml`

# 通过 yaml 来配置会话模型

目前服务支持如下模型，可按需开启：

```yaml
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
