---
title: API
permalink: /features/continuous-profiling/api
---

> This document was translated by ChatGPT

::: tip
eBPF Profiling data is currently not viewable on Grafana and can only be viewed on the enterprise edition page. However, Profiling data in the community edition is already stored in the `profile.in_process` table in ClickHouse and can be queried by calling the deepflow-server API.
:::

# Retrieve Profiling Data for a Specific Process

Example of Profiling data query API:

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
    "tag_filter: "",
    "time_start": 1708479421,
    "time_end": 1708480321,
  }'
```

Explanation of API request parameters:

- **app_service**: Process name
- **profile_language_type**: Use `eBPF` when retrieving eBPF Profiling data
- **profile_event_type**: For eBPF On-CPU Profiling data, set this to `on-cpu`
- **tag_filter**: When process names conflict, other tags can be used for filtering
  - For example, `"tag_filter": "pod_cluster='prod-cluster' AND pod_ns='app'"`
- **time_start**, **time_end**: Time range

The `profile.in_process` table supports the following `tag_filter` fields:
[csv-profile-tag-filters](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/profile/in_process.en)

Example of API response:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "result": [
    {
      "profile_location_str": "deepflow-agent",
      "node_id": "",
      "parent_node_id": "-1",
      "self_value": 0,
      "total_value": 19901
    },
    {
      "profile_location_str": "[k] __netif_receive_skb_one_core",
      "node_id": "fd7881c5-6e30-5f40-932c-b961aa1df5ef",
      "parent_node_id": "67a24424-3397-588e-823e-ce65a4c7eeff",
      "self_value": 0,
      "total_value": 2
    },
    {
      "profile_location_str": "[l] __lll_lock_wake_private",
      "node_id": "afad188d-f326-5b8e-a563-fd8badd284bf",
      "parent_node_id": "4e8cf302-60a8-5add-bd6c-9f91ce49e9c9",
      "self_value": 0,
      "total_value": 1
    },
    // ...
    {
      "profile_location_str": "deepflow_agent::flow_generator::flow_map::FlowMap::inject_meta_packet::h553351a860254660",
      "node_id": "03a866fe-7263-54c8-9470-3b22a68f4cb8",
      "parent_node_id": "d25f5f68-0ab7-55fe-b6ab-63dc3ef05636",
      "self_value": 0,
      "total_value": 6
    }
  ],
  "debug": null
}
```

Explanation of API response:

- **profile_location_str**: Function name
  - `[t] thread_name`: Thread, only appears in the second layer of the flame graph
  - `[k] function_name`: Linux kernel function, CUDA dynamic library function ([libcuda](https://developer.nvidia.com/cuda-toolkit), [libcublas](https://developer.nvidia.com/cublas), etc.)
  - `[l] function_name`: Function in a dynamic library
  - `function_name`: Represents a business function of the application
  - `$app_service`: The top node of the flame graph, named after the process name
  - Additionally, if the function name translation fails, it may appear in one of the following forms:
    - `[/tmp/perf-29887.map]`: The process symbol file name for process number 29887 in square brackets, indicating that the function address was not found in this file. Java process symbol files are automatically generated periodically, usually because the function was not loaded when the symbol file was generated.
    - `[/lib/ld-musl-x86_64.so.1]`: The file path of the dynamic library (with `so`) in square brackets, indicating that the function address belongs to this file but was not successfully translated, usually due to the symbol table being trimmed.
    - `[/usr/local/bin/kube-apiserver]`: The file path of the executable file in square brackets, indicating that the function address belongs to this file but was not successfully translated, usually due to the symbol table being trimmed.
    - `[unknown] 0x0000000003932388`: If an address cannot be successfully translated into a function name, it is displayed like this. Specifically, if the third layer function address of the flame graph (usually the entry function of the thread) cannot be translated into a function name, it is displayed as `[unknown start_thread?]`.
- **node_id**: The unique identifier of this function node in the flame graph
- **parent_node_id**: The unique identifier of the parent node of this function in the flame graph
- **total_value**: The CPU duration of this function, in microseconds (us).
  - On-CPU Profiling: This value indicates the CPU time spent by the function
  - Off-CPU Profiling: This value indicates the CPU waiting time of the function
- **self_value**: The `net` CPU duration of this function as a leaf node (bottom-level function), in microseconds (us).
  - The difference between On-CPU and Off-CPU is the same as above

Using the API response, you can draw a CPU flame graph for the **specified process**. The display effect in the DeepFlow enterprise edition is as follows:

![Process Flame Graph in Enterprise Edition](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfa9701ce.jpg)

# Retrieve Profiling Data for a Specific Host

::: tip
Currently, only On-CPU Profiling supports querying overall data for a host.
:::

When the request parameter includes `"app_service": "Total"`, it retrieves a special On-CPU Profiling data named `Total`, which is the Profiling of all processes on a host, detailed down to the thread level. This can be used to quickly identify bottleneck processes and threads when the On-CPU `regex` is not configured for a specific process. An example of the response in this case:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "result": [
    {
      "profile_location_str": "Total",
      "node_id": "",
      "parent_node_id": "-1",
      "self_value": 0,
      "total_value": 206283
    },
    {
      "profile_location_str": "[p] process-exporte",
      "node_id": "9d3c5fd3-4cd2-5d04-be22-e0f27144f638",
      "parent_node_id": "",
      "self_value": 2512,
      "total_value": 25028
    },
    // ...
    {
      "profile_location_str": "[t] stats-collector",
      "node_id": "99e8ce53-e3bf-5b33-a63d-aa47e00e2ff4",
      "parent_node_id": "1762633e-a955-5c80-a5be-22529903b0bf",
      "self_value": 33,
      "total_value": 33
    }
  ],
  "debug": null
}
```

Additional explanation of **profile_location_str** in the above response:

- `$app_service`: The top node of the flame graph, fixed as Total
- `[p] name`: The name of a process
- `[t] name`: The name of a thread, its parent node is a `[p] name` type node, indicating the process to which this thread belongs

Using the API response, you can draw an On-CPU flame graph for the **specified host**. The display effect in the DeepFlow enterprise edition is as follows (the flame graph has only three layers):

![Host Flame Graph in Enterprise Edition](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfab0d31a.jpg)