import { createFunction } from "inngest";
import { validate_emails } from "../utils/validate.js"
const Pusher = require('pusher')

const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.NEXT_PUBLIC_key,
    secret: process.env.secret,
    cluster: process.env.NEXT_PUBLIC_cluster,
    useTLS: true
})



export const validate = createFunction("emails-validation", "validate", async ({ event }) => {
    let {data} = event
    
    let fileBuffer = Buffer.from(data.fileBase64, 'base64');
    let emailJson = await validate_emails(fileBuffer, data.filename)
    
    pusher.trigger("emails-validation", "validated", emailJson)

})
