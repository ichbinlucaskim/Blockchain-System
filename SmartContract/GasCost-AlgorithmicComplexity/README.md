# Gas Cost and Algorithmic Complexity in EVM-Based Smart Contracts

**Research Project by Lucas Kim**  
Loyola Marymount University

## Overview

This project demonstrates the relationship between algorithmic complexity and gas costs in Ethereum smart contracts. It explores how different data structures, loop patterns, and function designs influence execution efficiency and financial costs on the blockchain.

## Key Features

This project utilizes Hardhat's local network for cost-free testing and gas measurement:

- **Gas Cost Measurement**: Accurate gas difference measurement through test results
- **Zero Cost Testing**: Local blockchain simulation without actual network deployment
- **Virtual Smart Contracts**: Full functionality testing without real Ethereum network

### Sample Measurement Results

```
[Naive Airdrop (10 recipients)] Gas used: 300,243
[Optimized Airdrop (10 recipients)] Gas used: 131,336
Gas savings: 168,907 (56.26% reduction)
```

## Research Objectives

- How does algorithmic complexity translate into financial cost in Ethereum?
- What specific operations (e.g., storage access vs. memory access) cause gas spikes?
- How can smart contracts be written more efficiently to reduce gas consumption?

## Project Structure

```
GasCost-AlgorithmicComPlexity/
├── contracts/              # Solidity smart contracts
│   ├── LoopComparison.sol      # O(n) vs O(1) complexity comparison
│   ├── StorageVsMemory.sol     # Storage vs memory operations
│   ├── FunctionModularity.sol  # Code duplication vs modularity
│   ├── TokenAirdrop.sol        # Case study: Gas-efficient airdrop
│   └── MockERC20.sol           # ERC20 token for testing
├── test/                  # Test files with gas measurements
│   └── GasMeasurement.test.js
├── scripts/               # Deployment and measurement scripts
│   ├── deploy.js
│   └── measureGas.js
├── hardhat.config.js      # Hardhat configuration
└── package.json           # Dependencies
```

## Installation

1. **Install dependencies:**
```bash
cd GasCost-AlgorithmicComPlexity
npm install
```

2. **Compile contracts:**
```bash
npm run compile
```

## Usage

### Running Tests with Gas Measurement

Run the comprehensive test suite that measures gas costs for all comparisons:

```bash
npm test
```

**Expected output:**
```
✔ Should demonstrate O(n) vs O(1) complexity
[Initialize Precomputed Sum] Gas used: 303,191
[O(1) Precomputed Sum] Value: 4950

✔ Should measure gas for storage operations
[Storage Operations] Gas used: 278,301

✔ Should measure gas for memory operations
[Memory Operations] Gas used: 414,400

✔ Should compare airdrop approaches
[Naive Airdrop] Gas used: 300,243
[Optimized Airdrop] Gas used: 131,336
Gas savings: 168,907 (56.26%)
```

For detailed gas reporting:

```bash
npm run test:gas
```

### Local Network Deployment

1. **Start a local Hardhat node:**
```bash
npm run node
```

2. **In a separate terminal, deploy contracts:**
```bash
npm run deploy:local
```

3. **Run gas measurement script:**
```bash
npx hardhat run scripts/measureGas.js --network localhost
```

## Contract Descriptions

### 1. LoopComparison.sol

Demonstrates the gas cost difference between:
- **O(n) operations**: Linear search through arrays
- **O(1) operations**: Constant-time lookups using mappings

**Key Findings:**
- Array iteration: Gas cost scales linearly with array size
- Mapping access: Constant gas cost regardless of data size
- Pre-computation: One-time cost vs. repeated computation

### 2. StorageVsMemory.sol

Compares gas costs of:
- **Storage operations**: Persistent on-chain storage (~20,000 gas for first write)
- **Memory operations**: Temporary computation (~3 gas per word)

**Key Findings:**
- Storage writes are approximately 6,000x more expensive than memory writes
- Batch memory operations, then write to storage once
- Copy arrays to memory before iteration to save gas

### 3. FunctionModularity.sol

Examines:
- **Code duplication**: Repeated logic in multiple functions
- **Modular design**: Reusable internal functions

**Key Findings:**
- Code duplication increases deployment cost (contract size)
- Internal functions are inlined (no runtime overhead)
- Modular design reduces contract size and improves maintainability

### 4. TokenAirdrop.sol

Case study comparing:
- **Naive approach**: Individual transfers in a loop
- **Optimized approach**: Batch processing with gas optimizations
- **Chunked approach**: Processing large datasets in batches

**Key Findings:**
- Batch processing reduces gas per transaction
- Unchecked arithmetic saves approximately 20 gas per iteration
- Chunked processing handles arbitrarily large airdrops
- **Measured result: 56.26% gas reduction for 10 recipients**

## Gas Cost Analysis

### Typical Gas Costs (approximate)

| Operation | Gas Cost |
|-----------|----------|
| Storage write (first time) | ~20,000 |
| Storage write (subsequent) | ~5,000 |
| Storage read | ~2,100 |
| Memory write | ~3 |
| Memory read | ~3 |
| Function call | ~21 + 3 per parameter |
| Loop iteration | ~10-50 (depends on operations) |

### Complexity to Gas Translation

- **O(1)**: Constant gas cost (e.g., mapping access)
- **O(n)**: Linear gas cost (e.g., array iteration)
- **O(n²)**: Quadratic gas cost (e.g., nested loops)

## Key Takeaways

1. Use mappings for O(1) lookups instead of arrays when possible
2. Minimize storage operations - batch memory operations first
3. Pre-compute values when they're accessed frequently
4. Use unchecked arithmetic in safe loops to save gas
5. Modularize code to reduce contract size (deployment cost)
6. Batch operations to reduce transaction overhead

## Testing Methods

### Method 1: Hardhat Tests (Recommended)

```bash
npm test
```

- Zero cost execution
- Accurate gas difference measurement
- Fast execution time

### Method 2: Local Hardhat Node

```bash
# Terminal 1
npm run node

# Terminal 2
npm run deploy:local
npx hardhat run scripts/measureGas.js --network localhost
```

- Zero cost execution
- Realistic blockchain environment simulation
- Detailed gas measurement

### Method 3: Testnet Deployment (Optional)

To deploy on a testnet (e.g., Sepolia):

1. Create a `.env` file:
```
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
```

2. Deploy:
```bash
npm run deploy:sepolia
```

**Note**: Testnets are free, but actual gas fees are consumed (testnet ETH can be obtained for free).

## Measurement Results

When executing the project, the following gas cost differences can be observed:

### Loop Operations
- **O(n) Linear Search**: ~50,000+ gas (proportional to array size)
- **O(1) Constant Lookup**: ~2,000 gas (constant time)

### Storage vs Memory
- **Storage Operations (10 elements)**: ~278,000 gas
- **Memory Operations (10 elements)**: ~414,000 gas (includes copy cost, but advantageous for repeated operations)

### Token Airdrop
- **Naive Approach (10 recipients)**: 300,243 gas
- **Optimized Approach (10 recipients)**: 131,336 gas
- **Savings**: 168,907 gas (56.26% reduction)

## Research Methodology

1. **Code-level comparisons**: Identical logic written in different ways
2. **Gas measurement**: Deploy on local network and measure actual gas usage
3. **Complexity analysis**: Relate Big-O notation to gas costs
4. **Optimization techniques**: Demonstrate practical gas-saving strategies

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

## Future Work

- Additional complexity patterns (O(log n), O(n log n))
- More sophisticated optimization techniques
- Gas cost prediction models
- Automated gas optimization tools

## License

MIT

## Author

Lucas Kim - Loyola Marymount University

---

## Important Notes

- This project is for educational and research purposes only
- Always audit smart contracts before deploying to mainnet
- Local testing is completely free and provides accurate gas difference measurements

---

**Execute `npm test` to observe actual gas cost differences.**
