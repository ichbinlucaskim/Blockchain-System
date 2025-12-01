// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TokenAirdrop
 * @notice Case study: Gas-efficient token airdrop implementation
 * @author Lucas Kim
 * 
 * This contract demonstrates two approaches to airdropping tokens:
 * 1. Naive approach: Loop with individual transfers (O(n) with high gas per iteration)
 * 2. Optimized approach: Batch processing with gas optimization techniques
 */
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TokenAirdrop {
    IERC20 public token;
    address public owner;
    
    event AirdropCompleted(address indexed recipient, uint256 amount);
    event BatchAirdropCompleted(uint256 totalRecipients, uint256 totalAmount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }
    
    /**
     * @notice NAIVE APPROACH: Individual transfers in loop
     * @dev Gas cost: O(n) where n = recipients.length
     * Each transfer costs ~21,000 gas base + token contract execution
     * Problem: Can run out of gas for large airdrops
     * Complexity: O(n) with high constant factor
     */
    function airdropNaive(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(token.transfer(recipients[i], amounts[i]), "Transfer failed");
            emit AirdropCompleted(recipients[i], amounts[i]);
        }
    }
    
    /**
     * @notice OPTIMIZED APPROACH 1: Batch with unchecked arithmetic
     * @dev Gas savings:
     * - Unchecked arithmetic saves ~20 gas per iteration
     * - Reduced event emissions (optional)
     * Complexity: Still O(n) but with lower constant factor
     */
    function airdropOptimized1(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        uint256 length = recipients.length;
        uint256 totalAmount = 0;
        
        // Calculate total in unchecked block (saves gas)
        unchecked {
            for (uint256 i = 0; i < length; i++) {
                totalAmount += amounts[i];
            }
        }
        
        // Batch transfer
        for (uint256 i = 0; i < length; ) {
            require(token.transfer(recipients[i], amounts[i]), "Transfer failed");
            unchecked {
                i++;
            }
        }
        
        emit BatchAirdropCompleted(length, totalAmount);
    }
    
    /**
     * @notice OPTIMIZED APPROACH 2: Process in chunks to avoid gas limit
     * @dev Allows processing large airdrops by breaking into smaller batches
     * Complexity: O(n) but can handle arbitrarily large n
     */
    function airdropChunked(
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 chunkSize
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(chunkSize > 0, "Chunk size must be > 0");
        
        uint256 totalLength = recipients.length;
        uint256 processed = 0;
        
        while (processed < totalLength) {
            uint256 end = processed + chunkSize;
            if (end > totalLength) {
                end = totalLength;
            }
            
            // Process chunk
            for (uint256 i = processed; i < end; ) {
                require(token.transfer(recipients[i], amounts[i]), "Transfer failed");
                unchecked {
                    i++;
                }
            }
            
            processed = end;
        }
        
        emit BatchAirdropCompleted(totalLength, 0);
    }
    
    /**
     * @notice Get contract token balance
     */
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
    
    /**
     * @notice Emergency withdraw (if needed)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner, balance), "Withdraw failed");
    }
}
