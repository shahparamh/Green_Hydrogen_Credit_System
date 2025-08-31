// scripts/deploy.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { ethers } = require("hardhat");

/**
 * @title Green Hydrogen Credit System Deployment Script
 * @dev Deploys all smart contracts and sets up initial configuration
 * @author GreenH2 Team
 * @notice This script deploys the complete system in the correct order
 */
async function main() {
  console.log("🚀 Starting Green Hydrogen Credit System deployment...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying contracts with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH\n`);

  try {
    // Step 1: Deploy HydrogenCredits contract
    console.log("📋 Step 1: Deploying HydrogenCredits contract...");
  const HydrogenCredits = await ethers.getContractFactory("HydrogenCredits");
    const hydrogenCredits = await HydrogenCredits.deploy("Green Hydrogen Credits", "GHC");
    await hydrogenCredits.deployed();
    console.log(`✅ HydrogenCredits deployed to: ${hydrogenCredits.address}`);

    // Step 2: Deploy TradeMarketplace contract
    console.log("\n📋 Step 2: Deploying TradeMarketplace contract...");
  const TradeMarketplace = await ethers.getContractFactory("TradeMarketplace");
    const tradeMarketplace = await TradeMarketplace.deploy(hydrogenCredits.address, deployer.address);
    await tradeMarketplace.deployed();
    console.log(`✅ TradeMarketplace deployed to: ${tradeMarketplace.address}`);

    // Step 3: Deploy Verification contract
    console.log("\n📋 Step 3: Deploying Verification contract...");
    const Verification = await ethers.getContractFactory("Verification");
    const verification = await Verification.deploy(hydrogenCredits.address);
    await verification.deployed();
    console.log(`✅ Verification deployed to: ${verification.address}`);

    // Step 4: Grant roles to contracts
    console.log("\n📋 Step 4: Setting up roles and permissions...");
    
    // Grant CERTIFIER_ROLE to Verification contract
    const CERTIFIER_ROLE = await hydrogenCredits.CERTIFIER_ROLE();
    await hydrogenCredits.grantRole(CERTIFIER_ROLE, verification.address);
    console.log(`✅ Granted CERTIFIER_ROLE to Verification contract`);

    // Grant MARKETPLACE_ADMIN_ROLE to deployer for TradeMarketplace
    const MARKETPLACE_ADMIN_ROLE = await tradeMarketplace.MARKETPLACE_ADMIN_ROLE();
    await tradeMarketplace.grantRole(MARKETPLACE_ADMIN_ROLE, deployer.address);
    console.log(`✅ Granted MARKETPLACE_ADMIN_ROLE to deployer`);

    // Step 5: Verify contract setup
    console.log("\n📋 Step 5: Verifying contract setup...");
    
    // Verify HydrogenCredits roles
    const hasCertifierRole = await hydrogenCredits.hasRole(CERTIFIER_ROLE, verification.address);
    console.log(`🔐 Verification contract has CERTIFIER_ROLE: ${hasCertifierRole}`);
    
    // Verify TradeMarketplace roles
    const hasMarketplaceAdminRole = await tradeMarketplace.hasRole(MARKETPLACE_ADMIN_ROLE, deployer.address);
    console.log(`🔐 Deployer has MARKETPLACE_ADMIN_ROLE: ${hasMarketplaceAdminRole}`);

    // Step 6: Save deployment addresses
    console.log("\n📋 Step 6: Saving deployment addresses...");
    
    const deploymentInfo = {
      network: network.name,
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      contracts: {
        HydrogenCredits: {
          address: hydrogenCredits.address,
          name: "Green Hydrogen Credits",
          symbol: "GHC",
          description: "ERC20 token representing Green Hydrogen Credits"
        },
        TradeMarketplace: {
          address: tradeMarketplace.address,
          description: "Decentralized marketplace for trading Green Hydrogen Credits"
        },
        Verification: {
          address: verification.address,
          description: "Smart contract for verifying green hydrogen production"
        }
      },
      roles: {
        deployer: {
          address: deployer.address,
          roles: [
            "DEFAULT_ADMIN_ROLE",
            "REGULATOR_ROLE", 
            "PRODUCER_ROLE",
            "CERTIFIER_ROLE",
            "BUYER_ROLE",
            "AUDITOR_ROLE"
          ]
        },
        verificationContract: {
          address: verification.address,
          roles: ["CERTIFIER_ROLE"]
        }
      },
      verification: {
        hydrogenCreditsContract: hydrogenCredits.address,
        tradeMarketplaceContract: tradeMarketplace.address,
        verificationContract: verification.address
      }
    };

    // Save to contract-addresses.json
    const fs = require('fs');
    const path = require('path');
    
    // Update root contract-addresses.json
    const rootAddressesPath = path.join(__dirname, '../contract-addresses.json');
    fs.writeFileSync(rootAddressesPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`✅ Contract addresses saved to: ${rootAddressesPath}`);

    // Update frontend contract-addresses.json
    const frontendAddressesPath = path.join(__dirname, '../frontend/contract-addresses.json');
    fs.writeFileSync(frontendAddressesPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`✅ Contract addresses saved to: ${frontendAddressesPath}`);

    // Update backend contract-addresses.json
    const backendAddressesPath = path.join(__dirname, '../backend/contract-addresses.json');
    fs.writeFileSync(backendAddressesPath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`✅ Contract addresses saved to: ${backendAddressesPath}`);

    // Step 7: Display deployment summary
    console.log("\n🎉 Deployment completed successfully!");
    console.log("=" .repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=" .repeat(60));
    console.log(`🌐 Network: ${network.name}`);
    console.log(`👤 Deployer: ${deployer.address}`);
    console.log(`⏰ Deployment Time: ${deploymentInfo.deploymentTime}`);
    console.log("\n📜 CONTRACTS:");
    console.log(`   HydrogenCredits: ${hydrogenCredits.address}`);
    console.log(`   TradeMarketplace: ${tradeMarketplace.address}`);
    console.log(`   Verification: ${verification.address}`);
    console.log("\n🔐 ROLES ASSIGNED:");
    console.log(`   Deployer: ${deploymentInfo.roles.deployer.roles.join(', ')}`);
    console.log(`   Verification Contract: ${deploymentInfo.roles.verificationContract.roles.join(', ')}`);
    console.log("\n💡 NEXT STEPS:");
    console.log("   1. Verify contracts on blockchain explorer");
    console.log("   2. Update environment variables in backend/.env");
    console.log("   3. Update frontend environment variables");
    console.log("   4. Test contract interactions");
    console.log("   5. Deploy to production network");

    // Step 8: Verify contracts (if on supported network)
    if (network.name !== "hardhat" && network.name !== "localhost") {
      console.log("\n📋 Step 8: Verifying contracts on blockchain explorer...");
      console.log("⏳ Waiting 30 seconds before verification...");
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      try {
        console.log("🔍 Verifying HydrogenCredits contract...");
        await hre.run("verify:verify", {
          address: hydrogenCredits.address,
          constructorArguments: ["Green Hydrogen Credits", "GHC"],
        });
        console.log("✅ HydrogenCredits verified successfully");
      } catch (error) {
        console.log("⚠️  HydrogenCredits verification failed:", error.message);
      }

      try {
        console.log("🔍 Verifying TradeMarketplace contract...");
        await hre.run("verify:verify", {
          address: tradeMarketplace.address,
          constructorArguments: [hydrogenCredits.address, deployer.address],
        });
        console.log("✅ TradeMarketplace verified successfully");
      } catch (error) {
        console.log("⚠️  TradeMarketplace verification failed:", error.message);
      }

      try {
        console.log("🔍 Verifying Verification contract...");
        await hre.run("verify:verify", {
          address: verification.address,
          constructorArguments: [hydrogenCredits.address],
        });
        console.log("✅ Verification verified successfully");
      } catch (error) {
        console.log("⚠️  Verification verification failed:", error.message);
      }
    }

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

/**
 * @dev Handle deployment errors gracefully
 */
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
});
