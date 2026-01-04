// backend/debug_getcode.js
const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const addr = process.env.CONTRACT_ADDRESS;

async function main() {
  const code = await provider.getCode(addr);
  console.log("Contract address:", addr);
  console.log("Bytecode (first 60 chars):", code.slice(0, 60));
  if (code === "0x") {
    console.error("NO CONTRACT CODE found at that address. Redeploy, and update CONTRACT_ADDRESS in .env");
    process.exit(1);
  } else {
    console.log("Contract code present. Good.");
  }
}
main();
