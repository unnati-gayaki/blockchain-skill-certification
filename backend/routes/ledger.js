const express = require("express");
const router = express.Router();
const { getAllCertificates } = require("../services/blockchainClient");

router.get("/", async (req, res) => {
  try {
    const data = await getAllCertificates();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ledger fetch failed" });
  }
});

module.exports = router;
