<template>
  <div class="record-list">
    <div v-for="(item, index) in records" :key="index">
      <Record :record="item"/>
    </div>
    
  </div>
</template>

<script>
import Record from './Record.vue'
import {mapState} from 'vuex'

export default {
  components: { Record },
  computed: {
    ...mapState(["records", "savings"])
  }
}
</script>

<style>
.record-list {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  padding: 15px 10px;
  /* box-shadow: 1px 1px 2px gray; */
  box-sizing: border-box;
  width: 100%;
}
.saving {
  padding: 10px 0;
}
</style>