// backend/oracle.js
import hardhat from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = hardhat;

// ===== CONFIG ===== //
const FIXED_AMOUNT = 100; // Number of credits to issue per producer

async function main() {
  try {
    // 1️⃣ Get first Hardhat account as oracle
    const [oracle] = await ethers.getSigners();
    console.log("Oracle address:", oracle.address);

    // 2️⃣ Load Verification ABI
    const artifactPath = path.join(process.cwd(), "backend", "Verification.json");
    if (!fs.existsSync(artifactPath)) {
      console.error("Cannot find Verification.json in backend folder!");
      process.exit(1);
    }
    const verificationJson = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    const verificationAbi = verificationJson.abi;

    // 3️⃣ Load addresses
    const addressesPath = path.join(process.cwd(), "backend", "contract-addresses.json");
    if (!fs.existsSync(addressesPath)) {
      console.error("Cannot find contract-addresses.json in backend folder!");
      process.exit(1);
    }
    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf-8"));
    const verificationAddress = addresses.Verification;
    const producers = addresses.Producers;

    if (!verificationAddress) {
      console.error("Verification contract address not found!");
      process.exit(1);
    }
    if (!producers || producers.length === 0) {
      console.error("No producers found in contract-addresses.json!");
      process.exit(1);
    }

    // 4️⃣ Create contract instance
    const verificationContract = new ethers.Contract(verificationAddress, verificationAbi, oracle);

    // 5️⃣ Issue credits for each producer
    for (const producerAddress of producers) {
      console.log(`\nIssuing ${FIXED_AMOUNT} credits to producer: ${producerAddress}`);
      const tx = await verificationContract.verifyProduction(producerAddress, FIXED_AMOUNT);
      console.log("Transaction sent. Hash:", tx.hash);

      const receipt = await tx.wait();
      console.log("✅ Credits issued successfully in block:", receipt.blockNumber);

      if (receipt.events && receipt.events.length > 0) {
        console.log("Events emitted:");
        receipt.events.forEach((event, index) => {
          console.log(`Event ${index + 1}:`, event.event, event.args);
        });
      } else {
        console.log("No events emitted for this transaction.");
      }
    }

    console.log("\nAll credits issued successfully!");

  } catch (err) {
    console.error("Error issuing credits:", err);
  }
}

main();
