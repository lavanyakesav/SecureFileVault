const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SECRET_KEY = Buffer.from(process.env.SECRET_KEY);

// =========================
// DECRYPT FILE
// =========================

const decryptFile = (req, res) => {

    const fileName = req.params.fileName;

    const encryptedFile = path.join(
        __dirname,
        "..",
        "encrypted",
        fileName
    );

    const decryptedFile = path.join(
        __dirname,
        "..",
        "decrypted",
        fileName.replace(".enc", "")
    );

    // Check encrypted file
    if (!fs.existsSync(encryptedFile)) {

        return res.status(404).json({
            success: false,
            message: "Encrypted file not found"
        });

    }

    try {

        // Read encrypted file
        const encryptedData = fs.readFileSync(encryptedFile);

        // First 16 bytes = IV
        const iv = encryptedData.subarray(0, 16);

        // Remaining data = encrypted content
        const encryptedContent = encryptedData.subarray(16);

        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            SECRET_KEY,
            iv
        );

        const decryptedData = Buffer.concat([
            decipher.update(encryptedContent),
            decipher.final()
        ]);

        // Create decrypted folder
        const decryptedFolder = path.join(
            __dirname,
            "..",
            "decrypted"
        );

        if (!fs.existsSync(decryptedFolder)) {
            fs.mkdirSync(decryptedFolder, {
                recursive: true
            });
        }

        // Save decrypted file
        fs.writeFileSync(
            decryptedFile,
            decryptedData
        );

        console.log("✅ File Decrypted Successfully");

        // Download file
        res.download(
            decryptedFile,
            path.basename(decryptedFile),
            (err) => {

                if (err) {
                    console.error("Download Error:", err);
                }

            }
        );

    } catch (error) {

        console.error("Decryption Error:", error);

        return res.status(500).json({
            success: false,
            message: "Decryption Failed"
        });

    }

};

module.exports = {
    decryptFile
};