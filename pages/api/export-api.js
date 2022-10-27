import { exportToFile } from '../../utils/export.js'
import query from '../../lib/db.js'

export default async function handle(req, res) {
  try {
    const data = req.body
    const { method } = req
    if (method == 'POST') {
      if (data.emailsJson && data.exportExtension) {
        let fileBuffer = exportToFile(data.emailsJson, data.exportExtension)
        if (fileBuffer.error) throw new Error(fileBuffer.error)

        let exportFileBase64 = Buffer.from(fileBuffer).toString('base64')

        let dataType
        switch (data.exportExtension) {
          case 'txt':
            dataType = 'data:text/plain;base64,'
            break
          case 'xlsx':
            dataType =
              'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
            break
          case 'xls':
            dataType = 'data:application/vnd.ms-excel;base64,'
            break
          case 'csv':
            dataType = 'data:text/csv;base64,'
            break
          default:
            break
        }

        let queryString = 'SELECT * FROM exports WHERE string_data = ?'
        let queryParams = [exportFileBase64]
        let [dbdata] = await query({ query: queryString, values: queryParams })
        if (dbdata) {
          res.status(200).json({
            dataId: dbdata.ID,
            dataType,
          })
        } else {
          let queryString =
            'INSERT INTO `exports` ( `string_data` ) VALUES (?);'
          let queryParams = [exportFileBase64]
          let confirmationData = await query({
            query: queryString,
            values: queryParams,
          })
          if (confirmationData?.affectedRows) {
            let queryString = 'SELECT * FROM exports WHERE string_data = ?'
            let queryParams = [exportFileBase64]
            let [dbdata] = await query({
              query: queryString,
              values: queryParams,
            })
            res.status(200).json({
              dataId: dbdata.ID,
              dataType,
            })
          } else res.status(400).json({ message: 'Unable to export data.' })
        }
      } else res.status(400).json({ message: 'Required data missing.' })
    }
    if (method == 'GET') {
      res.status(400).json({ message: 'GET request not accepted.' })
    }
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Set desired value here
    },
  },
}
