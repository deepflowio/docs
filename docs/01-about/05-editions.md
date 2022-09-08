---
title: DeepFlow Editions
permalink: /about/editions
---

<mark>Attention: This page is translated by Google. Your contributions are welcome!</mark>

# Community Edition

DeepFlow Community Edition is an open source version of a highly automated observability data platform. Its core is licensed under the Apache 2.0 license, and the front-end pages are completely based on Grafana and therefore under the AGPL license. It has all the features needed to efficiently build observability, including:

- AutoMetrics: Based on eBPF/BPF, automatic collection of application and network full-stack performance metrics
- AutoTracing: Based on eBPF/BPF, automatically trace the distributed call chain of microservices
- AutoLogging: Based on eBPF/BPF, automatically collect TCP/UDP flow log
- AutoLogging: Based on eBPF/BPF, automatically collect access logs of applications such as HTTP1/2/S, Dubbo, MySQL, Redis, Kafka, MQTT, DNS
- Integration: Integrate indicator data such as Prometheus/Telegraf to solve the problem of data islands and high cardinality
- Integration: Integrate tracking data such as OpenTelemetry/SkyWalking to achieve distributed tracking without blind spots
- Integration: Integrate external log data sources such as Fluentd to solve the problem of high resource consumption of log storage
- AutoTagging: Supports synchronizing public cloud resource tags and automatically injects all observation data
- AutoTagging: Supports synchronization of container resource labels and custom Labels, and automatically injects all observation data
- AutoTagging: supports SmartEncoding for high-performance data tag storage
- Support for displaying metrics, tracking, log data using Grafana
- Support unified monitoring of multiple K8s clusters and non-container servers
- Agent supports running in K8s node and Linux Host environment
- Support deployment under X86, ARM architecture

# Enterprise Edition

DeepFlow Enterprise Edition is a highly automated one-stop observability platform with enterprise-level visualization and management interfaces, complete data analysis and enhanced data governance capabilities. In addition to all the features of the community edition, it has the following features:

- Supports AutoMetrics, AutoTracing, AutoLogging in serverless multi-tenant network isolated container environment
- Supports AutoMetrics, AutoTracing, AutoLogging in a secure sandbox (runv) container environment such as Kata
- Supports AutoMetrics, AutoTracing, AutoLogging under Windows server, KVM host, HyperV host, ESXi host, Xen host environment
- AutoMetrics and AutoLogging: support zero intrusion to collect data of all virtual machines and pods on the entire KVM host, including the environment using the DPDK data plane
- AutoMetrics and AutoLogging: Supports data collection of proprietary cloud NFV Layer 4 and 7 gateways, including environments that use DPDK data planes
- AutoMetrics and AutoLogging: Support to collect Packet, NetFlow, sFlow of physical network devices and generate metric data
- AutoTracing: In addition to processes, pods, and virtual machines, it supports distributed call chain tracing covering host, NFV gateway, and physical firewall load balancing
- AutoTracing: In addition to pods and virtual machines, it supports full-stack intelligent NAT tracing covering hosts, NFV gateways, and physical firewall load balancing
- AutoLogging: Supports high-performance network-wide packet header storage capability, supports query associated with flow logs, and displays the packet-by-packet sequence diagram of TCP communication
- AutoLogging: Supports configuring traffic filtering policies on demand, and stores raw traffic for retrospective forensics
- AutoTagging: In-depth adaptation to proprietary cloud products, including mainstream cloud platforms such as Alibaba, Tencent, and Huawei
- Support on-demand configuration of traffic filtering policies to distribute traffic to security, network, auditing and other traffic consumption tools
- Supports associated query and automatic jump of indicators, tracking, and log data
- Support one-stop multi-team collaboration functions such as alarms, reports, and SLO
- Supports providing services for multi-tenancy and data permission isolation
- Support encrypted data transmission between Agent and Server
- Supports unified monitoring of proprietary cloud, public cloud, and container resources in multiple regions
- Provide complete cloud-native observability construction solutions for industries such as finance, energy, operators (IT, 5GC), and Internet of Vehicles
- Provide enterprise-level after-sales support services, including troubleshooting, performance tuning, version upgrades, implementation of best practices for observability, etc.

# Cloud Edition

DeepFlow Cloud Edition is a fully managed one-stop observability platform,
It has the same functionality as the enterprise version and is currently in beta trial phase.
