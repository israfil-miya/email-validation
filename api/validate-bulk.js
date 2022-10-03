import { validate_emails } from "../utils/validate.js"
const validate_bulk = async (req, res) => {
    try {
        const data = req.body

        if (!data || !data.emails || !Array.isArray(data.emails)) {
            res.status(400).json({ error: "No emails submitted." })
        }

        if (Array.isArray(data.emails)) {
            const result = await validate_emails(data.emails)
            const { validMails, fakeMails } = result
            data.emails.length == 1 ? res.status(200).json({ validMails, fakeMails, timestamp: new Date().toISOString(), note: "It is recommended to use /api/validate-one for single email validation." }) : res.status(200).json({ validMails, fakeMails, timestamp: new Date().toISOString() })
        }
    } catch {
        res.status(500).json({error: "Server error."})
    }
}

export default validate_bulk