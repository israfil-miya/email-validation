import typo from "./checks/typo.js"
import smtp from "./checks/smtp.js"
import dispos from "./checks/dispos.js"
import mxrecord from "./checks/mx.js"

const Main = async (email) => {
    let res = {}
    let errors = []
    let EmailTypo = typo(email)
    let EmailDisposable = dispos(email)
    let EmailMx = await mxrecord(email)
    let EmailSmtp = await smtp(email)
    let AllRes = [EmailTypo, EmailDisposable, EmailMx, EmailSmtp]

    if (EmailTypo.error || EmailDisposable.error || EmailMx.error || EmailSmtp.error) {
        AllRes.map(data => {
            if (data.error) errors.push(data.error)
        })
    }
    
    if (errors.length) res.valid = false
    else res.valid = true
    res.email = email
    res.typo = EmailTypo.typo
    res.disposable = EmailDisposable.disposable
    res.mx = EmailMx.mx
    res.smtp = EmailSmtp.smtp
    if (errors.length) res.errors = errors


    return res
}

export default Main