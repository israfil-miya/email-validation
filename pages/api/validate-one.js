import { validateOne } from '../../utils/validate'

export default async function handle(req, res) {
  try {
    const data = req.body
    const { method } = req
    if (method == 'POST') {
      if (data.oneEmail) {
        let verify = await validateOne(data.oneEmail)
        res.status(200).json(verify)
      } else res.status(400).json({ message: 'No email given.' })
    }
    if (method == 'GET') {
      res.status(400).json({ message: 'GET request not accepted.' })
    }
  } catch {
    res.status(500).json({ message: 'Unable to valid email' })
  }
}
