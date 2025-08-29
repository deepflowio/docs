---
title: Overview
permalink: /features/l7-protocols/overview
---

> This document was translated by ChatGPT

# Supported Application Protocols

To reduce resource overhead and avoid misidentification, the agent only parses the following application protocols by default:

- HTTP, HTTP2/gRPC, MySQL, Redis, Kafka, DNS, TLS.

To enable parsing of other application protocols, configure the agent's `l7-protocol-enabled`. All supported application protocols are listed as follows:  
[csv-L7 Protocol List](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)

# Call Log Field Description

The call log (`flow_log.l7_flow_log`) data table stores request logs for various protocols aggregated at a one-minute granularity, consisting of two main categories of fields: Tag and Metrics.

## Tags

Tag fields: Mainly used for grouping and filtering. Detailed field descriptions are as follows:

[csv-Database field descriptions of the querier component](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.en)

## Metrics

Metrics fields: Mainly used for calculations. Detailed field descriptions are as follows:

[csv-Database field descriptions of the querier component](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.en)