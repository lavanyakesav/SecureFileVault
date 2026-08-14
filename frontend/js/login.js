const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");


// =========================
// Password Toggle
// =========================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});


// =========================
// Login
// =========================

document.getElementById("loginForm").addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const passwordValue =
            document.getElementById("password").value;


        if (!username || !passwordValue) {

            alert("Please enter username and password.");

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: passwordValue
                    })
                }
            );


            const data = await response.json();


            console.log("Login Response:", data);


            if (!response.ok) {

                alert(
                    data.message ||
                    "Invalid username or password."
                );

                return;
            }


            // Save username for My Files / OTP
            localStorage.setItem(
                "username",
                username
            );


            alert("Login Successful!");


            window.location.href =
                "dashboard.html";


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    }
);