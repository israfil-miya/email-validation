import XLSX from 'xlsx'
import fs from 'fs'

export const exportExcel = (json, ext) => {
  let workbook = XLSX.utils.book_new()
  let dataForSheet = [['ID', 'Email', 'Valid']]
  json.validMails.map((element) => {
    dataForSheet.push([element.id, element.emailDetail.email, 'yes'])
  })
  json.fakeMails.map((element) => {
    dataForSheet.push([element.id, element.emailDetail.email, 'no'])
  })
  let sheetData = XLSX.utils.aoa_to_sheet(dataForSheet)
  XLSX.utils.book_append_sheet(workbook, sheetData, 'Validated Emails Sheet')
  let buf = XLSX.write(workbook, { type: 'buffer', bookType: ext })
  return buf
}
export const exportText = (json, ext) => {
  let resultString = ''
  json.validMails.map((element) => {
    let data = `${element.id} - ${element.emailDetail.email} - valid\n`
    resultString += data
  })
  json.fakeMails.map((element) => {
    let data = `${element.id} - ${element.emailDetail.email} - fake\n`
    resultString += data
  })
  let buf = Buffer.from(resultString, 'utf-8')
  return buf
}
export const exportToFile = (json, fileext) => {
  if (fileext === 'csv' || fileext == 'xlsx' || fileext === 'xls') {
    return exportExcel(json, fileext)
  }
  if (fileext === 'txt') {
    return exportText(json, fileext)
  } else {
    return null
  }
}
