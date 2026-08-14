const fs = require("fs");
const path = require("path");

// Get All Encrypted Files
const getFiles = (req, res) => {

    const folderPath = path.join(__dirname, "..", "encrypted");

    fs.readdir(folderPath, (err, files) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Unable to read encrypted folder"
            });

        }

        // Show only .enc files
        const encryptedFiles = files.filter(file =>
            file.endsWith(".enc")
        );

        res.status(200).json({
            success: true,
            files: encryptedFiles
        });

    });

};

module.exports = {
    getFiles
};