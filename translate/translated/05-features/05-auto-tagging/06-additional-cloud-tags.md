---
title: Additional Cloud Resource Tags
permalink: /features/auto-tagging/additional-cloud-tags
---

> This document was translated by ChatGPT

# Introduction

In addition to actively calling (pulling) APIs from cloud service providers and K8s apiserver to synchronize resource information, DeepFlow also provides a declarative interface `domain-additional-resource` to allow external services to push additional resource information. This method is suitable for synchronizing public cloud resources not yet supported by DeepFlow, synchronizing private cloud resources using the DeepFlow community edition, and synchronizing business tags in CMDB.

The resource information that can be pushed using this API includes:

- Availability Zone
- VPC
- Subnet
- Server
- Cloud Server
- Custom Business Tags
- Load Balancer

The custom tags that can be pushed using this API include:

- Custom tags associated with the following K8s resources
  - Namespace
- Custom tags associated with the following cloud resources
  - Cloud Server

# API Call Method

## Endpoint

```bash
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/
```

## Request Method

PUT

## Request Parameters

### Header

| Name         | Type   | Required | Description       |
| ------------ | ------ | -------- | ----------------- |
| Content-Type | String | Yes      | application/json  |

### Body

| Name       | Type                | Required | Description                                                         |
| ---------- | ------------------- | -------- | ------------------------------------------------------------------- |
| azs        | Array of AZ Structs | No       | Availability Zone                                                   |
| vpcs       | Array of VPC Structs| No       | Virtual Private Cloud                                               |
| subnets    | Array of Subnet Structs | No   | Subnet                                                              |
| hosts      | Array of Host Structs | No     | Server                                                              |
| chosts     | Array of Chost Structs | No    | Cloud Server                                                        |
| cloud_tags | Array of CloudTag Structs | No | Generally used to inject business tags, see [Business Tags in CMDB](./cmdb-tags/) |
| lbs        | Array of LB Structs | No       | Load Balancer                                                       |

AZ Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| name       | String | Yes      |                   |
| uuid       | String | Yes      |                   |
| domain_uuid| String | Yes      | Cloud platform UUID |

VPC Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| name       | String | Yes      |                   |
| uuid       | String | Yes      |                   |
| domain_uuid| String | Yes      | Cloud platform UUID |

Subnet Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| name       | String | Yes      |                   |
| uuid       | String | Yes      |                   |
| type       | Integer| No       | Default: 4, Options: 3 (WAN), 4 (LAN) |
| is_vip     | Boolean| No       | Options: true, false |
| vpc_uuid   | String | Yes      |                   |
| az_uuid    | String | No       |                   |
| domain_uuid| String | Yes      | Cloud platform UUID |
| cidrs      | Array of Strings | Yes | Example: ["x.x.x.x/x"] |

Host Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| name       | String | Yes      |                   |
| uuid       | String | Yes      |                   |
| ip         | String | Yes      |                   |
| type       | Integer| No       | Default: 3 (KVM). Options: 2 (ESXi), 3 (KVM), 5 (Hyper-V), 6 (Gateway) |
| az_uuid    | String | Yes      |                   |
| domain_uuid| String | Yes      | Cloud platform UUID |
| vinterfaces| Array of Vinterface 1 Structs | No | Network interfaces |

Vinterface 1 Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| mac        | String | Yes      | Example: xx:xx:xx:xx:xx:xx |
| subnet_uuid| String | Yes      |                   |
| ips        | Array of Strings | No | Example: ["x.x.x.x"] |

Chost Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| name       | String | Yes      |                   |
| uuid       | String | Yes      |                   |
| host_ip    | String | No       | Hypervisor IP address |
| type       | Integer| No       | Default: 1 (vm/compute). Options: 1 (vm/compute), 2 (bm/compute), 3 (vm/network), 4 (bm/network), 5 (vm/storage), 6 (bm/storage) |
| vpc_uuid   | String | Yes      |                   |
| az_uuid    | String | Yes      |                   |
| domain_uuid| String | Yes      | Cloud platform UUID |
| vinterfaces| Array of Vinterface 2 Structs | No | Chost interfaces |

Vinterface 2 Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| mac        | String | Yes      | Example: xx:xx:xx:xx:xx:xx |
| subnet_uuid| String | Yes      |                   |
| ips        | Array of Strings | Yes | Example: ["x.x.x.x"] |

CloudTag Struct: See [Business Tags in CMDB](./cmdb-tags/).

Tag Struct
| Name       | Type   | Required | Description       |
| -----      | ------ | -------- | ----------------- |
| key        | String | Yes      | Limit 255 characters, no spaces, colons, backticks, backslashes, single quotes |
| value      | String | Yes      | Limit 255 characters, no spaces, colons, backticks, backslashes |

LB Struct
| Name       | Type   | Required | Description       |
| ------------ | ------ | -------- | ----------------- |
| name         | String | Yes      |                   |
| model        | Integer| Yes      | Default: 2. Options: 1 (internal), 2 (external) |
| vpc_uuid     | String | Yes      |                   |
| domain_uuid  | String | Yes      |                   |
| vinterfaces  | Array of Vinterface 2 Structs | No | Chost interfaces |
| lb_listeners | Array of LBListener Structs | No |                   |

LBListener Struct
| Name       | Type   | Required | Description       |
| -----------| ------ | -------- | ----------------- |
| name       | String | No       | If empty, assigned as ${ip}-${port} |
| protocol   | String | Yes      | Options: TCP, UDP |
| ip         | Integer| Yes      |                   |
| port       | String | Yes      |                   |
| lb_target_servers | Array of LBTargetServer Structs | No |                   |

LBTargetServer Struct
| Name       | Type   | Required | Description       |
| ----       | ------ | -------- | ----------------- |
| ip         | String | Yes      |                   |
| port       | Integer| Yes      |                   |

## Response Results

### Return Parameters

| Name        | Type   | Required | Description       |
| ----------- | ------ | -------- | ----------------- |
| OPT_STATUS  | String | Yes      | Success or failure |
| DESCRIPTION | String | Yes      | Error information  |
| DATA        | JSON   | Yes      | Return data        |

### Successful Response

When the return parameter OPT_STATUS equals SUCCESS, it indicates a successful call. Example return value:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "DATA": {}
}
```

### Failed Response

When the return parameter OPT_STATUS does not equal SUCCESS, it indicates a failed call. Example return value:

```json
{
  "OPT_STATUS": "INVALID_POST_DATA",
  "DESCRIPTION": "cloud tag (resource name: deepflow) domain (uuid: 76b5d56a-a65d-58db-bd49-e04585529ce5) not found",
  "DATA": null
}
```

The error code is the information in the OPT_STATUS field of the return value
| Error Code         | Description | Suggested Solution |
| ------------------ | ----------- | ------------------ |
| INVALID_POST_DATA  | Invalid parameter | Check if the corresponding field values are correct based on the error message |
| RESOURCE_NOT_FOUND | Resource not found | The resource value filled in is invalid, please check and fill in correctly |

# Call Example

## Calling via HTTP API

```bash
curl -XPUT -H "Content-Type:application/json" \
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/ \
-d@additional_resource.json
```

Parameter file additional_resource.json ([Reference YAML file](https://github.com/deepflowio/deepflow/blob/main/cli/ctl/example/domain_additional_resource.yaml))

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

## Calling via deepflow-ctl Command

In addition to using the HTTP API, you can also use the deepflow-ctl command to call via a YAML file.

```bash
# View YAML parameter example
deepflow-ctl domain additional-resource example

# Create additional-resource.yaml file
deepflow-ctl domain additional-resource example > additional-resource.yaml

# Add the corresponding parameters and execute the command
deepflow-ctl domain additional-resource apply -f additional-resource.yaml
```

After the resource is manually added successfully, the corresponding database table can be viewed after 1 minute (depending on the resource_recorder_interval field in the server.yaml configuration file):

- Availability Zone (table az)
- VPC (table epc)
- Subnet (table subnet)
- Server (table host_device)
- Cloud Server (table vm)
- Load Balancer (tables lb, lb_listener, and lb_target_server)
- Namespace (table pod_namespace)