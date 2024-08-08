---
title: 查看数据
permalink: /features/continuous-profiling/data
---

# 获取指定进程的 Profile

## Grafana Panel

在 `app_service` 中选择一个进程名之后，Grafana 中的展示效果图如下：

![On-CPU - Process](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4805f802ed.png)

## API

Profile 查询 API 示例：
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
- **profile_language_type**：获取 eBPF Profile 数据时使用 `eBPF`
- **profile_event_type**：对于 eBPF On-CPU Profile 数据赋值为 `on-cpu` 即可
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
            "columns": [
                "self_value",
                "total_value"
            ],
            "values": [
                [
                    0,
                    640352895
                ],
                [
                    0,
                    6292923
                ],
                [
                    0,
                    46848438
                ],
                // ...
                [
                    0,
                    1797978
                ]
            ]
        },
        "node_values": {
            "columns": [
                "function_id",
                "parent_node_id",
                "self_value",
                "total_value"
            ],
            "values": [
                [
                    0,
                    -1,
                    0,
                    640352895
                ],
                [
                    1,
                    0,
                    0,
                    6292923
                ],
                [
                    2,
                    1,
                    0,
                    1444443
                ],
                // ...
                [
                    3,
                    2,
                    0,
                    10101
                ]
            ]
        }
    },
    "debug": null
}
```

API 返回结果说明：

- **functions**：函数名
- **function_types**: 函数的类型
  - `[t] thread_name`：线程，只会出现在火焰图的第二层
  - `[k] function_name`：Linux 内核函数、CUDA 动态链接库函数（[libcuda](https://developer.nvidia.com/cuda-toolkit)、[libcublas](https://developer.nvidia.com/cublas) 等）
  - `[l] function_name`：动态链接库中的函数
  - `function_name`：表示应用程序的业务函数
  - `$app_service`：火焰图最顶层的节点，名字为进程名
  - 除此之外，当函数名未成功翻译时，可能显示为如下几种形式之一
    - `[/tmp/perf-29887.map]`：方括号中为进程号 29887 的 Java 进程符号文件名，函数地址未能在该文件中找到。Java 进程符号文件会自动周期性生成，此时一般由于该符号文件生成时该函数尚未加载导致。
    - `[/lib/ld-musl-x86_64.so.1]`：方括号中为动态链接库的文件路径（带有 `so`），函数地址属于该文件但未能成功翻译，一般是符号表被裁剪导致。
    - `[/usr/local/bin/kube-apiserver]`：方括号中为可执行文件的路径，函数地址属于该文件但未能成功翻译，一般是符号表被裁剪导致。
    - `[unknown] 0x0000000003932388`：除上述所有情况以外，当某个地址无法成功翻译为函数名时显示如此。特别地，当火焰图第三层函数地址（一般是线程的入口函数）未能翻译为函数名时，显示为 `[unknown start_thread?]`。
- **function_values**: 函数的 CPU 时长，单位是微秒（us）。
- **node_values**: 函数作为节点的 CPU 时长，单位是微秒（us）。
- **function_id**：函数唯一标识
- **parent_node_id**：该函数的父节点在火焰图中的唯一标识
- **total_value**：该函数的 CPU 时长，单位是微秒（us）。
  - On-CPU Profile：此值表示函数花费 CPU 的时长
  - Off-CPU Profile：此值表示函数等待 CPU 的时长
- **self_value**：该函数作为叶子节点（最底层函数）的 CPU `净`时长，单位是微秒（us）。
  - On-CPU 和 Off-CPU 的差异同上

使用 API 的返回结果，可以绘制**指定进程**的 CPU 火焰图。

# 获取指定主机的 Profile

## Grafana Panel

在 `app_service` 中选择 `Total` 之后，Grafana 中的展示效果图如下（火焰图只有三层）：

![On-CPU - Host](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024080866b4805e6b9c7.png)

## API

::: tip
当前仅 On-CPU Profile 支持查询主机的整体数据。
:::

当请求参数携带 `"app_service": "Total"` 时，能够获取到名为 `Total` 的特殊 On-CPU Profile 数据，它是一台主机上所有进程的、精细到线程粒度的 Profile。可用于当 On-CPU `regex` 未配置某个进程时，能够快速定位瓶颈进程和线程。此时的返回结果示例：

```json
{
    "OPT_STATUS": "SUCCESS",
    "DESCRIPTION": "",
    "result": {
        "functions": [
            "Total",
            "[p] java",
            // ...
            "[t] DefaultTimer10-",
        ],
        "function_types": [
            "H",
            "P",
            // ...
            "T"
        ],
        "function_values": {
            "columns": [
                "self_value",
                "total_value"
            ],
            "values": [
                [
                    0,
                    4563875153
                ],
                [
                    4616160,
                    325630360
                ],
                // ...
                [
                    6565660,
                    6565660
                ]
            ]
        },
        "node_values": {
            "columns": [
                "function_id",
                "parent_node_id",
                "self_value",
                "total_value"
            ],
            "values": [
                [
                    0,
                    -1,
                    0,
                    4563875153
                ],
                [
                    1,
                    0,
                    4616160,
                    325630360
                ],
                // ...
                [
                    2,
                    1,
                    6565660,
                    6565660
                ]
            ]
        }
    },
    "debug": null
}
```

上述返回结果中 **functions** 的补充说明如下：

- `$app_service`：火焰图最顶层的节点，名字固定为 Total
- `[p] name`：一个进程的名称
- `[t] name`：一个线程的名称，它的父节点是一个 `[p] name` 类型的节点，表示这个线程所属的进程

使用 API 的返回结果，可以绘制**指定主机**的 On-CPU 火焰图。

# 关于 Function Type

| Function Type | 含义           | Profile Event Type | 特征        |
| ------------- | -------------- | ------------------ | ----------- |
| O             | 对象类型       | `mem-*` | Memory Profile 的叶子节点 |
| H             | 云主机         | `*`     | 等于 `Total` 的根节点  |
| P             | 进程           | `*`     | `[p] ` 开头，以及不等于 `Total` 的根节点 |
| T             | 线程           | `*`     | `[t] ` 开头            |
| K             | 内核函数       | `*`     | `[k] ` 开头            |
| C             | CUDA 驱动函数  | `*`     | `[c] ` 开头            |
| L             | 动态链接库函数 | `*`     | `[l] ` 开头            |
| ?             | 未知函数       | `*`     | 其他 `[` 开头          |
| A             | 应用函数       | `*`     | 除以上之外的函数       |
