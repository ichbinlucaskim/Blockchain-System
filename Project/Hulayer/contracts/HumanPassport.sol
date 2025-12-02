// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HumanPassport
 * @dev Soulbound Token (SBT) - Non-transferable NFT that proves human verification
 * 
 * This contract implements a Soulbound Token by overriding transfer functions
 * to prevent transfers. Each token represents a verified human identity.
 */
contract HumanPassport is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    // Mapping from address to token ID
    mapping(address => uint256) private _addressToTokenId;
    
    // Mapping from token ID to World ID nullifier hash
    mapping(uint256 => bytes32) private _tokenToNullifier;
    
    // Mapping from nullifier hash to token ID (prevents duplicate verification)
    mapping(bytes32 => bool) private _nullifierUsed;
    
    // Base URI for token metadata
    string private _baseTokenURI;
    
    event HumanVerified(address indexed human, uint256 indexed tokenId, bytes32 nullifierHash);
    
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _tokenIdCounter = 1;
    }
    
    /**
     * @dev Mint a Human Passport SBT to a verified human
     * @param to The address to mint the token to
     * @param nullifierHash The World ID nullifier hash (prevents duplicate verification)
     */
    function mintHumanPassport(address to, bytes32 nullifierHash) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(!_nullifierUsed[nullifierHash], "Nullifier already used");
        require(_addressToTokenId[to] == 0, "Address already has a passport");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _addressToTokenId[to] = tokenId;
        _tokenToNullifier[tokenId] = nullifierHash;
        _nullifierUsed[nullifierHash] = true;
        
        _safeMint(to, tokenId);
        
        emit HumanVerified(to, tokenId, nullifierHash);
    }
    
    /**
     * @dev Check if an address has a Human Passport
     */
    function hasPassport(address account) external view returns (bool) {
        return _addressToTokenId[account] != 0;
    }
    
    /**
     * @dev Get token ID for an address
     */
    function getTokenId(address account) external view returns (uint256) {
        return _addressToTokenId[account];
    }
    
    /**
     * @dev Get nullifier hash for a token
     */
    function getNullifierHash(uint256 tokenId) external view returns (bytes32) {
        return _tokenToNullifier[tokenId];
    }
    
    /**
     * @dev Override to prevent transfers (Soulbound)
     */
    function transferFrom(address, address, uint256) public pure override {
        revert("HumanPassport: Token is soulbound and cannot be transferred");
    }
    
    /**
     * @dev Override to prevent transfers (Soulbound)
     */
    function safeTransferFrom(address, address, uint256) public pure override {
        revert("HumanPassport: Token is soulbound and cannot be transferred");
    }
    
    /**
     * @dev Override to prevent transfers (Soulbound)
     */
    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("HumanPassport: Token is soulbound and cannot be transferred");
    }
    
    /**
     * @dev Override to prevent approvals (not needed for non-transferable tokens)
     */
    function approve(address, uint256) public pure override {
        revert("HumanPassport: Token is soulbound and cannot be approved");
    }
    
    /**
     * @dev Set base URI for token metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Override base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Total supply of passports
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
}

