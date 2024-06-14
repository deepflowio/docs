---
title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling
---

# AutoProfiling

通过 eBPF 获取应用程序的函数调用栈快照，DeepFlow 可绘制任意进程的 CPU Profiling，帮助开发者快速定位函数性能瓶颈。**函数调用栈中除了包含业务函数以外，还可展现动态链接库、语言运行时、内核函数的耗时情况**。除此之外，DeepFlow 在采集函数调用栈时生成了唯一标识，可用于与调用日志相关联，实现分布式追踪和函数性能剖析的联动。

![DeepFlow 中的 CPU Profiling 和 Network Profiling](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240601665a96f4b63fd.png)

# 能力和限制

支持的 Profiling 数据类型：
- On-CPU
- Off-CPU `仅企业版`

支持的进程语言：
- 编译为 ELF 格式可执行文件的语言：Golang、Rust、C/C++
- 使用 JVM 虚拟机的语言：Java

获取 Profiling 数据需满足两个前提条件：
- 进程需要开启 Frame Pointer（帧指针寄存器）
  - 编译 C/C++：`gcc -fno-omit-frame-pointer`
  - 编译 Rust：`RUSTFLAGS="-C force-frame-pointers=yes"`
  - 编译 Golang：默认开启，无需额外编译参数
  - 运行 Java：`-XX:+PreserveFramePointer`
- 对于编译型语言的进程，编译时需要注意保留符号表

Off-CPU Profiling 功能**仅会**采集如下调用栈：
- 让出 CPU 时进程状态**等于**`TASK_INTERRUPTIBLE`（可中断睡眠）或`TASK_UNINTERRUPTIBLE`（不可中断睡眠）的调用栈
- 0 号进程（Idle 进程）**以外**的调用栈
- 含有**至少一个**用户态函数的调用栈
- 等待 CPU 的时间**不超过** 1 小时的调用栈
