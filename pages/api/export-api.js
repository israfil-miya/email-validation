import { Inngest } from 'inngest'
export const client = new Inngest({ name: "EMAILS VALIDATION SYSTEM", eventKey: process.env.INNGEST_EVENT_KEY })

export default async function handle(req, res) {

    const reqData = req.body
    const { method } = req
    if (method == "POST") {
        if (reqData.emailsJson && reqData.exportExtension) {
            client.send({
                name: "export",
                data: {
                    emailsJson: reqData.emailsJson,
                    exportExtension: reqData.exportExtension
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