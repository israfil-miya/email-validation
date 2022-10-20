import { exportToFile } from '../../utils/export.js'
import dbConnect from '../../db/dbConnect.js'
dbConnect()
import exportFileData from '../../db/ExportSchema.js'

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

        const insertedData = await exportFileData.findOneAndUpdate(
          { stringData: exportFileBase64 },
          { stringData: exportFileBase64 },
          { upsert: true, new: true },
        )

        res.status(200).json({
          dataId: insertedData._id,
          dataType,
        })
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
