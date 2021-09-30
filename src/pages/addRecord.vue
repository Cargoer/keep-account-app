<template>
    <div class="add-record">
        <div class="tabbar">
            <button @click="switchRecordType('支出')">支出</button>
            <button @click="switchRecordType('支出')">支出</button>
        </div>
        <div class="choose-category">
            <div v-if="recordType == '支出'">

            </div>
            <div v-else>

            </div>
        </div>
        <div class="choose-account">

        </div>
        <div class="input-amount">
            
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            category: 0,
            accountType: '',
            content: '',
            amount: -1,
            recordType: '支出'
        }
    },
    methods: {
        switchRecordType(str) {
            this.recordType = str
        }
    }
}
</script>