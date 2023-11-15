> This document was translated by GPT-4

---

title: Push Endpoint
permalink: /guide/ee-tenant/alert/push-endpoint/

---

# Push Endpoint

Push endpoints are systems or services used to receive and process alerts. Currently, four pushing methods are supported: Email push, HTTP push, PCAP policy, and Syslog push.

The following sections will introduce these four push methods.

## Email Push

This method sends alert information to a designated email address, allowing you to promptly understand alert information through checking your email.

![03-push_endpoint.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230428644b76b451e05.png)

- To create a new Email push: Fill in the relevant information. After successful creation, it can be used in the [Line chart](../dashboard/panel/line/)
- List
  - Associated alert policies: Click on the number to jump to the [alert policy](./alert-policy/) page to view the alerting policy using this push endpoint
  - Edit: Supports editing of the push endpoint
  - Delete: Supports deletion of the push endpoint

## HTTP Push

HTTP push sends data to a designated URL address through the HTTP protocol.

![03-push_endpoint_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230428644b7a5c0c7bd.png)

- For page button usage, please refer to the "Email Push" section

## PCAP Policy

This supports adding alert policies to PCAP policies for alert monitoring through PCAP.

- For page button usage, please refer to the "Email Push" section

## Syslog Push

Alert Syslog push sends alert information to a log server via the Syslog protocol. It can alert operations staff in real-time to possible system failures or security events, helping them to take appropriate measures in a timely manner.

- For page button usage, please refer to the "Email Push" section
