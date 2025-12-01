// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LoopComparison
 * @notice Demonstrates gas cost differences between O(n) and O(1) operations
 * @author Lucas Kim
 */
contract LoopComparison {
    uint256[] public array;
    mapping(uint256 => uint256) public valueMap;
    
    constructor() {
        // Initialize with sample data
        for (uint256 i = 0; i < 100; i++) {
            array.push(i);
            valueMap[i] = i;
        }
    }
    
    /**
     * @notice O(n) complexity: Linear search through array
     * @dev Gas cost increases linearly with array size
     * @param target Value to find
     * @return found Whether the value was found
     * @return index Index where value was found (if found)
     */
    function linearSearch(uint256 target) public view returns (bool found, uint256 index) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == target) {
                return (true, i);
            }
        }
        return (false, 0);
    }
    
    /**
     * @notice O(1) complexity: Direct mapping access
     * @dev Gas cost is constant regardless of data size
     * @param target Value to find
     * @return found Whether the value exists
     * @return value The value at the key
     */
    function constantTimeLookup(uint256 target) public view returns (bool found, uint256 value) {
        // Check if key exists (mapping returns 0 for non-existent keys)
        // In production, you'd use a separate existence mapping
        if (valueMap[target] == target && target < 100) {
            return (true, valueMap[target]);
        }
        return (false, 0);
    }
    
    /**
     * @notice O(n) complexity: Sum array elements using loop
     * @dev Gas cost: O(n) - each iteration costs gas
     */
    function sumArrayLoop() public view returns (uint256 sum) {
        sum = 0;
        for (uint256 i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum;
    }
    
    /**
     * @notice O(1) complexity: Pre-computed sum stored in storage
     * @dev Gas cost: O(1) - single storage read
     */
    uint256 private precomputedSum;
    
    function initializePrecomputedSum() public {
        uint256 sum = 0;
        for (uint256 i = 0; i < array.length; i++) {
            sum += array[i];
        }
        precomputedSum = sum;
    }
    
    function getPrecomputedSum() public view returns (uint256) {
        return precomputedSum;
    }
    
    /**
     * @notice Add element to array (O(1) operation)
     */
    function addElement(uint256 value) public {
        array.push(value);
        valueMap[value] = value;
    }
}
