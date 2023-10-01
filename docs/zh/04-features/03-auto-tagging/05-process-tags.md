---
title: 进程信息标签
permalink: /features/auto-tagging/process-tags
---

# 注入进程信息标签

默认情况下，DeepFlow 采集的所有观测数据中，auto\_instance 标签的最细粒度为 IP 地址所属的容器 Pod 或云服务器等资源。当希望为数据注入进程粒度的标签信息时，需要开启 Agent 的进程信息同步功能。

# 所有配置项的 Yaml 文档

具体来讲涉及到如下 agent group config（[最新的 Yaml 文档参考 GitHub](https://github.com/deepflowio/deepflow/blob/main/server/controller/model/agent_group_config_example.yaml)）：
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
  os-app-tag-exec: ["cat", "/tmp/tag.yaml"]

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

# 配置项说明

下面我们对上述配置进行逐个的解释。首先是一些基础配置：
- `os-proc-sync-enabled`：是否开启此功能，默认为 false
- `os-proc-root`：/proc 文件夹的 mount 位置，默认为 /proc，一般不用修改
- `os-proc-socket-sync-interval`：扫描进程 Socket 信息的间隔，默认为 10s，配置越低同步的实时性越高，但对 deepflow-server 的压力越大
- `os-proc-socket-min-lifetime`：仅同步存活周期在此阈值之上的进程及 Socket 信息，默认为 3s，配置越低同步的实时性越高，但对 deepflow-server 的压力越大

主要需要修改的配置：
- `os-proc-regex`：获取到本机所有进程的列表之后，对每一个进程依次执行所有的匹配动作，直到满足第一个 `match-regex` 为止来决定对此进程的处理
  - `match-regex`：使用该正则表达式匹配进程的 process\_name、cmdline 或 parent\_process\_name，仅命中的进程执行 `action` 对应的动作，默认值 `.*` 表示匹配任意进程
  - `match-type`: 正则表达式匹配的信息类型，默认值 process\_name 表示进程名，配置为 cmdline 表示进程的完整命令行、parent\_process\_name 表示父进程名
  - `action`：正则表达式命中的进程所执行的动作，默认值 accept 表示同步，配置为 drop 表示忽略
  - `rewrite-name`：将匹配的进程名替换为此名字

更高级的配置，用于将进程与 CMDB 中的业务标签信息关联。目前 DeepFlow Agent 支持执行一个脚本获取本机上的 PID 对应的标签信息：
- `os-proc-sync-tagged-only`：是否仅同步具有标签的进程的信息，默认为 false，此配置项可以方便的将不感兴趣的进程过滤掉
- `os-app-tag-exec`：获取进程标签的脚本命令行，使用方法详见 yaml 注释
- `os-app-tag-exec-user`：执行 `os-app-tag-exec` 中的命令行时使用的 Linux 用户，建议使用一个权限受限的用户执行命令行，为了安全起见默认值为 deepflow（而非 root）

# 典型配置例

Yaml 注释中也有一些配置举例，下面增加一些更多的说明：
```yaml
static_config:
  os-proc-sync-enabled: true  # 开启功能
  os-proc-regex:  # 每个进程依次匹配如下四个规则
  - match-regex: "^(sleep|bash|sh|ssh|top|ps)$"  # 过滤一些通常不关心的、非业务进程
    action: drop
  - match-regex: python3 (.*)\.py  # 匹配 cmdline 符合 python3 xxxx.py 的进程，并将 xxxx 放到正则表达式的第一个匹配组中，在 rewrite-name 中可使用 $1 引用这个匹配组
    match-type: cmdline
    action: accept
    rewrite-name: $1-py-script
  - match-regex: nginx  # 匹配父进程名为 nginx 的进程。通常 nginx 有一个 master 进程和多个 worker 子进程，一般业务上主要关心 worker 子进程
    match-type: parent_process_name
    action: accept
  - match-regex: .*  # 如果不加此项，所有其他进程都会被 accept
    action: drop
```

一些有用的建议：
- `os-proc-regex` 规则末尾增加 `.*` + `drop` 的配置，以避免同步不关心的进程，减少同步的数据量
- python 和 java 进程一般需要通过 cmdline 来匹配，主要是因为他们的 process\_name 仅仅为 java 或 python，没有区分度，此时记得使用 `rewrite-name` 重写名字，否则会将完整的 cmdline 作为名称同步给 deepflow-server
- 如果 CD（持续部署）系统在云主机上有一个统一负责部署业务进程的进程，那么可以通过匹配 parent\_process\_name 快速匹配 CD 部署的所有进程，精简部署

# 配置后的效果

DeepFlow 将为所有数据注入 gprocess 的标签，表示进程（经过 `rewrite-name` 处理后）的名称。且 auto\_instance 标签也会自动匹配到产生该条数据的 Socket 对应的 gprocess。除此之外，当配置了 os-app-tag-exec 时，进程的所有业务标签也会以 os.app.xxx 的标签字段自动注入到数据中。由于 DeepFlow Server 的存在，我们能在全景服务拓扑中查看到两个进程之间的访问信息，无论这两个进程实在一个或两个云主机上。Enjoy！

# 限制说明

这里提到的方法适合于同步`使用长连接通信的进程`信息，由于短连接场景下 Socket 信息瞬息万变，可能还没等到同步至 DeepFlow Server 时 Socket 就已经关闭了，无法实现跨主机的进程信息标识。

实际上这个限制并不是无解的，DeepFlow 创新的提出了 [TOT (TCP Option Tracing)](https://github.com/deepflowio/tcp-option-tracing) 的 TCP Option 信息注入方法。我们可以在内核 5.10+ 的环境中利用 eBPF（或者在内核 3.10+ 的环境中利用 Kernel Module）自动向 TCP Option Header 中注入进程标识，实现更高性能的、无任何短连接遗漏的进程标签同步及标注能力。目前这项能力我们仅完成了 TOT 侧注入 TCP Option 的开发，DeepFlow Agent 侧利用 TCP Option 向所有观测信号中注入进程标签的工作还在规划中，敬请期待！
