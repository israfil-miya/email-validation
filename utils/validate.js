import EmailValidator from '@exodus/email-deep-validator';
const emailValidator = new EmailValidator({ useOpenSSL: true });
import XLSX from "xlsx"

export const getEmails = (fileBuffer) => {
    const workbook = XLSX.read(fileBuffer);

    let worksheets = {};
    for (const sheetName of workbook.SheetNames) {
        worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }

    let emailsObjArray = []
    let emails = []
    for (const key in worksheets) {
        emailsObjArray = emailsObjArray.concat(JSON.parse(JSON.stringify(worksheets[key])))
    }
    emailsObjArray.map(emailObj => {
        emails.push(emailObj.Email || emailObj.Emails || emailObj.email || emailObj.emails)
    })

    return emails
}
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
export const getEmailsFromFile = (fileBuffer, filename) => {
    if (filename.includes(".xlsx") || filename.includes(".xls")) {
        return getEmails(fileBuffer)
    }
    if (filename.includes(".txt") || filename.includes(".csv")) {
        let text = fileBuffer.toString('utf8')
        let textByLine = text.split("\r\n" || "\n")
        textByLine = textByLine.filter(e => {
            let element = e.toLowerCase()
            return (String(element).trim() && element != "emails" && element != "email")
        });
        return textByLine
    }
    else return null
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
export const validate_emails = async (fileBuffer, filename) => {
    let allEmails = getEmailsFromFile(fileBuffer, filename)
    if (!allEmails) {
        console.log('Unable to retrieve emails from the file. Check the file type. Currently suppoprts .txt .csv .xlsx .xls, if you are using Excel spreadsheet put "Email" or "Emails" as the column header without quotes')
        return
    }
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