---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

> This document was translated by ChatGPT

# AutoProfiling

By using eBPF to capture snapshots of application function call stacks, DeepFlow can generate Profiling flame graphs for any process, helping developers quickly identify function performance bottlenecks. **In addition to business functions, the function call stack also displays the time consumption of dynamic link libraries, language runtimes, and kernel functions.** Moreover, DeepFlow generates a unique identifier when collecting function call stacks, which can be used to correlate with call logs, enabling the integration of distributed tracing and function performance profiling.

![DeepFlow's AutoProfiling](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f4b63fd.png)

# Capabilities and Limitations

Supported eBPF Profiling data types:

| Type      | Supported Languages/Libraries | Community Edition | Enterprise Edition |
| --------- | ----------------------------- | ----------------- | ------------------ |
| on-cpu    | Java                          | ✔                 | ✔                  |
|           | C/C++                         | ✔                 | ✔                  |
|           | Rust                          | ✔                 | ✔                  |
|           | Golang                        | ✔                 | ✔                  |
|           | Python `*`                    | ✔                 | ✔                  |
|           | CUDA `*`                      | ✔                 | ✔                  |
|           | Lua `*`                       | ✔                 | ✔                  |
| off-cpu   | Java                          |                   | ✔                  |
|           | C/C++                         |                   | ✔                  |
|           | Rust                          |                   | ✔                  |
|           | Golang                        |                   | ✔                  |
|           | Python `*`                    |                   | ✔                  |
|           | CUDA `*`                      |                   | ✔                  |
|           | Lua `*`                       |                   | ✔                  |
| mem-alloc | Java                          |                   | ✔                  |
|           | Rust `*`                      |                   | ✔                  |
|           | Golang `*`                    |                   | ✔                  |
|           | Python `*`                    |                   | ✔                  |
| mem-inuse | Rust `*`                      |                   | ✔                  |
| hbm-alloc | Python `*`                    |                   | ✔                  |
| hbm-inuse | Python `*`                    |                   | ✔                  |
| rdma      | C/C++ `*`                     |                   | ✔                  |

Notes:

- `*`: features in development
- Types:
  - on-cpu: Time spent by functions on the CPU
  - off-cpu: Time functions wait for the CPU
  - mem-alloc: Total memory allocation of objects and function call stacks
  - mem-inuse: Current memory usage of objects and function call stacks
  - hbm-alloc: Total GPU memory allocation of objects and function call stacks
  - hbm-inuse: Current GPU memory usage of objects and function call stacks
- Languages:
  - Languages compiled into ELF format executables: Golang, Rust, C/C++
  - Languages using the JVM: Java

Two prerequisites must be met to obtain Profiling data:

- The process needs to enable Frame Pointer
  - Compiling C/C++: `gcc -fno-omit-frame-pointer`
  - Compiling Rust: `RUSTFLAGS="-C force-frame-pointers=yes"`
  - Compiling Golang: Enabled by default, no additional compilation parameters needed
  - Running Java: `-XX:+PreserveFramePointer`
- For processes of compiled languages, ensure to retain the symbol table during compilation

The Off-CPU Profiling feature **only** collects the following call stacks:

- Call stacks where the process state **equals** `TASK_INTERRUPTIBLE` (interruptible sleep) or `TASK_UNINTERRUPTIBLE` (uninterruptible sleep) when yielding the CPU
- Call stacks **excluding** the 0th process (Idle process)
- Call stacks containing **at least one** user-mode function
- Call stacks where the CPU wait time **does not exceed** 1 hour