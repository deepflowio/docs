---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

> This document was translated by ChatGPT

# AutoProfiling

By using eBPF to capture snapshots of an application's function call stack, DeepFlow can generate profiling flame graphs for any process, helping developers quickly pinpoint function performance bottlenecks. **In addition to business functions, the function call stack can also display the time consumption of dynamic link libraries, language runtimes, and kernel functions**. Furthermore, when collecting function call stacks, DeepFlow generates a unique identifier that can be associated with call logs, enabling the linkage between distributed tracing and function performance profiling.

![DeepFlow's AutoProfiling](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f4b63fd.png)

# Capabilities and Limitations

## eBPF Profiling

Supported eBPF profiling data types:

| Type       | Supported Languages/Libraries | Community Edition | Enterprise Edition |
| ---------- | ----------------------------- | ----------------- | ------------------ |
| on-cpu     | Java                          | ✔                 | ✔                  |
|            | C/C++                         | ✔                 | ✔                  |
|            | Rust                          | ✔                 | ✔                  |
|            | Golang                        | ✔                 | ✔                  |
|            | CUDA                          | ✔                 | ✔                  |
|            | Node.js/V8                    |                   | ✔                  |
|            | PHP                           |                   | ✔                  |
|            | Lua                           |                   | ✔                  |
|            | Python                        |                   | ✔                  |
| off-cpu    | Java                          |                   | ✔                  |
|            | C/C++                         |                   | ✔                  |
|            | Rust                          |                   | ✔                  |
|            | Golang                        |                   | ✔                  |
|            | CUDA                          |                   | ✔                  |
|            | Node.js/V8                    |                   | ✔                  |
|            | PHP                           |                   | ✔                  |
|            | Python                        |                   | ✔                  |
| on-gpu     | CUDA `*`                      |                   | ✔                  |
| mem-alloc  | Java `**`                     |                   | ✔                  |
|            | Rust                          |                   | ✔                  |
|            | Golang `*`                    |                   | ✔                  |
|            | Python                        |                   | ✔                  |
| mem-inuse  | Rust                          |                   | ✔                  |
|            | Python                        |                   | ✔                  |
| hbm-alloc  | CUDA `*`                      |                   | ✔                  |
| hbm-inuse  | CUDA `*`                      |                   | ✔                  |
| rdma       | C/C++ `*`                     |                   | ✔                  |

Notes:

- `*`: features in development
- `**`: The JVM running the Java program must have a symbol table. See the [check method](#jvm-symbol-table-check).
- Types:
  - on-cpu: Time a function spends on the CPU
  - off-cpu: Time a function waits for the CPU
  - on-gpu: Time a function spends on the GPU
  - mem-alloc: Total memory allocated by objects and the function call stack
  - mem-inuse: Current memory usage of objects and the function call stack
  - hbm-alloc: Total GPU memory allocated by objects and the function call stack
  - hbm-inuse: Current GPU memory usage of objects and the function call stack
- Languages:
  - Languages compiled into ELF format executables: Golang, Rust, C/C++
  - Languages using the JVM: Java
  - Interpreter runtimes: Node.js/V8, PHP, Lua, Python

### Interpreter Runtimes

Interpreter-level script stack unwinding is an Enterprise Edition capability. The following runtimes are currently supported:

| Runtime | Supported Versions | Architectures | Profile Types |
| ------- | ------------------ | ------------- | ------------- |
| Node.js/V8 | Node.js 16–23 (V8 9–12) | x86_64, AArch64 | On-CPU, Off-CPU |
| PHP | 7.4–8.3 | x86_64, AArch64 | On-CPU, Off-CPU |
| Lua | Lua 5.1–5.4, LuaJIT 2.1 | x86_64, AArch64 | On-CPU |
| Python | CPython 3.10–3.13 | x86_64, AArch64 | On-CPU, Off-CPU, mem-alloc, mem-inuse |

Script stack unwinding requires the Agent to load the enhanced Continuous Profiler:

- Standard Linux kernels must be version 5.2 or later.
- Kylin V10 SP3 v2207 kernels matching `4.19.90-*.v2207.ky10.*` are also supported on both x86_64 and AArch64.
- Generic Linux 4.19 kernels and Kylin V10 SP3 v2101 kernels do not support script stack unwinding. The Agent can still use the common profiler to collect eligible native stacks.
- If the enhanced profiler fails to load, the Agent automatically falls back to the common profiler. DWARF and interpreter-level script stack unwinding are unavailable after fallback.

The Agent must be able to identify the target interpreter version and read the process executable and loaded interpreter libraries. With an unsupported runtime, a failed identification, or inaccessible files, a Profile may still contain native/runtime frames but no script functions. Python Memory Profiling captures object allocation and release events through the public CPython symbols `PyObject_Malloc/Free/Realloc` and `PyMem_RawMalloc/Free/Realloc`.

Two prerequisites must be met when the common eBPF On-CPU/Off-CPU profiler obtains call stacks:

- The application process must enable Frame Pointer or enable the Agent's DWARF stack unwinding capability  
  - Enable Frame Pointer (frame pointer register) for the application process:  
    - Compile C/C++: `gcc -fno-omit-frame-pointer`  
    - Compile Rust: `RUSTFLAGS="-C force-frame-pointers=yes"`  
    - Compile Golang: Enabled by default, no extra compile parameters needed  
    - Run Java: `-XX:+PreserveFramePointer` 
      - Enabling this parameter disables certain compiler optimizations. However, based on real-world measurements from [Netflix](https://netflixtechblog.com/java-in-flames-e763b3d32166) and [Brendan Gregg](https://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html), this configuration typically introduces less than 1% performance overhead. As a result, Netflix has been widely using it in production since 2015 to support daily performance analysis of its Java applications. 
  - For enabling the Agent's DWARF stack unwinding capability, please refer to the [documentation](../../configuration/agent/#inputs.ebpf.profile.unwinding)  
- For compiled languages, ensure the symbol table is preserved during compilation  

The Off-CPU profiling feature **only** collects the following call stacks:

- Call stacks where the process state is **equal to** `TASK_INTERRUPTIBLE` (interruptible sleep) or `TASK_UNINTERRUPTIBLE` (uninterruptible sleep) when yielding the CPU  
- Call stacks **excluding** process 0 (Idle process)  
- Call stacks containing **at least one** user-space function  
- Call stacks where the CPU wait time is **no more than** 1 hour  

## Java Profiling

Supported Java Profiling data types:

| Type | Supported Language/Library | Community Edition | Enterprise Edition |
| ---- | -------------------------- | ----------------- | ------------------ |
| cpu  | Java                       |                   | ✔                  |

Notes:

- `cpu` measures the CPU time consumed by Java methods and captures their call stacks.
- A Java Agent continuously samples JVM method stacks using HotSpot AsyncGetCallTrace (AGCT) and resolves JIT method symbols.
- Java CPU Profiling and eBPF On-CPU Profiling are independent:
  - Java CPU Profiling samples Java method stacks inside the JVM. It uses `java.profile.cpu` to select processes and does not require Frame Pointer.
  - eBPF On-CPU Profiling samples user-space and kernel-space stacks through eBPF/perf. It uses `ebpf.profile.on_cpu` to select processes.
  - Both can profile the same Java process, or either one can be enabled independently. If only clear Java method stacks are needed, enable Java CPU Profiling alone to avoid collecting two profiles from different sources.

See [Configuration Method](./configuration/#java-cpu-profiling) for details.

# FAQ

## JVM Symbol Table Check

- Find the process ID of the Java process that requires memory profiling, denoted as `$pid`  
- Check the location of the loaded `libjvm.so` for the process, denoted as `$path`  
  ```
  grep libjvm.so /proc/$pid/maps
  ```
- Check whether the file contains a symbol table  
  ```
  readelf -WS $path | grep symtab
  ```
