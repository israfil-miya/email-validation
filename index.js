import express from "express";

import validateBulk from "./api/validate-bulk.js";
import validateOne from "./api/validate-one.js";

import info from "./api/info.js";
const port = 8000
const app = express()
app.use(express.json());

app.post("/api/validate-bulk", validateBulk)
app.post("/api/validate-one", validateOne)

app.get("/", (req, res)=> {
    res.sendFile('index.html', { root: '.' })
})

app.use("/api", info)
app.listen(port, () => {
    console.info(`API is up on port ${port}`);
});
