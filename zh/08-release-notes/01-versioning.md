---
title: MetaFlow 版本规则
---

# 版本命名

MetaFlow 遵循 [Semantic Versioning](https://semver.org/) 版本命名方式，版本号格式为 `X.Y.Z`，其中 `X` 为主要版本号（Major Version），`Y` 为次要版本号（Minor Version），`Z` 为补丁版本号（Patch Version）。

# 迭代周期

- 主要版本号 X 约每两年变更一次
- 次要版本号 Y 约每半年变更一次
- 补丁版本号 Z 约六周变更一次

# 版本维护时间

- 每个 `X.Y` 版本中最大的 `Z` 版本为长期支持（LTS，Long-Term Support）版本
- 每个 `X.Y.Z` 版本发布后，所有 `X.Y.0` - `X.Y.{Z-1}` 不再维护更新

# 版本发布阶段

一个 `X.Y.Z` 版本发布一版会经历如下阶段：
- X.Y.Z-A：Alpha Release，功能基本开发完成，经过了初步的测试，可能存在较多 Bug，可作为 Preview 使用
- X.Y.Z-B：Beta Release，经过了一轮完整测试，可能还存在一些 Bug，基本可用
- X.Y.Z：GA Release，可在生产环境进行升级
- X.Y.Z-$I：BugFix Release，不定期发布，$I 依次递增
