---
title: 安装 AskGPT 智能体
permalink: /ce-install/ai-agent
---

# 前提条件

已经在 K8s 中部署了社区版 DeepFlow。

# 部署 Stella

- 从项目 [stella-agent-ce](https://github.com/deepflowio/stella-agent-ce) 中获取服务镜像
  - 镜像通常的位置是：`TODO`
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
    - platform: "azure" # https://
      enable: False
      model: "gpt"
      api_type: "azure"
      api_key: "xxx" # FIXME
      api_base: "xxx" # FIXME
      api_version: "xxx" # FIXME
      engine_name:
        - "xxx" # FIXME
    - platform: "aliyun" # https://
      enable: False
      model: "dashscope"
      api_key: "xxx" # FIXME
      engine_name:
        - "qwen-turbo"
        - "qwen-plus"
    - platform: "baidu" # https://
      enable: False
      model: "qianfan"
      api_key: "xxx" # FIXME
      api_secre: "xxx" # FIXME
      engine_name:
        - "ERNIE-Bot"
        - "ERNIE-Bot-turbo"
    - platform: "zhipu" # https://
      enable: False
      model: "zhipuai"
      api_key: "xxx" # FIXME
      engine_name:
        - "chatglm_turbo"
```

## 在 Grafana 中使用

AI 模型解读功能（alpha 版）目前可以在 `DeepFlow Topo Panel` 和 `DeepFlow Tracing Panel` 中使用：

<img src="./imgs/topo-panel-with-ask-gpt.png">

<img src="./imgs/tracing-panel-with-ask-gpt.png">

## 调用 API 使用

Method：POST

URL：
- http[s]:://{controller_ip}:{port}/v1/ai/stream/{platform_name}?{engine_name}
- 参数说明
  - platform_name：模型所在平台名称，比如：azure。
  - engine_name：引擎名称，比如：DF-GPT4-32K。

Header：
```
content-type: application/json
```

请求的 JSON Body：
```
{
  "system_content": "你是一个网络专家", # 模型角色定位
  "user_content": "web 测试" # 问题描述
}
```

Response：
```text
请提供有效信息，我无法回答
```
