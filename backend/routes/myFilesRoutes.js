const express = require("express");

const router = express.Router();

const {
    getFiles
} = require("../controllers/myFilesController");

// Get all encrypted files
router.get("/files", getFiles);

module.exports = router;