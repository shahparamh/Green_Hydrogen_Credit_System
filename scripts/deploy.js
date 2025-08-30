// scripts/deploy.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with:", deployer.address);

  // Deploy HydrogenCredits (constructor takes verifier address, here set to deployer)
  const HydrogenCredits = await ethers.getContractFactory("HydrogenCredits");
  const hydrogenCredits = await HydrogenCredits.deploy(deployer.address);
  await hydrogenCredits.waitForDeployment();
  console.log("✅ HydrogenCredits deployed to:", await hydrogenCredits.getAddress());

  // Deploy TradeMarketplace (constructor takes HydrogenCredits address)
  const TradeMarketplace = await ethers.getContractFactory("TradeMarketplace");
  const tradeMarketplace = await TradeMarketplace.deploy(await hydrogenCredits.getAddress());
  await tradeMarketplace.waitForDeployment();
  console.log("✅ TradeMarketplace deployed to:", await tradeMarketplace.getAddress());

  // Save contract addresses
  const addresses = {
    HydrogenCredits: await hydrogenCredits.getAddress(),
    TradeMarketplace: await tradeMarketplace.getAddress(),
  };

  const addressesPath = path.join(__dirname, "../frontend/src/contract-addresses.json");
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("📌 Contract addresses saved to frontend/src/contract-addresses.json");

  // Save ABIs
  const abiDir = path.join(__dirname, "../frontend/src/abis");
  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir, { recursive: true });
  }

  const artifactHydrogenCredits = await artifacts.readArtifact("HydrogenCredits");
  fs.writeFileSync(
    path.join(abiDir, "HydrogenCredits.json"),
    JSON.stringify(artifactHydrogenCredits, null, 2)
  );

  const artifactTradeMarketplace = await artifacts.readArtifact("TradeMarketplace");
  fs.writeFileSync(
    path.join(abiDir, "TradeMarketplace.json"),
    JSON.stringify(artifactTradeMarketplace, null, 2)
  );

  console.log("📌 ABIs saved to frontend/src/abis/");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
