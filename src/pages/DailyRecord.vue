<template>
    <div class="daily-records">
        <!-- <keep-alive> -->
        <div class="top">
            <el-date-picker
                v-model="dateValue"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
            <!-- </keep-alive> -->
            <button class="today-button" @click="dateValue = new Date()">今天</button>
            <button class="add" @click="toAdd">+</button>
        </div>
        
        <div class="month-progress">
            <span>本月进度  </span>
            <div class="progress-bar">
                <el-progress 
                    :text-inside="true" 
                    :stroke-width="26" 
                    :percentage="Number(dayOfMonth)" >
                </el-progress>
            </div>
        </div>
        <div class="summary">
            <div class="summary-box">
                <label class="summary-text">今日收支</label>
                <div class="daily-total">￥{{dailyTotal}}</div>
            </div>
            <div class="vertical-line"></div>
            <div class="summary-box">
                <label class="summary-text">剩余积蓄</label>
                <div class="remain-saving">￥{{savings.saving}}</div>
            </div>
        </div>
        <RecordList />
        <div>{{dateValue}}</div>
        <Tabbar />
        
        <button class="date-shift-button left" @click="shiftDay(-1)">&lt;</button>
        <button class="date-shift-button right" @click="shiftDay(1)">&gt;</button>
    </div>
</template>

<script>
// import vueDatepickerUi from 'vue-datepicker-ui'
import 'vue-datepicker-ui/lib/vuedatepickerui.css'
import RecordList from '../components/RecordList.vue'
import {mapState, mapGetters} from 'vuex'
import Tabbar from '../components/tabbar.vue'
export default {
    data() {
        return {
            dateValue: new Date(),
        }
    },
    components: {
        // DatePicker: vueDatepickerUi,
        // DatePicker,
        RecordList,
        Tabbar,
    },
    computed: {
        ...mapState(["savings"]),
        ...mapGetters(['dailyTotal']),
        dayOfMonth() {
            let now = new Date(),
                day = now.getDate(),
                totalDay = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()
            return Number(day / totalDay * 100).toFixed(1)
        }
    },
    watch: {
        dateValue: {
            handler: function(newVal) {
                this.$store.commit("setChosenDay", newVal)
                // this.$store.commit("initData")
                this.$store.commit("checkRecordsState")
            },
            deep: true
        },
    },
    methods: {
        toAdd() {
            this.$router.push(`/record/add`)
        },
        shiftDay(n) {
            this.dateValue.setDate(this.dateValue.getDate() + n)
            console.log("==============================")
            console.log("dateValue:", this.dateValue)
            this.$store.commit("setChosenDay", this.dateValue)
            this.$store.commit("initData")
        },
        progressFormat(percentage) {
            return `本月进度 ${Math.round(percentage)}%`
        }
    },
    created() {
        console.log("DailyRecord created!")
        console.log("dateValue:", this.dateValue)
        this.$store.commit("setChosenDay", this.dateValue)
        this.$store.commit("initData")
    },
}
</script>

<style lang="scss">
.daily-records {
    display: flex;
    flex-direction: column;
    gap: 15px;
    // max-width: 600px;
    min-height: 80vh;
    // margin: 20px;
    border-radius: 10px;
    // box-shadow: 2px 2px 10px rgba(168, 155, 150, .8);
    border-top: 5px solid rgb(245, 212, 102);
    overflow: auto;
    position: relative;
    padding: 20px;
}
.top {
    width: 100%;
    display: flex;
    gap: 10px;
    .date-picker {
        max-width: 300px;
        // cursor: pointer;
    }
    .today-button {
        max-width: 100px;
        border: none;
        cursor: pointer;
        border-radius: 6px;
    }
    .add {
        cursor: pointer;
        --size: 60px;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        font-size: 50px;
        text-align: center;
        line-height: var(--size);
        outline: none;
        border: none;
        box-shadow: 1px 1px 1px 1px lightblue;

        position: absolute;
        top: 20px;
        right: 20px;
        
        transition: .3s;
        &:hover {
            transform: scale(1.1);
        }
    }
}

.month-progress {
    margin-top: 15px;
    span {
        margin-right: 10px;
    }
    .progress-bar {
        width: 70%;
        display: inline-block;
    }
}

.summary {
    height: 85px;
    margin-top: 15px;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    box-shadow: 1px 2px 10px rgb(130, 163, 173);
    .summary-box {
        width: 45%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
    }
}



.date-shift-button {
    width: 40px;
    height: 100px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    border-radius: 0 10px 10px 0;
    transition: .5s;
}
.left {
    left: 0;
}
.right {
    right: 0;
    border-radius: 10px 0 0 10px;
}
.date-shift-button:hover {
    /* border: 1px solid rgba(50,50,50,.5); */
    box-shadow: 2px 2px 5px rgba(10,50,50,.5);
}
.right:hover {
    box-shadow: -2px 2px 5px rgba(10,50,50,.5);
}
.vertical-line {
    height: 75%;
    width: 3px;
    background: rgb(104, 156, 172);
}
</style>