import emailSMTPVerificator from 'email-smtp-verificator'

const verify = emailSMTPVerificator({ timeout: 1000 })

const smtp = async (email) => {
  let res = {}

  let allInfo = await verify(email)
  console.log(allInfo)

  if (!allInfo.verified) {
    res.error = "SMTP server didn't response"
    res.smtp = allInfo.verified
  }
  if (allInfo.verified) {
    res.smtp = allInfo.verified
  }
  return res
}

export default smtp
