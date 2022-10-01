import { createFunction } from "inngest";
import { exportToFile } from "../utils/export.js"
const Pusher = require('pusher')

const pusher = new Pusher({
    appId: process.env.app_id,
    key: process.env.NEXT_PUBLIC_key,
    secret: process.env.secret,
    cluster: process.env.NEXT_PUBLIC_cluster,
    useTLS: true
})



export const exportFile = createFunction("file-exportation", "export", async ({ event }) => {
    let {data} = event

    let fileBuffer = exportToFile(data.emailsJson, data.exportExtension)

    let exportFileBase64 = Buffer.from(fileBuffer).toString("base64")
    
    let dataType
    switch (data.exportExtension) {
        case "txt":
            dataType = "data:text/plain;base64,"
            break;
        case "xlsx":
            dataType = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
            break;
        case "xls":
            dataType = "data:application/msexcel;base64,"
            break;
        case "csv":
            dataType = "data:text/csv;base64,"
            break;
        default:
            break;
    }
    
    pusher.trigger("emails-validation", "exported", { exportFileBase64, dataType })

})