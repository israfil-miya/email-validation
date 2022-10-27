import query from '../../lib/db.js'

export default async function handle(req, res) {
  try {
    const reqData = req.body
    const { method } = req

    if (method == 'POST') {
      if (reqData.id) {
        let queryString = 'SELECT * FROM exports WHERE ID = ?'
        let queryParams = [reqData.id]
        let [dbdata] = await query({ query: queryString, values: queryParams })
        res.status(200).json({ dbData: dbdata })
      } else res.status(400).json({ message: 'Required data missing.' })
    }
    if (method == 'GET') {
      res.status(400).json({ message: 'GET request not accepted.' })
    }
  } catch {
    res.status(400).json({ message: 'Unable to get the exported file' })
  }
}
