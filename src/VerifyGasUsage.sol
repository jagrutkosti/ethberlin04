// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VerifyGasUsage is Ownable {
    bytes32 private _root;
    address private _sbtAddress; 

    mapping(address user => bool) private _hasClaimed;

    constructor(bytes32 root_) Ownable(msg.sender) {
        _root = root_;
    }

    function verify(
        bytes32[] memory proof,
        address addr,
        uint256 gasUsage,
        string memory uri
    ) public {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(addr, gasUsage))));
        require(MerkleProof.verify(proof, _root, leaf), "Invalid proof. Please check you have submitted correct gasUsage");
        require(_hasClaimed[addr] == false, "SBT for the given address is already claimed");
        require(_sbtAddress != address(0), "SBT address is not yet set by the owner");

        IVotingWeight sbt = IVotingWeight(_sbtAddress);
        sbt.safeMint(addr, uri, gasUsage);
    }

    function sbtAddress(address addr) public onlyOwner {
        _sbtAddress = addr;
    }
}

interface IVotingWeight {
    function safeMint(address to, string memory uri, uint256 gasUsage) external;
}