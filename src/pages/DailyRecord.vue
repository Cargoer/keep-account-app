<template>
    <div class="daily-records">
        <DatePicker 
            v-model="dateValue"
            lang="ch" 
        />
        <RecordList />
        <button class="add" @click="toAdd">+</button>
    </div>
</template>

<script>
import vueDatepickerUi from 'vue-datepicker-ui'
import 'vue-datepicker-ui/lib/vuedatepickerui.css'
import RecordList from '../components/RecordList.vue'
export default {
    data() {
        return {
            dateValue: new Date()
        }
    },
    components: {
        DatePicker: vueDatepickerUi,
        RecordList
    },
    watch: {
        dateValue: function(newVal) {
            console.log(newVal)
        }
    },
    methods: {
        toAdd() {
            
        }
    },
    onShow() {
        console.log("DailyRecord onShow!")
        this.$store.commit("initData")
    },
    onLoad() {
        console.log("DailyRecord onLoad!")
    },
    created() {
        console.log("DailyRecord created!")
        this.$store.commit("initData")
    }
}
</script>

<style>
.daily-records {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.add {
    --size: 80px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    font-size: 50px;
    text-align: center;
    line-height: var(--size);

    position: fixed;
    bottom: 15px;
}
</style>