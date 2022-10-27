import query from "../lib/db.js"
const validKey = async (key) => {
    let queryString = "SELECT * FROM `users` WHERE `api_key` = ?;"
    let queryParams = [key]
    let [data] = await query({query: queryString, values: queryParams})
    if(data) {
        return true
    } else return false
}

export default validKey