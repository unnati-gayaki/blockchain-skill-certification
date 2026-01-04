const { ethers } = require("ethers");
require("dotenv").config();

const { addCertId, getAllCertIds } = require("./certRegistry");

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// ABI
const certificateAbi = [
  "function issueCertificate(string,string,string,string,bool) public",
  "function getCertificate(string) public view returns (tuple(string certId,string studentName,string courseName,string aiSkillLevel,bool aiMatch,uint256 issuedAt,address issuer))"
];

// Provider + Wallet + Contract
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, certificateAbi, wallet);

// ISSUE CERTIFICATE
module.exports.issueCertificateOnChain = async ({
  certId,
  studentName,
  courseName,
  aiSkillLevel,
  aiMatch
}) => {
  const tx = await contract.issueCertificate(
    certId,
    studentName,
    courseName,
    aiSkillLevel,
    aiMatch
  );

  await tx.wait();

  // ✅ STORE CERT ID FOR LEDGER
  addCertId(certId);

  return tx.hash;
};

// VERIFY CERTIFICATE
module.exports.getCertificateFromChain = async (certId) => {
  try {
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (!code || code === "0x") {
      throw new Error("No contract deployed at CONTRACT_ADDRESS.");
    }

    const cert = await contract.getCertificate(certId);

    return {
      certId: cert.certId,
      studentName: cert.studentName,
      courseName: cert.courseName,
      aiSkillLevel: cert.aiSkillLevel,
      aiMatch: cert.aiMatch,
      issuedAt: Number(cert.issuedAt),
      issuer: cert.issuer
    };
  } catch (err) {
    console.error("getCertificateFromChain error:", err);
    throw err;
  }
};

// LEDGER
module.exports.getAllCertificates = async () => {
  const certIds = getAllCertIds();
  const results = [];

  for (const id of certIds) {
    const cert = await contract.getCertificate(id);
    results.push({
      certId: cert.certId,
      studentName: cert.studentName,
      courseName: cert.courseName,
      aiSkillLevel: cert.aiSkillLevel,
      aiMatch: cert.aiMatch,
      issuedAt: Number(cert.issuedAt),
      issuer: cert.issuer
    });
  }

  return results;
};
