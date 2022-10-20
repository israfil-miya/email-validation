import XLSX from 'xlsx'

export const exportExcel = (json, ext) => {
  try {
    let workbook = XLSX.utils.book_new()
    let dataForSheet = [
      ['ID', 'Email', 'Typo', 'Disposable', 'Mx', 'Smtp', 'Valid'],
    ]
    json.validMails.map((element) => {
      dataForSheet.push([
        element.id,
        element.emailDetail.email,
        element.emailDetail.typo ? 'TRUE' : 'FALSE',
        element.emailDetail.disposable ? 'TRUE' : 'FALSE',
        element.emailDetail.mx ? 'TRUE' : 'FALSE',
        element.emailDetail.smtp ? 'TRUE' : 'FALSE',
        'TRUE',
      ])
    })
    json.fakeMails.map((element) => {
      dataForSheet.push([
        element.id,
        element.emailDetail.email,
        element.emailDetail.typo ? 'TRUE' : 'FALSE',
        element.emailDetail.disposable ? 'TRUE' : 'FALSE',
        element.emailDetail.mx ? 'TRUE' : 'FALSE',
        element.emailDetail.smtp ? 'TRUE' : 'FALSE',
        'FALSE',
      ])
    })
    let sheetData = XLSX.utils.aoa_to_sheet(dataForSheet)
    XLSX.utils.book_append_sheet(workbook, sheetData, 'Validated Emails Sheet')
    let buf = XLSX.write(workbook, { type: 'buffer', bookType: ext })
    return buf
  } catch {
    return { error: 'Unable to export spreadsheet file' }
  }
}
export const exportText = (json, ext) => {
  try {
    let resultString = ''
    json.validMails.map((element) => {
      let data = `${element.id} - ${element.emailDetail.email} - Correct Typo - Not Disposable - Mx Records found - Smtp found - Valid\n`
      resultString += data
    })
    json.fakeMails.map((element) => {
      let data = `${element.id} - ${element.emailDetail.email} - ${
        element.emailDetail.typo ? 'Correct Typo' : 'Wrong Typo'
      } - ${
        element.emailDetail.disposable ? 'Disposable' : 'Not Disposable'
      } - ${
        element.emailDetail.mx ? 'Mx Records found' : 'Mx Records not found'
      } - ${
        element.emailDetail.smtp ? 'Smtp found' : 'Smtp not found'
      } - Fake\n`
      resultString += data
    })
    let buf = Buffer.from(resultString, 'utf-8')
    return buf
  } catch {
    return { error: 'Unable to export text file' }
  }
}
export const exportToFile = (json, fileext) => {
  if (fileext === 'csv' || fileext == 'xlsx' || fileext === 'xls') {
    return exportExcel(json, fileext)
  }
  if (fileext === 'txt') {
    return exportText(json, fileext)
  } else {
    return { error: 'Export file type is not valid' }
  }
}
