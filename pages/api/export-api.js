import { Inngest } from 'inngest'
export const client = new Inngest({ name: "EMAILS VALIDATION SYSTEM", eventKey: process.env.INNGEST_EVENT_KEY })

export default async function handle(req, res) {

    const reqData = req.body

    client.send({
        name: "export",
        data: {
            emailsJson: reqData.emailsJson,
            exportExtension: reqData.exportExtension    
        }
    });

    res.status(200).json({ status: "done" })
}