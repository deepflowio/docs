---
title: DeepFlow 版本规则
permalink: /release-notes/versioning
---

# 版本命名

DeepFlow 遵循 [Semantic Versioning](https://semver.org/) 版本命名方式，版本号格式为 `X.Y.Z`，其中 `X` 为主要版本号（Major Version），`Y` 为次要版本号（Minor Version），`Z` 为补丁版本号（Patch Version）。

# 迭代周期

- 主要版本号 X 约每`两年`变更一次
- 次要版本号 Y 约每`四个月`变更一次
- 补丁版本号 Z 约每`两周`变更一次

# 版本维护时间

- 每个 `X.Y` 版本中最大的 `Z` 版本为长期支持（LTS，Long-Term Support）版本
- 每个 `X.Y.Z` 版本发布后，所有 `X.Y.0` - `X.Y.{Z-1}` 不再维护更新
