import { validateOne } from '../../utils/validate'

export default async function handle(req, res) {
  const reqData = req.body
  const { method } = req
  if (method == 'POST') {
    if (reqData.oneEmail) {
      let verify = await validateOne(reqData.oneEmail)
      res.status(200).json(verify)
    } else res.status(400).json({ message: 'No email given.' })
  }
  if (method == 'GET') {
    res.status(400).json({ message: 'GET request not accepted.' })
  }
}
