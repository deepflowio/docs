---
title: 模板变量
permalink: /guide/ee-tenant/dashboard/variable-template/
---

# 模板变量

模板变量是通过在当前视图定义一组变量，并由子视图的搜索条件引用变量，来快速的改变子视图的搜索条件，就可达到在一个视图仅需要改变变量的值，就可以查看其对应的视图，而无需仅因搜索条件的不同而构建多个相同的可视化面板。

## 管理模板变量

可通过`模板变量列表`对模板变量进行统一的管理。

如下图所示，在模板变量列表中，支持`① 新增`、`② 删除`、`③ 修改`操作，支持在`⑤ 搜索栏`中输入任意字符串，也支持`④ 设置`列宽的展示方式，如均分列宽，按内容分配列宽。

![5_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271003b1f.png)

## 新建模板变量

需要对当前视图构建一些快速搜索条件时，则可`新建模板变量`来实现。例如：构建`应用可观测性视图`时，需要快速查看不同`应用`的视图，则可将`应用`这个搜索条件为构建一个`模板变量`。

**第一步**：点击视图详情页面的`① 设置`按钮，选择`② 管理模板变量`

![5_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082710acc0d.png)

**第二步**：点击模板变量列表弹出框的`③ 新建模板变量`按钮

![5_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508281781e9e.png)

**第三步**：根据所需，创建模板变量。DeepFlow 平台一共提供三种类型的模板变量，分别为`下拉选择`、`文本输入`、`分组`，详细描述见后续对应章节。

![5_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508270fc440b.png)

### 下拉选择

下拉选择类型的模板变量，是通过下拉框切换的形式来改变搜索条件。目前支持对 DeepFlow 平台的数据库 `resource` 和 `xx_enum` 类型的 `Tag` 构建此类型的模板变量。
- <mark>注</mark>：DeepFlow 平台数据库描述，见后续说明。

![5_5.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650827189345b.png)

- 取值范围：选择模板变量的取值
  - ① 传值模式：不同的数据传值方式不同
    - 仅传值：支持传输 id 查询
    - 传标签：支持传输 string 查询
  - ② 取值范围：确定模板变量取值所在的数据表
    - ③ ：确定模板变量取值对应的 Tag
    - ④ ：选择模板变量对应的取值
- 选择模式：通过下拉框切换的形式来改变搜索条件，默认只能单选
  - ⑤ ：勾选`多选`，则可切换为`多选`模式
  - ⑤ ：勾选`全选`，则候选项中出现`全选`，即选中当前模板变量全部的取值

下拉选择类型的模板变量，仅能被 `name` 和 `type` 相同的 `Tag` 引用。例如取值来自 `flow_metrics.vtap_flow_port`数据表的 `chost` 这个 `Tag`，则引用的时候只能被`chost` 引用。模板变量会以下拉框候选项出现在搜索条件中，选择模板变量，则成功引用了模板变量。

![5_6.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082713aca9a.png)

![5_7.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082ac9cb794.png)

### 文本输入

文本输入类型的模板变量，是通过输入字符串的形式来改变搜索条件。

![5_8.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716002b8.png)

文本输入类型的模板变量，支持被任何可直接输入的 `Tag` 或者`操作符`引用。在搜索条件中出现的形式与`下拉选择`类型的模板变量类似。
- ① Tag 引用：支持 int、int_enum、string、ip、mac 类型，以上数据类型 Tag 均支持所有操作符

![5_9.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271402080.png)
- ② 操作符引用：支持 :, !:, =~, !~ 类型，以上类型均支持所有类型 Tag

![5_10.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716add4e.png)

### 分组

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

## 从 URL 设置选中的模板变量值

::: warning Warning
该功能不是对外的标准功能，对外提供需要单独验证功能。
:::

新建一个名字叫 `变量名称` 的变量，子视图引用模板变量。然后在URL里添加 &template={"value":[2,3,4]}，子视图中就会使用对应的变量。
