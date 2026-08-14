const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");

const downloadBtn = document.getElementById("downloadBtn");
const backBtn = document.getElementById("backBtn");

let selectedFile = null;

// ===============================
// Select Encrypted File
// ===============================

fileInput.addEventListener("change", () => {

    selectedFile = fileInput.files[0];

    if (selectedFile) {
        fileName.textContent = selectedFile.name;
    } else {
        fileName.textContent = "No File Selected";
    }

});

// ===============================
// Download & Decrypt
// ===============================

downloadBtn.addEventListener("click", () => {

    if (!selectedFile) {

        alert("Please select an encrypted (.enc) file.");
        return;

    }

    window.open(
        `http://localhost:5000/api/decrypt/${selectedFile.name}`,
        "_blank"
    );

});

// ===============================
// Back Button
// ===============================

backBtn.addEventListener("click", () => {

    window.location.href = "dashboard.html";

});