FROM nginx:1.20
#
COPY ./dist /usr/share/nginx/html/docs

ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

RUN ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/*

COPY ./nginx/default.conf /etc/nginx/conf.d/docs.conf
# rewrite 只能在 server 上下文使用,故不放 conf.d/(那里会被 include 进 http 块),
# 而是由 default.conf 的 server 块 include 本文件
COPY ./nginx/zh-only-redirects.conf /etc/nginx/zh-only-redirects.conf
