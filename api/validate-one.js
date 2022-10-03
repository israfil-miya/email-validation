import { validateOne } from "../utils/validate.js"
const validate_one = async (req, res) => {
    try {
        const data = req.body
        if (!data || !data.email || typeof (data.email) !== "string") {
            res.status(400).json({ error: "No email submitted." })
        }

        if (typeof (data.email) === "string") {
            const verify = await validateOne(data.email)
            const { wellFormed, validDomain, validMailbox } = verify
            res.status(200).json({ wellFormed, validDomain, validMailbox, email: data.email, timestamp: new Date().toISOString() })
        }
    } catch {
        res.status(500).json({ error: "Server error." })
    }
}

export default validate_one