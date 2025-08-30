import pkg from 'hardhat';
const { ethers } = pkg;
import { expect } from "chai";

describe("HydrogenCredits System", function () {
  let HydrogenCredits;
  let hydrogenCredits;
  let owner, verifier, producer, buyer;

  beforeEach(async function () {
    [owner, verifier, producer, buyer] = await ethers.getSigners();

    HydrogenCredits = await ethers.getContractFactory("HydrogenCredits");

    // ✅ Ethers v6: no `.deployed()` needed
    hydrogenCredits = await HydrogenCredits.deploy(verifier.address);
  });

  it("Verifier can issue credits to a producer", async function () {
    await hydrogenCredits.connect(verifier).issueCredits(producer.address, 100);
    expect(await hydrogenCredits.balanceOf(producer.address)).to.equal(100);
  });

  it("Non-verifier cannot issue credits", async function () {
    await expect(
      hydrogenCredits.connect(buyer).issueCredits(producer.address, 100)
    ).to.be.revertedWith("Only verifier can issue credits");
  });

  it("Producer can transfer credits to buyer", async function () {
    await hydrogenCredits.connect(verifier).issueCredits(producer.address, 200);

    await hydrogenCredits.connect(producer).transfer(buyer.address, 150);

    expect(await hydrogenCredits.balanceOf(buyer.address)).to.equal(150);
    expect(await hydrogenCredits.balanceOf(producer.address)).to.equal(50);
  });

  it("Holder can retire (burn) credits", async function () {
    await hydrogenCredits.connect(verifier).issueCredits(producer.address, 300);

    await hydrogenCredits.connect(producer).retireCredits(100);

    expect(await hydrogenCredits.balanceOf(producer.address)).to.equal(200);
  });

  it("Owner can change verifier", async function () {
    await hydrogenCredits.connect(owner).setVerifier(buyer.address);
    expect(await hydrogenCredits.verifier()).to.equal(buyer.address);
  });

  it("Non-owner cannot change verifier", async function () {
    await expect(
      hydrogenCredits.connect(producer).setVerifier(buyer.address)
    ).to.be.reverted;
  });
});
