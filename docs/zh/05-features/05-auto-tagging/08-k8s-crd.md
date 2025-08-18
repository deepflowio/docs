---
title: K8s 自定义资源标签
permalink: /features/auto-tagging/k8s-crd
---

# 常见的特殊 K8s 资源或 CRD

当发现未同步的（找不到工作负载的）容器 Pod 时，
- 如果 Pod 的`metadata.ownerReferences[].apiVersion = apps.kruise.io/v1beta1`，那么对应的 K8s 平台应该是 OpenKruise
- 如果 Pod 的`metadata.ownerReferences[].apiVersion = opengauss.sig/v1`，那么对应的 K8s 平台应该是 OpenGauss

这类场景需要进行以下操作：

- Agent 配置中打开和关闭对应的资源
- 在 Agent 部署集群中配置 Kubernetes API 权限

## OpenShift

该场景需要关闭默认的 `Ingress` 资源获取，打开 `Route` 资源获取。

- [Route](https://docs.redhat.com/en/documentation/openshift_container_platform/4.14/html/network_apis/route-route-openshift-io-v1)

  ```yaml
  apiVersion: route.openshift.io/v1
  kind: Route
  ```

修改 Agent 配置如下：

```yaml
inputs:
  resources:
    kubernetes:
      api_resources:
      - name: ingresses
        disabled: true
      - name: routes
```

在 Agent 所在容器集群中修改 Agent 的 ClusterRole 配置，增加如下规则：

```yaml
rules:
  - apiGroups:
      - route.openshift.io
    resources:
      - routes
    verbs:
      - get
      - list
      - watch
```

## OpenKruise

该场景下需要从 API 获取 `CloneSet` 和 `Advanced StatefulSet` 资源。

- [CloneSet](https://openkruise.io/docs/user-manuals/cloneset/)

  ```yaml
  apiVersion: apps.kruise.io/v1alpha1
  kind: CloneSet
  ```

- [Advanced StatefulSet](https://openkruise.io/docs/user-manuals/advancedstatefulset/)

  ```yaml
  apiVersion: apps.kruise.io/v1beta1
  kind: StatefulSet
  ```

修改 Agent 配置如下：

```yaml
inputs:
  resources:
    kubernetes:
      api_resources:
      - name: clonesets
        group: apps.kruise.io
      - name: statefulsets
        group: apps
      - name: statefulsets
        group: apps.kruise.io
```

::: tip
由于 `statefulsets` 在 `apps` 和 `apps.kruise.io` 组中重名，如果需要同时获取 Kubernetes 的 `StatefulSet`，这里除配置 `group=apps.kruise.io, name=statefulsets` 资源同步外，需要同时开启 `group=apps, name=statefulsets` 的资源同步。
:::

在 Agent 所在容器集群中修改 Agent 的 ClusterRole 配置，增加如下规则：

```yaml
- apiGroups:
    - apps.kruise.io
  resources:
    - clonesets
    - statefulsets
  verbs:
    - get
    - list
    - watch
```

## OpenGauss

该场景下需要从 API 获取 `OpenGaussCluster` 资源。

- [OpenGaussCluster](https://github.com/opengauss-mirror/openGauss-operator)

修改 Agent 配置如下：

```yaml
inputs:
  resources:
    kubernetes:
      api_resources:
      - name: opengaussclusters
```

在 Agent 所在容器集群中修改 Agent 的 ClusterRole 配置，增加如下规则：

```yaml
- apiGroups:
    - opengauss.sig
  resources:
    - opengaussclusters
  verbs:
    - get
    - list
    - watch
```

# 其他 K8s 自定义资源
## 关于 Server 端 Lua 插件

由于一些用户的 Kubernetes 环境可能具有特殊的配置或安全要求，使得标准化的提取工作负载类型和工作负载名称的方式无法按预期工作，或者用户可能希望根据自己的逻辑来定制工作负载类型和工作负载名称。基此，DeepFlow 支持用户通过添加自定义的 lua 插件提取工作负载类型和工作负载名称。Lua 插件系统通过在固定的地方调用 Lua Function 获取一些用户自定义的工作负载类型和名称，提高 K8s 资源对接的灵活性与普适性。

## lua 插件编写示例

```lua
-- 固定写法，以导入 json 解析的包
package.path = package.path..";/bin/?.lua"
local dkjson = require("dkjson")

-- 函数名以及参数固定
function GetWorkloadTypeAndName(metaJsonStr)
    -- 元数据的 JSON 示例
    -- 注意这一行的冒号后即传入的 JSON "metadata": {
    --    "annotations": {
    --        "checksum/config": "",
    --        "cni.projectcalico.org/containerID": "",
    --        "cni.projectcalico.org/podIP": "",
    --        "cni.projectcalico.org/podIPs": ""
    --    },
    --    "creationTimestamp": "",
    --    "labels": {
    --        "app": "",
    --        "component": "",
    --        "controller-revision-hash": "",
    --        "pod-template-generation": ""
    --    },
    --    "name": "",
    --    "namespace": "",
    --    "ownerReferences": [
    --        {
    --            "apiVersion": "",
    --            "blockOwnerDeletion": true,
    --            "controller": true,
    --            "kind": "",
    --            "name": "",
    --            "uid": ""
    --        }
    --    ],
    --    "uid": ""
    -- }
    -- 固定写法，将传入的包含 pod 元数据的 JSON 字符串转换为 Lua 的 table 类型
    local metaData = dkjson.decode(metaJsonStr,1,nil)
    local workloadType = ""
    local workloadName = ""
    -- 注意，为了自定义的灵活性 每个 pod 元数据的 JSON 字符串都会传给 lua 脚本，您需要过滤掉不需要自定义的 pod
    -- 符合过滤条件的，返回两个空字符串即可
    if condition then -- 这里的 condition 是你需要过滤 pod 的条件
        return "", "" -- 返回两个空字符串
    end
    -- 通过对 meteData 自定义分析， 返回 workloadType 和 workloadName
    return workloadType, workloadName

end
```

## 上传插件

Lua 插件支持运行时的加载，在 DeepFlow 的运行环境中使用 deepflow-ctl 工具上传插件后就可自动加载，在环境中执行以下命令：

```sh
# 将 /home/tom/hello.lua 替换为您的 lua 插件所在的路径  hello 替换为您想要给插件起的名字即可
deepflow-ctl plugin create --type lua --image /home/tom/hello.lua --name hello --user server
```

DeepFlow 支持同时加载多个 lua 插件，如果您想用不同的插件对不同的 Pod 起作用，注意写好过滤规则即可，您可以通过以下命令查看您已加载的插件名称：

```sh
deepflow-ctl plugin list
```

您可以通过插件名称删除掉某个插件，命令如下：

```sh
deepflow-ctl plugin delete <name>
```

## 示例

例如现在 k8s 环境中某个 Pod 的元数据如下：

```json
"metadata": {
        "annotations": {},
        "creationTimestamp": "2024-08-07T02:08:14Z",
        "labels": {},
        "name": "",
        "namespace": "",
        "ownerReferences": [
            {
                "apiVersion": "",
                "blockOwnerDeletion": true,
                "controller": true,
                "kind": "OpenGaussCluster",
                "name": "ogtest",
                "uid": ""
            }
        ],
        "resourceVersion": "",
        "uid": ""
    }
```

按标准化的方式无法提取到工作负载类型和工作负载名称，因为数据的 kind 是 `OpenGaussCluster`，不是 DeepFlow 支持的类型， 当前版本支持的工作负载类型有：Deployment/StatefulSet/DaemonSet/CloneSet，可以编写以下 lua 脚本将工作负载类型转为 DeepFlow 支持的类型：

```lua
package.path = package.path..";/bin/?.lua"
local dkjson = require("dkjson")

function GetWorkloadTypeAndName(metaJsonStr)
    local metaData = dkjson.decode(metaJsonStr,1,nil)
    local ownerReferencesData = metaData["ownerReferences"] or {}
    local meteTable  = ownerReferencesData[1] or {}
    local workloadType = ""
    local workloadName = ""
    -- 获取 workloadType，并确保它是字符串类型
    workloadType = tostring(meteTable["kind"] or "")
    -- 如果我们只想对 workloadType = "OpenGaussCluster" 的进行处理，可以在这里过滤掉其他 Pod 的元数据
    if workloadType ~= "OpenGaussCluster" then
        -- 过滤掉的直接返回空字符串
        return "", ""
    else
        -- 对特殊 Pod 进行处理，使它返回的工作负载类型是我们支持的类型
        workloadType = "StatefulSet"
    end
    -- 获取 workloadName，并确保它是字符串类型
    -- 这里 Pod 中有 ownerReferences 数据，ownerReferences 中的 name 即 workloadName
    -- 如果 Pod 中没有 ownerReferences 数据，可以根据 pod name 计算出 workloadName
    local workloadName = tostring(meteTable["name"] or "")
    return workloadType, workloadName
end
```

将此插件上传后，就可以提取到这个 Pod 对应的工作负载类型和工作负载名称。
