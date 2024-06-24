---
title: Server Performance Tuning
permalink: /diagnose/how-to-profile-deepflow-server-ingester
---

> This document was translated by ChatGPT

# Investigating Packet Loss in deepflow-server

- Influencing Factors:

  - Server Performance Bottleneck
    - Check CPU and memory bottlenecks through the DeepFlow Server Dashboard. If they are maxed out, it indicates a non-server bottleneck.
  - Clickhouse Performance Bottleneck

    - Use the following query to determine Clickhouse write performance:

      ```SQL
      -- Single Clickhouse reception performance:
      -- written_rows / (query_duration_ms/1000) * server write thread count (ingester.flow-ck-writer.queue_count)

      SELECT event_time, query_duration_ms, written_rows, written_bytes, query
      FROM system.query_log
      WHERE event_time > now() - 1000 AND query LIKE '%INSERT INTO%'
      ORDER BY query_duration_ms
      DESC LIMIT 10
      ```

      ```SQL
      -- Average server write to Clickhouse per second

      SELECT tag_values[1] AS host, AVG(metrics_float_values[4])/10 AS written_per_s, AVG(metrics_float_values[3])/10 AS drop_per_s
      FROM deepflow_system.deepflow_system
      WHERE virtual_table_name = 'deepflow_server_ingester_ckwriter'
      GROUP BY host
      ORDER BY written_per_s
      DESC LIMIT 30;
      ```

      ```SQL
      -- Server packet loss queue view

      SELECT tag_values[1] AS host, tag_values[3] AS queue, AVG(metrics_float_values[1])/10 AS avg_total_per_s, AVG(metrics_float_values[2])/10 AS avg_handled_per_s, AVG(metrics_float_values[3])/10 AS avg_drop_per_s
      FROM deepflow_system.deepflow_system
      WHERE virtual_table_name = 'deepflow_server_ingester_queue' AND time > now() - 900
      GROUP BY host, queue
      ORDER BY avg_drop_per_s, avg_total_per_s
      DESC LIMIT 30;
      ```

- Check packet loss when the server writes to Clickhouse:
  <img src="./imgs/server_drop.png">

      |   Queue Name                                              |   Queue Count Configuration           |   Queue Length Configuration              |   Queue Description       |
      |   ---                                                     |   ----                                |   ---                                     |   ----                    |
      |   1-recv-unmarshall                                       |   unmarshall-queue-count              |   unmarshall-queue-size                   |   Metric data processing queue |
      |   1-receive-to-decode-l4/l7                               |   flow-log-decoder-queue-count        |   flow-log-decoder-queue-size             |   Flow log processing queue |
      |   1-receive-to-decode-telegraf/prometheus/deepflow_stats  |   ext-metrics-decoder-queue-count     |   ext-metrics-decoder-queue-size          |   Other data processing queue |
      |   1-receive-to-decode-profile                             |   profile-decoder-queue-count         |   profile-decoder-queue-size              |   Performance analysis data processing queue |
      |   1-receive-to-decode-proc_event                          |   perf-event-decoder-queue-count      |   perf-event-decoder-queue-size           |   IO and other event processing queue |
      |   1-receive-to-decode-raw_pcap                            |   pcap-queue-count                    |   pcap-queue-size                         |   pcap packet processing queue |
      |   flow_metrics- prefix                                    |   metrics-ck-writer->queue-count      |   metrics-ck-writer->queue-size           |   Metric data write queue |
      |   flow_log-l7_packet prefix                               |   pcap-ck-writer->queue-count         |   pcap-ck-writer->queue-size              |   pcap data write queue |
      |   flow_log- prefix except flow_log-l7_packet              |   flowlog-ck-writer->queue-count      |   flowlog-ck-writer->queue-size           |   Flow log data write queue |
      |   ext_metrics- prefix                                     |   ext_metrics-ck-writer->queue-count  |   ext_metrics-ck-writer->queue-size       |   Other data write queue |
      |   profile- prefix                                         |   profile-ck-writer->queue-count      |   profile-ck-writer->queue-size           |   Performance analysis data write queue |

- Handling other types of packet loss:
  <img src="./imgs/other_drop.png">

  | Type                | Metric Set         | Metric                       |
  | ------------------- | ------------------ | ---------------------------- |
  | Queue Packet Loss   | ingester.queue     | metrics.overwritten          |
  | Flow Log Sampling Loss | ingester.decoder | metrics.drop_count           |
  | Data Write Packet Loss | ingester.ckwriter | metrics.write_failed_count   |
  | Invalid Data Packet Loss | ingester.receiver | metrics.invalid             |

  - Handling Flow Log Sampling Loss:
    - Check the corresponding queue packet loss through the Dashboard: DeepFlow Server - Ingester in the flow log (throttle-drop) panel.
    - By default, L4/L7 flow log processing is 50k/s. If CPU, memory, and disk are sufficient, you can increase the throttle to enhance processing capacity.
    - Adjust the configuration parameters of the [Ingester](https://github.com/deepflowio/deepflow/blob/main/server/server.yaml#L347) module to increase processing capacity and avoid packet loss.
  - Handling Data Write Packet Loss:
    - Filter server logs for `write block failed` to see the reason for write failures.
    - If using PV, check if there is available space in the backend storage.
    - If using hostPath, check if there is available space on the local disk.
  - Handling Invalid Data Packet Loss:
    - Filter server logs for `TCP client` to get the IP address of the invalid data sender.
      - If sent by DeepFlow-Agent, confirm whether the DeepFlow-Agent and DeepFlow-Server versions are consistent.
      - If not sent by DeepFlow-Agent, block the IP from sending data to the data node's listening port (default: 30033), or increase the alert threshold to suppress alerts generated by such IPs sending data.

# Introduction

Using [Golang Profile](https://go.dev/blog/pprof), we can capture and analyze the data write performance of DeepFlow Server for optimization.

# Steps

1. Install the [deepflow-ctl](../ce-install/upgrade/#%E5%8D%87%E7%BA%A7-deepflow-cli) tool.
2. Find the DeepFlow Server Pod IP that needs Profile analysis. If the number of DeepFlow Server replicas is greater than 1, select any one of them:

```bash
deepflow_server_pod_ip=$(kubectl -n deepflow get pods -o wide | grep deepflow-server | awk '{print $6}')
```

3. Enable the Profile feature:

```bash
deepflow-ctl -i $deepflow_server_pod_ip ingester profiler on
```

# Get CPU Profile

```bash
go tool pprof http://$deepflow_server_pod_ip:9526/debug/pprof/profile
```

After executing the command, the default sampling time is 30s. You can modify the Profile duration by adding the `seconds=x` parameter, such as `http://$deepflow_server_pod_ip:9526/debug/pprof/profile?seconds=60`. After the Profile ends, you can enter the `svg` command to generate a vector format Profile result graph and copy it locally to view it through a browser.

# Get Memory Profile

```bash
go tool pprof http://$deepflow_server_pod_ip:9526/debug/pprof/heap
```

After executing the command, real-time sampling will be performed to obtain the current memory snapshot. Similarly, you can enter the `svg` command to generate a vector format Profile result graph and copy it locally to view it through a browser.

# Other Profile Information

If you want to obtain other Profile information, you can find all types available for analysis in the [Golang SourceCode](https://github.com/golang/go/blob/master/src/net/http/pprof/pprof.go#L350).