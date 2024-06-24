---
title: Installing AskGPT Agent
permalink: /ce-install/ai-agent
---

> This document was translated by ChatGPT

# Prerequisites

Community edition of DeepFlow has been deployed in K8s.

# Deploy Stella

- Obtain the service image from the project [stella-agent-ce](https://github.com/deepflowio/stella-agent-ce)
  - The usual location of the image is: `https://github.com/deepflowio/deepflow/pkgs/container/deepflow-ce%2Fdeepflow-server`
- Enter the `deploy/templates` directory in the project and modify the configuration parameters in the following files
  - Modify the `namespace` in `service.yaml`, `deployment.yaml`, and `configmap.yaml` to the actual value (it needs to be in the same namespace as mysql)
  - Modify the `host`, `port`, `user_name`, `user_password`, and `database` under `mysql` in the `configmap.yaml` file to the real values
  - Modify the `ai` section in the `configmap.yaml` file, for specific precautions, please see the section `Configure Session Model via yaml` below
- Enter the `deploy/templates` directory in the project and execute the yaml files to deploy the service
  - `kubectl apply -f ./configmap.yaml`
  - `kubectl apply -f ./deployment.yaml`
  - `kubectl apply -f ./service.yaml`

# Configure Session Model via yaml

Currently, the service supports the following models, which can be enabled as needed:

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

# Usage in Grafana

The AI model interpretation feature (alpha version) is currently available in the `DeepFlow Topo Panel` and `DeepFlow Tracing Panel`:

![DeepFlow Topo Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a950a6ac.png)

![DeepFlow Tracing Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a93501df.png)

# Using the API

Method: POST

URL:

- http[s]:://{ip}:{port}/v1/ai/stream/{platform_name}?engine={engine_name}
- Parameter description
  - ip/port: K8s Service of stella-agent, default port is 30831.
  - platform_name: The name of the platform where the model is located, e.g., azure.
  - engine_name: The name of the engine, e.g., DF-GPT4-32K.

Header:

```
content-type: application/json
```

Request JSON Body:

```
{
  "system_content": "You are an expert in web development", # Model role positioning
  "user_content": "How to optimize a web page" # Problem description
}
```

Response:

```text
Web page optimization refers to improving the performance of a web page through various means, including loading speed, response speed, user experience, etc.

Web page optimization is a complex and comprehensive task that involves multiple aspects, including front-end, back-end, and network. It requires analysis and optimization based on specific situations.

Here are some common web page optimization methods:

Front-end optimization

Reduce HTTP requests: Reducing HTTP requests can reduce network latency and browser parsing time. This can be achieved by:
Combining CSS and JavaScript files.
Using sprite images.
Using lazy loading.
Optimize resources: Optimizing resources can reduce their size, thereby improving loading speed. This can be achieved by:
Compressing images.
Using appropriate image formats.
Minifying CSS and JavaScript files.
Proper use of caching: Caching can reduce repeated network requests, thereby improving loading speed. This can be achieved by:
Setting appropriate cache headers.
Using browser caching.
Optimize DOM structure: A reasonable DOM structure can reduce browser parsing and rendering time. This can be achieved by:
Reducing the number and hierarchy of DOM elements.
Avoiding complex CSS selectors.
Optimize JavaScript code: Optimizing JavaScript code can improve code execution efficiency. This can be achieved by:
Avoiding the use of global variables.
Using caching.
Using appropriate algorithms and data structures.
Back-end optimization

Optimize database queries: Optimizing database queries can reduce the load on the database server, thereby improving page response speed. This can be achieved by:
Using appropriate indexes.
Avoiding unnecessary queries.
Using caching.
Optimize application server: Optimizing the application server can improve its performance. This can be achieved by:
Using appropriate load balancing strategies.
Using caching.
Optimizing code.
Network optimization

Choose an appropriate CDN: A CDN can distribute content to servers closer to the user, thereby reducing network latency.
Optimize DNS resolution: Optimizing DNS resolution can improve DNS resolution speed. This can be achieved by:
Using a CDN.
Configuring DNS records.
Using Gzip compression: Gzip compression can reduce the amount of data transmitted, thereby improving loading speed.
Tools

Various tools can be used to test and analyze the performance of web pages, such as:

Google PageSpeed Insights
Lighthouse
WebPageTest
By using these tools, you can identify performance bottlenecks in web pages and perform corresponding optimizations.

Web page optimization is a continuous process that requires constant testing and optimization to achieve the best performance.

Here are some additional suggestions:

Always consider performance when developing web pages.
Use performance testing tools to test the performance of web pages.
Monitor the performance of web pages and optimize them regularly.
I hope this information is helpful to you.
```