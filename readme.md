# 解决电线谜题

[TOC]

《迷雾侦探》第一章中的接通电线问题，实在手残试不出来，遂写代码暴力破解之=。=

## 运行方法

```bash
node solve.js

> final solutions:
- BCBBB
- CBBDB
- DAAADA
- DBBCD
- DBCDBD
- DBDBCD
- DCD
- DDDCD
```

## 编程模型

目标：通过操作旋钮，连通左上角和右下角的电门。

- A、B、C、D 代表四个旋钮，按动旋钮，则将附近四个砖块，整体旋转90°
- 0、1、2、3 代表四个触点，每个砖块的电线都连接两个触点
- 0、1、2、3、4、5、6、7、8 代表九个砖块

![riddle](./assets/riddle.png)