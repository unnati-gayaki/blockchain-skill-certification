const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "0x0", provider);

const abi = [
  "function getCertificate(string) public view returns (string,string,string,string,bool,uint256,address)"
];

const contractAddr = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddr, abi, wallet);

async function main() {
  console.log("Using provider:", process.env.RPC_URL, "contract:", contractAddr);
  const code = await provider.getCode(contractAddr);
  console.log("getCode:", code.slice(0,60));
  const certId = "CERT123"; // your test id
  try {
    const encoded = contract.interface.encodeFunctionData("getCertificate", [certId]);
    console.log("encoded data:", encoded);
    const raw = await provider.call({ to: contract.address, data: encoded });
    console.log("raw call result:", raw);
    if (!raw || raw === "0x") {
      console.error("RAW IS EMPTY. Either cert not issued, wrong address, wrong ABI or call reverted.");
      return;
    }
    const decoded = contract.interface.decodeFunctionResult("getCertificate", raw);
    console.log("decoded result:", decoded);
  } catch (e) {
    console.error("CALL ERROR:", e);
  }
}
main();
