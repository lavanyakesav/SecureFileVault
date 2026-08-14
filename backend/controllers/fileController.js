const db = require("../config/db");

// Save File Details
exports.saveFile = (req, res) => {

    const {
        user_id,
        original_name,
        encrypted_name,
        file_size
    } = req.body;

    const sql = `
        INSERT INTO files
        (user_id, original_name, encrypted_name, file_size)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [user_id, original_name, encrypted_name, file_size],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to save file details"
                });
            }

            res.status(200).json({
                success: true,
                message: "File details saved successfully"
            });

        }
    );

};

// Get All Files
exports.getFiles = (req, res) => {

    db.query(
        "SELECT * FROM files ORDER BY upload_date DESC",
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

};