---
title: Alert Policy
permalink: /guide/ee-tenant/alert/alert-policy/
---

> This document was translated by ChatGPT

# Alert Policy

The formulation of an alert policy is used to identify and respond to abnormal conditions in programs or services, ensuring the normal operation of the system and the stability of business processes.  
The Alert Policy page displays information about all alert policies in a list format.

![00-总览.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566447b93e1025.png)

- Number of Alerts: Displays the number of alert data generated after the corresponding alert policy takes effect. Supports clicking to jump to the [Alert Event](./alert-event/) page for further details.
- Status: Allows enabling or disabling the policy.
- Actions:
  - Edit: Edit the corresponding alert policy, supporting modification of alert level and push endpoints. For usage details, please refer to the **Edit Alert Policy** section.
  - Delete: Only supports deleting alert policies that are `disabled`.

## Edit Alert Policy

An alert policy requires configuration of three modules: Basic Information, Monitoring Configuration, and Notification Configuration, to generate the desired alert policy.

![01-编辑告警策略.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566447b8697e3d.png)

- Basic Information
  - Alert Name: Required. Enter the corresponding alert name.
  - Team: Required. Select the team or organization that can view the policy.
  - Add Tags: Supports adding custom tags to the alert policy.
  - Level: The importance level of the alert policy.

![02-编辑告警策略.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566447b880ecc2.png)

- Monitoring Configuration
  - Monitoring Frequency: The time interval between two data monitoring operations.
  - Monitoring Interval: The time range for data queries each time the policy is executed.
    - Options: `1 minute`, `5 minutes`, `15 minutes`, `30 minutes`, `1 hour`
  - Monitoring Metric: Select the data metric to monitor.
  - Event Level: Based on the set conditions, monitoring events can be classified into six levels: `Critical`, `Error`, `Warning`, `Recovery`, `Info`, and `No Data`.
    - Recovery: When the results of consecutive X monitoring events do not meet any of the conditions for **Critical**, **Error**, **Warning**, or **No Data**, a `Recovery Event` is generated.
    - Info: When enabled, if the monitoring event results do not meet any of the conditions for **Critical**, **Error**, **Warning**, **Recovery**, or **No Data**, an `Info Event` is generated.
    - No Data: When enabled, if the monitoring event has no data, a `No Data Event` is generated.
  - Notification Configuration
    - Push Endpoint: Select the target(s) to push to. Multiple targets are supported. For configuration details, please refer to the **[Push Endpoint](./push-endpoint/)** section.