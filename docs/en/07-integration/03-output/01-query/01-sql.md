> This document was translated by GPT-4

---

title: SQL API
permalink: /integration/output/query/sql

---

# Introduction

This provides a unified SQL interface for querying all types of observation data, which can be used as a DataSource for Grafana or to implement your own GUI based on this.

# SQL Service Endpoint

To get the service endpoint port number:

```bash
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)
```

# SQL Query Statements

## Get All Databases

SQL statement:

```SQL
show databases
```

API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "sql=show databases"
```

## Get All Tables from a Specific Database

SQL statement:

```SQL
show tables
```

API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tables"
```

## Get Tags from a Specified Data Table

SQL statement:

```SQL
show tags from ${table_name}
```

API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tags from ${table_name}"
```

Output example:

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

## Get Tag Values from a Specific Tag

### Get All Values of a Tag

SQL statement:

```SQL
show tag ${tag_name} values from ${table_name}
```

You can also use the `limit` and `offset` keywords in the above statement to reduce the number of returned values:

```SQL
show tag ${tag_name} values from ${table_name} limit 100 offset 100
```

API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show tag ${tag_name} values from ${table_name}"
```

Output example:

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

### Filter by the Tag Name

Notice that the tag values returned above will yield three columns: `value`, `display_name`, `uid`. We can use this information for filtering, for example:

```SQL
show tag ${tag_name} values from ${table_name} where display_name like '*abc*'
```

The API call method and output examples are the same as above.

### Filter by Associating with Other Tags

Sometimes, we want to use tags for associated filtering to reduce the scope of potential value options. In this case, we can choose to query a data table, filter on Tag1 while aggregating on Tag2. For example, if we want to query the name of all `pods` in `pod_cluster="cluster1"`:

```SQL
SELECT pod FROM `vtap_flow_port.1m` WHERE pod_cluster = 'cluster1' GROUP BY pod
```

The above statement will utilize the `pod_cluster` field in the `vtap_flow_port.1m` table in the `flow_metrics` database to filter and group `pod` candidate items. Of course, we can also meet this requirement by querying any table in DeepFlow, but we should try to avoid using tables with a large amount of data. Additionally, we can speed up the search by adding other dimensions such as time to the SQL:

```SQL
SELECT pod FROM `vtap_flow_port.1m` WHERE pod_cluster = 'cluster1' AND time > 1234567890 GROUP BY pod
```

Note: data can only be found in `flow_metrics` if there has ever been flow in the pod (and HostNetwork is not used). After integrating Prometheus or Telegraf data, we can also use the consistently present indicators therein to help obtain tag values. For example, we can use the Prometheus indicators in `ext_metrics` to meet the above requirement:

```SQL
SELECT pod FROM `prometheus.kube_pod_start_time` WHERE pod_cluster = 'cluster1' GROUP BY pod
```

In Grafana, we can also leverage the above capability to implement linkage filtering of Variable candidate items. For example, using a custom Variable $cluster and the built-in Variable [`$**from, $**to`](https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/#__from-and-__to) we can filter another Variable pod:

- when the value of cluster is id, use `$cluster`:

  ```Bash
  cluster = [1, 2]
  result: 1, 2
  ```

  ```SQL
  // Add 5 minutes before and after the time range to avoid frequent changes of candidates
  SELECT pod_id as `value`, pod as `display_name` FROM `vtap_flow_port.1m` WHERE pod_cluster IN ($cluster) AND time >= ${__from:date:seconds}-500 AND time <= ${__to:date:seconds}+500 GROUP BY `value`
  ```

- when the value of cluster is name, use `${cluster:singlequote}`:

  ```Bash
  cluster = [deepflow-a, deepflow-b]
  result: 'deepflow-a', 'deepflow-b'
  ```

  ```SQL
  SELECT pod as `value`, pod as `display_name` FROM `vtap_flow_port.1m` WHERE pod_cluster IN (${cluster:singlequote}) AND  time >= ${__from:date:seconds}-500 AND time <= ${__to:date:seconds}+500 GROUP BY `value`
  ```

## Get Metrics from a Specified Data Table

SQL statement:

```SQL
show metrics from ${table_name}
```

API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=show metrics from ${table_name}"
```

## Query Observation Data

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

API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "db=${db_name}" \
    --data-urlencode "sql=${sql}"
```

When `db=flow_metric`, you need to specify the data precision by `--data-urlencode "data_precision=${data_precision}"`, the options for `data_precision` are `1m` and `1s`.

# SQL Query Functions

## Functions Supported by Tag

- enum
  - Description: `enum(tap_side)` transforms the enumeration field into a value
  - Example: `SELECT enum(tap_side) ...`, `... WHERE enum(tap_side) = 'xxx' ...`
  - Note: Only tag types `string_enum`, `int_enum` are supported

## Functions Supported by Metrics

To get all functions, execute the following SQL statement:

```SQL
show metric function
```

API call method:

```bash
curl -XPOST "http://${deepflow_server_node_ip}:${port}/v1/query/" \
    --data-urlencode "sql=show metric function"
```

# SQL Syntax

- Left values do not support spaces, single quotes, back quotes
- Single quotes in right values need to be escaped with a backslash `\`
