import Airtable from 'airtable'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

var base = new Airtable({apiKey: 'YOUR_API_KEY'}).base('YOUR_BASE_KEY');
var table = base('records_test'), savingTable = base('saving_test')
const savingId = 'recFolhzu0j0V2ADk' // test
// const savingId = 'reca22Hd66BFUBolR'

const store = new Vuex.Store({
  state: {
    // 可变项
    records: [],
    chosenDay: new Date(),
    curRecord: {},
    savings: {},

    // 固定项（枚举项）
    enumeration: [],
  },
  getters: {
    dailyTotal(state) {
      console.log("records for dailyTotal:", state.records)
      let total = state.records.reduce((sum, item) => {
        return sum + (item.recordType == '支出'? -item.amount: item.amount)
      }, 0)
      console.log("total:", total)
      return total
    },
    expenseEnumeration(state) {
      return state.enumeration.filter(item => {
        return item.type == 'expense'
      })
    },
    incomeEnumeration(state) {
      return state.enumeration.filter(item => {
        return item.type == 'income'
      })
    },
    accountEnumeration(state) {
      return state.enumeration.filter(item => {
        return item.type == 'account'
      })
    },
  },
  mutations: {
    setCurRecord(state, record) {
      state.curRecord = record
    },
    setChosenDay(state, date) {
      state.chosenDay = date
    },
    insert(state, record) {
      table.create(record, (err, row) => {
        if(err) {
          console.log("insertErr:", err)
          return
        }
        // 插入收支记录
        var insertId = row.getId()
        record.id = insertId
        state.records.unshift(record)
        table.update(insertId, {
          "id": insertId
        }, (err) => {
          err && console.log("updateIdErr:", err)
        })
        // 更新积蓄
        var delta = record.recordType == '支出'? (-record.amount): record.amount
        state.savings.saving += delta
        state.savings[record.accountType] += delta
        savingTable.update(savingId, {
          [record.accountType]: state.savings[record.accountType]
        }, (err) => {err && console.log("update-saving err:", err)})
      })
    },
    update(state, payload) {
      state.records = state.records.map(item => {
        if(item.id === payload.id) {
          item = {...item, ...payload.change}
        }
        return item
      })
      console.log("payLoad after:", payload)
      // 更新收支记录
      table.update(payload.id, payload.change, (err) => {
        err && console.log("updateErr:", err)
      })
      // 更新积蓄，逻辑待整理
      // 1. 只改金额，对应账户的金额+=delta
      // 2. 只改账户，前账户金额-=amount，后账户金额+=amount
      // 3. 都改，前账户金额-=formerAmount，后账户金额+=curAmount
      let formerAmount = payload.formerData.amount,
          formerAccountType = payload.formerData.accountType, 
          curAmount = payload.change.amount,
          curAccountType = payload.change.accountType
      // 1. 只改金额，对应账户的金额+=delta
      if(formerAmount !== curAmount && formerAccountType == curAccountType) {
        let delta = curAmount - formerAmount
        state.savings.saving += delta
        state.savings[curAccountType] += delta
        savingTable.update(savingId, {
          [payload.change.accountType]: state.savings[curAccountType]
        }, (err) => {err && console.log("update-saving err:", err)})
      }
      // 2. 只改账户，前账户金额-=amount，后账户金额+=amount
      if(formerAmount == curAmount && formerAccountType != curAccountType){
        state.savings[formerAccountType] -= curAmount
        state.savings[curAccountType] += curAmount
        savingTable.update(savingId, {
          [formerAccountType]: state.savings[formerAccountType],
          [curAccountType]: state.savings[curAccountType]
        }, (err) => {err && console.log("update-saving err:", err)})
      }
      // 3. 都改，前账户金额-=formerAmount，后账户金额+=curAmount
      if(formerAmount != curAmount && formerAccountType != curAccountType){
        state.savings[formerAccountType] -= formerAmount
        state.savings[curAccountType] += curAmount
        savingTable.update(savingId, {
          [formerAccountType]: state.savings[formerAccountType],
          [curAccountType]: state.savings[curAccountType]
        }, (err) => {err && console.log("update-saving err:", err)})
      }
    },
    delete(state, ids) {
      state.records = state.records.filter(item => {
        return ids.indexOf(item.id) === -1
      })
      let deletedRecords = []
      table.destroy(ids, (err, records) => {
        deletedRecords = records
        err && console.log("deleteErr:", err)
      })
      console.log("deletedRecords:", deletedRecords)
      deletedRecords.forEach((item) => {
        state.savings.saving -= item.amount
        state.savings[item.accountType] -= item.amount
        savingTable.update(savingId, {
          [item.accountType]: state.savings[item.accountType]
        }, (err) => {err && console.log("update-saving err:", err)})
      })
    },
    initData(state) {
      // 初始化数据
      console.log("initData!")
      console.log("chosenDay:", state.chosenDay)
      let curDate = state.chosenDay
      curDate.setHours(curDate.getHours() + 8)
      console.log("iso:", curDate.toISOString().split('T')[0])
      let tempRecords = []
      // 初始化收支记录
      table
        .select({
          view: "Grid view",
          // filterByFormula: `createTime = "${curDate.toISOString().split('T')[0]}"` // 这里还有待确认！！！
        })
        .eachPage(function Page(records, fetchNextPage) { // eachPage?
          console.log("records in each page:", records)
          tempRecords = [...tempRecords, ...records.map(item => item.fields)]
          fetchNextPage()
        }, function done(err) {
          if (err) { 
            console.error("check state err:", err); 
            return; 
          }
          console.log("tempRecords:", tempRecords)
          state.records = tempRecords.filter(record => record.createTime == curDate.toISOString().split('T')[0])
          console.log("records after checkState:", state.records)
        })
      // 初始化积蓄信息
      savingTable
        .select({
          view: "Grid view",
        })
        .firstPage((err, records) => {
          if(err) {
            console.log("initData-saving err:", err)
            return
          }
          state.savings = records[0].fields
          console.log("savings:", state.savings)
        })
      // 初始化枚举信息
      base('enumeration')
        .select({
          view: 'Grid view',
        })
        .firstPage((err, records) => {
          if(err) {
            console.log("get expense category err:", err)
            return
          }
          state.enumeration = records.map(item => item.fields)
        })
    },
    checkRecordsState(state) {
      console.log("checkRecordsState!")
      console.log("chosenDay:", state.chosenDay)
      let curDate = state.chosenDay
      curDate.setHours(curDate.getHours() + 8)
      console.log("iso:", curDate.toISOString())
      let tempRecords = []
      // 初始化收支记录
      table
        .select({
          view: "Grid view",
          // filterByFormula: `createTime = "${curDate.toISOString().split('T')[0]}"` // 这里还有待确认！！！
        })
        .eachPage(function Page(records, fetchNextPage) { // eachPage?
          console.log("records in each page:", records)
          tempRecords = [...tempRecords, ...records.map(item => item.fields)]
          fetchNextPage()
        }, function done(err) {
          if (err) { 
            console.error("check state err:", err); 
            return; 
          }
          console.log("tempRecords:", tempRecords)
          state.records = tempRecords.filter(record => record.createTime == curDate.toISOString().split('T')[0])
          console.log("records after checkState:", state.records)
        })
    },
    setAirtableSavings(state) {
      delete state.savings.saving
      savingTable.update("recFolhzu0j0V2ADk", state.savings, (err) => {
        err && console.log("setAirtableSavings err:", err)
      })
    }
  }
})

export default store