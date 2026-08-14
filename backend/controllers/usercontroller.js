const db = require("../config/db");
const bcrypt = require("bcryptjs");

// =====================================
// REGISTER USER
// =====================================

exports.register = async (req, res) => {

    const {
        fullname,
        email,
        username,
        password
    } = req.body;

    if (!fullname || !email || !username || !password) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }

    try {

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (fullname, email, username, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                fullname,
                email,
                username,
                hashedPassword
            ],
            (err, result) => {

                if (err) {

                    console.error(
                        "Registration Error:",
                        err
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Registration failed"
                    });

                }

                return res.status(201).json({
                    success: true,
                    message: "User Registered Successfully"
                });

            }
        );

    } catch (error) {

        console.error(
            "Register Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


// =====================================
// LOGIN USER
// =====================================

exports.login = (req, res) => {

    const {
        username,
        password
    } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });

    }

    const sql =
        "SELECT * FROM users WHERE username = ?";

    db.query(
        sql,
        [username],
        async (err, result) => {

            if (err) {

                console.error(
                    "Login Database Error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }

            if (result.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });

            }

            const user = result[0];

            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!passwordMatch) {

                    return res.status(401).json({
                        success: false,
                        message:
                            "Invalid username or password"
                    });

                }

                return res.json({
                    success: true,
                    message: "Login Successful",
                    username: user.username
                });

            } catch (error) {

                console.error(
                    "Password Compare Error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "Login failed"
                });

            }

        }
    );

};


// =====================================
// GET USER EMAIL
// =====================================

exports.getUserEmail = (req, res) => {

    const {
        username
    } = req.query;

    if (!username) {

        return res.status(400).json({
            success: false,
            message: "Username is required"
        });

    }

    const sql =
        "SELECT email FROM users WHERE username = ?";

    db.query(
        sql,
        [username],
        (err, result) => {

            if (err) {

                console.error(
                    "Get Email Database Error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }

            return res.json({
                success: true,
                email: result[0].email
            });

        }
    );

};