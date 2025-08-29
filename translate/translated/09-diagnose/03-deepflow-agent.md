---
title: Common Agent Failures
permalink: /diagnose/agent
---

> This document was translated by ChatGPT

# Significant System Time Rollback Causes Agent Errors

## Symptoms

A panic appears in the agent logs, containing the term `SystemTimeError`.

## Cause

When the agent calculates the time difference, if the subtracted time is earlier (resulting in a negative time difference), unprotected code will throw an error.

## Solution

- Use tools like ntpd to gradually adjust the system time.
- If the time is adjusted significantly, restart the agent.