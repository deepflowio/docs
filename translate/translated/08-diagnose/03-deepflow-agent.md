---
title: Common Issues with Agent
permalink: /diagnose/agent
---

> This document was translated by GPT-4

# Issues with Agent Caused by Significant System Time Rollback

## Symptoms

The word `SystemTimeError` appears in the Agent log, indicating a panic.

## Cause

When Agent calculates the time difference, it will error out if the subtracted time is older (i.e., the time difference is negative) and the relevant code is not protected.

## Solutions

- Adjust the system time gradually using methods such as ntpd.
- If there's a need to significantly adjust the time, Agent needs to be restarted.
