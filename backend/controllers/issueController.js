const { getSkillPrediction } = require("../services/aiClient");
const {
  issueCertificateOnChain
} = require("../services/blockchainClient");

const { generateCertificatePDF } =
  require("../services/certificateGenerator");

const { addCertId } = require("../services/certRegistry");

exports.issueCertificate = async (req, res) => {
  try {
    const { certId, studentName, courseName, test_score, project_score, claimedSkill } = req.body;

    if (!certId || !studentName || !courseName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ AI Prediction
    const aiResponse = await getSkillPrediction({
      test_score,
      project_score
    });

    const predictedSkill = aiResponse.predicted_skill;
    const aiMatch = predictedSkill === claimedSkill;

    // 2️⃣ AI Confidence (percentage)
    const aiConfidence = Math.round(
      ((Number(test_score) + Number(project_score)) / 200) * 100
    );

    // 3️⃣ Store on blockchain
    const txHash = await issueCertificateOnChain({
      certId,
      studentName,
      courseName,
      aiSkillLevel: predictedSkill,
      aiMatch
    });

    // 4️⃣ Store certId for ledger
    addCertId(certId);

    // 5️⃣ Generate certificate PDF
    const pdfPath = await generateCertificatePDF({
      certId,
      studentName,
      courseName,
      aiMatch,
      aiConfidence
    });

    // 6️⃣ Send response to frontend
    res.json({
      message: "Certificate issued successfully",
      certId,
      predictedSkill,
      aiMatch,
      aiConfidence,
      txHash,
      certificateUrl: `http://localhost:5000/api/certificate/${certId}`,
      pdfPath
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Certificate issuing failed" });
  }
};
