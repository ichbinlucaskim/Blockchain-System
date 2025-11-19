// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    mapping(bytes32 => uint256) public store;

    function set(bytes32 key, uint256 value) public {
        store[key] = value;
    }

    function get(bytes32 key) public view returns (uint256) {
        return store[key];
    }
}