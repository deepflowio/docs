---
title: Configuration Method
permalink: /features/continuous-profiling/configuration
---

> This document was translated by DeepSeek

By default, continuous profiling is only enabled for specific processes. Please refer to this document to modify the Agent group configuration to enable/adjust the continuous profiling functionality. In the Enterprise Edition, navigate to `System - Agent - Configuration` to modify the Agent group settings.

# Process Matcher

The Agent uses the `inputs.proc.process_matcher` configuration to match processes and enable continuous profiling for the corresponding processes. The default configuration is as follows:

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

The meaning of the above configuration is as follows:

- **match_regex**: The regular expression for process matching. The matching rules are as follows:
  - The first rule matches Java processes, e.g., `java -jar app.jar`, and rewrites the process name to the JAR filename.
  - The second rule matches Python processes, e.g., `python app.py`, and rewrites the process name to the Python script name.
  - The third rule matches processes starting with `deepflow-`.
  - The last rule matches all processes.
- **match_type**: The matching type. Optional values are:
  - `cmdline_with_args`: Matches the full command line (including arguments).
  - `cmdline`: Matches only the command (excluding arguments).
  - `process_name`: Matches the process name.
- **only_in_container**: Whether to match only processes within containers.
- **rewrite_name**: The rule for rewriting the process name, supporting references to regex capture groups.
- **enabled_features**: The list of features enabled for matched processes:
  - `ebpf.profile.on_cpu`: Enables On-CPU profiling, requires `inputs.ebpf.profile.on_cpu.disabled: false`
  - `ebpf.profile.off_cpu`: Enables Off-CPU profiling, requires `inputs.ebpf.profile.off_cpu.disabled: false`
  - `ebpf.profile.memory`: Enables memory profiling, requires `inputs.ebpf.profile.memory.disabled: false`

Additionally, `inputs.proc.process_blacklist` can be used to ignore specific processes. It has higher priority than `process_matcher`.

```yaml
inputs:
  proc:
    process_blacklist: [sleep, sh, bash, pause, runc, grep, awk, sed, curl]
```

# Symbol Table

Symbol table related settings can be configured for specific languages. These settings apply to all continuous profiling types and typically work well with default values, requiring no changes.

```yaml
inputs:
  ebpf:
    symbol_table:
      golang_specific:
        enabled: false
      java:
        refresh_defer_duration: 60s
        max_symbol_file_size: 10
```

The meaning of the above configuration is as follows:
- **golang_specific.enabled**: Configures whether to enable Golang-specific symbol table parsing capability.
- **refresh_defer_duration**: The refresh deferral duration for the Java symbol table, to avoid high-frequency refreshing.
- **max_symbol_file_size**: The maximum disk space occupied by the Java symbol table, in GB, to avoid consuming excessive `/tmp` space.

# eBPF On-CPU Profiling

eBPF On-CPU Profiling is enabled by default, but requires modifying `inputs.proc.process_matcher` to specify the target process list. The configuration parameters supported by the Agent are as follows:

```yaml
inputs:
  ebpf:
    profile:
      on_cpu:
        disabled: false
        sampling_frequency: 99
        aggregate_by_cpu: false
```

The meaning of the above configuration is as follows:
- **disabled**: Defaults to false, meaning the feature is enabled.
- **sampling_frequency**: The sampling frequency. A default value of 99 corresponds to approximately a 10ms sampling period. It is not recommended to set this to an integer multiple of 10, to avoid synchronization with program execution or scheduling clocks.
- **aggregate_by_cpu**: Defaults to false, meaning the data collected on a host is not distinguished by CPU. When set to true, data will be aggregated by CPU ID.

# eBPF Off-CPU Profiling

eBPF Off-CPU Profiling (Enterprise Edition only) is disabled by default. It also requires modifying `inputs.proc.process_matcher` to specify the target process list. The configuration parameters supported by the Agent are as follows:

```yaml
inputs:
  ebpf:
    profile:
      off_cpu:
        disabled: true
        aggregate_by_cpu: false
        min_blocking_time: 50us
```

The meaning of the above configuration is as follows:

- **disabled**: Defaults to true, meaning the feature is disabled.
- **aggregate_by_cpu**: Defaults to false, meaning the data collected on a host is not distinguished by CPU. When set to true, data will be aggregated by CPU ID.
- **min_blocking_time**: Uses the duration to limit the collected Off-CPU events, preventing excessive collection that could lead to high host load.

# eBPF Memory Profiling

eBPF Memory Profiling (Enterprise Edition only) is disabled by default. It also requires modifying `inputs.proc.process_matcher` to specify the target process list. The configuration parameters supported by the Agent are as follows:

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

The meaning of the above configuration is as follows:

- **disabled**: Defaults to true, meaning the feature is disabled.
- **report_interval**: The interval at which the Agent aggregates and reports memory profiling data.
- **allocated_addresses_lru_len**: The collector uses an LRU cache to record process-allocated addresses to prevent uncontrolled memory usage. Each LRU entry occupies approximately 32B of memory.
- **sort_length**: The queue length for sorting memory profiling data by timestamp before processing.
  - When configuring this option, first adjust the `sort_interval` parameter as described. Then, refer to the collector performance metrics `deepflow_agent_ebpf_memory_profiler`, specifically the `dequeued_by_length` and `dequeued_by_interval` metrics. Appropriately reduce this parameter ensuring the former is several times smaller than the latter.
- **sort_interval**: The maximum time interval for sorting memory profiling data by timestamp before processing. This parameter controls the maximum time difference between the first and last elements in the sorting array.
  - When configuring this option, refer to the collector performance metric `deepflow_agent_ebpf_memory_profiler`, specifically the `time_backtracked` metric. Increase this parameter until the metric becomes 0. Note that it might be necessary to correspondingly increase the `sort_length` parameter.
- **queue_size**: The internal queue size of the memory profiling component.
  - When configuring this option, refer to the collector performance metrics `deepflow_agent_ebpf_memory_profiler`, specifically the `overwritten` and `pending` metrics. Increase this configuration until the former is 0 and the latter does not exceed this configuration value.
```
