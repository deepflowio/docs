# metaflow-docs

# markdown编写注意事项
1. HOME文件不可删除，属于各语言下的首页内容，markdown里面的内容可以调整。
2. 多语言版本文件目录需要一一对应，比如说存在`/test.md`，那么`/zh/test.md`也一定要存在，否则会404。
3. md文件一定要写title属性，因为文件名是一样的，但是在中英文下左侧目录是不同的，中文下需要显示中文目录，故需要在md顶部提前写好title属性。格式：（**三**个中划线）
```md
---
title: xxx
---
```
4. 目录翻译写在`/LOCALES.json`文件内。
5. markdown内的图片大小控制方案。
```md
![MetaFlow软件架构](./imgs/metaflow-architecture.png) // 无规则，宽高皆自适应
![MetaFlow软件架构](./imgs/metaflow-architecture.png?w=120) // 宽度为120的图片，高度随比例变化
![MetaFlow软件架构](./imgs/metaflow-architecture.png?h=120) // 高度为120的图片，宽度随比例变化
![MetaFlow软件架构](./imgs/metaflow-architecture.png?w=120&h=120) // 宽高都为120的图片，比例写死（**不建议使用**）
![MetaFlow软件架构](./imgs/metaflow-architecture.png?align=center) // 图片居中，align取值分别是center(居中)，left(靠左)，right(靠右)
以上属性可结合使用，多属性用`&`拼接
```