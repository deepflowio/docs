# MetaFlow-docs

# markdown 编写注意事项

1. HOME 文件不可删除，属于各语言下的首页内容，其 markdown 里面的内容可以调整。
2. 多语言版本文件目录需要一一对应，比如说存在`/test.md`，那么`/zh/test.md`也一定要存在，否则会 404。
3. 文件命名需要增加序列号，比如说`/01-about/01-test.md`，框架会自动把`01`拿去排序，`/about/test/`作为访问地址。
4. markdown 文件一定要写 title 属性，因为文件名是一样的，但是在中英文下左侧目录是不同的，中文下需要显示中文目录，故需要在 md 顶部提前写好 title 属性。格式：（**三**个中划线）

```md
---
title: xxx
---

内容
```

5. 左侧目录翻译写在`/LOCALES`路径对应的语言文件内，支持书写路径，但是需要从头（非语言）开始写。

```md
eg: {
"about": "关于",
"agent": "采集器",
"agent/about": "关于采集器"
}

翻译：

I. /zh/about: 关于
II. /zh/agent: 采集器
III. /zh/agent/about: 采集器/关于采集器

Tip: `zh/agent/about`翻译成`采集器/关于采集器`，是因为需要保留目录结构。
```

6. markdown 内的图片大小控制方案。

```md
![MetaFlow软件架构](./imgs/metaflow-architecture.png) // 无规则，宽高皆自适应
![MetaFlow软件架构](./imgs/metaflow-architecture.png?w=120) // 宽度为 120 的图片，高度随比例变化
![MetaFlow软件架构](./imgs/metaflow-architecture.png?h=120) // 高度为 120 的图片，宽度随比例变化
![MetaFlow软件架构](./imgs/metaflow-architecture.png?w=120&h=120) // 宽高都为 120 的图片，比例写死（不建议使用）
![MetaFlow软件架构](./imgs/metaflow-architecture.png?align=center) // 图片对齐方式，align 取值分别是 center(居中)，left(靠左)，right(靠右)。默认 left
以上属性可结合使用，多属性用`&`拼接
```

7. tip waring 文字块

```md
eg:
::: waring
这是一个 waring
:::

eg:
::: tip
这是一个 tip
:::
```
