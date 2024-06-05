---
title: Additional Cloud Resource Tags
permalink: /features/auto-tagging/additional-cloud-tags
---

> This document was translated by ChatGPT

# Introduction

In addition to actively calling (fetching) the APIs of cloud service providers and K8s apiserver to sync resource information, DeepFlow also provides a declarative interface named `domain-additional-resource` that allows external services to push additional resource information. This method is applicable for synchronizing public cloud resources not yet supported by DeepFlow, syncing private cloud resources using DeepFlow community edition, and syncing business tags in the CMDB.

The resource information that can be pushed through this API includes:

- Availability Zone
- Virtual Private Cloud (VPC)
- Subnet
- Server
- Cloud Server
- Custom Business Tags
- Load Balancer

The custom tags that can be pushed through this API include:

- Custom tags associated with the following K8s resources:
  - Namespace
- Custom tags associated with the following cloud resources:
  - Cloud Server

# API Call Method

## Interface

```bash
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/
```

## Request Method

PUT

## Request Parameters

### Header

| Name         | Type   | Required | Explanation      |
| ------------ | ------ | -------- | ---------------- |
| Content-Type | String | Yes      | application/json |

### Body

| Name       | Type                     | Required | Description                                                                           |
| ---------- | ------------------------ | -------- | ------------------------------------------------------------------------------------- |
| azs        | Array of AZ object       | No       | Availability Zone                                                                     |
| vpcs       | Array of VPC object      | No       | Virtual Private Cloud                                                                 |
| subnets    | Array of Subnet object   | No       | Subnet                                                                                |
| hosts      | Array of Host object     | No       | Server                                                                                |
| chosts     | Array of Chost object    | No       | Cloud Server                                                                          |
| cloud_tags | Array of CloudTag object | No       | Generally used to inject business tags, see [Business tags in the CMDB](./cmdb-tags/) |
| lbs        | Array of LB object       | No       | Load Balancer                                                                         |

AZ object
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------- |
| name | String | Yes | |
| uuid | String | Yes | |
| domain_uuid | String | Yes | Cloud platform UUID |

VPC object
| Name | Type | Required | Description |
| ----------- | ------ | -------- | ----------- |
| name | String | Yes | |
| uuid | String | Yes | |
| domain_uuid | String | Yes | Cloud platform UUID |

Subnet object
| Name | Type | Required | Explanation |
| ----------- | ---------- | -------- | ------------------------------- |
| name | String | Yes | |
| uuid | String | Yes | |
| type | Integer | No | Default: 4, optional: 3 (WAN), 4 (LAN) |
| is_vip | Boolean | No | Optional: true, false |
| vpc_uuid | String | Yes | |
| az_uuid | String | No | |
| domain_uuid | String | Yes | Cloud platform UUID |
| cidrs | Array of String | Yes | E.g., ["x.x.x.x/x"] |

Host object
| Name | Type | Required | Explanation |
| ----------- | ---------------------- | -------- | -------------------------------------------------------------------------------- |
| name | String | Yes | |
| uuid | String | Yes | |
| ip | String | Yes | |
| type | Integer | No | Default: 3(KVM). Optional: 2 (ESXi), 3 (KVM), 5 (Hyper-V), 6 (Gateway) |
| az_uuid | String | Yes | |
| domain_uuid | String | Yes | Cloud platform UUID |
| vinterfaces | Array of Vinterface 1 object | No | Network interfaces |

Vinterface 1 object
| Name | Type | Required | Explanation |
| ----------- | ---------- | -------- | ----------- |
| mac | String | Yes | E.g., xx:xx:xx:xx:xx:xx |
| subnet_uuid | String | Yes | |
| ips | Array of String | No | E.g., ["x.x.x.x"] |

Chost object
| Name | Type | Required | Description |
| ----------- | ----------------------- | -------- | ---------------------------------------------------------------------------------|
| name | String | Yes | |
| uuid | String | Yes | |
| host_ip | String | No | Hypervisor IP address |
| type | Integer | No | Default: 1(vm/compute). Optional: 1 (vm/compute), 2 (bm/compute), 3 (vm/network), 4 (bm/network), 5 (vm/storage), 6 (bm/storage) |
| vpc_uuid | String | Yes | |
| az_uuid | String | Yes | |
| domain_uuid | String | Yes | Cloud platform UUID |
| vinterfaces | Array of Vinterface 2 object | No | Chost interfaces |

Vinterface 2 object
| Name | Type | Required | Description |
| ----------- | ---------- | -------- | -------------- |
| mac | String | Yes | E.g., xx:xx:xx:xx:xx:xx |
| subnet_uuid | String | Yes | |
| ips | Array of String | Yes | E.g., ["x.x.x.x"] |

CloudTag object: See [Business tags in the CMDB](./cmdb-tags/).

Tag object
| Name | Type | Required | Explanation |
| ----- | ------ | -------- | ------------------------------------------------- |
| key | String | Yes | Limit to 255 characters, spaces, colons, backquotes, backslashes, and single quotes are not supported |
| value | String | Yes | Limit to 255 characters, spaces, colons, backquotes, backslashes are not supported |

LB object
| Name | Type | Required | Description |
| ------------ | ----------------------- | -------- | ------------------------------------------------ |
| name | String | Yes | |
| model | Integer | Yes | Default: 2. Optional: 1 (internal), 2 (external) |
| vpc_uuid | String | Yes | |
| domain_uuid | String | Yes | |
| vinterfaces | Array of Vinterface 2 object | No | Chost interfaces |
| lb_listeners | Array of LBListener object | No | |

LBListener object
| Name | Type | Required | Explanation |
| ----------------- | ------------------------- | -------- | ------------------------- |
| name | String | No | If it's empty, the value will be ${ip}-${port} |
| protocol | String | Yes | Optional: TCP, UDP |
| ip | Integer | Yes | |
| port | String | Yes | |
| lb_target_servers | Array of LBTargetServer object | No | |

LBTargetServer object
| Name | Type | Required | Explanation |
| ---- | ------ | -------- | ---- |
| ip | String | Yes | |
| port | Integer | Yes | |

## Response

### Return parameters

| Name        | Type   | Required | Explanation    |
| ----------- | ------ | -------- | -------------- |
| OPT_STATUS  | String | Yes      | Success or not |
| DESCRIPTION | String | Yes      | Error message  |
| DATA        | JSON   | Yes      | Return data    |

### Success response

When the return parameter OPT_STATUS equals SUCCESS, it indicates the call was successful. The return value example is as follows:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "DATA": {}
}
```

### Failure response

When the return parameter OPT_STATUS does not equal SUCCESS, it indicates the call failed. The return value example is as follows:

```json
{
  "OPT_STATUS": "INVALID_POST_DATA",
  "DESCRIPTION": "cloud tag (resource name: deepflow) domain (uuid: 76b5d56a-a65d-58db-bd49-e04585529ce5) not found",
  "DATA": null
}
```

The error code is the information in the OPT_STATUS field in the return value.
| Error code | Explanation | Suggested solution |
| ------------------ | ---------- | ------------------------------------ |
| INVALID_POST_DATA | Invalid parameter | Check the value of the corresponding field according to the error prompt |
| RESOURCE_NOT_FOUND | Resource not found | The resource value filled in is invalid, please check and fill in correctly |

# Invocation Example

## Call via HTTP API

```bash
curl -XPUT -H "Content-Type:application/json" \
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/ \
-d@additional_resource.json
```

Parameter file additional_resource.json ([see sample YAML file](https://github.com/deepflowio/deepflow/blob/main/cli/ctl/example/domain_additional_resource.yaml))

```json
{
  "azs": [
    {
      "name": "xxxx",
      "uuid": "xxxx",
      "domain_uuid": "xxxx"
    }
  ],
  "vpcs": [
    {
      "name": "xxxx",
      "uuid": "xxxx",
      "domain_uuid": "xxxx"
    }
  ],
  "subnets": [
    {
      "name": "xxxx",
      "uuid": "xxxx",
      "type": 3,
      "is_vip": false,
      "vpc_uuid": "xxxx",
      "az_uuid": "xxxx",
      "domain_uuid": "xxxx",
      "cidrs": ["x.x.x.x/x"]
    }
  ],
  "hosts": [
    {
      "name": "xxxx",
      "uuid": "xxxx",
      "ip": "x.x.x.x",
      "type": 3,
      "az_uuid": "xxxx",
      "domain_uuid": "xxxx",
      "vinterfaces": [
        {
          "mac": "xx:xx:xx:xx:xx:xx",
          "subnet_uuid": "xxxx",
          "ips": ["x.x.x.x"]
        }
      ]
    }
  ],
  "chosts": [
    {
      "name": "xxxx",
      "uuid": "xxxx",
      "host_ip": "x.x.x.x",
      "type": 1,
      "vpc_uuid": "xxxx",
      "az_uuid": "xxxx",
      "domain_uuid": "xxxx",
      "vinterfaces": [
        {
          "mac": "xx:xx:xx:xx:xx:xx",
          "subnet_uuid": "xxxx",
          "ips": ["x.x.x.x"]
        }
      ]
    }
  ],
  "cloud_tags": [
    {
      "resource_type": "xxxx",
      "resource_name": "xxxx",
      "domain_uuid": "xxxx",
      "tags": [
        {
          "key": "xxxx",
          "value": "xxxx"
        }
      ]
    }
  ],
  "lbs": [
    {
      "name": "xxx",
      "model": 2,
      "vpc_uuid": "xxxx",
      "domain_uuid": "xxxx",
      "region_uuid": "xxxx",
      "vinterfaces": [
        {
          "mac": "xx:xx:xx:xx:xx:xx",
          "subnet_uuid": "xxxx",
          "ips": ["x.x.x.x"]
        }
      ],
      "lb_listeners": [
        {
          "name": "xxx",
          "protocol": "TCP/UDP",
          "ip": "x.x.x.x",
          "port": 9000,
          "lb_target_servers": [
            {
              "ip": "x.x.x.x",
              "port": 9090
            }
          ]
        }
      ]
    }
  ]
}
```

## Call via deepflow-ctl command

In addition to using the HTTP API call, you can also use the deepflow-ctl command to call through a yaml file.

```bash
# View the parameter example in YAML
deepflow-ctl domain additional-resource example

# Create additional-resource.yaml file
deepflow-ctl domain additional-resource example > additional-resource.yaml

# Add the corresponding parameters and execute the command
deepflow-ctl domain additional-resource apply -f additional-resource.yaml
```

After successfully adding the resource manually, the corresponding database table can view the information after 1 minute (depending on the resource_recorder_interval field in the server.yaml configuration file):

- Availability Zone (table az)
- VPC (table epc)
- Subnet (table subnet)
- Server (table host_device)
- Cloud Server (table vm)
- Load Balancer (table lb, lb_listener, and lb_target_server)
- Namespace (table pod_namespace)
