import * as json2xls from 'json2xls'
import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'

const host = 'http://localhost:3000'

export const createXls = (data, type) => {
  const filterData = _.reject(data, { status: 0 })
  const realData = _.reduce(filterData, (result, value, key) => {
    console.log(value)
    value[type].forEach((ret, index) => {
      if(ret['status'] === 1){
        result[index] = ret
        result[index]['name'] = value['name']
        result[index]['plate'] = value['plate']
      } else {
        return false
      }
    })
    return result
  }, [])
  const xls = json2xls(realData)

  fs.writeFileSync(path.join(__dirname, `../../static/${type}.xlsx`), xls, 'binary')
  return `${host}/static/${type}.xlsx`
}
