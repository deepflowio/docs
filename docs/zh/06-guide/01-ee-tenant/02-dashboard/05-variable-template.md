---
title: 模板变量
permalink: /guide/ee-tenant/dashboard/variable-template/
---

# 模板变量

模板变量是通过在当前视图定义一组变量，并由子视图的搜索条件引用变量，来快速的改变子视图的搜索条件，就可达到在一个视图仅需要改变变量的值，就可以查看其对应的视图，而无需仅因搜索条件的不同而构建多个相同的可视化面板。

## 管理模板变量

可通过`模板变量列表`对模板变量进行统一的管理。

如下图所示，在模板变量列表中，支持`① 新增`、`② 删除`、`③ 修改`操作，支持在`⑤ 搜索栏`中输入任意字符串，也支持`④ 设置`列宽的展示方式，如均分列宽，按内容分配列宽。

![00-模版变量列表](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf59d3ef4d.png)

## 新建模板变量

需要对当前视图构建一些快速搜索条件时，则可`新建模板变量`来实现。例如：构建`应用可观测性视图`时，需要快速查看不同`应用`的视图，则可将`应用`这个搜索条件为构建一个`模板变量`。

**第一步**：点击视图详情页面的`① 设置`按钮，选择`② 管理模板变量`

![01-第一步](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf68c0b038.png)

**第二步**：点击模板变量列表弹出框的`③ 新建模板变量`按钮

![02-第二步](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf70be224b.png)

**第三步**：根据所需，创建模板变量。DeepFlow 平台一共提供三种类型的模板变量，分别为`下拉选择`、`文本输入`、`分组`，详细描述见后续对应章节。

![03-第三步](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf7bb39bbe.png)

### 下拉选择

下拉选择类型的模板变量，是通过下拉框切换的形式来改变搜索条件。目前支持对 DeepFlow 平台的数据库 `resource` 和 `xx_enum` 类型的 `Tag` 构建此类型的模板变量。
- <mark>注</mark>：DeepFlow 平台数据库描述，见后续说明。

![04-下拉选择](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024032165fbf81b3b73b.png)

- **① 查询类型:** 不同的数据传值方式不同
  - 按ID查询：支持传输 id 查询
  - 按名称查询：支持传输 string 查询
- **② 取值范围:**：支持`静态取值`与`动态取值`两种方式设置模板变量的取值
  - 静态取值：引用后，取值范围固定
  - 动态取值：与静态取值相比，动态取值的取值范围可受`静态取值`或`取值Tag`影响，使用详情，请参阅【创建与引用】章节
  - **③ 数据来源:** 确定模板变量取值所在的数据表
  - **④ 取值Tag:** 确定模板变量取值对应的 Tag
  - **⑤ 取值范围:** 选择模板变量对应的取值 
- **⑥ 选择模式:** 通过下拉框切换的形式来改变搜索条件，默认为单选
  - 多选：勾选`多选`，则可切换为`多选`模式
  - 全选：勾选`全选`，则候选项中出现`全选`，即选中当前模板变量全部的取值
- 如何引用：图表的搜索栏中添加查询条件时，输入Tag，已建立的相同`Tag`模版变量，将以候选项的形式出现在下拉框中，使用详情，请参阅【创建与引用】章节 

#### 创建与引用

接下来，将演示如何创建与引用`静态模版变量`与`动态模板变量`，以及将动态与静态模版变量进行联动

- 首先，创建名为`K8s 命名空间`的`pod_ns`的静态模版变量，取值范围为`deepflow-ebpf-istio-demo、deepflow-otel-grpc-demo、deepflow-telegraf-demo`
  
![05-创建静态模板变量](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4b0c94b.png)

- 其次，创建名为`K8s 工作负载`的`pod_group`的动态模版变量，取值范围选择`pod_ns = K8s 命名空间`，即`pod_group`的下拉候选项将受到`pod_ns`的选择变化而变化
  
![06-创建动态模板变量](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4c9cee2.png)

- 随后，选择查询条件`pod_group = K8s 工作负载`，在图表的搜索条件中引用模板变量

![07-模板变量引用](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd4e0596a.png)

- 最后，可在视图顶部快速切换引用的模板变量，`K8s 命名空间`选择不同，`K8s 工作负载`的候选项不同

![08-使用模版变量](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd504e2f4.png)

![09-切换模版变量](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240402660bbd5108331.png)

### 文本输入

文本输入类型的模板变量，是通过输入字符串的形式来改变搜索条件。

![10-文本输入](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716002b8.png)

文本输入类型的模板变量，支持被任何可直接输入的 `Tag` 或者`操作符`引用。在搜索条件中出现的形式与`下拉选择`类型的模板变量类似。
- ① Tag 引用：支持 int、int_enum、string、ip、mac 类型，以上数据类型 Tag 均支持所有操作符

![11-Tag 引用](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202309186508271402080.png)

- ② 操作符引用：支持 :, !:, =~, !~ 类型，以上类型均支持所有类型 Tag

![12-操作符引用](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082716add4e.png)

### 分组

分组类型的模板变量，是通过下拉框切换的形式改变分组。例如需要从类似`K8s 集群` -> `K8s 命名空间` -> `K8s 容器服务` -> `K8s 工作负载` -> `K8s 容器 POD`这种，层层深入挖掘数据时，可构建此模板变量。

![13-分组](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230918650827184c5b7.png)

- 取值范围：目前 DeepFlow 平台数据库的所有 `Tag` 都可以作为此类型模板变量的取值
  - ① ：确定模板变量取值所在的数据表
  - ② ：选择模板变量对应的取值
- 选择模式：详情描述，见<mark>下拉选择</mark>类型的模板变量描述
  - <mark>注</mark>：主分组不可以引用`多选`或`全选`模式的模板变量

分组类型的模板变量，仅可被搜索条件中的分组引用。在分组下拉框中，以候选项的形式出现。

![14-分组引用](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091865082715de5ff.png)