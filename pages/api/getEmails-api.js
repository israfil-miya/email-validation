const getEmails = (fileBuffer) => {
    try {
        const workbook = XLSX.read(fileBuffer)

        let worksheets = {}
        for (const sheetName of workbook.SheetNames) {
            worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        }

        let emailsObjArray = []
        let emails = []
        for (const key in worksheets) {
            emailsObjArray = emailsObjArray.concat(
                JSON.parse(JSON.stringify(worksheets[key])),
            )
        }
        emailsObjArray.map((emailObj) => {
            emails.push(
                emailObj.Email || emailObj.Emails || emailObj.email || emailObj.emails,
            )
        })

        return emails
    } catch (e) {
        return { error: e.message }
    }
}

const getEmailsFromFile = (fileBuffer, filename) => {
    try {
        if (
            filename.includes('.xlsx') ||
            filename.includes('.xls') ||
            filename.includes('.csv')
        ) {
            let emailsFromExcel = getEmails(fileBuffer)
            if (emailsFromExcel.error) throw new Error(emailsFromExcel.error)
            else return getEmails(fileBuffer)
        }
        if (filename.includes('.txt')) {
            let text = fileBuffer.toString('utf8')
            let textByLine = text.split('\r\n' || '\n')
            textByLine = textByLine.filter((e) => {
                let element = e.toLowerCase()
                return String(element).trim() && element != 'emails' && element != 'email'
            })
            return textByLine
        } else throw new Error("Not a valid file type")
    } catch (e) {
        return { error: e.message };
    }
}

export default async function handle(req, res) {


    try {
        const data = req.body
        const { method } = req

        if (method == 'POST') {
            if (data.fileBase64 && data.filename) {
                let fileBuffer = Buffer.from(data.fileBase64, 'base64')

                let emailsJson = await getEmailsFromFile(
                    fileBuffer,
                    data.filename
                )
                if (emailsJson.error) throw new Error(emailsJson.error)

                res.status(200).json({ emailsJson })
            } else res.status(400).json({ message: 'Required data missing.' })
        }
        if (method == 'GET') {
            res.status(400).json({ message: 'GET request not accepted.' })
        }
    } catch (e) {
        res.status(400).json({ message: e.message })
    }
}


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb', // Set desired value here
        },
    },
}