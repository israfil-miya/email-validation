import { validateOne } from '../../utils/validate'
import { creditAmount, minusCredit } from '../../utils/credits.js'
export default async function handle(req, res) {
  try {
    const data = req.body
    const { method } = req
    if (method == 'POST') {
      if (data.oneEmail) {
        let balance = await creditAmount(data.id)
        if (!balance) {
          throw new Error('Not enough credit in account')
        } else {
          let chargeCredit = await minusCredit(data.id, balance, 1)
          if (!chargeCredit) throw new Error('Unable to update credit')
        }

        let verify = await validateOne(data.oneEmail)
        res.status(200).json(verify)
      } else res.status(400).json({ message: 'No email given.' })
    }
    if (method == 'GET') {
      res.status(400).json({ message: 'GET request not accepted.' })
    }
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}
