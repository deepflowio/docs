---
title: SmartEncoding
permalink: /features/auto-tagging/smart-encoding
---

DeepFlow 为所有观测数据自动注入资源、服务和业务标签。在一个典型的生产环境中，需要为一条数据自动注入的标签数可能多达 100+ 个。这些标签为后端存储带来了很大的压力，DeepFlow 领先的 SmartEncoding 机制创新的解决了此问题，使得性能开销显著降低。

![DeepFlow 中的 SmartEncoding](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202310096523b164952a5.png)

SmartEncoding 依赖于对各类标签数据的编码和关联。首先 Agent 获取到字符串格式的标签并汇总到 Server 上，接下来 Server 会对所有的标签进行编码。在此之后，对观测数据的 SmartEncoding 过程包含三个阶段：
- 采集阶段：Agent 为每一条观测数据自动注入 VPC（Integer）、IP、PID 标签
- 存储阶段：Server 根据 Agent 标记的 VPC、IP、PID 标签，为观测数据自动注入少量的、Int 编码的元标签（Meta Tag），包括 IP 和 PID 所对应的云资源属性、K8s 资源属性、进程属性
- 查询阶段：Server 自动计算所有自定义标签和元标签之间的关联关系，用户可直接通过 SQL/PromQL 在所有观测数据上查询（过滤、分组）所有的标签，使用体验和一个大宽表（BigTable）没有任何差异

我们看到，AutoTagging 解决了数据孤岛的痛点，SmartEncoding 机制解决了资源开销的痛点。从实现机制上我们能看到 DeepFlow 实际上可支持**无限量的自定义标签注入**，因此在使用 DeepFlow 时我们强烈建议：
- 资源开通时，为云资源注入尽量丰富的自定义标签
- 业务上线时，向 K8s 中注入尽量丰富的 Label、Annotation、Env 标签
- 将 CMDB、持续发布系统中的业务标签通过 API 同步至 DeepFlow 中

通过这些方法，我们能够极大的避免在业务代码中手动注入标签的繁琐过程，并且能显著的降低后端存储的压力。

我们对 SmartEncoding 进行的 Benchmark 表明，通过对标签的编码可将元标签（Meta Tag）的写入性能提升 10 倍。我们随机生成了一组长度为 16 个字符的标签，Cardinality 为 5000，基于这样的数据模型对 SmartEncoding、ClickHouse LowCard、无编码 三种方案进行了对比，测试结果如下：

| 类型                  | 标签字段类型    | CPU 用量 | 内存用量 | 磁盘用量 |
| --------------------  | --------------  | -------- | -------- | -------- |
| 基线（SmartEncoding） | Int             | 1        | 1        | 1        |
| 写时编码              | LowCard(string) | 10       | 1        | 1.5      |
| 无编码                | string          | 5        | 1.5      | 7.5      |

而对于所有的自定义标签（K8s 自定义 Lable/Annotation/Env、云资源自定义标签、CMDB 中的业务标签、持续发布系统中的业务标签），我们无需将其随观测数据耦合存储，因此这些海量的自定义标签可认为是零存储开销。此外，由于编码后的数据体系大幅度降低，也能降低数据查询是的磁盘扫描量，提升查询性能。
