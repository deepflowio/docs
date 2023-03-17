# [DeepFlow-docs](https://deepflow.yunshan.net/deepflow-docs/)

# Notes for writing markdown

1. The HOME file cannot be deleted. It belongs to the content of the home page in each language, and the content in its markdown can be adjusted.
2. Multi language version file directories need to be mapped one by one. For example, there is `/test.md`, then `/zh/test.md` must also exist, otherwise it will 404.
3. For file naming, you need to add a serial number, such as `/01-about/01-test.md`, the framework will automatically sort `01` and use `/about/test/` as the access address
4. The markdown file must write the title attribute, because the file name is the same, but the directory on the left is different in Chinese and English. The Chinese Directory needs to be displayed in Chinese, so the title attribute needs to be written at the top of MD in advance. Format: (**three** middle dashes)

```md
---
title: xxx
---

Content
```

5. The left directory translation is written in the language file corresponding to the `/LOCALES' path. It supports writing paths, but it needs to be written from scratch (non language).

```md
eg: {
"about": "about",
"agent": "agent",
"agent/about": "about agent"
}

translate:

I. /about: about
II. /agent: agent
III. /agent/about: agent/about agent

Tip: `agent/about`translate to`agent/about agent`，Because the directory structure needs to be preserved。
```

6. Picture size control scheme in markdown.

```md
![DeepFlow Architecture](./imgs/deepflow-architecture.png) // Irregular, adaptive in width and height
![DeepFlow Architecture](./imgs/deepflow-architecture.png?w=120) // For a picture with a width of 120, the height changes with scale
![DeepFlow Architecture](./imgs/deepflow-architecture.png?h=120) // For a picture with a height of 120, the width changes with scale
![DeepFlow Architecture](./imgs/deepflow-architecture.png?w=120&h=120) // For pictures with width and height of 120, the proportion is written dead (not recommended)
![DeepFlow Architecture](./imgs/deepflow-architecture.png?align=center) // The values of image alignment are center, left and right respectively. Default left
The above attributes can be used in combination, and multiple attributes can be spliced with `&'
```

7. text block

```md
::: tip Tip
This is a tip
:::

::: warning Warning
This is a warning
:::

::: danger Danger
This is a danger warning
:::

::: details Details
This is a detail block, which does not take effect in IE / edge
:::

::: tip
This is a default tip
:::
```

output

![text block](./images/text-block-en.jpg)

8. As for the reference of image URL resources in markdown, Under the current new mode, image URL resources do not participate in compilation, so the compiled address can be used directly。(Compilation will remove the sequence number)

```md
old: ![DeepFlow Architecture](./../01-about/imgs/deepflow-architecture.png)
new: ![DeepFlow Architecture](./../about/imgs/deepflow-architecture.png)
```

9. Document footnotes

a. Two ways of writing, inline + non inline

b. Footnotes will be uniformly arranged at the bottom of the document

c. The semicolon of the reference source is English semicolon

d. Footnotes that cannot find the reference source will be displayed as is without any modification

```md
Footnote 1 link [^first]

Footnote 2 link [^second]

In line footnote ^[text of inline footnote] definition

Duplicate footer definition [^second]

If the footnote of the reference source cannot be found, [^third] will be displayed as it is

[^first]: footnote
[^second]: footnote text
```

![footnote](./images/foot-note-en.jpg)

10. Code block grouping

````
::: code-tabs#shell

@tab pnpm

```bash
pnpm install
```

@tab npm

```bash
npm install
```

@tab yarn

```bash
yarn install
```

:::

````

11. Generate data display from csv file address，here are some usage restrictions

a. If the address is wrong, no csv data will be generated

b. If the data return does not start with '#', no csv data will be generated

c. Finally, the csv content needs to be separated by ',', otherwise it cannot be parsed and displayed

d. The first line # starts with the csv header, other comments that begin with #, the last non blank line is the csv content

```
[csv-$csvTitle]($csvURL)

eg:
[csv-L7 Protocol List](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)
```

12. Generate an upgraded version of the data display from the csv file address

Compared to the previous version, this version mainly loads Category data on demand, not all data

```
[csv-$csvTitle]($csvURL?Category=xxx)

eg:
[csv-L7 Protocol List](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_metrics/vtap_app_port.ch?Category=Throuthput)
```