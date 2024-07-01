---
title: 对接公有云 API
permalink: /ee-install/saas/cloud
---

# 简介

DeepFlow 云原生可观测性平台对所有观测数据自动化注入`云资源`、`K8s 资源`和`K8s 自定义 Label`标签，因此 DeepFlow 在开始正常之前工作需先完成云、容器资源的对接。
DeepFlow 通过 云平台的 API 接口自动对接学习公有云租户的资源标签，通过 K8s 集群的 apiserver 自动对接学习容器资源标签。

# 创建云平台（阿里公有云）

操作步骤：
1. 进入「资源」-「资源池」-「云平台」
2. 点击“新建云平台”
3. 填写“云平台”相关信息，点击“确定”，得到云平台

| 配置项 | 填写内容 | 备注 |
|-------|-----|--------|
| 云平台名称 | 例：aliyun-1	| 云平台的名称 |
| AccessKey ID	 | 例：LTAI4FiU3ad3txLUSRg8xGfn	 | 请在控制台-accesskeys页面上配置用于API访问的密钥ID（只读权限即可） |
| AccessKey Secret	 | 例：itsHzkPo22jbtNZ61QEz3gc5bsPnXP	 | 请在控制台-accesskeys页面上配置用于API访问的密钥KEY（只读权限即可） |
| 区域白名单	 | 例：华南3（广州）,华北6（乌兰察布）	 | 可以配置多个，不支持正则表达式；优先级高于区域黑名单；具体取值可参考阿里云 ECS 地域和可用区列表 |

# 检查
