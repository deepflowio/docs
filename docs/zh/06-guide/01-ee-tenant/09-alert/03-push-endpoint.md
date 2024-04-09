---
title: 推送端点
permalink: /guide/ee-tenant/alert/push-endpoint/
---

# 推送端点

推送端点用于接收和处理告警的系统或服务，目前支持四种推送方式，分别为：Email 推送、HTTP 推送、PCAP 策略、Syslog 推送。

接下来将分别介绍这四种推送方式。

## Email 推送

将告警信息发送到指定的邮件地址，可通过查看邮件来及时了解告警信息。

![Email 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230428644b76b451e05.png)

- 新建 Email 推送：填写相关信息成功建立后，可在[折线图](../dashboard/panel/line/)中使用
- 列表
  - 关联告警策略：点击数字，可跳转到[告警策略](./alert-policy/)页面中查看使用该推送端点的告警策略
  - 编辑：支持编辑推动端点
  - 删除：支持删除推送端点

## HTTP 推送

HTTP 推送通过 HTTP 协议向指定的 URL 地址推送数据。

![HTTP 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230428644b7a5c0c7bd.png)

- 页面按钮使用，可参考【Email 推送】章节

## PCAP 策略

支持将告警策略添加到 PCAP 策略中，通过 PCAP 进行告警监控。

- 页面按钮使用，可参考【Email 推送】章节

## Syslog 推送

告警 Syslog 推送将告警信息通过 Syslog 协议推送到日志服务器中。它可以实时地提醒运维人员系统出现了可能的故障或安全事件，帮助他们及时采取相应的措施进行处理。

- 页面按钮使用，可参考【Email 推送】章节
