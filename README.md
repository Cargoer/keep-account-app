# keep-account-app
---
### 我的记账应用
---

## usage
```shell
npm install
npm run serve
```
or
```shell
yarn install
yarn serve
```

## 开发日志
### 20210812
- [x] 设计数据字段，并在airtable建立相应的表

1. 支出表

| 字段名     | 类型        | 取值范围 | 备注                 |
| ---------- | ----------- | -------- | -------------------- |
| id（主键） | String      |          | 由airtable产生       |
| 产生时间   | Date        |          | 进行记账的时间       |
| 消费内容   | String      |          | 包括线下和线上交易   |
| 消费金额   | Number(.00) | > 0      |                      |
| 消费场景   | String      |          | 应设置可选项便于输入 |
| 消费途径   | Enumeration | 待设置   | 通过什么进行付款     |
| 消费类型   | Enumeration | 待设置   |                      |
| 备注       | String      |          | 保留字段             |

消费途径取值：储蓄表对应字段

消费类型取值（暂定）：餐饮、交通、日用、服饰、住房、娱乐、数码、...

消费场景可选值：家里、商超、

2. 收入表

| 字段名     | 类型        | 取值范围 | 备注                   |
| ---------- | ----------- | -------- | ---------------------- |
| id（主键） | String      |          | 由airtable产生         |
| 产生时间   | Date        |          | 进行记账的时间，可选择 |
| 收入金额   | Number(.00) | > 0      |                        |
| 收入类型   | Enumeration | 待设置   | 通过什么渠道获得的收入 |
| 收入去向   | Enumeration |          | 收入金额存入哪里      |
| 备注       | String      |          | 细分，保留字段         |

2. 储蓄表

| 字段名         | 类型        | 取值范围 | 备注 |
| -------------- | ----------- | -------- | ---- |
| 支付宝余额     | Number(.00) | >= 0     |      |
| 微信余额       | Number(.00) | >= 0     |      |
| 农业银行卡余额 | Number(.00) | >= 0     |      |
| 招商银行卡余额 | Number(.00) | >= 0     |      |
| 现金余额       | Number(.00) | >= 0     |      |



- [ ] 设计UI，并实现界面

理想思路：横向切换日期，纵向切换记账记录，tab切换支出和收入，添加按钮放在右下角。

- [ ] 编写airtable相关的公共接口
- [ ] 实现记账记录的提交和显示
- [ ] 在同一天下进行批量操作，而不用每一条记录都输入时间
- [ ] 消费类型使用图标展示，且可以自行增添删除
- [ ] 进入应用始终显示当前日期

### 20210824
UI层面的设计讨论
1. 关于日期选择器（设为一个组件）
* 年份采用弹出选择，月份和日采用滑动选择
* 进入应用相应选择器的显示当前日期情况
* 根据当前日期展示星期几
* 设置今日按钮，一键返回今日
* 设置收起按钮，点击后收起日期选择器，仅显示已选择的日期，点击这一显示，重新打开日期选择器（此项有待细节优化，收起和非收起的展示在高度上有较大的区别，需要UI打磨)
* 向左向右划实现前一天和后一天的切换

2. 关于记账记录展示
* 每项显示：记账类型（图标）/记账内容/记账金额（支出为负，收入为正）
* 点击记录项进入编辑/删除选择页面 or 长按弹出编辑/删除选择按钮 or 设置点击项点击弹出编辑/选择按钮
* 当日汇总：显示当日所有记录金额的和，即净支出以及当前储蓄金额（此两项由airtable计算存储得到）

3. 关于添加记账记录（写成一个页面，模式：添加）
* 设置支出/收入的tab切换
* 记账类型和记账来源去向以图标形式展现，每项最多显示3行，多出的以横向滑动的形式切换
    如何暗示横向滑动（左边或右边还有图标）？
* 选择好上述两个图标后，弹出记账金额的输入键盘（考虑自行编写）和备注输入框，尽可能弹出键盘后上面两项仍可以不被遮挡
* airtable添加对应的记账记录，并同时对储蓄表作出更新处理

4. 关于修改记账记录（或许可以和3.共享一个页面，模式：修改）
* 根据选择记录的信息，在页面中直接展示相应信息，并可以直接进行修改
* 修改完成后airtable进行相应更改

### 20210927
1. 合并收入表和支出表，在同一个状态管理器里管理状态
| 字段名       | 类型        | 取值范围 | 备注 |
| ----------- | ----------- | -------- | ---- |
| id          | String      | 由airtable产生     |      |
| createTime  | Date        | 2021-09-27以后     |      |
| amount      | Float(.00)  | >= 0     |      |
| content     | String      | 非空     |      |
| recordType  | Interger    | 0-支出 1-收入 |  |
| category    | Enumeration | 待枚举   |       |
| accountType | Enumeration | 见下定义 |       |
| note        | String      |         |  非必填      |

accountType: 0-alipay 1-wechat 2-cmb 3-abc 4-cash
2. 如何显示当天的收支记录，

### 20210930
1. 可正常展示收支记录，并可以按日期显示（UI尚未完善）
2. 新增添加收支记录功能（网页端直接输入，等开发小程序或app时需要开发弹出虚拟键盘）
3. 当前进入添加/详情页的数据传递不太合理，后续改为页面传参