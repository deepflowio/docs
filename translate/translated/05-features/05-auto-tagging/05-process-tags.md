---
title: Optional Process Information Tags
permalink: /features/auto-tagging/process-tags
---

> This document was translated by ChatGPT

# Injecting Process Information Tags

By default, the finest granularity of the auto_instance tag in all observability data collected by DeepFlow is the container Pod or cloud server to which the IP address belongs. When you want to inject process-level tag information into the data, you need to enable the process information synchronization feature of the Agent.

This feature is generally used in scenarios where the Agent runs on a cloud server (rather than a K8s Node).

# Yaml Document for All Configuration Items

Specifically, it involves the following agent group config ([latest Yaml document reference on GitHub](https://github.com/deepflowio/deepflow/blob/main/server/agent_config/example.yaml)):

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

Below we explain each of the above configurations one by one. First, some basic configurations:

- `os-proc-sync-enabled`: Whether to enable this feature, default is false
- `os-proc-root`: The mount location of the /proc folder, default is /proc, generally does not need to be modified
- `os-proc-socket-sync-interval`: The interval for scanning process Socket information, default is 10s. The lower the configuration, the higher the real-time synchronization, but the greater the pressure on the deepflow-server
- `os-proc-socket-min-lifetime`: Only synchronize process and Socket information with a lifetime above this threshold, default is 3s. The lower the configuration, the higher the real-time synchronization, but the greater the pressure on the deepflow-server

Main configurations that need to be modified:

- `os-proc-regex`: After obtaining the list of all processes on the machine, perform all matching actions on each process in sequence until the first `match-regex` is satisfied to decide how to handle this process
  - `match-regex`: Use this regular expression to match the process's process_name, cmdline, or parent_process_name. Only the processes that hit will perform the action corresponding to `action`. The default value `.*` means matching any process
  - `match-type`: The type of information matched by the regular expression. The default value process_name means the process name, configured as cmdline means the complete command line of the process, parent_process_name means the parent process name
  - `action`: The action performed by the process that hits the regular expression. The default value accept means synchronization, configured as drop means ignore
  - `rewrite-name`: Replace the matched process name with this name

More advanced configurations are used to associate processes with business tag information in the CMDB. Currently, DeepFlow Agent supports executing a script to obtain the tag information corresponding to the PID on the machine:

- `os-proc-sync-tagged-only`: Whether to synchronize only the information of processes with tags, default is false. This configuration item can conveniently filter out uninteresting processes
- `os-app-tag-exec`: The script command line to obtain process tags. For usage, see the yaml comments
- `os-app-tag-exec-user`: The Linux user used to execute the command line in `os-app-tag-exec`. It is recommended to use a user with limited permissions to execute the command line. For security reasons, the default value is deepflow (rather than root)

# Typical Configuration Example

There are also some configuration examples in the yaml comments. Below are some additional explanations:

```yaml
static_config:
  os-proc-sync-enabled: true # Enable the feature
  os-proc-regex: # Each process sequentially matches the following four rules
    - match-regex: '^(sleep|bash|sh|ssh|top|ps)$' # Filter out some usually uninteresting, non-business processes
      action: drop
    - match-regex: python3 (.*)\.py # Match processes whose cmdline conforms to python3 xxxx.py, and put xxxx into the first matching group of the regular expression. In rewrite-name, you can use $1 to refer to this matching group
      match-type: cmdline
      action: accept
      rewrite-name: $1-py-script
    - match-regex: nginx # Match processes whose parent process name is nginx. Usually, nginx has a master process and multiple worker child processes. Generally, business mainly concerns the worker child processes
      match-type: parent_process_name
      action: accept
    - match-regex: .* # If this item is not added, all other processes will be accepted
      action: drop
```

Some useful suggestions:

- Add the configuration of `.*` + `drop` at the end of the `os-proc-regex` rules to avoid synchronizing uninteresting processes and reduce the amount of synchronized data
- Python and Java processes generally need to be matched through cmdline, mainly because their process_name is only java or python, without distinction. At this time, remember to use `rewrite-name` to rewrite the name, otherwise, the complete cmdline will be synchronized to the deepflow-server as the name
- If the CD (Continuous Deployment) system has a process on the cloud host that is uniformly responsible for deploying business processes, you can quickly match all processes deployed by the CD by matching parent_process_name, simplifying deployment

# Effects After Configuration

DeepFlow will inject the gprocess tag for all data, indicating the name of the process (after `rewrite-name` processing). The auto_instance tag will also automatically match the gprocess corresponding to the Socket that generated the data. In addition, when os-app-tag-exec is configured, all business tags of the process will also be automatically injected into the data as os.app.xxx tag fields. Due to the existence of DeepFlow Server, we can see the access information between two processes in the universal service map, whether these two processes are on one or two cloud hosts. Enjoy!

# Limitation Explanation

The method mentioned here is suitable for synchronizing information of `processes using long connections`. Due to the rapidly changing Socket information in short connection scenarios, the Socket may have been closed before it is synchronized to the DeepFlow Server, making it impossible to identify process information across hosts.

In fact, this limitation is not unsolvable. DeepFlow innovatively proposed the TCP Option information injection method of [TOT (TCP Option Tracing)](https://github.com/deepflowio/tcp-option-tracing). We can use eBPF in the kernel 5.10+ environment (or use Kernel Module in the kernel 3.10+ environment) to automatically inject process identifiers into the TCP Option Header, achieving higher performance and process tag synchronization and annotation capabilities without any short connection omissions. Currently, we have only completed the development of TOT-side injection of TCP Option. The work of using TCP Option to inject process tags into all observability signals on the DeepFlow Agent side is still in planning. Stay tuned!