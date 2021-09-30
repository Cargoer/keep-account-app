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
            this.$router.push(`/record/add`)
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
</style>