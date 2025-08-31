const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HydrogenCredits", function () {
  let HydrogenCredits, hydrogenCredits;
  let owner, producer, certifier, buyer, auditor, regulator;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, producer, certifier, buyer, auditor, regulator, ...addrs] = await ethers.getSigners();

    // Deploy contract
    HydrogenCredits = await ethers.getContractFactory("HydrogenCredits");
    hydrogenCredits = await HydrogenCredits.deploy("Green Hydrogen Credits", "GHC");
    await hydrogenCredits.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should set the right name and symbol", async function () {
      expect(await hydrogenCredits.name()).to.equal("Green Hydrogen Credits");
      expect(await hydrogenCredits.symbol()).to.equal("GHC");
    });

    it("Should grant initial roles to deployer", async function () {
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.PRODUCER_ROLE(), owner.address)).to.be.true;
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.CERTIFIER_ROLE(), owner.address)).to.be.true;
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.BUYER_ROLE(), owner.address)).to.be.true;
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.AUDITOR_ROLE(), owner.address)).to.be.true;
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.REGULATOR_ROLE(), owner.address)).to.be.true;
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to grant roles", async function () {
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address)).to.be.true;
    });

    it("Should allow admin to revoke roles", async function () {
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);
      await hydrogenCredits.revokeRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);
      expect(await hydrogenCredits.hasRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address)).to.be.false;
    });

    it("Should not allow non-admin to grant roles", async function () {
      await expect(
        hydrogenCredits.connect(producer).grantRole(await hydrogenCredits.PRODUCER_ROLE(), addrs[0].address)
      ).to.be.revertedWith("AccessControl");
    });
  });

  describe("Credit Minting", function () {
    beforeEach(async function () {
      // Grant certifier role to certifier
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);
      // Grant producer role to producer
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);
    });

    it("Should allow certifier to mint credits", async function () {
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await expect(
        hydrogenCredits.connect(certifier).mintCredits(
          producer.address,
          amount,
          metadataHash,
          location,
          productionMethod,
          carbonIntensity
        )
      ).to.emit(hydrogenCredits, "CreditsMinted");

      expect(await hydrogenCredits.balanceOf(producer.address)).to.equal(amount);
    });

    it("Should not allow non-certifier to mint credits", async function () {
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await expect(
        hydrogenCredits.connect(producer).mintCredits(
          producer.address,
          amount,
          metadataHash,
          location,
          productionMethod,
          carbonIntensity
        )
      ).to.be.revertedWith("HydrogenCredits: insufficient permissions");
    });

    it("Should validate minting parameters", async function () {
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await expect(
        hydrogenCredits.connect(certifier).mintCredits(
          producer.address,
          amount,
          metadataHash,
          location,
          productionMethod,
          carbonIntensity
        )
      ).to.be.revertedWith("Metadata hash required");
    });

    it("Should reject high carbon intensity", async function () {
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 1500; // Too high

      await expect(
        hydrogenCredits.connect(certifier).mintCredits(
          producer.address,
          amount,
          metadataHash,
          location,
          productionMethod,
          carbonIntensity
        )
      ).to.be.revertedWith("Carbon intensity too high");
    });

    it("Should create certificate with correct data", async function () {
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await hydrogenCredits.connect(certifier).mintCredits(
        producer.address,
        amount,
        metadataHash,
        location,
        productionMethod,
        carbonIntensity
      );

      const certificate = await hydrogenCredits.getCertificate(1);
      expect(certificate.producer).to.equal(producer.address);
      expect(certificate.certifier).to.equal(certifier.address);
      expect(certificate.amount).to.equal(amount);
      expect(certificate.metadataHash).to.equal(metadataHash);
      expect(certificate.location).to.equal(location);
      expect(certificate.productionMethod).to.equal(productionMethod);
      expect(certificate.carbonIntensity).to.equal(carbonIntensity);
      expect(certificate.isRetired).to.be.false;
    });
  });

  describe("Credit Transfer with Certificates", function () {
    beforeEach(async function () {
      // Grant roles
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);
      await hydrogenCredits.grantRole(await hydrogenCredits.BUYER_ROLE(), buyer.address);

      // Mint initial credits
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await hydrogenCredits.connect(certifier).mintCredits(
        producer.address,
        amount,
        metadataHash,
        location,
        productionMethod,
        carbonIntensity
      );
    });

    it("Should allow transfer with certificates", async function () {
      const transferAmount = ethers.utils.parseEther("500");
      const certificateIds = [1];

      await expect(
        hydrogenCredits.connect(producer).transferWithCertificates(
          buyer.address,
          transferAmount,
          certificateIds
        )
      ).to.emit(hydrogenCredits, "CreditsTransferred");

      expect(await hydrogenCredits.balanceOf(buyer.address)).to.equal(transferAmount);
    });

    it("Should not allow transfer without certificate ownership", async function () {
      const transferAmount = ethers.utils.parseEther("500");
      const certificateIds = [1];

      await expect(
        hydrogenCredits.connect(buyer).transferWithCertificates(
          addrs[0].address,
          transferAmount,
          certificateIds
        )
      ).to.be.revertedWith("Not certificate owner");
    });

    it("Should not allow transfer of retired certificates", async function () {
      // First retire the credits
      const retireAmount = ethers.utils.parseEther("1000");
      const certificateIds = [1];
      const reason = "Carbon offset claim";

      await hydrogenCredits.connect(producer).retireCredits(
        retireAmount,
        certificateIds,
        reason
      );

      // Try to transfer retired credits
      const transferAmount = ethers.utils.parseEther("500");
      await expect(
        hydrogenCredits.connect(producer).transferWithCertificates(
          buyer.address,
          transferAmount,
          certificateIds
        )
      ).to.be.revertedWith("Certificate retired");
    });
  });

  describe("Credit Retirement", function () {
    beforeEach(async function () {
      // Grant roles
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);

      // Mint initial credits
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await hydrogenCredits.connect(certifier).mintCredits(
        producer.address,
        amount,
        metadataHash,
        location,
        productionMethod,
        carbonIntensity
      );
    });

    it("Should allow credit retirement", async function () {
      const retireAmount = ethers.utils.parseEther("500");
      const certificateIds = [1];
      const reason = "Carbon offset claim";

      const initialBalance = await hydrogenCredits.balanceOf(producer.address);
      const initialTotalSupply = await hydrogenCredits.totalSupply();

      await expect(
        hydrogenCredits.connect(producer).retireCredits(
          retireAmount,
          certificateIds,
          reason
        )
      ).to.emit(hydrogenCredits, "CreditsRetired");

      expect(await hydrogenCredits.balanceOf(producer.address)).to.equal(initialBalance.sub(retireAmount));
      expect(await hydrogenCredits.totalSupply()).to.equal(initialTotalSupply.sub(retireAmount));
    });

    it("Should mark certificates as retired", async function () {
      const retireAmount = ethers.utils.parseEther("1000");
      const certificateIds = [1];
      const reason = "Carbon offset claim";

      await hydrogenCredits.connect(producer).retireCredits(
        retireAmount,
        certificateIds,
        reason
      );

      const certificate = await hydrogenCredits.getCertificate(1);
      expect(certificate.isRetired).to.be.true;
      expect(certificate.retirementReason).to.equal(reason);
      expect(certificate.retirementTimestamp).to.be.gt(0);
    });

    it("Should not allow retirement without certificate ownership", async function () {
      const retireAmount = ethers.utils.parseEther("500");
      const certificateIds = [1];
      const reason = "Carbon offset claim";

      await expect(
        hydrogenCredits.connect(buyer).retireCredits(
          retireAmount,
          certificateIds,
          reason
        )
      ).to.be.revertedWith("Not certificate owner");
    });

    it("Should not allow retirement of already retired certificates", async function () {
      const retireAmount = ethers.utils.parseEther("1000");
      const certificateIds = [1];
      const reason = "Carbon offset claim";

      // First retirement
      await hydrogenCredits.connect(producer).retireCredits(
        retireAmount,
        certificateIds,
        reason
      );

      // Try to retire again
    await expect(
        hydrogenCredits.connect(producer).retireCredits(
          ethers.utils.parseEther("100"),
          certificateIds,
          "Another reason"
        )
      ).to.be.revertedWith("Certificate retired");
    });
  });

  describe("Certificate Management", function () {
    beforeEach(async function () {
      // Grant roles
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);

      // Mint initial credits
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await hydrogenCredits.connect(certifier).mintCredits(
        producer.address,
        amount,
        metadataHash,
        location,
        productionMethod,
        carbonIntensity
      );
    });

    it("Should return producer certificates", async function () {
      const certificates = await hydrogenCredits.getProducerCertificates(producer.address);
      expect(certificates).to.have.lengthOf(1);
      expect(certificates[0]).to.equal(1);
    });

    it("Should return certifier certificates", async function () {
      const certificates = await hydrogenCredits.getCertifierCertificates(certifier.address);
      expect(certificates).to.have.lengthOf(1);
      expect(certificates[0]).to.equal(1);
    });

    it("Should return buyer certificates after transfer", async function () {
      // Grant buyer role
      await hydrogenCredits.grantRole(await hydrogenCredits.BUYER_ROLE(), buyer.address);

      // Transfer credits
      const transferAmount = ethers.utils.parseEther("500");
      const certificateIds = [1];

      await hydrogenCredits.connect(producer).transferWithCertificates(
        buyer.address,
        transferAmount,
        certificateIds
      );

      const certificates = await hydrogenCredits.getBuyerCertificates(buyer.address);
      expect(certificates).to.have.lengthOf(1);
      expect(certificates[0]).to.equal(1);
    });
  });

  describe("Pausable Functionality", function () {
    it("Should allow regulator to pause contract", async function () {
      await hydrogenCredits.pause();
      expect(await hydrogenCredits.paused()).to.be.true;
    });

    it("Should allow regulator to unpause contract", async function () {
      await hydrogenCredits.pause();
      await hydrogenCredits.unpause();
      expect(await hydrogenCredits.paused()).to.be.false;
    });

    it("Should not allow non-regulator to pause contract", async function () {
      await expect(
        hydrogenCredits.connect(producer).pause()
      ).to.be.revertedWith("AccessControl");
    });

    it("Should prevent operations when paused", async function () {
      await hydrogenCredits.pause();

      // Grant roles first
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);

      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await expect(
        hydrogenCredits.connect(certifier).mintCredits(
          producer.address,
          amount,
          metadataHash,
          location,
          productionMethod,
          carbonIntensity
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Account Statistics", function () {
    beforeEach(async function () {
      // Grant roles
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);

      // Mint initial credits
      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await hydrogenCredits.connect(certifier).mintCredits(
        producer.address,
        amount,
        metadataHash,
        location,
        productionMethod,
        carbonIntensity
      );
    });

    it("Should return correct account statistics", async function () {
      const stats = await hydrogenCredits.getAccountStats(producer.address);
      expect(stats.produced).to.equal(ethers.utils.parseEther("1000"));
      expect(stats.retired).to.equal(0);
    });

    it("Should update statistics after retirement", async function () {
      const retireAmount = ethers.utils.parseEther("500");
      const certificateIds = [1];
      const reason = "Carbon offset claim";

      await hydrogenCredits.connect(producer).retireCredits(
        retireAmount,
        certificateIds,
        reason
      );

      const stats = await hydrogenCredits.getAccountStats(producer.address);
      expect(stats.produced).to.equal(ethers.utils.parseEther("1000"));
      expect(stats.retired).to.equal(ethers.utils.parseEther("500"));
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amount gracefully", async function () {
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);
      await hydrogenCredits.grantRole(await hydrogenCredits.PRODUCER_ROLE(), producer.address);

      const amount = 0;
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

      await expect(
        hydrogenCredits.connect(certifier).mintCredits(
          producer.address,
          amount,
          metadataHash,
          location,
          productionMethod,
          carbonIntensity
        )
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should handle invalid addresses gracefully", async function () {
      await hydrogenCredits.grantRole(await hydrogenCredits.CERTIFIER_ROLE(), certifier.address);

      const amount = ethers.utils.parseEther("1000");
      const metadataHash = "QmTestHash123";
      const location = "Solar Farm Alpha, California";
      const productionMethod = "Solar Electrolysis";
      const carbonIntensity = 50;

    await expect(
        hydrogenCredits.connect(certifier).mintCredits(
          ethers.constants.AddressZero,
          amount,
          metadataHash,
          location,
          productionMethod,
          carbonIntensity
        )
      ).to.be.revertedWith("Invalid producer address");
    });
  });
});
