---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

# AutoProfiling

通过 eBPF 获取应用程序的函数调用栈快照，DeepFlow 可绘制任意进程的 Profiling 火焰图，帮助开发者快速定位函数性能瓶颈。**函数调用栈中除了包含业务函数以外，还可展现动态链接库、语言运行时、内核函数的耗时情况**。除此之外，DeepFlow 在采集函数调用栈时生成了唯一标识，可用于与调用日志相关联，实现分布式追踪和函数性能剖析的联动。

![DeepFlow 的 AutoProfiling](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f4b63fd.png)

# 能力和限制

支持的 eBPF Profiling 数据类型：

| 类型      | 支持语言/库      | 社区版 | 企业版 |
| --------- | ---------------- | ------ | ------ |
| on-cpu    | Java             | ✔      | ✔      |
|           | C/C++            | ✔      | ✔      |
|           | Rust             | ✔      | ✔      |
|           | Golang           | ✔      | ✔      |
|           | Python `***`     | ✔      | ✔      |
|           | CUDA             | ✔      | ✔      |
|           | Lua `*`          | ✔      | ✔      |
| off-cpu   | Java             |        | ✔      |
|           | C/C++            |        | ✔      |
|           | Rust             |        | ✔      |
|           | Golang           |        | ✔      |
|           | Python `***`     |        | ✔      |
|           | CUDA             |        | ✔      |
|           | Lua `*`          |        | ✔      |
| on-gpu    | CUDA `*`         |        | ✔      |
| mem-alloc | Java `**`        |        | ✔      |
|           | Rust             |        | ✔      |
|           | Golang `*`       |        | ✔      |
|           | Python `*` `***` |        | ✔      |
| mem-inuse | Rust             |        | ✔      |
| hbm-alloc | CUDA `*`         |        | ✔      |
| hbm-inuse | CUDA `*`         |        | ✔      |
| rdma      | C/C++ `*`        |        | ✔      |

说明：

- `*`: features in development
- `**`: 运行 Java 程序的 JVM 须有符号表，参考[检查方法](#jvm-符号表检查)
- `***`: 当前支持版本为 Python 3.10
- 类型：
  - on-cpu：函数在 CPU 上消耗的时间
  - off-cpu：函数等待 CPU 的时间
  - on-gpu：函数在 GPU 上消耗的时间
  - mem-alloc：对象的内存总分配量及函数调用栈
  - mem-inuse：对象的内存当前用量及函数调用栈
  - hbm-alloc：对象的 GPU 显存总分配量及函数调用栈
  - hbm-inuse：对象的 GPU 显存当前用量及函数调用栈
- 语言：
  - 编译为 ELF 格式可执行文件的语言：Golang、Rust、C/C++
  - 使用 JVM 虚拟机的语言：Java
  - 解释型语言：Python

获取 Profiling 数据需满足两个前提条件：

- 应用进程需要开启 Frame Pointer 或启用 Agent 的 DWARF 栈回溯能力
  - 应用进程开启 Frame Pointer（帧指针寄存器）：
    - 编译 C/C++：`gcc -fno-omit-frame-pointer`
    - 编译 Rust：`RUSTFLAGS="-C force-frame-pointers=yes"`
    - 编译 Golang：默认开启，无需额外编译参数
    - 运行 Java：`-XX:+PreserveFramePointer`
      - 开启此参数会禁用某些编译器优化，不过根据 [Netflix](https://netflixtechblog.com/java-in-flames-e763b3d32166) 和 [Brendan Gregg](https://www.brendangregg.com/FlameGraphs/cpuflamegraphs.html) 的实测结果，该配置通常只会引入 <1% 的性能损耗。因此，Netflix 早在 2015 年开始已经在生产环境大规模使用，以支撑其 Java 程序的每日性能分析。
  - 启用 Agent 的 DWARF 栈回溯能力请参考[文档](../../configuration/agent/#inputs.ebpf.profile.unwinding)
- 对于编译型语言的应用进程，编译时需要注意保留符号表

Off-CPU Profiling 功能**仅会**采集如下调用栈：

- 让出 CPU 时进程状态**等于**`TASK_INTERRUPTIBLE`（可中断睡眠）或`TASK_UNINTERRUPTIBLE`（不可中断睡眠）的调用栈
- 0 号进程（Idle 进程）**以外**的调用栈
- 含有**至少一个**用户态函数的调用栈
- 等待 CPU 的时间**不超过** 1 小时的调用栈

# 常见问题

## JVM 符号表检查

- 查找需要内存剖析的 Java 进程号，记为 `$pid`
- 查看进程加载的 `libjvm.so` 所在位置，记为 `$path`
  ```
  grep libjvm.so /proc/$pid/maps
  ```
- 检查该文件是否包含符号表
  ```
  readelf -WS $path | grep symtab
  ```
