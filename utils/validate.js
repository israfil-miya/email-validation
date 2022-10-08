import { validate } from 'deep-email-validator-fix'

export const createOutput = (verify, email) => {
    const { regex, typo, disposable, mx, smtp } = verify.validators
    return {
        email,
        valid: verify.valid,
        regex: regex.valid,
        typo: typo.valid,
        disposable: disposable.valid,
        mx: mx.valid,
        smtp: smtp.valid,
        reason: (!verify.valid) ? verify.validators[verify.reason].reason : null
    }
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

            let verify = await validate(email)

            const result = createOutput(verify, email)
            if (verify.valid)
                validEmails.push({ id: index + 1, emailDetail: result })
            if (!verify.valid)
                fakeEmails.push({ id: index + 1, emailDetail: result })

        }),
    )
    validEmails = validEmails.sort(sort_by_id())
    fakeEmails = fakeEmails.sort(sort_by_id())
    AllResult = { validMails: validEmails, fakeMails: fakeEmails }
    return AllResult
}

export const validateOne = async (email) => {
    return createOutput(await validate(email), email)
    
}

// the end