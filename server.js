const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { scanCodeWithAI } = require("./aiScanner");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json({
    limit: "1mb"
}));


app.get("/", (req, res) => {

    res.json({
        message: "AI Code Scanner API is running"
    });

});


app.post("/api/ai-scan", async (req, res) => {

    try {

        const {
            codeName,
            language,
            code
        } = req.body;


        if (!codeName) {

            return res.status(400).json({
                error: "Code name is required"
            });

        }


        if (!language) {

            return res.status(400).json({
                error: "Language is required"
            });

        }


        if (!code) {

            return res.status(400).json({
                error: "Code is required"
            });

        }


        const result = await scanCodeWithAI(
            codeName,
            language,
            code
        );


        res.json(result);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            error: "AI scanning failed"
        });

    }

});


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});
