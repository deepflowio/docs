---
title: 通过 SQL 查询
permalink: /server-integration/query/sql
---

# 简介

提供统一的 SQL 接口查询所有类型的观测数据，可作为 Grafana 的 DataSource

# SQL查询语句

## 获取所有数据库

- SQL语句
  ```SQL
  show databases
  ```
- API调用方式
  ```bash
  curl -XPOST "http://${deepflow_server_node_ip}:30416/v1/query/"\
      --data-urlencode "sql=show databases"
  ```

## 获取指定数据库的所有表

- SQL语句
  ```SQL
  show tables
  ```
- API调用方式
  ```bash
  curl -XPOST "http://${deepflow_server_node_ip}:30416/v1/query/"\
      --data-urlencode "db=${db_name}" \
      --data-urlencode "sql=show tables"
  ```

## 获取指定数据表所支持的tag及描述

- SQL语句
  ```SQL
  show tags from ${table_name}
  ```
- API调用方式
  ```bash
  curl -XPOST "http://${deepflow_server_node_ip}:30416/v1/query/"\
      --data-urlencode "db=${db_name}" \
      --data-urlencode "sql=show tags from ${table_name}"
  ```

## 获取指定tag取值及描述

- SQL语句
  ```SQL
  show tag ${tag_name} values from ${table_name}
  ```
- API调用方式
  ```bash
  curl -XPOST "http://${deepflow_server_node_ip}:30416/v1/query/"\
      --data-urlencode "db=${db_name}" \
      --data-urlencode "sql=show tag ${tag_name} values from ${table_name}"
  ```

## 获取指定数据表所支持的metric及描述

- SQL语句
  ```SQL
  show metrics from ${table_name}
  ```
- API调用方式
  ```bash
  curl -XPOST "http://${deepflow_server_node_ip}:30416/v1/query/"\
      --data-urlencode "db=${db_name}" \
      --data-urlencode "sql=show metrics from ${table_name}"
  ```

## 执行具体查询语句

- SQL语句
  ```SQL
  select xxxx \
  from ${table_name} \
  where xxxx \
  group by xxxx \
  order by xxxx \
  limit xxxx
  ```
- API调用方式
  ```bash
  curl -XPOST "http://${deepflow_server_node_ip}:30416/v1/query/"\
      --data-urlencode "db=${db_name}" \
      --data-urlencode "sql=${sql}"
  ```
