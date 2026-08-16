const fileInput = document.getElementById("fileInput");
const chooseFileBtn = document.getElementById("chooseFileBtn");
const dropArea = document.getElementById("dropArea");

const fileDetails = document.getElementById("fileDetails");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const fileType = document.getElementById("fileType");

const encryptBtn = document.getElementById("encryptBtn");
const clearBtn = document.getElementById("clearBtn");
const backBtn = document.getElementById("backBtn");

let selectedFile = null;


// =====================================
// CHOOSE FILE BUTTON
// =====================================

chooseFileBtn.addEventListener("click", () => {
    fileInput.click();
});


// =====================================
// FILE SELECT
// =====================================

fileInput.addEventListener("change", () => {

    if (fileInput.files.length === 0) {
        return;
    }

    selectedFile = fileInput.files[0];

    showFileDetails(selectedFile);
});


// =====================================
// SHOW FILE DETAILS
// =====================================

function showFileDetails(file) {

    fileName.textContent = file.name;

    fileSize.textContent =
        formatFileSize(file.size);

    fileType.textContent =
        file.type || "Unknown";

    fileDetails.style.display = "flex";

}


// =====================================
// FORMAT FILE SIZE
// =====================================

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const i =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );

    return (
        Math.round(
            bytes /
            Math.pow(1024, i) *
            100
        ) / 100
    ) + " " + sizes[i];

}


// =====================================
// DRAG & DROP
// =====================================

dropArea.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        dropArea.style.borderColor =
            "#2563eb";

    }
);


dropArea.addEventListener(
    "dragleave",
    () => {

        dropArea.style.borderColor =
            "";

    }
);


dropArea.addEventListener(
    "drop",
    (event) => {

        event.preventDefault();

        dropArea.style.borderColor =
            "";

        const files =
            event.dataTransfer.files;

        if (files.length === 0) {
            return;
        }

        selectedFile = files[0];

        // Put dropped file into input
        const dataTransfer =
            new DataTransfer();

        dataTransfer.items.add(
            selectedFile
        );

        fileInput.files =
            dataTransfer.files;

        showFileDetails(selectedFile);

    }
);


// =====================================
// ENCRYPT & UPLOAD
// =====================================

encryptBtn.addEventListener(
    "click",
    async () => {

        if (!selectedFile) {

            alert(
                "Please choose a file first."
            );

            return;
        }


        const formData =
            new FormData();

        formData.append(
            "file",
            selectedFile
        );


        try {

            encryptBtn.disabled = true;

            encryptBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';


            const response =
    await fetch(
        "https://securefilevault-2skt.onrender.com/api/upload",
        {
            method: "POST",
            body: formData
        }
    );

            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "File upload failed."
                );

                return;
            }


            alert(
                data.message ||
                "File Uploaded & Encrypted Successfully!"
            );


            clearFile();


        } catch (error) {

            console.error(
                "Upload Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        } finally {

            encryptBtn.disabled = false;

            encryptBtn.innerHTML =
                '<i class="fa-solid fa-lock"></i> Encrypt & Upload';

        }

    }
);


// =====================================
// CLEAR
// =====================================

clearBtn.addEventListener(
    "click",
    () => {

        clearFile();

    }
);


function clearFile() {

    selectedFile = null;

    fileInput.value = "";

    fileName.textContent =
        "No file selected";

    fileSize.textContent =
        "-";

    fileType.textContent =
        "-";

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