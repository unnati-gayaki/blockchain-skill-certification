// backend/debug_issue_and_read.js
const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const abi = [
  "function issueCertificate(string,string,string,string,bool) public",
  "function getCertificate(string) public view returns (tuple(string certId,string studentName,string courseName,string aiSkillLevel,bool aiMatch,uint256 issuedAt,address issuer))"
];
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function main() {
  const certId = "DEBUGCERT";
  console.log("Sending issueCertificate tx...");
  const tx = await contract.issueCertificate(certId, "DebugName", "DebugCourse", "Advanced", true);
  const receipt = await tx.wait();
  console.log("Tx mined:", receipt.transactionHash);
  console.log("Now reading back...");
  const data = await contract.getCertificate(certId);
  console.log("Returned struct:", data);
}
main().catch(e => console.error(e));
