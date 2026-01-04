const express = require("express");
const router = express.Router();
const { verifyCertificate } = require("../controllers/verifyController");

router.get("/:certId", verifyCertificate);

module.exports = router;
