import { serve } from "inngest/next";
import { validate } from "../../inngest/validate-api.js";
import { exportFile } from "../../inngest/export-api.js"
 

export default serve("Emails Validation API", process.env.INNGEST_SIGNING_KEY, [validate, exportFile]);