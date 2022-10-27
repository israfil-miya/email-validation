import { validateOne } from '../utils/validate.js'
import { creditAmount, minusCredit } from '../utils/credits.js'
const validate_one = async (req, res) => {
  try {

    let apiKey = req.header("x-api-key")

    const data = req.body
    if (!data || !data.email || typeof data.email !== 'string') {
      res.status(400).json({ error: 'No email submitted.' })
    }

    if (typeof data.email === 'string') {

      let balance = await creditAmount(apiKey)
        if(!balance) {
          res.status(500).json({ error: 'Not enough credit in account' })
        } else {
          let chargeCredit = await minusCredit(apiKey, balance, 1)
          if (!chargeCredit) res.status(500).json({ error: 'Unable to update credit' })
        }

      const verify = await validateOne(data.email)
      verify.timestamp = new Date().toISOString()
      res.status(200).json(verify)
    }
  } catch {
    res.status(500).json({ error: 'Server error.' })
  }
}

export default validate_one
