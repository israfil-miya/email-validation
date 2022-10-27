import { validate_emails } from '../../utils/validate.js'

export default async function handle(req, res) {
  try {
    const data = req.body
    const { method } = req

    if (method == 'POST') {
      if (data.fileBase64 && data.filename) {
        let fileBuffer = Buffer.from(data.fileBase64, 'base64')
        let emailsJson = await validate_emails(
          fileBuffer,
          data.filename,
          data.id,
        )
        if (emailsJson.error) throw new Error(emailsJson.error)

        res.status(200).json({ emailsJson })
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
