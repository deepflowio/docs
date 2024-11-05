---
title: Common Agent Failures
permalink: /diagnose/agent
---

> This document was translated by ChatGPT

# Agent Error Due to Significant System Time Rollback

## Symptoms

Panic appears in the agent logs with the term `SystemTimeError`.

## Cause

When the agent calculates the time difference, if the subtracted time is older (resulting in a negative time difference), the unprotected code will report an error.

## Solution

- Use ntpd or similar methods to slowly adjust the system time.
- If making a significant time adjustment, the agent needs to be restarted.