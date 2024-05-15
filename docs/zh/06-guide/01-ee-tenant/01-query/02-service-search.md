---
title: 资源搜索框
permalink: /guide/ee-tenant/query/service-search/
---

# 资源搜索框

应用-资源统计、网络-资源统计、网络-资源盘点都使用的是`资源搜索框`。

![01-资源搜索框](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405156644257f66c64.png)

- **① 搜索快照**：参考[搜索快照](./history/)章节说明
- **② 搜索输入形式**：可切换搜索输入的形式，目前有自由搜索、容器搜索、进程搜索。详细见后续章节描述

## 自由搜索

![02-自由搜索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405156644260e09259.png)

- **① 搜索条件输入框**：支持中英文联想输入，支持数据表中的 Tag 作为搜索条件
- **② 清空搜索条件**：清空`搜索条件输入框`
- **③ 切换主分组**：资源分组，对应功能界面的`资源`
- **④ 切换次分组**：其他分组，对应功能界面的`分组属性`

`搜索条件输入框`，每一个完整的搜索条件称之为一个`搜索标签`，接下来详细说明下`搜索标签`的如何管理。

![03-搜索标签](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa57a56f.png)

![04-操作符](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c4fa702aed.png)

![05-候选项](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230921650c50ecc63c1.png)

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

## 容器搜索

容器搜索形式将容器场景下常用的资源 Tag 固定为下拉框形式，以方便快速过滤容器资源。

![06-容器搜索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664425a2b3c16.png)

- **① 容器资源下拉框**：点击下拉框则可快速选择需要过滤的容器资源，后面下拉框的选项可与前面的选择联动。
- **② 搜索条件输入框**：详见上述`自由搜索`章节的描述
- **③ 收缩搜索条件输入框**：点击可快速收缩`搜索条件输入框`
- **④ 切换分组**：可快速切换容器资源 Tag

## 进程搜索

进程搜索形式与容器搜索类似，主要是将进程相关的常用 Tag 固定为下拉框形式，以便快速过滤进程资源。

![07-进程搜索](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240515664426411eea4.png)

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