---
title: View Data
permalink: /features/continuous-profiling/data
---

> This document was translated by ChatGPT

# Retrieve Profile for a Specific Process

## Grafana Panel

After selecting a process name in `app_service`, the display effect in Grafana is as follows:

![On-CPU - Process](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024081666bebf5480c10.png)

## API

Profile query API example:

```bash
# Confirm the listening IP and port of deepflow-server
deepflow_server_node_ip=FIXME # Remember to modify
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)

# Request the API of deepflow-server
curl -X POST http://${deepflow_server_node_ip}:$port/v1/profile/ProfileTracing \
  -H 'Content-Type: application/json' \
  -d '{
    "app_service": "deepflow-agent",
    "profile_language_type": "eBPF",
    "profile_event_type": "on-cpu",
    "tag_filter": "",
    "time_start": 1708479421,
    "time_end": 1708480321
  }'
```

Explanation of API request parameters:

- **app_service**: Process name
- **profile_language_type**: Use `eBPF` when retrieving eBPF Profile data
- **profile_event_type**: For eBPF On-CPU Profile data, set the value to `on-cpu`
- **tag_filter**: When process names conflict, other tags can be used for filtering
  - For example, `"tag_filter": "pod_cluster='prod-cluster' AND pod_ns='app'"`
- **time_start**, **time_end**: Time range

The `profile.in_process` table supports the following `tag_filter` fields:
[csv-profile-tag-filters](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/profile/in_process.en)

Example of API return result:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "result": {
    "functions": [
      "deepflow-agent",
      "[t] platform-synchr",
      "[k] entry_SYSCALL_64_after_hwframe",
      // ...
      "[l] __write"
    ],
    "function_types": [
      "P",
      "T",
      "K",
      // ...
      "K"
    ],
    "function_values": {
      "columns": ["self_value", "total_value"],
      "values": [
        [0, 640352895],
        [0, 6292923],
        [0, 46848438],
        // ...
        [0, 1797978]
      ]
    },
    "node_values": {
      "columns": ["function_id", "parent_node_id", "self_value", "total_value"],
      "values": [
        [0, -1, 0, 640352895],
        [1, 0, 0, 6292923],
        [2, 1, 0, 1444443],
        // ...
        [3, 2, 0, 10101]
      ]
    }
  },
  "debug": null
}
```

Explanation of API return result:

- **functions**: Function names
- **function_types**: Function types
  - `[t] thread_name`: Thread, only appears in the second layer of the flame graph
  - `[k] function_name`: Linux kernel functions, CUDA dynamic library functions ([libcuda](https://developer.nvidia.com/cuda-toolkit), [libcublas](https://developer.nvidia.com/cublas), etc.)
  - `[l] function_name`: Functions in dynamic libraries
  - `function_name`: Represents business functions of the application
  - `$app_service`: The top node of the flame graph, named after the process name
  - Additionally, when the function name translation fails, it may appear in one of the following forms:
    - `[/tmp/perf-29887.map]`: The file name of the Java process symbol file for process number 29887 in square brackets, the function address was not found in this file. Java process symbol files are automatically generated periodically, usually because the function was not loaded when the symbol file was generated.
    - `[/lib/ld-musl-x86_64.so.1]`: The file path of the dynamic library (with `so`) in square brackets, the function address belongs to this file but failed to translate, usually due to the symbol table being trimmed.
    - `[/usr/local/bin/kube-apiserver]`: The file path of the executable file in square brackets, the function address belongs to this file but failed to translate, usually due to the symbol table being trimmed.
    - `[unknown] 0x0000000003932388`: In all other cases, when an address cannot be successfully translated into a function name, it is displayed as such. Specifically, when the third layer function address of the flame graph (usually the entry function of the thread) fails to translate into a function name, it is displayed as `[unknown start_thread?]`.
- **function_values**: CPU duration of the function, in microseconds (us).
- **node_values**: CPU duration of the function as a node, in microseconds (us).
- **function_id**: Unique identifier of the function
- **parent_node_id**: Unique identifier of the parent node of the function in the flame graph
- **total_value**: CPU duration of the function, in microseconds (us).
  - On-CPU Profile: This value indicates the CPU time spent by the function
  - Off-CPU Profile: This value indicates the CPU waiting time of the function
- **self_value**: The `net` CPU duration of the function as a leaf node (bottom-level function), in microseconds (us).
  - The difference between On-CPU and Off-CPU is the same as above

Using the API return result, you can draw a CPU flame graph for the **specified process**.

# Retrieve Profile for a Specific Host

## Grafana Panel

After selecting `Total` in `app_service`, the display effect in Grafana is as follows (the flame graph has only three layers):

![On-CPU - Host](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024081666bebf558661f.png)

## API

::: tip
Currently, only On-CPU Profile supports querying the overall data of the host.
:::

When the request parameter carries `"app_service": "Total"`, you can obtain a special On-CPU Profile data named `Total`, which is a Profile of all processes on a host, detailed to the thread level. It can be used to quickly locate bottleneck processes and threads when the On-CPU `regex` is not configured for a certain process. An example of the return result at this time:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "result": {
    "functions": [
      "Total",
      "[p] java",
      // ...
      "[t] DefaultTimer10-"
    ],
    "function_types": [
      "H",
      "P",
      // ...
      "T"
    ],
    "function_values": {
      "columns": ["self_value", "total_value"],
      "values": [
        [0, 4563875153],
        [4616160, 325630360],
        // ...
        [6565660, 6565660]
      ]
    },
    "node_values": {
      "columns": ["function_id", "parent_node_id", "self_value", "total_value"],
      "values": [
        [0, -1, 0, 4563875153],
        [1, 0, 4616160, 325630360],
        // ...
        [2, 1, 6565660, 6565660]
      ]
    }
  },
  "debug": null
}
```

Additional explanation of **functions** in the above return result:

- `$app_service`: The top node of the flame graph, the name is fixed as Total
- `[p] name`: The name of a process
- `[t] name`: The name of a thread, its parent node is a `[p] name` type node, indicating the process to which this thread belongs

Using the API return result, you can draw an On-CPU flame graph for the **specified host**.

# About Function Type

| Function Type | Meaning         | Profile Event Type | Characteristics                           |
| ------------- | --------------- | ------------------ | ---------------------------------------- |
| O             | Object type     | `mem-*`            | Leaf node of Memory Profile              |
| H             | Cloud host      | `*`                | Root node equal to `Total`               |
| P             | Process         | `*`                | Starts with `[p] `, and root nodes not equal to `Total` |
| T             | Thread          | `*`                | Starts with `[t] `                       |
| K             | Kernel function | `*`                | Starts with `[k] `                       |
| C             | CUDA driver function | `*`            | Starts with `[c] `                       |
| L             | Dynamic library function | `*`        | Starts with `[l] `                       |
| ?             | Unknown function | `*`               | Other starts with `[`                    |
| A             | Application function | `*`            | Functions other than the above           |
