// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StorageVsMemory
 * @notice Demonstrates gas cost differences between storage and memory operations
 * @author Lucas Kim
 * 
 * Storage operations are expensive (SSTORE: 20,000 gas for first write, 5,000 for subsequent)
 * Memory operations are cheap (MSTORE: 3 gas per word)
 */
contract StorageVsMemory {
    uint256[] public storageArray;
    uint256 public storageCounter;
    
    constructor() {
        // Initialize storage array
        for (uint256 i = 0; i < 50; i++) {
            storageArray.push(i);
        }
    }
    
    /**
     * @notice EXPENSIVE: Multiple storage writes
     * @dev Each storage write costs ~20,000 gas (first write) or ~5,000 gas (subsequent)
     * Complexity: O(n) with high constant factor due to storage operations
     */
    function processWithStorage(uint256[] calldata input) public {
        for (uint256 i = 0; i < input.length; i++) {
            storageArray.push(input[i]); // Storage write: ~20,000 gas
            storageCounter++; // Storage write: ~5,000 gas
        }
    }
    
    /**
     * @notice CHEAP: Process in memory, single storage write at end
     * @dev Memory operations cost ~3 gas per word
     * Complexity: O(n) but with much lower constant factor
     */
    function processWithMemory(uint256[] calldata input) public {
        uint256[] memory tempArray = new uint256[](storageArray.length + input.length);
        uint256 memoryCounter = storageCounter;
        
        // Copy existing array to memory
        for (uint256 i = 0; i < storageArray.length; i++) {
            tempArray[i] = storageArray[i]; // Memory write: ~3 gas
        }
        
        // Process new elements in memory
        for (uint256 i = 0; i < input.length; i++) {
            tempArray[storageArray.length + i] = input[i]; // Memory write: ~3 gas
            memoryCounter++; // Memory operation: ~3 gas
        }
        
        // Single storage write at the end
        storageArray = tempArray; // Storage write: ~20,000 gas (but only once!)
        storageCounter = memoryCounter; // Storage write: ~5,000 gas
    }
    
    /**
     * @notice EXPENSIVE: Multiple storage reads in loop
     * @dev Each storage read costs ~2,100 gas
     */
    function sumStorageArray() public view returns (uint256 sum) {
        sum = 0;
        for (uint256 i = 0; i < storageArray.length; i++) {
            sum += storageArray[i]; // Storage read: ~2,100 gas per read
        }
        return sum;
    }
    
    /**
     * @notice CHEAP: Copy to memory first, then read from memory
     * @dev Memory reads cost ~3 gas per word
     */
    function sumMemoryArray() public view returns (uint256 sum) {
        uint256[] memory memArray = storageArray; // Copy to memory: one-time cost
        sum = 0;
        for (uint256 i = 0; i < memArray.length; i++) {
            sum += memArray[i]; // Memory read: ~3 gas per read
        }
        return sum;
    }
    
    /**
     * @notice Reset storage array (for testing)
     */
    function reset() public {
        delete storageArray;
        storageCounter = 0;
    }
}
