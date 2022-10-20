import dbConnect from '../../db/dbConnect.js'
dbConnect()
import exportFileData from '../../db/ExportSchema.js'

export default async function handle(req, res) {
  try {
    const reqData = req.body
    const { method } = req

    if (method == 'POST') {
      if (reqData.id) {
        const dbData = await exportFileData.findById(reqData.id)
        res.status(200).json({ dbData })
      } else res.status(400).json({ message: 'Required data missing.' })
    }
    if (method == 'GET') {
      res.status(400).json({ message: 'GET request not accepted.' })
    }
  } catch {
    res.status(400).json({ message: 'Unable to get the exported file' })
  }
}
