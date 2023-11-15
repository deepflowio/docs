> This document was translated by GPT-4

---

title: AutoProfiling
permalink: /features/continuous-profiling/auto-profiling

---

# AutoProfiling

Through the use of eBPF to capture snapshots of an application's function call stack, DeepFlow is able to generate CPU Profile for any process, assisting developers in quickly identifying function performance bottlenecks. **In addition to containing business functions, the function call stack can also display the timing of dynamic link libraries and kernel system call functions**. Furthermore, DeepFlow generates a unique identifier when collecting function call stack, which can be associated with invocation logs, realizing the linkage between distributed tracing and function performance profiling.

![CPU Profile and Network Profile in DeepFlow](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2023091064fc9ac3060c3.png)

# Current Limitations

At present, eBPF Profile data cannot be displayed on Grafana, and can only be viewed on the enterprise edition page.
