<template>
  <div class="record fr">
    <div class="typeIcon"></div>
    <div class="content">{{record.content}}</div>
    <div class="amount">
      {{signOfRecord}}{{record.amount}}
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
  width: 300px;
  height: 80px;
  border-bottom: 1px solid rgba(145, 145, 145, .6);
  padding: auto 10px;
}
.typeIcon {
  width: 60px;
  height: 60px;
  border: 1px solid black;
}
.amount {
  position: absolute;
  right: 10px;
}
</style>