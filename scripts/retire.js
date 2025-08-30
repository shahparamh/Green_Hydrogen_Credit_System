// scripts/retire.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer, verifier, producer, buyer] = await ethers.getSigners();
  const addresses = require("../frontend/src/contract-addresses.json");
  const contract = await ethers.getContractAt("HydrogenCredits", addresses.HydrogenCredits);

  console.log("Producer retiring 10 credits...");
  const tx = await contract.connect(producer).retireCredits(10);
  await tx.wait();

  console.log("🔥 Credits retired by:", producer.address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
