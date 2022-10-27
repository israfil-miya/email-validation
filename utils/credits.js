import query from '../lib/db.js'
export async function minusCredit(id, balance, amount) {
  let queryString = 'UPDATE `users` SET `balance` = ? WHERE `users`.`_id` = ?;'
  let queryParams = [balance - amount, id]

  let confirmationData = await query({
    query: queryString,
    values: queryParams,
  })

  if (confirmationData?.affectedRows) {
    return true
  } else {
    return false
  }
}
export async function creditAmount(id) {
  let queryString = 'SELECT `balance` FROM `users` WHERE `_id` = ?;'
  let queryParams = [id]

  let [data] = await query({ query: queryString, values: queryParams })
  if (data?.balance) {
    return data.balance
  } else return 0
}
