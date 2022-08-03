---
title: DeepFlow Editions
permalink: /about/editions
---

<mark>Attention: This page is translated by Google. Your contributions are welcome!</mark>

# Community Edition

DeepFlow Community Edition is an open source version of a highly automated observability data platform. Its core is licensed under the Apache 2.0 license, and the front-end pages are completely based on Grafana and therefore under the AGPL license. It has all the features needed to efficiently build observability, including:

- AutoMetrics: Based on eBPF/BPF, automatic collection of application and network full-stack performance metrics
- AutoTracing: Based on eBPF/BPF, automatically trace the distributed call chain of microservices
- AutoLogging: Based on eBPF/BPF, automatically collect access logs of applications such as HTTP/MySQL/Redis
- Integration: Integrate indicator data such as Prometheus/Telegraf to solve the problem of data islands and high cardinality
- Integration: Integrate tracking data such as OpenTelemetry/SkyWalking to achieve distributed tracking without blind spots
- Integration: Integrate external log data sources such as Fluentd to solve the problem of high resource consumption of log storage
- AutoTagging: Supports synchronizing public cloud resource tags and automatically injects all observation data
- AutoTagging: Supports synchronization of container resource labels and custom Labels, and automatically injects all observation data
- AutoTagging: supports SmartEncoding for high-performance data tag storage
- Support for displaying metrics, tracking, log data using Grafana
- Support unified monitoring of multiple K8s clusters and non-container servers
- Collection Agent supports running in K8s node and Linux Host environment
- Support deployment under X86, ARM architecture

# Enterprise Edition

DeepFlow Enterprise Edition is a highly automated one-stop observability platform with self-developed GUI pages, complete data analysis and enhanced data governance capabilities. In addition to all the features of the community edition, it has the following features:

- AutoMetrics: support zero intrusion to collect data of all virtual machines and pods on the entire KVM/HyperV/ESXi host
- AutoMetrics: Supports data collection of proprietary cloud NFV gateways
- AutoMetrics: Supports the collection of traffic, NetFlow, and sFlow data from physical network devices
- AutoTracing: In addition to processes, pods, and virtual machines, it supports distributed call chain tracing covering host, NFV gateway, and physical firewall load balancing
- AutoTracing: In addition to pods and virtual machines, it supports full-stack intelligent NAT tracing covering hosts, NFV gateways, and physical firewall load balancing
- AutoLogging: Support the storage of original packet headers on the entire network, and support query associated with flow logs, and display the TCP communication sequence diagram
- AutoTagging: In-depth adaptation to proprietary cloud products, including mainstream cloud platforms such as Alibaba, Tencent, and Huawei
- Support on-demand configuration of traffic filtering policies, distribution and storage of original traffic
- Support serverless multi-tenant container environment
- Support for secure sandbox (runv) container environments such as Kata
- Collection Agent supports running in DPDK environment
- Collection Agent supports running in Windows Host environment
- Supports associated query and automatic jump of indicators, tracking, and log data
- Support one-stop multi-team collaboration functions such as alarms, reports, and SLO
- Supports providing services for multi-tenancy and data permission isolation
- Supports unified monitoring of proprietary cloud, public cloud, and container resources in multiple regions
