import EmailValidator from '@exodus/email-deep-validator';
const emailValidator = new EmailValidator({ useOpenSSL: true });

export const error_or_success = (verify, email) => {
    let return_text
    if (verify.wellFormed && verify.validDomain && verify.validMailbox !== null) {
        return_text = { email, valid: true, wellFormed: verify.wellFormed, validDomain: verify.validDomain, validMailbox: verify.validMailbox }
    } else {
        if (email.includes("@yahoo.com") && verify.wellFormed && verify.validDomain)
            return_text = { email, valid: true, isYahoo: true, wellFormed: verify.wellFormed, validDomain: verify.validDomain, validMailbox: verify.validMailbox }
        else
            return_text = { email, valid: false, wellFormed: verify.wellFormed, validDomain: verify.validDomain, validMailbox: verify.validMailbox }
    }
    return return_text
}
export const sort_by_id = () => {
    return function (elem1, elem2) {
        if (elem1.id < elem2.id) {
            return -1;
        } else if (elem1.id > elem2.id) {
            return 1;
        } else {
            return 0;
        }
    };
}
export const validate_emails = async (allEmails) => {
    let AllResult
    let validEmails = []
    let fakeEmails = []

    await Promise.all(
        allEmails.map(async (email, index) => {

            let verify = await emailValidator.verify(email)

            const result = error_or_success(verify, email)
            if (result.valid)
                validEmails.push({ id: index + 1, emailDetail: result })
            if (!result.valid)
                fakeEmails.push({ id: index + 1, emailDetail: result })

        }),
    )
    validEmails = validEmails.sort(sort_by_id())
    fakeEmails = fakeEmails.sort(sort_by_id())
    AllResult = { validMails: validEmails, fakeMails: fakeEmails }
    return AllResult
}

export const validateOne = async (email) => {
    return await emailValidator.verify(email)
}

// the end