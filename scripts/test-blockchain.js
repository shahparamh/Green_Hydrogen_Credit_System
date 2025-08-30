// scripts/test-blockchain.js
import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log("🚀 Testing Blockchain Functionality...\n");

  // Get signers
  const [owner, verifier, producer, buyer] = await ethers.getSigners();
  
  console.log("👥 Accounts:");
  console.log(`Owner: ${owner.address}`);
  console.log(`Verifier: ${verifier.address}`);
  console.log(`Producer: ${producer.address}`);
  console.log(`Buyer: ${buyer.address}\n`);

  // Get contract factory
  const HydrogenCredits = await ethers.getContractFactory("HydrogenCredits");
  
  // Deploy contract
  console.log("📦 Deploying HydrogenCredits contract...");
  const hydrogenCredits = await HydrogenCredits.deploy(verifier.address);
  await hydrogenCredits.waitForDeployment();
  
  const contractAddress = await hydrogenCredits.getAddress();
  console.log(`✅ Contract deployed to: ${contractAddress}\n`);

  // Test basic functionality
  console.log("🧪 Testing Basic Functionality:");
  
  // Issue credits
  console.log("1. Issuing 100 credits to producer...");
  const issueTx = await hydrogenCredits.connect(verifier).issueCredits(producer.address, 100);
  await issueTx.wait();
  console.log("   ✅ Credits issued successfully");
  
  // Check balance
  const producerBalance = await hydrogenCredits.balanceOf(producer.address);
  console.log(`   📊 Producer balance: ${producerBalance} credits`);
  
  // Transfer credits
  console.log("\n2. Transferring 50 credits from producer to buyer...");
  const transferTx = await hydrogenCredits.connect(producer).transfer(buyer.address, 50);
  await transferTx.wait();
  console.log("   ✅ Transfer successful");
  
  // Check balances after transfer
  const newProducerBalance = await hydrogenCredits.balanceOf(producer.address);
  const buyerBalance = await hydrogenCredits.balanceOf(buyer.address);
  console.log(`   📊 Producer balance: ${newProducerBalance} credits`);
  console.log(`   📊 Buyer balance: ${buyerBalance} credits`);
  
  // Retire credits
  console.log("\n3. Retiring 25 credits from producer...");
  const retireTx = await hydrogenCredits.connect(producer).retireCredits(25);
  await retireTx.wait();
  console.log("   ✅ Credits retired successfully");
  
  // Check final balance
  const finalProducerBalance = await hydrogenCredits.balanceOf(producer.address);
  console.log(`   📊 Final producer balance: ${finalProducerBalance} credits`);
  
  // Get total supply
  const totalSupply = await hydrogenCredits.totalSupply();
  console.log(`   📊 Total supply: ${totalSupply} credits`);
  
  console.log("\n🎉 All blockchain tests completed successfully!");
  console.log("🌱 The Green Hydrogen Credit System is working perfectly!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exitCode = 1;
});
