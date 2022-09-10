---
title: DeepFlow 6.1.2 Release Notes
permalink: /release-notes/release-6.1.2
---

V6.1.2 是开源之后的第二个版本，我们正式开启两周一个小版本的节奏。

# 应用

- AutoMetrics、AutoLogging
  - MySQL 新增 `COM_STMT_PREPARE`、`COM_STMT_EXECUTE`、`COM_STMT_FETCH`、`COM_STMT_CLOSE` [命令](https://dev.mysql.com/doc/dev/mysql-server/latest/page_protocol_command_phase.html)解析能力
  - 支持采集 MQTT 3.1 调用日志和性能指标
- SQL API
  - 支持 `SELECT labels` 获取所有的自定义 label 列

# 系统

- deepflow-agent
  - 增加`非活跃 IP 指标数据`配置项，关闭此配置后没有回复流量的 IP 将会被聚合
  - 使用 BPF 预过滤采集接口，提升采集性能
  - 提供 deb 安装包
- deepflow-ctl
  - agent-group-config update 无需再指定 agent-group-id 参数
