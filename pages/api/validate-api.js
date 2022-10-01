import { Inngest } from 'inngest'
import { validateOne } from '../../utils/validate';
export const client = new Inngest({ name: "EMAILS VALIDATION SYSTEM", eventKey: process.env.INNGEST_EVENT_KEY })

export default async function handle(req, res) {

    const reqData = req.body
    
    if (reqData.oneEmail) {
        let verify = await validateOne(reqData.oneEmail)
        res.status(200).json(verify)
    } else {
        client.send({
            name: "validate",
            data: {
                fileBase64: reqData.fileBase64,
                filename: reqData.filename
            }
        });

        res.status(200).json({ status: "done" })
    }

}