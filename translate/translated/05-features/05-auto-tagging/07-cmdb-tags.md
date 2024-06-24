---
title: Business Tags in CMDB
permalink: /features/auto-tagging/cmdb-tags
---

> This document was translated by ChatGPT

When we want to associate business tag information from the CMDB with observability signals, we can use DeepFlow's `domain-additional-resources` declarative API. For detailed usage instructions of this API, please refer to the [Additional Cloud Resource Tags](./additional-cloud-tags/) section. This section mainly introduces how to use the `cloud_tags` resource to synchronize business tags from the CMDB.

Through this API, we can achieve the following effects:

- Inject business, application, service, and owner tags of **cloud servers** into all observability signals of DeepFlow
- Inject business and application tags of **K8s namespaces** into all observability signals of DeepFlow

# Field Definitions in the API

The CloudTag struct is defined as follows:
| Name | Type | Required | Description |
| ------------- | -------------- | -------- | -------------------------------------------------------- |
| resource_type | String | Yes | Options: chost and pod_ns (pod namespace) |
| resource_name | String | Yes | Resource name, obtained from vm.name or pod_namespace.name |
| domain_uuid | String | Yes | Cloud platform UUID, obtained from vm.domain or pod_namespace.domain |
| tags | Array of Tag structs | Yes | Information to be tagged |

The Tag struct is defined as follows:
| Name | Type | Required | Description |
| ----- | ------ | -------- | ------------------------------------------------------- |
| key | String | Yes | Limited to 255 characters, does not support spaces, colons, back quotes, backslashes, single quotes |
| value | String | Yes | Limited to 255 characters, does not support spaces, colons, back quotes, backslashes |

# Example of Invocation

For specific invocation methods, please refer to the [Additional Cloud Resource Tags](./additional-cloud-tags/) section. This section mainly introduces the cloud_tags part.

## Invocation via HTTP API

```bash
curl -XPUT -H "Content-Type:application/json" \
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/ \
-d@additional_resource.json
```

```json
{
  // Note: This API is declarative, please ensure to include other resource information in the API (if any)
  // "azs": [],
  // "vpcs": [],
  // ...

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
  ]

  // ...
}
```

## Invocation via deepflow-ctl Command

```yaml
## Note: This API is declarative, please ensure to include other resource information in the API (if any)
#azs: []
#vpcs: []
#...

cloud_tags:
  - resource_type: xxxx # required. options: chost, pod_ns
    resource_name: xxxx # required. (If there is a duplicate name, one will be chosen at random.)
    domain_uuid: xxxx # required
    subdomain_uuid: # optional. (Fill in this value if you need to set cloud tags for subdomain)
    tags: # required
      - key: xxxx # required. (Limited to 255 characters and does not support spaces, colon, back quotes, backslash, single quotes.)
        value: xxxx # required. (Limited to 255 characters and does not support spaces, colon, back quotes, backslash.)
```