---
title: Installing AskGPT Agent
permalink: /ce-install/ai-agent
---

> This document was translated by ChatGPT

# Prerequisites

Community edition of DeepFlow has been deployed in K8s.

# Configuring Session Models

Currently, the service supports the following models, which can be enabled as needed through `values-custom.yaml` configuration:

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
helm upgrade deepflow -n deepflow -f values-custom.yaml deepflow/deepflow
```

# Using in Grafana

The AI model interpretation feature (alpha version) is currently available in `DeepFlow Topo Panel` and `DeepFlow Tracing Panel`:

![DeepFlow Topo Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a950a6ac.png)

![DeepFlow Tracing Panel](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024052966570a93501df.png)

# Using the API

Method: POST

URL:

- http[s]:://{ip}:{port}/v1/ai/stream/{platform_name}?engine={engine_name}
- Parameter Description
  - ip/port: K8s Service of stella-agent, default port is 30831.
  - platform_name: Name of the platform where the model is located, e.g., azure.
  - engine_name: Name of the engine, e.g., DF-GPT4-32K.

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
Web page optimization refers to improving the performance of a web page through various means, including load speed, response speed, and user experience.

Web page optimization is a complex and comprehensive task that involves multiple aspects, including front-end, back-end, and network. It requires analysis and optimization based on specific situations.

Here are some common web page optimization methods:

Front-end Optimization

Reduce HTTP requests: Reducing HTTP requests can decrease network latency and browser parsing time. Methods to reduce HTTP requests include:
Combining CSS and JavaScript files.
Using sprite images.
Implementing lazy loading.
Optimize resources: Optimizing resources can reduce their size, thereby improving load speed. Methods to optimize resources include:
Compressing images.
Using appropriate image formats.
Minifying CSS and JavaScript files.
Proper use of caching: Caching can reduce repeated network requests, thereby improving load speed. Methods to use caching properly include:
Setting appropriate cache headers.
Using browser caching.
Optimize DOM structure: A reasonable DOM structure can reduce browser parsing and rendering time. Methods to optimize DOM structure include:
Reducing the number and levels of DOM elements.
Avoiding complex CSS selectors.
Optimize JavaScript code: Optimizing JavaScript code can improve code execution efficiency. Methods to optimize JavaScript code include:
Avoiding global variables.
Using caching.
Using appropriate algorithms and data structures.
Back-end Optimization

Optimize database queries: Optimizing database queries can reduce the load on the database server, thereby improving page response speed. Methods to optimize database queries include:
Using appropriate indexes.
Avoiding unnecessary queries.
Using caching.
Optimize application server: Optimizing the application server can improve its performance. Methods to optimize the application server include:
Using appropriate load balancing strategies.
Using caching.
Optimizing code.
Network Optimization

Choose an appropriate CDN: A CDN can distribute content to servers closer to the user, reducing network latency.
Optimize DNS resolution: Optimizing DNS resolution can improve DNS resolution speed. Methods to optimize DNS resolution include:
Using a CDN.
Configuring DNS records.
Using Gzip compression: Gzip compression can reduce the amount of data transmitted, thereby improving load speed.
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