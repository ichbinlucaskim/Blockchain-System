# Quick Start Guide

## Prerequisites

- **Gas Difference Measurement**: Clear gas cost differences observable in test results
- **Zero Cost Testing**: Hardhat local network usage (no actual blockchain required)
- **Virtual Smart Contracts**: Full functionality without real Ethereum network

## Installation

```bash
cd GasCost-AlgorithmicComPlexity
npm install
```

## Compilation

```bash
npm run compile
```

## Running Tests with Gas Measurement

```bash
npm test
```

**Sample output:**
```
✔ Should demonstrate O(n) vs O(1) complexity
[Initialize Precomputed Sum] Gas used: 303191
[O(1) Precomputed Sum] Value: 4950

✔ Should measure gas for storage operations
[Storage Operations] Gas used: 278301

✔ Should measure gas for memory operations
[Memory Operations] Gas used: 414400

✔ Should compare airdrop approaches
[Naive Airdrop (10 recipients)] Gas used: 300243
[Optimized Airdrop (10 recipients)] Gas used: 131336
Gas savings: 168907 (56.26% reduction)

12 passing (591ms)
```

## Local Network Detailed Measurement

**Terminal 1: Start local Hardhat node**
```bash
npm run node
```

**Terminal 2: Deploy contracts**
```bash
npm run deploy:local
```

**Terminal 2: Run gas measurement script**
```bash
npx hardhat run scripts/measureGas.js --network localhost
```

## Key Experiments

### Experiment 1: Loop Complexity Comparison

- Compare `linearSearch()` vs `constantTimeLookup()` in `LoopComparison.sol`
- Observe O(n) vs O(1) gas cost differences
- **Result**: O(n) scales with array size, O(1) is constant time

### Experiment 2: Storage vs Memory

- Compare `processWithStorage()` vs `processWithMemory()` in `StorageVsMemory.sol`
- Observe storage write cost differences
- **Result**: Storage ~20,000 gas, Memory ~3 gas

### Experiment 3: Function Modularity

- Compare duplicated vs modularized functions in `FunctionModularity.sol`
- Observe deployment cost differences
- **Result**: Modularization reduces deployment costs

### Experiment 4: Token Airdrop Case Study

- Compare naive vs optimized approaches in `TokenAirdrop.sol`
- Gas optimization in real-world use case
- **Result**: 56.26% gas reduction for 10 recipients

## Expected Results

The following gas cost comparisons can be observed when running tests:

| Experiment | Method | Gas Cost | Notes |
|------------|--------|----------|-------|
| Loop | O(n) Linear Search | ~50,000+ | Proportional to array size |
| Loop | O(1) Constant Lookup | ~2,000 | Constant time |
| Storage | Storage Operations (10 elements) | ~278,000 | Expensive |
| Memory | Memory Operations (10 elements) | ~414,000 | Includes copy cost |
| Airdrop | Naive (10 recipients) | 300,243 | Inefficient |
| Airdrop | Optimized (10 recipients) | 131,336 | 56.26% reduction |

## Gas Difference Verification Methods

### Method 1: Test Execution (Simplest)

```bash
npm test
```

- Zero cost execution
- Clear gas difference measurement
- Fast execution (approximately 1 second)

### Method 2: Local Network (More Detailed)

```bash
# Terminal 1
npm run node

# Terminal 2
npx hardhat run scripts/measureGas.js --network localhost
```

- Zero cost execution
- Realistic blockchain environment simulation
- Detailed gas measurement

## Troubleshooting

### Compilation Errors

```bash
# Verify Solidity version (0.8.20)
npm install
npm run compile
```

### Test Failures

```bash
# Verify Hardhat node is running
# Check network configuration
npm test
```

### Gas Measurement Issues

```bash
# Verify hardhat-gas-reporter package
npm install hardhat-gas-reporter --save-dev
```

## Getting Started

Execute the following commands:

```bash
cd GasCost-AlgorithmicComPlexity
npm install
npm run compile
npm test
```

**All operations are free and provide clear gas cost difference measurements.**
