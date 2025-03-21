const express = require("express");
const { exec } = require("child_process");
const app = express();

app.get("/run-python", (req, res) => {
    exec("python scripts/Model_3.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        console.log(`Output: ${stdout}`);
        res.json({ message: stdout });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
