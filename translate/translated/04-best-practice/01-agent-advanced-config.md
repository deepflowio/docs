---
title: Agent Advanced Configuration
permalink: /best-practice/agent-advanced-config/
---

> This document was translated by ChatGPT

# Introduction

DeepFlow Agent advanced configuration.

DeepFlow uses a declarative API to centrally manage all agents, while the data collection configuration of agents is uniformly distributed by the deepflow-server to the agents within the corresponding agent-group based on the agent-group-config content.

An agent-group is used to manage the configuration of a group of agents. By specifying `vtap-group-id-request` in the agent [configuration file](https://github.com/deepflowio/deepflow/blob/main/agent/config/deepflow-agent.yaml) (K8s ConfigMap or `/etc/deepflow-agent.yaml`), you can declare the agent-group it belongs to (if not specified, the [Default](../configuration/agent/) configuration is used by default). Finally, the association between agent, agent-group, and agent-group-config is established through the agent-group-id.

## Common Operations for agent-group

View the agent-group list:

```bash
deepflow-ctl agent-group list
```

Create an agent-group:

```bash
deepflow-ctl agent-group create <AGENT_GROUP_NAME>
```

View the created agent-group-id:

```bash
deepflow-ctl agent-group list <AGENT_GROUP_NAME>
```

## Common Operations for agent-group-config

Refer to the [default configuration](../configuration/agent/) of agent-group-config, extract the parts that need to be modified, and output them to the `<AGENT_GROUP_CONFIG>.yaml` file, for example:

```yaml
global:
  limits:
    max_millicpus: 2000
    max_memory: 4096
```

### Create an agent-group-config

```bash
deepflow-ctl agent-group-config create <AGENT_GROUP_ID> -f <AGENT_GROUP_CONFIG>.yaml
```

### View the agent-group-config list

```bash
deepflow-ctl agent-group-config list
```

### View the configuration of a specified agent-group-config

```bash
deepflow-ctl agent-group-config list <AGENT_GROUP_ID> -o yaml
```

### View all default configurations of agent-group-config

```bash
deepflow-ctl agent-group-config example
```

### Update the agent-group-config configuration

```bash
deepflow-ctl agent-group-config update <AGENT_GROUP_ID> -f <AGENT_GROUP_CONFIG>.yaml
```

## Description of Each Configuration Item

For details, please refer to the [Configuration Manual](../configuration/agent/), where each parameter is explained in detail with usage examples.