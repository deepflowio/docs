---
title: Overview
permalink: /features/l7-protocols/overview
---

> This document was translated by ChatGPT

# Supported Application Protocols

[csv-L7 Protocol List](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/enum/l7_protocol)

# Call Log Field Descriptions

The call log (`flow_log.l7_flow_log`) data table stores request logs of various protocols aggregated on a minute-by-minute basis, consisting of two main categories: Tag and Metrics fields.

## Tags

Tag fields: These fields are primarily used for grouping and filtering. Detailed field descriptions are as follows.

[csv-querier component database field descriptions](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/tag/flow_log/l7_flow_log.en)

## Metrics

Metrics fields: These fields are primarily used for calculations. Detailed field descriptions are as follows.

[csv-querier component database field descriptions](https://raw.githubusercontent.com/deepflowio/deepflow/main/server/querier/db_descriptions/clickhouse/metrics/flow_log/l7_flow_log.en)
