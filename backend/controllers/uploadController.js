const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadPath = path.join(__dirname, "..", "uploads");
const encryptedPath = path.join(__dirname, "..", "encrypted");

// Create folders if not exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

if (!fs.existsSync(encryptedPath)) {
    fs.mkdirSync(encryptedPath, { recursive: true });
}

const SECRET_KEY = Buffer.from(process.env.SECRET_KEY);

// ==============================
// Multer Storage
// ==============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        // Keep original file name
        cb(null, file.originalname);

    }

});

const upload = multer({ storage });


// ==============================
// Encryption
// ==============================

const encryptFile = (inputFile, outputFile) => {

    console.log("Encryption Started...");

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        SECRET_KEY,
        iv
    );

    const input = fs.createReadStream(inputFile);
    const output = fs.createWriteStream(outputFile);

    // Store IV at beginning of encrypted file
    output.write(iv);

    input.pipe(cipher).pipe(output);


    output.on("close", () => {

        console.log("✅ Encryption Completed");

        if (fs.existsSync(inputFile)) {

            fs.unlinkSync(inputFile);

            console.log("🗑 Original File Deleted");

        }

    });


    input.on("error", (err) => {
        console.error("Input Error:", err);
    });


    output.on("error", (err) => {
        console.error("Output Error:", err);
    });


    cipher.on("error", (err) => {
        console.error("Cipher Error:", err);
    });

};


module.exports = {
    upload,
    encryptFile
};