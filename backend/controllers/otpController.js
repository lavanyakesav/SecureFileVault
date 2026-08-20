const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const otpStore = {};

console.log("🔥 OTP CONTROLLER LOADED");

// =========================
// SEND OTP
// =========================

exports.sendOTP = async (req, res) => {

    const { email } = req.body;

    console.log("📧 OTP requested for:", email);

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

    console.log("🔐 OTP generated");

    try {

        const { data, error } = await resend.emails.send({
            from: "SecureFileVault <onboarding@resend.dev>",
            to: [email],
            subject: "SecureFileVault - OTP Verification",
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>SecureFileVault</h2>

                    <p>Your OTP for file decryption is:</p>

                    <h1 style="letter-spacing: 5px;">
                        ${otp}
                    </h1>

                    <p>This OTP is valid for 5 minutes.</p>

                    <p>
                        Do not share this OTP with anyone.
                    </p>
                </div>
            `
        });

        if (error) {

            console.error("❌ Resend API Error:");
            console.error(error);

            delete otpStore[email];

            return res.status(500).json({
                success: false,
                message: "Failed to send OTP"
            });
        }

        console.log("✅ OTP sent successfully");
        console.log("📨 Resend ID:", data?.id);

        return res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {

        console.error("❌ OTP Sending Error:");
        console.error(error);

        delete otpStore[email];

        return res.status(500).json({
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

    console.log("🔍 OTP verification requested for:", email);

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

    console.log("✅ OTP verified successfully");

    return res.json({
        success: true,
        message: "OTP verified successfully"
    });
};