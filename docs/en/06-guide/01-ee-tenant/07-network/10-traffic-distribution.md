> This document was translated by GPT-4

---

title: Traffic Distribution
permalink: /guide/ee-tenant/network/traffic-distribution/

---

# Traffic Distribution

Traffic distribution supports the allocation of network traffic to different network devices or servers for processing or responding. Through traffic distribution technology, it improves the throughput of the network, balances network load, increases network reliability, optimizes network performance, and enhances network security.

## Overview

The distribution policies are displayed in tabular form, supporting the operations of creating, modifying, and deleting distribution strategies.

![10_1.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82c830aa.png)

- **① Create**: Supports the creation of a new distribution policy. For usage details, please refer to the [Creating a Policy] section
- **② Enable/Disable**: Choose to enable or disable the current distribution policy; after enabling, data filtering capture is performed
- **③ Edit**: Modify the selected distribution policy
- **④ Delete**: Delete the respective distribution policy

### Creating a Policy

![10_2.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82e79fa2.png)

- Creating a policy table, for part of it, refer to the [PCAP Download - Create a Policy] section
- Distribution action: Deal with captured traffic
  - Traffic processing: Choose whether to distribute data or discard it
  - Distribution point: Add a distribution point to perform operations, to add a distribution point, refer to the [Distribution Point] section

# Distribution Point

The distribution points are displayed in table form, showing all created distribution point information.

## Overview

![10_3.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82c830aa.png)

- **① Create a distribution point**: Supports the creation of a new distribution point. For usage details, please refer to the [Creating a Distribution Point] section
- **② Number of associated distribution policies**: Click to jump to the distribution strategy page to view the policies using this distribution point
- **③ Edit**: Modify the selected distribution point
- **④ Delete**: Delete the respective distribution point

### Creating a Distribution Point

![10_4.png](https://yunshan-guangzhou.oss-cn-beijing.aliyuncs.com/pub/pic/20230920650ac82fcea4c.png)

- Name: Enter the name of the distribution point
- Distribution protocol: Select the distribution protocol, supports XVLAN, ERSPAN, TCP-NPB protocols
- Distribution endpoint: Enter the IP address of the distribution point
