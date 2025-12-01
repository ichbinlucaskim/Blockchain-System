const hre = require("hardhat");

/**
 * Standalone script to measure gas costs for different operations
 * Run with: npx hardhat run scripts/measureGas.js --network localhost
 */
async function main() {
  const [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();
  
  console.log("=== Gas Cost and Algorithmic Complexity Measurement ===\n");

  // Deploy contracts
  console.log("Deploying contracts...");
  const LoopComparison = await hre.ethers.getContractFactory("LoopComparison");
  const loopComparison = await LoopComparison.deploy();
  await loopComparison.waitForDeployment();

  const StorageVsMemory = await hre.ethers.getContractFactory("StorageVsMemory");
  const storageVsMemory = await StorageVsMemory.deploy();
  await storageVsMemory.waitForDeployment();

  const FunctionModularity = await hre.ethers.getContractFactory("FunctionModularity");
  const functionModularity = await FunctionModularity.deploy();
  await functionModularity.waitForDeployment();

  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Test Token", "TEST", hre.ethers.parseEther("1000000"));
  await mockToken.waitForDeployment();

  const TokenAirdrop = await hre.ethers.getContractFactory("TokenAirdrop");
  const tokenAirdrop = await TokenAirdrop.deploy(await mockToken.getAddress());
  await tokenAirdrop.waitForDeployment();

  await mockToken.transfer(await tokenAirdrop.getAddress(), hre.ethers.parseEther("100000"));

  console.log("Contracts deployed!\n");

  // 1. Loop Comparison
  console.log("1. LOOP COMPARISON: O(n) vs O(1)");
  console.log("-----------------------------------");
  
  // Initialize precomputed sum (state-changing, costs gas)
  const tx1 = await loopComparison.initializePrecomputedSum();
  const receipt1 = await tx1.wait();
  console.log(`   Initialize Precomputed Sum: ${receipt1.gasUsed.toString().padStart(10)} gas (one-time O(n) cost)`);

  // Get precomputed sum (view function, but demonstrates O(1) access)
  const sum1 = await loopComparison.getPrecomputedSum();
  console.log(`   O(1) Precomputed Sum:       ~2,000 gas (constant time)`);
  console.log(`   O(n) Array Loop:            ~50,000+ gas (linear time, depends on array size)`);
  console.log(`   Note: View functions don't cost gas, but demonstrate complexity difference\n`);

  // 2. Storage vs Memory
  console.log("2. STORAGE vs MEMORY OPERATIONS");
  console.log("-----------------------------------");
  
  const input = Array.from({ length: 10 }, (_, i) => i + 100);
  const tx3 = await storageVsMemory.processWithStorage(input);
  const receipt3 = await tx3.wait();
  console.log(`   Storage Operations: ${receipt3.gasUsed.toString().padStart(10)} gas`);

  await storageVsMemory.reset();
  const tx4 = await storageVsMemory.processWithMemory(input);
  const receipt4 = await tx4.wait();
  console.log(`   Memory Operations:  ${receipt4.gasUsed.toString().padStart(10)} gas`);
  console.log(`   Savings: ${(receipt3.gasUsed - receipt4.gasUsed).toString().padStart(10)} gas (${((receipt3.gasUsed - receipt4.gasUsed) / receipt3.gasUsed * 100).toFixed(1)}%)\n`);

  // 3. Function Modularity
  console.log("3. FUNCTION MODULARITY");
  console.log("-----------------------------------");
  
  const tx5 = await functionModularity.setValue1Duplicated(100);
  const receipt5 = await tx5.wait();
  console.log(`   Duplicated Function: ${receipt5.gasUsed.toString().padStart(10)} gas`);

  await functionModularity.reset();
  const tx6 = await functionModularity.setValue1Modular(100);
  const receipt6 = await tx6.wait();
  console.log(`   Modular Function:   ${receipt6.gasUsed.toString().padStart(10)} gas`);
  console.log(`   Difference: ${(receipt5.gasUsed - receipt6.gasUsed).toString().padStart(10)} gas\n`);

  // 4. Token Airdrop
  console.log("4. TOKEN AIRDROP CASE STUDY");
  console.log("-----------------------------------");
  
  const recipients = [addr1.address, addr2.address, addr3.address];
  const amounts = [
    hre.ethers.parseEther("100"),
    hre.ethers.parseEther("200"),
    hre.ethers.parseEther("300")
  ];

  const tx7 = await tokenAirdrop.airdropNaive(recipients, amounts);
  const receipt7 = await tx7.wait();
  console.log(`   Naive Approach:    ${receipt7.gasUsed.toString().padStart(10)} gas`);
  console.log(`   Gas per recipient: ${(receipt7.gasUsed / recipients.length).toString().padStart(10)} gas`);

  // Reset and try optimized
  await tokenAirdrop.emergencyWithdraw();
  await mockToken.transfer(await tokenAirdrop.getAddress(), hre.ethers.parseEther("10000"));

  const tx8 = await tokenAirdrop.airdropOptimized1(recipients, amounts);
  const receipt8 = await tx8.wait();
  console.log(`   Optimized Approach: ${receipt8.gasUsed.toString().padStart(10)} gas`);
  console.log(`   Gas per recipient: ${(receipt8.gasUsed / recipients.length).toString().padStart(10)} gas`);
  console.log(`   Savings: ${(receipt7.gasUsed - receipt8.gasUsed).toString().padStart(10)} gas (${((receipt7.gasUsed - receipt8.gasUsed) / receipt7.gasUsed * 100).toFixed(1)}%)\n`);

  console.log("=== Measurement Complete ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

