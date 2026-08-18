const tableBody = document.getElementById("fileTable");
const backBtn = document.getElementById("backBtn");

// =====================================
// LOAD ENCRYPTED FILES
// =====================================

async function loadFiles() {

    try {
        const response = await fetch(
    "https://securefilevault-2skt.onrender.com/api/files"
);

        const data = await response.json();

        tableBody.innerHTML = "";

        if (
            !data.success ||
            !data.files ||
            data.files.length === 0
        ) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="2">
                        No Encrypted Files Found
                    </td>
                </tr>
            `;

            return;
        }

        data.files.forEach(file => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${file}</td>

                <td>
                    <button
                        onclick="decryptWithOTP('${file}')">

                        <i class="fa-solid fa-download"></i>

                        Download & Decrypt

                    </button>
                </td>
            `;

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Load Files Error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="2">
                    Unable to load files
                </td>
            </tr>
        `;

    }

}


// =====================================
// DECRYPT WITH OTP
// =====================================

async function decryptWithOTP(fileName) {

    console.log("Selected File:", fileName);

    // Get logged-in username
    const username =
        localStorage.getItem("username");

    console.log(
        "Logged-in Username:",
        username
    );

    if (!username) {

        alert(
            "User session not found. Please login again."
        );

        window.location.href = "login.html";

        return;
    }


    try {

        // =================================
        // GET REGISTERED EMAIL
        // =================================

        const emailResponse = await fetch(
            `http://localhost:5000/api/users/user-email?username=${encodeURIComponent(username)}`
        );

        const emailData =
            await emailResponse.json();

        console.log(
            "Email Response:",
            emailData
        );

        if (
            !emailResponse.ok ||
            !emailData.email
        ) {

            alert(
                "Unable to find registered email."
            );

            return;
        }

        const email =
            emailData.email;


        // =================================
        // SEND OTP
        // =================================

        const emailResponse = await fetch(
    `https://securefilevault-2skt.onrender.com/api/users/user-email?username=${encodeURIComponent(username)}`
);
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: email
                })
            }
        );

        const otpData =
            await otpResponse.json();

        console.log(
            "OTP Response:",
            otpData
        );

        if (!otpResponse.ok) {

            alert(
                otpData.message ||
                "Failed to send OTP."
            );

            return;
        }


        alert(
            "OTP sent to your registered email:\n" +
            email
        );


        // =================================
        // ENTER OTP
        // =================================

        const otp =
            prompt(
                "Enter the 6-digit OTP:"
            );

        if (!otp) {

            return;
        }


        // =================================
        // VERIFY OTP
        // =================================

        const verifyResponse =
    await fetch(
        "https://securefilevault-2skt.onrender.com/api/verify-otp",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        otp: otp
                    })
                }
            );


        const verifyData =
            await verifyResponse.json();

        console.log(
            "Verify Response:",
            verifyData
        );


        if (!verifyResponse.ok) {

            alert(
                verifyData.message ||
                "Invalid OTP."
            );

            return;
        }


        // =================================
        // OTP SUCCESS
        // =================================

        alert(
            "OTP Verified!\nDownloading file..."
        );


        // =================================
        // DOWNLOAD & DECRYPT
        // =================================

        const decryptURL =
    `https://securefilevault-2skt.onrender.com/api/decrypt/${encodeURIComponent(fileName)}`;

        console.log(
            "Decrypt URL:",
            decryptURL
        );


        window.location.href =
            decryptURL;


    } catch (error) {

        console.error(
            "OTP / Decryption Error:",
            error
        );

        alert(
            "Server Connection Error."
        );

    }

}


// =====================================
// BACK TO DASHBOARD
// =====================================

backBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "dashboard.html";

    }
);


// =====================================
// LOAD FILES WHEN PAGE OPENS
// =====================================

loadFiles();