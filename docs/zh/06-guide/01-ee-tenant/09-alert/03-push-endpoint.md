---
title: 推送端点
permalink: /guide/ee-tenant/alert/push-endpoint/
---

# 推送端点

推送端点用于接收和处理告警的系统或服务，目前支持四种推送方式，分别为：Email 推送、HTTP 推送、Kafka 推送、PCAP 策略、Syslog 推送。

接下来将分别介绍这五种推送方式。

## Email 推送

将告警事件发送到指定的邮件地址，可通过查看邮件来及时了解告警信息。

![Email 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230428644b76b451e05.png)

- 新建 Email 推送：填写相关信息成功建立后，可在[创建告警策略](./alert-policy/)时使用
- 列表
  - 关联告警策略：点击数字，可跳转到[告警策略](./alert-policy/)页面中查看使用该推送端点的告警策略
  - 编辑：支持编辑推动端点
  - 删除：支持删除推送端点
### 新建 Email 推送

![新建 Email 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645b62681d2f.png)

- 邮箱：填写要推送的邮箱地址
- 推送标题：选填，支持填写邮件标题
- 其它填写字段，请参阅【新建 Kafka 推送】章节

## HTTP 推送

HTTP 推送通过 HTTP 协议向指定的 URL 地址推送数据。

![HTTP 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230428644b7a5c0c7bd.png)

- 页面按钮使用，请参阅【Email 推送】章节

### 新建 HTTP 推送

![新建 HTTP 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645b6260915a.png)

- 推送方法：必选，支持`POST`、`PUT`、`PATCH`三种方式推送，默认`POST`
- 推送URL：必填，协议名称不区分大小写，支持HTTP、HTTPS协议，`HTTPS`可单向认证
  - 注意：支持 Jinja 模板渲染，例如`http://10.0.0.1/{{policy_level}}`
- Header：输入`HTTP`键值对
- 其它填写字段，请参阅【新建 Kafka 推送】章节
  
## Kafka 推送

Kafka 推送支持将告警事件推送给 Kafka。

- 页面按钮使用，请参阅【Email 推送】章节

### 新建 Kafka 推送

![新建 Kafka 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/2024051666456bfb6ebdc.png)

- 名称：必填，填写推动端点名称
- 团队：必选，选择可使用该推动端点的团队
- Broker 地址池：必填，输入格式`[地址]:[端口]`，支持输入多个，英文逗号分割
- Topic：必填，Kafka 推送的 Topic，支持1-256可打印字符串
- SASL：选填，认证的方式，若选择 Plain 则需要填写用户名及密码
- 推送内容：支持 Jinja 模板渲染，默认推送内容请参阅参数说明
- 配置等级：选择要接收的告警事件等级，告警事件等级说明，请参阅【[编辑告警策略](./alert-policy/)】章节
  - 默认情况下，将推送除`信息`以外的其它等级告警事件
- 推送周期：必选，在推送周期内，同一个告警策略下的同一个监控对象的产生的告警事件仅推送一次
- 推送频率：同一个告警策略下的同一个监控对象产生的告警事件，允许的最大推送次数，超出则不再推送

## PCAP 策略

支持将告警策略添加到 PCAP 策略中，通过 PCAP 进行告警监控。

![新建 PCAP 策略](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20240516664573d598713.png)

- 页面按钮使用，请参阅【Email 推送】章节
- 新建 PCAP 策略
  - 关联 PCAP 策略：必选，将 PCAP 策略与告警事件关联，监控产生的告警事件可在关联的 PCAP 策略下载
- 启用PCAP策略：选择要推送的告警事件等级，若产生该等级的告警事件，将推送至关联的 PCAP 策略，同时 PCAP 策略将自动启用
  - 注意：默认情况下，将推送【致命、错误、警告】告警事件
- 禁用PCAP策略：选择要推送的告警事件等级，若产生该等级的告警事件，关联的 PCAP 策略将自动禁用
  - 注意：默认情况下，将推送【恢复】告警事件
- 其它填写字段，请参阅【新建 Kafka 推送】章节

## Syslog 推送

告警 Syslog 推送将告警信息通过 Syslog 协议推送到日志服务器中。它可以实时地提醒运维人员系统出现了可能的故障或安全事件，帮助他们及时采取相应的措施进行处理。

- 页面按钮使用，请参阅【Email 推送】章节

### 新建 Syslog 推送

![新建 Syslog 推送](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/202405166645b6249798c.png)

- 推送目的端：必填，输入格式`[转发协议]://[日志服务器地址]:[端口]`
  - 注意：可选协议为`UDP`、`TCP`，默认为`UDP`；可选端口为`1-65535`，默认端口为`514`
- 其它填写字段，请参阅【新建 Kafka 推送】章节


