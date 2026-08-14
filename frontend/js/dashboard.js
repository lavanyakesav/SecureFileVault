// ==============================
// Sidebar Menu
// ==============================

// Upload
document.getElementById("uploadBtn").addEventListener("click", () => {
    window.location.href = "upload.html";
});


// My Files
document.getElementById("filesBtn").addEventListener("click", () => {
    window.location.href = "myfiles.html";
});


// Activity Logs
document.getElementById("logsBtn").addEventListener("click", () => {
    alert("Activity Logs Module - Coming Soon");
});


// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    const logout = confirm("Are you sure you want to logout?");

    if (logout) {
        localStorage.clear();
        window.location.href = "login.html";
    }

});


// ==============================
// Dashboard Cards
// ==============================

// Upload Card
document.getElementById("uploadCard").addEventListener("click", () => {
    window.location.href = "upload.html";
});


// My Files Card
document.getElementById("filesCard").addEventListener("click", () => {
    window.location.href = "myfiles.html";
});