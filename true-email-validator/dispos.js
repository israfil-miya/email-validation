import EmailValidation from 'emailvalid'
const ev = new EmailValidation({ allowFreemail: true })

const dispos = async (email) => {
    let allInfo = ev.check(email)
    return allInfo.valid ? false : true
}

export default dispos