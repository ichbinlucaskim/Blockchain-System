const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy LoopComparison
  console.log("\n1. Deploying LoopComparison contract...");
  const LoopComparison = await hre.ethers.getContractFactory("LoopComparison");
  const loopComparison = await LoopComparison.deploy();
  await loopComparison.waitForDeployment();
  console.log("LoopComparison deployed to:", await loopComparison.getAddress());

  // Deploy StorageVsMemory
  console.log("\n2. Deploying StorageVsMemory contract...");
  const StorageVsMemory = await hre.ethers.getContractFactory("StorageVsMemory");
  const storageVsMemory = await StorageVsMemory.deploy();
  await storageVsMemory.waitForDeployment();
  console.log("StorageVsMemory deployed to:", await storageVsMemory.getAddress());

  // Deploy FunctionModularity
  console.log("\n3. Deploying FunctionModularity contract...");
  const FunctionModularity = await hre.ethers.getContractFactory("FunctionModularity");
  const functionModularity = await FunctionModularity.deploy();
  await functionModularity.waitForDeployment();
  console.log("FunctionModularity deployed to:", await functionModularity.getAddress());

  // Deploy MockERC20
  console.log("\n4. Deploying MockERC20 contract...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Test Token", "TEST", hre.ethers.parseEther("1000000"));
  await mockToken.waitForDeployment();
  console.log("MockERC20 deployed to:", await mockToken.getAddress());

  // Deploy TokenAirdrop
  console.log("\n5. Deploying TokenAirdrop contract...");
  const TokenAirdrop = await hre.ethers.getContractFactory("TokenAirdrop");
  const tokenAirdrop = await TokenAirdrop.deploy(await mockToken.getAddress());
  await tokenAirdrop.waitForDeployment();
  console.log("TokenAirdrop deployed to:", await tokenAirdrop.getAddress());

  // Fund airdrop contract
  console.log("\n6. Funding TokenAirdrop contract...");
  const fundAmount = hre.ethers.parseEther("100000");
  await mockToken.transfer(await tokenAirdrop.getAddress(), fundAmount);
  console.log("Funded TokenAirdrop with", fundAmount.toString(), "tokens");

  console.log("\n=== Deployment Summary ===");
  console.log("LoopComparison:", await loopComparison.getAddress());
  console.log("StorageVsMemory:", await storageVsMemory.getAddress());
  console.log("FunctionModularity:", await functionModularity.getAddress());
  console.log("MockERC20:", await mockToken.getAddress());
  console.log("TokenAirdrop:", await tokenAirdrop.getAddress());
  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
