const express = require("express");
const { runPythonScript } = require("../Controllers/rankController");

const router = express.Router();

router.get("/run-python", runPythonScript);

module.exports = router;
