import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'

export const generateMerkleTree = (leaves) => {
    return new MerkleTree(leaves, keccak256, { hashLeaves: true })
}

export const generateMerkleRoot = (tree) => {
    return tree.getRoot().toString('hex')
}

export const getProof = (tree, leaf) => {
    leaf = keccak256(leaf)
    return tree.getProof(leaf)
}

export const verifyProof = (leaf, root, proof, tree) => {
    leaf = keccak256(leaf)
    return tree.verify(proof, leaf, root)
}