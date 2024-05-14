---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

# AutoProfiling

通过 eBPF 获取应用程序的函数调用栈快照，DeepFlow 可绘制任意进程的 CPU Profiling，帮助开发者快速定位函数性能瓶颈。**函数调用栈中除了包含业务函数以外，还可展现动态链接库、内核系统调用函数的耗时情况**。除此之外，DeepFlow 在采集函数调用栈时生成了唯一标识，可用于与调用日志相关联，实现分布式追踪和函数性能剖析的联动。

![DeepFlow 中的 CPU Profiling 和 Network Profiling](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac3060c3.png)

# 支持能力

支持的 Profiling 数据类型：
- OnCPU
- OffCPU `仅企业版`

支持的进程语言：
- 编译为 ELF 格式可执行文件的语言：Golang、Rust、C/C++
- 使用 JVM 虚拟机的语言：Java

获取 Profiling 数据需满足两个前提条件：
- 进程需要开启 Frame Pointer（帧指针寄存器）
  - 编译 C/C++：`gcc -fno-omit-frame-pointer`
  - 编译 Rust：`RUSTFLAGS="-C force-frame-pointers=yes"`
  - 编译 Golang：默认开启，无需额外编译参数
  - 运行 Java：`-XX:+PreserveFramePointer`
- 对于编译型语言的进程，编译时需要注意保留符号表

# 功能开启方法

## eBPF OnCPU Profiling

eBPF OnCPU Profiling 是默认开启的，但你需要通过修改 `static_config.ebpf.on-cpu-profile.regex` 来指定需要开启的进程列表。默认情况下仅对进程名以 `deepflow-` 开头的进程开启。Agent 支持的配置参数如下：
```yaml
static_config:
  ebpf:

    ## Java compliant update latency time
    ## Default: 600s. Range: [5, 3600]s
    ## Note:
    ##   When deepflow-agent finds that an unresolved function name appears in the function call stack
    ##   of a Java process, it will trigger the regeneration of the symbol file of the process.
    ##   Because Java utilizes the Just-In-Time (JIT) compilation mechanism, to obtain more symbols for
    ##   Java processes, the regeneration will be deferred for a period of time.
    #java-symbol-file-refresh-defer-interval: 600s

    ## Maximum size limit for Java symbol file.
    ## Default: 10. Range: [2, 100]
    ## Note:
    ##   Which means it falls within the interval of 2Mi to 100Mi. If the configuration value is outside
    ##   this range, the default value of 10(10Mi), will be used.
    ##   All Java symbol files are stored in the '/tmp' directory mounted by the deepflow-agent. To prevent
    ##   excessive occupation of host node space due to large Java symbol files, a maximum size limit is set
    ##   for each generated Java symbol file.
    #java-symbol-file-max-space-limit: 10

    ## on-cpu profile configuration
    on-cpu-profile:
      ## eBPF on-cpu Profile Switch
      ## Default: false
      disabled: false

      ## Sampling frequency
      ## Default: 99
      frequency: 99

      ## Whether to obtain the value of CPUID and decide whether to participate in aggregation.
      ## Set to 1:
      ##    Obtain the value of CPUID and will be included in the aggregation of stack trace data.
      ## Set to 0:
      ##    It will not be included in the aggregation. Any other value is considered invalid,
      ##    the CPU value for stack trace data reporting is a special value (CPU_INVALID:0xfff)
      ##    used to indicate that it is an invalid value.
      ## Default: 0
      cpu: 0

      ## Sampling process name
      ## Default: ^deepflow-.*
      regex: ^deepflow-.*
```

上述配置的含义如下：
- **disabled**：默认为 False，表示功能开启。
- **frequency**：采样频率，默认 99 约表示 10ms 采样周期。不建议设置为 10 的整数倍，避免和程序运行或调度的时钟同频。
- **cpu**：默认为 0，表示一台主机上采集的数据不区分 CPU，当设置为 1 时数据将按 CPU ID 聚合。
- **regex**：开启 OnCPU Profiling 的进程名正则表达式。
- **java-symbol-file-refresh-default-interval**：Java 符号表的刷新间隔，避免高频刷新
- **java-symbol-file-max-space-limit**：避免 Java 符号表占用过大的 `/tmp` 空间

## eBPF OffCPU Profiling

eBPF OffCPU Profiling 是默认关闭的，Agent 支持的配置参数如下：
```yaml
static_config:
  ebpf:

    ## Off-cpu profile configuration, Enterprise Edition Only.
    #off-cpu-profile:
      ## eBPF off-cpu Profile Switch
      ## Default: true
      #disabled: true

      ## Sampling process name
      ## Default: ^deepflow-.*
      #regex: ^deepflow-.*

      ## Configure the minimum blocking event time
      ## Default: 50us. Range: [1, 2^32-1)us
      ## Note:
      ##   Scheduler events are still high-frequency events, as their rate may exceed 1 million events
      ##   per second, so caution should still be exercised.
      ##   If overhead remains an issue, you can configure the 'minblock' tunable parameter here.
      ##   If the off-CPU time is less than the value configured in this item, the data will be discarded.
      ##   If your goal is to trace longer blocking events, increasing this parameter can filter out shorter
      ##   blocking events, further reducing overhead. Additionally, we will not collect events with a block
      ##   time exceeding 1 hour.
      #minblock: 50us
```

上述配置的含义如下：
- **disabled**：默认为 True，表示功能关闭。
- **regex**：开启 OffCPU Profiling 的进程名正则表达式。
- **minblock**：使用持续时间限制采集的 OffCPU 事件，避免采集过多导致主机负载过高。

另外，下面两个 OnCPU 的配置项也对 OffCPU 生效：
- **java-symbol-file-refresh-default-interval**
- **java-symbol-file-max-space-limit**

# 调用 API 获取 Profiling 数据

::: warning
eBPF Profiling 数据目前无法在 Grafana 上展现，仅可在企业版页面中查看。
:::

但是，社区版中 Profiling 数据已经存储于 ClickHouse 的 `profile.in_process` 表中了，可通过调用 deepflow-server 的 API 查询数据。

## 获取指定进程的 Profiling 数据

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
  - `[k] function_name`：Linux 内核函数
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
- **total_value**：该函数的 CPU 执行时长，单位是微秒（us）。
- **self_value**：该函数作为叶子节点（最底层函数）的 CPU `净`执行时长，单位是微秒（us）。

使用 API 的返回结果，可以绘制**指定进程**的 CPU 火焰图。DeepFlow 企业版中的展示效果图如下：

![企业版中的进程火焰图](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfa9701ce.jpg)

## 获取指云服务器的整体 Profiling 数据

::: tip
当前仅 OnCPU Profiling 支持查询云服务器的整体数据。
:::

当请求参数携带 `"app_service": "Total"` 时，能够获取到名为 `Total` 的特殊进程的 OnCPU Profiling。它表示的是一台主机上所有进程的 Profiling 数据，用于快速定位瓶颈进程或线程。此时的返回结果示例：
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
- `app_service`：火焰图最顶层的节点，名字固定为 Total
- `[p] name`：一个进程的名称
- `[t] name`：一个线程的名称，它的父节点是一个 `[p] name` 类型的节点，表示这个线程所属的进程

使用 API 的返回结果，可以绘制**指定主机**的 OnCPU 火焰图。DeepFlow 企业版中的展示效果图如下（火焰图只有三层）：

![企业版中的主机火焰图](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405146642dfab0d31a.jpg)
