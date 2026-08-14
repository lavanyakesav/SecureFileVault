const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/usercontroller");

router.post(
    "/register",
    userController.register
);

router.post(
    "/login",
    userController.login
);

router.get(
    "/user-email",
    userController.getUserEmail
);

module.exports = router;