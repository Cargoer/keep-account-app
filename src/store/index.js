import Airtable from 'airtable'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

var base = new Airtable({apiKey: 'YOU_API_KEY'}).base('appG9EdnP5rg4pyp9');
var table = base('records_test')

const store = new Vuex.Store({
  state: {
    records: [],
    chosenDay: new Date(),
    curRecord: {},
  },
  mutations: {
    setCurRecord(state, record) {
      state.curRecord = record
    },
    insert(state, record) {
      table.create(record, (err, row) => {
        if(err) {
          console.log("insertErr:", err)
          return
        }
        var insertId = row.getId()
        record.id = insertId
        state.records.unshift(record)
        table.update(insertId, {
          "id": insertId
        }, (err) => {
          err && console.log("updateIdErr:", err)
        })
      })
    },
    update(state, payload) {
      state.records = state.records.map(item => {
        if(item.id === payload.id) {
          item = {...item, ...payload.change}
        }
        return item
      })
      console.log(payload)
      table.update(payload.id, payload.change, (err) => {
        err && console.log("updateErr:", err)
      })
    },
    delete(state, ids) {
      state.records = state.records.filter(item => {
        return ids.indexOf(item.id) === -1
      })
      table.destroy(ids, (err) => {
        err && console.log("deleteErr:", err)
      })
    },
    initData(state) {
      // 初始化数据
      console.log("initData!")
      console.log(new Date().toISOString().split('T')[0])
      table
        .select({
          view: "Grid view",
          filterByFormula: `createTime = "${new Date(state.chosenDay).toISOString().split('T')[0]}"` // 这里还有待确认！！！
        })
        .firstPage((err, records) => { // eachPage?
          if(err) {
            console.log(err);
            return;
          }
          state.records = records.map(item => item.fields)
          console.log("records get:", state.records)
        })
    }
  }
})

export default store