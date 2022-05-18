import Airtable from 'airtable'

export default class Table {
  constructor(apiKey, baseKey, table) {
    this.table = (new Airtable({apiKey}).base(baseKey))(table)
    // this.table = this.base(table)
    console.log("constructor done!")
  }

  // 获取airtable表记录
  getRecords(filterFormula = "") {
    return new Promise((resolve, reject) => {
      console.log("filterFormula in getRecords:", filterFormula)
      let recordList = []
      this.table
        .select({
          view: "Grid view",
          filterByFormula: filterFormula,
        })
        .eachPage(function Page(records, fetchNextPage) {
          recordList = [...recordList, ...records.map(item => item.fields)]
          fetchNextPage()
        }, function done(err) {
          err? reject(err): resolve(recordList)
        })
    })
  }

  // 向airtable对应table表添加记录，并回传airtable生成的id
  addRecord(record) {
    return new Promise((resolve, reject) => {
      this.table
        .create(record, (err, record) => {
          if(err) {
            reject(err)
          }
          let recordId = record.getId()
          this
            .updateRecord(recordId, {id: recordId})
            .catch(err => reject(err))
          resolve(recordId)
        })
    })
  }

  // 更新记录
  updateRecord(id, change) {
    return new Promise((resolve, reject) => {
      this.table
        .update(id, change, (err) => {
          err? reject(err): resolve(true)
        })
    })
  }

  // 删除记录
  deleteRecord(ids) {
    return new Promise((resolve, reject) => {
      if(!Array.isArray(ids)) {
        reject("ids should be an array!")
      }
      this.table
        .destroy(ids, (err, records) => {
          err? reject(err): resolve(records)
        })
    })
  }
}