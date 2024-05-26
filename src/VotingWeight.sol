// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingWeight is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // initialOwner: VerifyGasUsage contract address
    constructor(address initialOwner)
        ERC721("VotingWeight", "VoW")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory uri, uint256 gasUsage) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        // Modified the internal function _increaseBalance()
        _setBalance(to, gasUsage);
    }

    // This will disable all transfers, but will allow minting
    // Approvals has no meaning and can be removed!
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Token is SoulBound!");
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}