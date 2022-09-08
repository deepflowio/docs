---
title: 通过 SQL 查询
permalink: /server-integration/query/sql
---

# 简介

提供统一的 SQL 接口查询所有类型的观测数据，可作为 Grafana 的 DataSource，或基于此实现自己的 GUI。

# SQL 服务端点

获取服务端点：
```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)
```

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
```text
{
    "OPT_STATUS": "SUCCESS",
    "DESCRIPTION": "",
    "result": {
        "columns": [
          "name",
          "client_name",
          "server_name",
          "display_name",
          "type" // tag类型，取值范围：int, int_enum, string, string_enum, resource_name, resource_id, ip
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

SQL 语句：
```SQL
show tag ${tag_name} values from ${table_name}
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tag ${tag_name} values from ${table_name}"
```

输出示例：
```text
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

- enum函数
  - 示例：`enum(tap_side)`
  - 仅`string_enum`、`int_enum`类型的Tag支持

## Metrics 支持的函数

SQL语句：
```SQL
show metric function
```

API 调用方式：
```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "sql=show metric function"
```
