---
title: 配置方法
permalink: /features/continuous-profiling/configuration
---

# eBPF On-CPU Profiling

eBPF On-CPU Profiling 是默认开启的，但你需要通过修改 `static_config.ebpf.on-cpu-profile.regex` 来指定需要开启的进程列表。默认情况下仅对进程名以 `deepflow-` 开头的进程开启。Agent 支持的配置参数如下：

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
- **regex**：开启 On-CPU Profiling 的进程名正则表达式。
- **java-symbol-file-refresh-default-interval**：Java 符号表的刷新间隔，避免高频刷新
- **java-symbol-file-max-space-limit**：避免 Java 符号表占用过大的 `/tmp` 空间

# eBPF Off-CPU Profiling

eBPF Off-CPU Profiling（仅企业版）是默认开启的，但你需要通过修改 `static_config.ebpf.off-cpu-profile.regex` 来指定需要开启的进程列表。默认情况下仅对进程名以 `deepflow-` 开头的进程开启。Agent 支持的配置参数如下：

```yaml
static_config:
  ebpf:

    ## Off-cpu profile configuration, Enterprise Edition Only.
    #off-cpu-profile:
    ## eBPF off-cpu Profile Switch
    ## Default: false
    #disabled: false

    ## Off-cpu trace process name
    ## Default: ^deepflow-.*
    #regex: ^deepflow-.*

    ## Whether to obtain the value of CPUID and decide whether to participate in aggregation.
    ## Set to 1:
    ##    Obtain the value of CPUID and will be included in the aggregation of stack trace data.
    ## Set to 0:
    ##    It will not be included in the aggregation. Any other value is considered invalid,
    ##    the CPU value for stack trace data reporting is a special value (CPU_INVALID:0xfff)
    ##    used to indicate that it is an invalid value.
    ## Default: 0
    #cpu: 0

    ## Configure the minimum blocking event time
    ## Default: 50us. Range: [0, 2^32-1)us
    ## Note:
    ##   If set to 0, there will be no minimum value limitation.
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

- **disabled**：默认为 False，表示功能开启。
- **regex**：开启 Off-CPU Profiling 的进程名正则表达式。
- **cpu**：默认为 0，表示一台主机上采集的数据不区分 CPU，当设置为 1 时数据将按 CPU ID 聚合。
- **minblock**：使用持续时间限制采集的 Off-CPU 事件，避免采集过多导致主机负载过高。

另外，下面两个 On-CPU 的配置项同时也对 Off-CPU 有效：

- **java-symbol-file-refresh-default-interval**
- **java-symbol-file-max-space-limit**

# eBPF Memory Profiling

eBPF Memory Profiling（仅企业版）是默认关闭的，你需要通过修改 `static_config.ebpf.memory-profile.regex` 来指定需要开启的进程列表。Agent 支持的配置参数如下：
```yaml
static_config:
  ebpf:

    # Memory profile configuration, Enterprise Edition Only.
    memory-profile:
      # eBPF memory Profile Switch
      # Default: true
      disabled: true

      # Memory trace process name
      # Default: ^java
      regex: ^java
```
