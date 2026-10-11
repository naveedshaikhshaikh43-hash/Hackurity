const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=========================================");
  console.log("Deploying GovLogAnchor to local EVM...");
  console.log("=========================================");

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);

  const GovLogAnchor = await ethers.getContractFactory("GovLogAnchor");
  const govLogAnchor = await GovLogAnchor.deploy();
  await govLogAnchor.waitForDeployment();

  const contractAddress = await govLogAnchor.getAddress();
  console.log(` GovLogAnchor deployed successfully at: ${contractAddress}`);

  // Read ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/GovLogAnchor.sol/GovLogAnchor.json");
  let artifact = { abi: [] };
  if (fs.existsSync(artifactPath)) {
    artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  }

  const deploymentData = {
    contractAddress: contractAddress,
    network: "localhost",
    chainId: 31337,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    abi: artifact.abi,
  };

  // Export to contracts/deployment.json
  const exportPath = path.join(__dirname, "../deployment.json");
  fs.writeFileSync(exportPath, JSON.stringify(deploymentData, null, 2));
  console.log(` Saved deployment details to: ${exportPath}`);

  // Export to backend directory
  const backendDir = path.join(__dirname, "../../backend");
  if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir, { recursive: true });
  fs.writeFileSync(path.join(backendDir, "contract_deployment.json"), JSON.stringify(deploymentData, null, 2));
  console.log(` Exported to backend/contract_deployment.json`);

  // Export to frontend directory
  const frontendDir = path.join(__dirname, "../../frontend/src/config");
  if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
  fs.writeFileSync(path.join(frontendDir, "contract_deployment.json"), JSON.stringify(deploymentData, null, 2));
  console.log(` Exported to frontend/src/config/contract_deployment.json`);

  console.log("Deployment completed successfully!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
