---
title: 服务搜索框
permalink: /guide/ee-tenant/query/service-search/
---

# 服务搜索框

应用-资源统计、网络-资源统计、网络-资源盘点都使用的是`资源搜索框`。

![01-服务搜索框](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa530137.png)

- **① 搜索条件输入框**：支持中英文联想输入，支持数据表中的 Tag 作为搜索条件
- **② 切换主分组**：资源分组，对应功能界面的`资源`
- **③ 切换次分组**：其他分组，对应功能界面的`分组属性`
- **④ 清空搜索条件**：清空`搜索条件输入框`及`主次分组`恢复到默认值
- **⑤ 保存搜索条件**：保存当前界面输入的搜索条件

`搜索条件输入框`，每一个完整的搜索条件称之为一个`搜索标签`，接下来详细说明下`搜索标签`的如何管理。

![02-搜索标签](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa57a56f.png)

![03-操作符](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa702aed.png)

![04-候选项](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c50ecc63c1.png)

- **① Tag 名称**：支持查询数据表中的 Tag，详细描述可查看`数据库字段`
  - 支持中英文联想
  - 鼠标移动到 Tag 名称上可查看详情信息
  - 语义：不同的 Tag 之间使用 and 连接，相同 Tag 之间根据`操作符`的不同使用的逻辑运算符不一致
    - a：`=`、`:`、`~` 用 or 连接
    - b：`!=`、`!:`、`!~` 用 and 连接
    - c：`>=`、`<=`、`>`、`<` 用 and 连接
    - a/b/c 连接后，再使用 and 连接，例如：`搜索条件输入框：server_port > 20, server_port < 80, server_port != 44, server_port != 45`，生效的条件为`(server_port > 20 and server_port < 80 ) and (server_port != 44 and server_port != 45)`
- **② 操作符**：目前支持精准匹配、模糊匹配、正则匹配
  - 精准匹配：对应`=`、`!=`、`>=`、`<=`操作符，对于`resource 类型`的 Tag 按资源 ID 进行精准匹配，其他则按实际输入进行精准匹配
  - 模糊匹配：对应`:`、`!:`操作符，字符串匹配，支持`*`通配符。例如`*123*`则匹配所有<mark>包含</mark>`123`的字符串，而`123`则只匹配<mark>完全等于</mark>`123`的字符串
  - 正则匹配：对应`~`、`!~`操作符，字符串正则匹配
- **③ Tag 值**：筛选或者直接输入需要过滤的值
  - NULL：空值，一般配合`!=`使用，为过滤`全部`的语义
  - **⑦ 表格过滤**：当筛选候选项出现重名的情况时或者需要多选时，可通过`表格过滤`精准资源
- **④ 禁用**：禁用当前`搜索标签`对应的搜索条件
- **⑤ 修改**：修改当前`搜索标签`对应的搜索条件
- **⑥ 删除**：删除当前`搜索标签`

# 应用场景

## 查看某工作负载的服务性能

- 功能页面：应用-指标
- 搜索标签：pod_ns = gcp-microservices-demo
- 主分组：auto_service
- 次分组：--

![05-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa039078.png)

## 查看某个命名空间某个工作负载的性能

- 功能页面：应用-指标
- 搜索标签：pod_ns = gcp-microservices-demo，pod_group : loadgenerator
- 主分组：auto_service
- 次分组：--

![06-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa17b7c6.png)

## 查看流量 TOP 5 的云服务器

- 功能页面：网络-服务
- 搜索标签：无
- 主分组：chost
- 次分组：--

![07-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2642e9.png)

## 查看某云服务器流量 TOP 5 服务端口

- 功能页面：网络-服务
- 搜索标签：role = 服务端
- 主分组：chost
- 次分组：server_port

![08-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa2adfda.png)

## 查看某个云服务器某个端口的网络性能

- 功能页面：网络-服务
- 搜索标签：role = 服务端，chost = cn-chengdu.172.16.0.196，server_port = 22
- 主分组：chost
- 次分组：server_port

![09-查询结果](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa44b491.png)