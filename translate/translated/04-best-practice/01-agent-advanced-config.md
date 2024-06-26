---
title: Agent Advanced Configuration
permalink: /best-practice/agent-advanced-config/
---

> This document was translated by ChatGPT

# Introduction

DeepFlow Agent Advanced Configuration.

DeepFlow uses declarative APIs to control all deepflow-agents, with almost all deepflow-agent configurations being delivered through the deepflow-server. In DeepFlow, an agent-group is a group that manages the configuration of a set of deepflow-agents. We can specify the `vtap-group-id-request` in the local configuration file of the deepflow-agent (K8s ConfigMap, deepflow-agent.yaml on the Host) to declare the desired group to join, or directly configure the group each deepflow-agent belongs to on the deepflow-server (the latter has higher priority). The agent-group-config corresponds one-to-one with the agent-group and is associated through the agent-group ID.

## Common Operations for agent-group

View the list of agent-groups:

```bash
deepflow-ctl agent-group list
```

Create an agent-group:

```bash
deepflow-ctl agent-group create your-agent-group
```

Get the ID of the newly created agent-group:

```bash
deepflow-ctl agent-group list your-agent-group
```

## Common Operations for agent-group-config

Refer to the default agent configuration mentioned above, extract the parts you want to modify, create a `your-agent-group-config.yaml` file, and fill in the agent configuration parameters. Note that `vtap_group_id` must be included:

```yaml
vtap_group_id: <Your-agent-group-ID>
# write configurations here
```

### Create agent-group-config

```bash
deepflow-ctl agent-group-config create -f your-agent-group-config.yaml
```

### Get the list of agent-group-config

```bash
deepflow-ctl agent-group-config list
```

### Get the configuration of agent-group-config

```bash
deepflow-ctl agent-group-config list <Your-agent-group-ID> -o yaml
```

### Get all configurations and their default values of agent-group-config

```bash
deepflow-ctl agent-group-config example
```

### Update the configuration of agent-group-config

```bash
deepflow-ctl agent-group-config update -f your-agent-group-config.yaml
```

## Common Configuration Items

- `max_memory`: Maximum memory limit for the agent, default value is `768` MB.
- `thread_threshold`: Maximum number of threads for the agent, default value is `500`.
- `tap_interface_regex`: Regular expression configuration for the agent's collection network interface, default value is `^(tap.*|cali.*|veth.*|eth.*|en[ospx].*|lxc.*|lo)$`. The agent only needs to collect Pod network interfaces and Node/Host physical network interfaces.
- `platform_enabled`: Used when the agent reports resources, for the domain of `agent-sync`. Only one domain of `agent-sync` is allowed per DeepFlow platform.