---
title: 安装 AskGPT 智能体
permalink: /ce-install/ai-agent
---

# 使用 AI 模型

## 前提条件

已经部署 K8s，并且已经有 mysql 的 pod 在运行。

## 部署

- 从项目 [stella-agent-ce](https://github.com/deepflowio/stella-agent-ce) 中获取服务镜像和部署需要的 yaml 文件
- 进入该项目 deploy 目录下的 templates 子目录，修改以下文件中的配置参数

  - 修改 `service.yaml`、`deployment.yaml`、`configmap.yaml` 文件中的 `namespace` 为实际使用的值（需要和 mysql 在同一个 namespace 下）
  - 修改 `configmap.yaml`文件中 `mysql`、下的 `host`、`port`、`user_name`、`user_password`、`database` 为真实值

  - 修改 `configmap.yaml`文件中 `ai` 部分，具体注意事项请看下文 `通过 yaml 来配置会话模型`

- 进入该项目 deploy 目录下的 templates 子目录，执行 yaml 文件部署服务
  - `kubectl  apply -f ./configmap.yaml`
  - `kubectl  apply -f ./deployment.yaml`
  - `kubectl  apply -f ./service.yaml`

### 通过 yaml 来配置会话模型

目前服务支持如下模型，默认值请保持不变，空缺值请去对应平台获取相应信息后填入。

```yaml
ai:
  enable: False # True、False 是否启用 AI 服务
  platforms:
    - enable: False # True、False 是否启用该模型，如果启用请补齐空缺配置。
      platform: "azure"
      model: "gpt"
      api_type: "azure"
      api_key: ""
      api_base: ""
      api_version: ""
      engine_name:
        - ""
    - enable: False
      platform: "aliyun"
      model: "dashscope"
      api_key: ""
      engine_name:
        - "qwen-turbo"
        - "qwen-plus"
    - enable: False
      platform: "baidu"
      model: "qianfan"
      api_key: ""
      api_secre: ""
      engine_name:
        - "ERNIE-Bot"
        - "ERNIE-Bot-turbo"
    - enable: False
      platform: "zhipu"
      model: "zhipuai"
      api_key: ""
      engine_name:
        - "chatglm_turbo"
```

## 使用

请求会话模型，platform_name：模型所在平台名称，比如：azure， engine_name：引擎名称，比如：DF-GPT4-32K。

- url
  - http[s]:://{controller_ip}:{port}/v1/ai/stream/{platform_name}?{engine_name}
- method
  - post
- header
  - content-type: application/json
- body
  - system_content: "你是一个网络专家" # 模型角色定位
  - user_content: "web 测试" # 问题描述
- Response

```text
  请提供有效信息，我无法回答
```

## 在 grafana 中使用

AI 模型解读功能（ alpha 版）目前可以在 `DeepFlow Topo Panel` 和 `DeepFlow Tracing Panel` 中使用

<img src="./imgs/topo-panel-with-ask-gpt.png">
<img src="./imgs/tracing-panel-with-ask-gpt.png">
