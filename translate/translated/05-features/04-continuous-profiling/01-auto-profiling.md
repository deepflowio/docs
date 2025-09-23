---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

> This document was translated by ChatGPT

# AutoProfiling

By using eBPF to capture snapshots of an application's function call stack, DeepFlow can generate profiling flame graphs for any process, helping developers quickly pinpoint function performance bottlenecks. **In addition to business functions, the function call stack can also display the time consumption of dynamic link libraries, language runtimes, and kernel functions**. Furthermore, when collecting function call stacks, DeepFlow generates a unique identifier that can be associated with call logs, enabling the linkage between distributed tracing and function performance profiling.

![DeepFlow's AutoProfiling](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f4b63fd.png)

# Capabilities and Limitations

Supported eBPF profiling data types:

| Type      | Supported Languages/Libraries | Community Edition | Enterprise Edition |
| --------- | ----------------------------- | ----------------- | ------------------ |
| on-cpu    | Java                           | ✔                 | ✔                  |
|           | C/C++                          | ✔                 | ✔                  |
|           | Rust                           | ✔                 | ✔                  |
|           | Golang                         | ✔                 | ✔                  |
|           | Python `***`                   | ✔                 | ✔                  |
|           | CUDA                           | ✔                 | ✔                  |
|           | Lua `*`                        | ✔                 | ✔                  |
| off-cpu   | Java                           |                   | ✔                  |
|           | C/C++                          |                   | ✔                  |
|           | Rust                           |                   | ✔                  |
|           | Golang                         |                   | ✔                  |
|           | Python `***`                   |                   | ✔                  |
|           | CUDA                           |                   | ✔                  |
|           | Lua `*`                        |                   | ✔                  |
| on-gpu    | CUDA `*`                       |                   | ✔                  |
| mem-alloc | Java `**`                      |                   | ✔                  |
|           | Rust                           |                   | ✔                  |
|           | Golang `*`                     |                   | ✔                  |
|           | Python `*` `***`               |                   | ✔                  |
| mem-inuse | Rust                           |                   | ✔                  |
| hbm-alloc | CUDA `*`                       |                   | ✔                  |
| hbm-inuse | CUDA `*`                       |                   | ✔                  |
| rdma      | C/C++ `*`                      |                   | ✔                  |

Notes:

- `*`: features in development  
- `**`: The JVM running the Java program must have a symbol table, see [check method](#jvm-symbol-table-check)  
- `***`: Currently supports Python 3.10  
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
  - Interpreted languages: Python  

Two prerequisites must be met to obtain profiling data:

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
