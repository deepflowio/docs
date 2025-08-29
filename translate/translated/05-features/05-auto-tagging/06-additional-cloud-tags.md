---
title: Additional Cloud Resource Tags
permalink: /features/auto-tagging/additional-cloud-tags
---

> This document was translated by ChatGPT

# Introduction

In addition to actively invoking (pulling) the APIs of cloud service providers and the K8s apiserver to synchronize resource information, DeepFlow also provides a declarative interface `domain-additional-resource` that allows external services to push additional resource information.  
This method is applicable for synchronizing public cloud resources not yet supported by DeepFlow, synchronizing private cloud resources using the DeepFlow community edition, and synchronizing business tags from CMDB, among other scenarios.

The resource information that can be pushed using this API includes:

- Availability Zone
- VPC
- Subnet
- Server
- Cloud Server
- Custom Business Tags
- Load Balancer

The custom tags that can be pushed using this API include:

- Custom tags associated with the following K8s resources:
  - Namespace
- Custom tags associated with the following cloud resources:
  - Cloud Server

# API Usage

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

| Name       | Type                  | Required | Description                                                                 |
| ---------- | --------------------- | -------- | --------------------------------------------------------------------------- |
| azs        | AZ struct array       | No       | Availability Zone                                                            |
| vpcs       | VPC struct array      | No       | Virtual Private Cloud                                                        |
| subnets    | Subnet struct array   | No       | Subnet                                                                       |
| hosts      | Host struct array     | No       | Server                                                                       |
| chosts     | Chost struct array    | No       | Cloud Server                                                                 |
| cloud_tags | CloudTag struct array | No       | Generally used to inject business tags, see [Business Tags in CMDB](./cmdb-tags/) |
| lbs        | LB struct array       | No       | Load Balancer                                                                |

AZ struct  
| Name       | Type   | Required | Description       |
| ---------- | ------ | -------- | ----------------- |
| name       | String | Yes      |                   |
| uuid       | String | Yes      |                   |
| domain_uuid| String | Yes      | Cloud platform UUID|

VPC struct  
| Name       | Type   | Required | Description       |
| ---------- | ------ | -------- | ----------------- |
| name       | String | Yes      |                   |
| uuid       | String | Yes      |                   |
| domain_uuid| String | Yes      | Cloud platform UUID|

Subnet struct  
| Name       | Type     | Required | Description                                      |
| ---------- | -------- | -------- | ------------------------------------------------ |
| name       | String   | Yes      |                                                  |
| uuid       | String   | Yes      |                                                  |
| type       | Integer  | No       | Default: 4, Options: 3 (WAN), 4 (LAN)            |
| is_vip     | Boolean  | No       | Options: true, false                             |
| vpc_uuid   | String   | Yes      |                                                  |
| az_uuid    | String   | No       |                                                  |
| domain_uuid| String   | Yes      | Cloud platform UUID                              |
| cidrs      | String[] | Yes      | Example: ["x.x.x.x/x"]                           |

Host struct  
| Name       | Type                  | Required | Description                                                                 |
| ---------- | --------------------- | -------- | --------------------------------------------------------------------------- |
| name       | String                | Yes      |                                                                             |
| uuid       | String                | Yes      |                                                                             |
| ip         | String                | Yes      |                                                                             |
| type       | Integer               | No       | Default: 3 (KVM). Options: 2 (ESXi), 3 (KVM), 5 (Hyper-V), 6 (Gateway)      |
| az_uuid    | String                | Yes      |                                                                             |
| domain_uuid| String                | Yes      | Cloud platform UUID                                                         |
| vinterfaces| Vinterface 1 struct[] | No       | Network interfaces                                                          |

Vinterface 1 struct  
| Name       | Type     | Required | Description                  |
| ---------- | -------- | -------- | ---------------------------- |
| mac        | String   | Yes      | Example: xx:xx:xx:xx:xx:xx   |
| subnet_uuid| String   | Yes      |                              |
| ips        | String[] | No       | Example: ["x.x.x.x"]         |

Chost struct  
| Name       | Type                  | Required | Description                                                                 |
| ---------- | --------------------- | -------- | --------------------------------------------------------------------------- |
| name       | String                | Yes      |                                                                             |
| uuid       | String                | Yes      |                                                                             |
| host_ip    | String                | No       | Hypervisor IP address                                                       |
| type       | Integer               | No       | Default: 1 (vm/compute). Options: 1 (vm/compute), 2 (bm/compute), 3 (vm/network), 4 (bm/network), 5 (vm/storage), 6 (bm/storage) |
| vpc_uuid   | String                | Yes      |                                                                             |
| az_uuid    | String                | Yes      |                                                                             |
| domain_uuid| String                | Yes      | Cloud platform UUID                                                         |
| vinterfaces| Vinterface 2 struct[] | No       | Chost interfaces                                                            |

Vinterface 2 struct  
| Name       | Type     | Required | Description                  |
| ---------- | -------- | -------- | ---------------------------- |
| mac        | String   | Yes      | Example: xx:xx:xx:xx:xx:xx   |
| subnet_uuid| String   | Yes      |                              |
| ips        | String[] | Yes      | Example: ["x.x.x.x"]         |

CloudTag struct: See [Business Tags in CMDB](./cmdb-tags/).

Tag struct  
| Name  | Type   | Required | Description                                                                 |
| ----- | ------ | -------- | --------------------------------------------------------------------------- |
| key   | String | Yes      | Limit 255 characters, no spaces, colons, backticks, backslashes, or quotes  |
| value | String | Yes      | Limit 255 characters, no spaces, colons, backticks, backslashes             |

LB struct  
| Name       | Type                  | Required | Description                                      |
| ---------- | --------------------- | -------- | ------------------------------------------------ |
| name       | String                | Yes      |                                                  |
| model      | Integer               | Yes      | Default: 2. Options: 1 (internal), 2 (external)  |
| vpc_uuid   | String                | Yes      |                                                  |
| domain_uuid| String                | Yes      |                                                  |
| vinterfaces| Vinterface 2 struct[] | No       | Chost interfaces                                 |
| lb_listeners| LBListener struct[]  | No       |                                                  |

LBListener struct  
| Name            | Type                    | Required | Description                              |
| --------------- | ----------------------- | -------- | ---------------------------------------- |
| name            | String                  | No       | If empty, defaults to ${ip}-${port}      |
| protocol        | String                  | Yes      | Options: TCP, UDP                        |
| ip              | Integer                 | Yes      |                                          |
| port            | String                  | Yes      |                                          |
| lb_target_servers| LBTargetServer struct[]| No       |                                          |

LBTargetServer struct  
| Name | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| ip   | String | Yes      |             |
| port | Int    | Yes      |             |

## Response

### Return Parameters

| Name        | Type   | Required | Description       |
| ----------- | ------ | -------- | ----------------- |
| OPT_STATUS  | String | Yes      | Success or failure|
| DESCRIPTION | String | Yes      | Error message     |
| DATA        | JSON   | Yes      | Returned data     |

### Success Response

When `OPT_STATUS` equals `SUCCESS`, the call is successful. Example:

```json
{
  "OPT_STATUS": "SUCCESS",
  "DESCRIPTION": "",
  "DATA": {}
}
```

### Failure Response

When `OPT_STATUS` is not `SUCCESS`, the call failed. Example:

```json
{
  "OPT_STATUS": "INVALID_POST_DATA",
  "DESCRIPTION": "cloud tag (resource name: deepflow) domain (uuid: 76b5d56a-a65d-58db-bd49-e04585529ce5) not found",
  "DATA": null
}
```

Error codes are indicated in the `OPT_STATUS` field:  
| Error Code         | Description       | Suggested Solution                                      |
| ------------------ | ----------------- | ------------------------------------------------------- |
| INVALID_POST_DATA  | Invalid parameter | Check whether the value of the corresponding field is correct according to the error message |
| RESOURCE_NOT_FOUND | Resource not found| The resource value is invalid, please check and correct |

# Example Usage

## Call via HTTP API

```bash
curl -XPUT -H "Content-Type:application/json" \
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/ \
-d@additional_resource.json
```

Parameter file `additional_resource.json` ([Reference YAML file](https://github.com/deepflowio/deepflow/blob/main/server/controller/model/domain_additional_resource_example.yaml))

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

## Call via `deepflow-ctl` Command

In addition to using the HTTP API, you can also use the `deepflow-ctl` command with a YAML file.

```bash
# View YAML parameter example
deepflow-ctl domain additional-resource example

# Create additional-resource.yaml file
deepflow-ctl domain additional-resource example > additional-resource.yaml

# Add the corresponding parameters and execute the command
deepflow-ctl domain additional-resource apply -f additional-resource.yaml
```

Once the resource is manually added successfully, after 1 minute (depending on the `resource_recorder_interval` field in the `server.yaml` configuration file), the corresponding database tables will display the information:

- Availability Zone (table `az`)
- VPC (table `epc`)
- Subnet (table `subnet`)
- Server (table `host_device`)
- Cloud Server (table `vm`)
- Load Balancer (tables `lb`, `lb_listener`, and `lb_target_server`)
- Namespace (table `pod_namespace`)