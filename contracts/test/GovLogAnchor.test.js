const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require("crypto");

// Helper function to calculate SHA-256 buffer
function sha256(data) {
  return crypto.createHash("sha256").update(data).digest();
}

// Pair hashing with lexicographical sort matching GovLogAnchor.sol
function hashPair(a, b) {
  if (Buffer.compare(a, b) <= 0) {
    return sha256(Buffer.concat([a, b]));
  } else {
    return sha256(Buffer.concat([b, a]));
  }
}

// Build a simple SHA-256 Merkle Tree
function buildMerkleTree(leafBuffers) {
  if (leafBuffers.length === 0) throw new Error("No leaves");
  let currentLevel = [...leafBuffers];
  const tree = [currentLevel];

  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(hashPair(currentLevel[i], currentLevel[i + 1]));
      } else {
        // Odd leaf: duplicate or carry over
        nextLevel.push(currentLevel[i]);
      }
    }
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }

  const root = currentLevel[0];
  return { tree, root };
}

// Generate Merkle proof for leaf index
function getMerkleProof(tree, leafIndex) {
  const proof = [];
  let index = leafIndex;

  for (let level = 0; level < tree.length - 1; level++) {
    const currentLevel = tree[level];
    const isRightNode = index % 2 === 1;
    const siblingIndex = isRightNode ? index - 1 : index + 1;

    if (siblingIndex < currentLevel.length) {
      proof.push("0x" + currentLevel[siblingIndex].toString("hex"));
    }

    index = Math.floor(index / 2);
  }

  return proof;
}

describe("GovLogAnchor Smart Contract", function () {
  let govLogAnchor;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const GovLogAnchorFactory = await ethers.getContractFactory("GovLogAnchor");
    govLogAnchor = await GovLogAnchorFactory.deploy();
    await govLogAnchor.waitForDeployment();
  });

  it("Should initialize with zero batches and correct owner", async function () {
    expect(await govLogAnchor.totalBatches()).to.equal(0);
    expect(await govLogAnchor.totalLogsAnchored()).to.equal(0);
    expect(await govLogAnchor.owner()).to.equal(owner.address);
  });

  it("Should successfully anchor a batch and emit BatchAnchored event", async function () {
    const rawLogs = [
      "LOG#1: Land registry title transfer ID-8821 to Jane Doe",
      "LOG#2: Treasury disbursement $450,000 for infrastructure",
      "LOG#3: Law enforcement access record to case #9942",
      "LOG#4: National identity passport renewal user #1209",
    ];

    const leaves = rawLogs.map((log) => sha256(Buffer.from(log)));
    const { tree, root } = buildMerkleTree(leaves);
    const rootHex = "0x" + root.toString("hex");

    const tx = await govLogAnchor.anchorBatch(rootHex, rawLogs.length, "BATCH-2026-OCT-DEPT-FINANCE");
    const receipt = await tx.wait();

    expect(await govLogAnchor.totalBatches()).to.equal(1);
    expect(await govLogAnchor.totalLogsAnchored()).to.equal(4);

    const batch = await govLogAnchor.getBatch(1);
    expect(batch.batchId).to.equal(1);
    expect(batch.merkleRoot).to.equal(rootHex);
    expect(batch.logCount).to.equal(4);
    expect(batch.metadataURI).to.equal("BATCH-2026-OCT-DEPT-FINANCE");

    // Also check lookup by root
    const batchByRoot = await govLogAnchor.getBatchByRoot(rootHex);
    expect(batchByRoot.batchId).to.equal(1);
  });

  it("Should verify genuine logs and reject tampered logs", async function () {
    const rawLogs = [
      "LOG#1: Land registry title transfer ID-8821 to Jane Doe",
      "LOG#2: Treasury disbursement $450,000 for infrastructure",
      "LOG#3: Law enforcement access record to case #9942",
      "LOG#4: National identity passport renewal user #1209",
    ];

    const leaves = rawLogs.map((log) => sha256(Buffer.from(log)));
    const { tree, root } = buildMerkleTree(leaves);
    const rootHex = "0x" + root.toString("hex");

    await govLogAnchor.anchorBatch(rootHex, rawLogs.length, "BATCH-AUDIT-TEST");

    // Verify Log #2 (index 1)
    const leaf2Hex = "0x" + leaves[1].toString("hex");
    const proof2 = getMerkleProof(tree, 1);

    const isValid = await govLogAnchor.verifyProofSha256(rootHex, leaf2Hex, proof2);
    expect(isValid).to.equal(true);

    const callResult = await govLogAnchor.verifyLog.staticCall(1, leaf2Hex, proof2);
    expect(callResult).to.equal(true);

    // Now TAMPER: simulate altered log #2 (e.g. changing disbursement recipient or amount)
    const tamperedLog = "LOG#2: Treasury disbursement $990,000 to Malicious Entity";
    const tamperedLeafHex = "0x" + sha256(Buffer.from(tamperedLog)).toString("hex");

    const isTamperedValid = await govLogAnchor.verifyProofSha256(rootHex, tamperedLeafHex, proof2);
    expect(isTamperedValid).to.equal(false);

    const tamperedCallResult = await govLogAnchor.verifyLog.staticCall(1, tamperedLeafHex, proof2);
    expect(tamperedCallResult).to.equal(false);
  });

  it("Should reject duplicate root anchoring", async function () {
    const fakeRoot = "0x" + "aa".repeat(32);
    await govLogAnchor.anchorBatch(fakeRoot, 5, "BATCH-001");

    await expect(
      govLogAnchor.anchorBatch(fakeRoot, 10, "BATCH-DUPLICATE")
    ).to.be.revertedWith("Merkle root already anchored");
  });

  it("Should reject zero Merkle root and zero count", async function () {
    const zeroRoot = ethers.ZeroHash;
    await expect(
      govLogAnchor.anchorBatch(zeroRoot, 5, "BATCH-INVALID")
    ).to.be.revertedWith("Merkle root cannot be zero");

    const validRoot = "0x" + "bb".repeat(32);
    await expect(
      govLogAnchor.anchorBatch(validRoot, 0, "BATCH-INVALID")
    ).to.be.revertedWith("Log count must be greater than zero");
  });

  it("Should retrieve recent batches correctly", async function () {
    for (let i = 1; i <= 3; i++) {
      const root = "0x" + i.toString().padStart(2, "0").repeat(32);
      await govLogAnchor.anchorBatch(root, i * 10, `BATCH-${i}`);
    }

    const recent = await govLogAnchor.getRecentBatches(2);
    expect(recent.length).to.equal(2);
    expect(recent[0].batchId).to.equal(3);
    expect(recent[1].batchId).to.equal(2);
  });
});
