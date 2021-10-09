<template>
    <div class="daily-records">
        <keep-alive>
            <DatePicker 
                v-model="dateValue"
                lang="ch" 
            />
        </keep-alive>
        <button class="today-button" @click="dateValue = new Date()">今天</button>
        <RecordList />
        <button class="add" @click="toAdd">+</button>
        <button class="date-shift-button left" @click="shiftDay(-1)">&lt;</button>
        <button class="date-shift-button right" @click="shiftDay(1)">&gt;</button>
    </div>
</template>

<script>
import vueDatepickerUi from 'vue-datepicker-ui'
import 'vue-datepicker-ui/lib/vuedatepickerui.css'
import RecordList from '../components/RecordList.vue'
export default {
    data() {
        return {
            dateValue: new Date(),
        }
    },
    components: {
        DatePicker: vueDatepickerUi,
        RecordList
    },
    watch: {
        dateValue: {
            handler: function(newVal) {
                console.log("newVal:", newVal)
                this.$store.commit("setChosenDay", newVal)
                this.$store.commit("initData")
            },
            deep: true
        },
    },
    methods: {
        toAdd() {
            this.$router.push(`/record/add`)
        },
        shiftDay(n) {
            let tempDate = this.dateValue
            // this.dateValue.setDate(this.dateValue.getDate() + n)
            tempDate.setDate(tempDate.getDate() + n)
            this.dateValue = new Date(tempDate)
            console.log("after shift:", this.dateValue)
        }
    },
    created() {
        console.log("DailyRecord created!")
        this.$store.commit("initData")
    },
}
</script>

<style>
.daily-records {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 600px;
    min-height: 80vh;
    margin: 20px;
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(168, 155, 150, .8);
    overflow: auto;
    position: relative;
}
.add {
    --size: 80px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    font-size: 50px;
    text-align: center;
    line-height: var(--size);

    position: absolute;
    top: 15px;
    right: 10px;
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
</style>