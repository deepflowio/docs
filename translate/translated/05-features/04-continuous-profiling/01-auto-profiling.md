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
|            | Python (using CUDA)           |                   | ✔                  |
| hbm-inuse  | CUDA `*`                      |                   | ✔                  |
|            | Python (using CUDA)           |                   | ✔                  |
| rdma       | C/C++ `*`                     |                   | ✔                  |

Notes:

- `*`: features in development
- `**`: The JVM running the Java program must have a symbol table. See the [check method](#jvm-symbol-table-check).
- For supported kernel versions, see [Running Permissions and Kernel Requirements](../../ce-install/overview/#running-permissions-and-kernel-requirements).
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
| Python | CPython 3.10–3.13 | x86_64, AArch64 | On-CPU, Off-CPU, mem-alloc, mem-inuse, hbm-alloc, hbm-inuse |

Python HBM Profiles come from CUDA APIs called by the target process, not from the CPython allocator. Python applications such as PyTorch and vLLM can generate `hbm-alloc` and `hbm-inuse` when they allocate and release GPU memory through supported CUDA APIs. See [Configuration](./configuration/#cuda-hbm-profiling) for the collection scope and startup timing limitations.

Script stack unwinding requires the Agent to load the enhanced Continuous Profiler:

- Standard Linux kernels must be version 5.2 or later.
- Kylin V10 SP3 v2207 kernels matching `4.19.90-*.v2207.ky10.*` are also supported on both x86_64 and AArch64.
- Generic Linux 4.19 kernels and Kylin V10 SP3 v2101 kernels do not support script stack unwinding. The Agent can still use the common profiler to collect eligible native stacks.
- If the enhanced profiler fails to load, the Agent automatically falls back to the common profiler. DWARF and interpreter-level script stack unwinding are unavailable after fallback.

The Agent must be able to identify the target interpreter version and read the process executable and loaded interpreter libraries. With an unsupported runtime, a failed identification, or inaccessible files, a Profile may still contain native/runtime frames but no script functions. Python Memory Profiling captures object allocation and release events through the public CPython symbols `PyObject_Malloc/Free/Realloc` and `PyMem_RawMalloc/Free/Realloc`.

### User-space stack unwinding

eBPF On-CPU/Off-CPU Profiling can unwind user-space call stacks using frame pointers or DWARF.

- **Prefer frame pointers for continuous collection when you control the build or startup flags.** The profiler follows the frame pointer chain one frame at a time.
  - For C/C++, rebuild and redeploy with `gcc -fno-omit-frame-pointer`.
  - For Rust, set `RUSTFLAGS="-C force-frame-pointers=yes"`, then rebuild and redeploy.
  - Go preserves frame pointers by default on amd64 and arm64.
  - For Java, pass `-XX:+PreserveFramePointer` at JVM startup. A running JVM needs a restart to pick up the flag. Published tests have reported less than 1% overhead. The actual impact depends on the JDK and workload. See [Netflix](https://netflixtechblog.com/java-in-flames-e763b3d32166) and [Brendan Gregg](https://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html).
- **Consider DWARF when a native program omits frame pointers and rebuilding or restarting is impractical.** For example, an existing third-party C/C++ process can keep running while the Agent builds unwind tables from `.eh_frame` in the executable and shared libraries.
  - **Higher CPU overhead per sample.** Looking up unwind rules and restoring registers usually takes more CPU than following the frame pointer chain.
  - **Additional kernel memory.** At their default capacities, the DWARF process and shard maps use an estimated 136 MB of kernel memory combined.

  Confirm that the kernel supports DWARF unwinding, then set `inputs.ebpf.profile.unwinding.dwarf_disabled` to `false`. See [kernel requirements](../../ce-install/overview/#running-permissions-and-kernel-requirements) and [Agent unwinding configuration](../../configuration/agent/#inputs.ebpf.profile.unwinding).

To capture HotSpot JIT-compiled Java methods in an eBPF flame graph, use `-XX:+PreserveFramePointer`. The DeepFlow Agent's DWARF unwinder cannot unwind HotSpot JIT frames because the generated code lacks the required ELF unwind information. If you only need to find CPU hotspots in Java methods, the Enterprise Edition can sample inside the JVM without frame pointers (you can omit `-XX:+PreserveFramePointer`). See [Java Profiling](#java-profiling).

Unwinding recovers call addresses. For compiled languages, preserve the symbol table during the build so the Agent can resolve those addresses to function names in the flame graph.

### Off-CPU stack collection

The Off-CPU profiling feature **only** collects the following call stacks:

- Call stacks where the process state is **equal to** `TASK_INTERRUPTIBLE` (interruptible sleep) or `TASK_UNINTERRUPTIBLE` (uninterruptible sleep) when yielding the CPU  
- Call stacks **excluding** process 0 (Idle process)  
- Call stacks containing **at least one** user-space function  
- Call stacks where the CPU wait time is **no more than** 1 hour  

## Java Profiling

Supported Java Profiling data types:

| Type | Supported Language/Library | Supported Kernel Versions | Community Edition | Enterprise Edition |
| ---- | -------------------------- | ------------------------- | ----------------- | ------------------ |
| cpu  | Java                       | Linux 4.14+ or CentOS/RedHat 3.10.0-940+ recommended | | ✔ |

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
