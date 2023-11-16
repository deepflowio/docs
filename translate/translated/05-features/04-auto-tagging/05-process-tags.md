---
title: Optional Process Information Tags
permalink: /features/auto-tagging/process-tags
---

> This document was translated by GPT-4

# Injecting Process Information Tags

By default, the finest granularity of the auto_instance tags in all observation data collected by DeepFlow is the resources such as container Pod or cloud server to which the IP address belongs. When you want to inject process granularity tag information into the data, you need to turn on the process information synchronization function of the Agent.

This feature is generally used in scenarios where the Agent runs on a cloud server (rather than a K8s Node).

# All Configuration Item's Yaml Documentation

Specifically, it involves the following agent group config ([refer to the latest Yaml document on GitHub](https://github.com/deepflowio/deepflow/blob/main/server/controller/model/agent_group_config_example.yaml)):

```yaml
static_config:
  ####################
  # Proc Monitoring ##
  ####################
  # whether to sync os socket and proc info
  # Default: false
  # Note: only make sense when agent type is one of CHOST_VM, CHOST_BM, K8S_VM, K8S_BM
  os-proc-sync-enabled: false

  # To sync tagged processed only
  # Default: false
  os-proc-sync-tagged-only: false

  # The proc fs mount path
  # Default: /proc
  os-proc-root: /proc

  # Socket scan and sync interval
  # Default: 10
  # Note: Note that the value unit is second.
  os-proc-socket-sync-interval: 10

  # Socket and Process uptime threshold
  # Default: 3
  # Note: Note that the value unit is second.
  os-proc-socket-min-lifetime: 3

  # The command execute and read the yaml from stdout
  # Default: []
  # Note: Execute the command every time when scan the process, expect get the process tag from stdout in yaml format,
  # the example yaml format as follow:
  #  - pid: 1
  #    tags:
  #    - key: xxx
  #      value: xxx
  #  - pid: 2
  #    tags:
  #    - key: xxx
  #      value: xxx
  os-app-tag-exec: ['cat', '/tmp/tag.yaml']

  # The user who should execute the `os-app-tag-exec` command
  # Default: deepflow
  os-app-tag-exec-user: deepflow

  # the regular expression use for match process and replace the process name
  # Note: will traverse over the entire array, so the previous ones will be matched first.
  #   when match-type is parent_process_name, will recursive to match parent proc name, and rewrite-name field will ignore.
  #   rewrite-name can replace by regexp capture group and windows style environment variable, for example:
  #   `$1-py-script-%HOSTNAME%` will replace regexp capture group 1 and HOSTNAME env var.
  #   if proc not match any regexp will be accepted (essentially will auto append '- match-regex: .*' at the end).
  #
  # Example:
  #   os-proc-regex:
  #     - match-regex: python3 (.*)\.py
  #       match-type: cmdline
  #       action: accept
  #       rewrite-name: $1-py-script
  #     - match-regex: (?P<PROC_NAME>nginx)
  #       match-type: process_name
  #       rewrite-name: ${PROC_NAME}-%HOSTNAME%
  #     - match-regex: "nginx"
  #       match-type: parent_process_name
  #       action: accept
  #     - match-regex: .*sleep.*
  #       match-type: process_name
  #       action: drop
  #     - match-regex: .+ # match after concatenating a tag key and value pair using colon, i.e., an regex `app:.+` can match all processes has a `app` tag
  #       match-type: tag
  #       action: accept
  os-proc-regex:
    # The regexp use for match the process
    # Default: .*
    - match-regex:

      # Regexp match field
      # Default: process_name
      # Note: Options: process_name, cmdline, parent_process_name.
      match-type:

      # Action when RegExp match
      # Default: accept
      # Note: Options: accept, drop.
      action:

      # The name will replace the process name or cmd use regexp replace
      # Default: ""
      # Note: null string will not replace.
      rewrite-name:
```

# Configuration Item Explanation

Let's explain each configuration item one by one. First, there are some basic settings:

- `os-proc-sync-enabled`: Whether to enable this feature, default is false
- `os-proc-root`: The mount location of the /proc folder, default is /proc, which usually does not need to be modified
- `os-proc-socket-sync-interval`: The interval for scanning process Socket information, default is 10s, the lower the configuration, the higher the real-time synchronization, but the greater the pressure on the deepflow-server
- `os-proc-socket-min-lifetime`: Only synchronize the process and Socket information whose life cycle is above this threshold, the default is 3s, the lower the configuration, the higher the real-time synchronization, but the greater the pressure on the deepflow-server

The main configurations that need to be modified are:

- `os-proc-regex`: After obtaining the list of all processes on the machine, perform all matching actions one by one for each process until the first `match-regex` is met to decide how to handle this process
  - `match-regex`: Use this regular expression to match the process_name, cmdline, or parent_process_name of the process, and only the hit process performs the action corresponding to `action`. The default value `.*` means to match any process
  - `match-type`: The type of information matched by the regular expression, the default value process_name means process name, the configuration for cmdline means the entire command line of the process, parent_process_name means parent process name
  - `action`: The action performed by the process hit by the regular expression, the default value accept means synchronization, configuration for drop means ignore
  - `rewrite-name`: Replace the matched process name with this name

More advanced configurations, used to associate the process with the business tag information in CMDB. Currently, DeepFlow Agent supports executing a script to get the tag information corresponding to the PID on the machine:

- `os-proc-sync-tagged-only`: Whether to only synchronize the information of the process with labels, the default is false. This configuration item can easily filter out uninteresting processes
- `os-app-tag-exec`: The command line of the script to get process tags. For the usage, please refer to the yaml comment
- `os-app-tag-exec-user`: The Linux user used when executing the command line in `os-app-tag-exec`, it is recommended to use a command line executed by a user with limited permissions, for safety, the default value is deepflow (not root)

# Typical Configuration Examples

There are also some configuration examples in the Yaml comments, and here are some more explanations:

```yaml
static_config:
  os-proc-sync-enabled: true # Enable the feature
  os-proc-regex: # Each process sequentially matches the following four rules
    - match-regex: '^(sleep|bash|sh|ssh|top|ps)$' # Filter out some generally uninteresting, non-business processes
      action: drop
    - match-regex: python3 (.*)\.py # Match the process with cmdline conforming to python3 xxxx.py, and put xxxx into the first matching group of the regular expression. The matching group can be referenced in rewrite-name by $1.
      match-type: cmdline
      action: accept
      rewrite-name: $1-py-script
    - match-regex: nginx # Match the process whose parent process name is nginx. Generally, nginx has one master process and multiple worker subprocesses, and the business is mainly concerned with worker subprocesses
      match-type: parent_process_name
      action: accept
    - match-regex: .* # If this item is not added, all other processes will be accepted
      action: drop
```

Some useful suggestions:

- Add the `.*` + `drop` configuration at the end of the `os-proc-regex` rule to avoid synchronizing uninterested processes and reduce the amount of data synchronized
- Python and Java processes generally need to be matched through cmdline, mainly because their process_name is only Java or Python, which has no distinction. At this time, remember to use `rewrite-name` to rewrite the name, otherwise, the complete cmdline will be used as the name and synchronized to the deepflow-server
- If the CD (continuous deployment) system has a process that is responsible for deploying business processes on the cloud host, then you can quickly match all processes deployed by CD by matching parent_process_name and streamline deployment

# Effects After Configuration

DeepFlow will inject the gprocess tag into all data, representing the name of the process (after `rewrite-name` processing). And the auto_instance tag will also automatically match the gprocess corresponding to the Socket that generated the data. In addition, when os-app-tag-exec is configured, all business tags of the process will also be automatically injected into the data in the format of os.app.xxx tags. Thanks to the existence of DeepFlow Server, we can see the access information between two processes in the universal service map, whether these two processes are on one or two cloud servers. Enjoy!

# Limitations

The method mentioned here is suitable for synchronizing `process information that communicates using long connections`. In the short connection scenario, the Socket information changes momentarily, and it may already be closed when it is synchronized to the DeepFlow Server, and the process information identification across hosts cannot be realized.

In fact, this limitation is not unsolvable. DeepFlow has innovatively proposed the [TOT (TCP Option Tracing)](https://github.com/deepflowio/tcp-option-tracing) method for injecting TCP Option information. We can use eBPF in an environment with kernel 5.10+ (or Kernel Module in an environment with kernel 3.10+) to automatically inject process identifiers into the TCP Option Header, achieving higher performance, without any short connection omission process label synchronization and annotation capabilities. Currently, we have only completed the development of TOT side injection into TCP Option, and the work of injecting process tags into all observation signals using TCP Option on the side of DeepFlow Agent is still in planning. Please stay tuned!
