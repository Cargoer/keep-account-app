<template>
    <div class="add-record">
        <div class="tabbar">
            <button @click="switchRecordType('支出')">支出</button>
            <button @click="switchRecordType('收入')">收入</button>
        </div>
        <div class="choose-category">
            <div v-if="recordType == '支出'">
                <label for="category">类别 </label>
                <select name="category" id="category" v-model="category">
                    <option value="餐饮">餐饮</option>
                </select>
            </div>
            <div v-else>
                <label for="category">类别 </label>
                <select name="category" id="category" v-model="category">
                    <option value="余额宝收益">余额宝收益</option>
                </select>
            </div>
            <hr>
        </div>
        <div class="choose-account">
            <label for="account">账户 </label>
            <select name="account" id="account" v-model="accountType">
                <option value="alipay">支付宝</option>
                <option value="wechat">微信</option>
                <option value="abc">农业银行</option>
                <option value="cmb">招商银行</option>
            </select>
            <hr>
        </div>
        <div class="input-amount">
            <label>内容 <input type="text" class="long-text-input" v-model="content"></label>
            <label>金额 <input type="number" class="number-input" v-model="amount"></label>
        </div>
        <button v-if="!isDetail" @click="addRecord">添加</button>
        <div v-if="isDetail">
            <button @click="modifyRecord">修改</button>
            <button @click="deleteRecord">删除</button>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            // record字段
            category: '',
            accountType: '',
            content: '',
            amount: -1,
            recordType: '支出',

            // 控制字段
            isDetail: false // 是否点击记录进入详情
        }
    },
    props: {page:{}},
    computed: {
        ...mapState(["chosenDay", "curRecord"])
    },
    methods: {
        switchRecordType(str) {
            this.recordType = str
        },
        addRecord() {
            let record = {
                createTime: this.chosenDay.toISOString().split('T')[0],
                amount: Number(this.amount),
                content: this.content,
                recordType: this.recordType,
                category: this.category,
                accountType: this.accountType
            }
            console.log(record)
            this.$store.commit("insert", record)
            this.$router.push('/daily_record')
        },
        modifyRecord() {
            let change = {
                amount: Number(this.amount),
                content: this.content,
                category: this.category,
                accountType: this.accountType
            }
            this.$store.commit("update", {
                id: this.curRecord.id,
                change: change
            })
            this.$router.push('/daily_record')
        },
        deleteRecord() {
            this.$store.commit("delete", [this.curRecord.id])
            this.$router.push('/daily_record')
        }
    },
    created() {
        // this.isDetail = this.isDetail
        console.log(this.page)
        if(this.page == 'detail') {
            if(!this.curRecord){
                console.log("err: do not get current record!")
                return
            }
            this.category = this.curRecord.category
            this.accountType = this.curRecord.accountType
            this.content = this.curRecord.content
            this.amount = this.curRecord.amount
            this.recordType = this.curRecord.recordType
        }
    }
}
</script>

<style>

</style>