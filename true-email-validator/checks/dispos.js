import { checkEmail } from './temp-email-check/index.js'

const dispos = (email) => {
  let res = {}

  let allInfo = checkEmail(email)

  if (!allInfo) {
    res.error = 'Email is disposable'
    res.disposable = true
  }
  if (allInfo) {
    res.disposable = false
  }
  return res
}

export default dispos
