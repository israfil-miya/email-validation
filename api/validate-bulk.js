import { validate_emails } from '../utils/validate.js'
import { creditAmount, minusCredit } from '../utils/credits.js'
const validate_bulk = async (req, res) => {
  try {
    let apiKey = req.header('x-api-key')
    const data = req.body

    if (!data || !data.emails || !Array.isArray(data.emails)) {
      res.status(400).json({ error: 'No emails submitted.' })
      return
    }

    if (Array.isArray(data.emails)) {
      let balance = await creditAmount(apiKey)
      if (!balance) {
        res.status(400).json({ error: 'Not enough credit in account' })
        return
      } else {
        let chargeCredit = await minusCredit(
          apiKey,
          balance,
          data.emails.length,
        )
        if (!chargeCredit) {
          res.status(500).json({ error: 'Unable to update credit' })
          return
        }
      }

      const result = await validate_emails(data.emails)
      // console.log(result)
      const { validMails, fakeMails } = result
      data.emails.length == 1
        ? res.status(200).json({
            validMails,
            fakeMails,
            timestamp: new Date().toISOString(),
            note: 'It is recommended to use /api/validate-one for single email validation.',
          })
        : res.status(200).json({
            validMails,
            fakeMails,
            timestamp: new Date().toISOString(),
          })
    }
  } catch (e) {
    res.status(500).json({ error: `Server error: ${e.message}` })
  }
}

export default validate_bulk
