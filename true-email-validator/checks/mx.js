import edc from 'email-domain-check'

const mxrecord = async (email) => {
  let res = {}

  let allInfo = await edc(email)

  if (!allInfo) {
    res.error = 'MX records not found'
    res.mx = allInfo
  }
  if (allInfo) {
    res.mx = allInfo
  }
  return res
}

export default mxrecord
