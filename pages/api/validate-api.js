import { Inngest } from 'inngest'
export const client = new Inngest({ name: "EMAILS VALIDATION SYSTEM", eventKey: process.env.INNGEST_EVENT_KEY })

export default async function handle(req, res) {

    const reqData = req.body
    const { method } = req

    if (method == "POST") {
        if (reqData.fileBase64 && reqData.filename) {
            client.send({
                name: "validate",
                data: {
                    fileBase64: reqData.fileBase64,
                    filename: reqData.filename
                }
            });
            res.status(200).json({ status: "done" })
        }
        else res.status(400).json({ message: "Required data missing." })
    }
    if (method == "GET") {
        res.status(100).json({ message: "GET request not accepted." })
    }
}