import { Inngest } from 'inngest'
import dbConnect from '../../db/dbConnect.js'
dbConnect()
import exportFileData from '../../db/ExportSchema.js'
export const client = new Inngest({
  name: 'EMAILS VALIDATION SYSTEM',
  eventKey: process.env.INNGEST_EVENT_KEY,
})

export default async function handle(req, res) {
  const reqData = req.body
  const { method } = req

  if (method == 'POST') {
    if (reqData.id) {
      const dbData = await exportFileData.findById(reqData.id)
      res.status(200).json({ status: 'done', dbData })
    } else res.status(400).json({ message: 'Required data missing.' })
  }
  if (method == 'GET') {
    res.status(400).json({ message: 'GET request not accepted.' })
  }
}
