require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

// ==============================
// ROUTES
// ==============================

const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const decryptRoutes = require("./routes/decryptRoutes");
const fileRoutes = require("./routes/fileRoutes");
const myFilesRoutes = require("./routes/myFilesRoutes");
const otpRoutes = require("./routes/otpRoutes");


// ==============================
// APP
// ==============================

const app = express();


// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==============================
// DATABASE CONNECTION
// ==============================

db.connect((err) => {

    if (err) {

        console.error(
            "❌ Database Connection Failed:"
        );

        console.error(err.message);

        return;
    }

    console.log(
        "✅ Database Connected Successfully"
    );

});


// ==============================
// API ROUTES
// ==============================

app.use("/api/users", userRoutes);

app.use("/api", uploadRoutes);

app.use("/api", decryptRoutes);

app.use("/api", fileRoutes);

app.use("/api", myFilesRoutes);

app.use("/api", otpRoutes);


// ==============================
// HOME ROUTE
// ==============================

app.get("/", (req, res) => {

    res.send(
        "🚀 Secure File Vault Server is Running..."
    );

});


// ==============================
// SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on port ${PORT}`);
});