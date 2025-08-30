const { ethers } = require("hardhat");

async function main() {
  const [deployer, certifier, producer, buyer] = await ethers.getSigners();
  const address = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // replace
  const contract = await ethers.getContractAt("GreenCredit", address);

  console.log("Producer transferring credit #0 to buyer...");
  const tx = await contract.connect(producer).transferFrom(producer.address, buyer.address, 0);
  await tx.wait();

  console.log("✅ Credit transferred to:", buyer.address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
