---
title: 通过 SQL 查询
permalink: /server-integration/query/sql
---

# 简介

提供统一的 SQL 接口查询所有类型的观测数据，可作为 Grafana 的 DataSource，或基于此实现自己的 GUI。

# SQL 服务端点

获取服务端点端口号：
```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)
```

# SQL 查询语句

## 获取所有数据库

SQL 语句：
```SQL
show databases
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "sql=show databases"
```

## 获取指定数据库的所有表

SQL 语句：
```SQL
show tables
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tables"
```

## 获取指定数据表中的 Tag

SQL 语句：
```SQL
show tags from ${table_name}
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tags from ${table_name}"
```

输出示例：
```json
{
    "OPT_STATUS": "SUCCESS",
    "DESCRIPTION": "",
    "result": {
        "columns": [
          "name",
          "client_name",
          "server_name",
          "display_name",
          "type" // int, int_enum, string, string_enum, resource_name, resource_id, ip
        ],
        "values": [
            [
              "chost",
              "chost_0",
              "chost_1",
              "云服务器",
              "resource_id"
            ],
            [
              "chost_name",
              "chost_name_0",
              "chost_name_1",
              "云服务器名称",
              "resource_name"
            ]
        ]
    }
}
```

## 获取指定 Tag 的取值

### 获取 Tag 的所有取值

SQL 语句：
```SQL
show tag ${tag_name} values from ${table_name}
```

上述语句也可通过 `limit` 和 `offset` 关键词减少返回的取值数量：
```SQL
show tag ${tag_name} values from ${table_name} limit 100 offset 100
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tag ${tag_name} values from ${table_name}"
```

输出示例：
```json
{
    "OPT_STATUS": "SUCCESS",
    "DESCRIPTION": "",
    "result": {
        "columns": [
          "value",
          "display_name",
          "uid"
        ],
        "values": [
            [
                348,
                "deepflow",
                "i-2ze3bpa0o5cy8edplozi"
            ],
        ]
    }
}
```

### 使用 Tag 自身名称过滤

注意到上述 Tag 的取值会返回三列：`value`、`display_name`、`uid`。我们可以利用这些信息进行过滤，例如：
```SQL
show tag ${tag_name} values from ${table_name} where display_name like '*abc*'
```

API 调用方式和输出示例同上。

### 使用其他 Tag 关联过滤

有时候我们希望使用 Tag 进行关联过滤，减少候选项取值范围。这个时候我们可以选择查询某个数据表，对 Tag1 进行过滤的同时对 Tag2 进行聚合。例如，我们希望查询所有 `pod_cluster="cluster1"` 中的 `pod` 名称：
```SQL
SELECT pod FROM `vtap_flow_port.1m` WHERE pod_cluster = 'cluster1' GROUP BY pod
```

以上语句会利用 `flow_metrics` 数据库中的 `vtap_flow_port.1m` 表中的 `pod_cluster` 字段对 `pod` 的候选项进行过滤和分组。当然我们也可通过查询 DeepFlow 中的任意表来实现此需求，但应尽量避免使用数据量很大的表。另外，我们也可在 SQL 中加入时间等其他维度来加速查找：
```SQL
SELECT pod FROM `vtap_flow_port.1m` WHERE pod_cluster = 'cluster1' AND time > 1234567890 GROUP BY pod
```

注意：仅当 pod 中曾经有流量（且不使用 HostNetwork 时）才能在 `flow_metrics` 中查到数据。当我们在集成 Prometheus 或 Telegraf 数据以后，也可借用这其中恒定存在的指标来辅助获取 Tag 取值。例如，我们可使用 `ext_metrics` 中的 Prometheus 指标实现上述需求：
```SQL
SELECT pod FROM `prometheus.kube_pod_start_time` WHERE pod_cluster = 'cluster1' GROUP BY pod
```

## 获取指定数据表中的 Metrics

SQL 语句：
```SQL
show metrics from ${table_name}
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show metrics from ${table_name}"
```

## 查询观测数据

SQL 语句：
```SQL
SELECT col_1, col_2, col_3 \
FROM   tbl_1 \
WHERE  col_4 = y \
GROUP BY col_1, col_2 \
HAVING   col_5 > 100 \
ORDER BY col_3 \
LIMIT 100
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=${sql}"
```

# SQL 查询函数

## Tag 支持的函数

- enum
  - 说明：`enum(tap_side)` 将枚举字段转化为值
  - 示例：`SELECT enum(tap_side) ...`、`... WHERE enum(tap_side) = 'xxx' ...`
  - 注意：仅`string_enum`、`int_enum`类型的Tag支持

## Metrics 支持的函数

执行如下 SQL 语句可获取所有的函数：
```SQL
show metric function
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "sql=show metric function"
```
