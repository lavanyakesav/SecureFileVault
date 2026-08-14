const express = require("express");

const router = express.Router();

const {
    decryptFile
} = require("../controllers/decryptController");

// Decrypt & Download File
router.get("/decrypt/:fileName", decryptFile);

module.exports = router;