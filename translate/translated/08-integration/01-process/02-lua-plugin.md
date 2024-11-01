---
title: Lua plugin
permalink: /integration/process/lua-plugin
---

> This document was translated by ChatGPT

# About Lua Plugin

Due to some users' Kubernetes environments possibly having special configurations or security requirements, the standardized way of extracting workload types and workload names may not work as expected. Alternatively, users might want to customize workload types and workload names based on their own logic. Therefore, DeepFlow supports users in extracting workload types and workload names by adding custom Lua plugins. The Lua plugin system enhances the flexibility and universality of K8s resource integration by calling Lua Functions at fixed points to obtain some user-defined workload types and names.

# Lua Plugin Writing Example

```lua
-- Fixed syntax to import the JSON parsing package
package.path = package.path..";/bin/?.lua"
local dkjson = require("dkjson")

-- Fixed function name and parameters
function GetWorkloadTypeAndName(metaJsonStr)
    -- Example of metadata JSON
    -- Note that the JSON passed in after the colon on this line "metadata": {
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
    -- Note that for customization flexibility, each pod metadata JSON string will be passed to the Lua script, and you need to filter out pods that do not require customization
    -- For those that meet the filter criteria, return two empty strings
    if condition then -- Here, condition is the criteria you need to filter pods
        return "", "" -- Return two empty strings
    end
    -- Return workloadType and workloadName through custom analysis of metaData
    return workloadType, workloadName

end
```

# Upload Plugin

Lua plugins support runtime loading. After uploading the plugin using the deepflow-ctl tool in the DeepFlow runtime environment, it will be automatically loaded. Execute the following command in the environment:

```sh
# Replace /home/tom/hello.lua with the path to your Lua plugin and hello with the name you want to give the plugin
deepflow-ctl plugin create --type lua --image /home/tom/hello.lua --name hello --user server
```

DeepFlow supports loading multiple Lua plugins simultaneously. If you want different plugins to act on different Pods, make sure to write the filter rules properly. You can view the names of the plugins you have loaded with the following command:

```sh
deepflow-ctl plugin list
```

You can delete a specific plugin by its name with the following command:

```sh
deepflow-ctl plugin delete <name>
```

# Example

For instance, if the metadata of a Pod in the current k8s environment is as follows:

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

The standardized way cannot extract the workload type and workload name because the kind of data is `OpenGaussCluster`, which is not a type supported by DeepFlow. The currently supported workload types are: Deployment/StatefulSet/DaemonSet/CloneSet. You can write the following Lua script to convert the workload type to a type supported by DeepFlow:

```lua
package.path = package.path..";/bin/?.lua"
local dkjson = require("dkjson")

function GetWorkloadTypeAndName(metaJsonStr)
    local metaData = dkjson.decode(metaJsonStr,1,nil)
    local ownerReferencesData = metaData["ownerReferences"] or {}
    local meteTable  = ownerReferencesData[1] or {}
    local workloadType = ""
    local workloadName = ""
    -- Get workloadType and ensure it is of string type
    workloadType = tostring(meteTable["kind"] or "")
    -- If we only want to process workloadType = "OpenGaussCluster", we can filter out other Pod metadata here
    if workloadType ~= "OpenGaussCluster" then
        -- Directly return empty strings for filtered out ones
        return "", ""
    else
        -- Process special Pods to make the returned workload type a supported type
        workloadType = "StatefulSet"
    end
    -- Get workloadName and ensure it is of string type
    -- Here, the Pod has ownerReferences data, and the name in ownerReferences is the workloadName
    -- If the Pod does not have ownerReferences data, you can calculate the workloadName based on the pod name
    local workloadName = tostring(meteTable["name"] or "")
    return workloadType, workloadName
end
```

After uploading this plugin, you can extract the corresponding workload type and workload name for this Pod.