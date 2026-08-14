// =========================
// Password Toggle
// =========================

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

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
// Confirm Password Toggle
// =========================

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        toggleConfirmPassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        confirmPassword.type = "password";
        toggleConfirmPassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';
    }

});


// =========================
// Register Form
// =========================

document.getElementById("registerForm").addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const fullname =
            document.getElementById("fullname").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const username =
            document.getElementById("username").value.trim();

        const passwordValue = password.value;

        const confirmPasswordValue =
            confirmPassword.value;


        // Check empty fields
        if (!fullname || !email || !username || !passwordValue) {

            alert("Please fill all fields.");
            return;

        }


        // Check password
        if (passwordValue !== confirmPasswordValue) {

            alert("Passwords do not match!");
            return;

        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        fullname: fullname,
                        email: email,
                        username: username,
                        password: passwordValue
                    })
                }
            );


            const data = await response.json();

            console.log("Register Response:", data);


            if (response.ok) {

                alert(
                    data.message ||
                    "Registration Successful!"
                );

                window.location.href = "login.html";

            } else {

                alert(
                    data.message ||
                    "Registration Failed!"
                );

            }


        } catch (error) {

            console.error("Registration Error:", error);

            alert("Server Connection Error!");

        }

    }
);