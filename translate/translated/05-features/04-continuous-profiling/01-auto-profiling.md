---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

> This document was translated by ChatGPT

# AutoProfiling

By using eBPF to capture snapshots of application function call stacks, DeepFlow can render CPU Profiling for any process, helping developers quickly identify function performance bottlenecks. **In addition to business functions, the function call stack also shows the time consumption of dynamic link libraries, language runtimes, and kernel functions.** Moreover, DeepFlow generates a unique identifier when collecting function call stacks, which can be used to correlate with call logs, enabling the linkage of distributed tracing and function performance profiling.

![CPU Profiling and Network Profiling in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f4b63fd.png)

# Capabilities and Limitations

Supported Profiling data types:

- OnCPU
- OffCPU `Enterprise Edition only`

Supported process languages:

- Languages compiled into ELF format executables: Golang, Rust, C/C++
- Languages using the JVM: Java

Two prerequisites must be met to obtain Profiling data:

- The process needs to enable Frame Pointer
  - Compiling C/C++: `gcc -fno-omit-frame-pointer`
  - Compiling Rust: `RUSTFLAGS="-C force-frame-pointers=yes"`
  - Compiling Golang: Enabled by default, no additional compilation parameters needed
  - Running Java: `-XX:+PreserveFramePointer`
- For compiled languages, the symbol table must be retained during compilation

The OffCPU Profiling feature **only** collects the following call stacks:

- Call stacks where the process state **equals** `TASK_INTERRUPTIBLE` (interruptible sleep) or `TASK_UNINTERRUPTIBLE` (uninterruptible sleep) when yielding the CPU
- Call stacks **excluding** the 0th process (Idle process)
- Call stacks containing **at least one** user-mode function
- Call stacks where the wait time for the CPU **does not exceed** 1 hour
