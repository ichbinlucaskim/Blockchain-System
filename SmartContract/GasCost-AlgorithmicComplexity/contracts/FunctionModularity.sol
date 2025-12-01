// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FunctionModularity
 * @notice Demonstrates gas cost differences between duplicated code vs modular functions
 * @author Lucas Kim
 * 
 * Function calls have overhead (~21 gas base + ~3 gas per parameter)
 * But code duplication increases contract size, which increases deployment cost
 */
contract FunctionModularity {
    uint256 public value1;
    uint256 public value2;
    uint256 public value3;
    
    /**
     * @notice INEFFICIENT: Duplicated logic
     * @dev Each function contains the same validation and processing logic
     * Gas cost: Higher deployment cost due to code duplication
     */
    function setValue1Duplicated(uint256 _value) public {
        require(_value > 0, "Value must be positive");
        require(_value < 1000, "Value too large");
        value1 = _value * 2;
    }
    
    function setValue2Duplicated(uint256 _value) public {
        require(_value > 0, "Value must be positive");
        require(_value < 1000, "Value too large");
        value2 = _value * 2;
    }
    
    function setValue3Duplicated(uint256 _value) public {
        require(_value > 0, "Value must be positive");
        require(_value < 1000, "Value too large");
        value3 = _value * 2;
    }
    
    /**
     * @notice EFFICIENT: Modular design with internal function
     * @dev Validation logic is reused, reducing contract size
     * Gas cost: Lower deployment cost, slight runtime overhead for function call
     */
    function setValue1Modular(uint256 _value) public {
        value1 = _validateAndProcess(_value);
    }
    
    function setValue2Modular(uint256 _value) public {
        value2 = _validateAndProcess(_value);
    }
    
    function setValue3Modular(uint256 _value) public {
        value3 = _validateAndProcess(_value);
    }
    
    /**
     * @notice Internal helper function for validation and processing
     * @dev Internal functions are inlined during compilation, so no runtime overhead
     */
    function _validateAndProcess(uint256 _value) internal pure returns (uint256) {
        require(_value > 0, "Value must be positive");
        require(_value < 1000, "Value too large");
        return _value * 2;
    }
    
    /**
     * @notice Reset all values
     */
    function reset() public {
        value1 = 0;
        value2 = 0;
        value3 = 0;
    }
}
