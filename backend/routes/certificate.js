const express = require("express");
const router = express.Router();
const { getCertificateFromChain } = require("../services/blockchainClient");

router.get("/:certId", async (req, res) => {
  const { certId } = req.params;

  try {
    const cert = await getCertificateFromChain(certId);

    // REAL certificate page
    res.send(`
      <html>
        <head>
          <title>Certificate Verification</title>
          <style>
            body { font-family: Arial; background:#f8fafc; text-align:center; padding:40px; }
            .card { background:white; padding:30px; border-radius:12px; max-width:500px; margin:auto; }
            .real { color:green; font-size:28px; font-weight:bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="real">✅ REAL CERTIFICATE</div>
            <h2>${cert.studentName}</h2>
            <p>Course: ${cert.courseName}</p>
            <p>Skill Level: ${cert.aiSkillLevel}</p>
            <p>Blockchain Verified</p>
          </div>
        </body>
      </html>
    `);

  } catch (err) {
    // FAKE certificate page
    res.send(`
      <html>
        <head>
          <title>Certificate Verification</title>
        </head>
        <body style="font-family:Arial;text-align:center;padding:40px;">
          <h1 style="color:red;">❌ FAKE / INVALID CERTIFICATE</h1>
          <p>This certificate was not found on blockchain.</p>
        </body>
      </html>
    `);
  }
});

module.exports = router;
