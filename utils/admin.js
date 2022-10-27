import query from '../lib/db.js'
const checkAdmin = async (id) => {
  let queryString = 'SELECT * FROM `admins` WHERE `_id` = ?;'
  let queryParams = [id]

  let [data] = await query({ query: queryString, values: queryParams })
  if (data?._id) {
    return data._id
  } else return false
}

export default checkAdmin
