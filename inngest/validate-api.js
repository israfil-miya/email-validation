import { createFunction } from 'inngest'
import { validate_emails } from '../utils/validate.js'

export const validate = createFunction(
  'emails-validation',
  'validate',
  async ({ event }) => {
    let { data } = event

    let fileBuffer = Buffer.from(data.fileBase64, 'base64')
    let emailsJson = await validate_emails(fileBuffer, data.filename)
    await fetch(`${process.env.BASE_URL}/api/export-api`, {
      method: 'POST',
      body: JSON.stringify({ emailsJson, exportExtension: data.exportExt }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
)
