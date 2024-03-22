---
title: 模板变量
permalink: /guide/ee-tenant/dashboard/variable-template/
---

# 模板变量

模板变量是通过在当前视图定义一组变量，并由子视图的搜索条件引用变量，来快速的改变子视图的搜索条件，就可达到在一个视图仅需要改变变量的值，就可以查看其对应的视图，而无需仅因搜索条件的不同而构建多个相同的可视化面板。接下来，将介绍如何使用模板变量。

## 新建模板变量

需要对当前视图构建一些快速搜索条件时，则可`新建模板变量`来实现。例如：构建`应用可观测性视图`时，需要快速查看不同`应用`的视图，则可将`应用`这个搜索条件为构建一个`模板变量`。

**第一步**：点击视图详情页面的`① 设置`按钮，选择`② 管理模板变量`

![01-第一步](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf68c0b038.png)

**第二步**：点击模板变量列表弹出框的`③ 新建模板变量`按钮

`模板变量列表`支持对模板变量进行统一的管理。如下图所示，在模板变量列表中，支持`新增`、`删除`、`修改`、`查找`等操作。

![02-第二步](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf70be224b.png)

**第三步**：根据所需，创建模板变量。DeepFlow 平台一共提供三种类型的模板变量，分别为`下拉选择`、`文本输入`、`分组`，详细描述见后续对应章节。

![03-第三步](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf7bb39bbe.png)

## 下拉选择

下拉选择类型的模板变量，是通过下拉框切换的形式来改变搜索条件。目前支持对 DeepFlow 平台的数据库 `resource` 和 `xx_enum` 类型的 `Tag` 构建此类型的模板变量。
- <mark>注</mark>：DeepFlow 平台数据库描述，见后续说明。

![04-variable-template-04.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf81b3b73b.png)

- **① 查询类型:** 必选，根据不同的数据，选择相应的传值方式
  - 按 ID 查询：支持传输 id 查询
  - 按名称查询：支持传输 string 查询
- **② 取值范围:** 可通过`静态取值`/`动态取值`两种方式设置模板变量
  - 静态取值：通过选择数据表、Tag 及取值范围，即可完成模板变量的定义。使用详情，请参阅【静态取值】章节
  - 动态取值：与静态取值不同的是，仅部分 Tag 可以设置为动态取值，并且可以与静态取值的模板变量进行联动选择。如需了解更多信息，请查阅【动态取值】章节
  - **③ 数据来源:** 确定模板变量取值所在的数据表
  - **④ 取值Tag:** 选择对应数据表下的 Tag
  - **⑤ 取值范围:** 选择对应 Tag 的取值
- **⑥ 选择模式:** 通过下拉框切换的形式来改变搜索条件，默认只能单选
  - 多选：勾选`多选`，则可切换为`多选`模式
  - 全选：勾选`全选`，则候选项中出现`全选`，即选中当前模板变量全部的取值
  
### 静态取值



### 动态取值

![5_6.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082713aca9a.png)

![5_7.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082ac9cb794.png)

## 文本输入

文本输入类型的模板变量，是通过输入字符串的形式来改变搜索条件。

![5_8.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716002b8.png)

文本输入类型的模板变量，支持被任何可直接输入的 `Tag` 或者`操作符`引用。在搜索条件中出现的形式与`下拉选择`类型的模板变量类似。
- ① Tag 引用：支持 int、int_enum、string、ip、mac 类型，以上数据类型 Tag 均支持所有操作符

![5_9.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271402080.png)
- ② 操作符引用：支持 :, !:, =~, !~ 类型，以上类型均支持所有类型 Tag

![5_10.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716add4e.png)

## 分组

分组类型的模板变量，是通过下拉框切换的形式改变分组。例如需要从类似`K8s 集群` -> `K8s 命名空间` -> `K8s 容器服务` -> `K8s 工作负载` -> `K8s 容器 POD`这种，层层深入挖掘数据时，可构建此模板变量。

![5_11.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650827184c5b7.png)

- 取值范围：目前 DeepFlow 平台数据库的所有 `Tag` 都可以作为此类型模板变量的取值
  - ① ：确定模板变量取值所在的数据表
  - ② ：选择模板变量对应的取值
- 选择模式：详情描述，见<mark>下拉选择</mark>类型的模板变量描述
  - <mark>注</mark>：主分组不可以引用`多选`或`全选`模式的模板变量

分组类型的模板变量，仅可被搜索条件中的分组引用。在分组下拉框中，以候选项的形式出现。

![5_12.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082715de5ff.png)

## 操作模板变量

模板变量引用成功后，则可在视图的顶部改变模板变量的值，来快速切换视图的数据了。

![5_13.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082719abddf.png)

> 注：下拉选择类型的模板变量，仅能被 `name` 和 `type` 相同的 `Tag` 引用。例如取值来自 `flow_metrics.vtap_flow_port`数据表的 `chost` 这个 `Tag`，则引用的时候只能被`chost` 引用。模板变量会以下拉框候选项出现在搜索条件中，选择模板变量，则成功引用了模板变量。
