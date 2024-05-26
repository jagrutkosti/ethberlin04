import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

export const generateMerkleTree = (leaves) => {
    const tree = StandardMerkleTree.of(leaves, ["address", "uint256"])
    fs.writeFileSync("data/tree.json", JSON.stringify(tree.dump()))
    return tree
}

export const generateMerkleRoot = () => {
    const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("data/tree.json", "utf8")))
    return tree.root
}

export const getProof = (address) => {
    const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("data/tree.json", "utf8")))
    for (const [i, v] of tree.entries()) {
        if (v[0] === address) {
          return tree.getProof(i)
        }
      }
}

export const verifyProof = (root, address, gasUsage, proof) => {
    return StandardMerkleTree.verify(root, ['address', 'uint256'], [address, gasUsage], proof)
}