<template>
  <div class="record fr" @click="toDetail">
    <div class="typeIcon"></div>
    <div class="content">{{record.content?record.content: record.category}}</div>
    <div class="amount">
      {{signOfRecord}}￥{{record.amount}}
    </div>
  </div>
</template>

<script>
export default {
  props: {record:{}},
  computed: {
    signOfRecord() {
      return this.record.recordType === '支出'? '-': '+'
    }
  },
  onShow() {
    console.log("Record onShow!")
    console.log("record:", this.record)
  },
  methods: {
    toDetail() {
      console.log("toDetail")
      this.$store.commit("setCurRecord", this.record)
      this.$router.push(`/record/detail`)
    }
  }
}
</script>

<style>
.fr {
  display: flex;
  align-items: center;
  gap: 10px;
}
.record {
  width: 90%;
  height: 80px;
  position: relative;
  border-bottom: 1px solid rgba(145, 145, 145, .6);
  padding: auto 10px;
  margin: 0 auto;
}
.typeIcon {
  --type-icon-size: 25px;
  width: var(--type-icon-size);
  height: var(--type-icon-size);
  border: 1px solid black;
}
.amount {
  position: absolute;
  right: 10px;
}
</style>