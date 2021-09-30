<template>
    <div class="record-expense">
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            createTime: '', // 消费时间
            content: '',
            costs: null,
            circumstance: '',
            payThrough: '',
            type: '',
            note: ''
        }
    },
    methods: {
        submitExpense() {
            let expense_record = {
                // 和airtable保持字段一致
            }
            this.$store.commit('addExpense', expense_record)
        }
    }
}
</script>