---
title: K8s Custom Resource Tagging
permalink: /features/auto-tagging/k8s-crd
---

> This document was translated by ChatGPT

# Common Special K8s Resources or CRDs

When an unsynchronized container Pod (one without a corresponding workload) is detected:

- If the Pod's `metadata.ownerReferences[].apiVersion = apps.kruise.io/v1beta1`, then the corresponding K8s platform should be OpenKruise.
- If the Pod's `metadata.ownerReferences[].apiVersion = opengauss.sig/v1`, then the corresponding K8s platform should be OpenGauss.

In such cases, the following actions are required:

- Enable or disable the corresponding resources in the Agent configuration.
- Configure Kubernetes API permissions in the Agent's deployment cluster.

## OpenShift

In this scenario, you need to disable the default `Ingress` resource retrieval and enable `Route` resource retrieval.

- [Route](https://docs.redhat.com/en/documentation/openshift_container_platform/4.14/html/network_apis/route-route-openshift-io-v1)

  ```yaml
  apiVersion: route.openshift.io/v1
  kind: Route
  ```

Modify the Agent configuration as follows:

```yaml
inputs:
  resources:
    kubernetes:
      api_resources:
        - name: ingresses
          disabled: true
        - name: routes
```

In the container cluster where the Agent is deployed, modify the Agent's ClusterRole configuration to add the following rules:

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

In this scenario, you need to retrieve `CloneSet` and `Advanced StatefulSet` resources from the API.

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

Modify the Agent configuration as follows:

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
Since `statefulsets` has the same name in both the `apps` and `apps.kruise.io` groups, if you need to retrieve Kubernetes `StatefulSet` as well, you must enable resource synchronization for both `group=apps.kruise.io, name=statefulsets` and `group=apps, name=statefulsets`.
:::

In the container cluster where the Agent is deployed, modify the Agent's ClusterRole configuration to add the following rules:

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

In this scenario, you need to retrieve the `OpenGaussCluster` resource from the API.

- [OpenGaussCluster](https://github.com/opengauss-mirror/openGauss-operator)

Modify the Agent configuration as follows:

```yaml
inputs:
  resources:
    kubernetes:
      api_resources:
        - name: opengaussclusters
```

In the container cluster where the Agent is deployed, modify the Agent's ClusterRole configuration to add the following rules:

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

# Other K8s Custom Resources

## About Server-Side Lua Plugins

Some users' Kubernetes environments may have special configurations or security requirements that prevent the standardized extraction of workload type and workload name from working as expected, or users may want to customize workload type and name extraction based on their own logic. To address this, DeepFlow allows users to extract workload type and name by adding custom Lua plugins. The Lua plugin system calls a Lua function at fixed points to obtain user-defined workload types and names, improving the flexibility and universality of K8s resource integration.

## Example of Writing a Lua Plugin

```lua
-- Fixed syntax to import the JSON parsing package
package.path = package.path..";/bin/?.lua"
local dkjson = require("dkjson")

-- Function name and parameters are fixed
function GetWorkloadTypeAndName(metaJsonStr)
    -- Example of metadata JSON
    -- Note: The colon here is followed by the incoming JSON "metadata": {
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
    -- Fixed syntax to convert the incoming JSON string containing pod metadata into a Lua table
    local metaData = dkjson.decode(metaJsonStr,1,nil)
    local workloadType = ""
    local workloadName = ""
    -- For flexibility, each pod's metadata JSON string will be passed to the Lua script, so you need to filter out pods that don't require customization
    -- For those that match the filter condition, return two empty strings
    if condition then -- Replace 'condition' with your pod filtering logic
        return "", "" -- Return two empty strings
    end
    -- Perform custom analysis on metaData and return workloadType and workloadName
    return workloadType, workloadName

end
```

## Uploading the Plugin

Lua plugins support runtime loading. After uploading the plugin using the `deepflow-ctl` tool in the DeepFlow runtime environment, it will be automatically loaded. Run the following command in the environment:

```sh
# Replace /home/tom/hello.lua with the path to your Lua plugin, and hello with the desired plugin name
deepflow-ctl plugin create --type lua --image /home/tom/hello.lua --name hello --user server
```

DeepFlow supports loading multiple Lua plugins simultaneously. If you want different plugins to apply to different Pods, make sure to write appropriate filtering rules. You can view the names of loaded plugins with:

```sh
deepflow-ctl plugin list
```

You can delete a plugin by its name with the following command:

```sh
deepflow-ctl plugin delete <name>
```

## Example

For example, if the metadata of a Pod in the k8s environment is as follows:

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

Using the standardized method, the workload type and workload name cannot be extracted because the `kind` is `OpenGaussCluster`, which is not a type supported by DeepFlow. The currently supported workload types are: Deployment / StatefulSet / DaemonSet / CloneSet. You can write the following Lua script to convert the workload type into one supported by DeepFlow:

```lua
package.path = package.path..";/bin/?.lua"
local dkjson = require("dkjson")

function GetWorkloadTypeAndName(metaJsonStr)
    local metaData = dkjson.decode(metaJsonStr,1,nil)
    local ownerReferencesData = metaData["ownerReferences"] or {}
    local meteTable  = ownerReferencesData[1] or {}
    local workloadType = ""
    local workloadName = ""
    -- Get workloadType and ensure it is a string
    workloadType = tostring(meteTable["kind"] or "")
    -- If we only want to process workloadType = "OpenGaussCluster", filter out other Pods here
    if workloadType ~= "OpenGaussCluster" then
        -- Return empty strings for filtered-out Pods
        return "", ""
    else
        -- For special Pods, convert the workload type to one we support
        workloadType = "StatefulSet"
    end
    -- Get workloadName and ensure it is a string
    -- Here, the Pod has ownerReferences data, and the name in ownerReferences is the workloadName
    -- If the Pod has no ownerReferences data, you can derive workloadName from the pod name
    local workloadName = tostring(meteTable["name"] or "")
    return workloadType, workloadName
end
```

After uploading this plugin, you will be able to extract the corresponding workload type and workload name for this Pod.