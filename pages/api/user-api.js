import query from '../../lib/db.js'
import { hashPassword } from '../../utils/hash.js'
import { v4 as uuidv4 } from 'uuid'
const UUID = () => uuidv4()
export default async function handle(req, res) {
  const data = req.body
  const { method } = req

  switch (method) {
    case 'GET':
      res.status(400).json({
        error: true,
        message: 'GET operation not allowed in this route',
      })
      break
    case 'POST':
      if (data.signin) {
        let queryString = 'SELECT * FROM users WHERE email = ?'
        let queryParams = [data.email]
        const [userData] = await query({
          query: queryString,
          values: queryParams,
        })
        if (userData)
          res.status(200).json({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            password: userData.password,
          })
        else {
          res.status(400).json({
            error: true,
            message: 'No account found',
          })
        }
      }
      if (data.signup) {
        let queryString = 'SELECT * FROM `users` WHERE email = ?'
        let queryParams = [data.email]
        const [userData] = await query({
          query: queryString,
          values: queryParams,
        })
        if (userData?.name)
          res
            .status(400)
            .json({ error: true, message: 'User does already exists' })
        else {
          const hashedPass = await hashPassword(data.password)
          let UID = UUID()
          let queryString =
            'INSERT INTO `users` (`_id`, `name`, `email`, `password`, `api_key`) VALUES (?, ?, ?, ?, ?);'
          let queryParams = [UID, data.name, data.email, hashedPass, UID]
          const confirmationData = await query({
            query: queryString,
            values: queryParams,
          })

          if (confirmationData?.affectedRows) {
            res.status(200).json({
              id: UID,
              name: data.name,
              email: data.email,
              password: hashedPass,
            })
          } else {
            // console.log("That one")
            res
              .status(400)
              .json({ error: true, message: 'Something went wrong' })
          }
        }
      }
      if (!data.signup && !data.signin) {
        // console.log("hereeee")
        res.status(400).json({ error: true, message: 'Not valid POST request' })
      }
      break
    default:
      res.status(400).json({
        error: true,
        message: 'Unknown request',
      })
  }
}
