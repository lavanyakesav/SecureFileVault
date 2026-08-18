const nodemailer = require("nodemailer");

const otpStore = {};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    tls: {
        rejectUnauthorized: false
    },

   auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: process.env.EMAIL_PASS.replace(/\s/g, "").trim()
}
});
console.log("🔥 OTP CONTROLLER LOADED");

// Test Gmail connection when server starts
transporter.verify((error, success) => {

    if (error) {
        console.error("❌ Gmail SMTP Error:");
        console.error(error);
    } else {
        console.log("✅ Gmail SMTP Ready");
    }

});


// =========================
// SEND OTP
// =========================

exports.sendOTP = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    otpStore[email] = {
        otp: otp,
        expiresAt: Date.now() + 5 * 60 * 1000
    };

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "CipherVault - OTP Verification",
            html: `
                <h2>CipherVault</h2>
                <p>Your OTP for file decryption is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
                <p>Do not share this OTP with anyone.</p>
            `
        });

        console.log("✅ OTP sent successfully to:", email);

        res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error("❌ OTP Sending Error:");
        console.error(error);

        delete otpStore[email];

        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });

    }
};


// =========================
// VERIFY OTP
// =========================

exports.verifyOTP = (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required"
        });
    }

    const storedData = otpStore[email];

    if (!storedData) {
        return res.status(400).json({
            success: false,
            message: "OTP not found or expired"
        });
    }

    if (Date.now() > storedData.expiresAt) {

        delete otpStore[email];

        return res.status(400).json({
            success: false,
            message: "OTP expired"
        });
    }

    if (otp !== storedData.otp) {

        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });
    }

    delete otpStore[email];

    res.json({
        success: true,
        message: "OTP verified successfully"
    });

};