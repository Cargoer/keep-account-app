<template>
    <div class="add-record fc">
        <div class="tabbar">
            <button @click="switchRecordType('支出')" class="button" :class="{active: recordType == '支出'}">支出</button>
            <button @click="switchRecordType('收入')" class="button" :class="{active: recordType == '收入'}">收入</button>
        </div>
        <el-radio-group v-model="recordType" style="width: 70%">
            <el-radio-button label="支出"></el-radio-button>
            <el-radio-button label="收入"></el-radio-button>
        </el-radio-group>
        <el-date-picker v-model="showDate"></el-date-picker>
        <div class="choose-category choose">
            <label>收支类别 - {{category? category: '请选择'}} </label>
            <el-divider content-position="left">收支类别 - {{category? category: '请选择'}}</el-divider>
            <div class="fr">
                <div
                    v-for="(item, index) in (recordType == '支出'? expenseEnumeration: incomeEnumeration)"
                    :key="index"
                    @click="setCategory(item.value)"
                    :class="['chooseIcon', 'fc', {chosen: category == item.value}]"
                >
                    <i :class="'el-icon-'+item.icon"></i>
                    <div>{{item.name}}</div>
                </div>
            </div>
        </div>
        <div class="choose-account choose">
            <label>收支账户 - {{accountType? accountType: '请选择'}} </label>
            <div class="fr">
                <div
                    v-for="(item, index) in accountEnumeration"
                    :key="index"
                    @click="setAccount(item.value)"
                    :class="['chooseIcon', {chosen: accountType == item.value}]"
                >
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="'#'+item.icon"></use>
                    </svg>
                    <div>{{item.name}}</div>
                </div>
            </div>
        </div>
        <div class="input-amount fc">
            <label>内容 <input type="text" class="long-text-input" v-model="content" @focus="toggleKeyboard()"></label>
            <label>金额 <input type="text" class="number-input" v-model="amount"></label>
        </div>
        <div class="op-buttons fr">
            <button v-if="this.page == 'add'" class="op-button" @click="addRecord">添加</button>
            <button v-if="this.page == 'detail'" class="op-button" @click="modifyRecord">修改</button>
            <button v-if="this.page == 'detail'" class="op-button" @click="deleteRecord">删除</button>
            <button class="op-button" @click="navBack">返回</button>
        </div>
        <inputKeyboard 
            ref="keyboard" 
            @amtInput="setAmtInput"
            @amtDelete="deleteAmtInput"
        />
        
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import '../static/iconfont'
import inputKeyboard from '@/components/inputKeyboard'
export default {
    data() {
        return {
            // record字段
            category: '',
            accountType: '',
            content: '',
            amount: '',
            recordType: '支出',
            formerAmount: '',
            formerAccountType: '',

            // 控制字段
            isDetail: false, // 是否点击记录进入详情
        }
    },
    props: {page:{}},
    components: {inputKeyboard},
    computed: {
        ...mapState(["chosenDay", "curRecord"]),
        ...mapGetters(["expenseEnumeration", "incomeEnumeration", "accountEnumeration"]),
        showDate: {
            get() {
                return this.curRecord?.createTime || this.chosenDay
            },
            set(val) {
                this.$store.commit("setChosenDay", val)
            }
        }
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
            let payLoad = {
                id: this.curRecord.id,
                change: change,
                formerData: {
                    amount: this.formerAmount,
                    accountType: this.accountType
                }
            }
            console.log("payLoad before:", payLoad)
            this.$store.commit("update", payLoad)
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
        },
        toggleKeyboard() {
            this.$refs.keyboard.toggleKeyboard()
        },
        setAmtInput(val) {
            console.log('set amt input:', val)
            this.amount += val
        },
        deleteAmtInput() {
            console.log('delete amt input')
            this.amount = this.amount.slice(0, -1)
        }
    },
    created() {
        console.log(this.page)
        if(this.page == 'detail') {
            if(!this.curRecord){
                console.log("err: do not get current record!")
                return
            }
            console.log("curRecord:", this.curRecord)
            this.category = this.curRecord.category
            this.accountType = this.curRecord.accountType
            this.formerAccountType = this.curRecord.accountType
            this.content = this.curRecord.content
            this.amount = this.curRecord.amount
            this.formerAmount = this.curRecord.amount
            this.recordType = this.curRecord.recordType
        }
    }
}
</script>

<style lang="scss">
.fr {
    display: flex;
    gap: 15px;
}
.fc {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
}
.add-record {
    max-width: 600px;
    margin: 20px;
    border-radius: 10px;
    // box-shadow: 2px 2px 10px rgba(168, 155, 150, .8);
    border-top: 5px solid rgb(245, 212, 102);
    overflow: auto;
    position: relative;
    padding: 20px;
    .tabbar {
        width: 100%;
        .button {
            width: 45%;
            height: 50px;
            border-radius: 25px 0 0 25px;
            background-color: rgb(164, 224, 248);
            border: none;
            outline: none;
            color: #fff
        }
        .button:last-child {
            border-radius: 0 25px 25px 0;
        }
        .active {
            background-color: rgb(83, 203, 250);
            transform: scale(1.05);
        }
    }
    .choose {
        width: 90%;
        position: relative;
        padding: 15px 10px 5px;
        border-top: 2px solid rgb(243, 215, 56);
        margin-top: 15px;
        label {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 0 10px;
        }
        .chooseIcon {
            box-sizing: border-box;
            cursor: pointer;
            width: 4.2em;
            i {
                font-size: 30px;
            }
            &.chosen {
                // background-color: #9fe;
                border: 2px solid rgb(83, 203, 250);
                border-radius: 4px;
            }
        }
    }
    .input-amount {
        width: 90%;
        border-top: 2px solid rgb(243, 215, 56);
        padding: 15px;
        label {
            width: 90%;
        }
        input {
            width: 60%;
            height: 25px;
            border: 2px solid rgb(92, 143, 163);
            border-radius: 8px;
        }
    }
}

.chooseIcon .icon {
    /* width: 40px;
    height: 40px; */
    font-size: 16px;
    /* border-radius: 5px; */
    /* border-radius: 1px solid rgb(164, 224, 248); */
}
.chosen svg {
    border: 2px solid rgb(83, 203, 250);
    border-radius: 6px;
}
.icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.icon use {
    width: 100%; height: 100%;
}
.op-button {
    width: 80px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 8px;
    background: rgb(66, 199, 252);
    color: #fff;
    cursor: pointer;
}
</style>