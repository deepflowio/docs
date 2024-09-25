---
title: 表格
permalink: /guide/ee-tenant/dashboard/panel/table/
---

# 表格

表格用于展示结构化数据的详细信息。DeepFlow 的表格可分为是`聚合表格`与`详情表格`两种表格。

## 聚合表格

聚合表格支持同时查询多个相同类型数据表的数据，例如，同为`服务指标`或`路径指标`或`xx日志`。

![01-聚合表格](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031965f8f90497a37.png)

- **① 查询区域:** 图表的基础操作，使用详情，请参阅【[流量拓扑 - 修改指标量](./topology/)】章节
- **② 修改指标量:** 图表的基础操作，使用详情，请参阅【[流量拓扑 - 总览介绍](./topology/)】章节
  - 长按数据并进行拖拽，支持将数据的排序映射到表格中
- **③ 设置:** 图表的基础操作，使用详情，请参阅【[流量拓扑 - 设置](./topology/)】章节
- **④ 删除:** 为`视图`中的能力，使用详情，请参阅【[流量拓扑 - 总览介绍](./topology/)】章节

### 编辑

聚合表格的编辑框由三部分组成，分别为`① 图表`、`② 搜索条件`、`③ 配置`。

![02-编辑](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664aff296a339.png)

- **① 图表:** 图表根据`② 搜索条件`、`③ 配置`进行绘制
- **② 搜索条件:** 搜索条件的使用，请参阅【[搜索](../../query/overview/)】章节
- **③ 配置:** 支持快速切换图表类型、图表进行样式及相关功能进行配置
  - **切换图表类型:** 图表基础功能，使用详情，请参阅【[折线图](./line/)】章节
  - **常用配置:** 有丰富的功能支持对图表进行样式设置
    - **图表信息:** 图表基础功能，使用详情，请参阅【[折线图](./line/)】章节
    - **颜色:** 对图表的文字或背景设置基础颜色
      - 注意：仅对开启`列设置-颜色`的列生效
    - **列设置:** 支持对列的颜色、对齐方式、数值显示等进行设置
      - 颜色：已配置的颜色可选择着色对象，可选择不生效、文字、背景
      - 列对齐：选择列对齐位置，可选择左、中、右
      - 值映射：可选择三中方式匹配指定的列值，替换显示成自定义文本内容
        - 文本：通过字符串进行匹配
        - 范围：通过数值范围进行匹配
        - 正则表达式：通过正则表达式进行匹配
        - 注意：值映射生效优先级为`文本 > 范围 = 正则表达式`，存在相同优先级的匹配条件时，排序位置靠上的生效
      - 阈值：设置数值范围，在指定范围的数据，文本/背景显示指定颜色
      - 单位：设置指标的单位
      - 别名：设置指标的别名
  - **高级配置:**
    - **单元格:** 支持设置表格复制功能的配置
      - 复制功能：开启或关闭表格内容复制功能
      - 复制内容：选择要复制的数据内容
        - 复制数据：仅复制当前单元格的数据内容，即`value`
        - 正向筛选条件：复制内容格式为`key: value`，可将复制内容粘贴至页面的搜索栏，搜索栏可快速识别成`搜索标签`进行查询
        - 正向筛选条件：复制内容格式为`key!: value`，可将复制内容粘贴至页面的搜索栏，搜索栏可快速识别成`搜索标签`进行查询
          - 搜索标签使用详情，请参阅【[服务搜索框](../../query/service-search/)】章节
    - **表格设置:** 支持对表格的边框、表头进行设置

## 详情表格

详情表格仅支查询单个的日志类数据数据，例如，流日志、调用日志。

![03-详情表格](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024031965f8f7906c908.png)

- **① 查询区域:** 图表的基础操作，使用详情，请参阅【[流量拓扑 - 修改指标量](./topology/)】章节
- **② 列选择:** 支持对当前表格中所支持的列选项数据进行搜索、添加、删除
  - 长按数据并进行拖拽，支持将数据的排序映射到表格中
- **③ 设置:** 图表的基础操作，使用详情，请参阅【[流量拓扑 - 设置](./topology/)】章节
- **④ 删除:** 为`视图`中的能力，使用详情，请参阅【[流量拓扑 - 总览介绍](./topology/)】章节

### 编辑

详情表格的编辑框由三部分组成，分别为`① 图表`、`② 搜索条件`、`③ 配置`。

![04-编辑](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240520664aff2835cce.png)

- **① 图表:** 图表根据`② 搜索条件`、`③ 配置`进行绘制
- **② 搜索条件:** 搜索条件的使用，请参阅【[搜索](../../query/overview/)】章节
  > 注意：详情表格不支持添加多个查询条件
- **③ 配置:** 使用详情，请参阅【聚合表格 - 编辑】章节