import query from '../../lib/db.js'
export default async function handler(req, res) {
  let data = req.body

  let queryString = data.queryString
  let queryParams = data.queryParams
  let resdata = await query({ query: queryString, values: queryParams })
  if (resdata) {
    res.status(200).json({ result: resdata })
  } else {
    res.status(400).json({ message: 'No data returned' })
  }
}
