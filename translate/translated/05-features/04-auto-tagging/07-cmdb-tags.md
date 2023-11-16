---
title: Business Tags in CMDB
permalink: /features/auto-tagging/cmdb-tags
---

> This document was translated by GPT-4

When we want to associate the business tag information in CMDB with observation signals, we can use DeepFlow's `domain-additional-resources` declarative API. For detailed instructions on how to use this API, please refer to the section [Additional Cloud Resource Tags](./additional-cloud-tags/). This section mainly explains how to use the `cloud_tags` resource to synchronize business tags in CMDB.

With this API, we can achieve the following effects:

- Inject business, application, service, owner and other tags of **cloud Servers** into all observability signals of DeepFlow
- Inject business, application and other tags of **K8s namespaces** into all observability signals of DeepFlow

# Field Definition in API

The definition of the CloudTag structure is as follows:
| Name | Type | Mandatory or Not | Description |
| ------------- | -------------- | --------------- | -------------------------------------------------------- |
| resource_type | String | Yes | Optional: chost and pod_ns (pod namespace) |
| resource_name | String | Yes | Resource name, sourced from vm.name or pod_namespace.name|
| domain_uuid | String | Yes | Cloud platform UUID, from vm.domain or pod_namespace.domain |
| tags | Array of Tag structure | Yes | Information required for tagging |

Moreover, the definition of the Tag structure is as follows:
| Name | Type | Mandatory or Not | Description |
| ----- | ------ | --------------- | ------------------------------------------------------- |
| key | String | Yes | Limit 255 characters, no support for spaces, colons, back quotes, backslashes, single quotes |
| value | String | Yes | Limit 255 characters, no support for spaces, colons, back quotes, backslashes |

# Invocation Examples

For the specific method of invocation, please refer to the [Additional Cloud Resource Tags](./additional-cloud-tags/) section. This section mainly introduces the cloud_tags part.

## Invocation through HTTP API

```bash
curl -XPUT -H "Content-Type:application/json" \
${deepflow_server_node_ip}:${port}/v1/domain-additional-resources/ \
-d@additional_resource.json
```

```json
{
  // Note: This API is a declarative API. Be sure to carry other resource information in the API (if any)
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

## Invocation through deepflow-ctl Command

```yaml
## Be aware that this API is declared, pay attention to carrying other resource information in the API (if any)
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
