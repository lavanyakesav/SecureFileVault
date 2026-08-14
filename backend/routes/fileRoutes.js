const express = require("express");

const router = express.Router();

const {
    saveFile,
    getFiles
} = require("../controllers/fileController");

// Save File Details
router.post("/save-file", saveFile);

module.exports = router;