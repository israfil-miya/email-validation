import express from "express";
const router = express.Router()

router.get("/", (req, res) => {
    const data = {
        author: "MD Israfil Miya",
        github: "https://github.com/GitPro10/emails-validator/tree/api",
        routes: [
            {
                name: "info",
                path: "/api",
                method: "GET",
                description: "gives you information about this api"
            },
            {
                name: "validate-one",
                path: "/api/validate-one",
                method: "POST",
                description: "used to validate single/one email"
            },
            {
                name: "validate-bulk",
                path: "/api/validate-bulk",
                method: "POST",
                description: "used to validate multiple/bulk email"
            }
        ],
        homepage: "/",
        thanks: "Thanks to all my users, for using this API. This API is completely free to use. I am grateful."
    }
    res.status(200).json(data)
})

export default router