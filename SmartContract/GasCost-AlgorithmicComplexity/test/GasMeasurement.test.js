const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas Cost and Algorithmic Complexity Analysis", function () {
  let loopComparison, storageVsMemory, functionModularity, tokenAirdrop, mockToken;
  let owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy contracts
    const LoopComparison = await ethers.getContractFactory("LoopComparison");
    loopComparison = await LoopComparison.deploy();

    const StorageVsMemory = await ethers.getContractFactory("StorageVsMemory");
    storageVsMemory = await StorageVsMemory.deploy();

    const FunctionModularity = await ethers.getContractFactory("FunctionModularity");
    functionModularity = await FunctionModularity.deploy();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("Test Token", "TEST", ethers.parseEther("1000000"));

    const TokenAirdrop = await ethers.getContractFactory("TokenAirdrop");
    tokenAirdrop = await TokenAirdrop.deploy(await mockToken.getAddress());

    // Fund airdrop contract
    await mockToken.transfer(await tokenAirdrop.getAddress(), ethers.parseEther("100000"));
  });

  describe("Loop Comparison: O(n) vs O(1)", function () {
    it("Should demonstrate O(n) vs O(1) complexity", async function () {
      const target = 50;
      
      // Note: View functions don't cost gas, but we can see the computational difference
      // In a real scenario, these would be called within state-changing functions
      const result1 = await loopComparison.linearSearch(target);
      const result2 = await loopComparison.constantTimeLookup(target);
      
      console.log(`\n[O(n) Linear Search] Result: found=${result1[0]}, index=${result1[1]}`);
      console.log(`[O(1) Constant-time Lookup] Result: found=${result2[0]}, value=${result2[1]}`);
      console.log("Note: View functions don't cost gas, but O(n) operations are more expensive when called in state-changing functions");
    });

    it("Should compare sum operations with gas measurement", async function () {
      // Initialize precomputed sum (state-changing, costs gas)
      const tx1 = await loopComparison.initializePrecomputedSum();
      const receipt1 = await tx1.wait();
      console.log(`\n[Initialize Precomputed Sum] Gas used: ${receipt1.gasUsed.toString()}`);
      
      // Get precomputed sum (view function, but demonstrates O(1) access)
      const sum1 = await loopComparison.getPrecomputedSum();
      console.log(`[O(1) Precomputed Sum] Value: ${sum1.toString()}`);
      
      // Note: sumArrayLoop is a view function, so we can't measure gas directly
      // But in practice, if this were called in a state-changing function,
      // it would cost O(n) gas proportional to array length
      const sum2 = await loopComparison.sumArrayLoop();
      console.log(`[O(n) Sum Array Loop] Value: ${sum2.toString()}`);
      console.log("In a state-changing function, O(n) would cost significantly more gas");
    });
  });

  describe("Storage vs Memory Operations", function () {
    it("Should measure gas for storage operations", async function () {
      const input = Array.from({ length: 10 }, (_, i) => i + 100);
      const tx = await storageVsMemory.processWithStorage(input);
      const receipt = await tx.wait();
      console.log(`\n[Storage Operations] Gas used: ${receipt.gasUsed.toString()}`);
    });

    it("Should measure gas for memory operations", async function () {
      const input = Array.from({ length: 10 }, (_, i) => i + 100);
      const tx = await storageVsMemory.processWithMemory(input);
      const receipt = await tx.wait();
      console.log(`[Memory Operations] Gas used: ${receipt.gasUsed.toString()}`);
    });

    it("Should compare storage read vs memory read patterns", async function () {
      // Note: These are view functions, but demonstrate the pattern
      // In state-changing functions, storage reads cost ~2,100 gas vs ~3 gas for memory
      const sum1 = await storageVsMemory.sumStorageArray();
      const sum2 = await storageVsMemory.sumMemoryArray();
      
      console.log(`\n[Storage Reads Pattern] Sum: ${sum1.toString()}`);
      console.log(`[Memory Reads Pattern] Sum: ${sum2.toString()}`);
      console.log("Storage reads cost ~2,100 gas each, memory reads cost ~3 gas each");
      console.log("For large arrays, copying to memory first saves significant gas");
    });
  });

  describe("Function Modularity: Duplication vs Reusability", function () {
    it("Should measure gas for duplicated functions", async function () {
      const tx1 = await functionModularity.setValue1Duplicated(100);
      const receipt1 = await tx1.wait();
      console.log(`\n[Duplicated Function 1] Gas used: ${receipt1.gasUsed.toString()}`);

      const tx2 = await functionModularity.setValue2Duplicated(200);
      const receipt2 = await tx2.wait();
      console.log(`[Duplicated Function 2] Gas used: ${receipt2.gasUsed.toString()}`);

      const tx3 = await functionModularity.setValue3Duplicated(300);
      const receipt3 = await tx3.wait();
      console.log(`[Duplicated Function 3] Gas used: ${receipt3.gasUsed.toString()}`);
    });

    it("Should measure gas for modular functions", async function () {
      const tx1 = await functionModularity.setValue1Modular(100);
      const receipt1 = await tx1.wait();
      console.log(`\n[Modular Function 1] Gas used: ${receipt1.gasUsed.toString()}`);

      const tx2 = await functionModularity.setValue2Modular(200);
      const receipt2 = await tx2.wait();
      console.log(`[Modular Function 2] Gas used: ${receipt2.gasUsed.toString()}`);

      const tx3 = await functionModularity.setValue3Modular(300);
      const receipt3 = await tx3.wait();
      console.log(`[Modular Function 3] Gas used: ${receipt3.gasUsed.toString()}`);
    });
  });

  describe("Token Airdrop Case Study", function () {
    it("Should measure gas for naive airdrop approach", async function () {
      const recipients = [addr1.address, addr2.address, addr3.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        ethers.parseEther("300")
      ];

      const tx = await tokenAirdrop.airdropNaive(recipients, amounts);
      const receipt = await tx.wait();
      console.log(`\n[Naive Airdrop (3 recipients)] Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`Gas per recipient: ${Number(receipt.gasUsed) / recipients.length}`);
    });

    it("Should measure gas for optimized airdrop approach", async function () {
      const recipients = [addr1.address, addr2.address, addr3.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200"),
        ethers.parseEther("300")
      ];

      const tx = await tokenAirdrop.airdropOptimized1(recipients, amounts);
      const receipt = await tx.wait();
      console.log(`\n[Optimized Airdrop (3 recipients)] Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`Gas per recipient: ${Number(receipt.gasUsed) / recipients.length}`);
    });

    it("Should compare airdrop approaches with larger datasets", async function () {
      // Create larger dataset
      const recipients = [];
      const amounts = [];
      for (let i = 0; i < 10; i++) {
        recipients.push((await ethers.getSigners())[i % 10].address);
        amounts.push(ethers.parseEther("100"));
      }

      // Reset balances first
      await tokenAirdrop.emergencyWithdraw();
      await mockToken.transfer(await tokenAirdrop.getAddress(), ethers.parseEther("10000"));

      const tx1 = await tokenAirdrop.airdropNaive(recipients, amounts);
      const receipt1 = await tx1.wait();
      console.log(`\n[Naive Airdrop (10 recipients)] Gas used: ${receipt1.gasUsed.toString()}`);

      // Reset and try optimized
      await tokenAirdrop.emergencyWithdraw();
      await mockToken.transfer(await tokenAirdrop.getAddress(), ethers.parseEther("10000"));

      const tx2 = await tokenAirdrop.airdropOptimized1(recipients, amounts);
      const receipt2 = await tx2.wait();
      console.log(`[Optimized Airdrop (10 recipients)] Gas used: ${receipt2.gasUsed.toString()}`);

      const gasDifference = receipt1.gasUsed - receipt2.gasUsed;
      console.log(`Gas savings: ${gasDifference.toString()} (${(Number(gasDifference) / Number(receipt1.gasUsed) * 100).toFixed(2)}%)`);
    });

    it("Should demonstrate chunked airdrop for large datasets", async function () {
      const recipients = [];
      const amounts = [];
      for (let i = 0; i < 20; i++) {
        recipients.push((await ethers.getSigners())[i % 10].address);
        amounts.push(ethers.parseEther("50"));
      }

      await tokenAirdrop.emergencyWithdraw();
      await mockToken.transfer(await tokenAirdrop.getAddress(), ethers.parseEther("20000"));

      const tx = await tokenAirdrop.airdropChunked(recipients, amounts, 5);
      const receipt = await tx.wait();
      console.log(`\n[Chunked Airdrop (20 recipients, chunk size 5)] Gas used: ${receipt.gasUsed.toString()}`);
    });
  });

  describe("Complexity Analysis Summary", function () {
    it("Should provide comprehensive gas cost analysis", async function () {
      console.log("\n=== GAS COST AND COMPLEXITY ANALYSIS SUMMARY ===");
      console.log("\n1. Loop Operations:");
      console.log("   - O(n) operations scale linearly with input size");
      console.log("   - O(1) operations have constant gas cost");
      console.log("   - Use mappings for O(1) lookups when possible");
      
      console.log("\n2. Storage vs Memory:");
      console.log("   - Storage operations: ~20,000 gas (first write), ~5,000 (subsequent)");
      console.log("   - Memory operations: ~3 gas per word");
      console.log("   - Batch memory operations, minimize storage writes");
      
      console.log("\n3. Function Design:");
      console.log("   - Code duplication increases deployment cost");
      console.log("   - Modular functions reduce contract size");
      console.log("   - Internal functions are inlined (no runtime overhead)");
      
      console.log("\n4. Token Airdrop Optimization:");
      console.log("   - Batch processing reduces gas per transaction");
      console.log("   - Unchecked arithmetic saves ~20 gas per iteration");
      console.log("   - Chunked processing handles large datasets");
      
      console.log("\n=== END OF ANALYSIS ===\n");
    });
  });
});

