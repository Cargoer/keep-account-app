<template>
    <div class="add-record fc">
        <div class="tabbar">
            <button @click="switchRecordType('支出')" class="button" :class="{active: recordType == '支出'}">支出</button>
            <button @click="switchRecordType('收入')" class="button" :class="{active: recordType == '收入'}">收入</button>
        </div>
        <div class="choose-category">
            <label>收支类别 - {{category? category: '请选择'}} </label>
            <scroll-view class="fr">
                <div
                    v-for="(item, index) in (recordType == '支出'? expenseEnumeration: incomeEnumeration)"
                    :key="index"
                    @click="setCategory(item)"
                    :class="['chooseIcon', {chosen: category == item}]"
                >{{item}}</div>
            </scroll-view>
        </div>
        <div class="choose-account">
            <label>收支账户 - {{accountType? accountType: '请选择'}} </label>
            <scroll-view class="fr">
                <div
                    v-for="(item, index) in accountEnumeration"
                    :key="index"
                    @click="setAccount(item)"
                    :class="['chooseIcon', {chosen: accountType == item}]"
                >{{item}}</div>
            </scroll-view>
            <hr>
        </div>
        <div class="input-amount">
            <label>内容 <input type="text" class="long-text-input" v-model="content"></label>
            <label>金额 <input type="number" class="number-input" v-model="amount"></label>
        </div>
        <button v-if="this.page == 'add'" @click="addRecord">添加</button>
        <div v-if="this.page == 'detail'">
            <button @click="modifyRecord">修改</button>
            <button @click="deleteRecord">删除</button>
        </div>
        <button @click="navBack">返回</button>
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
            amount: null,
            recordType: '支出',

            // 控制字段
            isDetail: false, // 是否点击记录进入详情

            // 固定
            accountEnumeration: ['alipay', 'wechat', 'abc', 'cmb'],
            expenseEnumeration: ['餐饮'],
            incomeEnumeration: ['余额宝收益'],
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
        },
        setAccount(val) {
            this.accountType = val
        },
        setCategory(val) {
            this.category = val
        },
        navBack() {
            this.$router.push('/daily_record')
        }
    },
    created() {
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
.fr {
    display: flex;
    gap: 15px;
}
.fc {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.tabbar {
    width: 600px;
    height: 50px;
}
.button {
    width: 300px;
    height: 50px;
    border-radius: 25px 0 0 25px;
    background-color: rgb(164, 224, 248);
    border: none;
    outline: none;
}
.button:last-child {
    border-radius: 0 25px 25px 0;
}
.active {
    background-color: rgb(83, 203, 250);
    transform: scale(1.05);
}
.chooseIcon {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid black;
}
.chosen {
    background-color: #000;
    color: #fff;
}
</style>