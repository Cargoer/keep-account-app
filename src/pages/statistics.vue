<template>
  <div>
    这里还没有东西哦！
    <div class="daily_statistics">
      <ve-line :data="dailyData" :settings="dailySettings"></ve-line>
    </div>
    <div class="category_statistics">
      <ve-pie :data="categoryData" :settings="categorySettings"></ve-pie>
    </div>
    <Tabbar />
  </div>
</template>

<script>
import Tabbar from '../components/tabbar.vue'
import {mapState} from 'vuex'
export default {
  components: {
    Tabbar,
  },
  data() {
    return {
      dailyPrice: [62, 50, 49, 66, 60, 53, 45],
      dailyData: {
        columns: ['日期', '支出'],
        rows: []
      },
      dailySettings: {

      },
      categoryData: {
        columns: ['支出类型', '支出金额'],
        rows: [
          {'支出类型': '餐饮', '支出金额': 1853},
          {'支出类型': '交通', '支出金额': 200},
          {'支出类型': '日用', '支出金额': 674},
          {'支出类型': '住房', '支出金额': 2700},
          {'支出类型': '服饰', '支出金额': 1000},
        ]
      },
      categorySettings: {
        limitShowNum: 6
      }
    }
  },
  computed: {
    ...mapState(["records"])
  },
  created() {
    this.initStatistics()
  },
  methods: {
    initStatistics() {
      let today = new Date()
      let [year, month, day, dayOfWeek] = [today.getFullYear(), today.getMonth(), today.getDate(), today.getDay()]
      let startOfWeek = new Date(year, month, day - (dayOfWeek? 7: dayOfWeek) + 1)
      let endOfWeek = new Date(year, month, day - (dayOfWeek? 7: dayOfWeek) + 7)
      console.log(`the week: ${startOfWeek} to ${endOfWeek}`)
      this.dailyPrice = this.records.filter(item => {
        return item.createTime >= startOfWeek && item.createTime <= endOfWeek
      }).map(item => item.amount)
      console.log("dailyPrice:", this.dailyPrice)
      for(let i = 0; i < 7; i++) {
        this.dailyData.rows.push({
          [this.dailyData.columns[0]]: i,
          [this.dailyData.columns[1]]: this.dailyPrice?.[i] || 0
        })
      }
    }
  }
}
</script>

<style lang="scss">

</style>