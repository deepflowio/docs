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
      - match_regex: \bjava( +\S+)* +-(?:cp|classpath) +\S+ +(?P<CLASS_NAME>[$_A-Za-z][$_0-9A-Za-z]*(?:\.[$_A-Za-z][$_0-9A-Za-z]*)*)
        match_type: cmdline_with_args
        only_in_container: false
        rewrite_name: ${CLASS_NAME}
        enabled_features: [ebpf.profile.on_cpu, proc.gprocess_info]
      - match_regex: \bpython(\S)*( +-\S+)* +(\S*/)*([^ /]+)
        match_type: cmdline_with_args
        only_in_container: false
        rewrite_name: $4
        enabled_features: [ebpf.profile.on_cpu, proc.gprocess_info]
      - match_regex: \b(?:lua|luajit)(\S)*( +-\S+)* +(\S*/)*([^ /]+)
        match_type: cmdline_with_args
        only_in_container: false
        rewrite_name: $5
        enabled_features: [ebpf.profile.on_cpu, proc.gprocess_info]
      - match_regex: \bphp(\d+)?(-fpm|-cli|-cgi)?( +-\S+)* +(\S*/)*([^ /]+\.php)
        match_type: cmdline_with_args
        only_in_container: false
        rewrite_name: $5
        enabled_features: [ebpf.profile.on_cpu, proc.gprocess_info]
      - match_regex: \b(node|nodejs)( +--\S+)* +(\S*/)*([^ /]+\.js)
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
  - The first two rules match Java processes started with a JAR or a main class, and rewrite the process name to the JAR filename or class name.
  - The following rules match Python, Lua/LuaJIT, PHP, and Node.js processes and rewrite the process name to the script filename.
  - The `^deepflow-` rule matches processes starting with `deepflow-`.
  - The last rule matches all processes.
- **match_type**: The matching type. Optional values are:
  - `cmdline_with_args`: Matches the full command line (including arguments).
  - `cmdline`: Matches only the command (excluding arguments).
  - `process_name`: Matches the process name.
- **only_in_container**: Whether to match only processes within containers.
- **rewrite_name**: The rule for rewriting the process name, supporting references to regex capture groups.
- **enabled_features**: The list of features enabled for matched processes:
  - `java.profile.cpu`: Enables Java CPU Profiling, requires `inputs.java.profile.cpu.enabled: true`, and does not depend on `ebpf.profile.on_cpu`
  - `ebpf.profile.on_cpu`: Enables On-CPU profiling, requires `inputs.ebpf.profile.on_cpu.disabled: false`
  - `ebpf.profile.off_cpu`: Enables Off-CPU profiling, requires `inputs.ebpf.profile.off_cpu.disabled: false`
  - `ebpf.profile.memory`: Enables memory profiling, requires `inputs.ebpf.profile.memory.disabled: false`

The default Process Matcher enables `ebpf.profile.on_cpu` for Java, Python, Lua/LuaJIT, PHP, Node.js, and DeepFlow processes. To collect Off-CPU or Memory Profiles, add the corresponding feature to `enabled_features` for the target process and enable the matching global Profile type. Interpreter-level Memory Profiling currently supports Python only.

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
  proc:
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

# Interpreter Profiling

Script stack unwinding for Node.js/V8, PHP, Lua, and Python is enabled by default. If a runtime is not used on a host, disable its unwinder to reduce kernel memory usage:

```yaml
inputs:
  ebpf:
    profile:
      languages:
        python_disabled: false
        php_disabled: false
        nodejs_disabled: false
        lua_disabled: false
```

- All four options default to `false`, which enables stack unwinding for the corresponding runtime.
- When an option is set to `true`, common native profiles of the target process can still be collected, but its script functions are no longer unwound.
- Restart the Agent after changing these options.
- Enabling all runtime unwinders uses approximately 17–20 MB of kernel memory. Disable unused runtimes to reduce this overhead.

The language switches only control script stack unwinding. The target process must still be selected by `inputs.proc.process_matcher`, and the required global Profile type must be enabled. See [Capabilities and Limitations](./auto-profiling/#interpreter-runtimes) for supported versions, architectures, and kernel requirements.

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

# Java CPU Profiling

Java CPU Profiling continuously samples JVM method stacks through a Java Agent using AsyncGetCallTrace (AGCT), and resolves Java JIT method symbols. This feature is independent of eBPF On-CPU Profiling. Both of the following conditions must be met before a target process is profiled:

- Set `inputs.java.profile.cpu.enabled: true` to enable the Java CPU Profiler.
- Match the target process with `inputs.proc.process_matcher` and include `java.profile.cpu` in `enabled_features`.

Start with a small number of business processes matched by JAR filename or full command line, and verify the resource overhead before expanding the scope. Merge the following example into the existing Agent group configuration; do not replace existing Process Matchers or unrelated settings:

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

To also collect ordinary eBPF On-CPU Profiles from the same process, retain `ebpf.profile.on_cpu` in `enabled_features` and ensure `inputs.ebpf.profile.on_cpu.disabled: false`. The two features use independent sampling paths and process lists; neither is a prerequisite for the other.

Configuration parameters:

- **enabled**: Defaults to false. When set to true, the Agent prepares the Java CPU Profiler at startup. Restart the Agent after changing this option.
- **frequency**: Sampling frequency in Hz. The default is 99 and the allowed range is 1–1000. For resource-sensitive environments, start at 49. Use 199 only for short diagnostics and after load testing.
- **max_depth**: Maximum number of frames retained in a Java stack. The default is 98 and the allowed range is 1–128. A larger value preserves deeper call paths but increases sample size and processing overhead.
- **sample_ring_size**: Per-JVM sample ring capacity. The default is 512 and the allowed range is 64–8192. A larger ring can absorb burst sampling or temporary sender backpressure, at the cost of additional JVM memory.
- **method_cache_size**: Per-JVM method cache capacity. The default is 256 and the allowed range is 64–8192. Increase it when a JVM has many methods or repeatedly resolves symbols, at the cost of additional JVM memory.

Changes to `enabled` and the sampling parameters require an Agent restart. Process Matcher supports hot updates; adding or removing `java.profile.cpu` does not restart the target JVM.
