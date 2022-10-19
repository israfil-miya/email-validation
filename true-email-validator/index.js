import typo from "./typo.js"
import smtp from "./smtp.js"
import dispos from "./dispos.js"
import mxrecord from "./mx.js"

const Main = async (email) => {
    let res = {}
    res.typo = typo(email)
    res.disposable = await dispos(email)
    res.mx = await mxrecord(email)
    res.smtp = await smtp(email)
    return res
}

export default Main