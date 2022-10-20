import EmailValidatorPro from 'email-validator-pro'
let evp = new EmailValidatorPro()

const typo = (email) => {
  let res = {}

  let allInfo = evp.isValidAddress(email)

  if (!allInfo) {
    res.error = 'Not an email'
    res.typo = allInfo
  }
  if (allInfo) {
    res.typo = allInfo
  }
  return res
}

export default typo
