---
title: 配置方法
permalink: /features/continuous-profiling/configuration
---

默认情况下，持续剖析仅对特定进程开启，请参考本文修改采集器组配置，开启/调整持续剖析功能。在企业版中，请前往 `系统管理-采集器-配置` 页面进行采集器组配置的修改。

# Process Matcher

Agent 使用 `inputs.proc.process_matcher` 配置来匹配进程，开启对应进程的持续剖析功能。默认配置如下：

```yaml
inputs:
  proc:
    process_matcher:
      - match_regex: \bjava( +\S+)* +-jar +(\S*/)*([^ /]+\.jar)
        match_type: cmdline_with_args
        only_in_container: false
        rewrite_name: $3
        enabled_features: [ebpf.profile.on_cpu, proc.gprocess_info]
      - match_regex: \bpython(\S)*( +-\S+)* +(\S*/)*([^ /]+)
        match_type: cmdline_with_args
        only_in_container: false
        rewrite_name: $4
        enabled_features: [ebpf.profile.on_cpu, proc.gprocess_info]
      - match_regex: ^deepflow-
        only_in_container: false
        enabled_features: [ebpf.profile.on_cpu, proc.gprocess_info]
      - match_regex: .*
        enabled_features: [proc.gprocess_info]
```

上述配置的含义如下：

- **match_regex**: 进程匹配的正则表达式，匹配规则如下:
  - 第一条规则匹配 Java 进程，例如 `java -jar app.jar`，并将进程名重写为 jar 包名
  - 第二条规则匹配 Python 进程，例如 `python app.py`，并将进程名重写为 Python 脚本名
  - 第三条规则匹配以 `deepflow-` 开头的进程
  - 最后一条规则匹配所有进程
- **match_type**: 匹配类型，可选值:
  - `cmdline_with_args`: 匹配完整命令行（包含参数）
  - `cmdline`: 仅匹配命令（不含参数）
  - `process_name`: 匹配进程名
- **only_in_container**: 是否仅匹配容器内的进程
- **rewrite_name**: 重写进程名的规则，支持正则表达式捕获组引用
- **enabled_features**: 为匹配的进程启用的功能列表:
  - `java.profile.cpu`: 开启 Java CPU 剖析，需要配置 `inputs.java.profile.cpu.enabled: true`，不依赖 `ebpf.profile.on_cpu`
  - `ebpf.profile.on_cpu`: 开启 On-CPU 剖析，需要配置 `inputs.ebpf.profile.on_cpu.disabled: false`
  - `ebpf.profile.off_cpu`: 开启 Off-CPU 剖析，需要配置 `inputs.ebpf.profile.off_cpu.disabled: false`
  - `ebpf.profile.memory`: 开启内存剖析，需要配置 `inputs.ebpf.profile.memory.disabled: false`

同时可以使用 `inputs.proc.process_blacklist` 来忽略某些进程，其优先级比 `process_matcher` 高。

```yaml
inputs:
  proc:
    process_blacklist: [sleep, sh, bash, pause, runc, grep, awk, sed, curl]
```

# Symbol Table

可以为特定语言配置符号表相关的设置。这些设置对于各类持续剖析都生效，一般保持默认配置即可，无需修改。

```yaml
inputs:
  proc:
    symbol_table:
      golang_specific:
        enabled: false
      java:
        refresh_defer_duration: 60s
        max_symbol_file_size: 10
```

上述配置的含义如下：
- **golang_specific.enabled**：配置是否开启 Golang 特有符号表的解析能力。
- **refresh_defer_duration**: Java 符号表的刷新延迟，避免高频刷新。
- **max_symbol_file_size**: Java 符号表占用的最大空间大小，单位为 GB，避免占用过大的 `/tmp` 空间。

# eBPF On-CPU Profiling

eBPF On-CPU Profiling 是默认开启的，但需要修改 `inputs.proc.process_matcher` 来指定进程列表。Agent 支持的配置参数如下：

```yaml
inputs:
  ebpf:
    profile:
      on_cpu:
        disabled: false
        sampling_frequency: 99
        aggregate_by_cpu: false
```

上述配置的含义如下：
- **disabled**: 默认为 false，表示功能开启。
- **sampling_frequency**: 采样频率，默认 99 约表示 10ms 采样周期。不建议设置为 10 的整数倍，避免和程序运行或调度的时钟同频。
- **aggregate_by_cpu**: 默认为 false，表示一台主机上采集的数据不区分 CPU，当设置为 true 时数据将按 CPU ID 聚合。

# eBPF Off-CPU Profiling

eBPF Off-CPU Profiling（仅企业版）是默认关闭的，同时需要修改 `inputs.proc.process_matcher` 来指定需进程列表。Agent 支持的配置参数如下：

```yaml
inputs:
  ebpf:
    profile:
      off_cpu:
        disabled: true
        aggregate_by_cpu: false
        min_blocking_time: 50us
```

上述配置的含义如下：

- **disabled**：默认为 true，表示功能关闭。
- **aggregate_by_cpu**：默认为 false，表示一台主机上采集的数据不区分 CPU，当设置为 true 时数据将按 CPU ID 聚合。
- **min_blocking_time**：使用持续时间限制采集的 Off-CPU 事件，避免采集过多导致主机负载过高。

# eBPF Memory Profiling

eBPF Memory Profiling（仅企业版）是默认关闭的，同时需要修改 `inputs.proc.process_matcher` 来指定需进程列表。Agent 支持的配置参数如下：

```yaml
inputs:
  ebpf:
    profile:
      memory:
        disabled: true
        report_interval: 10s
        allocated_addresses_lru_len: 131072
        sort_length: 16384
        sort_interval: 1500ms
        queue_size: 32768
```

上述配置的含义如下：

- **disabled**：默认为 true，表示功能关闭。
- **report_interval**：Agent 聚合和上报内存剖析数据的间隔。
- **allocated_addresses_lru_len**：采集器使用 LRU 缓存记录进程分配的地址，以避免内存使用失控。每个 LRU 条目大约占 32B 内存。
- **sort_length**：内存剖析数据处理前按时间戳进行排序的队列长度。
  - 配置该选项时先按说明调整 `sort_interval` 参数，在参考采集器性能统计 `deepflow_agent_ebpf_memory_profiler` 中 `dequeued_by_length` 和 `dequeued_by_interval` 指标，在保证前者小于后者几倍的前提下适当调小该参数。
- **sort_interval**：内存剖析数据处理前按时间戳进行排序的最大时间间隔。该参数控制排序数组中第一个和最后一个元素之间的时间间隔的最大值。
  - 配置该选项可以参考采集器性能统计 `deepflow_agent_ebpf_memory_profiler` 中 `time_backtracked` 指标，增大该参数使之为 0 即可。注意可能需要相应增大 `sort_length` 参数。
- **queue_size**：内存剖析组件内部的队列大小。
  - 配置该选项可以参考采集器性能统计 `deepflow_agent_ebpf_memory_profiler` 中 `overwritten` 和 `pending` 指标，增大该配置使得前者为 0，后者不高于该配置即可。

# Java CPU Profiling

Java CPU Profiling 通过 Java Agent 的 AsyncGetCallTrace（AGCT）持续采集 JVM 方法调用栈，并补全 Java JIT 方法符号。该功能独立于 eBPF On-CPU Profiling，必须同时满足以下两个条件才会采集目标进程：
- 配置 `inputs.java.profile.cpu.enabled: true`，开启 Java CPU Profiler 基础能力；
- `inputs.proc.process_matcher` 命中目标进程，并且 `enabled_features` 中包含 `java.profile.cpu`。

推荐先按 JAR 包或完整命令行精确匹配少量业务进程，验证资源开销后再扩大范围。以下配置需要合并到现有采集器组配置中，请勿直接覆盖已有的 Process Matcher 和其他配置：

```yaml
inputs:
  proc:
    process_matcher:
      - match_regex: '.*my-order-service\.jar.*'
        match_type: cmdline_with_args
        only_in_container: false
        enabled_features:
          - java.profile.cpu
          - proc.gprocess_info
  java:
    profile:
      cpu:
        enabled: true
        frequency: 99
        max_depth: 98
        sample_ring_size: 512
        method_cache_size: 256
```

如果同一进程还需要普通 eBPF On-CPU Profiling，可在 `enabled_features` 中同时保留 `ebpf.profile.on_cpu`，并确保 `inputs.ebpf.profile.on_cpu.disabled: false`。两个功能使用独立的采样链路和进程名单，任何一个都不是另一个的前置条件。

配置参数说明：
- **enabled**：默认为 false。设置为 true 后，Agent 在启动时准备 Java CPU Profiler 基础能力；修改后需重启 Agent 生效。
- **frequency**：采样频率，单位为 Hz，默认为 99，范围为 1～1000。资源敏感场景可从 49 开始；199 仅建议用于短时诊断，并应先进行压测。
- **max_depth**：单条 Java 调用栈最多保留的栈帧数，默认为 98，范围为 1～128。增大该值可保留更深的调用路径，但会增加样本大小和处理开销。
- **sample_ring_size**：每个 JVM 中的样本环形队列容量，默认为 512，范围为 64～8192。增大该值可以缓解突发采样或发送端短时背压造成的样本丢弃，但会增加 JVM 内存占用。
- **method_cache_size**：每个 JVM 中的方法缓存容量，默认为 256，范围为 64～8192。方法数量较多、符号反复解析时可适当调大，但会增加 JVM 内存占用。

`enabled` 和上述采样参数修改后需重启 Agent；Process Matcher 支持热更新，增删 `java.profile.cpu` 不会重启目标 JVM。
