import { validateOne } from "../utils/validate.js"
const validate_one = async (req, res) => {
    try {
        const data = req.body
        if (!data || !data.email || typeof (data.email) !== "string") {
            res.status(400).json({ error: "No email submitted." })
        }

        if (typeof (data.email) === "string") {
            const verify = await validateOne(data.email)
            verify.timestamp = new Date().toISOString()
            res.status(200).json(verify)
        }
    } catch {
        res.status(500).json({ error: "Server error." })
    }
}

export default validate_one