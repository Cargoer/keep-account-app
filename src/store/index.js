// import Airtable from 'airtable'
import Vue from 'vue'
import Vuex from 'vuex'
import Table from '@/api/airtable.js'
Vue.use(Vuex);

const apiKey = 'YOU_API_KEY'
const baseKey = 'YOU_BASE_KEY'
const recordsTableName = 'records_test'
const savingTableName = 'saving_test'
const savingId = 'recFolhzu0j0V2ADk' // test
// const savingId = 'reca22Hd66BFUBolR'


const store = new Vuex.Store({
  state: {
    recordsTable: new Table(apiKey, baseKey, recordsTableName),
    savingTable: new Table(apiKey, baseKey, savingTableName),
    enumerationTable: new Table(apiKey, baseKey, "enumeration"),
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
      state.recordsTable.addRecord(record).then(id => {
        record.id = id
        state.records.unshift(record)
        // 更新积蓄
        var delta = record.recordType == '支出'? (-record.amount): record.amount
        state.savings.saving += delta
        state.savings[record.accountType] += delta
        state.savingTable.updateRecord(savingId, {
          [record.accountType]: state.savings[record.accountType]
        }).catch(err => {
          console.error("update-saving err:", err)
        })
      }).catch(err => {
        console.error("insert err:", err)
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
      state.recordsTable.updateRecord(payload.id, payload.change)
        .catch(err => {
          console.error("update-record err:", err)
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
        state.savingTable.updateRecord(savingId, {
          [payload.change.accountType]: state.savings[curAccountType]
        }).catch(err => {
          console.log("update-saving err:", err)
        })
        // savingTable.update(savingId, {
        //   [payload.change.accountType]: state.savings[curAccountType]
        // }, (err) => {err && console.log("update-saving err:", err)})
      }
      // 2. 只改账户，前账户金额-=amount，后账户金额+=amount
      if(formerAmount == curAmount && formerAccountType != curAccountType){
        state.savings[formerAccountType] -= curAmount
        state.savings[curAccountType] += curAmount
        state.savingTable.updateRecord(savingId, {
          [formerAccountType]: state.savings[formerAccountType],
          [curAccountType]: state.savings[curAccountType]
        }).catch(err => {
          console.log("update-saving err:", err)
        })
        // savingTable.update(savingId, {
        //   [formerAccountType]: state.savings[formerAccountType],
        //   [curAccountType]: state.savings[curAccountType]
        // }, (err) => {err && console.log("update-saving err:", err)})
      }
      // 3. 都改，前账户金额-=formerAmount，后账户金额+=curAmount
      if(formerAmount != curAmount && formerAccountType != curAccountType){
        state.savings[formerAccountType] -= formerAmount
        state.savings[curAccountType] += curAmount
        state.savingTable.updateRecord(savingId, {
          [formerAccountType]: state.savings[formerAccountType],
          [curAccountType]: state.savings[curAccountType]
        }).catch(err => {
          console.log("update-saving err:", err)
        })
        // savingTable.update(savingId, {
        //   [formerAccountType]: state.savings[formerAccountType],
        //   [curAccountType]: state.savings[curAccountType]
        // }, (err) => {err && console.log("update-saving err:", err)})
      }
    },
    delete(state, ids) {
      state.records = state.records.filter(item => {
        return ids.indexOf(item.id) === -1
      })
      state.recordsTable.deleteRecord(ids)
        .then(deletedRecords => {
          deletedRecords.forEach((item) => {
            state.savings.saving -= item.amount
            state.savings[item.accountType] -= item.amount
            state.savingTable.updateRecord(savingId, {
              [item.accountType]: state.savings[item.accountType]
            }).catch(err => {
              console.error("update-saving err:", err)
            })
            // savingTable.update(savingId, {
            //   [item.accountType]: state.savings[item.accountType]
            // }, (err) => {err && console.log("update-saving err:", err)})
          })
        })
        .catch(err => {
          console.error("delete err:", err)
        })
      // let deletedRecords = []
      // table.destroy(ids, (err, records) => {
      //   deletedRecords = records
      //   err && console.log("deleteErr:", err)
      // })
      // console.log("deletedRecords:", deletedRecords)
      // deletedRecords.forEach((item) => {
      //   state.savings.saving -= item.amount
      //   state.savings[item.accountType] -= item.amount
      //   savingTable.update(savingId, {
      //     [item.accountType]: state.savings[item.accountType]
      //   }, (err) => {err && console.log("update-saving err:", err)})
      // })
    },
    initData(state) {
      // 初始化数据
      console.log("initData!")
      console.log("chosenDay:", state.chosenDay)
      let curDate = state.chosenDay
      curDate.setHours(curDate.getHours() + 8)
      console.log("iso:", typeof curDate.toISOString().split('T')[0])
      // 初始化收支记录
      let filterFormula = `createTime = "${curDate.toISOString().split('T')[0]}"`
      console.log("filterFormula:", filterFormula)
      state.recordsTable.getRecords(filterFormula)
        .then(records => {
          console.log("get records res:", records)
          state.records = records
        })
        .catch(err => {
          console.error("get records err:", err)
        })
      // let tempRecords = []
      // table
      //   .select({
      //     view: "Grid view",
      //     // filterByFormula: `createTime = "${curDate.toISOString().split('T')[0]}"` // 这里还有待确认！！！
      //   })
      //   .eachPage(function Page(records, fetchNextPage) { // eachPage?
      //     console.log("records in each page:", records)
      //     tempRecords = [...tempRecords, ...records.map(item => item.fields)]
      //     fetchNextPage()
      //   }, function done(err) {
      //     if (err) { 
      //       console.error("check state err:", err); 
      //       return; 
      //     }
      //     console.log("tempRecords:", tempRecords)
      //     state.records = tempRecords.filter(record => record.createTime == curDate.toISOString().split('T')[0])
      //     console.log("records after checkState:", state.records)
      //   })
      // 初始化积蓄信息
      state.savingTable.getRecords()
        .then(records => {
          console.log("get savings res:", records)
          state.savings = records[0]
        })
        .catch(err => {
          console.error("get savings err:", err)
        })

      // 初始化枚举信息
      state.enumerationTable.getRecords()
        .then(records => {
          state.enumeration = records
        })
        .catch(err => {
          console.error("get enumeration err:", err)
        })
      // base('enumeration')
      //   .select({
      //     view: 'Grid view',
      //   })
      //   .firstPage((err, records) => {
      //     if(err) {
      //       console.log("get expense category err:", err)
      //       return
      //     }
      //     state.enumeration = records.map(item => item.fields)
      //   })
    },
    checkRecordsState(state) {
      console.log("initData!")
      console.log("chosenDay:", state.chosenDay)
      let curDate = state.chosenDay
      curDate.setHours(curDate.getHours() + 8)
      console.log("iso:", curDate.toISOString().split('T')[0])
      // 初始化收支记录
      let filterFormula = `createTime = "${curDate.toISOString().split('T')[0]}"`
      console.log("filterFormula:", filterFormula)
      state.recordsTable.getRecords(filterFormula)
        .then(records => {
          console.log("get records res:", records)
          state.records = records
        })
        .catch(err => {
          console.error("get records err:", err)
        })

      // console.log("checkRecordsState!")
      // console.log("chosenDay:", state.chosenDay)
      // let curDate = state.chosenDay
      // curDate.setHours(curDate.getHours() + 8)
      // console.log("iso:", curDate.toISOString())
      // let tempRecords = []
      // // 初始化收支记录
      // table
      //   .select({
      //     view: "Grid view",
      //     // filterByFormula: `createTime = "${curDate.toISOString().split('T')[0]}"` // 这里还有待确认！！！
      //   })
      //   .eachPage(function Page(records, fetchNextPage) { // eachPage?
      //     console.log("records in each page:", records)
      //     tempRecords = [...tempRecords, ...records.map(item => item.fields)]
      //     fetchNextPage()
      //   }, function done(err) {
      //     if (err) { 
      //       console.error("check state err:", err); 
      //       return; 
      //     }
      //     console.log("tempRecords:", tempRecords)
      //     state.records = tempRecords.filter(record => record.createTime == curDate.toISOString().split('T')[0])
      //     console.log("records after checkState:", state.records)
      //   })
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