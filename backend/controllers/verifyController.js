const { getCertificateFromChain } = require("../services/blockchainClient");

exports.verifyCertificate = async (req, res) => {
  try {
    const certId = req.params.certId;

    console.log("Verifying cert:", certId);

    // Fetch on-chain data
    const cert = await getCertificateFromChain(certId);

    // if certificate not found
    if (!cert || !cert.certId || cert.certId === "") {
      return res.status(404).json({ error: "Certificate not found" });
    }

    return res.json({
      certId: cert.certId,
      studentName: cert.studentName,
      courseName: cert.courseName,
      aiSkillLevel: cert.aiSkillLevel,
      aiMatch: cert.aiMatch,
      issuedAt: cert.issuedAt,
      issuer: cert.issuer
    });

  } catch (error) {
    console.error("Verify error:", error);
    return res.status(500).json({ error: "Verification failed due to backend error" });
  }
};
  