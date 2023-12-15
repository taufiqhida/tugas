const express = require("express"),
    router = express.Router(),
    controller = require("../controllers/admin.controller")

router.post("/register", controller.register)
router.post("/login", controller.login)

module.exports=router