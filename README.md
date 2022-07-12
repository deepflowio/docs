# MetaFlow-docs

# Notes for writing markdown

1. The HOME file cannot be deleted. It belongs to the content of the home page in each language, and the content in its markdown can be adjusted.
2. Multi language version file directories need to be mapped one by one. For example, there is `/test.md`, then `/zh/test.md` must also exist, otherwise it will 404.
3. The markdown file must write the title attribute, because the file name is the same, but the directory on the left is different in Chinese and English. The Chinese Directory needs to be displayed in Chinese, so the title attribute needs to be written at the top of MD in advance. Format: (**three** middle dashes)

```md
---
title: xxx
---

Content
```

4. The left directory translation is written in the language file corresponding to the `/LOCALES' path. It supports writing paths, but it needs to be written from scratch (non language).

```md
eg: {
"about": "about",
"agent": "agent",
"agent/about": "about agent"
}

translate:

1. /about: about
2. /agent: agent
3. /agent/about: agent/about agent

Tip: `zh/agent/about`translate to`agent/about agent`，Because the directory structure needs to be preserved。
```

5. Picture size control scheme in markdown.

```md
![MetaFlow软件架构](./imgs/metaflow-architecture.png) // Irregular, adaptive in width and height
![MetaFlow软件架构](./imgs/metaflow-architecture.png?w=120) // For a picture with a width of 120, the height changes with scale
![MetaFlow软件架构](./imgs/metaflow-architecture.png?h=120) // For a picture with a height of 120, the width changes with scale
![MetaFlow软件架构](./imgs/metaflow-architecture.png?w=120&h=120) // For pictures with width and height of 120, the proportion is written dead (not recommended)
![MetaFlow软件架构](./imgs/metaflow-architecture.png?align=center) // The values of image alignment are center, left and right respectively. Default left
The above attributes can be used in combination, and multiple attributes can be spliced with `&'
```

6. Tip warning text block

```md
eg:
::: waring
This is waring
:::

eg:
::: tip
This is tip
:::
```