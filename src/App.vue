<template>
  <div id="app">
    <!-- <DailyRecord /> -->
    <router-view></router-view>
  </div>
</template>

<script>
// import DailyRecord from './pages/DailyRecord.vue'

export default {
  name: 'App',
  components: {
    // DailyRecord
  },
  created() {
    this.$router.push('/daily_record')
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
