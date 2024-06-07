---
title: API
permalink: /features/continuous-profiling/api
---

::: tip
eBPF Profiling 数据目前无法在 Grafana 上展现，仅可在企业版页面中查看。但是，社区版中 Profiling 数据已经存储于 ClickHouse 的 `profile.in_process` 表中了，可通过调用 deepflow-server 的 API 查询数据。
:::

# 获取指定进程的 Profiling 数据

Profiling 数据查询 API 示例：
```bash
# 确认 deepflow-server 的监听 IP 和端口
deepflow_server_node_ip=FIXME # 注意修改
port=$(kubectl get --namespace deepflow -o jsonpath="{.spec.ports[0].nodePort}" services deepflow-server)

# 请求 deepflow-server 的 API
curl -X POST http://${deepflow_server_node_ip}:$port/v1/profile/ProfileTracing \
  -H 'Content-Type: application/json' \
  -d '{
    "app_service": "deepflow-agent",
    "profile_language_type": "eBPF",
    "profile_event_type": "on-cpu",
    "tag_filter: "",
    "time_start": 1708479421
    "time_end": 1708480321,
  }'
```

API 请求参数说明：
- **app_service**：进程名
- **profile_language_type**：获取 eBPF Profiling 数据时使用 `eBPF`
- **profile_event_type**：对于 eBPF OnCPU Profiling 数据赋值为 `on-cpu` 即可
- **tag_filter**：当进程名冲突时，可使用其他 Tag 过滤
  - 例如 `"tag_filter": "pod_cluster='prod-cluster' AND pod_ns='app'"`
- **time_start**、**time_end**：时间范围

`profile.in_process` 表支持使用的 `tag_filter` 字段如下：
[csv-profile-tag-filters](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/profile/in_process.ch)

API 返回结果示例：
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

API 返回结果说明：
- **profile_location_str**：函数名
  - `[t] thread_name`：线程，只会出现在火焰图的第二层
  - `[k] function_name`：Linux 内核函数、CUDA 动态链接库函数
  - `[l] function_name`：动态链接库中的函数
  - `function_name`：表示应用程序的业务函数
  - `$app_service`：火焰图最顶层的节点，名字为进程名
  - 除此之外，当函数名未成功翻译时，可能显示为如下几种形式之一
    - `[/tmp/perf-29887.map]`：方括号中为进程号 29887 的 Java 进程符号文件名，函数地址未能在该文件中找到。Java 进程符号文件会自动周期性生成，此时一般由于该符号文件生成时该函数尚未加载导致。
    - `[/lib/ld-musl-x86_64.so.1]`：方括号中为动态链接库的文件路径（带有 `so`），函数地址属于该文件但未能成功翻译，一般是符号表被裁剪导致。
    - `[/usr/local/bin/kube-apiserver]`：方括号中为可执行文件的路径，函数地址属于该文件但未能成功翻译，一般是符号表被裁剪导致。
    - `[unknown] 0x0000000003932388`：除上述所有情况以外，当某个地址无法成功翻译为函数名时显示如此。特别地，当火焰图第三层函数地址（一般是线程的入口函数）未能翻译为函数名时，显示为 `[unknown start_thread?]`。
- **node_id**：该函数节点在火焰图中的唯一标识
- **parent_node_id**：该函数的父节点在火焰图中的唯一标识
- **total_value**：该函数的 CPU 时长，单位是微秒（us）。
  - OnCPU Profiling：此值表示函数花费 CPU 的时长
  - OffCPU Profiling：此值表示函数等待 CPU 的时长
- **self_value**：该函数作为叶子节点（最底层函数）的 CPU `净`时长，单位是微秒（us）。
  - OnCPU 和 OffCPU 的差异同上

使用 API 的返回结果，可以绘制**指定进程**的 CPU 火焰图。DeepFlow 企业版中的展示效果图如下：

![企业版中的进程火焰图](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfa9701ce.jpg)

# 获取指定主机的 Profiling 数据

::: tip
当前仅 OnCPU Profiling 支持查询主机的整体数据。
:::

当请求参数携带 `"app_service": "Total"` 时，能够获取到名为 `Total` 的特殊 OnCPU Profiling 数据，它是一台主机上所有进程的、精细到线程粒度的 Profiling。可用于当 OnCPU `regex` 未配置某个进程时，能够快速定位瓶颈进程和线程。此时的返回结果示例：
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

上述返回结果中 **profile_location_str** 的补充说明如下：
- `$app_service`：火焰图最顶层的节点，名字固定为 Total
- `[p] name`：一个进程的名称
- `[t] name`：一个线程的名称，它的父节点是一个 `[p] name` 类型的节点，表示这个线程所属的进程

使用 API 的返回结果，可以绘制**指定主机**的 OnCPU 火焰图。DeepFlow 企业版中的展示效果图如下（火焰图只有三层）：

![企业版中的主机火焰图](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfab0d31a.jpg)
