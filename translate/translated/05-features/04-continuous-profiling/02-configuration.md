---
title: How to Enable Features
permalink: /features/continuous-profiling/configuration
---

> This document was translated by ChatGPT

# eBPF OnCPU Profiling

eBPF OnCPU Profiling is enabled by default, but you need to specify the list of processes to enable by modifying `static_config.ebpf.on-cpu-profile.regex`. By default, it is only enabled for processes whose names start with `deepflow-`. The configuration parameters supported by the Agent are as follows:

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

The meanings of the above configurations are as follows:

- **disabled**: Default is False, indicating the feature is enabled.
- **frequency**: Sampling frequency, default 99 approximately represents a 10ms sampling period. It is not recommended to set it to an integer multiple of 10 to avoid synchronization with the program's runtime or scheduling clock.
- **cpu**: Default is 0, indicating that the data collected on a host is not distinguished by CPU. When set to 1, the data will be aggregated by CPU ID.
- **regex**: Regular expression for the process names to enable OnCPU Profiling.
- **java-symbol-file-refresh-default-interval**: Refresh interval for Java symbol files to avoid high-frequency refreshes.
- **java-symbol-file-max-space-limit**: To prevent Java symbol files from occupying too much `/tmp` space.

# eBPF OffCPU Profiling

eBPF OffCPU Profiling (Enterprise Edition only) is enabled by default, but you need to specify the list of processes to enable by modifying `static_config.ebpf.off-cpu-profile.regex`. By default, it is only enabled for processes whose names start with `deepflow-`. The configuration parameters supported by the Agent are as follows:

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

The meanings of the above configurations are as follows:

- **disabled**: Default is False, indicating the feature is enabled.
- **regex**: Regular expression for the process names to enable OffCPU Profiling.
- **cpu**: Default is 0, indicating that the data collected on a host is not distinguished by CPU. When set to 1, the data will be aggregated by CPU ID.
- **minblock**: Use duration limit to collect OffCPU events to avoid excessive collection leading to high host load.

Additionally, the following two OnCPU configuration items are also effective for OffCPU:

- **java-symbol-file-refresh-default-interval**
- **java-symbol-file-max-space-limit**
