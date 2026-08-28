const express = require("express");
const router = express.Router();


const { sendTestEmail } = require("../controllers/emailController");

router.post("/test", sendTestEmail);

module.exports = router;