import { isValid } from "./mx-record-check/index.js";

const mxrecord = async (email) => {

    let res = {}

    let allInfo = await isValid(email)

    if (!allInfo) {
        res.error = "MX records not found"
        res.mx = allInfo
    }
    if(allInfo) {
        res.mx = allInfo
    }
    return res
}

export default mxrecord