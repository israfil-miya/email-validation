import express from "express";
import validateBulk from "./api/validate-bulk.js";
import validateOne from "./api/validate-one.js";
import info from "./api/info";

const app = express()
const PORT = 8000

app.use("/api", info)
app.listen(PORT, () => {
    console.info(`API is up on port ${PORT}`);
});
