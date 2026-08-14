const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const {
    upload,
    encryptFile
} = require("../controllers/uploadController");

router.post("/upload", upload.single("file"), (req, res) => {

    console.log("====== Upload API Called ======");

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    const uploadedFile = req.file.path;

    const encryptedFile = path.join(
        __dirname,
        "..",
        "encrypted",
        req.file.filename + ".enc"
    );

    console.log("Uploaded File :", uploadedFile);
    console.log("Encrypted File :", encryptedFile);

    try {

        encryptFile(uploadedFile, encryptedFile);

        res.status(200).json({
            success: true,
            message: "File Uploaded & Encrypted Successfully"
        });

    } catch (err) {

        console.error("Encryption Error :", err);

        res.status(500).json({
            success: false,
            message: "Encryption Failed"
        });

    }

});

module.exports = router;