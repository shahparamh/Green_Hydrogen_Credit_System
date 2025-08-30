// scripts/mint.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer, verifier, producer] = await ethers.getSigners();
  const addresses = require("../frontend/src/contract-addresses.json");
  const contract = await ethers.getContractAt("HydrogenCredits", addresses.HydrogenCredits);

  console.log("Certifier issuing credit to producer...");
  const tx = await contract.connect(verifier).issueCredits(producer.address, 100); // 100 units
  await tx.wait();
  console.log("✅ Credit issued to:", producer.address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
