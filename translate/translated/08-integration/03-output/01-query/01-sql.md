---
title: SQL API
permalink: /integration/output/query/sql
---

> This document was translated by ChatGPT

# Introduction

Provides a unified SQL interface to query all types of observability data. It can be used as a Grafana DataSource or as the basis for building your own GUI.

# SQL Service Endpoint

Get the service endpoint port number:

```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)
```

# SQL Query Statements

## Get All Databases

SQL statement:

```SQL
show databases
```

API call example:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "sql=show databases"
```

## Get All Tables in a Specific Database

SQL statement:

```SQL
show tables
```

API call example:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tables"
```

## Get Tags in a Specific Table

SQL statement:

```SQL
show tags from ${table_name}
```

API call example:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tags from ${table_name}"
```

Example output:

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
      ["chost", "chost_0", "chost_1", "Cloud Server", "resource_id"],
      [
        "chost_name",
        "chost_name_0",
        "chost_name_1",
        "Cloud Server Name",
        "resource_name"
      ]
    ]
  }
}
```

## Get Values of a Specific Tag

### Get All Values of a Tag

SQL statement:

```SQL
show tag ${tag_name} values from ${table_name}
```

The above statement can also use the `limit` and `offset` keywords to reduce the number of returned values:

```SQL
show tag ${tag_name} values from ${table_name} limit 100 offset 100
```

API call example:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tag ${tag_name} values from ${table_name}"
```

Example output:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "result": {
    "columns": ["value", "display_name", "uid"],
    "values": [[348, "deepflow", "i-2ze3bpa0o5cy8edplozi"]]
  }
}
```

### Filter Using the Tag’s Own Fields

Note that the returned values of a Tag contain three columns: `value`, `display_name`, and `uid`. We can use this information for filtering, for example:

```SQL
show tag ${tag_name} values from ${table_name} where display_name like '*abc*'
```

API call method and output example are the same as above.

### Filter by Associating with Other Tags

Sometimes we want to filter candidate values by associating with another Tag. In this case, we can query a table, filter by Tag1, and aggregate by Tag2.  
For example, to query all `pod` names in `pod_cluster="cluster1"`:

```SQL
SELECT pod FROM `network.1m` WHERE pod_cluster = 'cluster1' GROUP BY pod
```

The above statement uses the `pod_cluster` field in the `network.1m` table of the `flow_metrics` database to filter and group `pod` candidates.  
Of course, we can query any table in DeepFlow to achieve this, but it’s best to avoid tables with very large data volumes.  
We can also add time or other dimensions in SQL to speed up the search:

```SQL
SELECT pod FROM `network.1m` WHERE pod_cluster = 'cluster1' AND time > 1234567890 GROUP BY pod
```

Note: You can only find data in `flow_metrics` if the pod has had traffic before (and is not using HostNetwork).  
After integrating Prometheus or Telegraf data, we can also use constant metrics to help retrieve Tag values.  
For example, we can use Prometheus metrics in `ext_metrics` to achieve the above:

```SQL
SELECT pod FROM `prometheus.kube_pod_start_time` WHERE pod_cluster = 'cluster1' GROUP BY pod
```

In Grafana, we can also use this capability to implement linked filtering for Variable candidates.  
For example, using a custom Variable `$cluster` and built-in Variables [`$__from`, `$__to`](https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#__from-and-__to) to filter another Variable `pod`:

- When the cluster value is an id, use `$cluster`:

  ```Bash
  cluster = [1, 2]
  result: 1, 2
  ```

  ```SQL
  -- Add 5 minutes before and after the time range to avoid frequent changes of candidates
  SELECT pod_id as `value`, pod as `display_name` FROM `network.1m` WHERE pod_cluster IN ($cluster) AND time >= ${__from:date:seconds}-500 AND time <= ${__to:date:seconds}+500 GROUP BY `value`
  ```

- When the cluster value is a name, use `${cluster:singlequote}`:

  ```Bash
  cluster = [deepflow-a, deepflow-b]
  result: 'deepflow-a', 'deepflow-b'
  ```

  ```SQL
  SELECT pod as `value`, pod as `display_name` FROM `network.1m` WHERE pod_cluster IN (${cluster:singlequote}) AND  time >= ${__from:date:seconds}-500 AND time <= ${__to:date:seconds}+500 GROUP BY `value`
  ```

## Get Metrics in a Specific Table

SQL statement:

```SQL
show metrics from ${table_name}
```

API call example:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show metrics from ${table_name}"
```

## Query Observability Data

SQL statement:

```SQL
SELECT col_1, col_2, col_3 \
FROM   tbl_1 \
WHERE  col_4 = y \
GROUP BY col_1, col_2 \
HAVING   col_5 > 100 \
ORDER BY col_3 \
LIMIT 100
```

API call example:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=${sql}"
```

When `db=flow_metric`, you need to specify the data precision with `--data-urlencode "data_precision=${data_precision}"`.  
The optional values for `data_precision` are `1m` and `1s`.

# SQL Query Functions

## Functions Supported for Tags

- enum  
  - Description: `enum(observation_point)` converts an enum field to its value  
  - Example: `SELECT enum(observation_point) ...`, `... WHERE enum(observation_point) = 'xxx' ...`  
  - Note: Only `string_enum` and `int_enum` type Tags are supported

## Functions Supported for Metrics

Run the following SQL statement to get all functions:

```SQL
show metric function
```

API call example:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "sql=show metrics functions"
```

# SQL Syntax

- The left-hand side does not support spaces, single quotes, or backticks
- Single quotes in the right-hand side need to be escaped with `\`