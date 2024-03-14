---
title: Advanced Configuration of Agent
permalink: /best-practice/agent-advanced-config/
---

> This document was translated by GPT-4

# Introduction

Advanced configuration of DeepFlow Agent.

DeepFlow uses a declarative API to control all deepflow-agents, and almost all of the deepflow-agent configuration is issued through the deepflow-server. In DeepFlow, the agent-group is a group that manages a set of deepflow-agent configurations. We can specify `vtap-group-id-request` in the local configuration file of deepflow-agent (K8s ConfigMap, deepflow-agent.yaml on the Host) to declare the group we want to join, or we can directly configure the group to which each deepflow-agent belongs on the deepflow-server (the latter has a higher priority). The agent-group-config and the agent-group correspond one-to-one and are associated through the agent-group ID.

## Common operations of agent-group

View the agent-group list:

```bash
deepflow-ctl agent-group list
```

Create an agent-group:

```bash
deepflow-ctl agent-group create your-agent-group
```

Get the ID of the agent-group just created:

```bash
deepflow-ctl agent-group list your-agent-group
```

## Common operations of agent-group-config

Refer to the agent's default configuration above, select the part you want to modify, create a `your-agent-group-config.yaml` file and fill in the agent configuration parameters. Note that it must include `vtap_group_id`:

```yaml
vtap_group_id: <Your-agent-group-ID>
# write configurations here
```

### Create agent-group-config

```bash
deepflow-ctl agent-group-config create -f your-agent-group-config.yaml
```

### Get agent-group-config list

```bash
deepflow-ctl agent-group-config list
```

### Get agent-group-config configuration

```bash
deepflow-ctl agent-group-config list <Your-agent-group-ID> -o yaml
```

### Get all configurations and their default values of agent-group-config

```bash
deepflow-ctl agent-group-config example
```

### Update agent-group-config configuration

```bash
deepflow-ctl agent-group-config update -f your-agent-group-config.yaml
```

## Common Configuration Items

- `max_memory`: The maximum memory limit of the agent, the default value is `768`, in MB.
- `thread_threshold`: The maximum number of threads for the agent, the default value is `500`.
- `tap_interface_regex`: The agent collects the regular configuration of the network card, the default value is `^(tap.*|cali.*|veth.*|eth.*|en[ospx].*|lxc.*|lo)$`, the agent only needs to collect the Pod network card and the Node/Host physical network card.
- `platform_enabled`: Used when the agent reports resources, for the domain of `agent-sync`, a DeepFlow platform can only have one domain of `agent-sync`.
