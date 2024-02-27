#!/bin/bash

# 遍历当前目录下的所有符合条件的文件
for file in [0-9][0-9]-*.md; do
  # 提取文件名开头的两位数字并增加2
  prefix=$(echo $file | cut -d'-' -f1)
  if [[ "$prefix" = "01" || "$prefix" = "02" ]]; then
    continue
  fi

  new_prefix=$(printf "%02d" $((10#$prefix + 2)))
  new_name="${new_prefix}$(echo $file | cut -c3-)"

  # 重命名文件
  mv "$file" "$new_name"
done
