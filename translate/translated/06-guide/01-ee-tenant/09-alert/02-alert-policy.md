---
title: Alert Policy
permalink: /guide/ee-tenant/alert/alert-policy/
---

> This document was translated by ChatGPT

# Alert Policy

The formulation of an alert policy is used to identify and respond to abnormal conditions in programs or services to ensure the normal operation of the system and the stability of business processes.
The alert policy page displays information about all alert policies in a list format.

![00-Overview.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566447b93e1025.png)

- Number of Alerts: Displays the number of alert data generated after the corresponding alert policy takes effect. You can click to jump to the [Alert Event](./alert-event/) page for further information.
- Status: You can choose to enable or disable the policy.
- Actions:
  - Edit: Edit the corresponding alert policy, supporting modifications to the alert level and push endpoints. For details, please refer to the [Edit Alert Policy] section.
  - Delete: Only supports deleting alert policies that are `disabled`.

## Edit Alert Policy

The alert policy requires filling in the configuration information for three modules: basic information, monitoring configuration, and notification configuration to generate the required alert policy.

![01-Edit Alert Policy.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566447b8697e3d.png)

- Basic Information
  - Alert Name: Required, fill in the corresponding alert name.
  - Team: Required, select the team organization that can view the policy.
  - Add Tags: Support adding tags to the alert policy.
  - Level: The importance level of the alert policy.

![02-Edit Alert Policy.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051566447b880ecc2.png)

- Monitoring Configuration
  - Monitoring Frequency: The time interval between two data monitoring sessions.
  - Monitoring Interval: The time range for data queries each time the policy is executed.
    - Options include `1 minute`, `5 minutes`, `15 minutes`, `30 minutes`, `1 hour`.
  - Monitoring Metrics: Select the data metrics to be monitored.
  - Event Level: Based on the set conditions, monitoring events can be classified into six levels: `Critical`, `Error`, `Warning`, `Recovery`, `Info`, `No Data`.
    - Recovery: When the results of consecutive X monitoring events do not meet any of the conditions for `Critical`, `Error`, `Warning`, or `No Data`, a `Recovery Event` is generated.
    - Info: When enabled, if the results of the monitoring event do not meet any of the conditions for `Critical`, `Error`, `Warning`, `Recovery`, or `No Data`, an `Info Event` is generated.
    - No Data: When enabled, if the monitoring event has no data, a `No Data Event` is generated.
  - Notification Configuration
    - Push Endpoints: Select the objects to push notifications to. Multiple objects can be selected. For configuration details, please refer to the [Push Endpoints](./push-endpoint/) section.