import emailVal from '../true-email-validator/index.js'

export const sort_by_id = () => {
  return function (elem1, elem2) {
    if (elem1.id < elem2.id) {
      return -1
    } else if (elem1.id > elem2.id) {
      return 1
    } else {
      return 0
    }
  }
}
export const validate_emails = async (allEmails) => {
  let AllResult
  let validEmails = []
  let fakeEmails = []

  await Promise.all(
    allEmails.map(async (email, index) => {
      let verify = await emailVal(email)

      if (verify.valid) validEmails.push({ id: index + 1, emailDetail: verify })
      if (!verify.valid) fakeEmails.push({ id: index + 1, emailDetail: verify })
    }),
  )
  validEmails = validEmails.sort(sort_by_id())
  fakeEmails = fakeEmails.sort(sort_by_id())
  AllResult = { validMails: validEmails, fakeMails: fakeEmails }
  return AllResult
}

export const validateOne = async (email) => {
  return await emailVal(email)
}

// the end
