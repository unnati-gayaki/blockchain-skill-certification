const express = require("express");
const router = express.Router();
const { issueCertificate } = require("../controllers/issueController");

router.post("/", issueCertificate);
module.exports = router;
