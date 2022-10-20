import EmailValidation from 'emailvalid'
const ev = new EmailValidation({ allowFreemail: true })

const dispos = (email) => {
  let res = {}

  let allInfo = ev.check(email)

  if (!allInfo.valid) {
    res.error = 'Email is disposable'
    res.disposable = true
  }
  if (allInfo.valid) {
    res.disposable = false
  }
  return res
}

export default dispos
