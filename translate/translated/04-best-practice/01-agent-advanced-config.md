---
title: Agent Advanced Configuration
permalink: /best-practice/agent-advanced-config/
---

> This document was translated by ChatGPT

# Introduction

Advanced configuration for DeepFlow Agent.

DeepFlow uses declarative APIs to control all deepflow-agents. Almost all deepflow-agent configurations are delivered through deepflow-server. In DeepFlow, an agent-group manages a set of deepflow-agent configurations. We can specify the `vtap-group-id-request` in the local configuration file of deepflow-agent (K8s ConfigMap, deepflow-agent.yaml on Host) to declare the desired group, or directly configure the group of each deepflow-agent on the deepflow-server (the latter has a higher priority). The agent-group-config corresponds one-to-one with the agent-group and is associated through the agent-group ID.

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

Refer to the default agent configuration above, extract the parts you want to modify, create a `your-agent-group-config.yaml` file, and fill in the agent configuration parameters. Make sure to include `vtap_group_id`:

```yaml
vtap_group_id: <Your-agent-group-ID>
# write configurations here
```

### Create an agent-group-config

```bash
deepflow-ctl agent-group-config create -f your-agent-group-config.yaml
```

### Get the list of agent-group-config

```bash
deepflow-ctl agent-group-config list
```

### Get the agent-group-config configuration

```bash
deepflow-ctl agent-group-config list <Your-agent-group-ID> -o yaml
```

### Get all configurations and their default values for agent-group-config

```bash
deepflow-ctl agent-group-config example
```

### Update the agent-group-config configuration

```bash
deepflow-ctl agent-group-config update -f your-agent-group-config.yaml
```

## Common Configuration Items

- `max_memory`: Maximum memory limit for the agent, default value is `768` MB.
- `thread_threshold`: Maximum number of threads for the agent, default value is `500`.
- `tap_interface_regex`: Regular expression configuration for the agent's capture network interfaces, default value is `^(tap.*|cali.*|veth.*|eth.*|en[ospx].*|lxc.*|lo)$`. The agent only needs to capture Pod network interfaces and Node/Host physical network interfaces.
- `platform_enabled`: Used when the agent reports resources, for the `agent-sync` domain. Only one `agent-sync` domain is allowed per DeepFlow platform.
