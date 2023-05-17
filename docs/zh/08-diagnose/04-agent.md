---
title: Agent 相关问题
permalink: /diagnose/agent
---

# 系统时间大幅回退导致 agent 出错

## 现象

Agent 日志中出现 panic，有 `SystemTimeError` 字样

## 原因

Agent 在进行时间差计算时，如果被减的时间更旧（时间差为负），未加保护的代码将报错

## 解决办法
- 使用 ntpd 等方式缓慢调整系统时间
- 如果大幅调整时间，需重启 agent